import { ref,watch } from 'vue';
import { storageService } from '@/services/storage/storageService';
export const showResult = ref(false);

//------------------api Test------------------//    
import { useChat } from '@/composables/useChat';
import { useChatPolling } from '@/composables/useChatPolling';


interface ChatConfig {
    apiKey: string
    botId: (string)[]
    message: string
}
  
export const chatConfig = ref<ChatConfig>({
apiKey: 'pat_DdQD93S1Vy2WBf0KZdOJ1ob5U9GzeR2Yjmkzaj5xVBq7EAAwd6OmSLKRmMnI4WYw',
botId: [
    '7449786123129847845',    //教案
    '7463464443028963340',    //思维导图

    '7470802643641008180',      //练习题
    '7470499360309723155',       //课件
    '7471291204710219812'        //视频
    ],  
message: '# 课程大纲\n- 课程主题：小学语文课《杨氏之子》\n- 课程目标：\n  - 让学生开始接触文言文，对文言文有一个初步的认识。\n  - 帮助学生理解古文的意思。\n  - 让学生感受到故事中人物语言的风趣机智。\n- 课程内容：\n  - 章节 1：朗读课文，根据注释说说课文的大意。\n  - 章节 2：体会杨氏之子的聪慧机智，感受文言文的语言魅力。\n  - 章节 3：拓展阅读，了解《世说新语》。\n- 课程总结：总结本节课的学习内容，强调文言文的学习方法和重要性。'
})

const { error: chatError, sendMessage } = useChat();  // 从 useChat composable 中导入 error 和 sendMessage方法
export const {                                               // 从 useChatPolling composable 中导入以下属性和方法
  currentResponse: response,
  chatMessages,
  isPolling,
  error: pollingError,
  startPolling
} = useChatPolling();



let unwatch: (() => void) | null = null; // 模块级变量，保存停止函数

export const handleSubmit = async (sessionId: string, step: number) => {
    if (sessionId !== "-1") {
        // 保存用户消息
        await storageService.updateMessages(sessionId, {
            role: 'user',
            content: chatConfig.value.message
        });

        if (!chatConfig.value.apiKey || !chatConfig.value.message) {
            console.log('chatConfig not complete');
            return;
        }

        try {
            const initialResponse = await sendMessage(
                chatConfig.value.apiKey, 
                chatConfig.value.botId[step], 
                chatConfig.value.message
            );
            await startPolling(chatConfig.value.apiKey, initialResponse);

            // 清理之前的 watcher
            if (unwatch) {
                unwatch();
                unwatch = null;
            }

            const currentStep = step; // 通过闭包捕获当前 step
            unwatch = watch(() => chatMessages.value, async (newMessages) => {
                if (newMessages?.data) {
                    console.log('newMessages:', newMessages)
                    const lastMessage = newMessages.data.find(msg => 
                        (msg.type === 'answer' && msg.content_type === 'text')) || newMessages.data[0];
                    if (lastMessage.role === 'assistant') {
                        await storageService.updateMessages(sessionId, {
                            role: 'assistant',
                            content: lastMessage.content
                        });

                        switch (currentStep) { // 使用闭包中的 currentStep
                            case 0:
                                await storageService.updateTeachingPlan(sessionId, {
                                    text: lastMessage.content,
                                });
                                break;
                            case 1:
                                await storageService.updateTeachingMindMap(sessionId, {
                                    url: lastMessage.content,
                                });
                                break;
                            
                            default:
                                break;
                        }

                        // 处理完成后，停止本次 watcher
                        if (unwatch) {
                            unwatch();
                            unwatch = null;
                        }
                    }
                }
            }, { deep: true });

            return storageService.getSessionData(sessionId) || null;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
};


export const handleSubmitParallel = async (sessionId: string, botIndices: number[]) => {
    if (sessionId === "-1" || !chatConfig.value.apiKey || !chatConfig.value.message) {
        console.log('chatConfig not complete');
        return null;
    }

    try {
        // 创建响应存储对象
        const responses = {
            exercises: null as string | null,
            Courseware: null as string | null,
            videos: null as string | null
        };

        // 并行处理每个 bot 的请求
        const promises = botIndices.map(async (botIndex) => {
            return new Promise<void>(async (resolve) => {
                const initialResponse = await sendMessage(
                    chatConfig.value.apiKey,
                    chatConfig.value.botId[botIndex],
                    chatConfig.value.message
                );

                let stopWatch = watch(() => chatMessages.value, async (newMessages) => {
                    if (newMessages?.data) {
                        const lastMessage = newMessages.data.find(msg => 
                            msg.type === 'answer' && msg.content_type === 'text'
                        );

                        if (lastMessage?.role === 'assistant') {
                            // 根据 botIndex 存储对应的响应

                            console.log('lastMessage:', lastMessage)
                            console.log('botIndex:', botIndex)
                            switch (botIndex) {
                                case 2:
                                    responses.exercises = lastMessage.content;
                                    break;
                                case 3:
                                    responses.Courseware = lastMessage.content;
                                    break;
                                case 4:
                                    responses.videos = lastMessage.content;
                                    break;
                            }

                            stopWatch();
                            resolve();
                        }
                    }
                }, { deep: true });

                await startPolling(chatConfig.value.apiKey, initialResponse);
            });
        });

        // 等待所有响应完成
        await Promise.all(promises);

        // 检查是否所有响应都收到
        if (responses.exercises && responses.Courseware && responses.videos) {
            // 一次性更新所有资源
            await storageService.updateCourseware(sessionId, {
                exercises: [{ 
                    name: 'exercise1',
                    url: responses.exercises 
                }],
                Courseware: [{ 
                    name: 'courseware1',
                    url: responses.Courseware 
                }],
                videos: [{ 
                    name: 'video1',
                    url: responses.videos 
                }]
            });

            return await storageService.getSessionData(sessionId);
        }

        console.error('Not all responses received.');
        return null;
    } catch (err) {
        console.error('Parallel submission error:', err);
        return null;
    }
};
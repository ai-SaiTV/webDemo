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
message: ''
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
                            case 2:
                                await storageService.updateCourseware(sessionId, {
                                    // exercises: [{ name: 'exercise1', url: lastMessage.content }],
                                    videos: [{ name: 'video1', url: lastMessage.content }],
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
        console.log('Invalid session or config');
        return null;
    }

    try {
        // 创建所有 bot 的请求数组
        const botRequests = botIndices.map(async (botIndex) => {
            const initialResponse = await sendMessage(
                chatConfig.value.apiKey,
                chatConfig.value.botId[botIndex],
                chatConfig.value.message
            );
            return { botIndex, response: initialResponse };
        });

        // 并行执行所有请求
        const responses = await Promise.all(botRequests);

        // 为每个响应创建轮询
        const pollRequests = responses.map(({ botIndex, response }) => {
            return new Promise<void>(async (resolve) => {
                let stopWatch = watch(() => chatMessages.value, async (newMessages) => {
                    if (newMessages?.data) {
                        const lastMessage = newMessages.data.find(msg => 
                            (msg.type === 'answer' && msg.content_type === 'text')) || newMessages.data[0];
                        
                        if (lastMessage.role === 'assistant') {
                            // 更新消息
                            await storageService.updateMessages(sessionId, {
                                role: 'assistant',
                                content: lastMessage.content
                            });

                            // 根据不同的 bot 更新不同的资源
                            switch (botIndex) {
                                case 2: // 练习题
                                    await storageService.updateCourseware(sessionId, {
                                        exercises: [{ name: 'exercise1', url: lastMessage.content }]
                                    });
                                    break;
                                case 3: // 课件
                                    await storageService.updateCourseware(sessionId, {
                                        images: [{ name: 'courseware1', url: lastMessage.content }]
                                    });
                                    break;
                                case 4: // 视频
                                    await storageService.updateCourseware(sessionId, {
                                        videos: [{ name: 'video1', url: lastMessage.content }]
                                    });
                                    break;
                            }

                            // 停止监听并解析 Promise
                            stopWatch();
                            resolve();
                        }
                    }
                }, { deep: true });

                // 开始轮询
                await startPolling(chatConfig.value.apiKey, response);
            });
        });

        // 等待所有轮询完成
        await Promise.all(pollRequests);

        // 返回更新后的会话数据
        return await storageService.getSessionData(sessionId);
        
    } catch (err) {
        console.error('Parallel submission error:', err);
        return null;
    }
};
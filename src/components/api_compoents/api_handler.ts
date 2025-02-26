//       _____                    _____                    _____                    _____          
//      |\    \                  /\    \                  /\    \                  /\    \         
//      |:\____\                /::\    \                /::\    \                /::\____\        
//      |::|   |                \:::\    \              /::::\    \              /::::|   |        
//      |::|   |                 \:::\    \            /::::::\    \            /:::::|   |        
//      |::|   |                  \:::\    \          /:::\/:::\    \          /::::::|   |        
//      |::|   |                   \:::\    \        /:::/__\:::\    \        /:::/|::|   |        
//      |::|   |                   /::::\    \      /::::\   \:::\    \      /:::/ |::|   |        
//      |::|___|______    ____    /::::::\    \    /::::::\   \:::\    \    /:::/  |::|   | _____  
//      /::::::::\    \  /\   \  /:::\/:::\    \  /:::\/:::\   \:::\    \  /:::/   |::|   |/\    \ 
//     /::::::::::\____\/::\   \/:::/  \:::\____\/:::/  \:::\   \:::\____\/:: /    |::|   /::\____\
//    /:::/~~~~/~~      \:::\  /:::/    \::/    /\::/    \:::\  /:::/    /\::/    /|::|  /:::/    /
//   /:::/    /          \:::\/:::/    / \/____/  \/____/ \:::\/:::/    /  \/____/ |::| /:::/    / 
//  /:::/    /            \::::::/    /                    \::::::/    /           |::|/:::/    /  
// /:::/    /              \::::/____/                      \::::/    /            |::::::/    /   
// \::/    /                \:::\    \                      /:::/    /             |:::::/    /    
//  \/____/                  \:::\    \                    /:::/    /               /:::/    /     
//                            \:::\____\                  /:::/    /               /:::/    /      
//                             \::/    /                  \::/    /                \::/    /     
//                              \/____/                    \/____/                  \/____/      

import { ref,watch } from '@vue/runtime-core';
import { storageService } from '@/services/storage/storageService';
import { analysisRes } from '@/types/analysisRes';
export const showResult = ref(false);

//api import
import { config } from '@/config/config';
import { useChat } from '@/composables/useChat';
import { useChatPolling } from '@/composables/useChatPolling';
import { Message } from 'postcss';
import { sessionId } from '../Dash_compoents/DashCompoents';
import { analysisResService, analysisService } from '@/services/storage/analysisResService';


interface ChatConfig {
    apiKey: string
    botId: (string)[]
    message: string
}
  
export const chatConfig = ref<ChatConfig>({
apiKey: config.apiKey,
botId: [
    '7449786123129847845',    //0教案
    '7472417501348069414',    //1课堂设计
    '7463464443028963340',    //2思维导图

    '7470802643641008180',      //3练习题
    '7470499360309723155',       //4课件
    '7471291204710219812',        //5视频

    '7475365585602773055',   //6学情分析
    ],  
message: ''
})

const {sendMessage } = useChat();  // 从 useChat composable 中导入 error 和 sendMessage方法
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
                    interface ChatMessage {
                        type?: string;
                        content_type?: string;
                        role?: string;
                        content?: string;
                    }
                    
                    const lastMessage: ChatMessage = newMessages.data.find((msg: ChatMessage) => 
                        (msg.type === 'answer' && msg.content_type === 'text')) || newMessages.data[0];
                    if (lastMessage.role === 'assistant') {
                        await storageService.updateMessages(sessionId, {
                            role: 'assistant',
                            content: lastMessage.content || ''
                        });

                        switch (currentStep) { // 使用闭包中的 currentStep
                            case 0:
                                await storageService.updateTeachingPlan(sessionId, {
                                    text: lastMessage.content || '',
                                });
                                break;
                            case 1:
                                await storageService.updateClassDesign(sessionId, {
                                    text: lastMessage.content || '',
                                });
                                break;
                            case 2:
                                await storageService.updateTeachingMindMap(sessionId, {
                                    url: lastMessage.content || '',
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
    if (sessionId === "-1") return null;

    try {
        // 为每个 bot 创建独立的聊天实例
        const chatInstances = botIndices.map(() => useChatPolling());
        const responses = {
            exercises: null as string | null,
            Courseware: null as string | null,
            videos: null as string | null
        };

        // 每个 bot 的请求处理函数
        const handleBotRequest = async (botIndex: number, chatInstance: any) => {
            return new Promise<void>(async (resolve) => {
                const initialResponse = await sendMessage(
                    chatConfig.value.apiKey,
                    chatConfig.value.botId[botIndex],
                    chatConfig.value.message
                );

                let stopWatch = watch(() => chatInstance.chatMessages.value, async (newMessages) => {
                    if (newMessages?.data) {
                        console.log(`Bot ${botIndex} messages:`, newMessages);
                        const lastMessage = newMessages.data.find((msg: Message) => 
                            msg.type === 'answer' && msg.content_type === 'text'
                        );

                        if (lastMessage?.role === 'assistant') {
                            switch (botIndex) {
                                case 3:
                                    responses.exercises = lastMessage.content;
                                    break;
                                case 4:
                                    responses.Courseware = lastMessage.content;
                                    break;
                                case 5:
                                    responses.videos = lastMessage.content;
                                    break;
                            }
                            stopWatch();
                            resolve();
                        }
                    }
                }, { deep: true });

                await chatInstance.startPolling(chatConfig.value.apiKey, initialResponse);
            });
        };

        // 并行处理所有 bot 请求
        const promises = botIndices.map((botIndex, index) => 
            handleBotRequest(botIndex, chatInstances[index])
        );

        await Promise.all(promises);

        if (responses.exercises && responses.Courseware && responses.videos) {
            await storageService.updateCourseware(sessionId, {
                exercises: [{ 
                    name: `exercise-${Date.now()}`,
                    url: responses.exercises 
                }],
                Courseware: [{ 
                    name: `courseware-${Date.now()}`,
                    url: responses.Courseware 
                }],
                videos: [{ 
                    name: `video-${Date.now()}`,
                    url: responses.videos 
                }]
            });

            return await storageService.getSessionData(sessionId);
        }
        return null;
    } catch (err) {
        console.error('Parallel submission error:', err);
        return null;
    }
};



export const handleSubmit_analysis = async (sessionId: string, botid: number): Promise<analysisRes | null> => {
    if (!sessionId) {
        console.log('Invalid sessionId');
        return null;
    }

    // 保存用户消息
    await analysisService.updateMessages(sessionId, {
        role: 'user',
        content: chatConfig.value.message
    });

    if (!chatConfig.value.apiKey || !chatConfig.value.message) {
        console.log('chatConfig not complete');
        return null;
    } else {
        console.log("chatMessage: ", chatConfig.value.message);
    }

    try {
        const initialResponse = await sendMessage(
            chatConfig.value.apiKey, 
            chatConfig.value.botId[botid], 
            chatConfig.value.message
        );

        await startPolling(chatConfig.value.apiKey, initialResponse);

        // 清理之前的 watcher
        if (unwatch) {
            unwatch();
            unwatch = null;
        }

        const currentStep = botid; // 通过闭包捕获当前 step

        // 创建一个 Promise 来封装监听过程
        const waitForAnalysisCompletion = new Promise<void>((resolve) => {
            unwatch = watch(() => chatMessages.value, async (newMessages) => {
                if (newMessages?.data) {
                    console.log('newMessages:', newMessages);

                    interface ChatMessage {
                        type?: string;
                        content_type?: string;
                        role?: string;
                        content?: string;
                    }

                    const lastMessage: ChatMessage = newMessages.data.find((msg: ChatMessage) => 
                        (msg.type === 'answer' && msg.content_type === 'text')) || newMessages.data[0];

                    if (lastMessage.role === 'assistant') {
                        await analysisService.updateMessages(sessionId, {
                            role: 'assistant',
                            content: lastMessage.content || ''
                        });

                        switch (currentStep) { // 使用闭包中的 currentStep
                            case 6:
                                await analysisService.updateAnalysisRes(sessionId, {
                                    text: lastMessage.content || '',
                                });
                                break;
                            default:
                                break;
                        }

                        // 处理完成后，停止本次 watcher 并解析 Promise
                        if (unwatch) {
                            unwatch();
                            unwatch = null;
                        }
                        resolve();
                    }
                }
            }, { deep: true });
        });

        // 等待监听过程完成
        await waitForAnalysisCompletion;

        // 返回最终的会话数据
        return analysisService.getSessionData(sessionId) || null;
    } catch (err) {
        console.error(err);
        return null;
    }
};
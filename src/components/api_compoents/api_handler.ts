import { ref,watch } from 'vue';
import { storageService } from '@/services/storage/storageService';
import type {  ChatMessagesResponse } from '@/types/api';
export const showResult = ref(false);

//------------------api Test------------------//    
import { useChat } from '@/composables/useChat';
import { useChatPolling } from '@/composables/useChatPolling';


interface ChatConfig {
    apiKey: string
    botId: string[]
    message: string
}
  
export const chatConfig = ref<ChatConfig>({
apiKey: 'pat_DdQD93S1Vy2WBf0KZdOJ1ob5U9GzeR2Yjmkzaj5xVBq7EAAwd6OmSLKRmMnI4WYw',
botId: ['7449786123129847845','7463461062474498089'],
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




 export const handleSubmit = async (sessionId: string ,step: number) => {    // 按钮槽函数

    if(sessionId!="-1"){
         // ----------------------------------------->>

        // 保存用户消息
        await storageService.updateMessages(sessionId, {
            role: 'user',
            content: chatConfig.value.message
        });

        //<<-----------------------------------------



        if (!chatConfig.value.apiKey || !chatConfig.value.apiKey || !chatConfig.value.message) {
            console.log('chatConfig not complete');
            return;
        }

        try {
            const initialResponse = await sendMessage(
                chatConfig.value.apiKey, 
                chatConfig.value.botId[step], 
                chatConfig.value.message);   //对api发送请求
            await startPolling(chatConfig.value.apiKey, initialResponse);    //开始异步轮询


            // ----------------------------------------->>
            // 监听消息变化
            //watch(
            //    source,      // 监听源
            //    callback,    // 回调函数
            //    options      // 配置选项
            //)
            watch(() => chatMessages.value, async (newMessages: ChatMessagesResponse | null) => {
                if (newMessages?.data) {
                    const lastMessage = newMessages.data.find(msg => msg.type === 'answer') || newMessages.data[0];


                    if (lastMessage.role === 'assistant') {

                        // 1. 保存助手消息
                        await storageService.updateMessages(sessionId, {
                        role: 'assistant',
                        content: lastMessage.content
                        });
                        
                        switch (step) {
                            case 0:
                                // 2. 保存教案
                                await storageService.updateTeachingPlan(sessionId, {
                                    text: lastMessage.content,
                                });
                                break;
                            case 1:
                                // 2. 保存导图
                                await storageService.updateTeachingMindMap(sessionId, {
                                    url: lastMessage.content,
                                });
                                console.log('MindMap saved',lastMessage.content);
                                break;
                            case 2:
                                showResult.value = true;
                                break;
                            default:
                                break;
                        }
                    }else{
                        console.log('No assistant message found');
                    }
                }
            }, { deep: true });

            return storageService.getSessionData(sessionId) || null;

            // <<-----------------------------------------



        } catch (err) {
            // Error handling is already done in useChat composable
            console.error(err);
            return null;
        }

    }
};


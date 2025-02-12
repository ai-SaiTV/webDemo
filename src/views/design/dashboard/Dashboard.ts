import { ref,watch } from 'vue';
import { storageService } from '@/services/storage/storageService';
import type {  ChatMessagesResponse } from '@/types/api';
export const showResult = ref(false);

//------------------api Test------------------//    
import { useChat } from '@/composables/useChat';
import { useChatPolling } from '@/composables/useChatPolling';


interface ChatConfig {
    apiKey: string
    botId: string
    message: string
  }
  
  export const chatConfig = ref<ChatConfig>({
    apiKey: 'pat_DdQD93S1Vy2WBf0KZdOJ1ob5U9GzeR2Yjmkzaj5xVBq7EAAwd6OmSLKRmMnI4WYw',
    botId: '7449786123129847845',
    message: '你好嘛？？'
  })

const { error: chatError, sendMessage } = useChat();  // 从 useChat composable 中导入 error 和 sendMessage方法
export const {                                               // 从 useChatPolling composable 中导入以下属性和方法
  currentResponse: response,
  chatMessages,
  isPolling,
  error: pollingError,
  startPolling
} = useChatPolling();




 export const handleSubmit = async () => {    // 按钮槽函数


    // ----------------------------------------->>

    // 创建新会话
    const sessionId = await storageService.createSession();

    // 保存用户消息
    await storageService.updateMessages(sessionId, {
        role: 'user',
        content: chatConfig.value.message
      });

    //<<-----------------------------------------



    if (!chatConfig.value.apiKey || !chatConfig.value.apiKey || !chatConfig.value.message) {
        console.log('Please fill in all fields');
        return;
    }

    try {
        const initialResponse = await sendMessage(
            chatConfig.value.apiKey, 
            chatConfig.value.botId, 
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
                const lastMessage = newMessages.data[0];  // 获取第一条消息

                if (lastMessage.role === 'assistant') {

                    // 1. 保存助手消息
                    await storageService.updateMessages(sessionId, {
                    role: 'assistant',
                    content: lastMessage.content
                    });
                    
                    // 2. 保存教案
                    await storageService.updateTeachingPlan(sessionId, {
                        text: lastMessage.content,
                    });


                }else{
                    console.log('No assistant message found');
                }
            }
        }, { deep: true });

        // <<-----------------------------------------



    } catch (err) {
        // Error handling is already done in useChat composable
        console.error(err);
    }
};


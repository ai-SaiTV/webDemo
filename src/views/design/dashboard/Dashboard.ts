import { ref } from 'vue';

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
  if (!chatConfig.value.apiKey || !chatConfig.value.apiKey || !chatConfig.value.message) {
    console.log('Please fill in all fields');
    return;
  }

  try {
    const initialResponse = await sendMessage(chatConfig.value.apiKey, chatConfig.value.botId, chatConfig.value.message);   //对api发送请求
    await startPolling(chatConfig.value.apiKey, initialResponse);    //开始异步轮询
  } catch (err) {
    // Error handling is already done in useChat composable
    console.error(err);
  }
};


import { ref, computed } from 'vue';

export const activeStep = ref(0);
export const isGenerating = ref(false);
export const showResult = ref(false);
export const isProcessing = ref(false);
export const isZoomed = ref(false);
export const isHovering = ref(false);

export const progressStatus = ref("active");
export const Mindimgsrc = ref(
    'https://img1.baidu.com/it/u=4289792486,3256351331&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1133'
); // 这里需要提供实际的图片路径

export const translateY = ref(0);
export const progress = ref(0);
export const waitingTime = ref(5000);//请在这里修改按下‘下一步’按钮后的等待时间

// export const gradientColor = ref(`rgb(24, 144, 255)`)
export const gradientColor = computed(() => {
    const percentage = progress.value;

    const startColor = { r: 24, g: 144, b: 255 }; // 蓝色 rgb(24, 144, 255)
    const endColor = { r: 54, g: 207, b: 201 }; // 青色 rgb(54, 207, 201)

    //线性插值公式
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * (percentage / 100));
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * (percentage / 100));
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * (percentage / 100));

    return `rgb(${r}, ${g}, ${b})`;
});
export const form = ref({
    grade: '',
    subject: '',
    unit: '',
    topic: '',
    duration: 45,
    difficulty: 'medium',
    focus: [],
    requirements: ''
});

export const steps = [
    { title: '大纲生成', description: '一句话生成大纲' },
    { title: '大纲修改', description: '提供修改以保证贴合教学安排' },
    { title: '导图生成', description: '根据教学大纲生成思维导图' },
    { title: '智能生成', description: '总结教学大纲与思维导图' }
];

export const generatedContent = ref({
    lessonPlan: {
        title: '认识分数',
        objectives: [
            '理解分数的基本概念',
            '掌握分数的读写方法',
            '能够运用分数解决简单的实际问题'
        ],
        steps: [
            '导入：通过生活中的实例引入分数概念',
            '讲解：分数的表示方法和意义',
            '练习：基础练习和应用题',
            '总结：归纳本节课重点'
        ]
    },
    resources: [
        {
            title: '分数动画课件',
            type: 'ppt',
            url: '#',
            preview: 'https://picsum.photos/300/200'
        },
        {
            title: '分数教学视频',
            type: 'video',
            url: '#',
            preview: 'https://picsum.photos/300/200'
        }
    ],
    exercises: [
        {
            title: '基础练习',
            count: 10,
            difficulty: '简单',
            preview: '1. 将下列图形中的阴影部分用分数表示...'
        },
        {
            title: '提高练习',
            count: 5,
            difficulty: '中等',
            preview: '1. 小明吃了一个苹果的3/4，小红吃了...'
        }
    ],
    mindMap: {
        preview: 'https://picsum.photos/800/400',
        nodes: [
            { id: 1, text: '分数的概念', x: 400, y: 200 },
            { id: 2, text: '分数的读写', x: 300, y: 300 },
            { id: 3, text: '分数的意义', x: 500, y: 300 }
        ]
    }
});

export const nextStep = () => {
    if (activeStep.value < steps.length - 1) {
        isProcessing.value = true;
        progress.value = 0;
        progressStatus.value = "active";

        const interval = 50;
        const stepsCount = waitingTime.value / interval;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            progress.value = Math.min((currentStep / stepsCount) * 100, 100);

            if (progress.value >= 100) {
                clearInterval(timer);
                progressStatus.value = "success";

                setTimeout(() => {
                    isProcessing.value = false;
                    progress.value = 0;
                    progressStatus.value = "active";
                    activeStep.value++;
                }, 500);
            }
        }, interval);
    }


};

export const prevStep = () => {
    if (activeStep.value > 0) {
        activeStep.value--;
    }
};

export const generatePlan = async () => {
    isGenerating.value = true;
    await new Promise(resolve => setTimeout(resolve, waitingTime.value));
    isGenerating.value = false;
    showResult.value = true;
};

export const previewMindMap = () => {
    const mindMapWindow = window.open('', '_blank');
    if (mindMapWindow) {
        mindMapWindow.document.write(`
      <html>
        <head>
          <title>思维导图预览</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f2f5; }
            img { max-width: 90%; max-height: 90vh; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${generatedContent.value.mindMap.preview}" alt="思维导图">
        </body>
      </html>
    `);
    }
};

export const toggleImageSize = () => {
    isZoomed.value = !isZoomed.value;
    translateY.value = 0;
};

export const onWheel = (event: WheelEvent) => {
    if (event.deltaY > 0) {
        translateY.value = Math.min(translateY.value - 40, 0);
    } else {
        translateY.value = Math.max(translateY.value + 40, -500);
    }
};

export const zoomedImageStyle = computed(() => ({
    transform: `translateY(${translateY.value}px)`,
    transition: 'transform 0.3s ease-in-out',
}));

export const imageStyle = computed(() => ({
    width: '100%',
    height: 'auto',
    cursor: isHovering.value ? 'zoom-in' : 'default',
}));

export const form1 = ref({
    requirements: `《算法与数据结构：二叉树》教学大纲...`
});



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


import { ref, computed } from 'vue';

export const activeStep = ref(0);
export const isGenerating = ref(false);
export const showResult = ref(false);

export const Mindimgsrc = ref('https://img1.baidu.com/it/u=4289792486,3256351331&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1133'); // 这里需要提供实际的图片路径
export const isZoomed = ref(false);
export const isHovering = ref(false);
export const translateY = ref(0);

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
        activeStep.value++;
    }
};

export const prevStep = () => {
    if (activeStep.value > 0) {
        activeStep.value--;
    }
};

export const generatePlan = async () => {
    isGenerating.value = true;
    await new Promise(resolve => setTimeout(resolve, 2000));
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

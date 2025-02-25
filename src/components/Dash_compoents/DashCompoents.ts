import { ref, nextTick } from '@vue/runtime-core';
import { computed } from '@vue/runtime-core';
import { watch } from '@vue/runtime-core';



// step 0 ： 教学大纲生成， step 1 ： 课堂设计， step 2 ： 导图生成， step 3 ： 教学资源推荐




// ------------------------------------------------------------>> api
import {
    handleSubmit, handleSubmitParallel, isPolling, chatConfig
} from '@/components/api_compoents/api_handler';

import { storageService } from '@/services/storage/storageService';
import type { StorageData } from '@/types/storageData'
// import { tr } from 'element-plus/es/locales.mjs';


//<<------------------------------------------------------------
export const sessionId = ref<string>("-1");  // 会话ID
export const DataThisSession = ref<StorageData | null>(null);  // 会话数据


export const activeStep = ref(0);
export const isGenerating = ref(false);
export const showResult = ref(false);
export const isProcessing = ref(false);
export const isZoomed = ref(false);
export const isForm1Editing = ref(false);
export const isHovering = ref(false);

export const progressStatus = ref("active");
export const Mindimgsrc = ref(
    'https://static.shutu.cn/shutu/jpeg/open3e/2025/02/12/8b749027703a3e2a62682ac20c04931c.jpeg'
); // 这里需要提供实际的图片路径

export const translateY = ref(0);
export const progress = ref(0);
export const waitingTime = ref(1000);//请在这里修改按下‘下一步’按钮后的等待时间

export const gradientColor = computed(() => {
    const percentage = progress.value;

    const startColor = { r: 24, g: 144, b: 255 }; // 蓝色 rgb(24, 144, 255)
    const endColor = { r: 54, g: 207, b: 201 }; // 青色 rgb(54, 207, 201)

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
    { title: '教学大纲生成', description: '🥰一句话生成大纲' },
    { title: '课堂设计', description: '⭐根据教学大纲和结合优秀教学案例生成课堂设计' },
    { title: '导图生成', description: '🗨️根据教学大纲生成思维导图' },
    { title: '教学资源推荐', description: '🔥根据教学大纲和课堂设计生成教学资源' },
    { title: '结果展示', description: '🎇整合展示备课资源' }
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
            preview: '1. 小明吃了一个苹果的3/4,小红吃了...'
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


let stopPollingWatch: (() => void) | null = null;
let isUpdatingStep = false; // 状态锁
let progressInterval: ReturnType<typeof setInterval> | null = null; // 用来保存定时器引用，便于清除
export const nextStep = async () => {
    if (activeStep.value == 3) activeStep.value = 4;
    if (activeStep.value >= steps.length - 1 || isUpdatingStep) return;
    isUpdatingStep = true;

    // 清理旧监听器
    if (stopPollingWatch) {
        stopPollingWatch();
        stopPollingWatch = null;
    }

    if (activeStep.value === 0) {
        sessionId.value = await storageService.createSession();
    }

    isProcessing.value = true;
    progress.value = 0;
    progressStatus.value = "active";

    switch (activeStep.value) {
        case 0:
            chatConfig.value.message = form.value.unit;
            break;
        case 1:
            chatConfig.value.message = form1.value.requirements;
            break;
        case 2:
            chatConfig.value.message = form1.value.requirements;
            break;
    }

    const result = await handleSubmit(sessionId.value, activeStep.value);
    DataThisSession.value = result || null;

    // 闭包保存当前步骤
    const currentStep = activeStep.value;
    interface ProgressInterval {
        elapsedTime: number;
        progressRatio: number;
    }

    stopPollingWatch = watch(() => isPolling.value, async (newPolling: boolean) => {
        if (newPolling) {
            progress.value = 0;
            progressStatus.value = "active";
            let startTime: number = Date.now();
            const duration: number = 20000;
            const targetProgress: number = 97;

            progressInterval = setInterval((): void => {
                const elapsedTime: number = Date.now() - startTime;
                const progressRatio: number = elapsedTime / duration;
                progress.value = Math.min(targetProgress, progressRatio * targetProgress);

                if (elapsedTime >= duration) {
                    clearInterval(progressInterval as ReturnType<typeof setInterval>);
                }
            }, 50);
        } else {
            clearInterval(progressInterval as ReturnType<typeof setInterval>);
            progress.value = 100;
            progressStatus.value = "success";
            await turnStep(currentStep);

            setTimeout((): void => {
                isProcessing.value = false;
                progress.value = 0;
                progressStatus.value = "active";
                // 安全递增步骤
                if (activeStep.value === currentStep) {
                    activeStep.value++;
                }
                console.log('activeStep', activeStep.value);
                // 清理监听器并释放锁
                if (stopPollingWatch) {
                    stopPollingWatch();
                    stopPollingWatch = null;
                }
                isUpdatingStep = false;
            }, 500);
        }
    }, { immediate: true });
};
export const handleKeydown = (event: KeyboardEvent) => {
    // 如果按下的是 Enter 键，触发 nextStep
    if (event.key === 'Enter') {
        event.preventDefault();
        nextStep();
    }
};

import { parseMarkdown } from '../../utils/markdownUtils';


const turnStep = async (step: number) => {
    if (step === 0) {         //教学大纲Res -->> 课堂设计Pre
        await nextTick(() => {})
        if (DataThisSession.value?.resources?.teaching_plan?.text) {

            form1.value.requirements = parseMarkdown(DataThisSession.value.resources.teaching_plan.text).__html
        }
        return '0'
    } else if (step === 1) {      //课堂设计Res -->> 导图生成Pre
        await nextTick(() => {})
        if (DataThisSession.value?.resources?.class_design?.text) {
            form1.value.requirements = parseMarkdown(DataThisSession.value.resources.class_design.text).__html
        }
        return '1';

    } else if (step === 2) {
        await nextTick(() => {})
        if (DataThisSession.value?.resources?.tp_MindMap?.url) {
            Mindimgsrc.value = DataThisSession.value.resources.tp_MindMap.url
        }
        return '1';
    } else if (step === steps.length - 1) {
        return 'last';
    }
    else {
        return '';
    }
};

export const prevStep = () => {
    if (activeStep.value > 0) {
        activeStep.value--;
    }
};

export const generatePlan = async () => {
    isGenerating.value = true;
    try {

        isProcessing.value = true;
        console.log('开始生成资源:', sessionId.value);
        progress.value = 0;
        progressStatus.value = "active";
        let startTime = Date.now();
        const duration = 20000;
        const targetProgress = 97;

        progressInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const progressRatio = elapsedTime / duration;
            progress.value = Math.min(targetProgress, progressRatio * targetProgress);

            if (elapsedTime >= duration) {
                clearInterval(progressInterval as ReturnType<typeof setInterval>);
            }
        }, 50);
        // 等待所有资源生成完成
        const result = await handleSubmitParallel(sessionId.value, [3, 4, 5]);
        console.log('generateResources:', result);
        DataThisSession.value = result || null;

        if (result) {
            clearInterval(progressInterval as ReturnType<typeof setInterval>);
            progress.value = 100;
            progressStatus.value = "success";
            isProcessing.value = false;
            showResult.value = true;
        } else {
            console.error('资源生成失败');
            isProcessing.value = false;
        }
    } catch (error) {
        console.error('生成过程出错:', error);
        isProcessing.value = false;
        console.log('资源生成结束:', sessionId.value);
    } finally {
        isGenerating.value = false;
    }
};


export const imageStyle = computed(() => ({
    width: '100%',
    height: 'auto',
    cursor: isHovering.value ? 'zoom-in' : 'default',
}));

export const form1 = ref({
    requirements: `😿`
});

export const updateShowResult = (newValue: boolean) => {
    showResult.value = newValue;
};

export const updateIsZoomed = (newZoomedStatus: boolean) => {
    isZoomed.value = newZoomedStatus;
};

export const updateTranslateY = (newTranslateY: number) => {
    translateY.value = newTranslateY;
}; 

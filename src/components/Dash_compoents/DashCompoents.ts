import { ref, nextTick } from '@vue/runtime-core';
import { computed } from '@vue/runtime-core';
import { watch } from '@vue/runtime-core';



// step 0 ： 教案大纲生成， step 1 ： 课堂设计， step 2 ： 导图生成， step 3 ： 教学资源推荐




// ------------------------------------------------------------>> api
import {
    handleSubmit, handleSubmitParallel, isPolling, chatConfig,
    handleSubmitEdit, handleEditZoneReplace
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
export const isEditing = ref(false);
export const isZoomed = ref(false);
export const isForm1Editing = ref(false);
export const isHovering = ref(false);

export const isEditingFinish = ref(false);
export const isDropdownVisible = ref(false);

// 存储用户输入的优化建议
export const optimizationSuggestion = ref('');

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
    { title: '教案生成', description: '一句话生成教案' },
    { title: '课堂设计', description: '根据教案和结合优秀教学案例生成课堂设计' },
    { title: '导图生成', description: '生成课堂环节设计思维导图' },
    { title: '教学资源推荐', description: '根据教案和课堂设计生成教学资源' },
    { title: '结果整合', description: '整合展示备课助手生成结果' }
];

export const generatedContent = ref("");

const analysisDataFetched = ref('');


let stopPollingWatch: (() => void) | null = null;
let isUpdatingStep = false; // 状态锁
let progressInterval: ReturnType<typeof setInterval> | null = null; // 用来保存定时器引用，便于清除
export const nextStep = async () => {
    // if (activeStep.value == 3) activeStep.value = 4;
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
            chatConfig.value.message = form.value.unit + (analysisDataFetched.value || "");
            break;
        case 1:
            chatConfig.value.message = DataThisSession.value?.resources.teaching_plan.text || "";
        
            break;
        case 2:
            chatConfig.value.message = DataThisSession.value?.resources.class_design.text || "";
            break;
        default:
            chatConfig.value.message = ""; // 默认值
    }

    const result = await handleSubmit(sessionId.value, activeStep.value);
    DataThisSession.value = result || null;

    // 闭包保存当前步骤
    const currentStep = activeStep.value;
    // interface ProgressInterval {
    //     elapsedTime: number;
    //     progressRatio: number;
    // }

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

import { parseMarkdown } from '@/utils/markdownUtils';
import mmPic from '@/assets/files/mmPic.jpeg';

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
            // Mindimgsrc.value = parseMarkdownList_mm(DataThisSession.value.resources.tp_MindMap.url)[0].url
            // Mindimgsrc.value = DataThisSession.value.resources.tp_MindMap.url
            Mindimgsrc.value = mmPic;
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


// 提交优化建议
export const handleConfirm = () => {
    EditSubmit();
    // isDropdownVisible.value = false;
    optimizationSuggestion.value = ''; // 清空输入
  };



export const EditSubmit = async () => {
    if (activeStep.value >= steps.length - 1 || isUpdatingStep) return;
    isUpdatingStep = true;

    // 清理旧监听器
    if (stopPollingWatch) {
        stopPollingWatch();
        stopPollingWatch = null;
    }

    isEditing.value = true;
    progress.value = 0;
    progressStatus.value = "active";

    // 根据当前步骤设置 chatConfig.message
    switch (activeStep.value) {
        case 1:
            //教案修改
            chatConfig.value.message = DataThisSession.value?.resources.teaching_plan.text 
                + "并根据以下修改意见进行修改：" + optimizationSuggestion.value || "";
            break;
        case 2:
            // 课堂设计修改
            chatConfig.value.message = DataThisSession.value?.resources.class_design.text 
            + "并根据以下修改意见进行修改：" + optimizationSuggestion.value || "";
            break;
        default:
            chatConfig.value.message = ""; // 默认值
    }

    console.log('EditSubmit', chatConfig.value.message);

    // 调用 handleSubmit 提交当前步骤数据
    const result = await handleSubmitEdit(sessionId.value, activeStep.value);
    DataThisSession.value = result || null;
    
    
    // 监听 isPolling 状态变化
    stopPollingWatch = watch(
        () => isPolling.value,
        async (newPolling: boolean) => {
            if (newPolling) {
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
            } else {
                clearInterval(progressInterval as ReturnType<typeof setInterval>);
                progress.value = 100;
                progressStatus.value = "success";

                await NextEdit();

                setTimeout(() => {
                    isEditing.value = false;
                    progress.value = 0;
                    progressStatus.value = "active";

                    // 根据需求选择是否自动推进步骤
                    // 如果需要推进步骤：
                    // if (activeStep.value === currentStep) {
                    //     activeStep.value++;
                    // }
                    // console.log("activeStep", activeStep.value);

                    // 清理资源
                    if (stopPollingWatch) {
                        stopPollingWatch();
                        stopPollingWatch = null;
                    }
                    isUpdatingStep = false;
                }, 500);
            }
        },
        { immediate: true }
    );
};


const NextEdit = async () => {
    await nextTick();  
    EditZoneContent.value = parseMarkdown(DataThisSession.value?.editZone.text || "").__html
    isEditingFinish.value = true;
    console.log('EditZoneContent.value: ', EditZoneContent.value);
};

// 提交替换
export const handleReplace = async() => {

    //提交替换，替换原有的教案内容为EditZone中的内容
    const result =  await handleEditZoneReplace(sessionId.value, { type: DataThisSession.value?.editZone.type || "None",
        text: DataThisSession.value?.editZone.text || "" });
    console.log('handleEditZoneReplace: ', result);
    DataThisSession.value = result || null;

    await turnStep(activeStep.value - 1);

    isEditingFinish.value = false;
  };


export const generateResource = async () => {
    isGenerating.value = true;
    try {

        chatConfig.value.message = DataThisSession.value?.resources?.teaching_plan?.text || '';   //Message为 教学大纲
        // console.log('DashCompoents 266:', chatConfig.value.message);

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
        const result = await handleSubmitParallel(sessionId.value, [3,4]);
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
    requirements: `<h2>网络超时，请检查网络设置<h2>`
});


export const EditZoneContent = ref('');



export const updateShowResult = (newValue: boolean) => {
    showResult.value = newValue;
};

export const updateIsZoomed = (newZoomedStatus: boolean) => {
    isZoomed.value = newZoomedStatus;
};

export const updateTranslateY = (newTranslateY: number) => {
    translateY.value = newTranslateY;
}; 




import { ref } from '@vue/runtime-core'
import type { analysisRes } from '@/types/analysisRes'

export class analysisResService {
  private data = ref<analysisRes[]>([])
  
  // 创建新会话
  async createSession(): Promise<string> {

    // 对接口内容直接初始化赋值
    const newSession: analysisRes = {
      id: Date.now().toString(),  //用时间戳作为id
      timestamp: Date.now(),      
      conversation: { messages: [] },
      analysis: ''  
    }

    this.data.value.push(newSession)
    await this.saveToFile()
    return newSession.id
  }

  // 更新消息
  async updateMessages(sessionId: string, message: { role: 'user' | 'assistant', content: string }) {
    const session = this.data.value.find(s => s.id === sessionId)
    if (session) {
      session.conversation.messages.push({
        ...message,
        timestamp: Date.now()
      })
      await this.saveToFile()
    }
  }

  // 更新学情分析结果
  async updateAnalysisRes(sessionId: string, data: { text: string, }) {
    console.log('更新学情分析结果:', sessionId, data)
    const session = this.data.value.find(s => s.id === sessionId)
    if (session) {
      session.analysis = data.text
      await this.saveToFile()
    }
  }

    // 获取指定会话数据
  async getSessionData(sessionId: string): Promise<analysisRes | null> {
    try {
        let session: analysisRes | undefined;
        
        // 如果 sessionId 为 "0"，获取最后一条数据
        if (sessionId === "0") {
            session = this.data.value[this.data.value.length - 1];
        } else {
            // 否则按 id 查找
            session = this.data.value.find(s => s.id === sessionId);
        }
        
        // 打印调试信息
        console.log('获取学情分析数据:', sessionId, session);
        
        return session || null;
    } catch (error) {
        console.error('获取学情分析数据失败:', error);
        return null;
    }
  }


  // 保存到文件
  private async saveToFile() {
    try {
      localStorage.setItem('analysis-storage', JSON.stringify(this.data.value))
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  // 加载数据
  async loadData() {
    const saved = localStorage.getItem('analysis-storage')
    if (saved) {
      this.data.value = JSON.parse(saved)
    }
  }
}

export const analysisService = new analysisResService()
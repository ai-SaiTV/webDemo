
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// 配置 marked（可选：启用换行符、表格等）
marked.setOptions({
  breaks: true,      // 将 \n 转换为 <br>
  gfm: true          // 支持 GitHub Flavored Markdown（如表格）
});

export const parseMarkdown = (content) => {
  const rawHtml = marked.parse(content);
  return DOMPurify.sanitize(rawHtml); // 净化 HTML
}

// utils/markdownUtils.ts
export function parseMarkdownList(markdown: string): { title: string, url: string }[] {
    const regex = /\- \[(.*?)\]\((.*?)\)/g;
    const matches = [];
    let match;
  
    while ((match = regex.exec(markdown)) !== null) {
      matches.push({ title: match[1], url: match[2] });
    }
  
    return matches;
};
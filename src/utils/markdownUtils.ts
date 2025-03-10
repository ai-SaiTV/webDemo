import { marked } from 'marked';
import DOMPurify from 'dompurify';

// 配置 marked（可选：启用换行符、表格等）
marked.setOptions({
  breaks: true,      // 将 \n 转换为 <br>
  gfm: true          // 支持 GitHub Flavored Markdown（如表格）
});

interface MarkdownParserResult {
    readonly __html: string;
}

export const parseMarkdown = (content: string): MarkdownParserResult => {
    const rawHtml = marked.parse(content) as string; // 使用 marked.parse 解析完整 Markdown
    return { __html: DOMPurify.sanitize(rawHtml) }; // 净化 HTML
};

// utils/markdownUtils.ts
export function parseMarkdownList(markdown: string): { type: string, title: string, url: string }[] {
  // 新正则表达式：匹配类型、名称、链接三部分
  const regex = /- #(.*?)# \[(.*?)\]\((.*?)\)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(markdown)) !== null) {
      // 匹配组顺序：match[1]=类型，match[2]=名称，match[3]=链接
      matches.push({
          type: match[1],
          title: match[2],
          url: match[3]
      });
  }

  return matches;
}
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// 配置 marked（可选：启用换行符、表格等）
marked.setOptions({
  breaks: true,      // 将 \n 转换为 <br>
  gfm: true,         // 支持 GitHub Flavored Markdown
});

interface MarkdownParserResult {
    readonly __html: string;
}

export const parseMarkdown = (content: string): MarkdownParserResult => {
    const rawHtml = marked.parse(content) as string; // 使用 marked.parse 解析完整 Markdown
    return { __html: DOMPurify.sanitize(rawHtml) }; // 净化 HTML
};

// utils/markdownUtils.ts
export function parseMarkdownList_re(markdown: string): { type: string, title: string, url: string }[]{
  // 新正则表达式：匹配类型、名称、链接三部分
  const regex = /- #(.*?)#\[(.*?)\]\((.*?)\)/g;
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


export function parseMarkdownList_ex(markdown: string): { title: string, url: string }[] {
  const regex = /- #([^#]*)#(.*)/g; // 新正则表达式
  const matches = [];
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    // match[1] 是类型，match[2] 是 URL
    matches.push({
      title: match[1], // 类型作为标题
      url: match[2].trim(), // 去除 URL 末尾的空格
    });
  }

  return matches;
}
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
  const regex = /- #(.*?)#\[(.*?)\]\((.*?)\)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(markdown)) !== null) {
      matches.push({
          type: match[1],
          title: match[2],
          url: match[3]
      });
  }
  return matches;
}
export function parseMarkdownList_ex(markdown: string): {  type: string, title: string, url: string }[] {
  const regex = /- #(.*?)# \[(.*?)\]\((.*?)\)/g; //- #类型#[标题](URL)"
  const matches = [];
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    // match[1] 是类型，match[2] 是 URL
    matches.push({
      type: match[1],
      title: match[2], // 类型
      url: match[3].trim(), // 去除 URL 末尾的空格
    });
  }

  return matches;
}
//思维导图解析
export function parseMarkdownList_mm(markdown: string): { url: string }[] {
  const regex = /<([^>]+)>/g; // 匹配 < 和 > 之间的内容
  const matches: { url: string }[] = [];
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    matches.push({
      url: match[1] // 提取 URL
    });
  }

  return matches;
}
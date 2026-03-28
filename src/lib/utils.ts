/**
 * 日期格式化函数
 */
export const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * 文章日期格式化
 */
export const formatArticleDate = (dateStr: string | undefined): string => {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return formatDate(dateStr);
};

/**
 * 估算文章阅读时长
 */
export const estimateReadingTime = (content?: string): number => {
  if (!content) {
    return 1;
  }

  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return 1;
  }

  const cjkCharacters = plainText.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const latinWords = plainText.match(/[a-zA-Z0-9]+/g)?.length ?? 0;
  const readingUnits = cjkCharacters + latinWords * 2;

  return Math.max(1, Math.ceil(readingUnits / 300));
};

/**
 * 提取纯文本摘要
 */
export const extractPlainText = (content?: string): string => {
  if (!content) {
    return "";
  }

  return content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * 截断文本
 */
export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

/**
 * 组合 className（用于动态类名）
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(" ");
};

/**
 * 延迟函数
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * 防抖函数
 */
export const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  delay: number
): ((...args: T) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * 节流函数
 */
export const throttle = <T extends unknown[]>(
  func: (...args: T) => void,
  limit: number
): ((...args: T) => void) => {
  let inThrottle: boolean;
  return (...args: T) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

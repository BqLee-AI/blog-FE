import DOMPurify from "dompurify";

const sanitizeOptions = {
  USE_PROFILES: { html: true },
};

export const sanitizeHtml = (html: string): string => {
  if (!html) {
    return "";
  }

  return DOMPurify.sanitize(html, sanitizeOptions);
};
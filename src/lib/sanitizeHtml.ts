import DOMPurify from "dompurify";

const sanitizeOptions = {
  ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "a", "img", "blockquote", "code", "pre"],
  ALLOWED_ATTR: ["href", "src", "alt", "class", "id"],
  FORBID_ATTR: ["onclick", "onerror", "onload", "style"],
};

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

export const sanitizeHtml = (html: string): string => {
  if (typeof html !== "string" || !html) {
    return "";
  }

  try {
    return DOMPurify.sanitize(html, sanitizeOptions);
  } catch {
    return escapeHtml(html);
  }
};
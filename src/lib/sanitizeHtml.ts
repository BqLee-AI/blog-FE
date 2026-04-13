import DOMPurify from "dompurify";

const sanitizeOptions = {
  ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "a", "img", "blockquote", "code", "pre"],
  ALLOWED_ATTR: ["href", "src", "alt", "class", "id"],
  FORBID_ATTR: ["onclick", "onerror", "onload", "style"],
};

export const sanitizeHtml = (html: string): string => {
  if (!html) {
    return "";
  }

  return DOMPurify.sanitize(html, sanitizeOptions);
};
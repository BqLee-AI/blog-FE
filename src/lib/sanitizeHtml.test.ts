import DOMPurify from "dompurify";
import { afterEach, describe, expect, it, vi } from "vitest";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("sanitizeHtml", () => {
  it("removes dangerous tags and event handlers", () => {
    const html = '<p>Hello</p><script>alert(1)</script><img src="x" onerror="alert(1)">';

    const sanitized = sanitizeHtml(html);

    expect(sanitized).toContain("<p>Hello</p>");
    expect(sanitized).not.toContain("<script>");
    expect(sanitized).not.toContain("onerror");
  });

  it("strips forbidden style and onclick attributes while keeping allowed markup", () => {
    const html = '<a href="/article/1" onclick="alert(1)" style="color:red">Read more</a>';

    const sanitized = sanitizeHtml(html);

    expect(sanitized).toContain('<a href="/article/1">Read more</a>');
    expect(sanitized).not.toContain("onclick");
    expect(sanitized).not.toContain("style");
  });

  it("falls back to escaped text when DOMPurify throws", () => {
    vi.spyOn(DOMPurify, "sanitize").mockImplementation(() => {
      throw new Error("sanitize failed");
    });

    const html = '<p>Hello & welcome <script>alert(1)</script></p>';

    const sanitized = sanitizeHtml(html);

    expect(sanitized).toBe("&lt;p&gt;Hello &amp; welcome &lt;script&gt;alert(1)&lt;/script&gt;&lt;/p&gt;");
  });
});
import sanitizeHtmlLib from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "code",
  "pre",
  "a",
  "hr",
];

const options: sanitizeHtmlLib.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: {},
  allowProtocolRelative: false,
  allowedSchemesAppliedToAttributes: ["href"],
};

export function sanitizeHtml(input: string): string {
  return sanitizeHtmlLib(input, options).trim();
}

export function stripHtml(input: string): string {
  return sanitizeHtmlLib(input, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}

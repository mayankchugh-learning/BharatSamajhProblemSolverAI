/**
 * PII Guard — strips personally identifiable information from text before
 * it is sent to external AI providers. This is a defence-in-depth measure:
 * the application already avoids sending PII by design, but this guard
 * catches accidental leaks if future code changes introduce them.
 */

const EMAIL_PATTERN = /\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Z|a-z]{2,}\b/g;

const PHONE_PATTERN = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;

const AADHAAR_PATTERN = /\b\d{4}\s?\d{4}\s?\d{4}\b/g;

const SSN_PATTERN = /\b\d{3}-\d{2}-\d{4}\b/g;

const CREDIT_CARD_PATTERN = /\b(?:\d[ -]*?){13,19}\b/g;

interface PiiScrubResult {
  text: string;
  redactionsApplied: number;
}

export function scrubPii(text: string): PiiScrubResult {
  let redactions = 0;

  function replace(input: string, pattern: RegExp, label: string): string {
    return input.replace(pattern, () => {
      redactions++;
      return `[${label}]`;
    });
  }

  let result = text;
  result = replace(result, EMAIL_PATTERN, "EMAIL_REDACTED");
  result = replace(result, SSN_PATTERN, "ID_REDACTED");
  result = replace(result, AADHAAR_PATTERN, "ID_REDACTED");
  result = replace(result, CREDIT_CARD_PATTERN, "CARD_REDACTED");
  result = replace(result, PHONE_PATTERN, "PHONE_REDACTED");

  return { text: result, redactionsApplied: redactions };
}

/**
 * Scrubs PII from an array of OpenAI-style chat messages.
 * Only scrubs "user" role messages — system prompts and assistant
 * messages are controlled by us and don't contain PII.
 */
export function scrubMessagesForAI(
  messages: { role: string; content: string }[]
): { messages: { role: string; content: string }[]; totalRedactions: number } {
  let totalRedactions = 0;

  const scrubbed = messages.map((msg) => {
    if (msg.role !== "user") return msg;
    const result = scrubPii(msg.content);
    totalRedactions += result.redactionsApplied;
    return { ...msg, content: result.text };
  });

  return { messages: scrubbed, totalRedactions };
}

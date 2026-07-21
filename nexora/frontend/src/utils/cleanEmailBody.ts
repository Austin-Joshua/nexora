/**
 * Utility to clean up Gmail body text (stripping tracking URLs, raw base64 links,
 * image placeholdes, and repetitive whitespace) into clean, human-readable text.
 */
export function cleanEmailBody(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove long encoded tracking URLs like [https://email.mail.../c/.../...]
  cleaned = cleaned.replace(/\[https?:\/\/[^\s\]]{40,}\]/g, '');
  cleaned = cleaned.replace(/https?:\/\/[^\s]{60,}/g, '[Link]');

  // 2. Remove [image: ...] alt tags
  cleaned = cleaned.replace(/\[image:\s*[^\]]*\]/gi, '');

  // 3. Remove raw HTML tags if any leaked through
  cleaned = cleaned.replace(/<[^>]*>/g, '');

  // 4. Decode HTML entities
  const parser = new DOMParser();
  const decoded = parser.parseFromString(`<!doctype html><body>${cleaned}`, 'text/html').body.textContent || cleaned;

  // 5. Clean up multiple blank lines
  const lines = decoded
    .split('\n')
    .map(line => line.trim())
    .filter((line, index, arr) => {
      // Don't keep consecutive empty lines
      if (line === '' && arr[index - 1] === '') return false;
      return true;
    });

  return lines.join('\n').trim();
}

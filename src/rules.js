export function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function findMatchingRule(text, rules) {
  const normalizedText = normalizeText(text);

  return rules.find((rule) => rule.keywords.some((keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) return false;

    const escapedKeyword = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])${escapedKeyword}(?=$|[^\\p{L}\\p{N}])`, 'u');
    return pattern.test(normalizedText);
  }));
}

export function getMessageText(message) {
  return message.conversation ?? message.extendedTextMessage?.text ?? '';
}
export const defaultKeywords = ['fire', 'help', 'emergency', 'urgent'];

export const highlightKeywords = (text: string, keywords: string[] = defaultKeywords): string => {
  let highlightedText = text;
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    highlightedText = highlightedText.replace(regex, `<span class="bg-error text-error-foreground px-1 rounded">$&</span>`);
  });
  return highlightedText;
};

export const checkForKeywords = (text: string, keywords: string[] = defaultKeywords): boolean => {
  return keywords.some(keyword => 
    new RegExp(`\\b${keyword}\\b`, 'i').test(text)
  );
};
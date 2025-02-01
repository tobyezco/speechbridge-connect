import axios from 'axios';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
];

export const translateText = async (text: string, targetLang: string) => {
  try {
    // Using a more reliable free translation API
    const response = await axios.post('https://api.mymemory.translated.net/get', null, {
      params: {
        q: text,
        langpair: `en|${targetLang}`,
      },
    });

    if (response.data && response.data.responseData) {
      return response.data.responseData.translatedText;
    }
    
    throw new Error('Translation failed');
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};
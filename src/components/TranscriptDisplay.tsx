import React from 'react';
import { highlightKeywords } from '@/utils/speechUtils';
import { SUPPORTED_LANGUAGES, translateText } from '@/utils/translationUtils';
import { useToast } from '@/hooks/use-toast';

interface TranscriptDisplayProps {
  transcript: string;
  isRecording: boolean;
}

const TranscriptDisplay = ({ transcript, isRecording }: TranscriptDisplayProps) => {
  const [targetLanguage, setTargetLanguage] = React.useState('en');
  const [translatedText, setTranslatedText] = React.useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    const translateTranscript = async () => {
      if (transcript && targetLanguage !== 'en') {
        try {
          const translated = await translateText(transcript, targetLanguage);
          setTranslatedText(translated);
        } catch (error) {
          toast({
            title: "Translation Error",
            description: "Failed to translate the text. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    translateTranscript();
  }, [transcript, targetLanguage, toast]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <div className="flex justify-end">
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="border rounded-md px-3 py-1 text-sm"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="transcript-container">
        {transcript ? (
          <>
            <p className="text-lg leading-relaxed mb-4"
               dangerouslySetInnerHTML={{ __html: highlightKeywords(transcript) }}
            />
            {targetLanguage !== 'en' && translatedText && (
              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <h3 className="text-sm font-medium mb-2">Translation:</h3>
                <p className="text-lg leading-relaxed">{translatedText}</p>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center italic">
            {isRecording ? "Listening..." : "Start recording to see transcription"}
          </p>
        )}
      </div>
    </div>
  );
};

export default TranscriptDisplay;
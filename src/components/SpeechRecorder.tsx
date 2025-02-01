import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TranscriptDisplay from './TranscriptDisplay';
import { checkForKeywords } from '@/utils/speechUtils';

const SpeechRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
            
            if (checkForKeywords(transcript)) {
              toast({
                title: "Alert!",
                description: "Urgent keyword detected in speech!",
                variant: "destructive",
              });
            }
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript((prev) => finalTranscript || prev);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Error",
          description: `Speech recognition error: ${event.error}`,
          variant: "destructive",
        });
        setIsRecording(false);
      };

      setRecognition(recognition);
    } else {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const toggleRecording = useCallback(() => {
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Speech recognition has been stopped.",
      });
    } else {
      recognition.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speech recognition is now active.",
      });
    }
  }, [isRecording, recognition, toast]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(transcript).then(() => {
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Transcript copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    });
  }, [transcript, toast]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">SpeechBridge</h1>
        
        <div className="w-full space-y-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleRecording}
              className={`${
                isRecording ? 'bg-error' : 'bg-primary'
              } text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors hover:opacity-90`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-5 h-5" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
                  <span>Start Recording</span>
                </>
              )}
            </button>

            <button
              onClick={copyToClipboard}
              disabled={!transcript}
              className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          <TranscriptDisplay transcript={transcript} isRecording={isRecording} />
        </div>
      </div>
    </div>
  );
};

export default SpeechRecorder;

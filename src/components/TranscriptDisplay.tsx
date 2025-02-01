import React from 'react';
import { highlightKeywords } from '@/utils/speechUtils';

interface TranscriptDisplayProps {
  transcript: string;
  isRecording: boolean;
}

const TranscriptDisplay = ({ transcript, isRecording }: TranscriptDisplayProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="transcript-container">
        {transcript ? (
          <p 
            className="text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlightKeywords(transcript) }}
          />
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
import React, { useState, useRef } from 'react';
import axios from 'axios';

interface GeneratedCodeResponse {
  id: number;
  idea: string;
  code: string;
  generated_at: string;
}

const InputForm: React.FC = () => {
  const [idea, setIdea] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const API_BASE_URL = process.env.REACT_APP_API_URL || '/.netlify/functions';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post<GeneratedCodeResponse>(`${API_BASE_URL}/generate-code`, {
        idea: idea.trim()
      });
      
      setGeneratedCode(response.data.code);
    } catch (error) {
      console.error('Error generating code:', error);
      alert('Failed to generate code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64 for AWS Transcribe
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binaryString = '';
      for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
      }
      const base64Audio = btoa(binaryString);
      
      const response = await axios.post(`${API_BASE_URL}/transcribe`, {
        audio: base64Audio
      });
      
      if (response.data.transcription) {
        setIdea(prev => prev + ' ' + response.data.transcription);
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('Failed to transcribe audio. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        CodeCrafter
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
            Describe your app idea
          </label>
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Enter your app idea here... (e.g., 'Create a todo app with user authentication')"
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                clipRule="evenodd"
              />
            </svg>
            {isRecording ? 'Stop Recording' : 'Voice Input'}
          </button>

          <button
            type="submit"
            disabled={isLoading || !idea.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {isLoading ? 'Generating...' : 'Generate Code'}
          </button>
        </div>
      </form>

      {generatedCode && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Code</h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-sm">
            <code>{generatedCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default InputForm;
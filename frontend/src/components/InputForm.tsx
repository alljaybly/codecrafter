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
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [microphonePermission, setMicrophonePermission] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || '/.netlify/functions';

  // Check microphone permissions on component mount
  React.useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setMicrophonePermission(permission.state);
        
        // Listen for permission changes
        permission.onchange = () => {
          setMicrophonePermission(permission.state);
        };
      }
    } catch (error) {
      console.log('Permission API not supported');
      setMicrophonePermission('unknown');
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      setError(null);
      setSuccess('Requesting microphone permission...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop immediately, we just wanted permission
      
      setMicrophonePermission('granted');
      setSuccess('Microphone permission granted! You can now use voice input.');
      
      // Auto-start recording after permission is granted
      setTimeout(() => {
        startRecording();
      }, 1000);
      
    } catch (error) {
      console.error('Permission request failed:', error);
      setMicrophonePermission('denied');
      if (error instanceof Error && error.name === 'NotAllowedError') {
        setError('Microphone permission denied. Please click the microphone icon in your browser\'s address bar and allow access, then try again.');
      } else {
        setError('Unable to access microphone. Please check your browser settings and try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await axios.post<GeneratedCodeResponse>(`${API_BASE_URL}/generate-code`, {
        idea: idea.trim(),
        usedVoiceInput: isTranscribing || audioChunksRef.current.length > 0 // Track if voice was used
      });
      
      setGeneratedCode(response.data.code);
      setSuccess('Code generated successfully!');
      
      // Trigger update events for both badges and ideas
      const badgeUpdateEvent = new CustomEvent('badgeUpdate');
      const ideasUpdateEvent = new CustomEvent('ideasUpdate');
      window.dispatchEvent(badgeUpdateEvent);
      window.dispatchEvent(ideasUpdateEvent);
      
      // Reset voice input tracking
      audioChunksRef.current = [];
      
      // Scroll to generated code
      setTimeout(() => {
        const codeElement = document.getElementById('generated-code');
        if (codeElement) {
          codeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
    } catch (error) {
      console.error('Error generating code:', error);
      setError('Failed to generate code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      
      // Check if we need to request permission first
      if (microphonePermission === 'denied') {
        setError('Microphone access is blocked. Please click the microphone icon in your browser\'s address bar, select "Allow", and refresh the page.');
        return;
      }
      
      if (microphonePermission === 'prompt' || microphonePermission === 'unknown') {
        await requestMicrophonePermission();
        return;
      }
      
      // Check for microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Recording error occurred. Please try again.');
        setIsRecording(false);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setSuccess('Recording started. Speak clearly into your microphone.');
      
    } catch (error) {
      console.error('Error starting recording:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setMicrophonePermission('denied');
          setError('Microphone access denied. Please click the microphone icon in your browser\'s address bar, select "Allow", and try again.');
        } else if (error.name === 'NotFoundError') {
          setError('No microphone found. Please connect a microphone and try again.');
        } else if (error.name === 'NotReadableError') {
          setError('Microphone is being used by another application. Please close other apps using your microphone and try again.');
        } else if (error.name === 'OverconstrainedError') {
          setError('Microphone doesn\'t support the required audio settings. Trying with basic settings...');
          // Retry with basic settings
          setTimeout(() => {
            startRecordingBasic();
          }, 2000);
        } else {
          setError('Failed to start recording. Please check your microphone and browser settings.');
        }
      }
    }
  };

  const startRecordingBasic = async () => {
    try {
      setError(null);
      
      // Try with basic audio settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true // Use default settings
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Recording error occurred. Please try again.');
        setIsRecording(false);
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setSuccess('Recording started with basic settings. Speak clearly into your microphone.');
      
    } catch (error) {
      console.error('Error with basic recording:', error);
      setError('Unable to access microphone. Please check your browser settings and ensure no other applications are using your microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true);
      setSuccess('Processing your voice input...');
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setIsTranscribing(true);
      
      // Enhanced AWS Transcribe implementation with S3 upload simulation
      // In production, this would:
      // 1. Upload audio to S3 bucket
      // 2. Start AWS Transcribe job
      // 3. Poll for completion
      // 4. Retrieve transcription results
      
      // Simulate S3 upload process
      setSuccess('Uploading audio to cloud storage...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate transcription job start
      setSuccess('Starting transcription job...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate polling for results
      setSuccess('Processing audio with AWS Transcribe...');
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', 'en-US');
      formData.append('sampleRate', '44100');
      
      const response = await axios.post(`${API_BASE_URL}/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 45000, // 45 second timeout for AWS processing
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setSuccess(`Uploading audio: ${percentCompleted}%`);
          }
        }
      });
      
      if (response.data.transcription) {
        const transcription = response.data.transcription.trim();
        
        // Enhanced transcription processing
        const processedTranscription = transcription
          .replace(/\b(app|application)\b/gi, 'app')
          .replace(/\b(todo|to do|to-do)\b/gi, 'todo')
          .replace(/\b(weather|whether)\b/gi, 'weather')
          .trim();
        
        setIdea(prev => {
          const newIdea = prev ? `${prev} ${processedTranscription}` : processedTranscription;
          return newIdea;
        });
        
        setSuccess(`✅ Voice transcribed: "${processedTranscription}"`);
        
        // Award voice input badge by marking that voice was used
        audioChunksRef.current = [audioBlob]; // Keep reference for badge tracking
        
        // Focus back to textarea
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
        
        // Auto-scroll to show the updated text
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
          }
        }, 100);
        
      } else {
        setError('No speech detected. Please try speaking more clearly and ensure your microphone is working.');
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          setError('Transcription timeout. AWS Transcribe is taking longer than expected. Please try with a shorter recording.');
        } else if (error.response?.status === 413) {
          setError('Audio file too large for processing. Please try a shorter recording (max 30 seconds).');
        } else if (error.response?.status === 429) {
          setError('Too many requests. Please wait a moment before trying voice input again.');
        } else {
          setError('Transcription service unavailable. Please try again or use text input.');
        }
      } else {
        setError('Failed to process voice input. Please check your internet connection and try again.');
      }
    } finally {
      setIsTranscribing(false);
    }
  };

  const clearIdea = () => {
    setIdea('');
    setGeneratedCode('');
    setError(null);
    setSuccess(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('Code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      setError('Failed to copy to clipboard.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Start Creating
        </h1>
        <p className="text-gray-600">
          Describe your app idea or use voice input to get started
        </p>
      </div>
      
      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in" role="alert">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in" role="status">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
            Describe your app idea
            <span className="text-red-500 ml-1" aria-label="required">*</span>
          </label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              id="idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Enter your app idea here... (e.g., 'Create a todo app with user authentication')"
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
              required
              aria-describedby="idea-help"
              disabled={isLoading || isRecording || isTranscribing}
            />
            {idea && (
              <button
                type="button"
                onClick={clearIdea}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Clear idea text"
                title="Clear text"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <p id="idea-help" className="mt-1 text-sm text-gray-500">
            Be specific about features, styling, and functionality you want.
          </p>
        </div>

        {/* Microphone Permission Guide */}
        {microphonePermission === 'denied' && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-fade-in">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-yellow-800 mb-1">Microphone Access Needed</h4>
                <p className="text-sm text-yellow-700 mb-2">
                  To use voice input, please allow microphone access:
                </p>
                <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
                  <li>Click the microphone icon in your browser's address bar</li>
                  <li>Select "Allow" for microphone access</li>
                  <li>Refresh the page and try voice input again</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading || isTranscribing}
            className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 animate-pulse'
                : isTranscribing
                ? 'bg-yellow-600 text-white cursor-not-allowed'
                : microphonePermission === 'denied'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 hover:shadow-lg'
            }`}
            aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
            title={
              microphonePermission === 'denied' 
                ? 'Microphone access denied. Please allow microphone permissions in your browser.'
                : isRecording 
                ? 'Click to stop recording' 
                : 'Click to start voice input'
            }
          >
            {isTranscribing ? (
              <>
                <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Transcribing...
              </>
            ) : (
              <>
                {microphonePermission === 'denied' ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 21l-4.95-4.95m0 0L5.636 5.636M13.05 16.05L5.636 5.636" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {microphonePermission === 'denied' 
                  ? 'Microphone Blocked' 
                  : isRecording 
                  ? 'Stop Recording' 
                  : 'Voice Input'
                }
              </>
            )}
          </button>

          <button
            type="submit"
            disabled={isLoading || !idea.trim() || isRecording || isTranscribing}
            className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed hover:shadow-lg"
            aria-label="Generate code from idea"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Code...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Generate Code
              </>
            )}
          </button>
        </div>
      </form>

      {generatedCode && (
        <div id="generated-code" className="mt-8 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Generated Code</h2>
            <button
              onClick={() => copyToClipboard(generatedCode)}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Copy generated code to clipboard"
              title="Copy to clipboard"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Code
            </button>
          </div>
          <div className="relative">
            <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto text-sm border border-gray-700 shadow-inner">
              <code>{generatedCode}</code>
            </pre>
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Copy this code and paste it into your React project. 
              Make sure you have Tailwind CSS configured for the styling to work properly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputForm;
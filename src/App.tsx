import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Download, RotateCcw, Sparkles, Image, Video, MessageSquare, Plus, History, Settings, Menu, X, FileText, Edit3 } from 'lucide-react';
import { useUI } from './context/UIContext';

type AppState = 'input' | 'loading' | 'script' | 'results';

interface UploadedFile {
  file: File;
  preview: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  description: string;
}

function App() {
  const [currentState, setCurrentState] = useState<AppState>('input');
  const [eventDescription, setEventDescription] = useState('');
  const [userPhoto, setUserPhoto] = useState<UploadedFile | null>(null);
  const [eventPhotos, setEventPhotos] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { sidebarOpen, closeSidebar, toggleSidebar } = useUI();

  const [generatedScript, setGeneratedScript] = useState('');
  const [isEditingScript, setIsEditingScript] = useState(false);

  const [chatSessions] = useState<ChatSession[]>([
    { id: '1', title: 'Wedding Recreation', timestamp: new Date(2024, 11, 15), description: 'Beautiful wedding ceremony at sunset' },
    { id: '2', title: 'Birthday Party', timestamp: new Date(2024, 11, 10), description: 'Kids birthday party with cake and balloons' },
    { id: '3', title: 'Concert Experience', timestamp: new Date(2024, 11, 5), description: 'Rock concert with amazing light show' },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const eventInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null, type: 'user' | 'event') => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        const uploadedFile = { file, preview };

        if (type === 'user') {
          setUserPhoto(uploadedFile);
        } else {
          setEventPhotos(prev => [...prev, uploadedFile]);
        }
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'user' | 'event') => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files, type);
  };

  const generateScriptFromInputs = (): string => {
    const photoCount = eventPhotos.length;
    const description = eventDescription.trim();
    const intro = description
      ? `Recreating: ${description}`
      : 'Recreating your special moment';
    return [
      `${intro}.`,
      `Scene 1: A gentle fade-in over ${photoCount} captured memories, highlighting authentic emotions.`,
      'Scene 2: Subtle parallax on key photos, with warm cinematic color tones.',
      'Scene 3: Close-up emphasis on the main subject, matched to ambient music beats.',
      'Outro: Title card with date and a soft vignette, ending on a hopeful note.'
    ].join('\n');
  };

  const handleGenerate = () => {
    if (!eventDescription.trim() || !userPhoto || eventPhotos.length === 0) return;
    
    setCurrentState('loading');
    
    // Simulate AI processing
    setTimeout(() => {
      setGeneratedScript(generateScriptFromInputs());
      setIsEditingScript(false);
      setCurrentState('script');
    }, 3000);
  };

  const handleRegenerateScript = () => {
    setGeneratedScript(generateScriptFromInputs());
  };

  const handleToggleEdit = () => {
    setIsEditingScript(prev => !prev);
  };

  const handleApproveScript = () => {
    setCurrentState('results');
  };

  const handleRestart = () => {
    setCurrentState('input');
    setEventDescription('');
    setUserPhoto(null);
    setEventPhotos([]);
    setGeneratedScript('');
    setIsEditingScript(false);
  };

  // If needed later: utility to remove an event photo by index
  // const removeEventPhoto = (index: number) => {
  //   setEventPhotos(prev => prev.filter((_, i) => i !== index));
  // };

  // Close sidebar with Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        closeSidebar();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen, closeSidebar]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div
        id="chat-history-panel"
        role="complementary"
        aria-label="Chat history"
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-black/20 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!sidebarOpen && undefined}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">AI Recreator</h2>
              </div>
              <button
                onClick={closeSidebar}
                className="lg:hidden text-gray-400 hover:text-white transition-colors"
                aria-label="Close chat history"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <button className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 rounded-lg text-white text-sm font-medium hover:from-cyan-500/30 hover:to-violet-500/30 transition-all duration-200 flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" />
              New Recreation
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <History className="h-3 w-3" />
                Recent Sessions
              </h3>
              {chatSessions.map((session) => (
                <button
                  key={session.id}
                  className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 group-hover:text-cyan-400 transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{session.title}</p>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{session.description}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {session.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10">
            <button className="w-full py-2 px-4 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header (Now also on desktop) */}
        <header className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle chat history"
              aria-expanded={sidebarOpen}
              aria-controls="chat-history-panel"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-cyan-400" />
              <h1 className="text-lg font-semibold text-white">AI Event Recreator</h1>
            </div>
            <div className="w-6" />
          </div>
        </header>

        {/* Main Content Area */}
        <div>
          {currentState === 'input' && (
            <div className="max-w-4xl mx-auto px-6 py-8 lg:py-16">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Missed the Moment?{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                    Relive It with AI.
                  </span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Upload your photo + event photos, and let AI create a 30-sec video or photostory.
                </p>
              </div>

              {/* Streamlined Input Area */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl max-w-2xl mx-auto">
                {/* Event Description */}
                <div className="mb-6">
                  <textarea
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Describe the event (e.g., wedding, concert, birthday)..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 resize-none transition-all duration-200"
                    rows={2}
                  />
                </div>

                {/* Compact File Upload */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* User Photo */}
                  <div
                    className={`relative border border-dashed rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                      isDragOver
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-white/30 bg-white/5'
                    } hover:border-cyan-400/50 hover:bg-cyan-400/5`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'user')}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files, 'user')}
                    />
                    
                    {userPhoto ? (
                      <div className="text-center">
                        <img
                          src={userPhoto.preview}
                          alt="User photo"
                          className="w-12 h-12 object-cover rounded-lg mx-auto mb-2"
                        />
                        <p className="text-green-400 text-xs">Your photo</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-300 text-xs">Your photo</p>
                      </div>
                    )}
                  </div>

                  {/* Event Photos */}
                  <div
                    className={`relative border border-dashed rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                      isDragOver
                        ? 'border-violet-400 bg-violet-400/10'
                        : 'border-white/30 bg-white/5'
                    } hover:border-violet-400/50 hover:bg-violet-400/5`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'event')}
                    onClick={() => eventInputRef.current?.click()}
                  >
                    <input
                      ref={eventInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files, 'event')}
                    />
                    
                    {eventPhotos.length > 0 ? (
                      <div className="text-center">
                        <div className="flex justify-center gap-1 mb-2">
                          {eventPhotos.slice(0, 2).map((photo, index) => (
                            <img
                              key={index}
                              src={photo.preview}
                              alt={`Event photo ${index + 1}`}
                              className="w-6 h-6 object-cover rounded"
                            />
                          ))}
                          {eventPhotos.length > 2 && (
                            <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-white text-xs">
                              +{eventPhotos.length - 2}
                            </div>
                          )}
                        </div>
                        <p className="text-green-400 text-xs">
                          {eventPhotos.length} event photo{eventPhotos.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Image className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-300 text-xs">Event photos</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!eventDescription.trim() || !userPhoto || eventPhotos.length === 0}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-violet-400 transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate AI Recreation
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {currentState === 'loading' && (
            <div className="flex items-center justify-center min-h-screen px-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-white/10 shadow-2xl text-center max-w-md">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-violet-400 animate-spin animate-reverse" style={{ animationDuration: '0.8s' }}></div>
                </div>
                
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                  ))}
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">AI is Working Its Magic</h3>
                <p className="text-gray-300 text-sm">Analyzing your photos and recreating the perfect moment...</p>
              </div>
            </div>
          )}

          {/* Script Review State */}
          {currentState === 'script' && (
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-cyan-400" />
                  Script Review
                </h3>
                <p className="text-gray-300">Review or edit the generated script before creating your video.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm">Draft based on your inputs</span>
                  <button
                    onClick={handleToggleEdit}
                    className="py-2 px-3 bg-white/10 border border-white/20 rounded-lg text-white font-medium hover:bg-white/20 transition-all duration-200 flex items-center gap-2 text-sm"
                  >
                    <Edit3 className="h-4 w-4" />
                    {isEditingScript ? 'Done Editing' : 'Edit Script'}
                  </button>
                </div>

                {isEditingScript ? (
                  <textarea
                    value={generatedScript}
                    onChange={(e) => setGeneratedScript(e.target.value)}
                    className="w-full min-h-[220px] px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200"
                  />
                ) : (
                  <pre className="whitespace-pre-wrap text-gray-100 bg-black/30 border border-white/10 rounded-xl p-4 min-h-[220px]">
                    {generatedScript}
                  </pre>
                )}

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={handleRegenerateScript}
                    className="py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-200"
                  >
                    Generate Another
                  </button>
                  <button
                    onClick={handleRestart}
                    className="py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-200"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleApproveScript}
                    className="py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl text-white font-semibold hover:from-cyan-400 hover:to-violet-400 transition-all duration-200"
                  >
                    Approve & Generate Video
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results State */}
          {currentState === 'results' && (
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-2">Your AI Recreation is Ready!</h3>
                <p className="text-gray-300">Here's your personalized event recreation</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                {/* Video Preview */}
                <div className="bg-black/50 rounded-xl mb-6 aspect-video flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-violet-500/20"></div>
                  <Play className="h-16 w-16 text-white/80 hover:text-white cursor-pointer transition-colors duration-200" />
                  <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full">
                    <span className="text-white text-sm flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      30s AI Recreation
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-semibold hover:from-green-400 hover:to-emerald-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-500/25">
                    <Download className="h-5 w-5" />
                    Download Video
                  </button>
                  
                  <button 
                    onClick={handleRestart}
                    className="flex-1 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Create Another
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center py-6 px-6 border-t border-white/10 bg-black/10 backdrop-blur-xl">
          <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-cyan-400 transition-colors duration-200">About</a>
            <a href="#" className="hover:text-cyan-400 transition-colors duration-200">Privacy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors duration-200">Contact</a>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            © {new Date().getFullYear()} AI Event Recreator. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeSidebar}
          role="button"
          aria-label="Close sidebar overlay"
          tabIndex={-1}
        />
      )}
    </div>
  );
}

export default App;
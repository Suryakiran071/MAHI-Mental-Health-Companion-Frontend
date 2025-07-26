// Enhanced Meditation.js with Updated Frontend Styling
import React, { useState, useEffect } from 'react';
import { speakText, stopSpeech, isSpeaking } from './TextToSpeech.js';

// Import the Particles component
import Particles from './Components/Particles';

const meditationTypes = [
  { id: 'insomnia', icon: '🌙', title: 'Sleep & Insomnia', desc: 'Peaceful meditations for better sleep and rest', tags: ['Relaxation', 'Night'] },
  { id: 'panic', icon: '💨', title: 'Panic Relief', desc: 'Grounding techniques for panic and overwhelm', tags: ['Emergency', 'Breathing'] },
  { id: 'anxiety', icon: '😰', title: 'Anxiety', desc: 'Calm guidance for anxious minds', tags: ['Breathwork', 'Grounding'] },
  { id: 'sadness', icon: '😢', title: 'Sadness & Grief', desc: 'Gentle healing for emotional pain and loss', tags: ['Healing', 'Compassion'] },
  { id: 'overthinking', icon: '🔄', title: 'Overthinking', desc: 'Quiet the mind and reduce racing thoughts', tags: ['Stillness', 'Focus'] },
  { id: 'low self-esteem', icon: '🌱', title: 'Self-Esteem', desc: 'Affirming your worth and inner value', tags: ['Confidence', 'Worthiness'] },
  { id: 'guilt', icon: '⚖️', title: 'Guilt', desc: 'Let go of shame and self-blame', tags: ['Forgiveness', 'Self-Kindness'] },
  { id: 'fear of failure', icon: '🚧', title: 'Fear of Failure', desc: 'Overcome fear and build resilience', tags: ['Courage', 'Growth'] },
  { id: 'burnout', icon: '🔥', title: 'Burnout', desc: 'Restore energy and calm', tags: ['Recovery', 'Balance'] },
  { id: 'anger', icon: '😡', title: 'Anger', desc: 'Release tension and find peace', tags: ['Calm', 'Release'] },
  { id: 'exam fear', icon: '📘', title: 'Exam Fear', desc: 'Relax and focus during study pressure', tags: ['Focus', 'Calm'] },
  { id: 'low confidence', icon: '🪞', title: 'Low Confidence', desc: 'Build inner belief and assurance', tags: ['Empowerment', 'Positivity'] },
  { id: 'intrusive thoughts', icon: '🧠', title: 'Intrusive Thoughts', desc: 'Detach and observe without judgment', tags: ['Mindfulness', 'Detachment'] },
  { id: 'social anxiety', icon: '🙈', title: 'Social Anxiety', desc: 'Ground and build presence in social settings', tags: ['Presence', 'Calm'] },
  { id: 'loneliness', icon: '🌧️', title: 'Loneliness', desc: 'Feel connected and supported', tags: ['Connection', 'Warmth'] },
  { id: 'perfectionism', icon: '🎯', title: 'Perfectionism', desc: 'Release the need to be perfect', tags: ['Let Go', 'Acceptance'] },
  { id: 'decision fatigue', icon: '🧭', title: 'Decision Fatigue', desc: 'Restore clarity and ease in choices', tags: ['Clarity', 'Focus'] },
  { id: 'self-acceptance', icon: '🫶', title: 'Self-Acceptance', desc: 'Embrace yourself as you are', tags: ['Compassion', 'Peace'] },
  { id: 'motivation loss', icon: '💤', title: 'Motivation Loss', desc: 'Reignite purpose and drive', tags: ['Energy', 'Purpose'] },
  { id: 'general relaxation', icon: '🛁', title: 'General Relaxation', desc: 'Unwind with calming, soothing breathwork', tags: ['Relaxation', 'Peace'] }
];

const MeditationCard = ({ id, icon, title, desc, tags, onClick, darkMode }) => (
  <div 
    className={`${darkMode ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-white text-zinc-900 border-gray-100'} p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer w-full border`}
    onClick={onClick}
  >
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{title}</h3>
    <p className={`text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-600'} mb-3 leading-relaxed`}>{desc}</p>
    <div className="flex gap-2 flex-wrap">
      {tags.map(tag => (
        <span 
          key={tag} 
          className={`${darkMode ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'} text-xs font-medium px-3 py-1 rounded-full`}
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const StepCard = ({ stepNumber, stepTitle, stepContent, darkMode }) => (
  <div className={`${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm p-6 border w-full mb-4`}>
    <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
      Step {stepNumber}: {stepTitle}
    </h3>
    <p className={`${darkMode ? 'text-zinc-300' : 'text-zinc-700'} leading-relaxed text-base`}>
      {stepContent}
    </p>
  </div>
);

function Meditation() {
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Check if speech is still playing
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaying(isSpeaking());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const fetchMeditation = async (id) => {
    setSelected(id);
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      // Use your backend URL - adjust port if needed
      const res = await fetch(`http://localhost:8000/meditation/dynamic/?issue=${encodeURIComponent(id)}&use_llm=true`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setData({ 
        script: "Unable to fetch meditation. Please check if the backend server is running on port 8000.",
        title: "Error",
        tags: ["Error"]
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = () => {
    if (isSpeaking()) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      if (data?.script) {
        speakText(data.script);
        setIsPlaying(true);
      }
    }
  };

  const handleBackToSelection = () => {
    stopSpeech();
    setSelected(null);
    setData(null);
    setError(null);
    setIsPlaying(false);
  };

  const parseMeditationSteps = (script) => {
    if (!script) return [];
    
    // Split by "Step X:" pattern - using a more robust approach
    const steps = [];
    
    // First, try to split by Step pattern
    const stepSections = script.split(/(?=Step\s+\d+:)/gi);
    
    stepSections.forEach((section, index) => {
      const trimmedSection = section.trim();
      if (!trimmedSection) return;
      
      // Extract step number and content
      const stepMatch = trimmedSection.match(/^Step\s+(\d+):\s*(.*)/is);
      
      if (stepMatch) {
        const stepNumber = parseInt(stepMatch[1]);
        const stepContent = stepMatch[2].trim();
        
        if (stepContent) {
          // Extract title (first line or first sentence)
          const lines = stepContent.split('\n');
          const firstLine = lines[0].trim();
          
          // Try to find a title by looking for common patterns
          let title = '';
          let content = stepContent;
          
          // If first line is short (likely a title), use it as title
          if (firstLine.length < 50 && lines.length > 1) {
            title = firstLine;
            content = lines.slice(1).join('\n').trim();
          } else {
            // Extract first sentence as title
            const firstSentence = firstLine.split('.')[0];
            if (firstSentence.length < 80) {
              title = firstSentence;
              content = stepContent.replace(firstSentence, '').replace(/^[.\s]+/, '');
            } else {
              // Use a generic title
              title = `Meditation Step ${stepNumber}`;
              content = stepContent;
            }
          }
          
          steps.push({
            number: stepNumber,
            title: title,
            content: content
          });
        }
      } else if (index === 0 && trimmedSection && !trimmedSection.match(/^Step\s+\d+:/i)) {
        // Handle introduction text before Step 1
        steps.push({
          number: 1,
          title: 'Introduction',
          content: trimmedSection
        });
      }
    });
    
    // If no steps found with the pattern, try to split by line breaks and create steps
    if (steps.length === 0) {
      const lines = script.split('\n').filter(line => line.trim());
      lines.forEach((line, index) => {
        if (line.trim()) {
          steps.push({
            number: index + 1,
            title: `Step ${index + 1}`,
            content: line.trim()
          });
        }
      });
    }
    
    // Sort steps by number to ensure proper order
    return steps.sort((a, b) => a.number - b.number);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-zinc-900'} relative overflow-hidden`}>
      {/* Particle Background */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0
      }}>
        <Particles
          particleColors={['#008000', '#008000']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Dark Mode Toggle */}
      <div className="fixed top-20 right-5 z-50">
        <label className={`relative inline-block w-16 h-8 ${darkMode ? 'bg-zinc-800 border-zinc-600' : 'bg-white border-gray-200'} rounded-full shadow-lg border-2`}>
          <input
            type="checkbox"
            className="absolute opacity-0 w-0 h-0 peer"
            checked={darkMode}
            onChange={(e) => {
              setDarkMode(e.target.checked);
            }}
          />
          <span className={`absolute inset-0 cursor-pointer ${darkMode ? 'bg-blue-900' : 'bg-blue-300'} rounded-full transition-colors duration-300`}></span>
          <span
            className={`absolute top-0 mt-1 left-1 z-20 w-6 h-6 bg-white rounded-full transition-all duration-300 transform shadow-sm ${
              darkMode ? 'translate-x-8' : 'translate-x-0'
            }`}
          />
          <span className={`absolute top-1 left-1 z-10 text-blue-800 transition-opacity duration-300 ${darkMode ? 'opacity-0' : 'opacity-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 384 512">
              <path fill="currentColor" d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
            </svg>
          </span>
          <span className={`absolute top-1 right-1 z-10 text-yellow-500 transition-opacity duration-300 ${darkMode ? 'opacity-100' : 'opacity-0'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24">
              <g fill="currentColor">
                <circle r="5" cy="12" cx="12"></circle>
                <path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z" />
              </g>
            </svg>
          </span>
        </label>
      </div>

      <div className="max-w-6xl mx-auto pt-24 px-8 relative z-10">

        {!selected && (
          <div className={`${darkMode ? 'bg-zinc-800/90 border-zinc-700' : 'bg-white/90 border-gray-200'} backdrop-blur-sm rounded-2xl shadow-lg p-8 border-2`}>
            <div className="text-center mb-8">
              <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'} mb-4`}>Choose Your Meditation Journey</h2>
              <p className={`${darkMode ? 'text-zinc-300' : 'text-zinc-600'} text-lg max-w-2xl mx-auto`}>
                Select a meditation type below to receive a personalized AI-generated meditation session
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {meditationTypes.map(card => (
                <MeditationCard 
                  key={card.id} 
                  {...card} 
                  onClick={() => fetchMeditation(card.id)} 
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        )}

        {selected && (
          <div className={`${darkMode ? 'bg-zinc-800/90 border-zinc-700' : 'bg-white/90 border-gray-200'} backdrop-blur-sm rounded-2xl shadow-lg p-8 border-2`}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
              <div className="flex-1">
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'} mb-2`}>
                  {data?.title || 'Meditation'}
                </h2>
                <div className={`flex flex-wrap items-center gap-2 text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  <span>{data?.tags?.join(', ')}</span>
                  <span>•</span>
                  <span>Duration: {data?.duration || 'Variable'}</span>
                  {data?.source && (
                    <>
                      <span>•</span>
                      <span className={`${darkMode ? 'text-indigo-400' : 'text-indigo-600'} font-medium`}>
                        {data.source === 'llm_generated' ? 'AI Generated' : 'Cached'}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={handlePlayAudio} 
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    isPlaying 
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                      : `${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={loading || !data?.script}
                >
                  {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                </button>
                <button 
                  onClick={handleBackToSelection} 
                  className={`px-6 py-3 ${darkMode ? 'bg-zinc-700 hover:bg-zinc-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-zinc-700'} rounded-lg font-medium transition-colors`}
                >
                  ← Choose Another
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {loading && (
                <div className="text-center py-12">
                  <div className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 ${darkMode ? 'border-indigo-400' : 'border-indigo-500'} mb-4`}></div>
                  <p className={`${darkMode ? 'text-zinc-300' : 'text-zinc-600'} text-lg`}>Generating your personalized meditation...</p>
                </div>
              )}
              
              {error && (
                <div className={`${darkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200'} border rounded-lg p-6 text-center`}>
                  <p className={`${darkMode ? 'text-red-300' : 'text-red-600'} mb-4`}>⚠️ {error}</p>
                  <button 
                    onClick={() => fetchMeditation(selected)} 
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
              
              {data?.script && !loading && (
                <div className="space-y-4">
                  {/* Render steps as individual cards */}
                  {parseMeditationSteps(data.script).map((step, index) => (
                    <StepCard
                      key={index}
                      stepNumber={step.number}
                      stepTitle={step.title}
                      stepContent={step.content}
                      darkMode={darkMode}
                    />
                  ))}
                  
                  {data.knowledge_used && (
                    <div className="flex justify-center mt-6">
                      <div className={`inline-block ${darkMode ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-indigo-500 to-purple-500'} text-white px-6 py-3 rounded-full text-sm font-medium`}>
                        ✨ Enhanced with expert meditation knowledge
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Meditation;
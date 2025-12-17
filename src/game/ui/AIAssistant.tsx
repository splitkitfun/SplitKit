'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PlayerState, ITEMS, xpForLevel } from '../types';

interface AIAssistantProps {
  state: PlayerState;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Stub AI responses based on player state
const generateResponse = (input: string, state: PlayerState): string => {
  const lowerInput = input.toLowerCase();
  
  // Skill-related questions
  if (lowerInput.includes('woodcutting') || lowerInput.includes('chop') || lowerInput.includes('tree')) {
    const level = state.skills.woodcutting.level;
    const xp = state.skills.woodcutting.xp;
    const nextXp = xpForLevel(level);
    
    if (level < 5) {
      return `Your Woodcutting is level ${level} (${xp}/${nextXp} XP). Keep chopping regular trees to reach level 5, which unlocks Oak trees for more XP!`;
    } else if (level < 10) {
      return `Nice progress! At level ${level}, you can chop Oak trees. Get to level 10 to unlock Willow trees in Draynor Swamp.`;
    } else if (level < 15) {
      return `You're doing great at level ${level}! Willow trees are available in the swamp. Level 15 unlocks Maple trees in the Forest Edge.`;
    } else {
      return `Impressive! At level ${level}, you can chop all tree types including Maple. Keep grinding for higher levels!`;
    }
  }
  
  if (lowerInput.includes('fishing') || lowerInput.includes('fish') || lowerInput.includes('catch')) {
    const level = state.skills.fishing.level;
    if (level < 5) {
      return `Your Fishing is level ${level}. Head to the Riverbank area to catch shrimp. At level 5, you can catch trout for more XP!`;
    } else {
      return `At level ${level}, you can catch both shrimp and trout. Cook them at campfires to restore energy!`;
    }
  }
  
  if (lowerInput.includes('cook') || lowerInput.includes('food') || lowerInput.includes('energy')) {
    const rawShrimp = state.inventory.find(s => s.itemId === 'raw_shrimp')?.quantity || 0;
    const rawTrout = state.inventory.find(s => s.itemId === 'raw_trout')?.quantity || 0;
    
    if (rawShrimp > 0 || rawTrout > 0) {
      return `You have ${rawShrimp} raw shrimp and ${rawTrout} raw trout. Find a campfire (there's one in Forest Edge) to cook them. Cooked fish restores energy when eaten!`;
    } else {
      return `Catch some fish at the Riverbank, then cook them at a campfire to make food. Eating cooked fish restores your energy for sprinting!`;
    }
  }
  
  // Quest-related
  if (lowerInput.includes('quest')) {
    const incomplete = Object.values(state.quests).filter(q => !q.completed);
    if (incomplete.length === 0) {
      return `Amazing! You've completed all available quests. More content coming soon!`;
    }
    const quest = incomplete[0];
    return `Current quest: "${quest.name}" - ${quest.description}. Progress: ${quest.progress}/${quest.goal}.`;
  }
  
  // Location/area questions
  if (lowerInput.includes('where') || lowerInput.includes('area') || lowerInput.includes('map')) {
    return `The world has 4 areas: Lumbridge Woods (start), Draynor Swamp (west), Riverbank (south), and Forest Edge (east). Walk to the edge of an area to travel to adjacent regions.`;
  }
  
  // Bank questions
  if (lowerInput.includes('bank')) {
    return `The bank is in Lumbridge Woods near the spawn point. Store items there to keep them safe. Your bank currently has ${state.bank.length} item stacks.`;
  }
  
  // What to do next
  if (lowerInput.includes('what') && (lowerInput.includes('do') || lowerInput.includes('next'))) {
    const incomplete = Object.values(state.quests).filter(q => !q.completed);
    if (incomplete.length > 0) {
      return `I suggest working on the "${incomplete[0].name}" quest: ${incomplete[0].description}. You're at ${incomplete[0].progress}/${incomplete[0].goal}.`;
    }
    if (state.skills.woodcutting.level < 15) {
      return `Try leveling Woodcutting to unlock higher-tier trees. Each tree type gives more XP!`;
    }
    return `Explore all areas, complete quests, and max out your skills. You're doing great!`;
  }
  
  // Default responses
  if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return `Hello, adventurer! I'm here to help you on your journey. Ask me about skills, quests, or where to go next!`;
  }
  
  if (lowerInput.includes('help')) {
    return `I can help with: Woodcutting, Fishing, Cooking, Quests, Bank, Areas/Map. Try asking "What should I do next?" or "How do I level fishing?"`;
  }
  
  return `I'm not sure about that. Try asking about skills (woodcutting, fishing), quests, or areas. Or ask "What should I do next?"`;
};

export const AIAssistant: React.FC<AIAssistantProps> = ({ state, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello! I'm your game assistant. I can help you with skills, quests, and navigation. What would you like to know?` }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    
    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(userMessage, state);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed right-64 top-0 bottom-12 w-80 bg-[#0a0a0f]/95 border-l border-[#2a2a20] flex flex-col z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#2a2a20]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <span 
            className="text-[#8aaacc]"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
          >
            AI Assistant
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-[#6a6a5a] hover:text-[#aa6a6a] transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-2 rounded ${
                msg.role === 'user'
                  ? 'bg-[#2a3a4a] text-[#aaccee]'
                  : 'bg-[#1a1a15] text-[#9a9a8a]'
              }`}
              style={{ fontFamily: 'monospace', fontSize: '11px' }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      <div className="px-3 pb-2 flex flex-wrap gap-1">
        {['What next?', 'Quests', 'Skills', 'Help'].map(suggestion => (
          <button
            key={suggestion}
            onClick={() => {
              setInput(suggestion);
              setTimeout(handleSend, 100);
            }}
            className="px-2 py-1 bg-[#1a1a15] border border-[#2a2a20] rounded text-[#6a6a5a] text-[9px] hover:border-[#4a4a3a] hover:text-[#8a8a7a] transition-colors"
            style={{ fontFamily: 'monospace' }}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#2a2a20]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="flex-1 bg-[#151510] border border-[#2a2a20] rounded px-3 py-2 text-[#9a9a8a] text-xs placeholder-[#4a4a3a] focus:outline-none focus:border-[#4a5a6a]"
            style={{ fontFamily: 'monospace' }}
          />
          <button
            onClick={handleSend}
            className="px-3 py-2 bg-[#2a3a4a] hover:bg-[#3a4a5a] border border-[#4a5a6a] rounded text-[#8aaacc] transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-3 pb-2">
        <p className="text-[#3a3a3a] text-[8px] text-center" style={{ fontFamily: 'monospace' }}>
          AI responses are generated locally • No API calls
        </p>
      </div>
    </div>
  );
};


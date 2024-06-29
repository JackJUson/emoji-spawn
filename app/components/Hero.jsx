'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Hero = () => {
  const [emoji, setEmoji] = useState('');
  const [emojis, setEmojis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emojisLoaded, setEmojisLoaded] = useState(false);
  const emojiRef = useRef(null);

  const isFlagEmoji = (emoji) => {
    const codePoints = Array.from(emoji.character).map((char) => char.codePointAt(0));
    return codePoints.some((point) => point >= 0x1f1e6 && point <= 0x1f1ff);
  };

  const isEmojiFromUnicode12OrEarlier = (emoji) => {
    const match = emoji.unicodeName.match(/E(\d+)\.(\d+)/);
    if (!match) return false;
    const major = parseInt(match[1], 10);
    return major < 13;
  };

  const fetchEmojis = async () => {
    try {
      const response = await axios.get(
        `https://emoji-api.com/emojis?access_key=${process.env.NEXT_PUBLIC_EMOJI_KEY}`
      );
      const filteredEmojis = response.data.filter(
        (emoji) =>
          !isFlagEmoji(emoji) && isEmojiFromUnicode12OrEarlier(emoji) && emoji.group !== 'symbols'
      );
      setEmojis(filteredEmojis);
      setEmojisLoaded(true);
    } catch (error) {
      console.error('Error fetching emojis:', error);
    }
  };

  useEffect(() => {
    fetchEmojis();
  }, []);

  const fetchRandomEmoji = () => {
    if (emojis.length === 0) return;
    setLoading(true);
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setEmoji(randomEmoji.character);
    setLoading(false);
    triggerHeartbeatAnimation();
  };

  const triggerHeartbeatAnimation = () => {
    if (emojiRef.current) {
      emojiRef.current.classList.remove('heartbeat-animation');
      void emojiRef.current.offsetWidth;
      emojiRef.current.classList.add('heartbeat-animation');
    }
  };

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center'>
      <div ref={emojiRef} className='text-9xl heartbeat'>
        {emoji ? emoji : '🤔'}
      </div>
      {/* {poppingEmojis.map((e, index) => (
    <span key={index} className={`emoji-pop ${e.animationClass} mb-96`}>
      {e.emoji}
    </span>
  ))} */}
      <h1 className='scroll-m-20 text-6xl font-extrabold tracking-tight mt-40 mb-12'>
        Get your Emoji! 🎯
      </h1>
      <button
        className={`text-6xl font-extrabold tracking-tight z-50 text-white bg-green-500 px-14 py-6 rounded-full ${
          emojisLoaded ? 'active:scale-95 active:bg-green-600' : ''
        }`}
        onClick={fetchRandomEmoji}
        disabled={loading || !emojisLoaded}
      >
        {emojisLoaded ? 'Click Me' : 'Loading...'}
      </button>
    </div>
  );
};

export default Hero;

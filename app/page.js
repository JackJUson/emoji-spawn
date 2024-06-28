'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [emoji, setEmoji] = useState('');
  const [emojis, setEmojis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emojisLoaded, setEmojisLoaded] = useState(false);

  const isFlagEmoji = (emoji) => {
    const codePoints = Array.from(emoji.character).map((char) => char.codePointAt(0));
    return codePoints.some((point) => point >= 0x1F1E6 && point <= 0x1F1FF);
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
        (emoji) => !isFlagEmoji(emoji) && isEmojiFromUnicode12OrEarlier(emoji) && emoji.group !== 'symbols'
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
  };

  return (
    <main className='min-h-screen w-full relative flex flex-col items-center justify-center'>
      <h1 className='scroll-m-20 text-6xl font-extrabold tracking-tight'>
        Shoot for your Emoji! 🎯
      </h1>
      <br />
      <br />
      <button
        className='text-6xl font-extrabold tracking-tight text-white bg-green-500 px-14 py-6 rounded-full active:scale-95 active:bg-green-600'
        onClick={fetchRandomEmoji}
        disabled={loading || !emojisLoaded}
      >
        {loading ? 'Loading...' : 'Click Me'}
      </button>
      <div className='text-6xl mt-6'>{emoji}</div>
    </main>
  );
}

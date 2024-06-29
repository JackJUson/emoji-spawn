'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Suggestion = () => {
  const [emojis, setEmojis] = useState([]);
  const [emojisLoaded, setEmojisLoaded] = useState(false);

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

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center bg-gray-100'>
      <h1 className='text-6xl font-extrabold tracking-tight mt-40 mb-12 text-center'>
        Find the Perfect Emoji! ✨
      </h1>
      <div className='w-full max-w-md p-8 space-y-4 bg-green-200 rounded-lg shadow-md'>
        <input
          id='emojiSearch'
          type='text'
          placeholder='Describe your feeling...'
          className='w-full p-4 text-lg border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 tracking-tight '
        />
        <button className='w-full p-4 text-lg font-semibold text-white tracking-tight bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300'>
          Suggest Emojis
        </button>
      </div>
      {emojisLoaded && emojis.length > 0 && (
        <div className='mt-8 grid grid-cols-5 gap-4'>
          {emojis.slice(0, 5).map((emoji, index) => (
            <div key={index} className='p-4 bg-white rounded-lg shadow'>
              <p className='text-2xl text-center'>{emoji.character}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Suggestion;

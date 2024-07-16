'use client'

import { useEffect, useState } from "react";

const IconMicrophone = ({ width = 500, height = 500, classList = '' }: { width?: number; height?: number; classList?: string; }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} className={classList} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z" />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <path d="M8 21l8 0" />
    <path d="M12 17l0 4" />
  </svg>
);

const IconMicrophoneOff = ({ width = 500, height = 500, classList = '' }: { width?: number; height?: number; classList?: string; }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} className={classList} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 3l18 18" />
    <path d="M9 5a3 3 0 0 1 6 0v5a3 3 0 0 1 -.13 .874m-2 2a3 3 0 0 1 -3.87 -2.872v-1" />
    <path d="M5 10a7 7 0 0 0 10.846 5.85m2 -2a6.967 6.967 0 0 0 1.152 -3.85" />
    <path d="M8 21l8 0" />
    <path d="M12 17l0 4" />
  </svg>
);

export default function Home() {
  const [ isReading, setIsReading ] = useState(false);
  const [ transcript, setTranscript ] = useState('');

  const handleReading = () => {
    setIsReading(!isReading);
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onstart = () => {
        setIsReading(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(transcriptSegment);
          } else {
            interimTranscript += transcriptSegment;
          }
        }
        setTranscript(interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error(event.error);
      };

      recognition.onend = () => {
        setIsReading(false);
      };

      if (isReading) {
        recognition.start();
      } else {
        recognition.stop();
      }

      return () => {
        recognition.stop();
      };
    } else {
      console.error('SpeechRecognition API is not supported in this browser.');
    }
  }, [isReading]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Transcripción audio a texto
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          {isReading ?
            <span className="text-green-600">Escuchando</span>
            :
            <span className="text-red-600">Silenciado</span>
          }
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <button
          className={`flex items-center justify-center w-24 h-24 p-4 text-white ${isReading ? 'bg-green-500' : 'bg-red-500'} rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${isReading ? 'focus:ring-green-500' : 'focus:ring-red-500'} cursor-pointer`}
          onClick={handleReading}
        >
          {isReading ?
            <IconMicrophone classList="w-12 h-12" />
            :
            <IconMicrophoneOff classList="w-12 h-12" />
          }
        </button>
      </div>
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-xl">
        <span>
          {transcript}
        </span>
      </div>
    </main>
  );
}

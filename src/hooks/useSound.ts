import { useCallback, useRef } from 'react';

export const useSound = (soundPath: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(soundPath);
    }
    
    // Reinicia o áudio se já estiver tocando
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(error => {
      console.error('Erro ao reproduzir som:', error);
    });
  }, [soundPath]);

  return { play };
}; 
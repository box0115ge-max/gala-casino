import { useRef, useState } from 'react';
import { asset } from '../utils/assets';

export default function InvitationMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    setUnavailable(false);
    if (!audio.paused) {
      audio.pause();
      return;
    }

    if (audio.error) audio.load();
    void audio.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setPlaying(false);
      setUnavailable(true);
    });
  }

  return (
    <div className="invitation-music">
      <audio
        ref={audioRef}
        src={asset('audio/james-brown-its-a-mans-world.mp3')}
        preload="none"
        onPlaying={() => { setPlaying(true); setUnavailable(false); }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => { setPlaying(false); setUnavailable(true); }}
      />
      <button className="invitation-music__button" type="button" aria-pressed={playing} onClick={toggleMusic}>
        <span className="invitation-music__icon" aria-hidden="true" />
        Música
      </button>
      {unavailable && <p className="invitation-music__status" role="status">No se pudo reproducir la música.</p>}
    </div>
  );
}

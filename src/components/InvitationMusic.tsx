import { useCallback, useEffect, useRef, useState } from 'react';
import { asset } from '../utils/assets';

export default function InvitationMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicButtonRef = useRef<HTMLButtonElement>(null);
  const automaticStart = useRef<AbortController | null>(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const playMusic = useCallback((audio: HTMLAudioElement, automatic = false) => {
    if (audio.error) audio.load();
    void audio.play().catch((error: unknown) => {
      if (error instanceof DOMException && (error.name === 'AbortError' || (automatic && error.name === 'NotAllowedError'))) return;
      setPlaying(false);
      setUnavailable(true);
    });
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const controller = new AbortController();
    automaticStart.current = controller;
    const { signal } = controller;

    function startOnGesture(event: Event) {
      if (!audio?.paused || !event.isTrusted) return;
      if (event.target instanceof Node && musicButtonRef.current?.contains(event.target)) return;
      if (event instanceof KeyboardEvent && (
        event.repeat || event.altKey || event.ctrlKey || event.metaKey || ['Tab', 'Escape', 'Shift'].includes(event.key)
      )) return;
      playMusic(audio, true);
    }

    // A touch drag over the scratch card may end without producing a click.
    for (const type of ['click', 'pointerup', 'touchend', 'keydown']) {
      window.addEventListener(type, startOnGesture, { capture: true, passive: true, signal });
    }
    audio.addEventListener('playing', () => controller.abort(), { once: true, signal });
    if (audio.paused) playMusic(audio, true);

    return () => controller.abort();
  }, [playMusic]);

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    automaticStart.current?.abort();
    setUnavailable(false);
    if (!audio.paused) {
      audio.pause();
      return;
    }

    playMusic(audio);
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
      <button ref={musicButtonRef} className="invitation-music__button" type="button" aria-pressed={playing} onClick={toggleMusic}>
        <span className="invitation-music__icon" aria-hidden="true" />
        Música
      </button>
      {unavailable && <p className="invitation-music__status" role="status">No se pudo reproducir la música.</p>}
    </div>
  );
}

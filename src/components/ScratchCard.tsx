import { useEffect, useId, useRef, useState } from 'react';
import { eventConfig } from '../config/event';
import { useScratchCanvas } from '../hooks/useScratchCanvas';
import { asset } from '../utils/assets';
import { RevealContent } from './RevealContent';
import '../styles/scratch.css';

export default function ScratchCard() {
  const { canvasRef, canvasAvailable, ready, reveal, stage } = useScratchCanvas();
  const detailsId = useId();
  const detailsSection = useRef<HTMLElement>(null);
  const shouldFocusDetails = useRef(false);
  const exposed = stage !== 'covered';
  const [announce, setAnnounce] = useState(false);

  useEffect(() => {
    if (!exposed || !shouldFocusDetails.current) return;
    shouldFocusDetails.current = false;
    detailsSection.current?.focus({ preventScroll: true });
  }, [exposed]);

  useEffect(() => {
    if (stage === 'revealing') setAnnounce(true);
  }, [stage]);

  return (
    <div className="scratch-card" data-stage={stage}>
      <div className="scratch-card__surface">
        <RevealContent id={detailsId} exposed={exposed} sectionRef={detailsSection} />
        {!ready && !exposed && (
          <div className="scratch-card__foil-fallback" aria-hidden="true">
            <img
              src={asset('scratch/scratch-mark.svg')}
              alt=""
              onError={(event) => { event.currentTarget.hidden = true; }}
            />
          </div>
        )}
        {stage !== 'revealed' && canvasAvailable && (
          <canvas className="scratch-card__canvas" ref={canvasRef} aria-hidden="true" />
        )}
        {!exposed && (
          <button
            className="scratch-card__reveal-button"
            type="button"
            aria-controls={detailsId}
            data-fallback={!canvasAvailable}
            onClick={() => {
              shouldFocusDetails.current = true;
              reveal();
            }}
          >
            Revelar mi invitación
          </button>
        )}
      </div>
      <div className="scratch-card__celebration" aria-hidden="true" />
      <p className="scratch-visually-hidden" aria-live="polite" aria-atomic="true">
        {announce && `${eventConfig.date}, ${eventConfig.time}. ${eventConfig.venue}. ${eventConfig.revealMessage}`}
      </p>
    </div>
  );
}

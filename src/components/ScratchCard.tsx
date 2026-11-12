import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { eventConfig } from '../config/event';
import { useScratchCanvas } from '../hooks/useScratchCanvas';
import { asset } from '../utils/assets';
import { RevealContent } from './RevealContent';
import '../styles/scratch.css';

// A CSS variable used by the stylesheet needs a URL resolved against the page.
const glintUrl = new URL(asset('effects/gold-glint.svg'), document.baseURI).href;

type ArtFormat = 'webp' | 'png' | 'missing';

function fallbackFormat(format: ArtFormat): ArtFormat {
  return format === 'webp' ? 'png' : 'missing';
}

export default function ScratchCard() {
  const { canvasRef, canvasAvailable, ready, reveal, stage } = useScratchCanvas();
  const [frameFormat, setFrameFormat] = useState<ArtFormat>('webp');
  const [revealFormat, setRevealFormat] = useState<ArtFormat>('webp');
  const detailsId = useId();
  const detailsHeading = useRef<HTMLHeadingElement>(null);
  const shouldFocusDetails = useRef(false);
  const exposed = stage !== 'covered';
  const [announce, setAnnounce] = useState(false);

  useEffect(() => {
    if (!exposed || !shouldFocusDetails.current) return;
    shouldFocusDetails.current = false;
    detailsHeading.current?.focus({ preventScroll: true });
  }, [exposed]);

  useEffect(() => {
    if (stage === 'revealing') setAnnounce(true);
  }, [stage]);

  return (
    <div className="scratch-card" data-stage={stage} data-frame={frameFormat !== 'missing'}>
      <div className="scratch-card__surface">
        {revealFormat !== 'missing' && (
          <img
            className="scratch-card__reveal-art"
            src={asset(`scratch/scratch-reveal-background.${revealFormat}`)}
            alt=""
            decoding="async"
            onError={() => setRevealFormat(fallbackFormat)}
          />
        )}
        <RevealContent id={detailsId} exposed={exposed} headingRef={detailsHeading} />
        {!ready && !exposed && (
          <div className="scratch-card__foil-fallback" aria-hidden="true">
            <img
              src={asset('scratch/scratch-mark.svg')}
              alt=""
              onError={(event) => { event.currentTarget.hidden = true; }}
            />
            <span>{eventConfig.scratchInstruction}</span>
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
      {frameFormat !== 'missing' && (
        <img
          className="scratch-card__frame"
          src={asset(`scratch/scratch-gold-frame.${frameFormat}`)}
          alt=""
          decoding="async"
          onError={() => setFrameFormat(fallbackFormat)}
        />
      )}
      <div
        className="scratch-card__celebration"
        style={{ '--scratch-glint': `url("${glintUrl}")` } as CSSProperties}
        aria-hidden="true"
      />
      <p className="scratch-visually-hidden" aria-live="polite" aria-atomic="true">
        {announce && `${eventConfig.title}. ${eventConfig.date}, ${eventConfig.time}. ${eventConfig.venue}. ${eventConfig.revealMessage}`}
      </p>
    </div>
  );
}

import { useState } from 'react';
import { place, type Bounds } from '../config/artwork';
import { asset } from '../utils/assets';

interface PosterArtProps {
  path: string;
  bounds: Bounds;
  className?: string;
  alt?: string;
  fallback?: string;
  priority?: boolean;
  reducedMotionPath?: string;
}

export default function PosterArt({
  path, bounds, className = '', alt = '', fallback, priority, reducedMotionPath,
}: PosterArtProps) {
  const [failed, setFailed] = useState(false);
  const [still, setStill] = useState(false);
  const style = place(bounds);
  const classes = `poster-art ${className}`;

  if (failed) {
    return fallback ? <span className={`${classes} poster-art--text`} style={style}>{fallback}</span> : null;
  }

  return (
    <picture className={classes} style={style}>
      {reducedMotionPath && !still && (
        <source srcSet={asset(reducedMotionPath)} media="(prefers-reduced-motion: reduce)" />
      )}
      <img
        src={asset(still && reducedMotionPath ? reducedMotionPath : path)}
        alt={alt}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        draggable={false}
        onError={(event) => {
          const current = event.currentTarget.currentSrc;
          if (reducedMotionPath && !still && !current.endsWith(`/${reducedMotionPath}`)) {
            setStill(true);
          } else {
            setFailed(true);
          }
        }}
      />
    </picture>
  );
}

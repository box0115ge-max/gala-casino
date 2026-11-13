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
  fallbackPath?: string;
}

export default function PosterArt({
  path, bounds, className = '', alt = '', fallback, priority, fallbackPath,
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
      <img
        src={asset(still && fallbackPath ? fallbackPath : path)}
        alt={alt}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        draggable={false}
        onError={() => {
          if (fallbackPath && !still) {
            setStill(true);
          } else {
            setFailed(true);
          }
        }}
      />
    </picture>
  );
}

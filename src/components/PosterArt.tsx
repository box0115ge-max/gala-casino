import { useState } from 'react';
import { place, type Bounds } from '../config/artwork';
import { asset } from '../utils/assets';

interface PosterArtProps {
  path: string;
  bounds?: Bounds;
  className?: string;
  alt?: string;
  fallback?: string;
  priority?: boolean;
  lazy?: boolean;
  webp?: boolean;
}

export default function PosterArt({
  path, bounds, className = '', alt = '', fallback, priority, lazy, webp,
}: PosterArtProps) {
  const [failed, setFailed] = useState(false);
  const [webpFailed, setWebpFailed] = useState(false);
  const style = bounds && place(bounds);
  const classes = `poster-art ${className}`;
  const optimized = webp && !webpFailed ? asset(path.replace(/\.png$/, '.webp')) : undefined;

  if (failed) {
    return fallback ? <span className={`${classes} poster-art--text`} style={style}>{fallback}</span> : null;
  }

  return <picture className={classes} style={style}>
    {optimized && <source srcSet={optimized} type="image/webp" />}
    <img
      src={asset(path)}
      alt={alt}
      decoding="async"
      loading={lazy ? 'lazy' : undefined}
      fetchPriority={priority ? 'high' : undefined}
      draggable={false}
      onError={(event) => {
        if (optimized && event.currentTarget.currentSrc.endsWith(optimized.replace(/^\.\//, ''))) {
          setWebpFailed(true);
        } else {
          setFailed(true);
        }
      }}
    />
  </picture>;
}

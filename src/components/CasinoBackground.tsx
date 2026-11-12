import PosterArt from './PosterArt';

export default function CasinoBackground() {
  return (
    <>
      <PosterArt className="poster-art--full poster__background" path="background/casino-background.webp" priority />
      <PosterArt className="poster-art--full poster__border" path="background/marquee-border.png" webp />
      <PosterArt className="poster-art--full poster__ambient" path="background/ambient-glow.png" webp />
    </>
  );
}

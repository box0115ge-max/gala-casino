import { artwork, casinoProps, place } from '../config/artwork';
import { eventConfig } from '../config/event';
import InvitationMusic from './InvitationMusic';
import PosterArt from './PosterArt';
import ScratchCard from './ScratchCard';

export default function Invitation() {
  return (
    <main className="invitation">
      <article className="poster" aria-labelledby="invitation-title">
        <h1 className="visually-hidden" id="invitation-title">{eventConfig.title} · {eventConfig.brand}</h1>
        <PosterArt path="redesign/background.webp" bounds={artwork.background} priority />
        <PosterArt className="poster__ambient" path="redesign/sparkles.webp" bounds={artwork.ambient} />
        <PosterArt className="poster__crown-light" path="redesign/crown-light.webp" bounds={artwork.crownLight} />
        <PosterArt className="poster__foreground" path="redesign/crown.webp" bounds={artwork.crown} />
        <PosterArt path="redesign/brand.webp" bounds={artwork.logo} fallback={eventConfig.brand} />
        <PosterArt path="redesign/scratch-heading.webp" bounds={artwork.heading} alt="Raspa y descubre tu invitación" fallback="Raspa y descubre tu invitación" />
        <div className="poster__props" aria-hidden="true">
          {casinoProps.map(({ name, bounds, edge }) => (
            <PosterArt key={name} className={`poster__prop${edge ? ' poster__prop--edge' : ''}`} path={`redesign/${name}.webp`} bounds={bounds} />
          ))}
        </div>
        <PosterArt className="poster__roulette" path="redesign/roulette.webp" bounds={artwork.roulette} />
        <PosterArt className="poster__scratch-glow" path="redesign/scratch-glow.webp" bounds={artwork.scratchGlow} />
        <div className="poster__scratch" style={place(artwork.scratch)}>
          <ScratchCard />
        </div>
        <PosterArt className="poster__ring" path="redesign/scratch-rim.webp" bounds={artwork.ring} />
        <PosterArt className="poster__ring-glow" path="redesign/scratch-rim-glints.webp" bounds={artwork.ring} />
        <PosterArt path="redesign/title-shadow.webp" bounds={artwork.titleShadow} />
        <PosterArt className="poster__foreground" path="redesign/LOGO_TWN_WEB.webp?v=0468b114" fallbackPath="redesign/title-still.webp?v=0468b114" bounds={artwork.title} fallback={eventConfig.title} priority />
        <PosterArt className="poster__foreground poster__night-glow" path="redesign/night-flare.webp" bounds={artwork.nightGlow} />
        <PosterArt path="redesign/ribbon.webp" bounds={artwork.ribbon} alt="Noche de gala" fallback="Noche de gala" />
        <p className="poster__dress-code">
          <span>{eventConfig.dressCode.label}</span>
          <strong>{eventConfig.dressCode.style}</strong>
          <span>{eventConfig.dressCode.colors}</span>
        </p>
        <InvitationMusic />
      </article>
    </main>
  );
}

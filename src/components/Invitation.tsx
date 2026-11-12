import { artwork, place } from '../config/artwork';
import { eventConfig } from '../config/event';
import CasinoBackground from './CasinoBackground';
import CasinoDecorations from './CasinoDecorations';
import MarqueeLights from './MarqueeLights';
import PosterArt from './PosterArt';
import ScratchCard from './ScratchCard';

const partners = 'Limpesa Solutions, Servyclean, El Urbano News, Demente, The Printt, Bilans ERP, Urban City Media, BOX Marketing y CIM CO.';

export default function Invitation() {
  return (
    <main className="invitation">
      <article className="poster" aria-labelledby="invitation-title">
        <h1 className="visually-hidden" id="invitation-title">{eventConfig.subtitle} · {eventConfig.brand}</h1>
        <CasinoBackground />
        <CasinoDecorations />
        <PosterArt className="poster__crown" path="branding/gold-crown.png" bounds={artwork.crown} />
        <PosterArt className="poster__logo" path="branding/grupo-emmi-logo.webp" bounds={artwork.logo} fallback={eventConfig.brand} />
        <PosterArt className="poster__gala" path="typography/gala-title.png" bounds={artwork.gala} fallback="Gala" webp />
        <PosterArt className="poster__marquee" path="typography/casino-marquee.png" bounds={artwork.casino} fallback="CASINO" webp priority />
        <PosterArt className="poster__ribbon" path="typography/gala-ribbon.png" bounds={artwork.ribbon} alt="Noche de gala" fallback="NOCHE DE GALA" webp />
        <PosterArt className="poster__suits" path="typography/casino-suits.svg" bounds={artwork.suits} />
        <PosterArt className="poster__heading" path="typography/scratch-heading.png" bounds={artwork.heading} alt="Raspa y descubre tu invitación" fallback="RASPA Y DESCUBRE TU INVITACIÓN" webp />
        <MarqueeLights />
        <div className="poster__scratch" style={place(artwork.scratch)}>
          <ScratchCard />
        </div>
        <footer className="poster__footer" style={place(artwork.partners)}>
          <PosterArt className="poster-art--full" path="branding/partner-logos.svg" alt={partners} lazy />
        </footer>
      </article>
    </main>
  );
}

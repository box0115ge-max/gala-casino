import { artwork } from '../config/artwork';
import PosterArt from './PosterArt';

export default function CasinoDecorations() {
  return (
    <>
      <PosterArt className="poster__roulette" path="casino/roulette-wheel.png" bounds={artwork.roulette} webp lazy />
      <PosterArt className="poster__cards" path="casino/poker-cards.png" bounds={artwork.cards} webp lazy />
      <PosterArt className="poster__chips" path="casino/casino-chips.png" bounds={artwork.chips} webp lazy />
      <PosterArt className="poster__dice" path="casino/casino-dice.png" bounds={artwork.dice} webp lazy />
    </>
  );
}

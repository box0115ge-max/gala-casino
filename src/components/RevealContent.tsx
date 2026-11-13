import type { Ref } from 'react';
import { eventConfig } from '../config/event';

interface RevealContentProps {
  id: string;
  exposed: boolean;
  sectionRef: Ref<HTMLElement>;
}

export function RevealContent({ id, exposed, sectionRef }: RevealContentProps) {
  return (
    <section className="scratch-reveal" id={id} ref={sectionRef} tabIndex={-1} aria-label="Detalles de la invitación" aria-hidden={!exposed}>
      <dl className="scratch-reveal__details">
        <div>
          <dt className="scratch-visually-hidden">Fecha</dt>
          <dd className="scratch-reveal__date">{eventConfig.date}</dd>
        </div>
        <div>
          <dt className="scratch-visually-hidden">Hora</dt>
          <dd>{eventConfig.time}</dd>
        </div>
        <div>
          <dt className="scratch-visually-hidden">Lugar</dt>
          <dd className="scratch-reveal__venue">{eventConfig.venue}</dd>
        </div>
      </dl>
      <p className="scratch-reveal__message">{eventConfig.revealMessage}</p>
    </section>
  );
}

import type { Ref } from 'react';
import { eventConfig } from '../config/event';

interface RevealContentProps {
  id: string;
  exposed: boolean;
  headingRef: Ref<HTMLHeadingElement>;
}

export function RevealContent({ id, exposed, headingRef }: RevealContentProps) {
  const headingId = `${id}-title`;

  return (
    <section className="scratch-reveal" id={id} aria-labelledby={headingId} aria-hidden={!exposed}>
      <p className="scratch-reveal__brand">{eventConfig.brand}</p>
      <h2 className="scratch-reveal__title" id={headingId} ref={headingRef} tabIndex={-1}>
        {eventConfig.title}
      </h2>
      <dl className="scratch-reveal__details">
        <div>
          <dt className="scratch-visually-hidden">Fecha</dt>
          <dd>{eventConfig.date}</dd>
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

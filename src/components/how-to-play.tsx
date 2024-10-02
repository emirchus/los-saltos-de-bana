'use client';

import React, { useEffect, useState } from 'react';
import useMeasure from 'react-use-measure';

import { TransitionPanel } from './transition-panel';
import { Button } from './ui/button';

export function HowToPlay() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [ref, bounds] = useMeasure();

  const FEATURES: { title: string; description: string | React.ReactNode }[] = [
    {
      title: 'Crear una sala',
      description: (
        <p>
          Crea una sala para que los participantes puedan unirse.
          <br />
          Después de crear la sala, copia el enlace y lo podés compartir con los participantes.
          <br /> <br />
          Si la sala es <code className="font-bold">privada</code> solo los participantes con el código de acceso van a
          poder unirse.
        </p>
      ),
    },
    {
      title: 'Unirse a una sala',
      description: (
        <p>
          Para unirte a una sala, necesitás el código de acceso que te lo va a dar el creador de la sala.
          <br /> <br />
          Si la sala es <code className="font-bold">pública</code> vas a necesitar el código de acceso.
          <br /> <br />
          Si sos el creador de la sala, vas a poder ver los códigos de acceso de tus salas privadas.
        </p>
      ),
    },
    {
      title: 'Explorar salas',
      description: (
        <p>
          Explorá las salas disponibles y unite a la que más te guste.
          <br />
          Si no encontrás una sala que te guste, podés crear una nueva.
        </p>
      ),
    },
  ];

  const handleSetActiveIndex = (newIndex: number) => {
    setDirection(newIndex > activeIndex ? 1 : -1);
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    if (activeIndex < 0) setActiveIndex(0);
    if (activeIndex >= FEATURES.length) setActiveIndex(FEATURES.length - 1);
  }, [FEATURES.length, activeIndex]);

  return (
    <div className="w-full overflow-hidden">
      <TransitionPanel
        activeIndex={activeIndex}
        variants={{
          enter: direction => ({
            x: direction > 0 ? 364 : -364,
            opacity: 0,
            height: bounds.height > 0 ? bounds.height : 'auto',
            position: 'initial',
          }),
          center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            height: bounds.height > 0 ? bounds.height : 'auto',
          },
          exit: direction => ({
            zIndex: 0,
            x: direction < 0 ? 364 : -364,
            opacity: 0,
            position: 'absolute',
            top: 0,
            width: '100%',
          }),
        }}
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        custom={direction}
      >
        {FEATURES.map((feature, index) => (
          <div key={index} className="px-4 pt-4" ref={ref}>
            <h3 className="mb-0.5 font-medium text-card-foreground">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </TransitionPanel>
      <div className="flex justify-between p-4">
        {activeIndex > 0 ? (
          <Button variant={'outline'} onClick={() => handleSetActiveIndex(activeIndex - 1)}>
            Anterior
          </Button>
        ) : (
          <div />
        )}
        {activeIndex < FEATURES.length - 1 && (
          <Button onClick={() => handleSetActiveIndex(activeIndex + 1)}>Siguiente</Button>
        )}
      </div>
    </div>
  );
}

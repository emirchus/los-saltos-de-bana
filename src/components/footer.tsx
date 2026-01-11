'use client';
import React from 'react';

export const Footer = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center py-8 z-10">
      <div className="bg-background/10 backdrop-blur-sm rounded-full p-4 border overflow-hidden">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} | <span className="font-bold">Emaidana09</span> &{' '}
          <span className="font-bold">Emirchus</span>
        </p>
      </div>
    </div>
  );
};

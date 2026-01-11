'use client';

export const VideoBackground = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <div className="absolute inset-0 z-0">
      <video className="w-full h-full object-cover opacity-30" autoPlay loop muted playsInline>
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-background z-10 top-0 left-0 right-0 bottom-0" />
    </div>
  );
};

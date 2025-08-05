export const HeroVideo = () => {
  return (
    <section className="w-full px-4 py-8 flex justify-center bg-black">
      <video
        src="/video.mp4" 
        className="w-full max-w-5xl rounded-xl shadow-2xl"
        autoPlay
        muted
        loop
        playsInline
      />
    </section>
  );
};

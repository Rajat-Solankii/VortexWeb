export default function VideoPlayer({ type, id, season, episode }: { type: "movie" | "tv", id: string, season?: number, episode?: number }) {
  let url = "";
  if (type === "movie") {
    url = `https://player.videasy.net/movie/${id}`;
  } else {
    url = `https://player.videasy.net/tv/${id}/${season || 1}/${episode || 1}`;
  }

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,176,255,0.3)] border border-white/10 relative">
      <iframe
        src={url}
        allowFullScreen
        className="w-full h-full absolute inset-0"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
}

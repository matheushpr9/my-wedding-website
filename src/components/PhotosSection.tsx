import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const PhotosSection = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    fetch("/data/photos.json")
      .then((r) => r.json())
      .then((data: { filename: string }[]) => setPhotos(data.map((p) => p.filename)))
      .catch(() => {});
  }, []);

  const goPrev = useCallback(() => {
    if (selected === null) return;
    setSelected(selected === 0 ? photos.length - 1 : selected - 1);
  }, [selected, photos.length]);

  const goNext = useCallback(() => {
    if (selected === null) return;
    setSelected(selected === photos.length - 1 ? 0 : selected + 1);
  }, [selected, photos.length]);

  useEffect(() => {
    if (selected === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, goPrev, goNext]);

  return (
    <section id="fotos" className="py-20 px-4">
      <div className="container max-w-5xl">
        <h2 className="font-display text-3xl md:text-4xl text-primary text-center mb-12">
          Nossa História em Fotos
        </h2>

        <div className="max-h-[400px] md:max-h-[600px] overflow-y-auto rounded-lg photos-scroll">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className="overflow-hidden rounded-lg aspect-square group"
              >
                <img
                  src={photo}
                  alt={`Foto do casal ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-[60] bg-foreground/80 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button className="absolute top-4 right-4 text-background z-10" onClick={() => setSelected(null)}>
            <X size={32} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-background/80 hover:text-background z-10"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
          >
            <ChevronLeft size={36} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-background/80 hover:text-background z-10"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
          >
            <ChevronRight size={36} />
          </button>
          <img
            src={photos[selected]}
            alt="Foto ampliada"
            className="max-w-full max-h-[85vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default PhotosSection;

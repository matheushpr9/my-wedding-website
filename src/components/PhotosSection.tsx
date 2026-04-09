import { useState, useCallback, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { api } from "@/lib/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const localModules = import.meta.glob<{ default: string }>("@/assets/photos/*.jpg", { eager: true });
const localPhotos = Object.values(localModules).map((m) => m.default);

const PhotosSection = () => {
  const [photos, setPhotos] = useState<string[]>(localPhotos);
  const [selected, setSelected] = useState<string | null>(null);
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [autoplayPlugin.current]
  );

  useEffect(() => {
    api.getPhotos()
      .then((data) => { if (data.length) setPhotos(data.map((p) => `${API_URL}${p.filename}`)); })
      .catch(() => {});
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="fotos" className="py-20 px-4">
      <div className="container max-w-4xl">
        <h2 className="font-display text-3xl md:text-4xl text-primary text-center mb-12">
          Nossa História em Fotos
        </h2>

        <div className="relative">
          <div className="overflow-hidden rounded-lg" ref={emblaRef}>
            <div className="flex">
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className="flex-[0_0_80%] md:flex-[0_0_40%] min-w-0 pl-3"
                >
                  <button
                    onClick={() => setSelected(photo)}
                    className="overflow-hidden rounded-lg aspect-square w-full group"
                  >
                    <img
                      src={photo}
                      alt={`Foto do casal ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 text-foreground hover:bg-background transition-colors z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 text-foreground hover:bg-background transition-colors z-10"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[60] bg-foreground/80 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button className="absolute top-4 right-4 text-background" onClick={() => setSelected(null)}>
            <X size={32} />
          </button>
          <img
            src={selected}
            alt="Foto ampliada"
            className="max-w-full max-h-[85vh] rounded-lg object-contain"
          />
        </div>
      )}
    </section>
  );
};

export default PhotosSection;

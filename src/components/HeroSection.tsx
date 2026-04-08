import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

const WEDDING_DATE = new Date("2026-07-11T11:00:00");

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const diff = WEDDING_DATE.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-12 relative overflow-hidden">
      <img
        src={logo}
        alt="Logo"
        width={280}
        height={420}
        className="w-48 md:w-64 mb-6 animate-fade-in"
      />
      <p className="font-body text-sm tracking-[0.3em] uppercase text-secondary mb-2 animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
        Vamos nos casar
      </p>
      <h1 className="font-script text-5xl md:text-7xl text-primary animate-fade-in" style={{ animationDelay: "0.4s", opacity: 0 }}>
        Laura & Matheus
      </h1>
      <p className="font-display text-lg md:text-xl text-foreground/60 mt-3 animate-fade-in" style={{ animationDelay: "0.6s", opacity: 0 }}>
        11 de julho 2026 • 11h
      </p>

      <div className="flex gap-4 md:gap-8 mt-10 animate-fade-in" style={{ animationDelay: "0.8s", opacity: 0 }}>
        {([
          [timeLeft.days, "Dias"],
          [timeLeft.hours, "Horas"],
          [timeLeft.minutes, "Min"],
          [timeLeft.seconds, "Seg"],
        ] as const).map(([value, label]) => (
          <div key={label} className="flex flex-col items-center">
            <span className="font-display text-3xl md:text-5xl text-primary font-bold">
              {String(value).padStart(2, "0")}
            </span>
            <span className="font-body text-xs md:text-sm text-muted-foreground uppercase tracking-wider mt-1">
              {label}
            </span>
          </div>
        ))}
      </div>

      <a
        href="#confirmar"
        className="mt-10 px-8 py-3 bg-primary text-primary-foreground font-body text-sm uppercase tracking-widest rounded-sm hover:bg-terracotta-dark transition-colors animate-fade-in"
        style={{ animationDelay: "1s", opacity: 0 }}
        onClick={(e) => {
          e.preventDefault();
          document.querySelector("#confirmar")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Confirmar Presença
      </a>
    </section>
  );
};

export default HeroSection;

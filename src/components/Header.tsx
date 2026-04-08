import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Confirmar Presença", href: "#confirmar" },
  { label: "Local", href: "#local" },
  { label: "Fotos", href: "#fotos" },
  { label: "Lista de Presentes", href: "#presentes" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  const handleClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-14 md:h-16">
        <a href="#inicio" className="font-display text-lg md:text-xl text-primary font-semibold italic">
          L & M
        </a>
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleClick(item.href)}
              className="text-sm font-body text-foreground/70 hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden bg-background border-b border-border pb-4">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleClick(item.href)}
              className="block w-full text-left px-6 py-3 text-sm font-body text-foreground/70 hover:text-primary hover:bg-muted transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;

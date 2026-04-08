import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="py-10 text-center border-t border-border">
    <p className="font-script text-2xl text-primary font-bold">Laura & Matheus</p>
    <p className="font-body text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
      Feito com <Heart size={12} className="text-primary" /> para o nosso grande dia
    </p>
  </footer>
);

export default Footer;

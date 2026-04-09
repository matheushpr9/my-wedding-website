import {
  CheckCircle,
  Clock,
  UserX,
  CameraOff,
  ShirtIcon,
  PartyPopper,
  HandHeart,
  AlertTriangle,
  MessageCircleOff,
  Flower2,
  CakeSlice,
  Instagram,
  Download,
} from "lucide-react";

const tips = [
  { icon: CheckCircle, title: "Confirme Presença", text: "Confirme o quanto antes para nos ajudar na organização" },
  { icon: Clock, title: "Seja Pontual", text: "Chegue no horário para não perder nenhum momento" },
  { icon: UserX, title: "Convidado Não Convida", text: "Por favor, não leve acompanhantes sem confirmação prévia" },
  { icon: CameraOff, title: "Não Atrapalhe o Fotógrafo", text: "Evite ficar na frente do fotógrafo durante a cerimônia" },
  { icon: ShirtIcon, title: "Não Use Branco", text: "O branco é reservado para a noiva" },
  { icon: PartyPopper, title: "Aproveite Bastante", text: "Divirta-se e celebre conosco esse dia especial" },
  { icon: HandHeart, title: "Não Saia Sem Se Despedir", text: "Passe para dar um abraço nos noivos antes de ir" },
  { icon: AlertTriangle, title: "Evite Confusões", text: "Mantenha a harmonia e o clima de celebração" },
  { icon: MessageCircleOff, title: "Não Faça Comentários Negativos", text: "Guarde críticas para outro momento" },
  { icon: Flower2, title: "Não Leve Itens de Decoração", text: "Os arranjos e decorações fazem parte do evento" },
  { icon: CakeSlice, title: "Não Ataque a Mesa de Doces", text: "Aguarde o momento certo para se servir" },
  { icon: Instagram, title: "Tire Muitas Fotos", text: "E nos marque no Instagram!" },
];

const GuestGuideSection = () => (
  <section id="manual" className="py-20 px-4">
    <div className="container max-w-4xl">
      <h2 className="font-display text-3xl md:text-4xl text-primary text-center mb-2">
        Manual do Convidado
      </h2>
      <p className="font-body text-muted-foreground text-center mb-12">
        Algumas dicas para aproveitarmos juntos esse dia especial
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tips.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="bg-card border border-border rounded-lg p-4 text-center flex flex-col items-center gap-2 hover:border-primary/30 transition-colors"
          >
            <Icon className="text-primary" size={28} />
            <h3 className="font-display text-sm text-foreground leading-tight">{title}</h3>
            <p className="font-body text-xs text-muted-foreground leading-snug">{text}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <a
          href="/manual-do-convidado.pdf"
          download
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-sm uppercase tracking-widest rounded-sm hover:bg-primary/90 transition-colors"
        >
          <Download size={16} />
          Baixar Manual Completo
        </a>
      </div>
    </div>
  </section>
);

export default GuestGuideSection;

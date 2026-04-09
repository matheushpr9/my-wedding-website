import { useState, useRef, useMemo, useEffect } from "react";
import { Gift, Check, Copy, X } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { generatePixPayload } from "@/lib/pix";
import { QRCodeSVG } from "qrcode.react";

type GiftItem = { id: number; name: string; price: number; image: string };

const PIX_KEY = import.meta.env.VITE_PIX_CPF as string;
const PIX_KEY_DISPLAY = PIX_KEY.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

const GiftListSection = () => {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [showPix, setShowPix] = useState(false);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [nomeError, setNomeError] = useState(false);
  const isMobile = useIsMobile();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/data/gifts.json")
      .then((r) => r.json())
      .then((data: GiftItem[]) => setGifts(data))
      .catch(() => {});
  }, []);

  const toggle = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    if (isMobile && formRef.current) {
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  };

  const selectedGifts = gifts.filter((g) => selected.includes(g.id));
  const total = selectedGifts.reduce((sum, g) => sum + g.price, 0);

  const handleGerarPix = () => {
    if (!nome.trim()) {
      setNomeError(true);
      toast.error("Por favor, informe seu nome.");
      return;
    }
    if (selected.length === 0) {
      toast.error("Selecione pelo menos um presente.");
      return;
    }
    setNomeError(false);
    setShowPix(true);
  };

  const pixPayload = useMemo(() => {
    if (!showPix || total <= 0) return "";
    return generatePixPayload({
      pixKey: PIX_KEY,
      merchantName: "Laura e Matheus",
      merchantCity: "SAO PAULO",
      amount: total,
      description: `Presente de ${nome}`,
    });
  }, [showPix, total, nome]);

  const copyPixPayload = () => {
    navigator.clipboard.writeText(pixPayload);
    toast.success("Pix Copia e Cola copiado!");
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(PIX_KEY_DISPLAY);
    toast.success("CPF copiado!");
  };

  return (
    <section id="presentes" className="py-20 px-4 bg-card">
      <div className="container max-w-6xl">
        <h2 className="font-display text-3xl md:text-4xl text-primary text-center mb-2">Lista de Presentes</h2>
        <p className="font-body text-muted-foreground text-center mb-10">Selecione os presentes que deseja dar ao casal</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Gift list with scroll */}
          <div className="lg:w-3/5 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gifts.map((gift) => {
                const isSelected = selected.includes(gift.id);
                return (
                  <button
                    key={gift.id}
                    onClick={() => toggle(gift.id)}
                    className={`relative p-3 rounded-lg border text-center transition-all font-body ${
                      isSelected
                        ? "border-secondary bg-secondary/10 ring-2 ring-secondary/30"
                        : "border-border bg-background hover:border-primary/30"
                    }`}
                  >
                    {isSelected && (
                      <Check className="absolute top-2 right-2 text-secondary" size={16} />
                    )}
                    <img
                      src={gift.image}
                      alt={gift.name}
                      loading="lazy"
                      width={512}
                      height={512}
                      className="w-full aspect-square object-cover rounded-md mb-2"
                    />
                    <p className="text-sm text-foreground font-medium">{gift.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      R$ {gift.price.toFixed(2)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right column - Form + Summary (sticky) */}
          <div ref={formRef} className="lg:w-2/5">
            <div className="lg:sticky lg:top-24 bg-background border border-border rounded-lg p-6 space-y-5">
              <h3 className="font-display text-xl text-primary">Seus Dados</h3>

              <div>
                <label className="font-body text-sm text-foreground block mb-1">
                  Seu Nome <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => { setNome(e.target.value); setNomeError(false); }}
                  placeholder="Digite seu nome completo"
                  className={`w-full px-3 py-2 rounded-md border bg-background text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                    nomeError ? "border-destructive" : "border-input"
                  }`}
                />
                {nomeError && <p className="text-xs text-destructive mt-1">Campo obrigatório</p>}
              </div>

              <div>
                <label className="font-body text-sm text-foreground block mb-1">
                  Mensagem para os Noivos <span className="text-muted-foreground text-xs">(opcional)</span>
                </label>
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Deixe uma mensagem carinhosa..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              {/* Summary */}
              <div className="border-t border-border pt-4">
                <h4 className="font-body text-sm text-muted-foreground mb-2">
                  Presentes selecionados ({selected.length})
                </h4>
                {selectedGifts.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedGifts.map((g) => (
                      <div key={g.id} className="flex justify-between items-center text-sm font-body">
                        <span className="text-foreground">{g.name}</span>
                        <span className="text-muted-foreground">R$ {g.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Nenhum presente selecionado</p>
                )}

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
                  <span className="font-body text-foreground font-medium">Total</span>
                  <span className="font-display text-2xl text-primary font-bold">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleGerarPix}
                disabled={selected.length === 0}
                className="w-full px-8 py-3 bg-secondary text-secondary-foreground font-body text-sm uppercase tracking-widest rounded-sm hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gerar Pix
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pix Modal */}
      {showPix && (
        <div className="fixed inset-0 z-[60] bg-foreground/80 flex items-center justify-center p-4" onClick={() => setShowPix(false)}>
          <div className="bg-background rounded-lg p-8 max-w-sm w-full text-center relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" onClick={() => setShowPix(false)}>
              <X size={20} />
            </button>
            <Gift className="mx-auto text-primary mb-4" size={40} />
            <h3 className="font-display text-xl text-primary mb-1">Pagamento via Pix</h3>
            <p className="font-body text-muted-foreground text-sm mb-1">
              De: <span className="text-foreground font-bold">{nome}</span>
            </p>
            <p className="font-body text-muted-foreground text-sm mb-4">
              Valor: <span className="text-foreground font-bold">R$ {total.toFixed(2)}</span>
            </p>

            {pixPayload && (
              <div className="bg-white p-3 rounded-md inline-block mb-4">
                <QRCodeSVG value={pixPayload} size={200} />
              </div>
            )}

            <p className="font-body text-xs text-muted-foreground mb-2">Pix Copia e Cola</p>
            <div className="bg-muted rounded-sm p-3 flex items-center justify-between gap-2 mb-3">
              <span className="font-body text-xs text-foreground truncate">{pixPayload}</span>
              <button onClick={copyPixPayload} className="text-primary hover:text-primary/70 shrink-0">
                <Copy size={18} />
              </button>
            </div>

            <p className="font-body text-xs text-muted-foreground mb-2">Ou copie o CPF (chave Pix)</p>
            <div className="bg-muted rounded-sm p-3 flex items-center justify-between gap-2 mb-4">
              <span className="font-body text-sm text-foreground">{PIX_KEY_DISPLAY}</span>
              <button onClick={copyPixKey} className="text-primary hover:text-primary/70 shrink-0">
                <Copy size={18} />
              </button>
            </div>

            <p className="font-body text-xs text-muted-foreground">
              Escaneie o QR Code ou copie o código acima. Obrigado pelo presente! 💝
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GiftListSection;

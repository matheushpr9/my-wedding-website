import { useState } from "react";
import { UserPlus, Trash2, Send, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const RSVP_URL = import.meta.env.VITE_RSVP_URL as string;

const RSVPSection = () => {
  const [name, setName] = useState("");

  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const [companions, setCompanions] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const addCompanion = () => setCompanions([...companions, ""]);
  const removeCompanion = (i: number) => setCompanions(companions.filter((_, idx) => idx !== i));
  const updateCompanion = (i: number, value: string) => {
    const updated = [...companions];
    updated[i] = value;
    setCompanions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !attending) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      await fetch(RSVP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: name,
          acompanhantes: attending === "yes" ? companions.filter(Boolean).join(", ") : "",
          mensagem: attending === "no" ? "(Não poderá ir)" : mensagem,
        }),
      });
      setSubmitted(true);
      toast.success("Presença confirmada com sucesso! 🎉");
    } catch {
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="confirmar" className="py-20 px-4">
        <div className="container max-w-lg text-center">
          <div className="bg-card rounded-lg p-10 border border-border">
            <Check className="mx-auto text-secondary mb-4" size={48} />
            <h3 className="font-display text-2xl text-primary mb-2">Obrigado, {name}!</h3>
            <p className="font-body text-muted-foreground">
              {attending === "yes" ? "Estamos ansiosos para celebrar com você!" : "Sentiremos sua falta!"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="confirmar" className="py-20 px-4">
      <div className="container max-w-lg">
        <h2 className="font-display text-3xl md:text-4xl text-primary text-center mb-2">Confirmar Presença</h2>
        <p className="font-body text-muted-foreground text-center mb-10">Ficaremos felizes com a sua presença</p>

        <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 md:p-8 border border-border space-y-6">
          <div>
            <label className="font-body text-sm text-foreground block mb-1">Seu nome *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-sm border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Nome completo"
              maxLength={100}
            />
          </div>

          <div>
            <label className="font-body text-sm text-foreground block mb-2">Você irá? *</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAttending("yes")}
                className={`flex-1 py-3 rounded-sm border font-body text-sm transition-colors ${
                  attending === "yes"
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "border-input hover:border-primary/40"
                }`}
              >
                Sim, estarei lá! 🎉
              </button>
              <button
                type="button"
                onClick={() => setAttending("no")}
                className={`flex-1 py-3 rounded-sm border font-body text-sm transition-colors ${
                  attending === "no"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-input hover:border-primary/40"
                }`}
              >
                Não poderei ir 😢
              </button>
            </div>
          </div>

          {attending === "yes" && (
            <>
              <div>
                <label className="font-body text-sm text-foreground block mb-2">Acompanhantes</label>
                {companions.map((c, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={c}
                      onChange={(e) => updateCompanion(i, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-sm border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder={`Nome do acompanhante ${i + 1}`}
                      maxLength={100}
                    />
                    <button type="button" onClick={() => removeCompanion(i)} className="px-3 text-destructive hover:bg-destructive/10 rounded-sm transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCompanion}
                  className="flex items-center gap-2 text-sm font-body text-secondary hover:text-secondary/80 mt-1 transition-colors"
                >
                  <UserPlus size={16} /> Adicionar acompanhante
                </button>
              </div>

              <div>
                <label className="font-body text-sm text-foreground block mb-1">Mensagem <span className="text-muted-foreground text-xs">(opcional)</span></label>
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Deixe uma mensagem para os noivos..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-sm border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground font-body text-sm uppercase tracking-widest rounded-sm hover:bg-terracotta-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {loading ? "Enviando..." : "Confirmar"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default RSVPSection;

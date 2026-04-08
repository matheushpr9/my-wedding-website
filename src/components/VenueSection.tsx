import { Church, PartyPopper, MapPin, Clock } from "lucide-react";

const VenueSection = () => {
  return (
    <section id="local" className="py-20 px-4 bg-card">
      <div className="container max-w-3xl">
        <h2 className="font-display text-3xl md:text-4xl text-primary text-center mb-12">Local</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-background rounded-lg p-6 md:p-8 border border-border text-center">
            <Church className="mx-auto text-secondary mb-4" size={40} />
            <h3 className="font-display text-xl text-primary mb-1">Cerimônia Religiosa</h3>
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground font-body text-sm">
                <MapPin size={16} className="text-primary shrink-0" />
                <span>Paróquia Nossa Senhora Aparecida e São João Paulo II <br /> R. Catanduva, 116-266 - Jardim Paulista <br /> Atibaia, SP </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground font-body text-sm">
                <Clock size={16} className="text-primary shrink-0" />
                <span>11h00</span>
              </div>
            </div>
            <a
              href="https://maps.app.goo.gl/15oZh9AdzBSR9ywm8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 px-6 py-2 border border-secondary text-secondary font-body text-xs uppercase tracking-widest rounded-sm hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              Ver no mapa
            </a>
          </div>

          <div className="bg-background rounded-lg p-6 md:p-8 border border-border text-center">
            <PartyPopper className="mx-auto text-secondary mb-4" size={40} />
            <h3 className="font-display text-xl text-primary mb-1">Recepção</h3>
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground font-body text-sm">
                <MapPin size={16} className="text-primary shrink-0" />
                <span>Portal dos Amigos<br />R. José Vicentini, 42 - Pinheirais <br /> Bragança Paulista - SP</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground font-body text-sm">
                <Clock size={16} className="text-primary shrink-0" />
                <span>13h00</span>
              </div>
            </div>
            <a
              href="https://maps.app.goo.gl/vmppaSSYsb1qegta6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 px-6 py-2 border border-secondary text-secondary font-body text-xs uppercase tracking-widest rounded-sm hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              Ver no mapa
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueSection;

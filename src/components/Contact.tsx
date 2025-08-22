import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Instagram, MessageCircle } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      label: "Endereço",
      value: "Rua das Flores, 123 - Centro",
      subValue: "São Paulo, SP - CEP: 01234-567",
      action: () => window.open("https://maps.google.com/?q=Rua+das+Flores+123+Centro+São+Paulo", "_blank")
    },
    {
      icon: Phone,
      label: "Telefone",
      value: "(11) 99999-9999",
      subValue: "WhatsApp disponível",
      action: () => window.open("https://wa.me/5511999999999", "_blank")
    },
    {
      icon: Clock,
      label: "Funcionamento",
      value: "Seg - Sex: 9h às 18h",
      subValue: "Sáb: 8h às 16h | Dom: Fechado",
      action: null
    }
  ];

  const socialLinks = [
    {
      icon: Instagram,
      label: "@lipecortes",
      url: "https://instagram.com/lipecortes",
      color: "from-pink-500 to-purple-600"
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      url: "https://wa.me/5511999999999",
      color: "from-green-500 to-green-600"
    }
  ];

  const handleWhatsApp = () => {
    const message = "Oi! Gostaria de agendar um horário. Quando você tem disponibilidade?";
    const phoneNumber = "5511999999999";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <section id="contato" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-full mb-6">
            <MessageCircle className="w-8 h-8 text-accent-foreground" />
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Entre em <span className="text-gold">Contato</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Pronto para transformar seu visual? Entre em contato e agende seu horário.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 animate-slide-in-left">
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-4 p-6 rounded-xl bg-card/30 border border-border/20 hover:bg-card/50 transition-all duration-300 ${
                    info.action ? "cursor-pointer hover:scale-105" : ""
                  } animate-fade-in animation-delay-${index * 200}`}
                  onClick={info.action || undefined}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center">
                    <info.icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="flex-grow">
                    <div className="font-semibold text-foreground text-sm uppercase tracking-wide mb-1">
                      {info.label}
                    </div>
                    <div className="text-foreground/90 font-medium">{info.value}</div>
                    <div className="text-foreground/60 text-sm">{info.subValue}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                Nos siga nas redes sociais
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    onClick={() => window.open(social.url, "_blank")}
                    className={`btn-secondary hover:bg-gradient-to-r hover:${social.color} hover:text-white transition-all duration-300 group`}
                  >
                    <social.icon className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    {social.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Map and CTA */}
          <div className="space-y-8 animate-slide-in-right">
            {/* Map placeholder */}
            <div className="relative rounded-xl overflow-hidden h-64 bg-card border border-border/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1085059662615!2d-46.6394!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAxLjgiUyA0NsKwMzgnMjEuOCJX!5e0!3m2!1sen!2sbr!4v1629825894234!5m2!1sen!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale contrast-125 opacity-80"
                title="Localização da Barbearia Lipe Cortes"
              ></iframe>
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-r from-card to-muted/50 rounded-2xl p-8 border border-border/30 text-center">
              <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
                Agende já seu horário!
              </h3>
              <p className="text-foreground/70 mb-6">
                Atendimento rápido pelo WhatsApp. Confirme sua disponibilidade em segundos.
              </p>
              <Button 
                onClick={handleWhatsApp}
                className="btn-hero w-full sm:w-auto text-lg px-8 py-4 group"
              >
                <MessageCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Falar no WhatsApp
              </Button>
            </div>

            {/* Business hours highlight */}
            <div className="bg-gradient-to-r from-accent/10 to-gold/10 rounded-xl p-6 border border-accent/20">
              <div className="flex items-center space-x-3 mb-3">
                <Clock className="w-6 h-6 text-accent" />
                <h4 className="font-heading font-semibold text-foreground">Horário de Funcionamento</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Segunda - Sexta</span>
                  <span className="text-foreground font-medium">9h às 18h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Sábado</span>
                  <span className="text-foreground font-medium">8h às 16h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Domingo</span>
                  <span className="text-destructive font-medium">Fechado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
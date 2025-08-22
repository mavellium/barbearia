import { Button } from "@/components/ui/button";
import { Clock, Star, Scissors } from "lucide-react";
import fadeImage from "@/assets/service-fade.jpg";
import socialImage from "@/assets/service-social.jpg";
import beardImage from "@/assets/service-beard.jpg";

const Services = () => {
  const services = [
    {
      id: 1,
      name: "Degradê",
      description: "Corte moderno com transição perfeita. Técnica refinada para um visual impecável.",
      price: "R$ 35",
      duration: "45 min",
      image: fadeImage,
      popular: true
    },
    {
      id: 2,
      name: "Social",
      description: "Clássico e elegante para o dia a dia profissional. Sempre na medida certa.",
      price: "R$ 30",
      duration: "40 min",
      image: socialImage,
      popular: false
    },
    {
      id: 3,
      name: "Barba",
      description: "Aparar e modelar com precisão. Produtos premium para hidratação e acabamento.",
      price: "R$ 25",
      duration: "30 min",
      image: beardImage,
      popular: false
    }
  ];

  const handleWhatsApp = (serviceName: string) => {
    const message = `Oi! Gostaria de agendar um ${serviceName}. Quando você tem disponibilidade?`;
    const phoneNumber = "5511999999999"; // Replace with actual WhatsApp number
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <section id="servicos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-full mb-6">
            <Scissors className="w-8 h-8 text-accent-foreground" />
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Nossos <span className="text-gold">Serviços</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Cada corte é uma obra de arte. Escolha o seu estilo e experimente o melhor da barbearia moderna.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`card-luxury p-6 group hover:scale-105 transition-all duration-500 ${
                index === 0 ? "animate-slide-in-left" : 
                index === 1 ? "animate-fade-in animation-delay-200" : 
                "animate-slide-in-right animation-delay-400"
              }`}
            >
              {/* Service Image */}
              <div className="relative overflow-hidden rounded-lg mb-6">
                <img
                  src={service.image}
                  alt={`Serviço de ${service.name} - Lipe Cortes`}
                  className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                {service.popular && (
                  <div className="absolute top-4 left-4 bg-gradient-gold px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-accent-foreground" />
                      <span className="text-xs font-semibold text-accent-foreground">Mais Pedido</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Service Info */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-heading font-semibold text-foreground">
                    {service.name}
                  </h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gold">{service.price}</div>
                    <div className="flex items-center text-sm text-foreground/60">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration}
                    </div>
                  </div>
                </div>

                <p className="text-foreground/70 text-sm leading-relaxed">
                  {service.description}
                </p>

                <Button 
                  onClick={() => handleWhatsApp(service.name)}
                  className="w-full btn-secondary group hover:btn-hero transition-all duration-300"
                >
                  Agendar {service.name}
                  <Scissors className="ml-2 w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-card to-muted/50 rounded-2xl p-8 border border-border/30">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
              Não encontrou o que procura?
            </h3>
            <p className="text-foreground/70 mb-6">
              Entre em contato e vamos criar o visual perfeito para você.
            </p>
            <Button 
              onClick={() => handleWhatsApp("um atendimento personalizado")}
              className="btn-hero"
            >
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
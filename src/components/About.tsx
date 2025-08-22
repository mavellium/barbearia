import { Button } from "@/components/ui/button";
import { Award, Users, Clock, Scissors } from "lucide-react";
import interiorImage from "@/assets/barbershop-interior.jpg";

const About = () => {
  const stats = [
    {
      icon: Users,
      number: "500+",
      label: "Clientes Satisfeitos",
      description: "Cada cliente é único, cada corte é especial"
    },
    {
      icon: Clock,
      number: "5",
      label: "Anos de Experiência",
      description: "Aperfeiçoando técnicas e criando estilos"
    },
    {
      icon: Award,
      number: "100%",
      label: "Qualidade Garantida",
      description: "Compromisso com a excelência em cada serviço"
    }
  ];

  const scrollToContact = () => {
    document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="sobre" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-in-left">
            {/* Section Header */}
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-full mb-6">
                <Scissors className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
                Sobre o <span className="text-gold">Lipe Cortes</span>
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Mais que uma barbearia, é um espaço onde estilo e personalidade se encontram.
              </p>
            </div>

            {/* Story */}
            <div className="space-y-6">
              <p className="text-foreground/80 leading-relaxed">
                Há 5 anos, o Lipe Cortes nasceu da paixão por criar não apenas cortes, mas experiências únicas. 
                Com técnicas modernas e um olhar atento aos detalhes, transformamos cada visita em um momento 
                de cuidado pessoal e renovação.
              </p>
              
              <p className="text-foreground/80 leading-relaxed">
                Nossa filosofia é simples: <strong className="text-gold">profissionalismo + estilo</strong>. 
                Cada cliente recebe atenção personalizada, garantindo que saia daqui não apenas com um novo 
                visual, mas com mais confiança.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-4 rounded-lg bg-card/30 border border-border/20 hover:bg-card/50 transition-all duration-300 animate-fade-in animation-delay-${index * 200}`}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-gold rounded-full mb-3">
                    <stat.icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-gold mb-1">{stat.number}</div>
                  <div className="font-semibold text-foreground text-sm mb-2">{stat.label}</div>
                  <div className="text-xs text-foreground/60 leading-relaxed">{stat.description}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button 
                onClick={scrollToContact}
                className="btn-hero"
              >
                Conheça Nosso Espaço
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-slide-in-right">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={interiorImage}
                alt="Interior moderno da barbearia Lipe Cortes com cadeiras de couro e ambiente luxuoso"
                className="w-full h-[600px] object-cover"
              />
              {/* Overlay gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20"></div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-gold rounded-full opacity-20 animate-glow"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/10 rounded-full opacity-30"></div>

            {/* Quote overlay */}
            <div className="absolute bottom-8 left-8 right-8 bg-background/90 backdrop-blur-sm rounded-lg p-6 border border-border/20">
              <blockquote className="text-foreground/90 font-medium italic mb-2">
                "Cada corte é uma obra de arte. Cada cliente, uma nova inspiração."
              </blockquote>
              <cite className="text-gold font-semibold">- Lipe Cortes, Fundador</cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
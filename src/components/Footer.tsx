import { Scissors, Instagram, MessageCircle, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Serviços", href: "#servicos" },
    { label: "Produtos", href: "#produtos" },
    { label: "Sobre", href: "#sobre" },
    { label: "Contato", href: "#contato" }
  ];

  const services = [
    { label: "Degradê", price: "R$ 35" },
    { label: "Social", price: "R$ 30" },
    { label: "Barba", price: "R$ 25" }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-deep-black text-foreground">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
                <Scissors className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-2xl font-heading font-bold">Lipe Cortes</span>
            </div>
            <p className="text-foreground/70 leading-relaxed">
              Mais que uma barbearia, um espaço onde estilo e personalidade se encontram. 
              Profissionalismo e qualidade em cada corte.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/lipecortes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted/20 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 transition-all duration-300 group"
              >
                <Instagram className="w-5 h-5 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted/20 rounded-full flex items-center justify-center hover:bg-green-600 transition-all duration-300 group"
              >
                <MessageCircle className="w-5 h-5 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-heading font-semibold text-gold">Navegação</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-foreground/70 hover:text-foreground hover:text-gold transition-colors duration-300 link-underline"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-heading font-semibold text-gold">Serviços</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.label} className="flex justify-between items-center">
                  <span className="text-foreground/70">{service.label}</span>
                  <span className="text-gold font-semibold">{service.price}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => scrollToSection("#servicos")}
              className="text-accent hover:text-accent/80 font-medium transition-colors duration-300 link-underline"
            >
              Ver todos os serviços →
            </button>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-heading font-semibold text-gold">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <div className="text-foreground/90 font-medium">Rua das Flores, 123</div>
                  <div className="text-foreground/70 text-sm">Centro - São Paulo, SP</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <div>
                  <div className="text-foreground/90 font-medium">(11) 99999-9999</div>
                  <div className="text-foreground/70 text-sm">WhatsApp disponível</div>
                </div>
              </div>
            </div>
            <div className="bg-card/20 rounded-lg p-4 border border-border/20">
              <div className="text-sm text-foreground/70 mb-2">Funcionamento:</div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Seg - Sex</span>
                  <span className="text-gold">9h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado</span>
                  <span className="text-gold">8h - 16h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-foreground/60 text-sm">
                © {currentYear} Lipe Cortes. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-foreground/60">
              <span>Desenvolvido com</span>
              <div className="w-1 h-1 bg-accent rounded-full animate-pulse"></div>
              <span>e dedicação</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
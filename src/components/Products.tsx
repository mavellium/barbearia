import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Package } from "lucide-react";
import pomadeImage from "@/assets/product-pomade.jpg";
import beardOilImage from "@/assets/product-beard-oil.jpg";

const Products = () => {
  const products = [
    {
      id: 1,
      name: "Pomada Modeladora Premium",
      description: "Fixação extra forte com brilho natural. Perfeita para penteados elaborados que duram o dia todo.",
      price: "R$ 45",
      originalPrice: "R$ 55",
      image: pomadeImage,
      rating: 4.9,
      inStock: true,
      featured: true
    },
    {
      id: 2,
      name: "Óleo para Barba Hidratante",
      description: "Hidratação profunda e crescimento saudável. Aroma masculino e acabamento sedoso.",
      price: "R$ 35",
      originalPrice: "R$ 42",
      image: beardOilImage,
      rating: 4.8,
      inStock: true,
      featured: false
    },
    {
      id: 3,
      name: "Kit Completo Barba",
      description: "Óleo + Balm + Pente de madeira. Tudo que você precisa para uma barba impecável.",
      price: "R$ 89",
      originalPrice: "R$ 110",
      image: beardOilImage, // Using same image for demo
      rating: 5.0,
      inStock: false,
      featured: true
    },
    {
      id: 4,
      name: "Shampoo Anticaspa",
      description: "Fórmula especial para cabelos oleosos. Remove a caspa e deixa os fios saudáveis.",
      price: "R$ 28",
      originalPrice: null,
      image: pomadeImage, // Using same image for demo
      rating: 4.7,
      inStock: true,
      featured: false
    }
  ];

  const handleWhatsApp = (productName: string, price: string) => {
    const message = `Oi! Tenho interesse no produto "${productName}" por ${price}. Como posso comprar?`;
    const phoneNumber = "5511999999999"; // Replace with actual WhatsApp number
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <section id="produtos" className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-full mb-6">
            <Package className="w-8 h-8 text-accent-foreground" />
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Produtos <span className="text-gold">Premium</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Os melhores produtos para manter seu estilo em casa. Qualidade profissional ao seu alcance.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-6 group hover:shadow-luxury transition-all duration-500 ${
                product.featured ? "ring-2 ring-accent/20" : ""
              } ${index % 2 === 0 ? "animate-slide-in-left" : "animate-slide-in-right"} animation-delay-${index * 100}`}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-lg mb-4 bg-white">
                <img
                  src={product.image}
                  alt={`${product.name} - Lipe Cortes`}
                  className="w-full h-48 object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                />
                {product.featured && (
                  <div className="absolute top-3 left-3 bg-gradient-gold px-2 py-1 rounded-full">
                    <span className="text-xs font-semibold text-accent-foreground">Destaque</span>
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      Esgotado
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-accent fill-current"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-foreground/60">({product.rating})</span>
                </div>

                {/* Product Name */}
                <h3 className="font-heading font-semibold text-foreground group-hover:text-gold transition-colors">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gold">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Buy Button */}
                <Button
                  onClick={() => handleWhatsApp(product.name, product.price)}
                  disabled={!product.inStock}
                  className={`w-full group transition-all duration-300 ${
                    product.inStock
                      ? "btn-secondary hover:btn-hero"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {product.inStock ? (
                    <>
                      <ShoppingBag className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                      Comprar
                    </>
                  ) : (
                    "Indisponível"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-card to-muted/50 rounded-2xl p-8 border border-border/30 max-w-2xl mx-auto">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
              Entrega rápida na região
            </h3>
            <p className="text-foreground/70 mb-6">
              Produtos originais com garantia. Entregamos em até 24h na Grande São Paulo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handleWhatsApp("informações sobre entrega", "")}
                className="btn-hero"
              >
                Ver Condições de Entrega
              </Button>
              <Button 
                variant="outline"
                className="btn-secondary"
                onClick={() => document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" })}
              >
                Retirar na Loja
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
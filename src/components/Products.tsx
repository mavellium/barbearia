import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ProductOrderForm from "./ProductOrderForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, Package, ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  in_stock: boolean;
  featured: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('featured', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyProduct = (product: Product) => {
    if (!product.in_stock) return;
    setSelectedProduct(product);
    setIsOrderFormOpen(true);
  };

  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? "text-accent fill-accent" 
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section id="produtos" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground mt-4">Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="produtos" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-full mb-6">
            <ShoppingBag className="w-8 h-8 text-accent-foreground" />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Nossos <span className="text-gold">Produtos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Produtos premium selecionados especialmente para o cuidado masculino. 
            Qualidade profissional para usar em casa.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="card-luxury group hover:scale-105 transition-all duration-500 overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-card">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.featured && (
                    <Badge className="bg-accent text-accent-foreground border-0 text-xs">
                      Destaque
                    </Badge>
                  )}
                  {!product.in_stock && (
                    <Badge variant="destructive" className="text-xs">
                      Esgotado
                    </Badge>
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Product Content */}
              <div className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(5)}
                  <span className="text-xs text-muted-foreground ml-1">(5.0)</span>
                </div>

                {/* Product Info */}
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-gold transition-colors line-clamp-1">
                  {product.name}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                  {product.description}
                </p>

                {/* Price Section */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-accent">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  onClick={() => handleBuyProduct(product)}
                  className="w-full btn-hero group-hover:shadow-gold transition-all duration-300"
                  disabled={!product.in_stock || !user}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {!product.in_stock 
                    ? 'Produto Esgotado' 
                    : !user 
                    ? 'Faça login para comprar'
                    : 'Comprar Agora'
                  }
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum produto disponível
            </h3>
            <p className="text-muted-foreground">
              Produtos serão adicionados em breve.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center bg-gradient-card rounded-2xl p-8 border border-border/50">
          <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
            Delivery e Retirada na Loja
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-accent" />
                Entrega
              </h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>• Entrega rápida em toda a região</li>
                <li>• Frete grátis para compras acima de R$ 80</li>
                <li>• Embalagem premium para presente</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center">
                <Package className="w-5 h-5 mr-2 text-accent" />
                Retirada
              </h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>• Retire na loja sem custo adicional</li>
                <li>• Horário: Segunda a Sábado, 9h às 19h</li>
                <li>• Produto reservado por até 3 dias</li>
              </ul>
            </div>
          </div>
          
          {!user && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground">
                Faça login ou cadastre-se para realizar pedidos e acompanhar suas compras
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Product Order Form Modal */}
      {selectedProduct && (
        <ProductOrderForm
          isOpen={isOrderFormOpen}
          onClose={() => {
            setIsOrderFormOpen(false);
            setSelectedProduct(undefined);
          }}
          product={selectedProduct}
        />
      )}
    </section>
  );
};

export default Products;
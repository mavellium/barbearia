import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, User, Phone, MapPin, Package, CheckCircle, Minus, Plus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url?: string;
}

interface OrderFormData {
  client_name: string;
  client_phone: string;
  client_address: string;
  notes?: string;
}

interface ProductOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const ProductOrderForm: React.FC<ProductOrderFormProps> = ({ isOpen, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user, profile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<OrderFormData>();

  React.useEffect(() => {
    if (profile) {
      setValue('client_name', profile.name);
    }
  }, [profile, setValue]);

  const total = product.price * quantity;

  const onSubmit = async (data: OrderFormData) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para fazer um pedido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: total,
          client_name: data.client_name,
          client_phone: data.client_phone,
          client_address: data.client_address,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: product.id,
          quantity: quantity,
          price: product.price
        });

      if (itemError) throw itemError;

      setShowSuccess(true);
      reset();
      setQuantity(1);
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erro ao realizar pedido",
        description: "Não foi possível criar o pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Pedido Realizado!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Seu pedido foi registrado com sucesso. Entraremos em contato em breve para confirmar a entrega.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-gold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Finalizar Pedido
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha os dados para receber o produto
          </DialogDescription>
        </DialogHeader>

        {/* Product Summary */}
        <Card className="bg-muted/50 border-border/50">
          <CardContent className="pt-4">
            <div className="flex gap-4">
              {product.image_url && (
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{product.name}</h4>
                {product.description && (
                  <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(-1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="font-medium w-8 text-center">{quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(1)}
                      className="w-8 h-8"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">R$ {product.price.toFixed(2)} cada</p>
                    <p className="font-semibold text-accent">Total: R$ {total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_name" className="text-foreground">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="client_name"
                  type="text"
                  placeholder="Seu nome completo"
                  className="pl-10 bg-background/50 border-border/50"
                  {...register('client_name', { required: 'Nome é obrigatório' })}
                />
              </div>
              {errors.client_name && (
                <p className="text-sm text-destructive">{errors.client_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_phone" className="text-foreground">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="client_phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="pl-10 bg-background/50 border-border/50"
                  {...register('client_phone', { 
                    required: 'Telefone é obrigatório',
                    pattern: {
                      value: /^[\d\s\(\)\-\+]+$/,
                      message: 'Telefone inválido'
                    }
                  })}
                />
              </div>
              {errors.client_phone && (
                <p className="text-sm text-destructive">{errors.client_phone.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="client_address" className="text-foreground">Endereço completo</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                id="client_address"
                placeholder="Rua, número, bairro, cidade, CEP"
                className="pl-10 bg-background/50 border-border/50 resize-none"
                rows={3}
                {...register('client_address', { required: 'Endereço é obrigatório' })}
              />
            </div>
            {errors.client_address && (
              <p className="text-sm text-destructive">{errors.client_address.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-hero"
              disabled={isLoading || !user}
            >
              {isLoading ? 'Finalizando...' : `Finalizar Pedido - R$ ${total.toFixed(2)}`}
            </Button>
          </div>

          {!user && (
            <p className="text-sm text-muted-foreground text-center">
              Você precisa estar logado para fazer um pedido
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductOrderForm;
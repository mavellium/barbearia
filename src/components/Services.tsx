import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppointmentForm from "./AppointmentForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scissors, Clock, Star, Calendar } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  image_url: string;
  popular: boolean;
  active: boolean;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const { user } = useAuth();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('popular', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = (service: Service) => {
    setSelectedService(service);
    setIsAppointmentFormOpen(true);
  };

  if (loading) {
    return (
      <section id="servicos" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground mt-4">Carregando serviços...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="servicos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-full mb-6">
            <Scissors className="w-8 h-8 text-accent-foreground" />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Nossos <span className="text-gold">Serviços</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Técnicas modernas e produtos premium para realçar seu estilo único. 
            Cada corte é uma obra de arte personalizada.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="card-luxury group hover:scale-105 transition-all duration-500 overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Service Image */}
              <div className="relative h-64 overflow-hidden">
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-card flex items-center justify-center">
                    <Scissors className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                
                {/* Popular Badge */}
                {service.popular && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground border-0">
                    <Star className="w-3 h-3 mr-1" />
                    Mais Pedido
                  </Badge>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Service Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-gold transition-colors">
                    {service.name}
                  </h3>
                  <div className="text-right">
                    <p className="text-lg font-bold text-accent">
                      R$ {service.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {service.duration_minutes} min
                    </p>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <Button 
                  onClick={() => handleSchedule(service)}
                  className="w-full btn-hero group-hover:shadow-gold transition-all duration-300"
                  disabled={!user}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {user ? 'Agendar Agora' : 'Faça login para agendar'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-card rounded-2xl p-8 border border-border/50">
          <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
            Precisa de um atendimento personalizado?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Cada cliente é único. Entre em contato conosco para discutir suas necessidades específicas 
            e criar o visual perfeito para você.
          </p>
          <Button 
            onClick={() => setIsAppointmentFormOpen(true)}
            className="btn-hero"
            disabled={!user}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {user ? 'Agendar Consulta' : 'Faça login para agendar'}
          </Button>
          
          {!user && (
            <p className="text-sm text-muted-foreground mt-3">
              Faça login ou cadastre-se para agendar seus serviços
            </p>
          )}
        </div>
      </div>

      {/* Appointment Form Modal */}
      <AppointmentForm
        isOpen={isAppointmentFormOpen}
        onClose={() => {
          setIsAppointmentFormOpen(false);
          setSelectedService(undefined);
        }}
        selectedService={selectedService}
      />
    </section>
  );
};

export default Services;
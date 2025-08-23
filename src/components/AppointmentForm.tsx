import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Calendar, Clock, User, Phone, MessageSquare, CheckCircle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
  description: string;
}

interface AppointmentFormData {
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  client_name: string;
  client_phone: string;
  notes?: string;
}

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: Service;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ isOpen, onClose, selectedService }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user, profile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<AppointmentFormData>();

  const selectedServiceId = watch('service_id');
  const selectedServiceData = services.find(s => s.id === selectedServiceId);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      setValue('service_id', selectedService.id);
    }
  }, [selectedService, setValue]);

  useEffect(() => {
    if (profile) {
      setValue('client_name', profile.name);
    }
  }, [profile, setValue]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os serviços",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para agendar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          service_id: data.service_id,
          appointment_date: data.appointment_date,
          appointment_time: data.appointment_time,
          client_name: data.client_name,
          client_phone: data.client_phone,
          notes: data.notes,
          status: 'pending'
        });

      if (error) throw error;

      setShowSuccess(true);
      reset();
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erro ao agendar",
        description: "Não foi possível criar o agendamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
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
              <h3 className="text-lg font-semibold text-foreground">Agendamento Confirmado!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Seu horário foi reservado com sucesso. Você receberá uma confirmação em breve.
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
            <Calendar className="w-5 h-5" />
            Agendar Horário
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha os dados abaixo para agendar seu horário
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label className="text-foreground">Serviço</Label>
            <Select onValueChange={(value) => setValue('service_id', value)} defaultValue={selectedService?.id}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex justify-between items-center w-full">
                      <span>{service.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        R$ {service.price.toFixed(2)} • {service.duration_minutes}min
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service_id && (
              <p className="text-sm text-destructive">Selecione um serviço</p>
            )}
          </div>

          {/* Selected Service Info */}
          {selectedServiceData && (
            <Card className="bg-muted/50 border-border/50">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-foreground">{selectedServiceData.name}</h4>
                    {selectedServiceData.description && (
                      <p className="text-sm text-muted-foreground mt-1">{selectedServiceData.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-accent">R$ {selectedServiceData.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{selectedServiceData.duration_minutes} minutos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment_date" className="text-foreground">Data</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="appointment_date"
                  type="date"
                  min={getMinDate()}
                  className="pl-10 bg-background/50 border-border/50"
                  {...register('appointment_date', { required: 'Data é obrigatória' })}
                />
              </div>
              {errors.appointment_date && (
                <p className="text-sm text-destructive">{errors.appointment_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Horário</Label>
              <Select onValueChange={(value) => setValue('appointment_time', value)}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeSlots().map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.appointment_time && (
                <p className="text-sm text-destructive">Selecione um horário</p>
              )}
            </div>
          </div>

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

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-foreground">Observações (opcional)</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                id="notes"
                placeholder="Alguma observação especial para o agendamento?"
                className="pl-10 bg-background/50 border-border/50 resize-none"
                rows={3}
                {...register('notes')}
              />
            </div>
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
              {isLoading ? 'Agendando...' : 'Confirmar Agendamento'}
            </Button>
          </div>

          {!user && (
            <p className="text-sm text-muted-foreground text-center">
              Você precisa estar logado para fazer um agendamento
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;
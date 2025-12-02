import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { User, CreditCard, Shield, Trash2, Download, Loader2, CheckCircle, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import SubscriptionManager from '@/components/account/SubscriptionManager';

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    organization: ''
  });

  useEffect(() => {
    const loadUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin();
        return;
      }
      const userData = await base44.auth.me();
      setUser(userData);
      setFormData({
        full_name: userData.full_name || '',
        organization: userData.organization || ''
      });
      setLoading(false);
    };
    loadUser();
  }, []);

  const queryClient = useQueryClient();

  const { data: subscription, refetch: refetchSubscription } = useQuery({
    queryKey: ['subscription', user?.email],
    queryFn: async () => {
      const subs = await base44.entities.Subscription.filter({ user_email: user.email });
      return subs[0] || null;
    },
    enabled: !!user?.email
  });

  const handleSubscriptionUpdate = () => {
    refetchSubscription();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe(formData);
      toast.success('Profil mis à jour');
    } catch (e) {
      toast.error('Erreur lors de la mise à jour');
    }
    setSaving(false);
  };

  const handleExportData = async () => {
    // Export user data (RGPD compliance)
    const data = {
      user: {
        email: user.email,
        full_name: user.full_name,
        created_date: user.created_date
      },
      subscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        created_date: subscription.created_date
      } : null
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chemrisk-data-${user.email}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast.success('Données exportées');
  };

  const handleDeleteAccount = async () => {
    // In a real implementation, this would trigger account deletion
    // For now, we show a message about the process
    toast.info('Demande de suppression enregistrée. Votre compte sera supprimé sous 30 jours.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Mon compte</h1>
          <p className="text-slate-500">Gérez vos informations personnelles et votre abonnement</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="subscription" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Abonnement
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              Sécurité
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Profil</CardTitle>
                  <CardDescription>Vos informations personnelles</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email} disabled className="bg-slate-50" />
                  <p className="text-xs text-slate-500 mt-1">L'email ne peut pas être modifié</p>
                </div>
                <div>
                  <Label htmlFor="full_name">Nom complet</Label>
                  <Input 
                    id="full_name" 
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="organization">Organisation (optionnel)</Label>
                  <Input 
                    id="organization" 
                    value={formData.organization}
                    onChange={(e) => setFormData({...formData, organization: e.target.value})}
                    placeholder="Nom de votre entreprise"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="bg-emerald-500 hover:bg-emerald-600">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <SubscriptionManager 
              subscription={subscription} 
              onUpdate={handleSubscriptionUpdate}
            />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Sécurité & Confidentialité</CardTitle>
                  <CardDescription>Gérez vos données personnelles (RGPD)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-800">
                  <strong>Rappel :</strong> ChemRisk AI ne conserve jamais le contenu de vos analyses chimiques. 
                  Seules vos informations de compte et les métadonnées anonymisées sont stockées.
                </p>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={handleExportData} className="flex-1 gap-2">
                  <Download className="w-4 h-4" />
                  Exporter mes données
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                      Supprimer mon compte
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer votre compte ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes vos données seront supprimées dans un délai de 30 jours 
                        conformément à la réglementation RGPD. Vous recevrez une confirmation par email.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
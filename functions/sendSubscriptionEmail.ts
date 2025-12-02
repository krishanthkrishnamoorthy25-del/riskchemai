import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { type, userEmail, userName, planName } = await req.json();

    if (!userEmail || !type) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 });
    }

    let subject = '';
    let body = '';

    if (type === 'subscription_confirmation') {
      subject = `✅ Bienvenue sur ChemRisk AI - Abonnement ${planName} activé`;
      body = `
Bonjour ${userName || 'cher utilisateur'},

Merci pour votre confiance ! Votre abonnement ${planName} est maintenant actif.

📋 Récapitulatif :
- Plan : ${planName}
- Email : ${userEmail}
- Date d'activation : ${new Date().toLocaleDateString('fr-FR')}

🔐 Sécurité des paiements :
Vos données bancaires sont gérées exclusivement par Stripe (certifié PCI-DSS Level 1). 
Nous n'avons jamais accès à vos numéros de carte.

🚀 Prochaines étapes :
1. Accédez à votre Dashboard pour lancer votre première analyse
2. Explorez le simulateur de réactions
3. Configurez vos préférences dans Mon Compte

📧 Vos factures seront envoyées automatiquement à cette adresse.

Si vous avez des questions, contactez-nous à support@chemrisk-ai.com

L'équipe ChemRisk AI
      `.trim();
    } 
    else if (type === 'satisfaction_survey') {
      subject = `📊 Votre avis compte - Comment améliorer ChemRisk AI ?`;
      body = `
Bonjour ${userName || 'cher utilisateur'},

Vous utilisez ChemRisk AI depuis quelques jours et nous aimerions avoir votre retour.

🎯 3 questions rapides :

1. Qu'est-ce qui vous plaît le plus dans ChemRisk AI ?
   (Répondez simplement en répondant à cet email)

2. Quelles fonctionnalités aimeriez-vous voir ajoutées ?
   - Plus de bases de données ?
   - Export dans d'autres formats ?
   - Intégrations avec d'autres outils ?
   - Autre ?

3. Avez-vous rencontré des difficultés ?
   Si oui, décrivez-les brièvement.

💡 Vos suggestions sont essentielles pour améliorer la plateforme.
Chaque retour est lu et pris en compte.

Merci de prendre 2 minutes pour nous répondre !

L'équipe ChemRisk AI
support@chemrisk-ai.com
      `.trim();
    }
    else if (type === 'billing_reminder') {
      subject = `📄 ChemRisk AI - Informations de facturation`;
      body = `
Bonjour ${userName || 'cher utilisateur'},

Pour finaliser votre abonnement, nous avons besoin de quelques informations :

📋 Informations requises :
- Nom / Raison sociale
- Adresse de facturation
- Pays (pour le calcul de TVA)
- Numéro de TVA (si applicable, entreprises UE)

👉 Rendez-vous dans Mon Compte > Abonnement pour compléter ces informations.

🔒 Rappel sécurité :
Tous les paiements sont traités par Stripe. Nous ne stockons aucune donnée bancaire.
Vos factures sont générées automatiquement et conformes aux normes européennes.

L'équipe ChemRisk AI
      `.trim();
    }

    if (subject && body) {
      await base44.integrations.Core.SendEmail({
        to: userEmail,
        subject,
        body
      });
    }

    return Response.json({ success: true, type });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
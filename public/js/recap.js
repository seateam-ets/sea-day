// ─────────────────────────────────────────────────────────────
//  RÉCAP DU SEA DAY : synthèse du compte-rendu (content/compte-rendu.md)
//  Les priorités, responsables et dates sont saisis sur la page /
//  et partagés en direct (clés prio:<id>, prio:<id>:o, prio:<id>:d).
// ─────────────────────────────────────────────────────────────

export const DIRECTION = {
  text: "Toujours du SEA qui cible et orchestre de plus gros clients, sans délaisser les petits.",
  sub: "La cible d'acquisition doit séduire de nouveaux gros clients.",
  pillars: ["Transparence", "Témoignages clients"],
};

export const THEMES = {
  outils: "Outils & IA", lp: "Landing pages", annonces: "Annonces", brief: "Brief & onboarding",
  tracking: "Tracking", orga: "Organisation", tarifs: "Offre & tarifs", client: "Relation client",
  reporting: "Reporting", vente: "Vente & visibilité",
};

// owner = responsable noté pendant la journée (modifiable sur la page)
export const ACTIONS = [
  { id: "outils", theme: "outils", t: "Règles d'utilisation des outils IA, et protections pour ne rien casser", owner: "Quentin" },
  { id: "lp_tracking", theme: "lp", t: "Lucas prend le tracking des landing pages", d: ["GTM et accès", "GA4", "Checklist LP nourrie par les métiers SEA, SEO et autres"], owner: "Lucas" },
  { id: "lp_agent", theme: "lp", t: "Skills + agent qui se connecte, audite et valide les landing pages", d: ["Pour que Lucas soit accompagné dans la validation"], owner: "Lucas" },
  { id: "lp_ovh", theme: "lp", t: "Landing pages faites avec Claude Code, publiées via Git sur le serveur interne OVH", owner: "Dean" },
  { id: "annonces", theme: "annonces", t: "Repo de connaissance métier pour les annonces", d: ["Bonnes pratiques et nomenclatures", "Toujours demander les objectifs"], owner: "Quentin" },
  { id: "brief", theme: "brief", t: "Ce qu'on demande systématiquement au client", d: ["Expertises marché", "Qualité des leads", "Listes d'audience", "Promos (dans le plan média ?)"], owner: "" },
  { id: "onboarding", theme: "brief", t: "Plan d'onboarding dès le bon de commande signé", d: ["Mail type de demande d'accès", "Suivi de l'onboarding dans le Hub", "Étape qui coince le plus (2 votes)"], owner: "" },
  { id: "plan_media", theme: "brief", t: "Plan média dans le Hub", owner: "" },
  { id: "tracking", theme: "tracking", t: "Outil de monitoring des setups et du tracking", d: ["Flux et outils connectés d'un client", "Vérifier que tout est bien connecté", "Flux produits : l'avenir avec l'IA"], owner: "Mh & TM" },
  { id: "taches", theme: "orga", t: "Les tâches naissent du bon de commande dans le Hub", d: ["Créées par chaque TM", "Le bon de commande crée l'équipe Teams, les tâches, les heures", "La base reste gérée par le TL, qui voit les heures disponibles"], owner: "TL" },
  { id: "formules", theme: "tarifs", t: "Formules : gestion globale + catalogue, pas de packs figés", d: ["Différencier un client custom d'un plus petit client", "Gros clients : détail des visuels, LP, etc.", "Chiffrer avant de foncer (Lucas chiffre le temps)", "Récupérer le reliquat de budget (comme pour Stape)"], owner: "TL pour DC" },
  { id: "services", theme: "tarifs", t: "Ajouter les services CRM, emailing… au catalogue", owner: "" },
  { id: "visibilite", theme: "client", t: "Rendre notre travail visible chaque mois", d: ["Reporting automatique : objectifs, KPIs, « on travaille pour… », rappel des attentes", "Bloc upsell dynamique sous le reporting", "Fiche client publique de ce qui est en cours", "Définir la récurrence des contacts", "Vulgariser les chiffres avec des exemples de pubs"], owner: "TM & TL" },
  { id: "reporting_day", theme: "reporting", t: "Journée de mise en place : clean du portfolio, reportings dédiés, envoi automatique", owner: "" },
  { id: "proposal", theme: "vente", t: "Proposal façon Ze Agency, avec signature", owner: "Quentin" },
  { id: "case_studies", theme: "vente", t: "6 case studies", d: ["Telecredit : Quentin", "Vet n o : Caro", "Amarris : Nélia", "Péville : Lucas", "Ouyoux : Mh", "Lutosa : Mélissa"], owner: "Toute l'équipe" },
  { id: "certifs", theme: "vente", t: "Certifications & awards : se fixer un objectif", owner: "" },
];

export const DECIDED = [
  { q: "Lance-t-on une campagne si le contrat n'est pas payé ?", a: "Au cas par cas." },
];

export const HEARD = [
  { t: "Nos outils", s: "Hub, Teamwork, Teams, Outlook, Claude, ChatGPT, Canva, CapCut, AdPilot, Replit, Agorapulse, Excel, PowerPoint… et un agenda papier.", k: "Beaucoup d'outils : l'info se disperse." },
  { t: "Ce qu'on veut apprendre", s: "L'IA (Lucas, Nélia, Mélissa) · le tracking (Nélia, Lucas) · le design, les LP et la vidéo (Caro, Lucas) · le dev et le SEO (Mélissa)." },
  { t: "Ce qui fait perdre du temps", s: "L'info éparpillée entre mails, Teamwork et Teams (Caro, Mélissa) · trop de réunions et des incohérences entre départements (Lucas) · la génération d'images (Nélia) · l'absence de plan média (Caro)." },
  { t: "Ce qu'on change dès demain", s: "Centraliser l'info (le Hub) · simplifier les outils · se structurer · mieux communiquer sur les actions eTeamsys · être plus proches des commerciaux." },
  { t: "Nos fiertés", s: "Delta (Quentin) · de plus en plus de sites et LP, Noshaq, Péville (Lucas) · la nouvelle vidéo Amarris qui marche (Nélia) · l'accompagnement et la confiance des derniers clients (Caro) · un nouveau client (Mélissa)." },
];

export const STUCK = [
  { t: "Accès & onboarding", votes: 2, items: ["Les clients n'ont pas leurs accès", "Le client ne possède pas ses ressources, on court après", "Accès Meta, restrictions de comptes publicitaires", "Mail type d'accès", "Suivi de l'onboarding dans le Hub", "Un plan d'onboarding dès le bon de commande signé"] },
  { t: "Brief & données", votes: 1, items: ["Informations et plan", "Manque de données pour piloter", "Site web du client"] },
  { t: "Visuels", votes: 1, items: ["Le contenu visuel"] },
  { t: "Tracking", votes: 1, items: ["Nouveau formulaire Meta ↔ HubSpot"] },
  { t: "Facturation & budget", votes: 0, items: ["Facturation client ou interne", "Les recharges", "Budget Pro", "Les promesses du DC"] },
];

export const HUB = [
  { t: "On garde", c: "teal", items: ["Pipe web (suivi LP, liste de tâches)", "Log du temps"] },
  { t: "À faire évoluer", c: "violet", items: ["Actions réalisées en GEST dans le log du temps, reprises dans le reporting", "Milestones sur base des transactions, raison si perte", "Récurrence des meetings", "« Mes tâches » et « mes demandes » sur une seule page", "Backlog = tag « à traiter »"] },
  { t: "Il manque", c: "orange", items: ["Le bon de commande signé", "Une vue des reportings dédiés"] },
  { t: "À retirer", c: "muted", items: ["Sous-onglets du suivi d'équipes", "Tout ce qui est répétitif", "Check list", "Guides SEA → lien direct vers le wiki", "Snippets SEO, SMM/Design, WEBD", "Vue dédiée aux milestones"] },
];

export const OFFER = [
  { t: "À vendre", items: ["Pack Performance 360", "Audit « prêt pour l'IA »", "Landing page conversion", "Emailing dans l'offre", "Formule custom et formule générale"] },
  { t: "Upsell clients actifs", items: ["Créas & vidéos IA à la demande", "Remontée des leads & CRM", "Flux e-commerce optimisé"] },
  { t: "Fédérer nos clients", items: ["Témoignages clients", "Point stratégie trimestriel", "Club clients eTeamsys", "Newsletter « ce qui change »", "ETS Academy"] },
];

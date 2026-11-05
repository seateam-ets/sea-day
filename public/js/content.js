// ─────────────────────────────────────────────────────────────
//  CONTENU DU SEA DAY : tout le texte du deck est ici.
// ─────────────────────────────────────────────────────────────

// Accès affiché à l'écran (QR + code). À changer aussi dans Vercel (SEADAY_PASSWORD) si on le modifie.
export const ACCESS = { host: "seaday.eteamsys.be", url: "seaday.eteamsys.be/repondre", code: "seaday2026" };

export const PEOPLE = [
  { id: "quentin", name: "Quentin", role: "Team Leader" },
  { id: "mh", name: "Mh", role: "Team Leader" },
  { id: "lucas", name: "Lucas", role: "Team Member" },
  { id: "nelia", name: "Nélia", role: "Team Member" },
  { id: "caro", name: "Caro", role: "Team Member" },
  { id: "melissa", name: "Mélissa", role: "Team Member" },
];

export const TOUR_QUESTIONS = [
  { id: "q1", short: "Monter en compétences", text: "Sur quel sujet, outil ou compétence aimerais-tu te former ou monter en compétences pour être plus à l'aise et serein(e) au quotidien ?" },
  { id: "q2", short: "Ce qui fait perdre du temps", text: "Quel outil, réunion ou processus actuel te fait perdre le plus de temps ou génère le plus de frustration au quotidien ?" },
  { id: "q3", short: "Une chose à changer dès demain", text: "S'il y avait une seule chose à changer radicalement dans notre façon de collaborer ou de communiquer ensemble dès demain, ce serait quoi ?" },
  { id: "q4", short: "Ma fierté récente", text: "Quelle est la réussite récente (individuelle ou collective) dont tu es le plus fier ou la plus fière, et qu'est-ce qui a rendu cela possible ?" },
];

export const AGENDA = [
  { id: "tour", icon: "◎", title: "Tour de table", who: "Mh" },
  { id: "demain", icon: "↗", title: "Métier de demain + upsell", who: "Quentin · Mh" },
  { id: "pause1", icon: "❚❚", title: "Pause", who: "" },
  { id: "jeux", icon: "?", title: "Petits jeux SEA", who: "Mh" },
  { id: "process", icon: "⌘", title: "Process SEA & outils", who: "Quentin" },
  { id: "conclusion", icon: "✓", title: "Conclusion du matin", who: "Quentin · Mh" },
  { id: "diner", icon: "🍽", title: "Dîner", who: "" },
  { id: "cruz", icon: "⚡", title: "SEA Cruz, hub & produit à vendre", who: "Quentin" },
  { id: "news", icon: "★", title: "Nouveautés", who: "Mh" },
  { id: "fin", icon: "◆", title: "Clôture", who: "" },
];

// ── Point d'attention : clean clients & reporting (chiffres AdPilot, 5 nov. 2026) ─
export const ADPILOT_STATS = [
  { id: "portfolio", n: "?", t: "clients dans notre portfolio", s: "Ceux qu'on gère vraiment : à compter ensemble", edit: true },
  { id: "reportings", n: "24", t: "reportings dédiés dans AdPilot", s: "qui couvrent 18 clients (hors eTeamsys)" },
  { id: "sans", n: "?", t: "clients sans reporting dédié", s: "encore sur PowerPoint, ou sans rien" },
  { id: "auto", n: "3", t: "envois automatiques", s: "et aucun envoi depuis fin août 2026" },
  { id: "sync", n: "39", t: "comptes en erreur de synchro", s: "des données qui ne remontent plus dans AdPilot" },
];
export const CLEAN_ACTIONS = [
  { t: "Faire le clean du portfolio", s: "Les clients qu'on gère : qui est actif, qui ne l'est plus, ce qu'on offre réellement à chacun." },
  { t: "Fini les PowerPoint", s: "Toutes les données sont dans AdPilot : un reporting dédié pour chaque client du portfolio." },
  { t: "Envoi automatique des reportings", s: "Planifié, avec les bons KPI par client. Aujourd'hui, on ne le fait pas." },
  { t: "Interroger AdPilot avec Claude", s: "« Quels comptes ont dépensé sans convertir ce mois-ci ? » : la réponse en une question." },
];
export const ADPILOT_PROMPTS = [
  "Lesquels de nos clients n'ont pas encore de reporting dédié ?",
  "Quels comptes ont dépensé ce mois-ci sans aucune conversion ?",
  "Quels comptes sont en erreur de synchronisation ?",
  "Quelles sont les 5 meilleures annonces de ce client sur 90 jours ?",
];

// ── Le Hub : faire évoluer, prioriser ce qu'on utilise vraiment ─
export const HUB_COLS = [
  { id: "garder", t: "On l'utilise vraiment", s: "À garder et à mettre en avant", c: "teal" },
  { id: "evoluer", t: "À faire évoluer", s: "Utile, mais à améliorer en priorité", c: "violet" },
  { id: "nouveau", t: "Il nous manque", s: "Ce qu'on aimerait y trouver", c: "orange" },
  { id: "retirer", t: "On ne s'en sert pas", s: "À simplifier ou retirer", c: "muted" },
];

// ── Pourquoi on est là ───────────────────────────────────────
export const PURPOSE = [
  { n: "01", t: "Se retrouver", s: "Une journée ensemble, hors du quotidien, pour se dire ce qui va et ce qui coince." },
  { n: "02", t: "Redéfinir le métier de demain", s: "Ensemble : ce qu'on fait, comment on le fait, ce qu'on arrête." },
  { n: "03", t: "Repartir avec une offre", s: "Un produit à vendre ou un upsell pour nos clients actifs, et une façon de les fédérer." },
];

// ── Atelier offre (l'après-midi) ─────────────────────────────
export const OFFER_TRACKS = [
  { id: "produit", t: "Un produit à vendre", s: "Une offre packagée, avec un nom, un prix, un périmètre clair." },
  { id: "upsell", t: "Upsell clients actifs", s: "Ce qu'on peut proposer en plus à ceux qu'on gère déjà." },
  { id: "federer", t: "Fédérer nos clients", s: "Les faire se sentir membres d'un club, pas seulement payeurs de factures." },
];

// Idées de départ (pré-remplies, à voter / modifier / compléter en séance)
export const OFFER_SEEDS = [
  { id: "s1", track: "produit", t: "Pack Performance 360", s: "Gestion SEA + tracking (GA4, Consent Mode V2, CAPI) + 1 landing page/trimestre + créas IA. Forfait mensuel." },
  { id: "s2", track: "produit", t: "Audit « prêt pour l'IA »", s: "AI Max, AI Mode, PMax, flux, tracking : un audit livré en 1 semaine, prix fixe, porte d'entrée vers la gestion." },
  { id: "s3", track: "produit", t: "Landing page conversion", s: "Page dédiée prête en 10 jours : visuels, prix, SEO, responsive, tracking, A/B test." },
  { id: "s4", track: "upsell", t: "Créas & vidéos IA à la demande", s: "Déclinaisons Shorts/Reels/PMax via le repo motion, au pack de 10." },
  { id: "s5", track: "upsell", t: "Remontée des leads & CRM", s: "Formulaires → CRM, conversions hors ligne, qualité des leads." },
  { id: "s6", track: "upsell", t: "Flux e-commerce optimisé", s: "Merchant Center, titres/attributs, feed rules : ce que l'UCP va rendre décisif." },
  { id: "s7", track: "federer", t: "Point stratégie trimestriel", s: "Résultats, optimisations faites, plan à 3 mois. La leçon Cetronic : rendre le travail visible." },
  { id: "s8", track: "federer", t: "Club clients eTeamsys", s: "Un webinar/petit-déj par trimestre : nouveautés SEA, retours d'expérience entre clients." },
  { id: "s9", track: "federer", t: "Newsletter « ce qui change »", s: "Chaque mois, les nouveautés Google/Meta/Microsoft expliquées pour nos clients." },
];

// ── Cas Cetronic ─────────────────────────────────────────────
export const CETRONIC_MAIL = [
  { k: "Factures", t: "Je viens de recevoir deux factures de gestion SEA pour ce mois-ci (535 € et 214 €). Peux-tu m'expliquer à quoi correspondent ces deux montants ?" },
  { k: "ChatGPT Ads", t: "Où en sommes-nous avec les campagnes ChatGPT Ads ? […] J'imagine que rien n'a encore été lancé ?" },
  { k: "L'IA", t: "Plusieurs personnes de mon entourage gèrent d'ailleurs leurs campagnes directement via Claude ou ChatGPT, avec des résultats assez impressionnants." },
  { k: "Visibilité", t: "Je paie plus de 500 € par mois en frais de gestion, sans avoir réellement de visibilité sur le travail effectué, les optimisations apportées ou les résultats concrets obtenus." },
  { k: "Prix", t: "J'estime que les tarifs actuels ne sont plus forcément en adéquation avec les outils disponibles et le travail réellement nécessaire." },
];

export const CETRONIC_DONE = [
  { t: "Visuels pour les campagnes", s: "sans facturation supplémentaire" },
  { t: "Landing page dédiée", s: "sans frais supplémentaires" },
  { t: "Tests de campagnes et de stratégies", s: "types de campagnes, enchères, angles" },
  { t: "Autres canaux : Meta", s: "habituellement une prestation distincte" },
  { t: "Tracking et qualité de la donnée", s: "optimisation continue" },
];

// Arguments repris de la réponse de Quentin à Cetronic
export const METIER_AUJOURDHUI = [
  { t: "Plus qu'un gestionnaire de campagnes", s: "Une réflexion globale sur la stratégie d'acquisition et les leviers à activer pour améliorer les résultats." },
  { t: "Un forfait qui couvre large", s: "Les heures de gestion sont lissées sur un spectre d'intervention plus large, au lieu de facturer chaque action ou développement à part." },
  { t: "Du concret, pas que des réglages", s: "Visuels, landing page, tests de campagnes, nouveaux canaux (Meta), tracking et qualité des données." },
  { t: "L'IA, on l'utilise aussi", s: "Claude et ChatGPT accélèrent l'exécution. On les intègre déjà dans notre façon de travailler." },
  { t: "Notre valeur : l'expertise", s: "Connaissance du métier, recul sur les recommandations, bons choix stratégiques, des années d'expérience." },
  { t: "Une formule claire", s: "Garder l'approche globale (les 5 h se justifient, et on revoit le budget de diffusion) ou réduire les frais en recentrant le périmètre." },
  { t: "Rendre le travail visible", s: "Des échanges réguliers en plus du reporting : résultats, optimisations faites, prochaines actions, stratégie remise en perspective." },
  { t: "Se remettre en question", s: "Tout évolue très vite : revoir régulièrement nos méthodes pour continuer à apporter une vraie valeur ajoutée." },
];

export const CETRONIC_LESSONS = [
  { t: "Ce qu'on ne montre pas n'existe pas", s: "On a lissé les heures sur un spectre large… et le client ne l'a pas vu." },
  { t: "Le reporting ne suffit plus", s: "Des points réguliers : résultats, optimisations faites, prochaines actions." },
  { t: "L'IA accélère, elle ne décide pas", s: "Notre valeur : connaissance métier, recul, choix stratégiques, expérience." },
  { t: "Une formule, deux options", s: "Garder l'approche globale (5 h/mois + budget de diffusion revu) ou réduire le périmètre et les frais." },
];

// ── Métier de demain ─────────────────────────────────────────
export const LEVERS = [
  { n: "01", t: "Création & contenu", up: "Créatifs, UGC et vidéos IA", c: "violet" },
  { n: "02", t: "Conversion & CRO", up: "Landing pages et A/B tests", c: "teal" },
  { n: "03", t: "Data & CRM", up: "CRM, automation, remontée des leads", c: "orange" },
  { n: "04", t: "Tracking & mesure", up: "GA4, Consent Mode V2, CAPI, server-side", c: "blue" },
];

export const HIER_DEMAIN = [
  ["Piloter des campagnes", "Piloter la croissance (full-funnel)"],
  ["Mots-clés et enchères", "Créas, landing pages, flux, données"],
  ["Le client fournit tout", "On détecte les besoins et on propose"],
  ["Reporting mensuel", "Points réguliers + valeur rendue visible"],
  ["Heures de gestion", "Solutions vendues (upsell)"],
  ["Exécuter à la main", "Exécuter avec l'IA, décider avec l'expertise"],
];

export const UPSELL = [
  { t: "Visuels & vidéos IA", s: "Repo motion + Claude Code : déclinaisons, formats Shorts/Reels, UGC", tag: "Création" },
  { t: "Landing page conversion", s: "Page dédiée, prix, SEO, responsive, A/B test", tag: "CRO" },
  { t: "Flux e-commerce", s: "Merchant Center, optimisation titres/attributs, feed rules", tag: "Commerce" },
  { t: "Remontée des leads", s: "Formulaires → CRM, conversions hors ligne, qualité des leads", tag: "Data" },
  { t: "Audit & mise à niveau tracking", s: "GA4, GTM, Consent Mode V2, CAPI, server-side", tag: "Tracking" },
  { t: "Nouveaux canaux", s: "Meta, Microsoft, LinkedIn, ChatGPT Ads (quand c'est mûr)", tag: "Acquisition" },
];

// ── Process SEA à redessiner ─────────────────────────────────
export const PROCESS_STEPS = [
  { t: "Bon de commande signé", s: "Rien ne se configure avant (wiki)" },
  { t: "Onboarding & accès", s: "GA4, GTM, flux, régies, CRM" },
  { t: "Brief & objectifs", s: "See–Think–Do, KPIs, LP" },
  { t: "Visuels", s: "Repo motion / Claude Code" },
  { t: "Landing page", s: "Prix, SEO, responsive" },
  { t: "Tracking", s: "Consent Mode V2, GTM, CAPI" },
  { t: "Lancement", s: "Annonces, extensions, PMax" },
  { t: "Optimisation", s: "Routine, tests" },
  { t: "Reporting & point client", s: "Valeur rendue visible" },
];

// Ce qui traîne aujourd'hui (affiché en vrac sur la slide « le bordel »)
export const PROCESS_MESS = [
  "Capture d'écran GTM", "PowerPoint de reporting", "Replit ou GitHub ?", "Claude ou ChatGPT ?",
  "Qui valide la LP ?", "Le contrat est payé ?", "Liens annexes ?", "Thèmes de recherche PMax ?",
  "Qui crée la tâche ?", "Consent Mode V2 ?", "Modifs dans Replit", "Prix sur la LP ?",
];
export const PROCESS_QUESTIONS = ["Est-ce qu'on va assez vite ?", "Qu'est-ce qui coince ?", "Que peut-on améliorer ?"];

export const DECISIONS = [
  { id: "outils", theme: "Outils", q: "Claude, Claude Code, ChatGPT, Replit, GitHub : qui sert à quoi ?",
    hint: "Proposition : Claude = rédaction, analyse, annonces · Claude Code = code, repo motion, landing pages · GitHub = source unique · Replit = hébergement seulement (plus de modifs dedans) · ChatGPT = au cas par cas ?" },
  { id: "lp", theme: "Landing pages", q: "Qui valide une landing page avant de la déclarer terminée ?",
    hint: "Tout le monde peut en faire, une personne référente relit : prix, SEO, responsive, tracking, consent." },
  { id: "lp_check", theme: "Landing pages", q: "La checklist de validation d'une landing page",
    hint: "Visuels · prix · balises SEO (title, meta, Hn) · responsive · formulaire → CRM · Consent Mode V2 · tags GTM · vitesse." },
  { id: "annonces", theme: "Annonces", q: "Rédaction des annonces : quel outil, quel prompt commun ?",
    hint: "Un prompt partagé (ton, USP, 15 titres / 4 descriptions) dans le repo." },
  { id: "pmax", theme: "Brief", q: "Qu'est-ce qu'on demande systématiquement au client ?",
    hint: "Liens annexes, thèmes de recherche (PMax), USP, prix, promos, audiences, exclusions…" },
  { id: "tracking", theme: "Tracking", q: "GTM & Consent Mode V2 : comment on documente (stop captures d'écran) ?",
    hint: "Export du conteneur GTM versionné, note de setup dans le repo client, checklist Consent Mode V2." },
  { id: "taches", theme: "Organisation", q: "Qui crée les tâches, où, avec quel niveau de détail ?",
    hint: "TL à la signature ? Chaque TM pour ses comptes ? Modèle de tâche commun ?" },
  { id: "contrat", theme: "Organisation", q: "Lance-t-on une campagne si le contrat n'est pas payé ?",
    hint: "Le wiki dit : ne rien configurer avant la signature du bon de commande. Et le paiement ?" },
  { id: "visibilite", theme: "Client", q: "Comment rendre notre travail visible chaque mois (leçon Cetronic) ?",
    hint: "Journal des optimisations ? Point trimestriel ? Section « ce qu'on a fait » dans le reporting ?" },
];

// ── SEA Cruz ─────────────────────────────────────────────────
export const CRUZ = {
  steps: [
    { t: "On demande", s: "« Baisse de 10 % les enchères des groupes qui ont un CPA > 40 € sur 30 jours »" },
    { t: "Claude lit", s: "Le MCP interroge l'API Google Ads : campagnes, groupes, métriques" },
    { t: "Claude propose", s: "Liste des changements, avec le pourquoi" },
    { t: "On valide", s: "L'humain garde la décision" },
    { t: "Claude applique", s: "Modifications via l'API, journalisées" },
  ],
  pros: ["Vitesse sur les tâches répétitives", "Analyse multi-comptes", "Traçabilité des changements"],
  cons: ["Garde-fous et validation humaine", "Droits d'accès MCC", "Savoir quand ne pas automatiser"],
};

// ── Petits jeux (provisoire, à remplacer par le .md de Mh) ───
export const GAMES = [
  { id: "quisuisje", name: "Qui suis-je ?", rule: "Une personne fait deviner l'élément à son équipe en le décrivant, sans dire son nom.", time: 60,
    cards: ["Performance Max", "Quality Score", "Consent Mode V2", "Google Tag Manager", "Merchant Center", "ROAS", "Landing page", "Advantage+ Sales", "Andromeda", "Liens annexes", "Remarketing", "Demand Gen", "AI Max", "GA4", "Mot-clé négatif"] },
  { id: "motinterdit", name: "Mot interdit", rule: "Faire deviner le mot sans prononcer les mots interdits.", time: 60,
    cards: ["ROAS | retour · dépense · rentabilité", "PMax | Google · campagne · automatique", "Pixel | Meta · code · suivi", "Enchère | prix · clic · CPC", "Landing page | page · site · atterrissage", "Budget | argent · jour · dépense", "CTR | clic · taux · impression", "Conversion | vente · lead · objectif"] },
  { id: "pictionary", name: "Pictionary SEA", rule: "Dessiner, sans lettres ni chiffres.", time: 90,
    cards: ["Entonnoir de conversion", "Remarketing", "Taux de rebond", "Flux produits", "Cookie banner", "A/B test", "Enchère au clic", "Le client qui ne répond plus"] },
  { id: "client", name: "Client impossible", rule: "Un joueur incarne le client, l'autre doit garder le contrat.", time: 120,
    cards: ["« Mon neveu fait ça avec ChatGPT pour 0 €. »", "« Je veux être premier sur Google. Sur tous les mots. »", "« Pourquoi je paie si les ventes baissent ? »", "« Coupez tout, on n'a pas de résultats » (après 4 jours)", "« Le budget ? On verra selon les résultats. »", "« Vous pouvez changer le logo dans la pub ? Et la police. Et la couleur. »"] },
];

// ── Notes orateur (affichées sur la télécommande) ────────────
export const NOTES = {
  welcome: "Écran d'accueil affiché pendant que tout le monde s'installe.",
  agenda: "Présenter le déroulé. Lucas absent une heure dans la matinée : les jeux SEA tombent juste après la pause.",
  tour: "Mh anime. Chacun répond depuis son téléphone (QR / lien /repondre) ou on remplit en direct.",
  cetronic_mail: "Lire les extraits. Demander à l'équipe : qu'auriez-vous répondu ?",
  cetronic_done: "Tout ce qu'on a fait… sans que le client le voie.",
  metier_ajd: "Les arguments de ma réponse à Cetronic : ce qu'on doit tous savoir expliquer à un client.",
  metier: "Le gestionnaire de campagne devient chef d'orchestre de la croissance.",
  upsell: "Mh : transformer les besoins détectés en missions vendues.",
  process_chaos: "Montrer le bordel : chacun fait à sa façon. Laisser réagir.",
  process_flow: "Les cartes se remettent en ordre : voilà le parcours qu'on veut.",
  process_coince: "Chacun tape sur les étapes où ça coince (+). On note les irritants, puis on passe aux décisions.",
  process: "Quentin : on passe chaque question, on tranche, on note la décision à l'écran.",
  conclusion: "Résumer les décisions et la direction. Chaque personne note un engagement.",
  cruz: "Démo live si possible : Claude + MCP Google Ads sur un compte de test.",
  news: "Mh : les nouveautés qui changent nos comptes.",
  purpose: "Poser le cadre : on est là pour se retrouver, redéfinir le métier ensemble et repartir avec une offre.",
  clean: "Point d'attention de Quentin : chiffres réels tirés d'AdPilot le 5 novembre. On fixe une date pour une journée de mise en place.",
  hub: "Chacun ajoute ce qu'il utilise, ce qui manque, ce qui ne sert à rien. On vote (+) pour prioriser les évolutions.",
  offre: "Atelier : chacun vote (+), on ajoute des idées, on retient le top 3 avec un porteur et un prochain pas.",
  quiz: "Question pour un Champion. Espace = révéler, → suivante, 1-8 = point à l'équipe, C = classement.",
};

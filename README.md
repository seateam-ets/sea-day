# SEA Day 2026 · eTeamsys

Deck web interactif qui accompagne toute la journée du SEA Day (pauses comprises).

## Pages

| URL | Rôle |
|---|---|
| `/` | Page « Merci » : récap du SEA Day + priorisation du plan d'action (Quentin & Mh) |
| `/deck` | Le deck, sur le grand écran |
| `/remote` | Télécommande téléphone (Quentin, Mh) : slides, notes orateur, quiz, jeux, minuteurs |
| `/repondre` | Chaque participant répond au tour de table depuis son téléphone |

Toutes les pages sont synchronisées : changer de slide sur la télécommande change le grand écran.

## Raccourcis clavier (deck)

- `→` / `←` : slide suivante / précédente · `F` : plein écran · `G` : plan
- Quiz : `Espace` révéler · `→` suivante · `1`-`8` point à l'équipe (`Maj`+chiffre pour retirer) · `C` classement
- Jeux : `D` tirer une carte · `Espace` révéler · `T` chrono

## Récap après la journée

- Synthèse : `public/js/recap.js` (tirée de `content/compte-rendu.md`, l'export brut de la journée)
- Priorités, responsables et dates saisis sur `/` : partagés en direct (clés `prio:*`)

## Modifier le contenu

- Tout le texte : `public/js/content.js` (participants, questions du tour de table, Cetronic, process, jeux, notes orateur)
- Le quiz : `content/quiz.md` → `npm run build` régénère `public/data/quiz.json`
- L'ordre des slides : liste `SLIDES` en bas de `public/js/slides.js`

## Lancer en local

```bash
npm run dev
```

→ http://localhost:3000 (mot de passe `seaday2026`). Sans Redis, le deck passe en **mode local**
(synchro entre onglets du même navigateur uniquement).

## Déploiement Vercel (équipe eteamsys)

1. Importer le repo dans Vercel (framework : *Other*, rien d'autre à régler, `vercel.json` s'occupe du reste).
2. **Storage → Marketplace → Upstash Redis** : créer une base et la connecter au projet
   (ajoute `KV_REST_API_URL` et `KV_REST_API_TOKEN`).
3. Variable d'environnement `SEADAY_PASSWORD` (sinon `seaday2026`).
4. **Domains** : ajouter `seaday.eteamsys.be`, puis le CNAME `seaday` → `cname.vercel-dns.com` dans la zone DNS `eteamsys.be`.

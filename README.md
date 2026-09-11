# BraidHub — App de réservation de tresses (V1)

Plateforme de réservation de rendez-vous pour les tresses. Eva (@braidingeva,
à Barcelone) est la première professionnelle sur l'app ; le schéma de données
est déjà pensé pour accueillir d'autres braideuses par la suite. Voir
`consignes_claude_code_v1_tresses.md` pour le contexte produit complet.

## Portée de cette V1

- Catalogue de styles de tresses (données modifiables en base, pas codées en dur)
- Filtre simple par catégorie (ex : tresses longues / courtes)
- Réservation de créneau avec confirmation
- Bouton "Design personnalisé" vers WhatsApp / Instagram
- Agenda admin simple pour Eva (protégé par mot de passe)

Explicitement hors scope V1 : filtres avancés, supplément extensions, avis
clients, paiement en ligne, multi-professionnels, site séparé.

## Stack technique

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) pour l'identité visuelle noir/blanc
- [Prisma](https://www.prisma.io) + Postgres (ex : Neon, Vercel Postgres,
  Supabase — une base gratuite suffit pour la V1). SQLite a été écarté car
  peu fiable en serverless (Vercel).

## Architecture des données

Tout est rattaché à un `Professional`. Pour cette V1 il n'y en a qu'un seul
(Eva, slug `"eva"`), mais `Category`, `Style`, `Slot` et `Booking` pointent
tous vers un `professionalId` — ajouter un deuxième professionnel plus tard
ne demande pas de réécrire le schéma.

Les catégories (`Category`) sont des données modifiables en base plutôt
qu'un enum figé dans le code, car les libellés exacts restent à confirmer
avec Eva.

## Démarrer en local

```bash
npm install
cp .env.example .env
# éditer .env : DATABASE_URL (connection string Postgres), ADMIN_PASSWORD, ADMIN_SESSION_SECRET

npm run db:push   # crée les tables dans la base Postgres à partir du schéma
npm run db:seed   # remplit des données d'exemple (placeholders, voir ci-dessous)
npm run dev       # http://localhost:3000
```

L'espace admin d'Eva est sur `/admin` (mot de passe = `ADMIN_PASSWORD`).

## Données d'exemple (placeholder)

Les vraies données d'Eva (styles précis, prix, durées, longueurs minimales,
numéro WhatsApp, identifiant Instagram) n'étaient pas encore connues à la
rédaction de cette V1. Le script `prisma/seed.ts` crée donc :

- Un professionnel "Eva" avec des coordonnées WhatsApp/Instagram fictives
- 2 catégories : "Tresses longues" / "Tresses courtes"
- 5 styles d'exemple avec prix, durées et longueurs minimales fictifs
- Des créneaux disponibles sur les 10 prochains jours

**À faire dès réception du questionnaire rempli par Eva** : mettre à jour
`prisma/seed.ts` (ou directement les données en base via un futur écran
d'administration) avec les vraies informations, remplacer les photos
placeholder dans `public/images/`, et confirmer le numéro WhatsApp /
identifiant Instagram dans le seed pour que le bouton "Design personnalisé"
fonctionne réellement.

## Déploiement sur Vercel

1. Importer le repo GitHub dans Vercel (ou brancher un projet existant).
2. Créer une base Postgres (onglet Storage du projet Vercel, ou Neon/Supabase)
   et connecter/copier `DATABASE_URL` dans les variables d'environnement du
   projet Vercel.
3. Ajouter aussi `ADMIN_PASSWORD` et `ADMIN_SESSION_SECRET` dans les variables
   d'environnement.
4. Lancer `npm run db:push && npm run db:seed` en local avec cette même
   `DATABASE_URL` (ou via un script one-off) pour créer les tables et les
   données de départ — la page d'accueil est prérendue au build et a donc
   besoin que les données existent déjà en base.
5. Déployer (ou redéployer une fois les variables ajoutées).

## Notes pour la suite (hors V1)

- Filtre multi-critères avancé (budget, temps disponible)
- Supplément "extensions" automatique pour cheveux trop courts
- Avis clients
- Paiement en ligne / acompte à la réservation
- Généralisation multi-professionnels (le schéma le permet déjà)
- Un vrai écran d'administration pour gérer styles/catégories sans toucher au code

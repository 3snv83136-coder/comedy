## Biiip Comedy Club – Site vitrine + back‑office

Projet Next.js (App Router) pour l’association de stand‑up **Biiip Comedy Club**.

### 1. Stack & architecture

- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI**: TailwindCSS, design sombre néon, responsive, accessible
- **Auth back‑office**: NextAuth v5 (Credentials, JWT, CSRF géré par NextAuth)
- **ORM / DB**: Prisma + SQLite en dev, compatible PostgreSQL en prod
- **Stockage fichiers**: local en dev (`public/uploads`), S3 compatible ou Cloudinary en prod
- **Validation / sécurité**: Zod (validation serveur), anti‑spam (honeypot + rate limit), pas de contenu généré illégal
- **SEO**: métadonnées dynamiques, `sitemap.xml`, `robots.txt`, JSON‑LD Organization/Event

#### Dossiers principaux

- `app/` – pages publiques et back‑office (App Router)
  - `/` – Accueil (hero, CTA, prochains shows, newsletter)
  - `/programmation` + `/programmation/[slug]` – Liste + détail événements
  - `/artistes` + `/artistes/[slug]` – Grid + fiche artiste
  - `/le-club`, `/demande-de-passage`, `/faq`, `/contact`
  - `/mentions-legales`, `/politique-de-confidentialite`
  - `/admin/*` – Dashboard, événements, artistes, FAQ, paramètres, demandes
  - `/api/public/*` – Formulaires publics (contact, demande de passage)
  - `/api/admin/*` – Export CSV des demandes
  - `/sitemap.xml`, `/robots.txt`, `/newsletter/subscribe`
- `lib/` – Prisma, validation, rate limit, upload, slugify
- `prisma/schema.prisma` – Modèles User, Event, Artist, Submission, SiteSettings, FAQ, NewsletterSubscriber

Back‑office protégé par middleware NextAuth (`/admin/*`), RBAC simple via champ `role` (`ADMIN` / `EDITOR`).

---

### 2. Installation & scripts

#### Prérequis

- Node.js 18+
- `npm` ou `pnpm`

#### Installation

```bash
npm install
```

Copiez le fichier d’exemple d’environnement :

```bash
cp .env.example .env
```

Pour un premier démarrage en **dev** sans PostgreSQL ni S3, gardez :

- `DATABASE_URL="file:./dev.db"`
- `DATABASE_PROVIDER=` (vide pour SQLite)
- `UPLOAD_PROVIDER=local`

Générez un secret fort pour `AUTH_SECRET` (ex. `openssl rand -base64 32`).

#### Prisma : migration & seed

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Cela va :

- Créer le schéma (tables, enums)
- Insérer :
  - 1 utilisateur admin (`admin@biiip-comedy.club` / **admin123**)
  - 3 événements d’exemple
  - 6 artistes
  - Une FAQ de base
  - Les paramètres de site (`SiteSettings`)

#### Démarrer le serveur de dev

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000`.

Scripts utiles :

- `npm run dev` – dev server
- `npm run build` – build production
- `npm start` – démarrage production
- `npm run lint` – ESLint
- `npm run prisma:generate` – génération client Prisma
- `npm run prisma:migrate` – migration en dev
- `npm run prisma:studio` – Prisma Studio
- `npm run prisma:seed` – seed manuel

---

### 3. Authentification & back‑office

- Auth via **NextAuth v5** Credentials (`/admin/login`)
- Utilisateur seed :
  - **email** : `admin@biiip-comedy.club`
  - **mot de passe** : `admin123`
- Middleware `middleware.ts` protège toutes les routes `/admin/*`
- RBAC :
  - `ADMIN` : accès complet + page `Paramètres du site`
  - `EDITOR` : dashboard, événements, artistes, FAQ, demandes

---

### 4. Base de données (Prisma)

Modèles principaux (simplifié) :

- `User` : `id`, `email`, `passwordHash`, `role`, timestamps
- `Event` : `id`, `title`, `slug`, `description`, `startDate`, `endDate?`, `venueName`, `venueAddress?`, `city`, `bookingUrl`, `posterUrl?`, `status`, timestamps
- `Artist` : `id`, `name`, `slug`, `photoUrl?`, `bioShort`, `bioLong?`, liens réseaux, `videoEmbedUrl?`, `tags[]`, timestamps
- `Submission` : `id`, `fullName`, `stageName?`, `email`, `phone?`, `message`, `fileUrl?`, `status`, `createdAt`
- `SiteSettings` : `id`, `clubName`, `address`, `phone`, `email`, `socialLinks (Json)`, `heroText`, `aboutText`, `updatedAt`
- `FAQ` : `id`, `question`, `answer`, `order`
- `NewsletterSubscriber` : `id`, `email`, `confirmed`, `createdAt`

Tout est dans `prisma/schema.prisma`, compatible SQLite/PostgreSQL.

---

### 5. Uploads (images & PDF)

Gestion centralisée dans `lib/upload.ts` :

- `UPLOAD_PROVIDER=local`
  - Fichiers écrits dans `public/uploads` (dev local)
- `UPLOAD_PROVIDER=s3`
  - Utilise `@aws-sdk/client-s3`
  - Nécessite : `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
  - Optionnel : `S3_ENDPOINT` (S3 compatible) et `S3_PUBLIC_URL_BASE`
- `UPLOAD_PROVIDER=cloudinary`
  - Utilise `cloudinary`
  - Nécessite : `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

La route `/api/public/submission` stocke les PDF des demandes de passage (formulaire public).

---

### 6. SEO & performances

- `app/layout.tsx` : métadonnées globales, `metadataBase` basé sur `NEXT_PUBLIC_SITE_URL`
- `app/sitemap.xml/route.ts` : sitemap dynamique incluant artistes et événements
- `app/robots.txt/route.ts` : robots.txt avec lien vers sitemap
- `app/programmation/[slug]/page.tsx` : JSON‑LD `Event` pour chaque événement
- Layout sombre, typographie lisible, CTA visibles, `next/image` optimisé

---

### 7. RGPD & sécurité

- **CSRF** : géré par NextAuth sur les routes d’authentification
- **Validation serveur** : `zod` dans `lib/validators.ts`
- **Anti‑spam** :
  - Champ honeypot caché (`website`) dans les formulaires publics
  - Rate limit basique par IP (`lib/rateLimit.ts`)
- **Sanitization** : pas d’HTML brut injecté directement (affichage via texte/prose)
- **Formulaires** :
  - Demande de passage : champs obligatoires (nom, email, message) + upload PDF optionnel
  - Contact : nom, email, message
  - Newsletter : enregistrement en DB, **warning** affiché sur l’absence de double opt‑in
- **Mentions légales & politique de confidentialité** : pages dédiées, textes génériques à personnaliser.

Pour l’intégration de cartes ou outils externes (Google Maps, etc.), ajouter au besoin un bandeau d’information/consentement cookies.

---

### 8. Déploiement sur Vercel

1. Pousser le repo sur GitHub / GitLab.
2. Créer un nouveau projet Vercel connecté au repo.
3. Configurer les variables d’environnement (onglet **Settings → Environment Variables**) :

- `NEXT_PUBLIC_SITE_URL=https://biiip-comedy-club.fr` (votre domaine)
- `DATABASE_URL=` (URL PostgreSQL gérée par un service externe, ex. Supabase, Railway…)
- `DATABASE_PROVIDER=POSTGRES`
- `AUTH_SECRET=` (même valeur que local ou régénérée)
- `UPLOAD_PROVIDER=s3` ou `cloudinary` selon choix
- Variables S3 ou Cloudinary correspondantes
- Optionnel : variables SMTP si vous ajoutez l’envoi réel d’emails

4. Déclarer la commande de build : par défaut `next build`.
5. Déployer.

#### Domaine & CNAME

- Ajouter un domaine custom dans Vercel (ex. `biiip-comedy-club.fr`)
- Ajouter un enregistrement **CNAME** chez votre registrar :
  - Nom/host : `www` (ou racine selon config)
  - Cible : le domaine fourni par Vercel (ex. `cname.vercel-dns.com`)
- Configurer, si besoin, la redirection `biiip-comedy-club.fr` → `www.biiip-comedy-club.fr`.

---

### 9. Accès back‑office & tests rapides

1. Lancer la stack en local :

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

2. Aller sur :

- Front public : `http://localhost:3000`
- Back‑office : `http://localhost:3000/admin`

3. Connexion :

- Email : `admin@biiip-comedy.club`
- Mot de passe : `admin123`

Depuis le back‑office, vous pouvez :

- Créer/éditer des **événements** (brouillon/publication, preview)
- Créer/éditer des **artistes**
- Gérer la **FAQ**
- Consulter et exporter en **CSV** les **demandes de passage**
- Mettre à jour les **infos du club** (adresse, hero text, etc.)

Le site est prêt à être brandé et ajusté pour le **Biiip Comedy Club**.


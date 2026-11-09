# carmendegroot.nl

Portfolio en CMS van **Carmen de Groot**, human-centered designer.

| Onderdeel | Techniek |
|---|---|
| Framework | Next.js 15 (App Router, React 19, Server Actions) |
| Taal | TypeScript (strict) |
| Styling | Tailwind CSS 3 + design tokens (CSS custom properties) |
| Database | Supabase PostgreSQL met Row Level Security |
| Auth | Supabase Authentication (e-mail + wachtwoord) |
| Bestanden | Supabase Storage (bucket `media`) |
| Hosting | Vercel |

---

## Inhoud

1. [Snel starten](#1-snel-starten)
2. [Supabase inrichten](#2-supabase-inrichten)
3. [Deployen op Vercel](#3-deployen-op-vercel)
4. [Het CMS gebruiken](#4-het-cms-gebruiken)
5. [Architectuur](#5-architectuur)
6. [Design system](#6-design-system)
7. [Database](#7-database)
8. [SEO en performance](#8-seo-en-performance)
9. [Demo-content vervangen](#9-demo-content-vervangen)
10. [Checklist voor lancering](#10-checklist-voor-lancering)

---

## 1. Snel starten

Vereist: **Node.js 20.9 of hoger**.

```bash
npm install
cp .env.example .env.local      # vul daarna de waarden in (zie stap 2)
npm run dev                     # http://localhost:3000
```

> **Let op bij OneDrive / SharePoint-mappen.** Synchronisatie kan bestanden in `.next/` en `node_modules/` vergrendelen, waardoor `next build` blijft hangen. Werk bij voorkeur vanuit een Git-repository in een map die niet gesynchroniseerd wordt (bijv. `C:\dev\carmendegroot`), of pauzeer OneDrive tijdens het bouwen. Op Vercel speelt dit niet.

> **Werkt ook zonder Supabase.** Zolang de Supabase-variabelen ontbreken, toont de publieke site de ingebouwde content uit `src/content/` (gebaseerd op het cv). Het CMS laat dan een instructiescherm zien.

| Script | Doel |
|---|---|
| `npm run dev` | Ontwikkelserver |
| `npm run build` / `npm start` | Productiebuild / starten |
| `npm run typecheck` | TypeScript-controle |
| `npm run lint` | ESLint |
| `npm run seed` | Standaardcontent in Supabase zetten (overschrijft niets) |
| `npm run seed -- --force` | Content terugzetten naar de standaardwaarden |
| `npm run create-admin -- <email> <wachtwoord> "Naam"` | Beheerder aanmaken |
| `npm run placeholders` | Placeholder-afbeeldingen opnieuw genereren |

---

## 2. Supabase inrichten

1. Maak een project aan op [supabase.com](https://supabase.com). Kies regio **West EU (Frankfurt/Ireland)**.
2. **Database schema.** Open *SQL Editor*, plak de inhoud van [`supabase/migrations/20261109000000_init.sql`](supabase/migrations/20261109000000_init.sql) en klik op *Run*. Dit maakt alle tabellen, RLS-policies, triggers en de Storage-bucket `media` aan. Met de Supabase CLI kan het ook via `supabase link` en daarna `supabase db push`.
3. **Sleutels.** Ga naar *Project Settings → API* en zet in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon / publishable key>
   SUPABASE_SERVICE_ROLE_KEY=<service_role key>   # alleen lokaal voor de scripts
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
4. **Content vullen:** `npm run seed`
5. **Beheerder aanmaken:**
   ```bash
   npm run create-admin -- carmen@voorbeeld.nl "EenSterkWachtwoord2026" "Carmen de Groot"
   ```
6. **Registratie uitzetten.** Ga naar *Authentication → Sign In / Providers* en zet **Allow new users to sign up** uit. Nieuwe accounts krijgen sowieso de rol `viewer` zonder rechten, maar zo kan niemand een account aanmaken.
7. **Auth-URL's.** Ga naar *Authentication → URL Configuration*:
   - Site URL: `https://carmendegroot.nl`
   - Redirect URLs: `https://carmendegroot.nl/admin/auth/confirm` en `http://localhost:3000/admin/auth/confirm`
8. *(Aanbevolen)* Stel onder *Authentication → SMTP Settings* een eigen SMTP-server in. Supabase verstuurt standaard maar enkele e-mails per uur.

---

## 3. Deployen op Vercel

1. Zet de code in een Git-repository (GitHub, GitLab of Bitbucket).
2. Kies op [vercel.com/new](https://vercel.com/new) **Import Project**. Het framework wordt automatisch herkend als Next.js; laat de build-instellingen ongewijzigd.
3. Voeg onder **Environment Variables** (Production én Preview) toe:

   | Variabele | Waarde |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://carmendegroot.nl` |
   | `NEXT_PUBLIC_SUPABASE_URL` | uit Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | uit Supabase |
   | `RESEND_API_KEY` | optioneel, voor e-mailnotificaties |
   | `CONTACT_TO_EMAIL` | optioneel, ontvanger van notificaties |
   | `CONTACT_FROM_EMAIL` | optioneel, bijv. `Website <noreply@carmendegroot.nl>` |

   Zet `SUPABASE_SERVICE_ROLE_KEY` **niet** in Vercel. De applicatie heeft die sleutel niet nodig.
4. Klik op **Deploy**.
5. **Domein koppelen.** Voeg onder *Settings → Domains* `carmendegroot.nl` en `www.carmendegroot.nl` toe. Stel `www` in als redirect naar het hoofddomein en volg de DNS-instructies van Vercel (A-record `76.76.21.21` en een CNAME voor `www`).
6. Controleer na livegang:
   - `https://carmendegroot.nl/sitemap.xml`
   - `https://carmendegroot.nl/robots.txt`
   - inloggen op `https://carmendegroot.nl/admin`
7. Meld de sitemap aan in [Google Search Console](https://search.google.com/search-console).

**E-mailnotificaties (optioneel).** Contactberichten worden altijd in Supabase opgeslagen en staan in het CMS onder *Berichten*. Wil je daarnaast een e-mail ontvangen, maak dan een account bij [Resend](https://resend.com), verifieer het domein `carmendegroot.nl` en vul de drie `RESEND`/`CONTACT`-variabelen in.

---

## 4. Het CMS gebruiken

Inloggen gaat via **carmendegroot.nl/admin**.

| Onderdeel | Wat kun je er doen |
|---|---|
| **Dashboard** | Statistieken, laatst gewijzigde projecten en pagina's, nieuwe berichten |
| **Projecten** | Aanmaken, bewerken, verwijderen, publiceren, als concept opslaan en de volgorde bepalen (slepen) |
| **Categorieën** | Filtercategorieën voor de projectenpagina beheren |
| **Media** | Uploaden (slepen of kiezen), alt-tekst invullen, ordenen, verwijderen, URL kopiëren |
| **Pagina's** | Teksten van Home, Over mij, CV en Contact aanpassen, inclusief SEO-velden |
| **Berichten** | Contactformulier-inzendingen lezen, beantwoorden en verwijderen |
| **Instellingen** | Site titel, meta-informatie, contactgegevens, social links, portretfoto en cv-PDF |
| **Account** | Wachtwoord wijzigen |

**Tips**

- Zet een woord tussen `*sterretjes*` in een titel; het verschijnt dan in de cursieve serif-accentletter.
- Een project heeft alle velden uit de opdracht: titel, slug, omschrijving, intro, volledige tekst (Markdown), cover, galerij, tags, datum, categorie, SEO-titel en SEO-beschrijving. Daarnaast heeft het de case-velden uitdaging, aanpak en resultaat, en projectinformatie.
- Wijzigingen staan direct live. Opslaan ververst automatisch de statische pagina's.
- Ben je je wachtwoord vergeten? Gebruik *Wachtwoord vergeten?* op het inlogscherm.

---

## 5. Architectuur

```
src/
├─ app/
│  ├─ (site)/               Publieke website: home, over-mij, projecten, cv, contact
│  ├─ admin/
│  │  ├─ login/, wachtwoord-vergeten/, auth/confirm/
│  │  └─ (cms)/             Afgeschermde CMS-pagina's (layout controleert de rol)
│  ├─ sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx, icon.svg
│  └─ layout.tsx, globals.css
├─ components/
│  ├─ site/                 Publieke componenten (Header, ProjectCard, blocks, …)
│  ├─ admin/                CMS-componenten (ProjectForm, SchemaForm, MediaLibrary, …)
│  └─ ui/                   Gedeelde primitives (Button, icons)
├─ content/                 Standaardcontent (cv) en demoprojecten, gebruikt als seed en fallback
├─ lib/
│  ├─ data.ts               Publieke datalaag (Supabase met fallback naar content/)
│  ├─ admin/                Auth-guard, veld-schema's, validatie, server actions
│  ├─ supabase/             Server-, browser- en middleware-clients
│  └─ seo.ts, types.ts, utils.ts
└─ middleware.ts            Sessie verversen en /admin afschermen
supabase/migrations/        SQL-schema
scripts/                    seed, create-admin, placeholders
```

**Belangrijke keuzes**

- **De publieke site is statisch (ISR).** Pagina's lezen data met een cookieloze anonieme client. Daardoor zijn ze vooraf gerenderd en worden ze vanaf de CDN geserveerd. Het CMS roept bij elke wijziging `revalidatePath` aan.
- **Middleware draait alleen op `/admin`.** Op de publieke site komt geen extra latency.
- **Beveiliging in drie lagen:**
  1. de middleware stuurt bezoekers zonder sessie door naar de loginpagina;
  2. elke CMS-pagina en server action roept `requireAdmin()` aan, die de JWT valideert en de rol `admin`/`editor` controleert;
  3. Row Level Security in de database dwingt hetzelfde af, ook als iemand de API rechtstreeks aanroept.
- **Uploads gaan rechtstreeks van de browser naar Supabase Storage.** Storage-policies staan schrijven alleen toe voor admins. Zo is er geen limiet op de grootte van de request body van Vercel.
- **Schema-gedreven pagina-editor.** In `src/lib/admin/fields.ts` staat per pagina welke velden er zijn. Daaruit worden zowel het formulier als de server-side validatie (zod) afgeleid. Een veld toevoegen doe je in `fields.ts` en `types.ts`, en daarna gebruik je het in de pagina.
- **Contactformulier.** Validatie met zod, een honeypot-veld, een controle op minimale invultijd en rate limiting per IP. Berichten worden opgeslagen in Supabase; een e-mail via Resend is optioneel.

---

## 6. Design system

De identiteit bouwt voort op Carmens cv:

- **Chartreuse "band"** (`--accent: #CED82E`): de lime balk uit het cv. Je ziet hem achter het portret, onder kopjes, achter nadrukwoorden en in hover-states.
- **Warm papier** (`--paper: #F6F5F0`), **inkt** (`#111110`), **grafiet** en **mosgroen** (`#24402C`, de bolletjes uit het cv).
- **Typografie:** *Inter Tight* (strak en groot, met negatieve letterspatiëring) gecombineerd met *Instrument Serif Italic* voor expressieve accenten.
- **Vormtaal:** asymmetrisch afgeronde hoeken (groot linksboven en rechtsonder), net als de fotovorm in het cv.

Alle tokens staan als CSS custom properties in `src/app/globals.css`. Tailwind koppelt daar semantische namen aan (`bg-paper`, `text-ink`, `bg-accent`, `text-display-xl`, …), zodat je de hele uitstraling op één plek bijstelt.

**Beweging:** scroll-reveals via één gedeelde IntersectionObserver, CSS-animaties bij het laden, een lopende band (marquee) en zachte hover-effecten. Er is geen zware animatielibrary. Alles respecteert `prefers-reduced-motion`, en zonder JavaScript blijft alle content zichtbaar.

---

## 7. Database

| Tabel | Doel | Publiek leesbaar |
|---|---|---|
| `profiles` ("users") | CMS-gebruikers met rol (`admin`/`editor`/`viewer`), gekoppeld aan `auth.users` | nee |
| `projects` | Projecten met alle case- en SEO-velden | alleen `published` |
| `project_images` | Geordende galerij per project (FK, cascade delete) | als het project zichtbaar is |
| `categories` | Projectcategorieën (FK vanuit `projects`, `on delete set null`) | ja |
| `media` | Mediabibliotheek (pad, URL, alt, afmetingen, volgorde) | nee |
| `pages` | Gestructureerde content per pagina (`home`, `about`, `cv`, `contact`) als JSONB | ja |
| `site_settings` | Eén rij met site-instellingen (JSONB) | ja |
| `messages` | Contactformulier-inzendingen | nee (alleen insert) |

Er zijn triggers voor `updated_at`, `published_at` en het automatisch aanmaken van een profiel. Rolcontrole loopt via de `security definer`-functie `public.is_admin()`.

---

## 8. SEO en performance

- Metadata per pagina met canonical URL's, Open Graph en Twitter cards.
- Dynamisch gegenereerde, merkconsistente **OG-afbeeldingen**: één voor de site en één per project.
- **Structured data (JSON-LD):** `Person`, `WebSite`, `CreativeWork`, `CollectionPage`, `ContactPage` en `BreadcrumbList`.
- `sitemap.xml` (inclusief projecten en lastModified), `robots.txt` (blokkeert `/admin`) en `manifest.webmanifest`.
- Het CMS staat op `noindex` via metadata én een `X-Robots-Tag`-header.
- **Performance:** statische pagina's, `next/font` (geen layout shift), `next/image` met AVIF/WebP, ~112 kB first-load JS en weinig client-componenten.
- **Toegankelijkheid:** skip-link, semantische landmarks, zichtbare focus-states, ARIA bij menu's en filters, voldoende kleurcontrast (AA) en ondersteuning voor reduced motion.
- **Security headers:** HSTS, `X-Frame-Options`, `nosniff`, `Referrer-Policy` en `Permissions-Policy`.

Meet na livegang met Lighthouse of PageSpeed Insights op de productie-URL. Lokale dev-builds geven geen representatieve scores.

---

## 9. Demo-content vervangen

De zes projecten in `src/content/projects.ts` zijn **fictieve, realistische cases** op basis van Carmens opleiding en ervaring. Vervangen gaat zo:

- **Via het CMS (aanbevolen):** open een project, pas teksten aan en upload echte beelden; of verwijder het en maak een nieuw project.
- **Placeholder-beelden** staan in `public/placeholders/` en worden gegenereerd door `scripts/generate-placeholders.mjs`.
- **Testimonials** op de homepage zijn demo-content. Pas ze aan onder *Pagina's → Home → Testimonials* of verwijder ze; de sectie verdwijnt dan vanzelf.
- **Portretfoto** (`public/images/carmen-de-groot.png`) en **cv-PDF** (`public/cv/carmen-de-groot-cv.pdf`) komen uit het meegeleverde cv. Je vervangt ze via *Instellingen → Bestanden*.

---

## 10. Checklist voor lancering

- [ ] Demoprojecten en testimonials vervangen of gecontroleerd met Carmen
- [ ] Social links (zoals LinkedIn) ingevuld onder *Instellingen*
- [ ] Bepaald of het telefoonnummer publiek mag (staat standaard uit)
- [ ] Registratie uitgezet in Supabase Auth
- [ ] Auth-redirect-URL's ingesteld
- [ ] Eigen SMTP-server ingesteld voor wachtwoordreset-mails
- [ ] Domein gekoppeld en HTTPS actief
- [ ] Sitemap aangemeld in Google Search Console
- [ ] Contactformulier getest op productie

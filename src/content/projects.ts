import type { Category, Project } from "@/lib/types";

/**
 * DEMO CONTENT
 * ------------
 * Six realistic, fictional case studies inspired by Carmen's education and
 * experience. They are seeded into Supabase (npm run seed) and can be edited
 * or replaced 1-on-1 in the CMS. Images are generated placeholders in
 * /public/placeholders (npm run placeholders).
 */

export const seedCategories: Category[] = [
  { id: "cat-design-research", name: "Design Research", slug: "design-research", sortOrder: 1, description: "Onderzoek naar mensen, context en betekenis." },
  { id: "cat-conceptontwikkeling", name: "Conceptontwikkeling", slug: "conceptontwikkeling", sortOrder: 2, description: "Van inzicht naar onderscheidend concept." },
  { id: "cat-service-design", name: "Service Design", slug: "service-design", sortOrder: 3, description: "Diensten en producten rondom de gebruiker." },
  { id: "cat-social-design", name: "Social Design", slug: "social-design", sortOrder: 4, description: "Ontwerpen voor maatschappelijke verandering." },
  { id: "cat-trendonderzoek", name: "Trendonderzoek", slug: "trendonderzoek", sortOrder: 5, description: "Signalen van morgen vertaald naar strategie." },
];

const cat = (slug: string) => seedCategories.find((c) => c.slug === slug) ?? null;

const img = (slug: string, n: number, alt: string, caption = "") => ({
  id: `${slug}-${n}`,
  url: `/placeholders/${slug}-${n}.svg`,
  path: null,
  alt,
  caption,
  sortOrder: n,
});

type SeedProject = Omit<Project, "id" | "updatedAt" | "status" | "seoTitle" | "seoDescription" | "coverImage" | "images"> & {
  imageAlts: [string, string, string];
};

const raw: SeedProject[] = [
  {
    slug: "aanvalswijzer",
    title: "Aanvalswijzer",
    description:
      "Een digitale eerstehulpgids die omstanders in een paar seconden helpt om goed te handelen tijdens een epileptische aanval.",
    intro:
      "Veel mensen weten niet wat ze moeten doen als iemand in hun omgeving een epileptische aanval krijgt. Die onzekerheid leidt tot paniek, verkeerde handelingen of helemaal niets doen. Aanvalswijzer maakt de juiste stappen direct toegankelijk — precies op het moment dat het ertoe doet.",
    challenge:
      "Hoe help je een omstander die nog nooit een aanval heeft gezien om binnen enkele seconden rustig en correct te handelen? De oplossing moest werken onder stress, zonder voorkennis en zonder installatie — én aansluiten bij de wensen van mensen met epilepsie zelf.",
    approach:
      "Ik startte met diepte-interviews met mensen met epilepsie, naasten en hulpverleners, en analyseerde bestaande hulpkaarten en apps. In co-creatiesessies brachten we de 'momenten van onzekerheid' in kaart. Op basis daarvan ontwikkelde ik een stapsgewijze, visuele gids met timerfunctie, die via een QR-code op een pasje of telefoonhoes direct opent. Drie prototype-rondes met gebruikerstesten onder tijdsdruk zorgden voor een flow die ook in paniek begrijpelijk blijft.",
    result:
      "Een webapp-concept met een heldere drie-stappenflow, ingebouwde aanvalstimer en een noodcontactknop. In de laatste testronde konden alle deelnemers zonder uitleg de juiste eerste handelingen uitvoeren. Het concept dient als basis voor verdere ontwikkeling en voorlichtingsmateriaal.",
    body: `## Het moment van onzekerheid

Uit de interviews kwam één inzicht steeds terug: **niet de aanval zelf, maar de reactie van de omgeving bepaalt vaak hoe iemand de situatie ervaart**. Mensen met epilepsie vertelden over omstanders die hen probeerden vast te houden, iets in hun mond wilden stoppen, of juist wegliepen.

## Ontwerpprincipes

- **Eén handeling per scherm** — onder stress kan niemand een lijst lezen.
- **Beeld vóór tekst** — illustraties tonen wat je moet doen, tekst ondersteunt.
- **Tijd is informatie** — een automatische timer helpt bepalen wanneer 112 nodig is.
- **Waardigheid** — de gids benadrukt rust, privacy en geruststelling na afloop.

## Testen onder druk

We testten de prototypes in gesimuleerde situaties met een acteur en een oplopende tijdsdruk. Elke ronde leverde concrete verbeteringen op: grotere knoppen, minder woorden en een duidelijkere 'bel 112'-trigger.

> "Ik hoef niet na te denken, de app vertelt me gewoon wat ik moet doen. Dat geeft rust."
> — Deelnemer gebruikerstest`,
    category: cat("service-design"),
    tags: ["Zorg", "Productontwikkeling", "Gebruikerstesten", "Toegankelijkheid", "Co-creatie"],
    date: "2025-04-01",
    client: "Zorg & welzijn (concept)",
    role: "Productontwikkelaar & UX-onderzoeker",
    duration: "4 maanden",
    team: "Productontwikkeling, communicatie, ervaringsdeskundigen",
    featured: true,
    sortOrder: 1,
    coverAlt: "Abstracte visual van het Aanvalswijzer-concept",
    imageAlts: [
      "Abstracte visual van het Aanvalswijzer-concept",
      "Overzicht van de co-creatiesessies",
      "Prototype van de stapsgewijze gids",
    ],
  },
  {
    slug: "ruimte-voor-wie-je-bent",
    title: "Ruimte voor wie je bent",
    description:
      "Masteronderzoek naar hoe speculatief ontwerp het gesprek over genderidentiteit in het klaslokaal kan openen.",
    intro:
      "Genderidentiteit is een onderwerp dat in de klas vaak ongemakkelijk blijft liggen. Leerkrachten willen het gesprek voeren, maar missen taal en handvatten. In mijn masterscriptie onderzocht ik hoe speculatieve designmethoden kunnen bijdragen aan meer begrip en openheid.",
    challenge:
      "Een gevoelig, persoonlijk en soms gepolariseerd vraagstuk — waarbij je leerlingen niet wilt aanspreken op hun eigen identiteit, maar wel ruimte wilt maken voor andere perspectieven.",
    approach:
      "Kwalitatief onderzoek met leerkrachten, leerlingen en experts vormde het fundament. Vervolgens ontwierp ik een set speculatieve 'artefacten uit de toekomst': objecten en scenario's uit een wereld waarin gender anders wordt benaderd. Deze artefacten fungeerden als veilige gespreksopener, omdat ze het gesprek verplaatsen van 'jij' naar 'wat als'.",
    result:
      "Een onderbouwde methodiek en toolkit met speculatieve artefacten en gespreksvragen. Uit de evaluatiesessies bleek dat leerlingen via de artefacten makkelijker van perspectief wisselden en leerkrachten zich zekerder voelden in het begeleiden van het gesprek.",
    body: `## Waarom speculatief ontwerp?

Speculatief ontwerp stelt geen oplossing voor, maar **een vraag**. Door een alternatieve werkelijkheid tastbaar te maken, ontstaat afstand — en precies die afstand maakt een moeilijk gesprek mogelijk.

## Onderzoeksopzet

1. Literatuuronderzoek naar genderidentiteit, onderwijs en speculatief ontwerp
2. Semi-gestructureerde interviews met leerkrachten en experts
3. Ontwerp van vier speculatieve artefacten
4. Evaluatie in klassikale sessies en reflectie-interviews

## Belangrijkste inzichten

- Leerkrachten zijn vooral onzeker over *taal*, niet over de wil om het gesprek te voeren.
- Fictie biedt leerlingen een veilige rol: ze praten over een personage, niet over zichzelf.
- Tastbare objecten verlagen de drempel meer dan beelden of tekst.`,
    category: cat("design-research"),
    tags: ["Speculative design", "Kwalitatief onderzoek", "Onderwijs", "Inclusie"],
    date: "2024-06-15",
    client: "Tilburg University — masterscriptie",
    role: "Design researcher",
    duration: "9 maanden",
    team: "Individueel, met begeleiding vanuit New Media Design",
    featured: true,
    sortOrder: 2,
    coverAlt: "Abstracte visual van speculatieve artefacten",
    imageAlts: [
      "Abstracte visual van speculatieve artefacten",
      "Speculatieve artefacten op tafel tijdens een klassikale sessie",
      "Analyse van interviewinzichten",
    ],
  },
  {
    slug: "de-groeiboom",
    title: "De Groeiboom",
    description:
      "Een leeromgeving die meegroeit met het kind — onderzocht, geprototypet en tot leven gebracht in virtual reality.",
    intro:
      "Hoe draagt de fysieke leeromgeving bij aan de ontwikkeling en het welzijn van basisschoolleerlingen? Voor mijn afstudeerproject onderzocht ik hoe ruimte, materiaal en indeling kinderen kunnen ondersteunen in hun groei.",
    challenge:
      "Klaslokalen zijn vaak ingericht op efficiëntie, niet op welzijn. Tegelijk verschillen kinderen enorm in hoe ze het beste leren: de één heeft rust nodig, de ander beweging. Hoe ontwerp je één ruimte die ruimte biedt aan al die behoeften?",
    approach:
      "Ik observeerde lessen, sprak met leerkrachten en liet leerlingen hun ideale klas tekenen en bouwen. Trendonderzoek naar onderwijs en ruimtelijk ontwerp gaf richting. Het concept 'De Groeiboom' — een flexibele ruimte met zones voor focus, samenwerking en ontspanning — werkte ik uit in een fysiek schaalmodel en een VR-ervaring, zodat stakeholders het lokaal letterlijk konden betreden.",
    result:
      "Een onderbouwd ruimtelijk concept met prototype en VR-walkthrough. De VR-ervaring maakte het concept voor leerkrachten, directie en ouders direct voelbaar en bracht het gesprek over de inrichting van de school in beweging.",
    body: `## Kinderen als experts

De meest waardevolle inzichten kwamen van de leerlingen zelf. Via teken- en bouwsessies vertelden ze wat ze nodig hebben: *"een plek om even weg te zijn"*, *"een tafel waar we samen kunnen bouwen"* en *"meer groen"*.

## Het concept

De Groeiboom is opgebouwd uit drie zones die organisch in elkaar overlopen:

- **De wortels** — rustige plekken voor focus en concentratie
- **De stam** — de centrale plek voor instructie en samen leren
- **De kruin** — open, beweeglijke plekken voor samenwerking en spel

## Verbeelden in VR

Een plattegrond vraagt verbeeldingskracht; een VR-ervaring niet. Door het lokaal in VR te bouwen konden stakeholders het concept ervaren vanuit kinderhoogte — een perspectief dat veel gesprekken opende.`,
    category: cat("conceptontwikkeling"),
    tags: ["Onderwijs", "Ruimtelijk ontwerp", "VR", "Co-creatie", "Prototyping"],
    date: "2021-06-20",
    client: "Fontys — afstudeerproject",
    role: "Onderzoeker & conceptontwikkelaar",
    duration: "20 weken",
    team: "Individueel, in samenwerking met een basisschool",
    featured: true,
    sortOrder: 3,
    coverAlt: "Abstracte visual van het Groeiboom-concept",
    imageAlts: [
      "Abstracte visual van het Groeiboom-concept",
      "Tekensessie met leerlingen",
      "Still uit de VR-walkthrough",
    ],
  },
  {
    slug: "ontwerpen-voor-zelfstandigheid",
    title: "Ontwerpen voor zelfstandigheid",
    description:
      "Een women empowerment-project in Tanzania waarin ontwerp en ondernemerschap samenkomen.",
    intro:
      "Tijdens mijn minor Global Development Issues werkte ik mee aan een ontwikkelingsproject van Afrikan Wear Design in Tanzania. Het doel: de zelfstandigheid van vrouwen vergroten door middel van ondernemerschap en ontwerp.",
    challenge:
      "Hoe ondersteun je vrouwen in het opbouwen van een eigen inkomen, zonder een westers perspectief op te leggen? Het project vroeg om ontwerpen mét in plaats van vóór de deelnemers.",
    approach:
      "In co-design workshops werkten we samen met lokale vrouwen aan productontwerp, prijsbepaling en presentatie. Ik ontwikkelde visuele werkmaterialen die taalbarrières overbrugden en hielp bij het vertalen van lokale vakmanschap naar producten met een duidelijke doelgroep.",
    result:
      "Een set visuele workshoptools en een eerste productlijn ontwikkeld door de deelnemers zelf. Belangrijker nog: het project leerde mij hoe krachtig en noodzakelijk een participatieve, cultuursensitieve ontwerphouding is.",
    body: `## Leren door te luisteren

De eerste weken bestonden vooral uit kennismaken, observeren en luisteren. Welke vaardigheden zijn er al? Welke markten zijn bereikbaar? En wat betekent zelfstandigheid voor deze vrouwen zelf?

## Visuele werkmaterialen

Omdat niet iedereen dezelfde taal sprak, ontwikkelde ik beeldende kaarten voor de workshops: van kostprijsberekening tot het verhaal achter een product. Zo kon iedereen gelijkwaardig meedoen.

## Wat ik meenam

> Ontwerp is pas duurzaam als de mensen voor wie je ontwerpt eigenaar worden van de oplossing.

Dit project vormde de basis van mijn human-centered werkwijze.`,
    category: cat("social-design"),
    tags: ["Women empowerment", "Co-design", "Ondernemerschap", "Internationaal"],
    date: "2020-02-15",
    client: "Afrikan Wear Design — Tanzania",
    role: "Ontwerper & co-facilitator",
    duration: "5 maanden",
    team: "Internationaal minorteam en lokale partners",
    featured: true,
    sortOrder: 4,
    coverAlt: "Abstracte visual van textiel en patronen",
    imageAlts: [
      "Abstracte visual van textiel en patronen",
      "Co-design workshop met deelnemers",
      "Visuele workshopkaarten",
    ],
  },
  {
    slug: "de-kleur-van-talent",
    title: "De Kleur van Talent",
    description:
      "Een platformconcept voor Wij-leren dat leerkrachten helpt om talentontwikkeling in het basisonderwijs zichtbaar te maken.",
    intro:
      "Ieder kind heeft talenten, maar in het basisonderwijs blijven die vaak onder de radar — zeker als ze buiten de traditionele vakken vallen. In dit project onderzocht ik hoe talentontwikkeling beter ondersteund kan worden.",
    challenge:
      "Leerkrachten hebben weinig tijd en veel verantwoordelijkheden. Een nieuw instrument mag dus geen extra last zijn, maar moet direct waarde toevoegen aan hun dagelijkse praktijk.",
    approach:
      "Via interviews, klasobservaties en een analyse van gebruikersbehoeften bracht ik de leefwereld van leerkrachten, leerlingen en ouders in kaart. Ik ontwikkelde persona's en customer journeys, en vertaalde de inzichten naar een conceptvoorstel met wireframes voor het platform Wij-leren.",
    result:
      "Een conceptvoorstel met heldere ontwerpprincipes, persona's en een klikbaar prototype. Het concept maakt talenten zichtbaar in 'kleuren' en helpt leerkrachten om gesprekken met leerlingen en ouders op een positieve manier te voeren.",
    body: `## Talent in kleur

Het centrale idee: talent is niet één schaal van goed naar slecht, maar een **palet**. Elk kind heeft een eigen combinatie van kleuren — van creatief en sociaal tot analytisch en praktisch.

## Gebruikersbehoeften

- **Leerkrachten** willen snel overzicht en concrete handvatten.
- **Leerlingen** willen zich gezien voelen in wat ze goed kunnen.
- **Ouders** willen begrijpen hoe ze thuis kunnen bijdragen.

## Van inzicht naar prototype

Op basis van de persona's ontwierp ik de kernflows in een klikbaar prototype en testte deze met leerkrachten. Hun feedback leidde tot een eenvoudiger dashboard en een focus op gespreksondersteuning.`,
    category: cat("service-design"),
    tags: ["Onderwijs", "User research", "Platformconcept", "Persona's", "Prototyping"],
    date: "2020-11-10",
    client: "Wij-leren (conceptvoorstel)",
    role: "UX-onderzoeker & conceptontwikkelaar",
    duration: "10 weken",
    team: "Projectteam Fontys",
    featured: false,
    sortOrder: 5,
    coverAlt: "Abstracte visual van een kleurenpalet",
    imageAlts: [
      "Abstracte visual van een kleurenpalet",
      "Persona's en customer journey",
      "Wireframes van het platformconcept",
    ],
  },
  {
    slug: "signalen-van-morgen",
    title: "Signalen van Morgen",
    description:
      "Trendonderzoek in de interieur-, mode- en cultuursector, vertaald naar strategische inzichten en merkconcepten.",
    intro:
      "Tijdens mijn stage als trendwatcher en onderzoeker onderzocht ik maatschappelijke ontwikkelingen binnen interieur, mode en cultuur. De uitdaging: signalen van vandaag vertalen naar strategieën voor morgen.",
    challenge:
      "Opdrachtgevers worden overspoeld met trends. Ze hebben geen behoefte aan nóg een lijst, maar aan duiding: wat betekent deze verschuiving voor hún merk en hún klanten?",
    approach:
      "Ik verzamelde en clusterde signalen via deskresearch, straatobservaties en interviews, en analyseerde onderliggende waardenverschuivingen. Samen met merkstrategen vertaalde ik deze naar trendscenario's en innovatieve merkconcepten, onderbouwd met gebruikersinzichten.",
    result:
      "Trendrapporten en visuele trendboards die door opdrachtgevers werden ingezet bij strategische sessies, plus meerdere merkconcepten die als vertrekpunt dienden voor nieuwe collecties en campagnes.",
    body: `## Van signaal naar strategie

Een trend is meer dan wat er in de etalage hangt. Ik werkte met een gelaagd model: **signalen** (wat zien we?), **ontwikkelingen** (wat verandert er?) en **waarden** (waarom verandert het?).

## Drie bewegingen

- **Terug naar de bron** — een groeiende behoefte aan ambacht, herkomst en echtheid.
- **Zachte ruimtes** — interieurs die rust en herstel centraal stellen.
- **Collectieve cultuur** — van bezit naar beleving en gemeenschap.

## Vertaling naar merken

Voor elke opdrachtgever vertaalde ik de bewegingen naar concrete kansen, ondersteund met moodboards, doelgroepinzichten en conceptrichtingen.`,
    category: cat("trendonderzoek"),
    tags: ["Trendonderzoek", "Merkstrategie", "Interieur", "Mode", "Cultuur"],
    date: "2021-11-30",
    client: "Trend- & strategiebureau (stage)",
    role: "Trendwatcher, onderzoeker & brandingstrategie",
    duration: "6 maanden",
    team: "Trendonderzoekers en merkstrategen",
    featured: false,
    sortOrder: 6,
    coverAlt: "Abstracte visual van een trendboard",
    imageAlts: [
      "Abstracte visual van een trendboard",
      "Clustering van trendsignalen",
      "Uitgewerkt merkconcept",
    ],
  },
];

export const seedProjects: Project[] = raw.map(({ imageAlts, ...p }) => {
  const images = [img(p.slug, 1, imageAlts[0]), img(p.slug, 2, imageAlts[1]), img(p.slug, 3, imageAlts[2])];
  return {
    ...p,
    id: p.slug,
    status: "published",
    seoTitle: p.title,
    seoDescription: p.description,
    coverImage: images[0].url,
    images: images.slice(1),
    updatedAt: `${p.date}T12:00:00.000Z`,
  };
});

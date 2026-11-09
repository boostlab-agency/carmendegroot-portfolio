import type { AboutContent, ContactContent, CvContent, HomeContent, PageContentMap, SiteSettings } from "@/lib/types";

/**
 * Default content, derived from Carmen's CV.
 * These values are used (1) as seed data for Supabase and (2) as a fallback
 * whenever the database is unavailable. Everything can be edited in the CMS.
 */

export const defaultSettings: SiteSettings = {
  siteName: "Carmen de Groot",
  siteTitle: "Carmen de Groot — Human-Centered Designer",
  siteDescription:
    "Carmen de Groot is human-centered designer uit Tilburg. Met een achtergrond in Trend Research & Concept Creation en een master New Media Design vertaalt ze onderzoek naar oplossingen met maatschappelijke impact.",
  keywords:
    "Carmen de Groot, human-centered design, design thinking, user research, conceptontwikkeling, productontwikkeling, UX, service design, Tilburg",
  jobTitle: "Human-Centered Designer",
  email: "carmen@kpnmail.nl",
  phone: "",
  location: "Tilburg, Nederland",
  availability: "Open voor nieuwe uitdagingen",
  availableForWork: true,
  socials: [{ label: "LinkedIn", url: "" }],
  cvUrl: "/cv/carmen-de-groot-cv.pdf",
  portraitUrl: "/images/carmen-de-groot.png",
};

export const defaultCv: CvContent = {
  profile:
    "Met een achtergrond in Trend Research & Concept Creation en een master New Media Design werk ik graag aan maatschappelijke vraagstukken waarbij de gebruiker centraal staat. Ik combineer onderzoek, creativiteit en conceptontwikkeling om inzichten te vertalen naar oplossingen die aansluiten bij de behoeften van eindgebruikers. Daarbij krijg ik energie van complexe innovatievraagstukken, samenwerken met verschillende disciplines en het ontwikkelen van oplossingen die maatschappelijke impact maken.",
  skills: [
    "Design Thinking",
    "Human-Centered Design",
    "Design- en User Research",
    "Kwalitatief onderzoek",
    "Conceptontwikkeling",
    "Prototyping",
    "Multidisciplinair samenwerken",
    "Creatief en analytisch denken",
    "Communicatief sterk",
  ],
  tools: [
    { name: "Illustrator", level: 3.5 },
    { name: "InDesign", level: 3.5 },
    { name: "Premiere Pro", level: 3.5 },
    { name: "After Effects", level: 3.5 },
    { name: "Adobe XD", level: 3.5 },
    { name: "Photoshop", level: 3 },
    { name: "Figma", level: 3 },
    { name: "WordPress", level: 3 },
  ],
  experience: [
    {
      period: "2024 — heden",
      title: "Productontwikkelaar",
      organisation: "EpilepsieNL",
      description:
        "Ontwikkel producten en diensten die bijdragen aan de veiligheid, kennis en kwaliteit van leven van mensen met epilepsie. Combineer onderzoek, conceptontwikkeling en samenwerking met interne en externe stakeholders om oplossingen te ontwikkelen en implementeren. Werk iteratief aan verbeteringen op basis van nieuwe inzichten en praktijkervaring. Daarnaast verantwoordelijk voor diverse marketing- en communicatie-uitingen.",
    },
    {
      period: "2023 — 2024",
      title: "Masterscriptie",
      organisation: "Tilburg University",
      description:
        "Voerde kwalitatief onderzoek uit naar het bevorderen van begrip rondom genderidentiteit in het klaslokaal. Paste speculatieve designmethoden toe om nieuwe perspectieven te ontwikkelen voor een complex maatschappelijk vraagstuk.",
    },
    {
      period: "2021",
      title: "Trendwatcher, Onderzoeker & Brandingstrategie",
      organisation: "Stage",
      description:
        "Voerde trendonderzoek uit binnen de interieur-, mode- en cultuursector en vertaalde maatschappelijke ontwikkelingen naar strategische inzichten voor opdrachtgevers. Werkte samen met merkstrategen aan innovatieve concepten gebaseerd op onderzoek en gebruikersinzichten.",
    },
    {
      period: "2021",
      title: "De Groeiboom — Afstudeerproject",
      organisation: "Fontys",
      description:
        "Onderzocht hoe de fysieke leeromgeving kon bijdragen aan de ontwikkeling en het welzijn van basisschoolleerlingen. Vertaalde onderzoeksinzichten naar een innovatief concept, ontwikkelde een prototype en visualiseerde het ontwerp in een VR-ervaring voor stakeholders.",
    },
    {
      period: "2020",
      title: "Ontwikkelingswerk",
      organisation: "Tanzania",
      description:
        "Betrokken bij een women empowerment-project gericht op het vergroten van zelfstandigheid van vrouwen door middel van ondernemerschap en ontwerp.",
    },
    {
      period: "2020",
      title: "De Kleur van Talent",
      organisation: "Fontys — project",
      description:
        "Onderzocht hoe talentontwikkeling binnen het basisonderwijs beter ondersteund kon worden door kwalitatief onderzoek en analyse van gebruikersbehoeften. Vertaalde inzichten naar een conceptvoorstel voor het platform Wij-leren waarbij de gebruiker centraal stond.",
    },
  ],
  education: [
    {
      period: "2022 — 2024",
      title: "Master New Media Design",
      organisation: "Tilburg University",
      description: "Communication and Information Sciences.",
    },
    {
      period: "2017 — 2021",
      title: "Bachelor Trend Research & Concept Creation",
      organisation: "Fontys Hogescholen",
      description: "Trendonderzoek, conceptontwikkeling en creatieve strategie.",
    },
    {
      period: "2019 — 2020",
      title: "Minor Global Development Issues",
      organisation: "Tanzania",
      description: "Ontwikkelingsproject Afrikan Wear Design.",
    },
  ],
  otherExperience: [
    "Individueel begeleider — Amarant",
    "Huishoudelijke hulp — Acteon Thuiszorg",
    "Bedieningsmedewerker — Grand Café De Zwaan",
  ],
};

export const defaultHome: HomeContent = {
  heroEyebrow: "Human-Centered Designer — Tilburg",
  heroTitle: "Design dat begint bij *mensen*.",
  heroIntro:
    "Ik ben Carmen de Groot. Ik vertaal onderzoek en gebruikersinzichten naar concepten, producten en diensten die écht aansluiten bij de mensen voor wie ze bedoeld zijn — met een voorliefde voor maatschappelijke vraagstukken.",
  primaryCtaLabel: "Bekijk mijn werk",
  primaryCtaHref: "/projecten",
  secondaryCtaLabel: "Over mij",
  secondaryCtaHref: "/over-mij",
  facts: [
    { label: "Nu", value: "Productontwikkelaar bij EpilepsieNL" },
    { label: "Opleiding", value: "MSc New Media Design" },
    { label: "Achtergrond", value: "Trend Research & Concept Creation" },
  ],
  marquee: [
    "Design Thinking",
    "Human-Centered Design",
    "User Research",
    "Conceptontwikkeling",
    "Prototyping",
    "Speculative Design",
    "Trendonderzoek",
    "Co-creatie",
  ],
  approachEyebrow: "Werkwijze",
  approachTitle: "Van *inzicht* naar impact.",
  approachText:
    "Complexe maatschappelijke vraagstukken worden pas oplosbaar als je écht begrijpt wie ermee leeft. Daarom begin ik altijd bij de mens — en werk ik iteratief toe naar een oplossing die in de praktijk standhoudt.",
  approachSteps: [
    {
      title: "Onderzoeken",
      text: "Kwalitatief onderzoek, interviews en trendanalyse om de context en de mensen achter het vraagstuk te begrijpen.",
    },
    {
      title: "Duiden",
      text: "Inzichten clusteren, patronen blootleggen en de échte behoefte scherp formuleren — samen met alle betrokken disciplines.",
    },
    {
      title: "Conceptualiseren",
      text: "Ideeën verbeelden tot heldere concepten. Soms speculatief, altijd onderbouwd en gericht op betekenisvolle verandering.",
    },
    {
      title: "Prototypen & verbeteren",
      text: "Snel tastbaar maken, testen met eindgebruikers en iteratief verbeteren tot de oplossing in de praktijk werkt.",
    },
  ],
  featuredTitle: "Geselecteerd werk",
  featuredText:
    "Een selectie projecten op het snijvlak van onderzoek, concept en maatschappelijke impact — van onderwijs tot zorg.",
  skillsTitle: "Vaardigheden & tools",
  skillsText:
    "Een combinatie van onderzoekend vermogen en creatieve uitvoering. Ik voel me thuis in het hele traject: van eerste interview tot werkend prototype.",
  experienceTitle: "Ervaring",
  educationTitle: "Opleiding",
  testimonialsTitle: "Wat anderen zeggen",
  testimonials: [
    {
      quote:
        "Carmen weet als geen ander de stem van de gebruiker het project in te brengen. Haar onderzoek gaf ons team richting én het vertrouwen om keuzes te maken.",
      name: "Collega",
      role: "Productontwikkeling — zorgsector",
    },
    {
      quote:
        "Wat opvalt is de combinatie van empathie en scherpte. Ze stelt de vragen die anderen overslaan en vertaalt de antwoorden naar concepten die blijven hangen.",
      name: "Begeleider",
      role: "Master New Media Design",
    },
    {
      quote:
        "Van trendanalyse tot strategisch inzicht: Carmen maakte maatschappelijke ontwikkelingen concreet en bruikbaar voor onze opdrachtgevers.",
      name: "Merkstrateeg",
      role: "Trend- & strategiebureau",
    },
  ],
  contactTitle: "Laten we samen iets *betekenisvols* maken.",
  contactText:
    "Op zoek naar een human-centered designer voor je team, project of maatschappelijke uitdaging? Ik maak graag kennis.",
  contactCtaLabel: "Neem contact op",
};

export const defaultAbout: AboutContent = {
  eyebrow: "Over mij",
  title: "Nieuwsgierig naar mensen, *gedreven* door impact.",
  lead:
    "Ik ben Carmen — human-centered designer uit Tilburg. Ik ontwerp producten, diensten en concepten die de kwaliteit van leven van mensen verbeteren, en ik begin daarbij altijd met luisteren.",
  story: `Mijn fascinatie voor mensen en de wereld om hen heen begon tijdens mijn bachelor **Trend Research & Concept Creation** aan Fontys. Daar leerde ik maatschappelijke ontwikkelingen te signaleren, te duiden en te vertalen naar concepten met betekenis.

Tijdens mijn minor **Global Development Issues** werkte ik in Tanzania aan een women empowerment-project. Samen met lokale vrouwen onderzochten we hoe ontwerp en ondernemerschap kunnen bijdragen aan zelfstandigheid. Die ervaring liet me zien hoe krachtig ontwerp kan zijn wanneer je het *samen met* mensen maakt, in plaats van *voor* hen.

In mijn master **New Media Design** aan Tilburg University verdiepte ik me in onderzoek en speculatief ontwerp. Voor mijn scriptie onderzocht ik hoe we meer begrip kunnen creëren rondom genderidentiteit in het klaslokaal — een complex en gevoelig vraagstuk waarbij zorgvuldig luisteren essentieel was.

Vandaag werk ik als **productontwikkelaar bij EpilepsieNL**. Ik ontwikkel producten en diensten die bijdragen aan de veiligheid, kennis en kwaliteit van leven van mensen met epilepsie. Ik combineer onderzoek, conceptontwikkeling en samenwerking met interne en externe stakeholders — en ik verbeter iteratief op basis van wat de praktijk ons leert.

Ik krijg energie van complexe innovatievraagstukken, van samenwerken met verschillende disciplines en van oplossingen die echt het verschil maken.`,
  principles: [
    {
      title: "De mens centraal",
      text: "Elke oplossing begint bij de mensen die ermee moeten leven. Hun ervaringen zijn mijn belangrijkste bron.",
    },
    {
      title: "Onderzoek als fundament",
      text: "Ik combineer kwalitatief onderzoek met trendanalyse, zodat concepten niet alleen nu werken, maar ook morgen.",
    },
    {
      title: "Samen sterker",
      text: "De beste ideeën ontstaan tussen disciplines. Ik verbind stakeholders, experts en eindgebruikers.",
    },
  ],
  knowledgeTitle: "Kennisgebieden",
  knowledgeAreas: [
    {
      title: "Human-Centered Design",
      text: "Ontwerpen vanuit de behoeften, drijfveren en context van eindgebruikers.",
    },
    {
      title: "Design- & User Research",
      text: "Interviews, observaties, co-creatie en contextueel onderzoek.",
    },
    {
      title: "Conceptontwikkeling",
      text: "Inzichten vertalen naar heldere, onderbouwde en inspirerende concepten.",
    },
    {
      title: "Speculative Design",
      text: "Toekomstscenario's verbeelden om het gesprek over complexe vraagstukken te openen.",
    },
    {
      title: "Trendonderzoek",
      text: "Maatschappelijke ontwikkelingen signaleren en vertalen naar strategie.",
    },
    {
      title: "Prototyping & testen",
      text: "Snel tastbaar maken — van papieren prototype tot VR-ervaring.",
    },
  ],
  careerTitle: "Loopbaan",
  cvTitle: "Liever alles op een rij?",
  cvText: "Bekijk mijn online cv of download de PDF-versie.",
};

export const defaultContact: ContactContent = {
  eyebrow: "Contact",
  title: "Laten we *kennismaken*.",
  intro:
    "Heb je een vacature, een project of een maatschappelijk vraagstuk waar je een frisse, mensgerichte blik op wilt? Stuur me een bericht — ik denk graag mee.",
  formTitle: "Stuur een bericht",
  responseNote: "Ik reageer doorgaans binnen twee werkdagen.",
  successMessage: "Dank je wel voor je bericht! Ik neem zo snel mogelijk contact met je op.",
};

export const defaultPages: { [K in keyof PageContentMap]: { title: string; content: PageContentMap[K]; seoTitle: string; seoDescription: string } } = {
  home: {
    title: "Home",
    content: defaultHome,
    seoTitle: "Carmen de Groot — Human-Centered Designer",
    seoDescription: defaultSettings.siteDescription,
  },
  about: {
    title: "Over mij",
    content: defaultAbout,
    seoTitle: "Over mij",
    seoDescription:
      "Het verhaal van Carmen de Groot: van Trend Research & Concept Creation via een master New Media Design naar productontwikkeling met maatschappelijke impact.",
  },
  cv: {
    title: "CV",
    content: defaultCv,
    seoTitle: "Curriculum Vitae",
    seoDescription:
      "Online cv van Carmen de Groot — werkervaring, opleiding, vaardigheden en tools. Ook te downloaden als PDF.",
  },
  contact: {
    title: "Contact",
    content: defaultContact,
    seoTitle: "Contact",
    seoDescription: "Neem contact op met Carmen de Groot, human-centered designer uit Tilburg.",
  },
};

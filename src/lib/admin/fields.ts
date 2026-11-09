import type { PageKey } from "@/lib/types";

/**
 * Declarative field definitions. One source of truth for
 *  - the generic CMS editor (SchemaForm) and
 *  - server-side validation (zodFromGroups).
 */

export type ScalarField =
  | { type: "text"; name: string; label: string; hint?: string; max?: number; required?: boolean }
  | { type: "textarea"; name: string; label: string; hint?: string; max?: number; rows?: number }
  | { type: "markdown"; name: string; label: string; hint?: string; max?: number }
  | { type: "url"; name: string; label: string; hint?: string }
  | { type: "email"; name: string; label: string; hint?: string }
  | { type: "boolean"; name: string; label: string; hint?: string }
  | { type: "number"; name: string; label: string; hint?: string; min?: number; max?: number; step?: number }
  | { type: "image"; name: string; label: string; hint?: string }
  | { type: "file"; name: string; label: string; hint?: string; accept?: string }
  | { type: "stringList"; name: string; label: string; hint?: string };

export type ListField = {
  type: "list";
  name: string;
  label: string;
  hint?: string;
  itemLabel: string;
  fields: ScalarField[];
};

export type Field = ScalarField | ListField;
export type FieldGroup = { title: string; description?: string; fields: Field[] };

const EMPH = "Tip: zet een woord tussen *sterretjes* voor het cursieve accent.";

const timelineFields: ScalarField[] = [
  { type: "text", name: "period", label: "Periode", max: 60 },
  { type: "text", name: "title", label: "Titel / functie", max: 160 },
  { type: "text", name: "organisation", label: "Organisatie", max: 160 },
  { type: "textarea", name: "description", label: "Omschrijving", max: 1500, rows: 4 },
];

export const pageSchemas: Record<PageKey, FieldGroup[]> = {
  home: [
    {
      title: "Hero",
      description: "Het eerste wat bezoekers zien.",
      fields: [
        { type: "text", name: "heroEyebrow", label: "Bovenregel", max: 120 },
        { type: "text", name: "heroTitle", label: "Hoofdtitel", hint: EMPH, max: 140 },
        { type: "textarea", name: "heroIntro", label: "Introductie", max: 600 },
        { type: "text", name: "primaryCtaLabel", label: "Primaire knop — tekst", max: 40 },
        { type: "text", name: "primaryCtaHref", label: "Primaire knop — link", max: 200 },
        { type: "text", name: "secondaryCtaLabel", label: "Secundaire knop — tekst", max: 40 },
        { type: "text", name: "secondaryCtaHref", label: "Secundaire knop — link", max: 200 },
        {
          type: "list",
          name: "facts",
          label: "Kerngegevens onder de hero",
          itemLabel: "Gegeven",
          fields: [
            { type: "text", name: "label", label: "Label", max: 40 },
            { type: "text", name: "value", label: "Waarde", max: 120 },
          ],
        },
        { type: "stringList", name: "marquee", label: "Lopende band (één per regel)" },
      ],
    },
    {
      title: "Werkwijze",
      fields: [
        { type: "text", name: "approachEyebrow", label: "Bovenregel", max: 60 },
        { type: "text", name: "approachTitle", label: "Titel", hint: EMPH, max: 120 },
        { type: "textarea", name: "approachText", label: "Tekst", max: 800 },
        {
          type: "list",
          name: "approachSteps",
          label: "Stappen",
          itemLabel: "Stap",
          fields: [
            { type: "text", name: "title", label: "Titel", max: 60 },
            { type: "textarea", name: "text", label: "Tekst", max: 400, rows: 3 },
          ],
        },
      ],
    },
    {
      title: "Secties",
      fields: [
        { type: "text", name: "featuredTitle", label: "Uitgelichte projecten — titel", hint: EMPH, max: 120 },
        { type: "textarea", name: "featuredText", label: "Uitgelichte projecten — tekst", max: 400, rows: 3 },
        { type: "text", name: "skillsTitle", label: "Vaardigheden — titel", hint: EMPH, max: 120 },
        { type: "textarea", name: "skillsText", label: "Vaardigheden — tekst", max: 400, rows: 3 },
        { type: "text", name: "experienceTitle", label: "Werkervaring — titel", max: 80 },
        { type: "text", name: "educationTitle", label: "Opleiding — titel", max: 80 },
      ],
    },
    {
      title: "Testimonials",
      fields: [
        { type: "text", name: "testimonialsTitle", label: "Titel", hint: EMPH, max: 120 },
        {
          type: "list",
          name: "testimonials",
          label: "Testimonials",
          itemLabel: "Testimonial",
          fields: [
            { type: "textarea", name: "quote", label: "Citaat", max: 600, rows: 3 },
            { type: "text", name: "name", label: "Naam", max: 80 },
            { type: "text", name: "role", label: "Functie / organisatie", max: 120 },
          ],
        },
      ],
    },
    {
      title: "Contactblok",
      fields: [
        { type: "text", name: "contactTitle", label: "Titel", hint: EMPH, max: 140 },
        { type: "textarea", name: "contactText", label: "Tekst", max: 400, rows: 3 },
        { type: "text", name: "contactCtaLabel", label: "Knoptekst", max: 40 },
      ],
    },
  ],
  about: [
    {
      title: "Introductie",
      fields: [
        { type: "text", name: "eyebrow", label: "Bovenregel", max: 60 },
        { type: "text", name: "title", label: "Titel", hint: EMPH, max: 160 },
        { type: "textarea", name: "lead", label: "Lead", max: 600 },
        { type: "markdown", name: "story", label: "Persoonlijk verhaal", hint: "Markdown: **vet**, *cursief*, ## kop, - lijst", max: 12000 },
      ],
    },
    {
      title: "Principes",
      fields: [
        {
          type: "list",
          name: "principles",
          label: "Principes",
          itemLabel: "Principe",
          fields: [
            { type: "text", name: "title", label: "Titel", max: 80 },
            { type: "textarea", name: "text", label: "Tekst", max: 400, rows: 3 },
          ],
        },
      ],
    },
    {
      title: "Kennisgebieden",
      fields: [
        { type: "text", name: "knowledgeTitle", label: "Titel", hint: EMPH, max: 100 },
        {
          type: "list",
          name: "knowledgeAreas",
          label: "Kennisgebieden",
          itemLabel: "Kennisgebied",
          fields: [
            { type: "text", name: "title", label: "Titel", max: 80 },
            { type: "textarea", name: "text", label: "Tekst", max: 300, rows: 2 },
          ],
        },
      ],
    },
    {
      title: "Loopbaan & CV",
      description: "De loopbaan zelf beheer je via de pagina CV.",
      fields: [
        { type: "text", name: "careerTitle", label: "Loopbaan — titel", hint: EMPH, max: 100 },
        { type: "text", name: "cvTitle", label: "CV-blok — titel", max: 100 },
        { type: "textarea", name: "cvText", label: "CV-blok — tekst", max: 300, rows: 2 },
      ],
    },
  ],
  cv: [
    {
      title: "Profiel",
      fields: [{ type: "textarea", name: "profile", label: "Profieltekst", max: 2000, rows: 6 }],
    },
    {
      title: "Werkervaring",
      description: "Wordt getoond op de homepage, Over mij en het online CV.",
      fields: [{ type: "list", name: "experience", label: "Ervaring", itemLabel: "Ervaring", fields: timelineFields }],
    },
    {
      title: "Opleiding",
      fields: [{ type: "list", name: "education", label: "Opleidingen", itemLabel: "Opleiding", fields: timelineFields }],
    },
    {
      title: "Vaardigheden & tools",
      fields: [
        { type: "stringList", name: "skills", label: "Vaardigheden (één per regel)" },
        {
          type: "list",
          name: "tools",
          label: "Tools",
          itemLabel: "Tool",
          fields: [
            { type: "text", name: "name", label: "Naam", max: 60 },
            { type: "number", name: "level", label: "Niveau (0–4)", min: 0, max: 4, step: 0.5 },
          ],
        },
        { type: "stringList", name: "otherExperience", label: "Overige werkervaring (één per regel)" },
      ],
    },
  ],
  contact: [
    {
      title: "Contactpagina",
      fields: [
        { type: "text", name: "eyebrow", label: "Bovenregel", max: 60 },
        { type: "text", name: "title", label: "Titel", hint: EMPH, max: 120 },
        { type: "textarea", name: "intro", label: "Introductie", max: 600 },
        { type: "text", name: "formTitle", label: "Formulier — titel", max: 80 },
        { type: "text", name: "responseNote", label: "Formulier — reactietijd", max: 160 },
        { type: "textarea", name: "successMessage", label: "Bevestigingsbericht", max: 400, rows: 2 },
      ],
    },
  ],
};

export const settingsSchema: FieldGroup[] = [
  {
    title: "Algemeen",
    fields: [
      { type: "text", name: "siteName", label: "Naam", max: 80 },
      { type: "text", name: "siteTitle", label: "Site titel (browser & Google)", max: 120 },
      { type: "textarea", name: "siteDescription", label: "Meta beschrijving", hint: "Ideaal: 120–160 tekens.", max: 300, rows: 3 },
      { type: "textarea", name: "keywords", label: "Zoekwoorden (komma-gescheiden)", max: 500, rows: 2 },
      { type: "text", name: "jobTitle", label: "Functietitel", max: 80 },
    ],
  },
  {
    title: "Contactgegevens",
    fields: [
      { type: "email", name: "email", label: "E-mailadres" },
      { type: "text", name: "phone", label: "Telefoonnummer", hint: "Laat leeg om niet te tonen.", max: 40 },
      { type: "text", name: "location", label: "Locatie", max: 80 },
    ],
  },
  {
    title: "Beschikbaarheid",
    fields: [
      { type: "boolean", name: "availableForWork", label: "Toon beschikbaarheidslabel" },
      { type: "text", name: "availability", label: "Tekst", max: 80 },
    ],
  },
  {
    title: "Social links",
    fields: [
      {
        type: "list",
        name: "socials",
        label: "Links",
        hint: "Links zonder URL worden niet getoond.",
        itemLabel: "Link",
        fields: [
          { type: "text", name: "label", label: "Label", max: 40 },
          { type: "url", name: "url", label: "URL" },
        ],
      },
    ],
  },
  {
    title: "Bestanden",
    fields: [
      { type: "image", name: "portraitUrl", label: "Portretfoto" },
      { type: "file", name: "cvUrl", label: "CV (PDF)", accept: "application/pdf" },
    ],
  },
];

export const PAGE_LABELS: Record<PageKey, { title: string; path: string; description: string }> = {
  home: { title: "Home", path: "/", description: "Hero, werkwijze, secties, testimonials en contactblok." },
  about: { title: "Over mij", path: "/over-mij", description: "Persoonlijk verhaal, principes en kennisgebieden." },
  cv: { title: "CV", path: "/cv", description: "Profiel, werkervaring, opleiding, vaardigheden en tools." },
  contact: { title: "Contact", path: "/contact", description: "Teksten van de contactpagina en het formulier." },
};

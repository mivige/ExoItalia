import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "zod";

// src/data/site.yml — configurazione globale (un'unica entry "site").
const site = defineCollection({
  loader: file("src/data/site.yml"),
  schema: z.object({
    nome: z.string(),
    dominio: z.url(),
    payoff: z.string(),
    sedeLegale: z.object({
      indirizzo: z.string(),
      cap: z.string(),
      citta: z.string(),
      provincia: z.string(),
    }),
    contatti: z.object({
      email: z.email(),
      telefono: z.string(),
    }),
    codiceFiscale: z.string().nullable(),
    social: z.object({
      instagram: z.url(),
      linkedin: z.url(),
    }),
    privacyUrl: z.url(),
    cookieUrl: z.url(),
  }),
});

// src/data/partners.yml — mappa slug -> partner.
const partners = defineCollection({
  loader: file("src/data/partners.yml"),
  schema: z.object({
    nome: z.string(),
    url: z.url(),
    tipo: z.enum(["partner", "sostenitore", "patrocinio"]),
    logo: z.string().optional(),
  }),
});

// src/data/stats.yml — mappa slug -> numero della home.
const stats = defineCollection({
  loader: file("src/data/stats.yml"),
  schema: z.object({
    // Il file loader non garantisce l'ordine di dichiarazione in YAML:
    // l'ordine di visualizzazione va esplicito.
    ordine: z.number(),
    valore: z.string(),
    etichetta: z.string(),
    nota: z.string().optional(),
  }),
});

// src/data/team.yml — mappa slug -> membro del consiglio direttivo.
const team = defineCollection({
  loader: file("src/data/team.yml"),
  schema: z.object({
    ordine: z.number(),
    nome: z.string(),
    ruolo: z.string(),
    bio: z.string(),
    email: z.email(),
    linkedin: z.url().optional(),
    foto: z.string().optional(),
  }),
});

// src/data/rete.yml — altre sedi della rete Exo Italia, con un sito
// proprio, mostrate in /rete. Exo Latina (questo sito) non è tra queste:
// è la sede da cui la rete è nata.
const rete = defineCollection({
  loader: file("src/data/rete.yml"),
  schema: z.object({
    nome: z.string(),
    stato: z.enum(["attiva", "in-avvio"]),
    url: z.url(),
    sommario: z.string(),
  }),
});

// src/content/news/{YYYY-MM-DD}-{slug}.md — una news per file.
const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/news" }),
  schema: z
    .object({
      titolo: z.string(),
      data: z.coerce.date(),
      sommario: z.string().max(200, "Il sommario deve stare entro 200 caratteri"),
      copertina: z.string().optional(),
      copertinaAlt: z.string().optional(),
      bozza: z.boolean().default(false),
    })
    .refine((n) => !n.copertina || !!n.copertinaAlt, {
      message: "copertinaAlt è obbligatorio quando è presente copertina",
      path: ["copertinaAlt"],
    }),
});

export const collections = { site, partners, stats, team, rete, news };

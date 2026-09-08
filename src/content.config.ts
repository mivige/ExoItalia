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

// src/content/sedi/{slug}.md — una sede locale per file.
const sedi = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/sedi" }),
  schema: z.object({
    nome: z.string(),
    citta: z.string(),
    regione: z.string(),
    stato: z.enum(["attiva", "in-avvio"]),
    // Nullable (non solo opzionale): per una sede "in-avvio" l'anno non è
    // ancora noto, ma il campo resta esplicito nel frontmatter per
    // ricordare all'editor che va confermato.
    annoAvvio: z.number().nullable(),
    ordine: z.number(),
    claim: z.string().max(80, "Il claim deve stare entro 80 caratteri"),
    sommario: z.string(),
    email: z.email().nullable(),
    copertina: z.string().optional(),
    copertinaAlt: z.string().optional(),
    referenti: z
      .array(
        z.object({
          nome: z.string(),
          ruolo: z.string(),
          linkedin: z.url().optional(),
        }),
      )
      .optional(),
    attivita: z
      .array(
        z.object({
          titolo: z.string(),
          descrizione: z.string(),
        }),
      )
      .optional(),
    social: z
      .object({
        instagram: z.url().optional(),
      })
      .optional(),
  }).refine((sede) => !sede.copertina || !!sede.copertinaAlt, {
    message: "copertinaAlt è obbligatorio quando è presente copertina",
    path: ["copertinaAlt"],
  }),
});

export const collections = { site, partners, stats, team, sedi };

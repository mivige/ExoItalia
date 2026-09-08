import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
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

export const collections = { site };

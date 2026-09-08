/**
 * GitHub Pages serve i "project site" (senza dominio personalizzato) da
 * username.github.io/nome-repo/, non dalla radice. astro.config.mjs imposta
 * `base` di conseguenza: ogni percorso interno scritto a mano (href, src)
 * deve passare da qui per restare corretto. Quando arriverà il dominio
 * definitivo (CNAME), `base` va rimosso da astro.config.mjs e questa
 * funzione torna a essere un no-op.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return base + suffix || "/";
}

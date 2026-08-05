import { cp, mkdir, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/server", { recursive: true });
await cp("out", "dist/client", { recursive: true });

const worker = `export default {
  async fetch(request, env) {
    const direct = await env.ASSETS.fetch(request);
    if (direct.status !== 404) return direct;

    const url = new URL(request.url);
    if (!url.pathname.endsWith("/")) url.pathname += "/";
    url.pathname += "index.html";
    return env.ASSETS.fetch(new Request(url, request));
  },
};
`;

await writeFile("dist/server/index.js", worker);

# Defense‑Hardened Icon Generator

This project is a minimal web application that converts natural‑language
descriptions into crisp, defense‑oriented SVG icons. The generator uses
OpenAI’s ChatGPT API behind the scenes, then sanitizes the output with
[SVGO](https://github.com/svg/svgo) to enforce a strict style specification:

* **Format:** SVG only, `viewBox="0 0 24 24"`
* **Stroke:** 2 px wide, `stroke="currentColor"`, `stroke-linecap="square"`,
  `stroke-linejoin="miter"`, `stroke-miterlimit="10"`
* **Geometry:** favor straight segments and chamfers; avoid soft curves
* **No fills:** except when absolutely necessary for legibility

## Running locally

> **Prerequisites:** Node.js (>=18) and npm or pnpm. You must supply your own
> OpenAI API key.

1. Install dependencies:

   ```bash
   pnpm install
   # or
   npm install
   ```

2. Copy `.env.local.example` to `.env.local` and add your OpenAI API key and optional model name:

   ```bash
   cp .env.local.example .env.local
   # edit .env.local and set OPENAI_API_KEY and OPENAI_MODEL
   ```

3. Run the development server:

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. Open <http://localhost:3000> in your browser and try prompts like `AWACS aircraft top view` or `satellite uplink dish with hard beam chevrons`.

## API endpoint

The server exposes a single endpoint, `POST /api/generate`. It accepts JSON
requests like:

```json
{
  "prompt": "reticle with four ticks"
}
```

It responds with:

```json
{
  "svg": "<svg viewBox=...>...</svg>"
}
```

The endpoint calls the OpenAI Chat Completion API with a system prompt that
describes the desired icon style. The returned SVG is sanitized to remove
invalid attributes and enforce the style spec.

## Deployment

This project is framework‑agnostic and can be deployed anywhere that runs
Next.js (Vercel, Netlify, self‑hosted Node server, etc.). To deploy on Vercel:

1. Create a new Vercel project from this repository.
2. Add environment variables `OPENAI_API_KEY` and optional `OPENAI_MODEL`.
3. Trigger a deploy; the API route will be compiled as an Edge Function.

## Limitations

* The OpenAI API call is not mocked—without an API key the `/api/generate` route
  will return an error.
* Sanitization is conservative; it will strip out fills, gradients, filters, and
  other unsupported features.
* Generated icons may still need manual refinement for production use.

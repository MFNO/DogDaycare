# Dog Daycare — static website

Single-page **React** site for a small dog daycare. Built with **[Vite](https://vitejs.dev/)** (dev server + production bundling) and **[Ant Design](https://ant.design/)** for layout and UI. The production output is static files in **`dist/`**, suitable for hosting on **Amazon S3**, Netlify, GitHub Pages, or any static host.

The repo also includes an optional **[AWS SAM](https://docs.aws.amazon.com/serverless-application-model/)** app under **`sam/contact-form/`**: **HTTP API → Node.js Lambda → Amazon SES**, exposing **`POST /submit`** for JSON contact payloads. The **live site’s contact section does not call this API yet** — it uses a **Google Forms** intake link configured in **`src/config/site.js`**. The SAM stack is there to deploy when you want server-side email; **`.env.example`** reserves **`VITE_CONTACT_API_URL`** for a future in-page form.

## Tech stack

| Piece | Notes |
|-------|--------|
| **React** 18 | App entry: **`src/main.jsx`** → **`src/App.jsx`**. |
| **Vite** 6 | **`vite.config.js`** — React plugin only. |
| **Ant Design** 5 | Theme tokens and component overrides in **`src/main.jsx`**. |

**Scripts** (see **`package.json`**): **`npm run dev`**, **`npm run build`**, **`npm run preview`**. There are no lint or test scripts in this repo.

## Requirements

**Frontend:** Node.js **18+** and npm.

**Optional SAM contact API:** [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html), AWS CLI credentials, and SES-verified email identities in the deploy region (see **`sam/contact-form/template.yaml`**).

## Local development

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (default **`http://localhost:5173`**).

Optional: copy **`.env.example`** to **`.env`** if you add code that reads **`import.meta.env.VITE_CONTACT_API_URL`**. Restart the dev server after changing env files.

## Page structure

Sections are composed in **`src/App.jsx`**:

| Section | Component | Purpose |
|---------|-----------|---------|
| Hero | **`Hero.jsx`** | Title, tagline, scroll to contact. |
| About | **`About.jsx`** | Intro copy from site config. |
| Services | **`Services.jsx`** | Service cards from site config. |
| Gallery | **`Gallery.jsx`** | Carousel of images under **`src/assets/gallery/`** (loaded via Vite **`import.meta.glob`**). |
| Contact | **`ContactForm.jsx`** | Primary CTA opens **`site.intakeFormUrl`** (Google Form) in a new tab. |

**Header / footer:** **`SiteHeader.jsx`** (sticky nav), **`SiteFooter.jsx`** (business name and copyright; optional phone, email, and social columns exist in code but are **commented out** — uncomment and extend **`src/config/site.js`** if you enable them).

## Editing content

- **`src/config/site.js`** — Business name, tagline, hours, location, email, services list, section titles, contact intro, **`intakeFormUrl`** / button label, nav keys, and placeholder social URLs.
- **`src/assets/gallery/`** — Add or remove images; supported extensions match **`Gallery.jsx`** glob (`png`, `jpg`, `jpeg`, `gif`, `svg`, `webp`, `avif`). Filenames sort alphabetically for carousel order.
- **`src/main.jsx`** — Ant Design **theme** (`token` colors, typography, component tweaks).
- **`public/favicon.svg`** — Favicon.
- **`index.html`** — Document title and meta description.

## Production build

```bash
npm run build
```

Artifacts go to **`dist/`**. Serve **`dist/`** as static files. Set **`VITE_CONTACT_API_URL`** at build time only if your built UI references it (not used by the current React components).

Preview locally:

```bash
npm run preview
```

## Hosting the static site (example: S3)

After **`npm run build`**:

```bash
aws s3 sync dist/ s3://YOUR_BUCKET_NAME --delete --region YOUR_REGION
```

Configure the bucket for static website hosting or front it with CloudFront as you prefer. Replace bucket name and region.

## SAM contact API (`sam/contact-form/`)

Lambda runtime **Node.js 24** (ARM), **`POST /submit`**, body **`{ name, email, message }`**. Stack parameters: **`DestinationEmail`**, **`SourceEmail`**, **`AllowedOrigin`** (CORS). Deploy from that directory:

```bash
cd sam/contact-form
npm install
sam build
sam deploy --guided   # first time
# later: sam deploy (uses samconfig.toml)
```

Edit **`samconfig.toml`** **`parameter_overrides`** for real addresses and your site origin; **`profile`** defaults to **`personal`**. Verify sender and inbox in **SES** in the **same region** as the stack (sandbox accounts must verify destinations too).

Stack output **`ApiEndpoint`** is the full URL to **`/submit`**. Wiring the React app would read **`import.meta.env.VITE_CONTACT_API_URL`** (see **`.env.example`**) from a new or updated component — the current **`ContactForm`** does not.

## Project layout

| Path | Purpose |
|------|---------|
| **`index.html`**, **`vite.config.js`** | Vite entry and config |
| **`public/`** | Static assets served as-is (e.g. favicon) |
| **`src/main.jsx`** | React mount + Ant Design theme |
| **`src/App.jsx`** | Page sections |
| **`src/components/`** | UI sections and chrome |
| **`src/config/site.js`** | Site copy and settings |
| **`src/assets/gallery/`** | Gallery images |
| **`src/index.css`** | Global CSS |
| **`sam/contact-form/template.yaml`** | SAM template (HTTP API + Lambda + SES policy) |
| **`sam/contact-form/src/handler.mjs`** | Lambda handler |
| **`sam/contact-form/samconfig.toml`** | Default deploy profile, region, stack name, parameters |
| **`.env.example`** | Example env vars for Vite |

Git ignores **`node_modules`**, **`dist`**, **`.env`**, **`sam/**/.aws-sam/`**, and (if present) legacy Terraform state paths under **`infra/terraform/`**.

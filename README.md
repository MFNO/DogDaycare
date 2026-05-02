# Dog Daycare — static website

Single-page React site for a small dog daycare, built with [Vite](https://vitejs.dev/) and [Ant Design](https://ant.design/). The production build is static HTML/CSS/JS for **Amazon S3**; the contact form posts to an **AWS Lambda** (Python) that sends mail with **Amazon SES**.

## What you need (AWS + email)

| Item | Why |
|------|-----|
| **AWS account** | Run `terraform apply` (or use AWS Console equivalents). |
| **AWS CLI** (optional) | `aws s3 sync` to upload the site; `aws configure` for credentials. |
| **Terraform** ≥ 1.5 | Provisions S3, Lambda, API Gateway, IAM, and optional SES identities. |
| **Two email addresses** (or one used for both) | `contact_to_email` (inbox) and `contact_from_email` (sender label). Each must be **verified in Amazon SES** in the same region you deploy (Terraform can *request* verification; you still click the links AWS sends). |
| **SES sandbox** | By default you can only send **to** verified addresses. Verify both emails (or request production access in SES). |

**Region:** Use `us-east-1` unless you have a reason not to — it is the default in `infra/terraform/variables.tf` and works well with SES.

## Local development

**Requirements:** Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Contact form (Lambda + SES)

1. Deploy infrastructure (below) and copy the Terraform output **`contact_api_url`**.
2. Copy `.env.example` to `.env` and set:

   ```bash
   VITE_CONTACT_API_URL=https://YOUR_API_ID.execute-api.REGION.amazonaws.com/prod/contact
   ```

3. Put `http://localhost:5173` in Terraform **`allowed_origins`** so the browser can POST from dev.
4. Restart `npm run dev` after changing `.env`.

## Infrastructure (Terraform)

Code lives in **`infra/terraform/`**. The Lambda source is **`infra/lambda/contact/handler.py`** (zipped at apply time).

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars: emails, allowed_origins, region.
terraform init
terraform apply
```

After apply:

1. Open the verification emails from **Amazon SES** and confirm both identities (if `create_ses_identities = true`).
2. Copy outputs **`website_bucket_name`**, **`website_url`**, and **`contact_api_url`**.
3. Add the **`website_url`** origin to **`allowed_origins`** in `terraform.tfvars` and run `terraform apply` again if the browser blocked CORS on production.

### Deploy the static build to S3

```bash
# From repo root, after npm run build
aws s3 sync dist/ s3://WEBSITE_BUCKET_NAME --delete --region YOUR_REGION
```

Use the **`website_bucket_name`** output for `WEBSITE_BUCKET_NAME`.

## Updating content

Editable copy lives in **`src/config/site.js`**. Gallery files go in **`src/assets/gallery/`**. Theme tokens are in **`src/main.jsx`**.

## Production build

```bash
npm run build
```

Output is in **`dist/`**. For production, set **`VITE_CONTACT_API_URL`** before building (or your CI injects it) so the built JS points at the real API.

## Project layout

| Path | Purpose |
|------|---------|
| `src/config/site.js` | Site copy and business settings |
| `src/main.jsx` | Ant Design theme |
| `src/components/` | Section components |
| `infra/terraform/` | Terraform for S3 + API + Lambda + SES identities |
| `infra/lambda/contact/` | Python Lambda handler (SES) |

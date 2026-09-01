# documentation folder
    - To access the documentation, navigate to the documentation folder and open the index.html file in your browser.

# html folder
    - The html folder contains the layouts for the landing page, subpages, and associated HTML files and assets.

# Installation
    - Upload the main folder to a web server or set up a local server to test.

# Important Note: 
    - This is an HTML template, not a WordPress theme. Images used in the demo are for preview purposes only and are not included in the source code.

# Deploying to Azure Static Web Apps
    - Site root: `html/` is deployed as the static site (`documentation/` is excluded).
    - The old PHP form handlers (`form-process.php`, `review-form.php`) don't run on Static Web Apps, so they were replaced with Azure Functions under `api/` (`submitEnquiry`, `submitReview`) that send email via SendGrid. The forms in `contact.html` and `team-detail.html` now post to `/api/submitEnquiry` and `/api/submitReview`.
    - One-time setup:
        1. In the Azure Portal, create a **Static Web App** resource, connect it to this GitHub repo, branch `main`, with app location `/html`, API location `/api`, and output location empty. This auto-creates a `AZURE_STATIC_WEB_APPS_API_TOKEN` secret in the repo and can replace the workflow file at `.github/workflows/azure-static-web-apps.yml` with a matching one (the one already committed here works too — just make sure the secret name matches).
        2. In the Static Web App's **Configuration** (Application settings), add: `SENDGRID_API_KEY`, `CONTACT_FROM_EMAIL` (a verified SendGrid sender), and optionally `CONTACT_TO_EMAIL` / `REVIEW_TO_EMAIL` to override the default recipient addresses.
        3. Push to `main` — the GitHub Actions workflow builds and deploys both the site and the API automatically.
    - Local API development: copy `api/local.settings.json.example` to `api/local.settings.json`, fill in the SendGrid values, then run `func start` from `api/` (requires Azure Functions Core Tools).


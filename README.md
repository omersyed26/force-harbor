# Force Harbor Website

Official website for **force-harbor.com** — a Salesforce & Cloud consulting company.

## 🚀 Tech Stack
- Pure HTML5, CSS3, and vanilla JavaScript
- Google Fonts (Syne + DM Sans)
- No build tools or frameworks required
- Deployed via **GitHub Pages**

## 📁 File Structure
```
force-harbor/
├── index.html      # Main page
├── styles.css      # All styles (CSS variables, responsive)
├── script.js       # Nav behavior, scroll reveal, form handling
└── README.md
```

## 🌐 Deployment (GitHub Pages)

1. Push all files to the `main` branch (or a `gh-pages` branch)
2. Go to **Settings → Pages** in this repository
3. Set Source to: `Deploy from a branch → main → / (root)`
4. GitHub will publish the site at `https://omersyed26.github.io/force-harbor/`

## 🔗 Custom Domain (Namecheap → GitHub Pages)

Once GitHub Pages is live:

1. In your Namecheap DNS settings for `force-harbor.com`, add:
   - **A records** pointing to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **CNAME record**: `www` → `omersyed26.github.io`

2. In **GitHub → Settings → Pages → Custom Domain**, enter `force-harbor.com`
3. Check "Enforce HTTPS" once DNS propagates (~24–48 hrs)

## ✏️ Customization Checklist
- [ ] Replace placeholder stats (50+ projects, 98%, 10+ years) with real numbers
- [ ] Update `hello@force-harbor.com` with your actual email
- [ ] Add a favicon (`<link rel="icon" href="favicon.ico">` in `<head>`)
- [ ] Connect the contact form to a backend (e.g. [Formspree](https://formspree.io))
- [ ] Add real client logos to the "Trusted by" section
- [ ] Add a blog or case studies page

## 📬 Contact Form
The form currently uses a client-side stub. To make it functional:
1. Sign up at [formspree.io](https://formspree.io)
2. Get your form endpoint URL
3. Update `<form>` action attribute and change the JS submit handler accordingly

# Luis Colon — Portfolio

Personal portfolio for Luis Colon, a full-stack software engineer and UI/UX designer based in Puerto Rico.

## Live site

[luiscolon0426.github.io/portfolio](https://luiscolon0426.github.io/portfolio/)

## Features

- Responsive, accessible single-page portfolio
- Professional experience and résumé-backed career highlights
- Categorized technical skills with mobile carousel controls
- Selected client and personal work
- Shareable CheatDoc and Chivito case studies
- Persistent English/Spanish language switch
- Search and social-sharing metadata with `Person` structured data
- Direct email, LinkedIn, and WhatsApp contact options

## Technology

- Semantic HTML
- Modern CSS
- Vanilla JavaScript modules
- AOS for entrance animations
- Devicon for technology icons
- GitHub Pages for hosting

## Run locally

From the repository root:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

## Deployment

GitHub Pages deploys the root of the `main` branch. Push changes with:

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

## Structure

```text
css/       Main, responsive, and case-study styles
img/       Portfolio, project, favicon, and social-preview assets
js/        Navigation, carousel, and localization behavior
projects/  Individual case-study pages
index.html Main portfolio page
```

## License

MIT

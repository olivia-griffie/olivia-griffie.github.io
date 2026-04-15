# Olivia Griffie Portfolio

Static portfolio site for Olivia Griffie with case studies, illustration work, and product-minded front-end presentation.

## Site architecture

- `home/` holds the current homepage and anchor-based sections for work, about, and contact.
- `work/`, `about/`, and `contact/` are route scaffolds that can expand into standalone pages without changing the public URL structure later.
- Project case studies live in their own folders such as `bookbuddy/`, `brand-identity/`, and `mobile-fix-example/`.

## Front-end source structure

- `src/css/tokens.css` defines the shared design tokens.
- `src/css/layout.css` contains section, container, and grid primitives.
- `src/css/components.css` contains reusable button, card, and testimonial primitives.
- `src/css/utilities.css` holds layout helpers.
- `src/css/pages/` stores page-level styles for future extraction.
- `src/js/` mirrors the production interaction concerns by domain: analytics, interactions, modals, and scroll behavior.
- `components/` contains reusable HTML snippets for header, footer, section headings, project cards, and testimonial cards.

The live site still ships from `index.css` and `index.js`, but the repo now has a cleaner component-style structure to support future refactors or a move to Astro/Next later.

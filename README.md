# Michael The Bassist — website

A fast, self-contained website for **Michael Santos (Michael The Bassist)** —
upright bassist, jazz performer, and educator.

Built as plain **HTML, CSS, and JavaScript** with **no build step and no
dependencies**, so it's easy to own, edit, and host anywhere.

```
michaelswebsite/
├── index.html            ← all the page content + copy
├── css/styles.css        ← colours, fonts, layout
├── js/main.js            ← mobile menu + scroll animations
├── images/               ← photos + placeholders + favicon
└── README.md             ← you are here
```

---

## 1. Photos

The three photos are already in place, web-optimised (compressed from ~19 MB
down to under 1 MB total for fast loading):

| Filename                         | Where it appears                          |
| -------------------------------- | ----------------------------------------- |
| `images/michael-hero.jpg`        | Main hero image at the top                |
| `images/michael-portrait.jpg`    | About section ("Who is Michael?")         |
| `images/michael-performance.jpg` | Full-width black-and-white band (quote)   |

To swap any photo later, replace the file with a same-named JPG (ideally
~2000px wide, under ~500 KB). The high-resolution originals remain in the
project's git history if you ever need them.

---

## 2. Edit the copy

All text lives in **`index.html`** — open it in any text editor and change the
words between the tags. Everything you'll likely want to update is marked with
`<!-- TODO ... -->` comments, including:

- **Contact form** — see section 4 below (no email address is shown on the
  site; the form is the contact channel).

---

## 3. Fonts & colours

Defined at the top of `css/styles.css` under `:root`. The palette matches the
original site:

| Variable       | Colour      | Use                         |
| -------------- | ----------- | --------------------------- |
| `--teal`       | `#2e4a51`   | Header, About section       |
| `--cream`      | `#f2e2ba`   | Headings, wordmark          |
| `--tan`        | `#d9b98d`   | Hero tone, accents          |
| `--paper`      | `#f7f1e4`   | Light sections              |

**Display font:** the original site uses **Cooper Black**, a paid Adobe/
Squarespace font. This site uses **Fraunces** (free, open-source) as a warm,
rounded stand-in loaded from Google Fonts. If Michael has a Cooper Black
licence and wants an exact match, add its `@font-face` and change
`--font-display` in `styles.css` — nothing else needs to change.

---

## 4. Wire up the contact form (optional)

The form currently points at a placeholder. To make it actually send email,
create a free form endpoint (e.g. **[Formspree](https://formspree.io)**) and
paste your endpoint URL into the `action="..."` attribute of the `<form>` in
`index.html`. If you'd rather not use a form at all, delete the `<form>` block —
the email link next to it still works.

---

## 5. Preview it locally

Just double-click `index.html` to open it in a browser. For a closer-to-live
preview (so the fonts and paths behave exactly right), run a tiny local server
from this folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## 6. Publish it (free options)

This is a static site, so it works on almost any host:

- **GitHub Pages** — push this folder to a repo, then Settings → Pages → deploy
  from the `main` branch. Free.
- **Netlify** or **Cloudflare Pages** — drag-and-drop this folder onto their
  dashboard. Free, gives you a URL instantly.
- **Point the domain** `michaelthebassist.com` at whichever host you choose
  (each host has a "custom domain" guide).

Because there's no build step or framework, whoever owns the site only needs a
text editor and the ability to upload files — nothing to maintain.

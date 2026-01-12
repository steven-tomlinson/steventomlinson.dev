# Copilot Agent Task — Add “Systems of Meaning” Blog at `/blog/`

**Repository:** `steven-tomlinson/steventomlinson.dev`  
**Branch:** `feature/blog-systems-of-meaning`  
**PR title:** `feat(blog): add Systems of Meaning blog section`  
**Goal:** Add a Jekyll-powered blog at `/blog/` while keeping the existing homepage and styling intact.

---

## Execution Rules

1. **Non-destructive:** Do not delete or rename existing files; only add or minimally append.
2. **Idempotent:** Re-running must not duplicate links or posts.
3. **Build-safe:** Use only GitHub Pages–supported plugins (`jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-feed`).
4. **Styling:** If `assets/css/style.css` exists, **append** styles at the end; otherwise create the file.
5. **Navigation:** Add a “Blog” link to the header if not already present.
6. **Homepage teaser:** Append a “Latest from the Blog” teaser only if the homepage is Markdown or has a safe place in HTML.

---

## Acceptance Criteria

- `/` (homepage) unchanged except for an optional blog teaser.
- `/blog/` exists and lists posts.
- Individual posts render with `post` layout and dates.
- Global nav includes “Blog” (desktop + mobile, where applicable).
- GitHub Pages build passes (no plugin errors).
- Sitemap/feed updated (if plugins present).

---

## Commit Strategy

1. `chore(jekyll): ensure _config.yml and base layouts`
2. `feat(blog): add Systems of Meaning /blog/ with initial posts`
3. `feat(nav): add Blog link and homepage teaser`
4. `docs: add README notes for blog publishing workflow` (optional)

---

## Files to Create or Update

> Apply the blocks below exactly as named. If a target file already exists, **merge** keys/content—do not overwrite unrelated content.

````yaml name=_config.yml
title: "Steven Tomlinson"
description: "Solutions Architect • AI-Enabled Systems & Developer Platforms"
author: "Steven Tomlinson"
markdown: kramdown
theme: minima

plugins:
  - jekyll-seo-tag
  - jekyll-sitemap
  - jekyll-feed

permalink: /:categories/:year/:month/:day/:title/

nav:
  - title: "Home"
    url: "/"
  - title: "Blog"
    url: "/blog/"

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>{{ page.title }} | {{ site.title }}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  {% seo %}
  <link rel="stylesheet" href="{{ '/assets/css/style.css' | relative_url }}">
</head>
<body>
  <main class="container">
    <header>
      <h1><a href="{{ '/' | relative_url }}">{{ site.title }}</a></h1>
      <nav>
        <a href="{{ '/' | relative_url }}">Home</a>
        |
        <a href="{{ '/blog/' | relative_url }}">Blog</a>
      </nav>
    </header>

    <section>
      {{ content }}
    </section>

    <footer>
      <hr />
      <p>&copy; {{ site.time | date: "%Y" }} {{ site.author }}</p>
    </footer>
  </main>
</body>
</html>

---
layout: default
---
<article class="page">
  <h1>{{ page.title }}</h1>
  {{ content }}
</article>

---
layout: default
---
<article class="post">
  <h1>{{ page.title }}</h1>
  <p><em>{{ page.date | date: "%B %d, %Y" }}</em></p>
  {{ content }}
  <hr />
  <p><a href="{{ '/blog/' | relative_url }}">← Back to Blog</a></p>
</article>

body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height: 1.65; margin:0; background:#0b0c10; color:#c5c6c7; }
a { color:#66fcf1; text-decoration:none; }
a:hover { color:#45a29e; }
.container { max-width: 900px; margin: 2rem auto; padding: 1rem 2rem; }
h1,h2,h3 { color:#fff; }
header, footer { text-align:center; margin-bottom:1.5rem; }
hr { border: none; border-top:1px solid #333; margin:2rem 0; }

---
layout: page
title: "Systems of Meaning"
---

# Systems of Meaning
*Where technology, imagination, and independence converge.*

Welcome to the blog. Posts are grouped loosely into three pillars:
- **Code** – engineering notes and architectures
- **World** – narrative and metaverse transmissions
- **Self** – independence, focus, and creative discipline

## Latest Posts
{% for post in site.posts limit:10 %}
- [{{ post.title }}]({{ post.url }}) — *{{ post.date | date: "%b %d, %Y" }}*
{% endfor %}

---
layout: post
title: "Metaverse Standard Time: A Temporal Framework for the Open Metaverse"
tags: [code, world, lamina1, open-metaverse, standards]
---

# 🕰️ Metaverse Standard Time: A Temporal Framework for the Open Metaverse

In the physical world, time is fragmented—divided by zones and distorted by daylight saving.
In the metaverse, such fragmentation becomes a liability.

**Metaverse Standard Time (MST)** proposes a unified temporal layer for persistent, interoperable, creator-driven worlds—aligned with Neal Stephenson’s metaverse vision and Lamina1’s mission.

## Core Principles
- **Universal** (single reference, no DST)
- **Persistent** (reliable logging and governance)
- **Creator-centric** (simplifies scheduling across platforms)
- **Interoperable** (open-standards friendly)

*(Full white paper follows… replace with your finalized content as needed.)*

---
layout: post
title: "Welcome to Systems of Meaning"
tags: [self, intro, blog]
---

**Systems of Meaning** is my consolidated blog where code, story, and independence meet.

- **Code:** posts on verifiable systems, identity, and decentralized infra  
- **World:** transmissions from the Node_Zero / Whispering Code universe  
- **Self:** notes on focus, craft, and staying small with intent

Expect one post per week, rotating pillars, plus occasional hybrid essays.

Optional Homepage Teaser (apply only if safe)

If homepage is Markdown (index.md or README.md), append:

## Latest from the Blog
{% assign latest = site.posts | first %}
{% if latest %}
- [{{ latest.title }}]({{ latest.url }})  
  *{{ latest.date | date: "%B %d, %Y" }}*
{% endif %}

If homepage is HTML (index.html), inject under the main summary:

<!-- Latest from the Blog Teaser -->
<div class="blog-teaser">
  <h2>Latest from the Blog</h2>
  {% assign latest = site.posts | first %}
  {% if latest %}
    <p>
      <a href="{{ latest.url | relative_url }}">{{ latest.title }}</a><br>
      <em>{{ latest.date | date: "%B %d, %Y" }}</em>
    </p>
  {% endif %}
</div>


⸻

Post-PR Validation
	•	Confirm /blog/ lists both new posts.
	•	Confirm individual posts render with title and date.
	•	Confirm header nav “Blog” link appears and works.
	•	Confirm GitHub Pages build passes without plugin errors.
	•	Confirm sitemap and feed include blog URLs.

---

## 🧩 One-liner to run in Copilot Agent

After committing `COPILOT_TASK.md` to your repo, open the Copilot Agent for this repository and paste:

@copilot Open and execute COPILOT_TASK.md: create branch feature/blog-systems-of-meaning, apply all named file blocks exactly, merge configs non-destructively, commit per the strategy, and open a PR titled feat(blog): add Systems of Meaning blog section. Validate the build and include a checklist of the Acceptance Criteria in the PR body.


there's more detial below for reference.

````yaml name=_config.yml
title: "Steven Tomlinson"
description: "Solutions Architect • AI-Enabled Systems & Developer Platforms"
author: "Steven Tomlinson"
markdown: kramdown
theme: minima

plugins:
  - jekyll-seo-tag
  - jekyll-sitemap
  - jekyll-feed

permalink: /:categories/:year/:month/:day/:title/

nav:
  - title: "Home"
    url: "/"
  - title: "Blog"
    url: "/blog/"
````

---

```html name=_layouts/default.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>{{ page.title }} | {{ site.title }}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  {% seo %}
  <link rel="stylesheet" href="{{ '/assets/css/style.css' | relative_url }}">
</head>
<body>
  <main class="container">
    <header>
      <h1><a href="{{ '/' | relative_url }}">{{ site.title }}</a></h1>
      <nav>
        <a href="{{ '/' | relative_url }}">Home</a>
        |
        <a href="{{ '/blog/' | relative_url }}">Blog</a>
      </nav>
    </header>

    <section>
      {{ content }}
    </section>

    <footer>
      <hr />
      <p>&copy; {{ site.time | date: "%Y" }} {{ site.author }}</p>
    </footer>
  </main>
</body>
</html>
```

---

```html name=_layouts/page.html
---
layout: default
---
<article class="page">
  <h1>{{ page.title }}</h1>
  {{ content }}
</article>
```

---

```html name=_layouts/post.html
---
layout: default
---
<article class="post">
  <h1>{{ page.title }}</h1>
  <p><em>{{ page.date | date: "%B %d, %Y" }}</em></p>
  {{ content }}
  <hr />
  <p><a href="{{ '/blog/' | relative_url }}">← Back to Blog</a></p>
</article>
```

---

```css name=assets/css/style.css
body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height: 1.65; margin:0; background:#0b0c10; color:#c5c6c7; }
a { color:#66fcf1; text-decoration:none; }
a:hover { color:#45a29e; }
.container { max-width: 900px; margin: 2rem auto; padding: 1rem 2rem; }
h1,h2,h3 { color:#fff; }
header, footer { text-align:center; margin-bottom:1.5rem; }
hr { border: none; border-top:1px solid #333; margin:2rem 0; }
```

---

````markdown name=blog/index.md
---
layout: page
title: "Systems of Meaning"
---

# Systems of Meaning
*Where technology, imagination, and independence converge.*

Welcome to the blog. Posts are grouped loosely into three pillars:
- **Code** – engineering notes and architectures
- **World** – narrative and metaverse transmissions
- **Self** – independence, focus, and creative discipline

## Latest Posts
{% for post in site.posts limit:10 %}
- [{{ post.title }}]({{ post.url }}) — *{{ post.date | date: "%b %d, %Y" }}*
{% endfor %}
````

---

````markdown name=blog/_posts/2025-10-28-metaverse-standard-time.md
---
layout: post
title: "Metaverse Standard Time: A Temporal Framework for the Open Metaverse"
tags: [code, world, lamina1, open-metaverse, standards]
---

# 🕰️ Metaverse Standard Time: A Temporal Framework for the Open Metaverse

In the physical world, time is fragmented—divided by zones and distorted by daylight saving.
In the metaverse, such fragmentation becomes a liability.

**Metaverse Standard Time (MST)** proposes a unified temporal layer for persistent, interoperable, creator-driven worlds—aligned with Neal Stephenson’s metaverse vision and Lamina1’s mission.

## Core Principles
- **Universal** (single reference, no DST)
- **Persistent** (reliable logging and governance)
- **Creator-centric** (simplifies scheduling across platforms)
- **Interoperable** (open-standards friendly)

*(Full white paper follows… replace with your finalized content as needed.)*
````

---

````markdown name=blog/_posts/2025-10-28-welcome-to-systems-of-meaning.md
---
layout: post
title: "Welcome to Systems of Meaning"
tags: [self, intro, blog]
---

**Systems of Meaning** is my consolidated blog where code, story, and independence meet.

- **Code:** posts on verifiable systems, identity, and decentralized infra  
- **World:** transmissions from the Node_Zero / Whispering Code universe  
- **Self:** notes on focus, craft, and staying small with intent

Expect one post per week, rotating pillars, plus occasional hybrid essays.
````

---

### Homepage Teaser

For your homepage (either `index.md`, `index.html`, or `README.md`):

If you use Markdown:
````markdown name=index.md
## Latest from the Blog
{% assign latest = site.posts | first %}
{% if latest %}
- [{{ latest.title }}]({{ latest.url }})  
  *{{ latest.date | date: "%B %d, %Y" }}*
{% endif %}
````

If you use HTML, add under the main summary/hero section:
```html name=index.html
<!-- Latest from the Blog Teaser -->
<div class="blog-teaser">
  <h2>Latest from the Blog</h2>
  {% assign latest = site.posts | first %}
  {% if latest %}
    <p>
      <a href="{{ latest.url | relative_url }}">{{ latest.title }}</a><br>
      <em>{{ latest.date | date: "%B %d, %Y" }}</em>
    </p>
  {% endif %}
</div>
```

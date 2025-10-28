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

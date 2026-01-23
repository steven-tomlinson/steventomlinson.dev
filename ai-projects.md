---
layout: page
title: "Ongoing Projects & Research"
permalink: /ai-projects.html
---

## Overview

My AI-focused work emphasizes **architectural understanding** over tool fluency — exploring how generative AI, agent-based systems, and intelligent automation alter system design, governance, and long-term sustainability.

Rather than building consumer-facing demos, I focus on:

* Reference implementations that demonstrate architectural patterns
* Security and trust boundaries in AI-enabled systems
* Integration of AI components into enterprise architectures
* Practical application of formal AI education to real-world systems

---

## Active Projects

### AI Portfolio — Certification Labs & Research

**Repository:** [steven-tomlinson/ai-portfolio](https://github.com/steven-tomlinson/ai-portfolio)

**Status:** Active Development

A structured portfolio containing:

* **Certification Lab Projects** — Hands-on implementations from Google Cloud and Microsoft Azure AI certifications
* **Courseware & Artifacts** — Study materials, course notes, and lab exercises
* **Personal Experiments** — Testing AI concepts, libraries, and integration patterns
* **Learning Notes** — Observations on architectural implications of AI systems

**Technologies:**
* Azure AI Services and Azure OpenAI Service
* Azure Bot Service and Azure Functions
* HTML/CSS/JavaScript for portfolio presentation
* VS Code with GitHub Copilot

**Focus Areas:**
* AI agent architecture and orchestration
* Azure AI Foundry certification path
* Safe, secure implementation patterns
* Creating novel abstractions for complex system design

---

### Lockb0x Codex Forge — Digital Provenance System

**Repository:** [steven-tomlinson/lockbox-codex-forge](https://github.com/steven-tomlinson/lockbox-codex-forge)

**Status:** Production-Ready (Awaiting Marketplace Publication)

A Chrome Extension (Manifest V3) implementing the lockb0x protocol for creating secure, verifiable Codex Entries from web content or user-uploaded files.

**Key Features:**
* Complete lockb0x protocol implementation (UUID generation, SHA-256 hashing, ni-URI encoding, JSON canonicalization, ES256 signing)
* Zip archive workflow with dual-signature verification
* Google Drive integration for secure anchor storage
* Support for any file type (text, PDF, JSON, binary)
* Schema validation against lockb0x schema v0.0.2
* Encrypted zip archiving with verifiable provenance

**Technologies:**
* JavaScript (Manifest V3 Chrome Extension)
* Google Drive API and OAuth2 authentication
* Cryptographic primitives (SHA-256, ES256)
* JSON Web Keys (JWK) and JSON canonicalization (RFC 8785)

**Architectural Focus:**
* Trust boundaries and verifiable digital provenance
* Protocol-driven system design
* Secure credential handling and token management
* User-controlled data sovereignty

**Note:** AI-powered metadata generation features are referenced but deprioritized, as Chrome Built-In AI APIs are still experimental. Current implementation uses fallback text extraction.

**Roadmap:**
* Final release to Google Chrome Marketplace
* Fork for Microsoft Edge and OneDrive integration
* Enhanced testing infrastructure and integration tests

---

### Liquidity Dashboard — DeFi Analytics (Early Stage)

**Repository:** [steven-tomlinson/liquidity-dashboard-](https://github.com/steven-tomlinson/liquidity-dashboard-)

**Status:** Template/Early Development

A Python-based Streamlit application for decentralized finance analytics and liquidity monitoring.

**Technologies:**
* Python and Streamlit
* Data visualization and analytics

**Context:**
This project applies learnings from the Duke University DeFi specialization to practical financial data analysis and monitoring.

---

## Educational Foundation

All project work is grounded in formal education:

### Google Cloud — Generative AI Leader Specialization (2025)

Completed specialization covering:
* Organizational adoption of generative AI
* Agent-based system architecture
* Enterprise integration patterns
* Governance, risk, and value creation
* AI application development and transformation

---

## Architectural Principles

My AI and protocol work follows consistent principles:

* **Security First** — Never commit secrets, design with trust boundaries explicit
* **Verifiable Systems** — Cryptographic proofs over implicit trust
* **User Sovereignty** — Users control their data and credentials
* **Enterprise Integration** — Systems must integrate cleanly with existing enterprise architectures
* **Long-term Sustainability** — Solutions designed to evolve without rewrites

---

## Tools & Methodologies

### Development Environment
* VS Code with GitHub Copilot
* Azure services and Google Cloud Platform
* Chrome DevTools for extension development
* Git and GitHub for version control

### Architectural Approach
* Reference architectures over one-off solutions
* Explicit decision boundaries and failure modes
* Protocol-driven design where appropriate
* Test-driven development for critical paths

---

## Future Directions

Ongoing exploration includes:

* **Multi-agent orchestration** — How autonomous agents coordinate and maintain trust
* **Hybrid architecture patterns** — Integrating decentralized components into enterprise systems
* **AI governance frameworks** — Policy-driven systems for intelligent automation
* **Protocol evolution** — How protocol-backed systems maintain backward compatibility

---

## Code Quality & Best Practices

All projects emphasize:

* Clean, well-documented code
* Comprehensive testing where infrastructure exists
* Security-first design (no credentials in source control)
* Regular commits with meaningful messages
* Consistent use of templates and organizational patterns

---

<nav style="margin-top:3rem;">
  <ul style="list-style:none; padding:0; display:flex; justify-content:center; gap:2rem; flex-wrap:wrap;">
    <li><a href="/">Home</a></li>
    <li><a href="/continuing-education.html">Continuing Education</a></li>
    <li><a href="https://github.com/steven-tomlinson">GitHub</a></li>
  </ul>
</nav>

---

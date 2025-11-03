---
layout: page
title: "Steven B. Tomlinson"
---


<div style="text-align:center;">
  <img src="steven-tomlinson-profile.jpeg" alt="Steven B. Tomlinson profile picture" style="width:128px;height:128px;border-radius:50%;border:3px solid #23395d;box-shadow:0 0 32px 0 #0ff8,0 2px 8px #000a;object-fit:cover;margin:2rem auto 1.2rem auto;display:block;background:#222;">
  
  # Steven B. Tomlinson
  
  Solutions Architect | Full Stack Engineer | 15+ Years Experience
  
  <span style="font-size:1.1rem;color:#c5c6c7;">Las Vegas, NV</span>
  
  <nav>
    <ul style="list-style:none;padding:0;display:flex;justify-content:center;gap:2rem;">
      <li><a href="mailto:steven.tomlinson@gmail.com">Email</a></li>
      <li><a href="https://github.com/steven-tomlinson">GitHub</a></li>
      <li><a href="https://linkedin.com/in/pakana">LinkedIn</a></li>
      <li><a href="/blog/">Blog</a></li>
      <li><a href="Tomlinson_Steven_Enterprise_Architect_Resume" download>Resume PDF</a></li>
    </ul>
  </nav>
</div>


## Professional Summary
Architect and systems integrator with 15+ years of experience delivering custom enterprise, civic, healthcare, and financial solutions.<br/>
Expert in building applications, developer tools, and configuring, training, and deploying AI-assisted workflows.<br/>
Highly skilled in translating business needs into scalable, maintainable software architecture and systems.<br/>
Creator of the [lockb0x-protocol](https://www.ietf.org/archive/id/draft-tomlinson-lockb0x-00.html).<br/>
Creator of several Stellar Community Fund awarded open-source Razor/Blazor component libraries and frameworks.<br/>
Focused on identity, finance, and decentralized systems using the Stellar Development Foundation network and blockchain.<br/>
Recipient of more than $250K in Stellar Community Fund and Avalanche Foundation software development grants.

<!-- Latest from the Blog Teaser -->
<div class="blog-teaser" style="background:#16213e;padding:1rem 2rem;border-radius:1rem;margin:2rem 0;text-align:center;box-shadow:0 2px 16px #000a;">
  <h2 style="color:#fff;">Latest from the Blog</h2>
  {% assign latest = site.posts | first %}
  {% if latest %}
    <p>
      <a href="{{ latest.url }}" style="font-weight:bold;color:#66fcf1;">{{ latest.title }}</a><br>
      <em style="color:#c5c6c7;">{{ latest.date | date: "%B %d, %Y" }}</em>
    </p>
  {% endif %}
</div>


## Core Competencies
<ul style="background:#16213e;padding:1rem 2rem;border-radius:1rem;box-shadow:0 2px 16px #000a;">
  <li><strong>Solutions Architecture:</strong> Full-stack systems using .NET, Razor/Blazor, Azure, PostgreSQL, Web 1/2/3.</li>
  <li><strong>AI Integration:</strong> Custom LLM interfaces, semi-autonomous metaverse characters, local model deployments, prompt engineering.</li>
  <li><strong>Developer Tooling:</strong> Razor/Blazor components (Stellar Identity Framework), SDK and API development, original SOLIDProject.org setup guide.</li>
  <li><strong>Collaborative Engineering:</strong> Translating stakeholder needs into software architecture, systems, workflows, and user experiences.</li>
  <li><strong>Civic & Financial Tech:</strong> Blockchain identity, commitment disbursement, lien-release documentation, on-chain title perfection, compliance automation, and the <strong>Pakana.net</strong> UCC compliance platform.</li>
  <li><strong>Documentation & UX:</strong> Narrative onboarding flows, API/SDK guides, agent-based demos.</li>
</ul>
 
# Experience
<section id="experience">
    <h2>Experiences</h2>
    <article>
      <h3>Founder & Architect – <a href="https://github.com/lockb0x-llc" target="_blank" rel="noopener noreferrer">Lockb0x LLC</a> / <a href="https://pakana.net" target="_blank" rel="noopener noreferrer">Pakana</a> (Firm Solutions LLC) <span class="date-range">(2022–Present)</span></h3>
      <ul>
        <li>Published <a href="https://github.com/lockb0x-llc" target="_blank" rel="noopener noreferrer">Stellar Identity Framework</a> and Blazor component library to simplify blockchain and authentication integration.</li>
        <li>Designed protocol (<a href="https://www.ietf.org/archive/id/draft-tomlinson-lockb0x-00.html" target="_blank" rel="noopener noreferrer">lockb0x</a>) to classify and manage private on-chain digital assets, using hash identifiers and de-identified metadata with zk-proof rollups, under UCC Article 12 rules with .NET Razor and RAG tooling.</li>
        <li>Building a comprehensive compliance automation framework for the <strong>Pakana.net</strong> UCC compliance platform.</li>
      </ul>
    </article>

    <section id="projects">
      <h2>Open Source & Featured Projects</h2>
      <article>
        <h3>lockb0x Protocol</h3>
        <p>
          <strong>Creator & Architect</strong> — <a href="https://github.com/lockb0x-llc/lockb0x-protocol">lockb0x
            protocol</a><br>
          An open protocol for classifying, managing, and transferring private digital assets using hash identifiers and
          de-identified metadata with zk-proof rollups. Designed to comply with UCC Article 12 rules for digital assets,
          enabling secure on-chain representation of off-chain assets. Enables data sovereignty and privacy for the storage,
          validation, and retrieval of nearly any kind of data, anywhere.
        </p>
        <article>
          <h3>Pakana.net</h3>
          <p>
            <strong>Creator & Lead Architect</strong> — <a href="https://dev.pakana.net/">pakana.net</a><br>
            Blockchain-driven platform for payment and document processing using the Stellar Network and the custom
            IPNS/IFFS implementation of the lockb0x storage protocol. Pakana automates and secures regulated payment and
            escrow transactions, built with open-source SCF Awarded Projects: the Stellar Razor and Blazor Components and
            the Stellar Identity Framework.<br>
            <strong>Stellar Community Fund Award:</strong> $45,200 (<a
              href="https://communityfund.stellar.org/project/pakananet-ez8">SCF #21</a>)
          </p>
        </article>
    
        <article>
          <h3>Stellar Identity Framework</h3>
          <h3>Stellar Razor and Blazor Suite</h3>
          <p>
            <strong>Creator & Lead Developer</strong> — <a
              href="https://github.com/lockb0x-llc/Pakana-Stellar-Razor-Components">GitHub</a><br>
            DotNet Razor and Blazor UI Components and schema for Microsoft Identity, OAuth 2.0, OIDS 1.0, QR-Code MFA, and
            keypair abstraction. Enables rapid integration of Stellar blockchain identity and payments into .NET
            applications.<br>
            <strong>Stellar Community Fund Awards:</strong> $150,000 total (<a
              href="https://communityfund.stellar.org/project/stellar-razor-and-blazor-suite-biz">SCF #25, #27, #31</a>)
          </p>
        </article>
    
        <article>
          <h3>node_zero.xyz</h3>
          <p>
            <strong>Founder, Technical & Narrative Architect</strong><br>
            Creating a multi-platform metaverse narrative, integrating blockchain, AI, and immersive storytelling.
            Built an interoperable fiction ecosystem anchored by the Central Inquiry, (fictional) quantum-entangled
            blockchain mechanics, and decentralized archives (lockb0x). Designed transmedia publishing workflows
            across Bluesky, Lamina1, GitHub, and web platforms—blending AI-driven storytelling, NFT artifacts, and
            player interaction in a self-expanding, transmedia, interactive cyberpunk universe.
          </p>
        </article>
    </section>
  
   <article>
      <h3>Various Contract & Freelance Software Architect <span class="date-range">(2010–Present)</span></h3>
      <ul>
        <li>Led ETL, system and data migration, enterprise and systems design projects for diverse clients.</li>
        <li>Three Lock Box LLC (2018–2022): Migrated legacy LAMP stack to modern .NET cloud-native infrastructure with zero downtime; built reusable API components and documentation to accelerate new feature delivery; implemented identity, compliance, and distributed storage tools to align with organizational goals.</li>
        <li><a href="https://artesianspas.com" target="_blank" rel="noopener noreferrer">Artesian Spas</a> Manufacturing Production Systems Audit</li>
        <li><a href="https://www.caesars.com" target="_blank" rel="noopener noreferrer">Elevate Digital Caesars Entertainment</a> “Smart Cities” Prototype Kiosk Project.</li>
        <li><a href="https://www.alogent.com" target="_blank" rel="noopener noreferrer">Alogent</a> (formerly Bluepoint Solutions) – Core Banking System migration processes.</li>
        <li><a href="https://www.rtcsnv.com" target="_blank" rel="noopener noreferrer">Regional Transit Commission</a> – Prototype Bus Stop Inventory, Audit, Maintenance Application.</li>
        <li><strong><a href="https://www.optum.com" target="_blank" rel="noopener noreferrer">Optum Insight (United Healthcare)</a></strong> – Business Intelligence Architect/Senior Developer (4/2014–12/2014)<br>
          <ul>
            <li>Supported Planview Enterprise Application and Reporting Team for development, implementation, and administration.</li>
            <li>Managed onshore and offshore development teams; participated in post-merger BI strategy and planning.</li>
            <li>Integrated Planview, SSRS, and SSIS operations into unified interfaces; maintained data integrity and secure development practices.</li>
            <li>Designed, developed, and documented complex SSIS ETL packages using C#, PL/SQL, and T-SQL across large Oracle and MSSQL datasets.</li>
          </ul>
        </li>
        <li><strong><a href="https://www.duke-energy.com" target="_blank" rel="noopener noreferrer">Duke Energy</a></strong> – ETL Developer/Application Developer (12/2013–5/2014)<br>
          <ul>
            <li>Supported Nuclear IT Team during merger of legacy information systems (Progress Energy acquisition).</li>
            <li>Participated in asset rationalization, legacy data preservation, and post-merger application rebuilds.</li>
            <li>Designed, developed, and documented complex SSIS ETL packages using C#, PL/SQL, and T-SQL across Oracle and MSSQL databases.</li>
          </ul>
        </li>
        <li><strong><a href="https://www.cpicardgroup.com" target="_blank" rel="noopener noreferrer">CPI Card Group</a></strong> – eServices Development Team Lead (1/2011–11/2013)<br>
          <ul>
            <li>Lead developer and mentor for distributed team; business analyst for UI/system requirements.</li>
            <li>Architected/documented new features, developed/maintained social platform integrations (Facebook, etc).</li>
            <li>Wrote technical requirements for third-party development; documented systems, backup, and DR procedures.</li>
            <li>Developed complex ETL packages for data center migrations.</li>
          </ul>
        </li>
        <li><strong><a href="https://www.aecom.com" target="_blank" rel="noopener noreferrer">URS Corporation (AECOM/EG&G)</a></strong> – Systems Analyst III/DBA (8/2009–9/2011)<br>
          <ul>
            <li>Business analyst and developer in high-security environments; integrated Deltek Costpoint with Hyperion, Pentagon2000, ADP.</li>
            <li>Procured, installed, and maintained SQL Server 2008/2000; migrated databases and DTS packages.</li>
            <li>Developed UASOCS Training Database and WinForm UI with VB.NET and SQL Server CE.</li>
          </ul>
        </li>
        <li><strong>Other Relevant Experience</strong> (2000–2011)<br>
          <ul>
            <li><a href="https://www.roberthalf.com" target="_blank" rel="noopener noreferrer">Robert Half Technologies</a> – Software/DB Consultant: EG&G/URS (DBA, ETL, payroll/timekeeping), <a href="https://www.themresort.com" target="_blank" rel="noopener noreferrer">The M Resort</a> (Rewards and Wait List Management), <a href="https://nsc.edu" target="_blank" rel="noopener noreferrer">Nevada State College</a> (Enrollment ETL/Reporting).</li>
            <li>On The Web Marketing Group / FurnitureExpression.com – Senior ASP.NET Developer (2008–2009).</li>
            <li>Southern Swell Bar B Q – Owner (2006–2008).</li>
            <li>Red Ball Consulting – ETL/Biztalk Developer for <a href="https://www.hmsa.com" target="_blank" rel="noopener noreferrer">Blue Cross Blue Shield of Hawaii</a> (AS400 to Windows migration, 2005–2006).</li>
            <li><a href="https://www.meleassociates.com" target="_blank" rel="noopener noreferrer">MELE Associates</a> / Pacific Telehealth and Technology Hui – Systems Analyst (2002–2005): Tripler Army Medical Center, HI.</li>
            <li><a href="https://cca.hawaii.gov" target="_blank" rel="noopener noreferrer">State of Hawaii, Dept. of Commerce & Consumer Affairs</a> – Forensic Investigator III (2001–2002): Developed business filing/entity document management system.</li>
            <li><a href="https://tghawaii.com" target="_blank" rel="noopener noreferrer">Title Guaranty of Hawaii</a> – Designed/implemented Document Scanning and Management System for statewide property title records (2000–2001).</li>
          </ul>
        </li>
      </ul>
    </article>
  </section>


## Education & Certifications
<section id="education" style="background:#16213e;padding:1rem 2rem;border-radius:1rem;box-shadow:0 2px 16px #000a;margin-bottom:2rem;">
  <h2 style="color:#fff;">Education & Certifications</h2>
  <ul>
    <li>Microsoft Certified Professional (MCP)</li>
    <li>Duke University – DeFi Specialization</li>
    <li>University of Illinois – Financial Analysis Specialization</li>
    <li>Various coursework across diverse subjects from finance to computer science, robotics, and artificial intelligence.</li>
    <li>United States Navy Veteran</li>
  </ul>
</section>


## Contact
<section id="contact" style="background:#16213e;padding:1rem 2rem;border-radius:1rem;box-shadow:0 2px 16px #000a;margin-bottom:2rem;">
  <h2 style="color:#fff;">Contact</h2>
  <p>Email: <a href="mailto:steven.tomlinson@gmail.com">steven.tomlinson@gmail.com</a></p>
  <p>Website: <a href="https://steventomlinson.dev">steventomlinson.dev</a></p>
  <p>GitHub: <a href="https://github.com/steven-tomlinson">steven-tomlinson</a></p>
  <p>LinkedIn: <a href="https://linkedin.com/in/pakana">linkedin.com/in/pakana</a></p>
</section>

#!/usr/bin/env node
/**
 * Stellar MCP Server
 *
 * Provides AI agent access to:
 *  - Stellar Network & Horizon API documentation
 *  - Soroban smart-contract SDK documentation
 *  - GitHub release notes for key Stellar repositories
 *  - Community content: Reddit r/stellar, SCF announcements
 *  - Curated best practices from authoritative sources
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from "node-fetch";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STELLAR_DOCS_BASE = "https://developers.stellar.org";
const STELLAR_DOCS_API = "https://developers.stellar.org/api";
const HORIZON_DOCS_BASE = "https://developers.stellar.org/docs/data/horizon";
const SOROBAN_DOCS_BASE = "https://developers.stellar.org/docs/build/smart-contracts";

const GITHUB_API = "https://api.github.com";
const STELLAR_REPOS = [
  { owner: "stellar", repo: "stellar-core", label: "Stellar Core" },
  { owner: "stellar", repo: "js-stellar-sdk", label: "JavaScript Stellar SDK" },
  { owner: "stellar", repo: "js-stellar-base", label: "JavaScript Stellar Base" },
  { owner: "stellar", repo: "py-stellar-base", label: "Python Stellar SDK" },
  { owner: "stellar", repo: "java-stellar-sdk", label: "Java Stellar SDK" },
  { owner: "stellar", repo: "rs-soroban-sdk", label: "Rust Soroban SDK" },
  { owner: "stellar", repo: "soroban-tools", label: "Soroban Tools (Stellar CLI)" },
  { owner: "stellar", repo: "stellar-rpc", label: "Stellar RPC (Soroban RPC)" },
  { owner: "stellar", repo: "stellar-horizon", label: "Horizon" },
];

const REDDIT_BASE = "https://www.reddit.com";

const USER_AGENT =
  process.env.STELLAR_MCP_USER_AGENT ??
  "StellarMCPServer/1.0 (Educational tool; contact: steventomlinson.dev)";

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

async function fetchText(url: string, headers: Record<string, string> = {}): Promise<string> {
  const resp = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, ...headers },
  });
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} fetching ${url}`);
  }
  return resp.text();
}

async function fetchJson<T = unknown>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const resp = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
      ...headers,
    },
  });
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} fetching ${url}`);
  }
  return resp.json() as Promise<T>;
}

/** Strip HTML tags to plain text (simple approach, no dependencies). */
function stripHtml(html: string): string {
  // This is MCP server output consumed by AI agents — never rendered in browsers.
  // Decode HTML entities first so encoded tags (e.g. &lt;script&gt;) are also stripped.
  // Entity decode order: specific entities before &amp; to avoid double-decode.
  let text = html
    .replace(/&(#39|apos);/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

  // Remove <script>...</script> and <style>...</style> blocks including their content.
  // [^>]* matches opening-tag attributes; applied before stripping remaining tags.
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/gi, "");
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/gi, "");

  // Remove all remaining complete HTML tags, then any stray '<' characters.
  // After these two replacements, no '<' can remain, so no HTML injection is possible.
  text = text.replace(/<[^>]+>/g, " ").replace(/</g, " ");

  return text.replace(/\s{2,}/g, " ").trim();
}

/** Truncate text to a max length with an ellipsis. */
function truncate(text: string, max = 4000): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + "\n\n[… truncated for brevity …]";
}

// ---------------------------------------------------------------------------
// GitHub types (minimal)
// ---------------------------------------------------------------------------

interface GhRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body: string;
  prerelease: boolean;
}

interface GhSearchResult {
  total_count: number;
  items: Array<{ path: string; html_url: string; repository: { full_name: string } }>;
}

// ---------------------------------------------------------------------------
// Reddit types (minimal)
// ---------------------------------------------------------------------------

interface RedditPost {
  data: {
    title: string;
    author: string;
    score: number;
    url: string;
    selftext: string;
    created_utc: number;
    permalink: string;
    num_comments: number;
  };
}

interface RedditListing {
  data: {
    children: RedditPost[];
  };
}

// ---------------------------------------------------------------------------
// Server setup
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "stellar-mcp-server",
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// Tool: fetch_stellar_docs
// ---------------------------------------------------------------------------

server.tool(
  "fetch_stellar_docs",
  "Fetch a specific page from the Stellar developer documentation at developers.stellar.org. " +
    "Returns the page content as plain text. Use the 'path' parameter to specify the documentation " +
    "section (e.g. '/docs/build/smart-contracts/getting-started', '/docs/data/horizon', " +
    "'/docs/learn/fundamentals').",
  {
    path: z
      .string()
      .describe(
        "URL path relative to developers.stellar.org, e.g. '/docs/learn/fundamentals/stellar-data-structures/accounts'"
      ),
  },
  async ({ path }) => {
    const url = `${STELLAR_DOCS_BASE}${path.startsWith("/") ? path : "/" + path}`;
    try {
      const html = await fetchText(url);
      const text = stripHtml(html);
      return {
        content: [
          {
            type: "text",
            text: `# Stellar Documentation: ${url}\n\n${truncate(text)}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching ${url}: ${String(err)}\n\nTip: Valid paths include /docs/learn/fundamentals, /docs/build/smart-contracts, /docs/data/horizon`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: fetch_horizon_reference
// ---------------------------------------------------------------------------

server.tool(
  "fetch_horizon_reference",
  "Fetch the Horizon REST API reference documentation. Horizon is the client-facing API layer " +
    "for Stellar Network. Optionally specify a sub-path to navigate directly to a resource " +
    "(e.g. '/accounts', '/transactions', '/operations', '/effects', '/offers', '/orderbook').",
  {
    resource: z
      .string()
      .optional()
      .describe(
        "Horizon resource path (optional), e.g. 'accounts', 'transactions', 'operations', 'ledgers', 'effects'"
      ),
  },
  async ({ resource }) => {
    const subpath = resource ? `/${resource.replace(/^\//, "")}` : "";
    const url = `${HORIZON_DOCS_BASE}${subpath}`;
    try {
      const html = await fetchText(url);
      const text = stripHtml(html);
      return {
        content: [
          {
            type: "text",
            text: `# Horizon API Reference: ${url}\n\n${truncate(text)}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching ${url}: ${String(err)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: fetch_soroban_docs
// ---------------------------------------------------------------------------

server.tool(
  "fetch_soroban_docs",
  "Fetch Soroban smart-contract documentation from the Stellar developer portal. " +
    "Soroban is Stellar's smart-contract platform. Optionally specify a sub-section " +
    "(e.g. 'getting-started', 'guides', 'reference', 'reference/rust-sdk').",
  {
    section: z
      .string()
      .optional()
      .describe(
        "Soroban documentation sub-section (optional), e.g. 'getting-started', 'guides', 'reference'"
      ),
  },
  async ({ section }) => {
    const subpath = section ? `/${section.replace(/^\//, "")}` : "";
    const url = `${SOROBAN_DOCS_BASE}${subpath}`;
    try {
      const html = await fetchText(url);
      const text = stripHtml(html);
      return {
        content: [
          {
            type: "text",
            text: `# Soroban Documentation: ${url}\n\n${truncate(text)}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching ${url}: ${String(err)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: get_stellar_releases
// ---------------------------------------------------------------------------

server.tool(
  "get_stellar_releases",
  "Get the latest GitHub release notes for Stellar Network repositories. " +
    "Includes Stellar Core, Horizon, JavaScript/Python/Java/Rust SDKs, Soroban Tools (Stellar CLI), " +
    "and Stellar RPC. Use 'repo' to filter to a specific repository.",
  {
    repo: z
      .enum([
        "stellar-core",
        "js-stellar-sdk",
        "js-stellar-base",
        "py-stellar-base",
        "java-stellar-sdk",
        "rs-soroban-sdk",
        "soroban-tools",
        "stellar-rpc",
        "stellar-horizon",
        "all",
      ])
      .default("all")
      .describe("Repository to fetch releases for, or 'all' for a summary of all repos"),
    count: z
      .number()
      .int()
      .min(1)
      .max(10)
      .default(3)
      .describe("Number of recent releases to retrieve per repository (1-10)"),
  },
  async ({ repo, count }) => {
    const repos =
      repo === "all"
        ? STELLAR_REPOS
        : STELLAR_REPOS.filter((r) => r.repo === repo);

    if (repos.length === 0) {
      return {
        content: [{ type: "text", text: `Unknown repository: ${repo}` }],
        isError: true,
      };
    }

    const results: string[] = [];

    for (const { owner, repo: repoName, label } of repos) {
      try {
        const releases = await fetchJson<GhRelease[]>(
          `${GITHUB_API}/repos/${owner}/${repoName}/releases?per_page=${count}`,
          { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }
        );

        if (releases.length === 0) {
          results.push(`## ${label} (${owner}/${repoName})\nNo releases found.\n`);
          continue;
        }

        const section = releases
          .map((r) => {
            const date = r.published_at ? r.published_at.slice(0, 10) : "unknown date";
            const body = truncate(r.body ?? "(no release notes)", 800);
            return `### ${r.name || r.tag_name} (${date})${r.prerelease ? " [pre-release]" : ""}\n${r.html_url}\n\n${body}`;
          })
          .join("\n\n---\n\n");

        results.push(`## ${label} (${owner}/${repoName})\n\n${section}`);
      } catch (err) {
        results.push(`## ${label} (${owner}/${repoName})\nError: ${String(err)}`);
      }
    }

    return {
      content: [
        {
          type: "text",
          text: `# Stellar Release Notes\n\n${results.join("\n\n---\n\n")}`,
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: get_community_posts
// ---------------------------------------------------------------------------

server.tool(
  "get_community_posts",
  "Fetch recent posts from the Stellar community on Reddit (r/stellar or r/soroban). " +
    "Returns post titles, scores, links, and summaries. Useful for discovering the latest " +
    "community discussions, updates, and questions.",
  {
    subreddit: z
      .enum(["stellar", "soroban"])
      .default("stellar")
      .describe("Subreddit to fetch posts from"),
    sort: z
      .enum(["hot", "new", "top", "rising"])
      .default("hot")
      .describe("Sort order for posts"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(25)
      .default(10)
      .describe("Number of posts to return (1-25)"),
    timeframe: z
      .enum(["hour", "day", "week", "month", "year", "all"])
      .default("week")
      .describe("Timeframe for 'top' sort (ignored for other sorts)"),
  },
  async ({ subreddit, sort, limit, timeframe }) => {
    const params = new URLSearchParams({
      limit: String(limit),
      raw_json: "1",
    });
    if (sort === "top") {
      params.set("t", timeframe);
    }
    const url = `${REDDIT_BASE}/r/${subreddit}/${sort}.json?${params}`;

    try {
      const listing = await fetchJson<RedditListing>(url);
      const posts = listing.data.children;

      if (posts.length === 0) {
        return {
          content: [{ type: "text", text: `No posts found in r/${subreddit}.` }],
        };
      }

      const lines = posts.map((p) => {
        const { title, author, score, url: postUrl, selftext, created_utc, permalink, num_comments } =
          p.data;
        const date = new Date(created_utc * 1000).toISOString().slice(0, 10);
        const summary = selftext ? truncate(selftext, 300) : "(link post — no text body)";
        return [
          `### ${title}`,
          `- **Author:** u/${author}  **Score:** ${score}  **Comments:** ${num_comments}  **Date:** ${date}`,
          `- **Reddit:** https://reddit.com${permalink}`,
          postUrl !== `https://reddit.com${permalink}` ? `- **Link:** ${postUrl}` : "",
          summary !== "(link post — no text body)" ? `\n${summary}` : "",
        ]
          .filter(Boolean)
          .join("\n");
      });

      return {
        content: [
          {
            type: "text",
            text: `# r/${subreddit} — ${sort.toUpperCase()} posts\n\n${lines.join("\n\n---\n\n")}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching r/${subreddit}: ${String(err)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: get_scf_announcements
// ---------------------------------------------------------------------------

server.tool(
  "get_scf_announcements",
  "Fetch recent Stellar Community Fund (SCF) announcements and updates. " +
    "Returns posts from the official SCF subreddit (r/StellarCommunityFund) and the " +
    "Stellar Development Foundation blog. The SCF funds projects building on Stellar.",
  {
    limit: z
      .number()
      .int()
      .min(1)
      .max(25)
      .default(10)
      .describe("Number of posts to return"),
    sort: z
      .enum(["new", "hot", "top"])
      .default("new")
      .describe("Sort order"),
  },
  async ({ limit, sort }) => {
    const results: string[] = [];

    // SCF subreddit
    try {
      const params = new URLSearchParams({ limit: String(limit), raw_json: "1" });
      const listing = await fetchJson<RedditListing>(
        `${REDDIT_BASE}/r/StellarCommunityFund/${sort}.json?${params}`
      );
      const posts = listing.data.children;
      if (posts.length > 0) {
        const lines = posts.map((p) => {
          const { title, author, score, created_utc, permalink, selftext } = p.data;
          const date = new Date(created_utc * 1000).toISOString().slice(0, 10);
          const body = selftext ? `\n${truncate(selftext, 400)}` : "";
          return `### ${title}\n- **u/${author}** | Score: ${score} | ${date}\n- https://reddit.com${permalink}${body}`;
        });
        results.push(`## SCF Subreddit (r/StellarCommunityFund)\n\n${lines.join("\n\n---\n\n")}`);
      }
    } catch (err) {
      results.push(`## SCF Subreddit\nError: ${String(err)}`);
    }

    // SDF blog via Reddit mirror / direct
    try {
      const params = new URLSearchParams({ limit: String(limit), raw_json: "1" });
      const listing = await fetchJson<RedditListing>(
        `${REDDIT_BASE}/r/stellar/search.json?q=SCF+OR+"community+fund"&restrict_sr=1&sort=${sort}&${params}`
      );
      const posts = listing.data.children;
      if (posts.length > 0) {
        const lines = posts.slice(0, limit).map((p) => {
          const { title, author, score, created_utc, permalink } = p.data;
          const date = new Date(created_utc * 1000).toISOString().slice(0, 10);
          return `### ${title}\n- **u/${author}** | Score: ${score} | ${date}\n- https://reddit.com${permalink}`;
        });
        results.push(
          `## SCF Mentions in r/stellar\n\n${lines.join("\n\n---\n\n")}`
        );
      }
    } catch (err) {
      results.push(`## SCF Mentions in r/stellar\nError: ${String(err)}`);
    }

    return {
      content: [
        {
          type: "text",
          text: results.length > 0
            ? `# Stellar Community Fund (SCF) Announcements\n\n${results.join("\n\n---\n\n")}`
            : "No SCF announcements found.",
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: search_stellar_github
// ---------------------------------------------------------------------------

server.tool(
  "search_stellar_github",
  "Search GitHub for code, issues, pull requests, or discussions across Stellar " +
    "organisation repositories. Useful for finding examples, tracking issues, and " +
    "discovering how Soroban/Horizon features are used in practice.",
  {
    query: z.string().describe("Search query string (GitHub search syntax supported)"),
    type: z
      .enum(["code", "issues", "repositories"])
      .default("code")
      .describe("Type of GitHub search to perform"),
    repo_filter: z
      .string()
      .optional()
      .describe(
        "Restrict search to a specific stellar/ repo, e.g. 'rs-soroban-sdk' (optional)"
      ),
  },
  async ({ query, type, repo_filter }) => {
    const orgFilter = repo_filter
      ? `repo:stellar/${repo_filter}`
      : "org:stellar";
    const fullQuery = `${query} ${orgFilter}`;
    const url = `${GITHUB_API}/search/${type}?q=${encodeURIComponent(fullQuery)}&per_page=10`;

    try {
      const result = await fetchJson<GhSearchResult>(url, {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      });
      const items = result.items.slice(0, 10);
      const lines = items.map((item, i) => {
        const repoName = "repository" in item ? item.repository?.full_name : "";
        return `${i + 1}. **${item.path ?? "(no path)"}** [${repoName}]\n   ${item.html_url}`;
      });

      return {
        content: [
          {
            type: "text",
            text:
              `# GitHub Search: "${query}" (${type})\n` +
              `Total results: ${result.total_count}\n\n` +
              (lines.length > 0 ? lines.join("\n\n") : "No results found."),
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching GitHub: ${String(err)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: get_best_practices
// ---------------------------------------------------------------------------

server.tool(
  "get_best_practices",
  "Return curated Stellar/Soroban best practices, security guidelines, and architecture " +
    "recommendations drawn from official Stellar documentation, SDK READMEs, and the " +
    "Stellar Development Foundation engineering blog.",
  {
    topic: z
      .enum([
        "soroban-contracts",
        "horizon-integration",
        "transaction-submission",
        "account-management",
        "asset-management",
        "security",
        "testing",
        "network-passphrase",
        "fee-management",
        "all",
      ])
      .default("all")
      .describe("Topic area to retrieve best practices for"),
  },
  async ({ topic }) => {
    const practices: Record<string, string> = {
      "soroban-contracts": `## Soroban Smart Contract Best Practices

1. **Use \`contracttype\` macro** for custom types to ensure ABI compatibility and client-side type generation.
2. **Minimise storage reads/writes** — storage ops are metered; cache values in local variables within a single invocation.
3. **Prefer \`Ledger::get_or_default\`** over explicit exists-checks to reduce instruction cost.
4. **Use \`panic!\` sparingly** — prefer \`Result<T, E>\` returns so callers can handle errors gracefully.
5. **Avoid \`std::collections\`** — use Soroban's \`Map\`, \`Vec\`, and \`Bytes\` types for storage-compatible serialisation.
6. **Increment version numbers** when upgrading contract WASM to ensure deterministic replay.
7. **Test with \`soroban_sdk::testutils\`** — mock environment lets you unit-test without a live network.
8. **Run \`stellar contract build --release\`** for production; debug builds are unoptimised and expensive.
9. **Audit authorisation patterns** — ensure \`require_auth\` and \`require_auth_for_args\` cover all privileged paths.
10. **Check resource limits** early: instructions, memory, events, ledger entries all have per-invocation limits.

References:
- https://developers.stellar.org/docs/build/smart-contracts/getting-started
- https://developers.stellar.org/docs/build/smart-contracts/guides
- https://github.com/stellar/rs-soroban-sdk`,

      "horizon-integration": `## Horizon API Integration Best Practices

1. **Use official SDKs** (js-stellar-sdk, py-stellar-base, java-stellar-sdk) rather than raw HTTP to benefit from built-in retry, stream, and XDR handling.
2. **Prefer streaming endpoints** (\`cursor=now\`) for real-time event processing over polling.
3. **Paginate with cursor tokens** rather than offset pagination to avoid missed/duplicated records.
4. **Respect rate limits** — SDF-hosted Horizon is free but rate-limited; run your own instance for production.
5. **Use \`fee_bump\` transactions** to sponsor fees on behalf of users (feeless UX patterns).
6. **Set realistic \`max_fee\`** — use \`/fee_stats\` endpoint to pick an appropriate fee before submitting.
7. **Handle transaction failures** by checking \`extras.result_codes\` in the Horizon error response.
8. **Pin the network passphrase** in your SDK config — swapping between Testnet and Mainnet is a common mistake.
9. **Cache ledger-level data** (account sequences, fee stats) locally with a short TTL to reduce Horizon load.
10. **Use Stellar Expert** (stellar.expert) for human-readable transaction forensics during debugging.

References:
- https://developers.stellar.org/docs/data/horizon
- https://developers.stellar.org/docs/data/horizon/api-reference`,

      "transaction-submission": `## Transaction Submission Best Practices

1. **Fetch the latest sequence number** immediately before building the transaction to avoid sequence conflicts.
2. **Set \`timebounds\`** (min/max time) on every transaction to prevent indefinite validity windows.
3. **Use \`fee_bump\`** when the inner transaction signer has insufficient XLM for fees.
4. **Simulate first for Soroban** — always call \`simulateTransaction\` (via Stellar RPC) before submitting a Soroban operation to get the correct resource footprint and fee.
5. **Submit with retry + backoff** — network congestion may require re-submission; check Horizon's \`tx_bad_seq\` vs \`tx_too_late\` error codes to decide whether to resequence.
6. **Watch for \`RESULT_CODES\` not \`HTTP status\`** — a 400 from Horizon carries a structured error with the Stellar operation result code.
7. **Avoid manual XDR** — let the SDK construct XDR to prevent serialisation bugs.
8. **Store the transaction hash** before submitting so you can look it up even if the response is lost.

References:
- https://developers.stellar.org/docs/learn/encyclopedia/transactions-specialized/fee-bump-transactions
- https://developers.stellar.org/docs/data/rpc/api-reference/methods/simulateTransaction`,

      "account-management": `## Stellar Account Management Best Practices

1. **Fund with \`createAccount\` operation** (minimum 1 XLM base reserve + per-entry reserves).
2. **Use multi-sig** for custodial accounts — set a high master weight threshold and add co-signers.
3. **Set home domain** (\`setOptions\`) and publish a \`stellar.toml\` for wallet / exchange discoverability.
4. **Track sequence numbers** carefully in concurrent environments — use a queue or lock to serialise submissions from a single account.
5. **Merge accounts** when decommissioning to recover the base reserve XLM.
6. **Never reuse keypairs** across networks — Testnet and Mainnet share XDR format but not state.
7. **Use muxed accounts (M-addresses)** for exchange sub-accounts to avoid creating millions of accounts on-chain.

References:
- https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/accounts
- https://developers.stellar.org/docs/learn/encyclopedia/security/signatures-multisig`,

      "asset-management": `## Stellar Asset Management Best Practices

1. **Publish \`stellar.toml\`** at \`https://<your-domain>/.well-known/stellar.toml\` with full \`[[CURRENCIES]]\` metadata.
2. **Set asset home domain** via \`setOptions\` on the issuing account to enable automatic toml lookup.
3. **Use a separate distribution account** — never operate the issuing account for day-to-day transfers.
4. **Lock the issuing account** (set master weight to 0 after issuance) for fixed-supply tokens.
5. **Require trustlines** (AUTHORIZATION_REQUIRED flag) for regulated assets (e.g. security tokens).
6. **Use AMM liquidity pools** for on-chain market-making rather than managing individual offers.
7. **Monitor for unauthorized trustlines** via streaming Horizon operations on the issuing account.

References:
- https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/assets
- https://developers.stellar.org/docs/learn/encyclopedia/sdex/liquidity-on-stellar-sdex-liquidity-pools`,

      security: `## Stellar / Soroban Security Best Practices

1. **Never hardcode secret keys** — use environment variables, HSMs, or a secrets manager.
2. **Validate all inputs** in smart contracts before performing any state changes.
3. **Use \`require_auth\` for every privileged operation** in Soroban contracts; missing auth checks are a critical vulnerability.
4. **Check integer overflow** — Soroban's \`i128\`/\`u128\` are bounded; use checked arithmetic or rely on Rust's overflow semantics in debug mode.
5. **Minimise attack surface** — keep contracts small and well-scoped; split concerns across multiple contracts if needed.
6. **Use time-locks for high-value operations** — require a delay between initiating and completing privileged actions.
7. **Audit before mainnet** — engage a third-party auditor; consider the Stellar Bug Bounty Programme (https://hackerone.com/stellar).
8. **Enable CLAWBACK on regulated assets** to comply with legal requirements around asset recovery.
9. **Test edge cases** — zero amounts, maximum values, empty inputs, re-entrancy (Soroban disallows re-entrant calls by design).
10. **Monitor transactions** post-deployment via streaming Horizon or an alerting service.

References:
- https://developers.stellar.org/docs/learn/encyclopedia/security
- https://hackerone.com/stellar`,

      testing: `## Stellar / Soroban Testing Best Practices

1. **Unit-test contracts with \`soroban_sdk::testutils::Env\`** — no network required, fast feedback.
2. **Use Testnet** for integration tests — fund test accounts from Friendbot (\`https://friendbot.stellar.org/?addr=<pubkey>\`).
3. **Use Stellar Futurenet** for testing bleeding-edge protocol features before Testnet adoption.
4. **Snapshot contract state** in tests and assert invariants after each operation.
5. **Fuzz-test contract entry points** with \`cargo-fuzz\` to discover unexpected panics.
6. **Test fee estimation** — use \`simulateTransaction\` (Soroban RPC) in tests to catch footprint regressions.
7. **Write integration tests** that cover the full SDK → Horizon/RPC → contract flow.
8. **Use the Stellar Laboratory** (lab.stellar.org) for manual exploratory testing.

References:
- https://developers.stellar.org/docs/build/smart-contracts/guides/testing
- https://developers.stellar.org/docs/learn/fundamentals/networks`,

      "network-passphrase": `## Network Passphrase Reference

Stellar uses a network passphrase to distinguish between networks and prevent cross-network replay attacks.

| Network   | Passphrase |
|-----------|------------|
| Mainnet (Public) | \`Public Global Stellar Network ; September 2015\` |
| Testnet | \`Test SDF Network ; September 2015\` |
| Futurenet | \`Test SDF Future Network ; October 2022\` |
| Localnet (default) | \`Standalone Network ; February 2017\` |

**Rules:**
- Always pin the passphrase in your SDK config; a wrong passphrase produces a valid-looking but unbroadcastable transaction.
- Transactions signed on one network are invalid on all others.
- Custom networks (e.g. private Quickstart) use their own passphrase specified at startup.

References:
- https://developers.stellar.org/docs/learn/fundamentals/networks`,

      "fee-management": `## Stellar Fee Management Best Practices

1. **Query \`/fee_stats\`** from Horizon before submitting to choose an appropriate base fee.
2. **Use \`fee_bump\`** transactions to allow a sponsor account to pay fees, enabling fee-free UX for end-users.
3. **For Soroban**, use \`simulateTransaction\` to retrieve the recommended \`sorobanData\` (resource fee + inclusion fee); do not guess fees manually.
4. **Surge pricing**: Stellar uses a surge-pricing model during congestion. Setting fee too low risks inclusion failure; consider multiplying the recommended fee by 1.5× during peak periods.
5. **Track \`min_inclusion_fee\`** returned by Stellar RPC's \`getFeeStats\` for Soroban transactions.
6. **Reserve management**: Each account entry and trustline requires a base reserve (currently 0.5 XLM each) — factor this into onboarding flows.

References:
- https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering
- https://developers.stellar.org/docs/data/rpc/api-reference/methods/getFeeStats`,
    };

    if (topic === "all") {
      const allTopics = Object.entries(practices)
        .map(([key, content]) => `${content}`)
        .join("\n\n---\n\n");
      return {
        content: [
          {
            type: "text",
            text: `# Stellar & Soroban Best Practices\n\n${allTopics}`,
          },
        ],
      };
    }

    const content = practices[topic];
    if (!content) {
      return {
        content: [{ type: "text", text: `Unknown topic: ${topic}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: content }],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: get_stellar_network_status
// ---------------------------------------------------------------------------

server.tool(
  "get_stellar_network_status",
  "Fetch the current status of Stellar Network from the Stellar Status page and " +
    "latest ledger data from Horizon. Returns network health, latest ledger number, " +
    "and current base fee / reserve information.",
  {},
  async () => {
    const results: string[] = [];

    // Horizon root (public network)
    try {
      const root = await fetchJson<{
        horizon_version: string;
        core_version: string;
        current_protocol_version: number;
        network_passphrase: string;
        history_latest_ledger: number;
        history_elder_ledger: number;
        base_reserve_in_stroops: number;
        base_fee_in_stroops: number;
      }>("https://horizon.stellar.org/");
      results.push(
        `## Mainnet (Horizon)\n` +
          `- **Horizon version:** ${root.horizon_version}\n` +
          `- **Stellar Core version:** ${root.core_version}\n` +
          `- **Protocol version:** ${root.current_protocol_version}\n` +
          `- **Network passphrase:** \`${root.network_passphrase}\`\n` +
          `- **Latest ledger:** ${root.history_latest_ledger}\n` +
          `- **Base fee:** ${root.base_fee_in_stroops} stroops (${root.base_fee_in_stroops / 1e7} XLM)\n` +
          `- **Base reserve:** ${root.base_reserve_in_stroops} stroops (${root.base_reserve_in_stroops / 1e7} XLM)`
      );
    } catch (err) {
      results.push(`## Mainnet (Horizon)\nError: ${String(err)}`);
    }

    // Testnet
    try {
      const root = await fetchJson<{
        horizon_version: string;
        core_version: string;
        current_protocol_version: number;
        history_latest_ledger: number;
        base_fee_in_stroops: number;
      }>("https://horizon-testnet.stellar.org/");
      results.push(
        `## Testnet (Horizon)\n` +
          `- **Horizon version:** ${root.horizon_version}\n` +
          `- **Core version:** ${root.core_version}\n` +
          `- **Protocol version:** ${root.current_protocol_version}\n` +
          `- **Latest ledger:** ${root.history_latest_ledger}\n` +
          `- **Base fee:** ${root.base_fee_in_stroops} stroops`
      );
    } catch (err) {
      results.push(`## Testnet (Horizon)\nError: ${String(err)}`);
    }

    return {
      content: [
        {
          type: "text",
          text: `# Stellar Network Status\n\n${results.join("\n\n---\n\n")}`,
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: get_soroban_rpc_info
// ---------------------------------------------------------------------------

server.tool(
  "get_soroban_rpc_info",
  "Fetch the Stellar RPC (formerly Soroban RPC) documentation and current network " +
    "information. Stellar RPC is the JSON-RPC interface for Soroban smart-contract operations.",
  {
    section: z
      .enum(["overview", "methods", "simulate", "send", "get-contract-data", "fee-stats"])
      .default("overview")
      .describe("Specific section of the Stellar RPC documentation to retrieve"),
  },
  async ({ section }) => {
    const pathMap: Record<string, string> = {
      overview: "/docs/data/rpc",
      methods: "/docs/data/rpc/api-reference/methods",
      simulate: "/docs/data/rpc/api-reference/methods/simulateTransaction",
      send: "/docs/data/rpc/api-reference/methods/sendTransaction",
      "get-contract-data": "/docs/data/rpc/api-reference/methods/getLedgerEntries",
      "fee-stats": "/docs/data/rpc/api-reference/methods/getFeeStats",
    };
    const path = pathMap[section];
    const url = `${STELLAR_DOCS_BASE}${path}`;

    try {
      const html = await fetchText(url);
      const text = stripHtml(html);
      return {
        content: [
          {
            type: "text",
            text: `# Stellar RPC Documentation: ${section}\n${url}\n\n${truncate(text)}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching ${url}: ${String(err)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // MCP servers communicate over stdio — stderr is for diagnostics only
  process.stderr.write("Stellar MCP Server running on stdio\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

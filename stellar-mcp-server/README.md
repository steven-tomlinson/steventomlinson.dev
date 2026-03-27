# Stellar MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server that gives AI agents authoritative, real-time access to Stellar Network documentation, Soroban SDK references, release notes, and community best practices.

## Tools provided

| Tool | Description |
|---|---|
| `fetch_stellar_docs` | Fetch any page from [developers.stellar.org](https://developers.stellar.org) |
| `fetch_horizon_reference` | Fetch Horizon REST API reference docs |
| `fetch_soroban_docs` | Fetch Soroban smart-contract SDK documentation |
| `get_stellar_releases` | Latest GitHub release notes for Stellar Core, js/py/java/rust SDKs, Stellar CLI, Stellar RPC |
| `get_community_posts` | Recent posts from Reddit `r/stellar` or `r/soroban` |
| `get_scf_announcements` | Stellar Community Fund announcements (r/StellarCommunityFund + SCF mentions in r/stellar) |
| `search_stellar_github` | Search code, issues, or repositories across the `stellar` GitHub org |
| `get_best_practices` | Curated best practices for Soroban contracts, Horizon integration, security, testing, and more |
| `get_stellar_network_status` | Live Mainnet & Testnet status from Horizon (ledger, fee, version) |
| `get_soroban_rpc_info` | Stellar RPC (Soroban RPC) documentation and method reference |

## Data sources

- **Official docs:** [developers.stellar.org](https://developers.stellar.org) — covers Horizon, Soroban, SDKs, protocols
- **GitHub releases:** [github.com/stellar](https://github.com/stellar) — release notes for all major repos
- **Reddit:** [r/stellar](https://reddit.com/r/stellar), [r/soroban](https://reddit.com/r/soroban), [r/StellarCommunityFund](https://reddit.com/r/StellarCommunityFund) — community discussions and SCF announcements
- **Curated best practices:** compiled from SDF engineering blog, SDK READMEs, and official security guidelines

> **Note:** SCF Discord content is not directly accessible via a public API. For the most current Discord announcements use the `get_scf_announcements` tool (which pulls from the official SCF Reddit mirror) and supplement with the [SCF Discord server](https://discord.gg/stellardev). YouTube content can be discovered via `search_stellar_github` or direct URL searches.

## Configuration

The server is zero-config by default. The following environment variables are supported:

| Variable | Default | Description |
|---|---|---|
| `STELLAR_MCP_USER_AGENT` | `StellarMCPServer/1.0 (Educational tool; contact: steventomlinson.dev)` | HTTP `User-Agent` sent with outbound requests |

## Installation

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Build

```bash
cd stellar-mcp-server
npm install
npm run build
```

### Run

```bash
npm start
# or during development:
npm run dev
```

The server communicates over **stdio** using the MCP protocol. It is designed to be launched by an MCP-compatible client (Claude Desktop, Cursor, VS Code Copilot, etc.).

## MCP client configuration

### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "stellar": {
      "command": "node",
      "args": ["/absolute/path/to/stellar-mcp-server/dist/index.js"]
    }
  }
}
```

### VS Code / Cursor (`.vscode/mcp.json` or `mcp.json`)

```json
{
  "servers": {
    "stellar": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/stellar-mcp-server/dist/index.js"]
    }
  }
}
```

Replace `/absolute/path/to/stellar-mcp-server` with the actual path on your system.

## Development

```bash
# Type-check without emitting
npm run typecheck

# Run in watch mode during development
npm run dev
```

## Example prompts (once connected to an MCP client)

- *"What are the latest releases of the Stellar JavaScript SDK?"* → uses `get_stellar_releases`
- *"Show me the Soroban getting-started guide."* → uses `fetch_soroban_docs`
- *"What are the best practices for Soroban contract security?"* → uses `get_best_practices`
- *"What is happening in the Stellar community this week?"* → uses `get_community_posts`
- *"What are the latest SCF grants?"* → uses `get_scf_announcements`
- *"What is the current Stellar Mainnet protocol version?"* → uses `get_stellar_network_status`
- *"Show me examples of using require_auth in Soroban contracts."* → uses `search_stellar_github`

## License

MIT

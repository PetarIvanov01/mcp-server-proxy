# Page Generation MCP Server - Multi-Agent System

This is a standalone MCP (Model Context Protocol) server for generating pages using Kendo React components. It implements a sophisticated multi-agent architecture that provides intelligent page generation through coordinated AI agents.

## Features

- **generate_page**: Generate a complete page based on user query using Kendo React components
- Standalone operation without external dependencies
- Returns structured responses with generated React code
- Supports TypeScript compilation and development workflow

## Installation

1. Install dependencies:

```bash
npm install
# or
pnpm install
```

## Usage

### Using with Cursor AI

The MCP server can be configured in Cursor's `mcp.json` file for use with AI agents.

#### Configuration

Add to your `mcp.json`:

```json
{
  "mcpServers": {
    "page-generation": {
      "name": "page-generation-mcp",
      "command": "npx",
      "args": ["tsx", "page-generation-mcp/src/server.ts"],
      "timeout": 900000,
      "env": {
        "NODE_ENV": "development",
        "OPENAI_API_KEY": "OPENAI_API_KEY"
      }
    }
  }
}
```

#### Available Tools

##### `generate_page`

Generates a page using Kendo React components based on user query.

**Parameters:**

- `query` (required): The user query describing what page to generate

**Returns:**

A structured response containing:

- Generated React code with Kendo components
- Instructions for implementation

**Example Usage:**

```json
{
  "name": "generate_page",
  "arguments": {
    "query": "Create a dashboard with charts and data grid"
  }
}
```

## Development

### Project Structure

```
page-generation-mcp/
├── src/
│   ├── server.ts          # Main MCP server implementation
│   └── lib/
│       ├── agents/        # Multi-agent system
│       │   ├── core-agent.ts      # Orchestrates the pipeline
│       │   ├── planner-agent.ts   # Creates execution plans
│       │   ├── structure-agent.ts # Generates ACT
│       │   └── merger-agent.ts    # Converts to Kendo components
│       ├── tools/         # MCP client tools
│       │   └── kendo-mcp-client.ts
│       ├── kendo-components.ts    # Kendo component definitions
│       └── types.ts       # TypeScript type definitions
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md             # This file
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run in development mode with tsx
- `npm start` - Run the compiled JavaScript
- `npm run lint` - Run ESLint
- `npm run clean` - Clean build directory

### Building

```bash
npm run build
```

This will compile the TypeScript source to the `dist/` directory.

## Architecture

The MCP server implements a sophisticated multi-agent architecture for intelligent page generation:

```
User Query → MCP Server → Core Agent → Multi-Agent Pipeline → Generated Code
                                    ↓
                            ┌─────────────────┐
                            │  Planner Agent  │
                            │ (Execution Plan)│
                            └─────────────────┘
                                    ↓
                            ┌─────────────────┐
                            │ Structure Agent │
                            │  (ACT Generation)│
                            └─────────────────┘
                                    ↓
                            ┌─────────────────┐
                            │  Merger Agent   │
                            │ (Kendo Components)│
                            └─────────────────┘
```

### Agent Components

- **Core Agent**: Orchestrates the entire generation pipeline with intelligent error handling
- **Planner Agent**: Creates execution plans based on user queries
- **Structure Agent**: Generates Abstract Component Trees (ACT) for page structure
- **Merger Agent**: Converts ACT to Kendo React components with proper styling
- **MCP Server**: Provides clean interface for external tools and clients

### Data Flow

1. **Query Processing**: User query validated and passed to Core Agent
2. **Planning Phase**: Planner Agent creates execution strategy
3. **Structure Generation**: Structure Agent builds ACT representation
4. **Component Merging**: Merger Agent converts ACT to Kendo components
5. **Error Handling**: Partial success support with detailed error reporting
6. **Response**: Structured response with generated code and metadata

## Generated Code Structure

The server generates React components with:

- Kendo React Button components
- Kendo React Grid for data display
- Kendo React Charts for data visualization
- Responsive layout with proper styling
- TypeScript support

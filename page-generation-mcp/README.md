# Page Generation MCP Server - Standalone

This is a standalone MCP (Model Context Protocol) server for generating pages using Kendo React components. It provides a clean interface for external tools (like Cursor AI) to interact with the page generation system.

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

2. Build the project:

```bash
npm run build
```

## Usage

### Running the MCP Server

```bash
# Development mode
npm run dev

# Production mode (after build)
npm start
```

### Using with Cursor AI

The MCP server can be configured in Cursor's `mcp.json` file for use with AI agents.

#### Configuration

Add to your `mcp.json`:

```json
{
  "mcpServers": {
    "page-generation": {
      "command": "node",
      "args": ["path/to/page-generation-mcp/dist/server.js"]
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
- File path for the generated page
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
│   └── server.ts          # Main MCP server implementation
├── dist/                  # Built output (generated)
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

The MCP server provides a simple interface for page generation:

```
Cursor AI → MCP Client → Page Generation MCP Server → Mock Core Agent → Generated Code
```

### Components

- **server.ts**: Main MCP server implementation
- **Mock Core Agent**: Simplified page generation logic
- **Tool Handlers**: Implements the `generate_page` tool
- **Error Handling**: Provides structured error responses

## Generated Code Structure

The server generates React components with:

- Kendo React Button components
- Kendo React Grid for data display
- Kendo React Charts for data visualization
- Responsive layout with proper styling
- TypeScript support

## License

MIT

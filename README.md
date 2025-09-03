# Page Builder Agent System

A multi-agent system that generates Kendo UI React components from natural language descriptions using OpenAI's agents SDK.

## Features

- **Multi-Agent Architecture**: Four specialized agents working together
- **Natural Language Processing**: Convert user queries to structured components
- **Kendo UI Integration**: Generate production-ready Kendo UI React components
- **Abstract Component Tree (ACT)**: Intermediate representation for better component mapping
- **RESTful API**: Expose the system through Next.js API routes
- **Real-time Generation**: Interactive web interface for testing

## Architecture

### Agents

1. **Core Agent**: Orchestrates the entire process and manages workflow
2. **Planner Agent**: Creates execution plans and analyzes complexity
3. **Structure Agent**: Generates Abstract Component Trees (ACT) from user queries
4. **Merger Agent**: Maps ACT components to Kendo UI React components

### API Endpoints

- `POST /api/agents/generate` - Complete page generation workflow
- `GET /api/agents/status` - System health and status
- `POST /api/agents/plan` - Create execution plans only
- `POST /api/agents/structure` - Generate ACT structures only
- `POST /api/agents/merge` - Merge ACT to Kendo components only

## Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd page-builder-chat
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp env.example .env.local
```

4. Add your OpenAI API key to `.env.local`:

```
OPENAI_API_KEY=your_openai_api_key_here
```

5. Start the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Web Interface

1. Navigate to the web interface
2. Enter a natural language description of the page you want to create
3. Click "Generate" to process through the multi-agent system
4. View the results in the tabs:
   - **Overview**: Summary and metadata
   - **Plan**: Execution plan details
   - **ACT**: Abstract Component Tree structure
   - **Code**: Generated Kendo UI React components

### API Usage

#### Generate Complete Page

```bash
curl -X POST http://localhost:3000/api/agents/generate \
  -H "Content-Type: application/json" \
  -d '{"query": "Create a dashboard with charts and data tables"}'
```

#### Create Execution Plan

```bash
curl -X POST http://localhost:3000/api/agents/plan \
  -H "Content-Type: application/json" \
  -d '{"query": "Create a dashboard with charts and data tables", "includeComplexity": true}'
```

#### Generate ACT Structure

```bash
curl -X POST http://localhost:3000/api/agents/structure \
  -H "Content-Type: application/json" \
  -d '{"query": "Create a dashboard with charts and data tables", "optimize": true}'
```

#### Merge ACT to Kendo Components

```bash
curl -X POST http://localhost:3000/api/agents/merge \
  -H "Content-Type: application/json" \
  -d '{"actStructure": {...}, "optimize": true, "validate": true}'
```

## Example Queries

- "Create a dashboard with a header, sidebar navigation, main content area with charts, and a data table"
- "Build a landing page with hero section, features grid, testimonials, and contact form"
- "Generate a user profile page with avatar, personal info form, and settings tabs"
- "Create an e-commerce product page with image gallery, product details, and add to cart functionality"

## Project Structure

```
page-builder-chat/
├── app/
│   ├── api/agents/          # API routes for the agent system
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main web interface
├── lib/
│   ├── agents/              # Agent implementations
│   │   ├── core-agent.ts
│   │   ├── planner-agent.ts
│   │   ├── structure-agent.ts
│   │   └── merger-agent.ts
│   ├── types.ts             # TypeScript types and Zod schemas
│   ├── kendo-components.ts  # Kendo UI component mappings
│   └── utils.ts             # Utility functions
├── components/ui/           # UI components (shadcn/ui)
└── README.md
```

## Development

### Adding New Components

1. Update `lib/kendo-components.ts` with new component mappings
2. Add component categories and ACT mappings
3. Test with the web interface

### Extending Agents

1. Modify agent instructions in the respective agent files
2. Update response schemas as needed
3. Test with various queries

### Customizing the API

1. Modify API routes in `app/api/agents/`
2. Add new endpoints as needed
3. Update the web interface to use new endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open an issue on GitHub or contact the development team.

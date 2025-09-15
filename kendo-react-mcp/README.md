# KendoReact MCP Server

The KendoReact [MCP Server](https://modelcontextprotocol.io/introduction) enables you achieve interation with AI and reach new levels of developer productivity. The MCP server provides proprietary context to AI-powered IDEs, apps and tools. You can use the KendoReact MCP server to ask about Kendo UI for React components, features, or general usage. You can successfully prompt more complex questions and tasks, and generate tailored code that includes Kendo UI for React components and API.

## Prerequisites

To use the KendoReact MCP server, you need:

* A [compatible MCP client (IDE, code editor or app)](https://modelcontextprotocol.io/clients) that supports *MCP tools*.
* A [Telerik user account](https://www.telerik.com/account/).
* An active [DevCraft or Kendo UI for React license](https://www.telerik.com/kendo-react-ui/pricing) or a [Kendo UI for React trial](https://www.telerik.com/kendo-react-ui).

## Installation

Use the documentation of your AI-powered MCP client to add the Kendo React MCP server to a specific workspace or globally. You can see installation tips and examples for some popular MCP clients below.

The generic settings of the KendoReact MCP server are:

* Server name: `kendo-react-assistant`
* Type: `stdio` (standard input/output transport)
* Command: `npx` (the MCP server works through an npm package)
* Supported arguments: `-y`
* npm package name: `@progress/kendo-react-mcp`
* You also need to add your [Telerik licence key](https://www.telerik.com/kendo-react-ui/components/my-license) as an `env` parameter in the `mcp.json` file. There are two options:
    * (recommended) Use a `TELERIK_LICENSE_PATH` argument and point to your Telerik license file location.
    * Use a `TELERIK_LICENSE` argument and paste your Telerik license key. Make sure to [update the license key](https://www.telerik.com/kendo-react-ui/components/my-license) when necessary.

## Authentication

The MCP server requires a valid Telerik account with a valid license. In order to get a valid license key check the [KendoReact documentation](https://www.telerik.com/kendo-react-ui/components/my-license).

To set up the license key, you need to set it up as an environment variable in the JSON configuration file.

## Configuration Examples

### VSCode - Copilot

Refer to [Use MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers).

To enable the Kendo React MCP server in a specific workspace or React app, add a `.vscode` folder with an `mcp.json` file at the root of the workspace:

> .vscode/mcp.json at the workspace root

```json
{
  "servers": {
    "kendo-react-assistant": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@progress/kendo-react-mcp@latest"],
      "env": {
        "TELERIK_LICENSE_PATH": "THE_PATH_TO_YOUR_LICENSE_FILE",
        // or
        "TELERIK_LICENSE": "YOUR_LICENSE_KEY"
      }
    }
  }
}
```

### Cursor

Refer to [Model Context Protocol](https://docs.cursor.com/context/model-context-protocol).

To [enable the Kendo React MCP server in a specific workspace](https://code.visualstudio.com/docs/copilot/chat/mcp-servers#_add-an-mcp-server-to-your-workspace) or React app, add a `.cursor` folder with an `mcp.json` file at the root of the workspace.

> .cursor/mcp.json at the workspace root

```json
{
  "mcpServers": {
    "kendo-react-assistant": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@progress/kendo-react-mcp@latest"],
      "env": {
        "TELERIK_LICENSE_PATH": "THE_PATH_TO_YOUR_LICENSE_FILE",
        // or
        "TELERIK_LICENSE": "YOUR_LICENSE_KEY"
      },
    }
  }
}
```

## Usage

To use the KendoReact MCP server:

1. Start your prompt with `#kendo-react-assistant` (the MCP server name configured in the mcp.json file).
1. Inspect the output and verify that the KendoReact MCP Server is used. Look for a statement in the output, which is similar to:
    * `Running kendo-react-assistant` (in VS Code)
    * `Calling MCP tool kendo-react-assistant` (in Cursor)

    If the KendoReact MCP server is not used even though it's installed and enabled, double-check the server name in your configuration and try rephrasing your prompt.
1. If requested, grant the KendoReact MCP server a permission to run for this session, workspace, or always.

Also check the general [AI Coding Assistant Recommendations](slug:ai-overview#recommendations) for more usage tips.

To increase the probability of the KendoReact MCP Server being used, or to call it without the need to mention "kendo" explicitly, add custom idea instructions to your AI-powered tool. Here are examples for [GitHub Copilot](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot#about-repository-custom-instructions-for-github-copilot-chat) and [Cursor](https://docs.cursor.com/context/rules).


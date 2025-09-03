# License Setup Guide

## Your Current Setup

You're storing your Telerik license in the `telerik-license.txt` file, which is the correct approach. I've updated the MCP client to properly check for this file.

## How to Test Your License Configuration

### 1. Test License File

Run the license test script:

```bash
npm run test:license
```

This will check:

- ✅ If `telerik-license.txt` exists
- ✅ If the file has content
- ✅ If it appears to be a valid Telerik license
- ✅ Environment variables (as fallback)

### 2. Test MCP Server Connection

Start your Next.js app and check the console logs:

```bash
npm run dev
```

Look for these log messages:

- `✅ License file found: /path/to/telerik-license.txt`
- `✅ Kendo MCP Client: Connected to MCP server`

### 3. Test Component Generation

Try generating a component through your app's API:

```bash
curl -X POST http://localhost:3000/api/agents/generate \
  -H "Content-Type: application/json" \
  -d '{"query": "Create a simple button component"}'
```

## What I Fixed

### 1. License File Priority

The MCP client now checks for license files in this order:

1. **`telerik-license.txt`** (your preferred method) ✅
2. `TELERIK_LICENSE_PATH` environment variable
3. `TELERIK_LICENSE` or `KENDO_UI_LICENSE` environment variables

### 2. Better Error Messages

The client now provides clear feedback:

- ✅ `License file found: /path/to/telerik-license.txt`
- ⚠️ `License file not found: /path/to/telerik-license.txt`
- ⚠️ `License file exists but is empty`

### 3. Automatic License Path

The MCP server process automatically uses your `telerik-license.txt` file without requiring environment variables.

## Troubleshooting

### If License Test Fails

1. **File not found**: Ensure `telerik-license.txt` is in your project root
2. **Empty file**: Check that your license file has content
3. **Invalid content**: Verify the file contains your Telerik license

### If MCP Server Still Fails

1. **Check console logs** for specific error messages
2. **Verify license format** - it should be a valid Telerik license
3. **Try environment variables** as a fallback:
   ```bash
   export TELERIK_LICENSE_PATH="./telerik-license.txt"
   ```

## Your MCP Integration

Your app is already well-configured to use the KendoReact MCP server:

- ✅ **MCP Configuration**: `mcp.json` properly configured
- ✅ **License Setup**: Now correctly reads `telerik-license.txt`
- ✅ **MCP Client**: Enhanced with better license checking
- ✅ **Merger Agent**: Uses MCP server for component documentation

The merger agent will now:

1. Extract required Kendo components from ACT structure
2. Fetch real-time documentation via MCP server
3. Generate better code with accurate component information

## Next Steps

1. Run `npm run test:license` to verify your setup
2. Start your app with `npm run dev`
3. Test component generation to see the MCP server in action
4. Check console logs for MCP connection status

Your license should now be properly recognized by the MCP server! 🎉

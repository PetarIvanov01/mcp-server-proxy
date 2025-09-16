#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'node:fs';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as protoLoader from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';

// Constants
const KENDO_UI_NAME = 'Kendo UI for React';
const LIBRARY_NAME = 'react';

// Environment variables for license
const LICENSE_ENV_VARS = ['TELERIK_LICENSE', 'KENDO_UI_LICENSE'];
const LICENSE_PATH_ENV_VAR = 'TELERIK_LICENSE_PATH';

// Available Kendo React components
const KENDO_COMPONENTS = [
  'ActionSheet', 'AIPrompt', 'Animation', 'AppBar', 'ArcGauge', 'AutoComplete', 'Avatar',
  'Badge', 'Barcode', 'BottomNavigation', 'Breadcrumb', 'Button', 'ButtonGroup', 'Calendar',
  'Card', 'Chart', 'ChartWizard', 'Chat', 'Checkbox', 'Chip', 'ChipList', 'ChunkProgressBar',
  'CircularGauge', 'ColorGradient', 'ColorPalette', 'ColorPicker', 'ComboBox', 'ContextMenu',
  'ConversationalUI', 'DataGrid', 'Grid', 'DataQuery', 'DateMath', 'DateInput', 'DatePicker',
  'DateRangePicker', 'DateTimePicker', 'Dialog', 'Drag&Drop', 'Drawer', 'Drawing',
  'DropDownButton', 'DropDownList', 'DropDownTree', 'Editor', 'Error', 'ExcelExport',
  'ExpansionPanel', 'ExternalDropZone', 'FileSaver', 'FileManager', 'Filter', 'FlatColorPicker',
  'FloatingActionButton', 'FloatingLabel', 'FontIcon', 'Form', 'Gantt', 'Gauge', 'General',
  'GridLayout', 'Hint', 'InlineAIPrompt', 'Input', 'Label', 'LinearGauge', 'ListBox',
  'ListView', 'Loader', 'Map', 'MaskedTextBox', 'Menu', 'MultiColumnComboBox', 'MultiSelect',
  'MultiSelectTree', 'MultiViewCalendar', 'Notification', 'NumericTextBox', 'OrgChart',
  'PageTemplates/BuildingBlocks', 'Pager', 'PanelBar', 'PDFProcessing', 'PDFViewer',
  'PivotGrid', 'Popover', 'Popup', 'ProgressBar', 'QRCode', 'RadialGauge', 'RadioButton',
  'RadioGroup', 'RangeSlider', 'Rating', 'Ripple', 'Sankey', 'Scheduler', 'ScrollView',
  'Signature', 'Skeleton', 'Slider', 'Sortable', 'Sparkline', 'SpeechToTextButton',
  'SplitButton', 'Splitter', 'Spreadsheet', 'StackLayout', 'Stepper', 'StockChart', 'SVGIcon',
  'Switch', 'TabStrip', 'TaskBoard', 'TextArea', 'TextBox', 'TileLayout', 'Timeline',
  'TimePicker', 'Toolbar', 'Tooltip', 'TreeList', 'TreeView', 'Typography', 'Upload',
  'VSCodeExtension', 'Window'
] as const;

// gRPC error codes
enum GrpcStatusCode {
  UNAUTHENTICATED = 16,
  RESOURCE_EXHAUSTED = 8,
  PERMISSION_DENIED = 7
}

// Interfaces
interface ContextQueryRequest {
  query: string;
  component: string;
  lib_name: string;
  text_matches_count: number;
  code_matches_count: number;
  allowed_types: string[];
}

interface ContextQueryResponse {
  values: string[];
}

interface ToolResponse {
  [x: string]: unknown;
  content: Array<{
    [x: string]: unknown;
    type: "text";
    text: string;
    _meta?: { [x: string]: unknown } | undefined;
  }>;
  _meta?: { [x: string]: unknown } | undefined;
}

// Custom error class
class LicenseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LicenseError';
  }
}

// Logging setup
let isLoggingEnabled = false;
const debugLogFile = process.env.DEBUG_LOG_FILE;
const shouldSetupLogging = !!(debugLogFile && typeof debugLogFile === 'string');

if (shouldSetupLogging) {
  const resolvedPath = path.resolve(debugLogFile);
  const dirPath = path.dirname(resolvedPath);
  
  if (dirPath !== '.' && dirPath !== process.cwd() && !fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
    } catch (error) {
      console.error('Error creating log directory:', error);
    }
  }
  
  if (!fs.existsSync(resolvedPath)) {
    try {
      fs.writeFileSync(resolvedPath, '');
    } catch (error) {
      console.error('Error creating log file:', error);
    }
  }
}

isLoggingEnabled = shouldSetupLogging && !!debugLogFile && fs.existsSync(path.resolve(debugLogFile));

function log(...messages: any[]): void {
  if (isLoggingEnabled && debugLogFile) {
    const logMessage = `${new Date().toISOString()}: ${messages.join(' ')}\n`;
    const resolvedPath = path.resolve(debugLogFile);
    
    fs.appendFile(resolvedPath, logMessage, (error) => {
      if (error) {
        console.error('Error writing to log file:', error);
      }
    });
  }
}

// License management
const licenseKey = process.env.TELERIK_LICENSE_KEY;

function getLicenseKey(): string {
  if (!licenseKey) {
    throw new LicenseError('No license key found');
  }

  return licenseKey;
}

// Context API client
class ContextApiClient {
  private client: any;
  private isDev: boolean;
  private contextApiUrl: string;
  private protoPath: string;

  constructor(contextApiUrl: string, protoPath: string) {
    this.contextApiUrl = contextApiUrl;
    this.protoPath = protoPath;
    
    const packageDefinition = protoLoader.loadSync(this.protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });

    this.isDev = this.contextApiUrl?.includes('localhost') || this.contextApiUrl?.includes('127.0.0.1');
    log('Using ContextApi URL:', this.contextApiUrl);

    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
    this.client = new protoDescriptor.ContextQueryService(
      this.contextApiUrl || 'contextapi.telerik.com:443',
      this.isDev ? grpc.credentials.createInsecure() : grpc.credentials.createSsl()
    );
  }

  async query(request: ContextQueryRequest): Promise<ContextQueryResponse> {
    const licenseKeyValue = this.isDev ? 'fake_license' : getLicenseKey();
    const metadata = new grpc.Metadata();

    if (licenseKeyValue && typeof licenseKeyValue === 'string') {
      const cleanedKey = licenseKeyValue.replace(/^\uFEFF/, '');
      try {
        metadata.add('x-license-key', cleanedKey);
      } catch (error: any) {
        log('Error adding license key to metadata:', error);
        return Promise.reject(new Error(`Failed to use license key: ${error.message}`));
      }
    }

    return new Promise((resolve, reject) => {
      this.client.query(request, metadata, (error: any, response: ContextQueryResponse) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
}

// Initialize context API client
const protoPath = './service.proto';
const contextApiClient = new ContextApiClient('contextapi.telerik.com:443', protoPath);

async function queryContextApi(request: ContextQueryRequest): Promise<ContextQueryResponse> {
  return contextApiClient.query(request);
}

// Helper function to generate component documentation
function generateComponentDocumentation(): string {
  return `
## Available ReactComponent enum values:
${KENDO_COMPONENTS.join(', ')}

## Rules
When generating code, explanations, or refactorings, always follow these rules:

1. Component Awareness
Whenever a component name is mentioned—regardless of how it's written (all lowercase, all uppercase, mixed case, separate words, or even with typos)—you should always look up the correct example from the corresponding component.

Key points:
- Match component names case-insensitively and robustly to minor variations
- If someone refers to a component (e.g., "button", "BUTTON", "BuTtOn"), match it to the correct component (Button)
- After matching, use the example or information associated with that component
- The matching should be case-insensitive and robust to minor variations

Example: If someone asks about "grid", "GRID", or "GrId", you always refer to DataGrid for the example.

Gotcha:
Don't just use the word as given—always normalize it and check the component to avoid mistakes or mismatches.

2. Links Awareness
When providing links or references to documentation, always use links from the https://www.telerik.com/kendo-react-ui domain. Avoid using slug syntax like { slug overview } or any placeholder syntax. Instead, provide complete, direct URLs that users can immediately navigate to.

Key points:
- Use only https://www.telerik.com/kendo-react-ui domain for Kendo React UI documentation links
- Provide complete URLs, not slug placeholders
- Ensure links are directly accessible and functional
- Avoid any template or placeholder syntax in URLs

Example:
✅ Correct: https://www.telerik.com/kendo-react-ui/components/grid/
❌ Incorrect: { slug overview } or /components/{component-name}/overview

3. Editor Tools Awareness
For Editor component cases, always use the proper EditorTools import structure and never define tools as strings. Import both Editor and EditorTools from '@progress/kendo-react-editor' and destructure the individual tools from EditorTools.

Required pattern:
\`\`\`jsx
import { Editor, EditorTools } from '@progress/kendo-react-editor';

const {
    Bold, Italic, Underline, Strikethrough,
    Subscript, Superscript, ForeColor, BackColor,
    CleanFormatting, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Indent, Outdent, OrderedList, UnorderedList,
    NumberedList, BulletedList, Undo, Redo,
    FontSize, FontName, FormatBlock, Link, Unlink,
    InsertImage, ViewHtml, InsertTable, InsertFile,
    SelectAll, Print, Pdf, TableProperties, TableCellProperties,
    AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter,
    DeleteRow, DeleteColumn, DeleteTable, MergeCells, SplitCell
} = EditorTools;
\`\`\`

Key points:
- Always import both Editor and EditorTools from '@progress/kendo-react-editor'
- Destructure individual tools from EditorTools object
- Use the destructured tool references directly in the tools array
- Never define tools as strings (e.g., 'bold', 'italic')
- Group related tools in sub-arrays for better organization

Example:
✅ Correct: tools={[[Bold, Italic, Underline], [AlignLeft, AlignCenter]]}
❌ Incorrect: tools={[['bold', 'italic', 'underline'], ['alignLeft', 'alignCenter']]}

4. DataGrid Deprecated Properties Awareness
For DataGrid component cases, avoid using deprecated properties and always use their modern replacements. The following properties are deprecated and should not be used:

Deprecated properties and their modern replacements:
- selectedField → use the select state property
- editField → use the edit state property
- expandedField → use the detailExpand state property
- onExpandChange → use onDetailExpandChange for detail-row expansion or onGroupExpandChange for group expansion
- cellRender → use the cells={{ data: CustomCell }} prop
- rowRender → use the rows={{ data: CustomRow }} prop
- filterCellRender → use the cells={{ filterCell: CustomCell }} prop
- headerCellRender → use the cells={{ headerCell: CustomHeaderCell }} prop
- column.cell → use the column.cells={{ data: CustomCell }} prop
- column.headerCell → use the column.cells={{ headerCell: CustomHeaderCell }} prop
- column.filterCell → use the column.cells={{ filterCell: CustomCell }} prop
- column.footerCell → use the column.cells={{ footerCell: CustomFooterCell }} prop

Additional modern updates:
- Input component in Column Menu Filter has been replaced with Textbox
- scrollable prop now defaults to virtual
- Virtual scrolling no longer applies height by default

Key points:
- Never suggest or use these deprecated properties in DataGrid examples
- Always provide modern alternatives when users ask about these properties
- Explain that these properties are deprecated and provide the specific modern replacement
- Focus on current DataGrid API patterns using state properties and cells/rows props

Example:
❌ Deprecated: selectedField="isSelected" editField="inEdit"
✅ Modern: Use select and edit state properties with proper configuration
`;
}

// Initialize MCP Server
const mcpServer = new McpServer({
  name: 'kendo-and-kendo-resources',
  version: '1.1.2'
});

// Tool implementation function
export async function kendoReactAssistantTool(params: { query: string; component: typeof KENDO_COMPONENTS[number] }): Promise<ToolResponse> {
  const { query, component } = params;
  log('Calling tool: ', JSON.stringify({ query, component }));
  
  // Handle Grid component alias
  let normalizedComponent = component;
  if (component === 'Grid') {
    normalizedComponent = 'DataGrid';
  }

  try {
    const response = await queryContextApi({
      query,
      component: normalizedComponent.toLowerCase(),
      lib_name: LIBRARY_NAME,
      text_matches_count: 3,
      code_matches_count: 0,
      allowed_types: ['documentation']
    });

    log('Response from context API: ', JSON.stringify(response));

    const additionalDocs = generateComponentDocumentation();
    const responseText = response.values.join('\n\n');
    const trimmedResponse = responseText.trim();

    const content = [{
      type: 'text' as const,
      text: responseText + (trimmedResponse ? '\n\n' + additionalDocs : '')
    }];

    log('Response from tool: ', JSON.stringify(content));
    return { content };

  } catch (error: any) {
    log('Error calling context API: ', JSON.stringify(error));

    if (error?.code === GrpcStatusCode.UNAUTHENTICATED) {
      throw new Error(
        'Error: You are not authenticated. Please verify the Telerik License Key provided is valid.'
      );
    } else if (error?.code === GrpcStatusCode.RESOURCE_EXHAUSTED) {
      throw new Error(
        `Error: You have exceeded the extension quota. Upgrade to subscription licensing in order to unlock full access. Message: ${error.message}.`
      );
    } else if (error?.code === GrpcStatusCode.PERMISSION_DENIED) {
      throw new Error(
        `Error: You do not have permission to access this resource. Please verify that you have a valid ${KENDO_UI_NAME} license key.`
      );
    } else if (error instanceof LicenseError) {
      log('License error: ', error.message);
      throw error;
    } else {
      throw new Error(`Error: An error occurred while calling the service. Please try again later.\n\nError Message: ${error.message}`);
    }
  }
}

// Register the Kendo React assistant tool
mcpServer.tool(
  'kendo_react_assistant',
  `Answers questions and retrieves documentation about Kendo UI for React. 
Use this tool when the user asks about Kendo UI for React features, specific components (e.g., Grid, Chart, Editor), implementation details, or general usage. 
Provide the user's detailed question as the 'query'. If the question pertains to a specific Kendo UI for React component, 
specify its name in the 'component' parameter. This tool can be automatically triggered when the following phrases are detected in the user's input/prompt:
- 'kendo';
- '/kendo';
- '/kendoreact'
- '/ask_kendo';
- '/help_kendo';
- '@kendo';
- '@kendoreact';
- '@ask_kendo';
- '@help_kendo'.`,
  {
    query: z.string().describe('The query to search for.'),
    component: z.enum(KENDO_COMPONENTS).describe(
      'The component to search for. If not specified, you can use General.'
    )
  },
  kendoReactAssistantTool
);

// Export server and types for external use
export { mcpServer, ContextApiClient, KENDO_COMPONENTS };
export type { ContextQueryRequest, ContextQueryResponse, ToolResponse };

// Start server function
export async function startKendoMCPServer(): Promise<void> {
  const transport = new StdioServerTransport();
  log('Starting Kendo MCP server...');
  await mcpServer.connect(transport);
}

// Main execution (only when run directly)
if (import.meta.url === `file://${process.argv[1]}`) {
  startKendoMCPServer().catch(console.error);
}

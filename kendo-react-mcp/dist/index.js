#!/usr/bin/env node
var R = Object.defineProperty;
var P = (e, t, o) =>
  t in e
    ? R(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o })
    : (e[t] = o);
var f = (e, t, o) => P(e, typeof t != 'symbol' ? t + '' : t, o);
import { McpServer as M } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport as O } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z as A } from 'zod';
var C = 'Kendo UI for React',
  w = 'react',
  g = [
    'ActionSheet',
    'AIPrompt',
    'Animation',
    'AppBar',
    'ArcGauge',
    'AutoComplete',
    'Avatar',
    'Badge',
    'Barcode',
    'BottomNavigation',
    'Breadcrumb',
    'Button',
    'ButtonGroup',
    'Calendar',
    'Card',
    'Chart',
    'ChartWizard',
    'Chat',
    'Checkbox',
    'Chip',
    'ChipList',
    'ChunkProgressBar',
    'CircularGauge',
    'ColorGradient',
    'ColorPalette',
    'ColorPicker',
    'ComboBox',
    'ContextMenu',
    'ConversationalUI',
    'DataGrid',
    'Grid',
    'DataQuery',
    'DateMath',
    'DateInput',
    'DatePicker',
    'DateRangePicker',
    'DateTimePicker',
    'Dialog',
    'Drag&Drop',
    'Drawer',
    'Drawing',
    'DropDownButton',
    'DropDownList',
    'DropDownTree',
    'Editor',
    'Error',
    'ExcelExport',
    'ExpansionPanel',
    'ExternalDropZone',
    'FileSaver',
    'FileManager',
    'Filter',
    'FlatColorPicker',
    'FloatingActionButton',
    'FloatingLabel',
    'FontIcon',
    'Form',
    'Gantt',
    'Gauge',
    'General',
    'GridLayout',
    'Hint',
    'InlineAIPrompt',
    'Input',
    'Label',
    'LinearGauge',
    'ListBox',
    'ListView',
    'Loader',
    'Map',
    'MaskedTextBox',
    'Menu',
    'MultiColumnComboBox',
    'MultiSelect',
    'MultiSelectTree',
    'MultiViewCalendar',
    'Notification',
    'NumericTextBox',
    'OrgChart',
    'PageTemplates/BuildingBlocks',
    'Pager',
    'PanelBar',
    'PDFProcessing',
    'PDFViewer',
    'PivotGrid',
    'Popover',
    'Popup',
    'ProgressBar',
    'QRCode',
    'RadialGauge',
    'RadioButton',
    'RadioGroup',
    'RangeSlider',
    'Rating',
    'Ripple',
    'Sankey',
    'Scheduler',
    'ScrollView',
    'Signature',
    'Skeleton',
    'Slider',
    'Sortable',
    'Sparkline',
    'SpeechToTextButton',
    'SplitButton',
    'Splitter',
    'Spreadsheet',
    'StackLayout',
    'Stepper',
    'StockChart',
    'SVGIcon',
    'Switch',
    'TabStrip',
    'TaskBoard',
    'TextArea',
    'TextBox',
    'TileLayout',
    'Timeline',
    'TimePicker',
    'Toolbar',
    'Tooltip',
    'TreeList',
    'TreeView',
    'Typography',
    'Upload',
    'VSCodeExtension',
    'Window'
  ];
import { dirname as _, join as N } from 'path';
import { fileURLToPath as B } from 'url';
import { readFileSync as L } from 'node:fs';
import s from 'node:fs';
import m from 'node:path';
import b from '@grpc/proto-loader';
import u from '@grpc/grpc-js';
var y = ['TELERIK_LICENSE', 'KENDO_UI_LICENSE'],
  v = 'TELERIK_LICENSE_PATH',
  l = ((e) => (
    (e[(e.UNAUTHENTICATED = 16)] = 'UNAUTHENTICATED'),
    (e[(e.RESOURCE_EXHAUSTED = 8)] = 'RESOURCE_EXHAUSTED'),
    (e[(e.PERMISSION_DENIED = 7)] = 'PERMISSION_DENIED'),
    e
  ))(l || {}),
  S = !1,
  i = process.env.DEBUG_LOG_FILE,
  x = !!(i && typeof i == 'string');
if (x) {
  let e = m.resolve(i),
    t = m.dirname(e);
  if (t !== '.' && t !== process.cwd() && !s.existsSync(t))
    try {
      s.mkdirSync(t, { recursive: !0 });
    } catch (o) {
      console.error('Error creating log directory:', o);
    }
  if (!s.existsSync(e))
    try {
      s.writeFileSync(e, '');
    } catch (o) {
      console.error('Error creating log file:', o);
    }
}
S = x && !!i && s.existsSync(m.resolve(i));
function n(...e) {
  if (S && i) {
    let t = `${new Date().toISOString()}: ${e.join(' ')}
`,
      o = m.resolve(i);
    s.appendFile(o, t, (r) => {
      r && console.error('Error writing to log file:', r);
    });
  }
}
var a = process.env[v],
  E = process.env[y[0]] || process.env[y[1]],
  h = class extends Error {
    constructor(e) {
      super(e), (this.name = 'LicenseError');
    }
  };
function U() {
  if (!a && !E)
    throw new h(
      `No license found. Please set one of the following environment variables: ${y.join(
        ', '
      )} or ${v}`
    );
  let e;
  if (a)
    try {
      (e = L(a, 'utf8')), n('License key read from file: ', a);
    } catch {
      throw new h(
        `Error reading license file: ${a}. Please verify the file exists and is readable.`
      );
    }
  return E && ((e = E), n('License key read from environment variable.')), e;
}
var k = class {
  constructor(e, t) {
    f(this, 'client');
    f(this, 'isDev');
    (this.contextApiUrl = e), (this.protoPath = t);
    let o = b.loadSync(this.protoPath, {
      keepCase: !0,
      longs: String,
      enums: String,
      defaults: !0,
      oneofs: !0
    });
    (this.isDev =
      this.contextApiUrl?.includes('localhost') ||
      this.contextApiUrl?.includes('127.0.0.1')),
      n('Using ContextApi URl:', this.contextApiUrl);
    let r = u.loadPackageDefinition(o);
    this.client = new r.ContextQueryService(
      this.contextApiUrl || 'contextapi.telerik.com:443',
      this.isDev ? u.credentials.createInsecure() : u.credentials.createSsl()
    );
  }
  async query(e) {
    let t = this.isDev ? 'fake_license' : U(),
      o = new u.Metadata();
    if (t && typeof t == 'string') {
      t = t.replace(/^\uFEFF/, '');
      try {
        o.add('x-license-key', t);
      } catch (r) {
        return (
          n('Error adding license key to metadata:', r),
          Promise.reject(new Error(`Failed to use license key: ${r.message}`))
        );
      }
    }
    return (
      t && typeof t == 'string' && o.add('x-license-key', t),
      new Promise((r, c) => {
        this.client.query(e, o, (d, p) => {
          d ? c(d) : r(p);
        });
      })
    );
  }
};
var F = N(_(B(import.meta.url)), '../proto/service.proto'),
  G = new k('contextapi.telerik.com:443', F);
async function T(e) {
  return G.query(e);
}
var D = new M({
  name: 'kendo-and-kendo-resources',
  version: '1.1.2' // <-- hardcoded version
});
D.tool(
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
    query: A.string().describe('The query to search for.'),
    component: A.enum(g).describe(
      'The component to search for. If not specified, you can use General.'
    )
  },
  async ({ query: e, component: t }) => {
    n('Calling tool: ', JSON.stringify({ query: e, component: t })),
      t === 'Grid' && (t = 'DataGrid');
    try {
      let o = await T({
        query: e,
        component: t.toLocaleLowerCase(),
        lib_name: w,
        text_matches_count: 3,
        code_matches_count: 0,
        allowed_types: ['documentation']
      });
      n('Response from context API: ', JSON.stringify(o));
      let r = J(),
        c = o.values.join(`

`),
        d = c.trim(),
        p = [
          {
            type: 'text',
            text:
              c +
              (d
                ? `

` + r
                : '')
          }
        ];
      return n('Response from tool: ', JSON.stringify(p)), { content: p };
    } catch (o) {
      throw (
        (n('Error calling context API: ', JSON.stringify(o)),
        o?.code === l.UNAUTHENTICATED
          ? new Error(
              'Error: You are not authenticated. Please verify the Telerik License Key provided is valid.'
            )
          : o?.code === l.RESOURCE_EXHAUSTED
          ? new Error(
              `Error: You have exceeded the extension quota. Upgrade to subscription licensing in order to unlock full access. Message: ${o.message}.`
            )
          : o?.code === l.PERMISSION_DENIED
          ? new Error(
              `Error: You do not have permission to access this resource. Please verify that you have a valid ${C} license key.`
            )
          : o instanceof h
          ? (n('License error: ', o.message), o)
          : new Error(`Error: An error occurred while calling the service. Please try again later.

Error Message: ${o.message}`))
      );
    }
  }
);
function J() {
  return `
## Available ReactComponent enum values:
${g.join(', ')}

## Rules
When generating code, explanations, or refactorings, always follow these rules:

1. Component Awareness
Whenever a component name is mentioned\u2014regardless of how it's written (all lowercase, all uppercase, mixed case, separate words, or even with typos)\u2014you should always look up the correct example from the corresponding component.


Key points:
- Match component names case-insensitively and robustly to minor variations
- If someone refers to a component (e.g., "button", "BUTTON", "BuTtOn"), match it to the correct component (Button)
- After matching, use the example or information associated with that component
- The matching should be case-insensitive and robust to minor variations

Example: If someone asks about "grid", "GRID", or "GrId", you always refer to DataGrid for the example.

Gotcha:
Don't just use the word as given\u2014always normalize it and check the component to avoid mistakes or mismatches.

2. Links Awareness
When providing links or references to documentation, always use links from the https://www.telerik.com/kendo-react-ui domain. Avoid using slug syntax like { slug overview } or any placeholder syntax. Instead, provide complete, direct URLs that users can immediately navigate to.

Key points:
- Use only https://www.telerik.com/kendo-react-ui domain for Kendo React UI documentation links
- Provide complete URLs, not slug placeholders
- Ensure links are directly accessible and functional
- Avoid any template or placeholder syntax in URLs

Example:
\u2705 Correct: https://www.telerik.com/kendo-react-ui/components/grid/
\u274C Incorrect: { slug overview } or /components/{component-name}/overview

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
\u2705 Correct: tools={[[Bold, Italic, Underline], [AlignLeft, AlignCenter]]}
\u274C Incorrect: tools={[['bold', 'italic', 'underline'], ['alignLeft', 'alignCenter']]}

4. DataGrid Deprecated Properties Awareness
For DataGrid component cases, avoid using deprecated properties and always use their modern replacements. The following properties are deprecated and should not be used:

Deprecated properties and their modern replacements:
- selectedField \u2192 use the select state property
- editField \u2192 use the edit state property
- expandedField \u2192 use the detailExpand state property
- onExpandChange \u2192 use onDetailExpandChange for detail-row expansion or onGroupExpandChange for group expansion
- cellRender \u2192 use the cells={{ data: CustomCell }} prop
- rowRender \u2192 use the rows={{ data: CustomRow }} prop
- filterCellRender \u2192 use the cells={{ filterCell: CustomCell }} prop
- headerCellRender \u2192 use the cells={{ headerCell: CustomHeaderCell }} prop
- column.cell \u2192 use the column.cells={{ data: CustomCell }} prop
- column.headerCell \u2192 use the column.cells={{ headerCell: CustomHeaderCell }} prop
- column.filterCell \u2192 use the column.cells={{ filterCell: CustomCell }} prop
- column.footerCell \u2192 use the column.cells={{ footerCell: CustomFooterCell }} prop

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
\u274C Deprecated: selectedField="isSelected" editField="inEdit"
\u2705 Modern: Use select and edit state properties with proper configuration
`;
}
async function z() {
  let e = new O();
  n('Starting server...'), await D.connect(e);
}
z();

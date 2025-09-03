// Kendo UI React Components Inventory
export const KENDO_COMPONENTS = [
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
] as const;

// Component Categories for better organization
export const COMPONENT_CATEGORIES = {
  layout: [
    'StackLayout',
    'GridLayout',
    'Splitter',
    'TileLayout',
    'Card',
    'PanelBar',
    'ExpansionPanel',
    'Window',
    'Dialog',
    'Drawer'
  ],
  navigation: [
    'AppBar',
    'BottomNavigation',
    'Breadcrumb',
    'Menu',
    'TabStrip',
    'Pager',
    'Stepper'
  ],
  input: [
    'Button',
    'ButtonGroup',
    'Input',
    'TextBox',
    'TextArea',
    'Checkbox',
    'RadioButton',
    'RadioGroup',
    'Switch',
    'Slider',
    'RangeSlider',
    'DatePicker',
    'DateInput',
    'DateRangePicker',
    'DateTimePicker',
    'TimePicker',
    'ComboBox',
    'DropDownList',
    'MultiSelect',
    'AutoComplete',
    'MaskedTextBox',
    'NumericTextBox',
    'ColorPicker',
    'FileManager',
    'Upload'
  ],
  display: [
    'Avatar',
    'Badge',
    'Chip',
    'ChipList',
    'Typography',
    'Label',
    'Hint',
    'Tooltip',
    'Popover',
    'Popup',
    'Notification',
    'ProgressBar',
    'ChunkProgressBar',
    'Loader',
    'Skeleton',
    'QRCode',
    'Barcode',
    'Signature'
  ],
  data: [
    'DataGrid',
    'Grid',
    'ListView',
    'TreeView',
    'TreeList',
    'PivotGrid',
    'Chart',
    'StockChart',
    'Sparkline',
    'Gantt',
    'Scheduler',
    'TaskBoard',
    'OrgChart',
    'Timeline',
    'Calendar',
    'MultiViewCalendar'
  ],
  feedback: [
    'Dialog',
    'Notification',
    'ProgressBar',
    'Loader',
    'Error',
    'Hint',
    'Tooltip',
    'Popover'
  ]
} as const;

// Common ACT to Kendo Component Mappings with Documentation URLs
export const ACT_TO_KENDO_MAPPINGS = {
  // Layout components
  container: {
    component: 'StackLayout',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/layout/stacklayout/',
    category: 'layout'
  },
  header: {
    component: 'AppBar',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/layout/appbar/',
    category: 'layout'
  },
  footer: {
    component: 'AppBar',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/layout/appbar/',
    category: 'layout'
  },
  sidebar: {
    component: 'Drawer',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/layout/drawer/',
    category: 'layout'
  },
  main: {
    component: 'StackLayout',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/layout/stacklayout/',
    category: 'layout'
  },
  section: {
    component: 'Card',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/layout/card/',
    category: 'layout'
  },
  article: {
    component: 'Card',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/layout/card/',
    category: 'layout'
  },
  aside: {
    component: 'PanelBar',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/layout/panelbar/',
    category: 'layout'
  },

  // Navigation components
  nav: {
    component: 'Menu',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/layout/menu',
    category: 'navigation'
  },
  breadcrumb: {
    component: 'Breadcrumb',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/navigation/breadcrumb/',
    category: 'navigation'
  },
  tabs: {
    component: 'TabStrip',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/navigation/tabstrip/',
    category: 'navigation'
  },
  pagination: {
    component: 'Pager',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/navigation/pager/',
    category: 'navigation'
  },
  stepper: {
    component: 'Stepper',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/navigation/stepper/',
    category: 'navigation'
  },

  // Input components
  button: {
    component: 'Button',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/buttons/button/',
    category: 'input'
  },
  input: {
    component: 'Input',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/inputs/input/',
    category: 'input'
  },
  textarea: {
    component: 'TextArea',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/inputs/textarea/',
    category: 'input'
  },
  select: {
    component: 'DropDownList',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/dropdowns/dropdownlist/',
    category: 'input'
  },
  checkbox: {
    component: 'Checkbox',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/inputs/checkbox/',
    category: 'input'
  },
  radio: {
    component: 'RadioButton',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/inputs/radiobutton/',
    category: 'input'
  },
  switch: {
    component: 'Switch',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/inputs/switch/',
    category: 'input'
  },
  slider: {
    component: 'Slider',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/inputs/slider/',
    category: 'input'
  },
  datepicker: {
    component: 'DatePicker',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/dateinputs/datepicker/',
    category: 'input'
  },
  timepicker: {
    component: 'TimePicker',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/dateinputs/timepicker/',
    category: 'input'
  },
  file: {
    component: 'Upload',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/upload/',
    category: 'input'
  },

  // Display components
  text: {
    component: 'Typography',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/common/typography',
    category: 'display'
  },
  heading: {
    component: 'Typography',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/common/typography',
    category: 'display'
  },
  paragraph: {
    component: 'Typography',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/common/typography',
    category: 'display'
  },
  image: {
    component: 'Avatar',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/layout/avatar/',
    category: 'display'
  },
  badge: {
    component: 'Badge',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/layout/badge/',
    category: 'display'
  },
  chip: {
    component: 'Chip',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/layout/chip/',
    category: 'display'
  },
  avatar: {
    component: 'Avatar',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/layout/avatar/',
    category: 'display'
  },
  progress: {
    component: 'ProgressBar',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/progressbars/progressbar',
    category: 'display'
  },
  loader: {
    component: 'Loader',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/feedback/loader/',
    category: 'display'
  },
  tooltip: {
    component: 'Tooltip',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/tooltips/tooltip/',
    category: 'display'
  },
  popover: {
    component: 'Popover',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/tooltips/popover/',
    category: 'display'
  },

  // Data components
  table: {
    component: 'DataGrid',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/grid/',
    category: 'data'
  },
  list: {
    component: 'ListView',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/listview/',
    category: 'data'
  },
  tree: {
    component: 'TreeView',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/treeview/',
    category: 'data'
  },
  chart: {
    component: 'Chart',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/charts/',
    category: 'data'
  },
  calendar: {
    component: 'Calendar',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/dateinputs/calendar/',
    category: 'data'
  },
  timeline: {
    component: 'Timeline',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/layout/timeline',
    category: 'data'
  },

  // Feedback components
  dialog: {
    component: 'Dialog',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/dialogs/dialog/',
    category: 'feedback'
  },
  modal: {
    component: 'Dialog',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/dialogs/dialog/',
    category: 'feedback'
  },
  notification: {
    component: 'Notification',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/notifications/notification/',
    category: 'feedback'
  },
  alert: {
    component: 'Notification',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/notifications/notification/',
    category: 'feedback'
  },
  error: {
    component: 'Error',
    docsUrl:
      'https://www.telerik.com/kendo-react-ui/components/feedback/error/',
    category: 'feedback'
  },
  hint: {
    component: 'Hint',
    docsUrl: 'https://www.telerik.com/kendo-react-ui/components/inputs/hint/',
    category: 'feedback'
  }
} as const;

export type KendoComponent = (typeof KENDO_COMPONENTS)[number];
export type ComponentCategory = keyof typeof COMPONENT_CATEGORIES;
export type ACTComponentType = keyof typeof ACT_TO_KENDO_MAPPINGS;

// Type for the new mapping structure
export type KendoComponentMapping = {
  component: string;
  docsUrl: string;
  category: ComponentCategory;
};

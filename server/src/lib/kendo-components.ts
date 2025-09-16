// Abstract Component Tree (ACT) Elements - Semantic components that LLMs understand
export const ACT_ELEMENTS = {
  'Layout & Structure': [
    'container',
    'wrapper',
    'section',
    'article',
    'aside',
    'main',
    'content',
    'header',
    'footer',
    'sidebar',
    'navigation',
    'breadcrumb',
    'tabs',
    'pagination',
    'stepper',
    'wizard',
    'flow',
    'step',
    'stage'
  ],
  'Content & Text': [
    'text',
    'heading',
    'title',
    'subtitle',
    'paragraph',
    'caption',
    'label',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'span',
    'div',
    'code',
    'pre',
    'quote',
    'blockquote',
    'cite',
    'emphasis',
    'strong',
    'bold',
    'italic'
  ],
  'Interactive Elements': [
    'button',
    'link',
    'anchor',
    'submit',
    'reset',
    'cancel',
    'save',
    'delete',
    'edit',
    'add',
    'remove',
    'close',
    'open',
    'toggle',
    'expand',
    'collapse',
    'action',
    'primary',
    'secondary',
    'tertiary',
    'danger',
    'warning',
    'success'
  ],
  'Form Controls': [
    'input',
    'textinput',
    'textarea',
    'select',
    'dropdown',
    'multiselect',
    'checkbox',
    'radio',
    'radiogroup',
    'switch',
    'toggle',
    'slider',
    'rangeslider',
    'datepicker',
    'timepicker',
    'datetimepicker',
    'daterangepicker',
    'file',
    'fileupload',
    'filemanager',
    'colorpicker',
    'rating',
    'search',
    'password',
    'email',
    'url',
    'tel',
    'number',
    'numeric',
    'masked',
    'autocomplete',
    'combobox',
    'taginput',
    'chipinput'
  ],
  'Data Display': [
    'table',
    'grid',
    'datagrid',
    'list',
    'listview',
    'tree',
    'treeview',
    'treelist',
    'card',
    'item',
    'row',
    'cell',
    'column',
    'header',
    'body',
    'footer',
    'pivot',
    'gantt',
    'scheduler',
    'calendar',
    'timeline',
    'orgchart',
    'taskboard',
    'chart',
    'graph',
    'diagram',
    'visualization',
    'dashboard',
    'widget'
  ],
  'Media & Graphics': [
    'image',
    'img',
    'picture',
    'photo',
    'avatar',
    'icon',
    'logo',
    'thumbnail',
    'video',
    'audio',
    'media',
    'player',
    'gallery',
    'carousel',
    'slideshow',
    'canvas',
    'svg',
    'chart',
    'graphic',
    'illustration',
    'banner',
    'hero'
  ],
  'Feedback & Status': [
    'alert',
    'notification',
    'message',
    'toast',
    'popup',
    'modal',
    'dialog',
    'tooltip',
    'hint',
    'help',
    'error',
    'warning',
    'info',
    'success',
    'progress',
    'progressbar',
    'loader',
    'spinner',
    'skeleton',
    'placeholder',
    'badge',
    'chip',
    'tag',
    'label',
    'status',
    'indicator',
    'marker'
  ],
  'Navigation & Menus': [
    'menu',
    'menuitem',
    'submenu',
    'dropdown',
    'dropdownmenu',
    'contextmenu',
    'toolbar',
    'menubar',
    'tabstrip',
    'tab',
    'tabpanel',
    'accordion',
    'panel',
    'drawer',
    'sidebar',
    'appbar',
    'bottomnavigation',
    'floatingaction'
  ],
  'Layout Containers': [
    'panel',
    'group',
    'fieldset',
    'form',
    'formgroup',
    'row',
    'column',
    'grid',
    'flex',
    'flexbox',
    'stack',
    'horizontal',
    'vertical',
    'center',
    'align',
    'justify',
    'wrap',
    'nowrap',
    'space',
    'gap',
    'margin',
    'padding'
  ],
  'Specialized Components': [
    'editor',
    'richtext',
    'markdown',
    'codeeditor',
    'terminal',
    'console',
    'spreadsheet',
    'datatable',
    'pivot',
    'filter',
    'search',
    'sort',
    'pagination',
    'pager',
    'infinite',
    'virtual',
    'lazy',
    'deferred',
    'wizard',
    'onboarding',
    'tour',
    'guide',
    'tutorial',
    'help',
    'settings',
    'preferences',
    'configuration',
    'options',
    'controls',
    'dashboard',
    'analytics',
    'metrics',
    'kpi',
    'widget',
    'gadget'
  ],
  'Interactive Features': [
    'drag',
    'drop',
    'sortable',
    'draggable',
    'droppable',
    'resizable',
    'selectable',
    'clickable',
    'hoverable',
    'focusable',
    'keyboard',
    'gesture',
    'swipe',
    'pinch',
    'zoom',
    'pan',
    'scroll',
    'scrollable'
  ],
  'Data Visualization': [
    'barchart',
    'linechart',
    'piechart',
    'donutchart',
    'areachart',
    'scatterplot',
    'bubblechart',
    'candlestick',
    'ohlc',
    'radar',
    'polar',
    'waterfall',
    'funnel',
    'boxplot',
    'bullet',
    'gauge',
    'meter',
    'sparkline',
    'treemap',
    'heatmap',
    'sankey',
    'chord',
    'force'
  ],
  'Form Layout': [
    'form',
    'field',
    'fieldset',
    'legend',
    'group',
    'section',
    'step',
    'validation',
    'error',
    'required',
    'optional',
    'helper',
    'description',
    'label',
    'placeholder',
    'hint',
    'tooltip',
    'help',
    'example'
  ],
  'Responsive & Adaptive': [
    'responsive',
    'mobile',
    'tablet',
    'desktop',
    'breakpoint',
    'viewport',
    'adaptive',
    'flexible',
    'fluid',
    'elastic',
    'fixed',
    'static',
    'sticky',
    'fixed',
    'absolute',
    'relative',
    'floating',
    'overlay'
  ]
} as const;

// Flattened array for backward compatibility and easy access
export const ACT_ELEMENTS_FLAT = Object.values(ACT_ELEMENTS).flat();

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
  'SvgIcon',
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
    'Gantt',
    'Scheduler',
    'TaskBoard',
    'OrgChart',
    'Timeline',
    'Calendar',
    'MultiViewCalendar'
  ],
  charts: ['Chart', 'StockChart', 'Sparkline', 'Sankey'],
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

export type KendoComponent = (typeof KENDO_COMPONENTS)[number];
export type ComponentCategory = keyof typeof COMPONENT_CATEGORIES;
export type ACTComponentType = keyof typeof ACT_TO_KENDO_MAPPINGS;

// Type for the mapping structure
export type KendoComponentMapping = {
  component: string;
  category?: string;
  seriesType?: string;
  props?: Record<string, any>;
};

// Enhanced ACT to Kendo Component Mapping with Category-Based Intelligence
export const ACT_TO_KENDO_MAPPINGS = {
  // Layout & Structure Components
  container: { component: 'StackLayout', category: 'layout', priority: 1 },
  wrapper: { component: 'StackLayout', category: 'layout', priority: 1 },
  section: { component: 'Card', category: 'layout', priority: 2 },
  article: { component: 'Card', category: 'layout', priority: 2 },
  aside: { component: 'PanelBar', category: 'layout', priority: 2 },
  main: { component: 'StackLayout', category: 'layout', priority: 1 },
  content: { component: 'StackLayout', category: 'layout', priority: 1 },
  header: { component: 'AppBar', category: 'navigation', priority: 1 },
  footer: { component: 'AppBar', category: 'navigation', priority: 1 },
  sidebar: { component: 'Drawer', category: 'layout', priority: 1 },
  navigation: { component: 'Menu', category: 'navigation', priority: 1 },
  breadcrumb: { component: 'Breadcrumb', category: 'navigation', priority: 1 },
  tabs: { component: 'TabStrip', category: 'navigation', priority: 1 },
  pagination: { component: 'Pager', category: 'navigation', priority: 1 },
  stepper: { component: 'Stepper', category: 'navigation', priority: 1 },
  wizard: { component: 'Stepper', category: 'navigation', priority: 1 },
  flow: { component: 'Stepper', category: 'navigation', priority: 1 },
  step: { component: 'Card', category: 'layout', priority: 2 },
  stage: { component: 'Card', category: 'layout', priority: 2 },

  // Content & Text Components
  text: { component: 'Typography', category: 'display', priority: 1 },
  heading: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'h2' }
  },
  title: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'h1' }
  },
  subtitle: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'h3' }
  },
  paragraph: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'p' }
  },
  caption: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'caption' }
  },
  label: { component: 'Label', category: 'display', priority: 1 },
  h1: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'h1' }
  },
  h2: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'h2' }
  },
  h3: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'h3' }
  },
  h4: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'h4' }
  },
  h5: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'h5' }
  },
  h6: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'h6' }
  },
  p: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'p' }
  },
  span: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'span' }
  },
  div: { component: 'StackLayout', category: 'layout', priority: 1 },
  code: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'code' }
  },
  pre: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'pre' }
  },
  quote: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'blockquote' }
  },
  blockquote: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'blockquote' }
  },
  cite: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'cite' }
  },
  emphasis: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'em' }
  },
  strong: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'strong' }
  },
  bold: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'strong' }
  },
  italic: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'em' }
  },

  // Interactive Elements
  button: { component: 'Button', category: 'input', priority: 1 },
  link: {
    component: 'ReactLink',
    category: 'navigation',
    priority: 1,
    props: { element: 'a' }
  },
  anchor: {
    component: 'ReactLink',
    category: 'navigation',
    priority: 1,
    props: { element: 'a' }
  },
  submit: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { type: 'submit' }
  },
  reset: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { type: 'reset' }
  },
  cancel: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { themeColor: 'warning' }
  },
  save: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { themeColor: 'success' }
  },
  delete: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { themeColor: 'error' }
  },
  edit: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { fillMode: 'outline' }
  },
  add: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { themeColor: 'success' }
  },
  remove: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { themeColor: 'error' }
  },
  close: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { fillMode: 'flat' }
  },
  open: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { themeColor: 'primary' }
  },
  toggle: { component: 'Switch', category: 'input', priority: 1 },
  expand: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { fillMode: 'outline' }
  },
  collapse: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { fillMode: 'outline' }
  },
  action: { component: 'Button', category: 'input', priority: 1 },
  primary: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { themeColor: 'primary' }
  },
  secondary: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { fillMode: 'outline' }
  },
  tertiary: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { fillMode: 'flat' }
  },
  danger: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { themeColor: 'error' }
  },
  warning: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { themeColor: 'warning' }
  },
  success: {
    component: 'Button',
    category: 'input',
    priority: 1,
    props: { themeColor: 'success' }
  },

  // Form Controls
  input: { component: 'Input', category: 'input', priority: 1 },
  textinput: { component: 'TextBox', category: 'input', priority: 1 },
  textarea: { component: 'TextArea', category: 'input', priority: 1 },
  select: { component: 'DropDownList', category: 'input', priority: 1 },
  dropdown: { component: 'DropDownList', category: 'input', priority: 1 },
  multiselect: { component: 'MultiSelect', category: 'input', priority: 1 },
  checkbox: { component: 'Checkbox', category: 'input', priority: 1 },
  radio: { component: 'RadioButton', category: 'input', priority: 1 },
  radiogroup: { component: 'RadioGroup', category: 'input', priority: 1 },
  switch: { component: 'Switch', category: 'input', priority: 1 },
  slider: { component: 'Slider', category: 'input', priority: 1 },
  rangeslider: { component: 'RangeSlider', category: 'input', priority: 1 },
  datepicker: { component: 'DatePicker', category: 'input', priority: 1 },
  timepicker: { component: 'TimePicker', category: 'input', priority: 1 },
  datetimepicker: {
    component: 'DateTimePicker',
    category: 'input',
    priority: 1
  },
  daterangepicker: {
    component: 'DateRangePicker',
    category: 'input',
    priority: 1
  },
  file: { component: 'Upload', category: 'input', priority: 1 },
  fileupload: { component: 'Upload', category: 'input', priority: 1 },
  filemanager: { component: 'FileManager', category: 'input', priority: 1 },
  colorpicker: { component: 'ColorPicker', category: 'input', priority: 1 },
  rating: { component: 'Rating', category: 'input', priority: 1 },
  search: { component: 'AutoComplete', category: 'input', priority: 1 },
  password: {
    component: 'TextBox',
    category: 'input',
    priority: 1,
    props: { type: 'password' }
  },
  email: {
    component: 'TextBox',
    category: 'input',
    priority: 1,
    props: { type: 'email' }
  },
  url: {
    component: 'TextBox',
    category: 'input',
    priority: 1,
    props: { type: 'url' }
  },
  tel: {
    component: 'TextBox',
    category: 'input',
    priority: 1,
    props: { type: 'tel' }
  },
  number: { component: 'NumericTextBox', category: 'input', priority: 1 },
  numeric: { component: 'NumericTextBox', category: 'input', priority: 1 },
  masked: { component: 'MaskedTextBox', category: 'input', priority: 1 },
  autocomplete: { component: 'AutoComplete', category: 'input', priority: 1 },
  combobox: { component: 'ComboBox', category: 'input', priority: 1 },
  taginput: { component: 'MultiSelect', category: 'input', priority: 1 },
  chipinput: { component: 'MultiSelect', category: 'input', priority: 1 },

  // Data Display Components
  table: { component: 'DataGrid', category: 'data', priority: 1 },
  grid: { component: 'Grid', category: 'data', priority: 1 },
  datagrid: { component: 'DataGrid', category: 'data', priority: 1 },
  list: { component: 'ListView', category: 'data', priority: 1 },
  listview: { component: 'ListView', category: 'data', priority: 1 },
  tree: { component: 'TreeView', category: 'data', priority: 1 },
  treeview: { component: 'TreeView', category: 'data', priority: 1 },
  treelist: { component: 'TreeList', category: 'data', priority: 1 },
  card: { component: 'Card', category: 'layout', priority: 1 },
  item: { component: 'Card', category: 'layout', priority: 2 },
  row: {
    component: 'StackLayout',
    category: 'layout',
    priority: 2,
    props: { orientation: 'horizontal' }
  },
  cell: { component: 'StackLayout', category: 'layout', priority: 2 },
  column: { component: 'StackLayout', category: 'layout', priority: 2 },
  pivot: { component: 'PivotGrid', category: 'data', priority: 1 },
  gantt: { component: 'Gantt', category: 'data', priority: 1 },
  scheduler: { component: 'Scheduler', category: 'data', priority: 1 },
  calendar: { component: 'Calendar', category: 'data', priority: 1 },
  timeline: { component: 'Timeline', category: 'data', priority: 1 },
  orgchart: { component: 'OrgChart', category: 'data', priority: 1 },
  taskboard: { component: 'TaskBoard', category: 'data', priority: 1 },
  chart: { component: 'Chart', category: 'charts', priority: 1 },
  graph: { component: 'Chart', category: 'charts', priority: 1 },
  diagram: { component: 'Chart', category: 'charts', priority: 1 },
  visualization: { component: 'Chart', category: 'charts', priority: 1 },
  dashboard: { component: 'StackLayout', category: 'layout', priority: 1 },
  widget: { component: 'Card', category: 'layout', priority: 2 },

  // Media & Graphics Components
  image: { component: 'Avatar', category: 'display', priority: 1 },
  img: { component: 'Avatar', category: 'display', priority: 1 },
  picture: { component: 'Avatar', category: 'display', priority: 1 },
  photo: { component: 'Avatar', category: 'display', priority: 1 },
  avatar: { component: 'Avatar', category: 'display', priority: 1 },
  icon: { component: 'SVGIcon', category: 'display', priority: 1 },
  logo: { component: 'Avatar', category: 'display', priority: 1 },
  thumbnail: { component: 'Avatar', category: 'display', priority: 1 },
  video: { component: 'Card', category: 'display', priority: 1 },
  audio: { component: 'Card', category: 'display', priority: 1 },
  media: { component: 'Card', category: 'display', priority: 1 },
  player: { component: 'Card', category: 'display', priority: 1 },
  gallery: { component: 'ScrollView', category: 'display', priority: 1 },
  carousel: { component: 'ScrollView', category: 'display', priority: 1 },
  slideshow: { component: 'ScrollView', category: 'display', priority: 1 },
  canvas: { component: 'Card', category: 'display', priority: 1 },
  svg: { component: 'SVGIcon', category: 'display', priority: 1 },
  graphic: { component: 'Chart', category: 'charts', priority: 1 },
  illustration: { component: 'Card', category: 'display', priority: 1 },
  banner: { component: 'Card', category: 'display', priority: 1 },
  hero: { component: 'Card', category: 'display', priority: 1 },

  // Feedback & Status Components
  alert: { component: 'Notification', category: 'feedback', priority: 1 },
  notification: {
    component: 'Notification',
    category: 'feedback',
    priority: 1
  },
  message: { component: 'Notification', category: 'feedback', priority: 1 },
  toast: { component: 'Notification', category: 'feedback', priority: 1 },
  popup: { component: 'Popup', category: 'feedback', priority: 1 },
  modal: { component: 'Dialog', category: 'feedback', priority: 1 },
  dialog: { component: 'Dialog', category: 'feedback', priority: 1 },
  tooltip: { component: 'Tooltip', category: 'display', priority: 1 },
  hint: { component: 'Hint', category: 'display', priority: 1 },
  help: { component: 'Hint', category: 'display', priority: 1 },
  error: { component: 'Error', category: 'feedback', priority: 1 },
  info: {
    component: 'Notification',
    category: 'feedback',
    priority: 1,
    props: { type: 'info' }
  },
  progress: { component: 'ProgressBar', category: 'display', priority: 1 },
  progressbar: { component: 'ProgressBar', category: 'display', priority: 1 },
  loader: { component: 'Loader', category: 'display', priority: 1 },
  spinner: { component: 'Loader', category: 'display', priority: 1 },
  skeleton: { component: 'Skeleton', category: 'display', priority: 1 },
  placeholder: { component: 'Skeleton', category: 'display', priority: 1 },
  badge: { component: 'Badge', category: 'display', priority: 1 },
  chip: { component: 'Chip', category: 'display', priority: 1 },
  tag: { component: 'Chip', category: 'display', priority: 1 },
  status: { component: 'Badge', category: 'display', priority: 1 },
  indicator: { component: 'Badge', category: 'display', priority: 1 },
  marker: { component: 'Badge', category: 'display', priority: 1 },

  // Navigation & Menus
  menu: { component: 'Menu', category: 'navigation', priority: 1 },
  menuitem: { component: 'Menu', category: 'navigation', priority: 2 },
  submenu: { component: 'Menu', category: 'navigation', priority: 2 },
  dropdownmenu: { component: 'DropDownButton', category: 'input', priority: 1 },
  contextmenu: {
    component: 'ContextMenu',
    category: 'navigation',
    priority: 1
  },
  toolbar: { component: 'Toolbar', category: 'navigation', priority: 1 },
  menubar: { component: 'Menu', category: 'navigation', priority: 1 },
  tabstrip: { component: 'TabStrip', category: 'navigation', priority: 1 },
  tab: { component: 'TabStrip', category: 'navigation', priority: 2 },
  tabpanel: { component: 'Card', category: 'layout', priority: 2 },
  accordion: { component: 'ExpansionPanel', category: 'layout', priority: 1 },
  panel: { component: 'ExpansionPanel', category: 'layout', priority: 1 },
  drawer: { component: 'Drawer', category: 'layout', priority: 1 },
  appbar: { component: 'AppBar', category: 'navigation', priority: 1 },
  bottomnavigation: {
    component: 'BottomNavigation',
    category: 'navigation',
    priority: 1
  },
  floatingaction: {
    component: 'FloatingActionButton',
    category: 'input',
    priority: 1
  },

  // Layout Containers
  group: { component: 'StackLayout', category: 'layout', priority: 1 },
  fieldset: {
    component: 'Card',
    category: 'layout',
    priority: 1,
    props: { variant: 'outlined' }
  },
  form: { component: 'Form', category: 'input', priority: 1 },
  formgroup: { component: 'StackLayout', category: 'layout', priority: 1 },
  flex: { component: 'StackLayout', category: 'layout', priority: 1 },
  flexbox: { component: 'StackLayout', category: 'layout', priority: 1 },
  stack: { component: 'StackLayout', category: 'layout', priority: 1 },
  horizontal: {
    component: 'StackLayout',
    category: 'layout',
    priority: 1,
    props: { orientation: 'horizontal' }
  },
  vertical: {
    component: 'StackLayout',
    category: 'layout',
    priority: 1,
    props: { orientation: 'vertical' }
  },
  center: {
    component: 'StackLayout',
    category: 'layout',
    priority: 1,
    props: { alignItems: 'center' }
  },
  align: { component: 'StackLayout', category: 'layout', priority: 1 },
  justify: { component: 'StackLayout', category: 'layout', priority: 1 },
  wrap: { component: 'StackLayout', category: 'layout', priority: 1 },
  nowrap: { component: 'StackLayout', category: 'layout', priority: 1 },
  space: { component: 'StackLayout', category: 'layout', priority: 1 },
  gap: { component: 'StackLayout', category: 'layout', priority: 1 },
  margin: { component: 'StackLayout', category: 'layout', priority: 1 },
  padding: { component: 'StackLayout', category: 'layout', priority: 1 },

  // Specialized Components
  editor: { component: 'Editor', category: 'input', priority: 1 },
  richtext: { component: 'Editor', category: 'input', priority: 1 },
  markdown: { component: 'Editor', category: 'input', priority: 1 },
  codeeditor: { component: 'Editor', category: 'input', priority: 1 },
  terminal: { component: 'Card', category: 'display', priority: 1 },
  console: { component: 'Card', category: 'display', priority: 1 },
  spreadsheet: { component: 'Spreadsheet', category: 'data', priority: 1 },
  datatable: { component: 'DataGrid', category: 'data', priority: 1 },
  filter: { component: 'Filter', category: 'data', priority: 1 },
  sort: { component: 'DataGrid', category: 'data', priority: 2 },
  infinite: { component: 'ScrollView', category: 'display', priority: 1 },
  virtual: { component: 'ListView', category: 'data', priority: 1 },
  lazy: { component: 'Skeleton', category: 'display', priority: 1 },
  deferred: { component: 'Skeleton', category: 'display', priority: 1 },
  onboarding: { component: 'Stepper', category: 'navigation', priority: 1 },
  tour: { component: 'Dialog', category: 'feedback', priority: 1 },
  guide: { component: 'Dialog', category: 'feedback', priority: 1 },
  tutorial: { component: 'Dialog', category: 'feedback', priority: 1 },
  settings: { component: 'Card', category: 'layout', priority: 1 },
  preferences: { component: 'Card', category: 'layout', priority: 1 },
  configuration: { component: 'Card', category: 'layout', priority: 1 },
  options: { component: 'Card', category: 'layout', priority: 1 },
  controls: { component: 'Card', category: 'layout', priority: 1 },
  analytics: { component: 'Chart', category: 'charts', priority: 1 },
  metrics: { component: 'Chart', category: 'charts', priority: 1 },
  kpi: { component: 'Card', category: 'display', priority: 1 },
  gadget: { component: 'Card', category: 'layout', priority: 1 },

  // Interactive Features
  drag: { component: 'Drag&Drop', category: 'input', priority: 1 },
  drop: { component: 'Drag&Drop', category: 'input', priority: 1 },
  sortable: { component: 'Sortable', category: 'input', priority: 1 },
  draggable: { component: 'Drag&Drop', category: 'input', priority: 1 },
  droppable: { component: 'Drag&Drop', category: 'input', priority: 1 },
  resizable: { component: 'Splitter', category: 'layout', priority: 1 },
  selectable: { component: 'DataGrid', category: 'data', priority: 1 },
  clickable: { component: 'Button', category: 'input', priority: 1 },
  hoverable: { component: 'Button', category: 'input', priority: 1 },
  focusable: { component: 'Input', category: 'input', priority: 1 },
  keyboard: { component: 'Input', category: 'input', priority: 1 },
  gesture: { component: 'ScrollView', category: 'display', priority: 1 },
  swipe: { component: 'ScrollView', category: 'display', priority: 1 },
  pinch: { component: 'ScrollView', category: 'display', priority: 1 },
  zoom: { component: 'ScrollView', category: 'display', priority: 1 },
  pan: { component: 'ScrollView', category: 'display', priority: 1 },
  scroll: { component: 'ScrollView', category: 'display', priority: 1 },
  scrollable: { component: 'ScrollView', category: 'display', priority: 1 },

  // Data Visualization
  barchart: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'column'
  },
  linechart: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'line'
  },
  piechart: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'pie'
  },
  donutchart: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'donut'
  },
  areachart: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'area'
  },
  scatterplot: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'scatter'
  },
  scatterchart: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'scatter'
  },
  bubblechart: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'bubble'
  },
  candlestick: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'candlestick'
  },
  ohlc: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'ohlc'
  },
  radar: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'radar'
  },
  polar: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'polar'
  },
  waterfall: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'waterfall'
  },
  funnel: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'funnel'
  },
  boxplot: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'boxPlot'
  },
  bullet: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'bullet'
  },
  gauge: { component: 'Gauge', category: 'display', priority: 1 },
  meter: { component: 'Gauge', category: 'display', priority: 1 },
  sparkline: { component: 'Sparkline', category: 'charts', priority: 1 },
  treemap: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'treemap'
  },
  heatmap: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'heatmap'
  },
  sankey: { component: 'Sankey', category: 'charts', priority: 1 },
  chord: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'chord'
  },
  force: {
    component: 'Chart',
    category: 'charts',
    priority: 1,
    seriesType: 'force'
  },

  // Form Layout
  field: { component: 'StackLayout', category: 'layout', priority: 1 },
  legend: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'h6' }
  },
  validation: { component: 'Hint', category: 'display', priority: 1 },
  required: { component: 'Label', category: 'display', priority: 1 },
  optional: { component: 'Label', category: 'display', priority: 1 },
  helper: { component: 'Hint', category: 'display', priority: 1 },
  description: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'caption' }
  },
  example: { component: 'Hint', category: 'display', priority: 1 },

  // Responsive & Adaptive
  responsive: { component: 'StackLayout', category: 'layout', priority: 1 },
  mobile: { component: 'StackLayout', category: 'layout', priority: 1 },
  tablet: { component: 'StackLayout', category: 'layout', priority: 1 },
  desktop: { component: 'StackLayout', category: 'layout', priority: 1 },
  breakpoint: { component: 'StackLayout', category: 'layout', priority: 1 },
  viewport: { component: 'StackLayout', category: 'layout', priority: 1 },
  adaptive: { component: 'StackLayout', category: 'layout', priority: 1 },
  flexible: { component: 'StackLayout', category: 'layout', priority: 1 },
  fluid: { component: 'StackLayout', category: 'layout', priority: 1 },
  elastic: { component: 'StackLayout', category: 'layout', priority: 1 },
  fixed: { component: 'StackLayout', category: 'layout', priority: 1 },
  static: { component: 'StackLayout', category: 'layout', priority: 1 },
  sticky: { component: 'AppBar', category: 'navigation', priority: 1 },
  absolute: { component: 'Popup', category: 'feedback', priority: 1 },
  relative: { component: 'StackLayout', category: 'layout', priority: 1 },
  floating: {
    component: 'FloatingActionButton',
    category: 'input',
    priority: 1
  },
  overlay: { component: 'Popup', category: 'feedback', priority: 1 },

  // Missing components from ACT structures
  intro: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'p' }
  },
  socialmedia: { component: 'Menu', category: 'navigation', priority: 1 },
  copyright: {
    component: 'Typography',
    category: 'display',
    priority: 1,
    props: { variant: 'caption' }
  },

  // HTML element fallbacks for unmapped components
  ul: {
    component: 'HTML_UL',
    category: 'content',
    priority: 3,
    props: { element: 'ul' }
  },
  ol: {
    component: 'HTML_OL',
    category: 'content',
    priority: 3,
    props: { element: 'ol' }
  },
  li: {
    component: 'HTML_LI',
    category: 'content',
    priority: 3,
    props: { element: 'li' }
  }
} as const;

// Helper function to get the best Kendo component for an ACT element
export function getKendoComponentForACT(
  actElement: string
): KendoComponentMapping {
  const mapping =
    ACT_TO_KENDO_MAPPINGS[actElement as keyof typeof ACT_TO_KENDO_MAPPINGS];

  if (mapping) {
    return {
      component: mapping.component,
      category: mapping.category,
      seriesType: 'seriesType' in mapping ? mapping.seriesType : undefined,
      props: 'props' in mapping ? mapping.props : undefined
    };
  }

  // Fallback to a default mapping
  return {
    component: 'StackLayout',
    category: 'layout',
    props: {}
  };
}

// Helper function to get all ACT elements by category
export function getACTElementsByCategory(
  category: ComponentCategory
): string[] {
  return Object.entries(ACT_TO_KENDO_MAPPINGS)
    .filter(([_, mapping]) => mapping.category === category)
    .map(([element, _]) => element);
}

// Helper function to get all semantic categories
export function getACTSemanticCategories(): string[] {
  return Object.keys(ACT_ELEMENTS);
}

// Helper function to format ACT elements for prompt context
export function formatACTElementsForPrompt(): string {
  return Object.entries(ACT_ELEMENTS)
    .map(([category, elements]) => `${category}: ${elements.join(', ')}`)
    .join('\n');
}

// MCP Query Generation based on component category
export function generateMCPQuery(
  kendoComponent: string,
  category?: string
): string {
  if (category === 'input') {
    return `Show me Kendo UI ${kendoComponent} examples with complete props, event handlers, validation, and styling. Include examples for different states (enabled, disabled, error) and common use cases. Provide realistic sample data and accessibility attributes.`;
  } else if (category === 'data') {
    return `Show me Kendo UI ${kendoComponent} examples with data binding, sorting, filtering, and pagination. Include examples with realistic sample data, custom cell templates, and responsive design. Provide complete implementation with all necessary props.`;
  } else if (category === 'layout') {
    return `Show me Kendo UI ${kendoComponent} examples with different orientations, spacing, and responsive behavior. Include examples for common layout patterns and styling with Tailwind CSS classes. Provide complete implementation with all props.`;
  } else if (category === 'navigation') {
    return `Show me Kendo UI ${kendoComponent} examples with navigation patterns, active states, and responsive behavior. Include examples for different menu structures and styling. Provide complete implementation with event handlers.`;
  } else if (category === 'display') {
    return `Show me Kendo UI ${kendoComponent} examples with different variants, sizes, and styling options. Include examples for common display patterns and accessibility features. Provide complete implementation with all props.`;
  } else if (category === 'feedback') {
    return `Show me Kendo UI ${kendoComponent} examples with different types, positioning, and animation. Include examples for success, error, warning, and info states. Provide complete implementation with event handlers.`;
  } else if (category === 'charts') {
    return `Show me Kendo UI ${kendoComponent} examples with different chart types, data binding, and interactive features. Include examples with realistic sample data and responsive design. Provide complete implementation with all chart options.`;
  } else {
    return `Show me Kendo UI ${kendoComponent} examples with complete props, styling, and common use cases. Include examples for different states and configurations. Provide realistic sample data and accessibility attributes.`;
  }
}

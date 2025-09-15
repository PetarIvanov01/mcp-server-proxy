
    'use client'; 


    import React from 'react';
import { StackLayout } from '@progress/kendo-react-layout';
import { AppBar, AppBarSection, AppBarSpacer } from '@progress/kendo-react-layout';
import { Avatar } from '@progress/kendo-react-layout';
import { AutoComplete } from '@progress/kendo-react-dropdowns';
import { TextBox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Badge } from '@progress/kendo-react-indicators';
import { Menu, MenuItem } from '@progress/kendo-react-layout';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { Label } from '@progress/kendo-react-labels';
import { Breadcrumb } from '@progress/kendo-react-layout';
import { DateRangePicker } from '@progress/kendo-react-dateinputs';
import { Grid as DataGrid, GridColumn } from '@progress/kendo-react-grid';
import { Card } from '@progress/kendo-react-layout';
import { Sparkline } from '@progress/kendo-react-charts';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { ExpansionPanel, ExpansionPanelContent } from '@progress/kendo-react-layout';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartLegend, ChartTooltip, ChartZoomable } from '@progress/kendo-react-charts';
import { MultiSelect } from '@progress/kendo-react-dropdowns';
import { Pager } from '@progress/kendo-react-data-tools';
import { ListView, ListViewItemProps, ListViewItemWrapper } from '@progress/kendo-react-listview';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { FloatingActionButton } from '@progress/kendo-react-buttons';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

    export default function SaaSDashboardShell() {
  // Mock data and state
  const user = { name: 'Alex Johnson', email: 'alex.johnson@example.com', role: 'Admin', avatarUrl: 'https://i.pravatar.cc/72?img=5' };
  const [query, setQuery] = React.useState('');
  const searchData = [
    { id: 'INV-1024', label: 'Invoice INV-1024', type: 'invoice' },
    { id: 'CUS-342', label: 'Customer: Globex Corp', type: 'customer' },
    { id: 'REP-2025', label: 'Report: Revenue Jan–Jun', type: 'report' }
  ];
  const [unreadCount, setUnreadCount] = React.useState(3);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const notifications = [
    { id: 1, title: 'Payment received', type: 'success', read: false, createdAt: '2025-09-15T10:12:00Z' },
    { id: 2, title: 'Invoice overdue', type: 'warning', read: false, createdAt: '2025-09-14T18:03:00Z' },
    { id: 3, title: 'New user signed up', type: 'info', read: true, createdAt: '2025-09-13T08:45:00Z' }
  ];
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const nav = [
    {
      section: 'Overview',
      items: [
        { label: 'Dashboard', icon: 'home', href: '#', badge: null, permission: 'view_dashboard' }
      ]
    },
    {
      section: 'Billing',
      items: [
        { label: 'Invoices', icon: 'money', href: '#', badge: 2, permission: 'view_invoices' },
        { label: 'Subscriptions', icon: 'repeat', href: '#', permission: 'view_subs' }
      ]
    }
  ];
  const breadcrumbs = [
    { id: '1', text: 'Home' },
    { id: '2', text: 'Dashboard' }
  ];
  const [range, setRange] = React.useState({ start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date() });
  const [exportOpen, setExportOpen] = React.useState(false);

  const kpis = [
    { id: 'mrr', label: 'MRR', value: 120000, delta: 0.052, trendDir: 'up', sparklineData: [95,98,100,102,105,110,115,118,120], lastUpdated: '2025-09-15' },
    { id: 'arr', label: 'ARR', value: 1440000, delta: 0.031, trendDir: 'up', sparklineData: [1300,1320,1330,1350,1375,1390,1400,1420,1440], lastUpdated: '2025-09-15' },
    { id: 'churn', label: 'Churn', value: 0.018, delta: -0.004, trendDir: 'down', sparklineData: [0.025,0.024,0.023,0.022,0.021,0.021,0.02,0.019,0.018], lastUpdated: '2025-09-15' },
    { id: 'arpu', label: 'ARPU', value: 86.40, delta: 0.012, trendDir: 'up', sparklineData: [80,81,82,83,84,84.5,85,86,86.4], lastUpdated: '2025-09-15' }
  ];

  const revenueCategories = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'];
  const [showGross, setShowGross] = React.useState(true);
  const revenueGross = [120,140,135,150,170,180,190,210,230];
  const revenueNet = [100,120,118,130,145,150,160,180,195];

  const [segment, setSegment] = React.useState('New');
  const userGrowthCategories = revenueCategories;
  const userGrowthNew = [40,55,60,70,80,85,90,110,120];
  const userGrowthReturning = [25,27,30,35,40,45,48,50,55];

  const rows = Array.from({ length: 25 }, (_, i) => ({
    id: `TX-${1000 + i}`,
    customer: ['Globex Corp','Initech','Stark Industries','Wayne Enterprises'][i % 4],
    avatar: `https://i.pravatar.cc/40?img=${i+3}`,
    date: new Date(2025, 8, (i % 28) + 1),
    amount: (Math.random() * 1200 + 50).toFixed(2),
    status: ['Paid','Pending','Failed'][i % 3],
    method: ['Card','ACH','PayPal'][i % 3]
  }));
  const [gridPage, setGridPage] = React.useState({ skip: 0, take: 10 });
  const pagedRows = rows.slice(gridPage.skip, gridPage.skip + gridPage.take);

  const [filters, setFilters] = React.useState(['Paid','Card']);

  const footerLinks = [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' }
  ];
  const [locale, setLocale] = React.useState('en-US');

  const [toasts, setToasts] = React.useState([
    { id: 1, type: { style: 'success' }, title: 'Export ready', description: 'CSV has been generated.', duration: 4000 }
  ]);
  const removeToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const [globalLoading, setGlobalLoading] = React.useState(false);

  // Handlers
  const markAllRead = () => { setUnreadCount(0); };
  const onExport = async () => {
    setGlobalLoading(true);
    setTimeout(() => { setGlobalLoading(false); setExportOpen(true); }, 800);
  };

  // Render helpers
  const StatusBadge = ({ status }) => (
    <span className={`px-2 py-1 text-xs rounded-full ${status==='Paid' ? 'bg-green-50 text-green-700' : status==='Pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>{status}</span>
  );

  const FooterItem = (props /** @type {ListViewItemProps} */) => (
    <ListViewItemWrapper className="px-0 py-0">
      <a href="#" className="hover:text-gray-700">{props.dataItem.label}</a>
    </ListViewItemWrapper>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Top AppBar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 justify-between h-16">
            {/* Logo */}
            <a href="#" className="h-8 w-auto flex items-center" aria-label="Home">
              <img className="h-8 w-auto" src="https://dummyimage.com/120x32/1f2937/ffffff&text=SaaS" alt="SaaS" />
            </a>

            {/* Search */}
            <div className="hidden md:block flex-1 max-w-xl">
              <TextBox
                className="w-full"
                value={query}
                onChange={(e) => setQuery(e.value)}
                placeholder="Search invoices, customers, reports…"
                prefix={<span className="k-icon k-i-search text-gray-500" aria-hidden />}
                inputAttributes={{ 'aria-label': 'Global search' }}
              />
              {/* Optional suggestions */}
              {!!query && (
                <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-sm">
                  {searchData.filter(d=>d.label.toLowerCase().includes(query.toLowerCase())).map((d)=> (
                    <div key={d.id} className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm">{d.label}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="relative flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600" aria-label="Help">?</button>

              <button className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600" aria-haspopup="true" aria-expanded={notifOpen}
                onClick={() => setNotifOpen((s)=>!s)}>
                <span role="img" aria-label="Notifications">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full shadow">{unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-sm font-medium">Notifications</span>
                    <Button size="small" fillMode="flat" onClick={markAllRead}>Mark all read</Button>
                  </div>
                  <div className="max-h-64 overflow-auto divide-y">
                    {notifications.map(n => (
                      <div key={n.id} className={`px-2 py-2 text-sm ${n.read ? 'text-gray-600' : 'font-medium'}`}>{n.title}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* User Menu */}
              <div className="ml-1">
                <Menu openOnClick={true} className="">
                  <MenuItem text={
                    <span className="flex items-center gap-2">
                      <Avatar className="h-9 w-9 rounded-full ring-1 ring-gray-200 shadow" shape="circle" type="image" size="large">
                        <img src={user.avatarUrl} alt={`${user.name} avatar`} className="h-9 w-9 rounded-full" />
                      </Avatar>
                      <span className="hidden sm:block text-sm">{user.name}</span>
                    </span>
                  }>
                    <MenuItem text="Profile" />
                    <MenuItem text="Settings" />
                    <MenuItem text="Sign out" />
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Body grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-[${sidebarCollapsed ? '72px' : '280px'}_minmax(0,1fr)] xl:grid-cols-[${sidebarCollapsed ? '80px' : '300px'}_minmax(0,1fr)]`}>
        {/* Sidebar */}
        <aside className="bg-white border-r border-gray-200 hidden md:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Navigation</h3>
            <button className="text-gray-600 hover:text-gray-900" aria-label="Toggle sidebar" onClick={()=>setSidebarCollapsed(s=>!s)}>⇔</button>
          </div>
          <nav className="px-2 py-2 space-y-4">
            {nav.map((group)=> (
              <div key={group.section} className="space-y-1">
                <Label className="px-3 text-xs font-medium text-gray-500 uppercase">{group.section}</Label>
                {group.items.map((item)=> (
                  <a key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                    <span className="k-icon k-i-menu"></span>
                    <span className={`${sidebarCollapsed ? 'hidden' : 'block'}`}>{item.label}</span>
                    {!!item.badge && !sidebarCollapsed && (
                      <span className="ml-auto text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5">{item.badge}</span>
                    )}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <Breadcrumb className="text-sm text-gray-500" data={breadcrumbs} />

            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <div className="flex items-center gap-2">
                <DateRangePicker className="w-full sm:w-auto" value={range} onChange={(e)=> setRange(e.value)} />
                <button onClick={onExport} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition-colors">Export</button>
              </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi)=> (
                <a key={kpi.id} href="#" className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-shadow block">
                  <div className="text-sm font-medium text-gray-600">{kpi.label}</div>
                  <div className="flex items-baseline justify-between mt-2">
                    <div className="text-3xl font-semibold text-gray-900">{kpi.id==='mrr' || kpi.id==='arr' ? kpi.value.toLocaleString(undefined,{ style:'currency', currency:'USD' }) : kpi.id==='churn' ? `${(kpi.value*100).toFixed(1)}%` : kpi.value.toLocaleString()}</div>
                    <span className={`text-sm px-2 py-1 rounded-full ${kpi.trendDir==='up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{kpi.trendDir==='up' ? '↑' : '↓'} {(Math.abs(kpi.delta)*100).toFixed(1)}%</span>
                  </div>
                  <div className="mt-3 h-10">
                    <Sparkline data={kpi.sparklineData} />
                  </div>
                  <Tooltip position="top" showCallout={true}>
                    <span className="mt-2 inline-flex items-center gap-1 text-gray-400" title={`Last updated ${kpi.lastUpdated}`}>i</span>
                  </Tooltip>
                </a>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900">Revenue Trend</h3>
                  <label className="text-gray-700 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={showGross} onChange={(e)=> setShowGross(e.target.checked)} /> Gross / Net
                  </label>
                </div>
                <div className="h-72">
                  <Chart zoomable={true} style={{ height: '18rem' }}>
                    <ChartZoomable selection={{ lock: 'y' }} />
                    <ChartCategoryAxis>
                      <ChartCategoryAxisItem categories={revenueCategories} />
                    </ChartCategoryAxis>
                    <ChartSeries>
                      {showGross && <ChartSeriesItem type="line" data={revenueGross} name="Gross" />}
                      <ChartSeriesItem type="area" data={revenueNet} name="Net" />
                    </ChartSeries>
                    <ChartLegend position="bottom" />
                    <ChartTooltip />
                  </Chart>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900">User Growth</h3>
                  <div className="text-gray-700 text-sm">
                    <Button size="small" fillMode={segment==='New' ? 'solid' : 'flat'} onClick={()=>setSegment('New')}>New</Button>
                    <Button size="small" fillMode={segment==='Returning' ? 'solid' : 'flat'} onClick={()=>setSegment('Returning')} className="ml-1">Returning</Button>
                  </div>
                </div>
                <div className="h-72">
                  <Chart style={{ height: '18rem' }}>
                    <ChartCategoryAxis>
                      <ChartCategoryAxisItem categories={userGrowthCategories} />
                    </ChartCategoryAxis>
                    <ChartSeries>
                      <ChartSeriesItem type="column" data={segment==='New' ? userGrowthNew : userGrowthReturning} name={segment} />
                    </ChartSeries>
                    <ChartLegend position="bottom" />
                    <ChartTooltip />
                  </Chart>
                </div>
              </div>
            </div>

            {/* Transactions Panel */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">Recent Transactions</h3>
                <div className="flex gap-2">
                  {filters.map((f)=> (
                    <span key={f} className="inline-flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 rounded-full">
                      {f}
                      <button aria-label={`Remove ${f}`} onClick={()=> setFilters((prev)=> prev.filter(x=> x!==f))} className="text-gray-500 hover:text-gray-700">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full">
                <DataGrid
                  style={{ maxHeight: '480px' }}
                  data={pagedRows}
                  dataItemKey="id"
                  sortable={true}
                  filterable={true}
                  autoProcessData={true}
                >
                  <GridColumn field="id" title="ID" width="140px" />
                  <GridColumn field="customer" title="Customer" cell={(tdProps) => (
                    <td {...tdProps.tdProps}>
                      <span className="flex items-center gap-2">
                        <img src={tdProps.dataItem.avatar} alt="" className="h-6 w-6 rounded-full" />
                        {tdProps.dataItem.customer}
                      </span>
                    </td>
                  )} />
                  <GridColumn field="date" title="Date" width="160px" cell={(tdProps)=> (
                    <td {...tdProps.tdProps}>{new Date(tdProps.dataItem.date).toLocaleDateString()}</td>
                  )} />
                  <GridColumn field="amount" title="Amount" width="140px" cell={(tdProps)=> (
                    <td {...tdProps.tdProps}>${Number(tdProps.dataItem.amount).toLocaleString()}</td>
                  )} />
                  <GridColumn field="status" title="Status" width="140px" cell={(tdProps)=> (
                    <td {...tdProps.tdProps}><StatusBadge status={tdProps.dataItem.status} /></td>
                  )} />
                  <GridColumn field="method" title="Method" width="140px" />
                </DataGrid>
              </div>
              <div className="mt-4">
                <Pager
                  skip={gridPage.skip}
                  take={gridPage.take}
                  total={rows.length}
                  onPageChange={(e)=> setGridPage({ skip: e.skip, take: e.take })}
                  previousNext={true}
                  type="numeric"
                  pageSizes={[10,20,30]}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex gap-4">
              <ListView data={footerLinks} item={FooterItem} className="flex gap-4" />
            </div>
            <div className="flex items-center gap-3">
              <span>v1.4.2 • Production</span>
              <DropDownList className="min-w-[140px]" data={[{ text:'English (US)', value:'en-US'},{ text:'Deutsch', value:'de-DE'},{ text:'日本語', value:'ja-JP'}]} textField="text" dataItemKey="value" value={ { text: locale, value: locale } } onChange={(e)=> setLocale(e.target.value.value)} />
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <FloatingActionButton
          svgIcon={undefined}
          items={[
            { text: 'Create Invoice' },
            { text: 'Add Customer' },
            { text: 'New Report' }
          ]}
          onItemClick={(e)=> setToasts((t)=> [{ id: Date.now(), type:{ style:'info'}, title: e.item.text, description: 'Opened action', duration: 3000 }, ...t])}
          text="＋"
        />
      </div>

      {/* Notifications */}
      <NotificationGroup style={{ position: 'fixed', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
        {toasts.map(t => (
          <Notification key={t.id} type={t.type} closable={true} onClose={()=>removeToast(t.id)}>
            <span className="font-medium block">{t.title}</span>
            {t.description && <span className="text-sm">{t.description}</span>}
          </Notification>
        ))}
      </NotificationGroup>

      {/* Top loading bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-transparent">
        {globalLoading && <ProgressBar value={30} style={{ height: '2px' }} />}
      </div>

      {/* Export dialog */}
      {exportOpen && (
        <Dialog title="Export Data" onClose={()=> setExportOpen(false)}>
          <div className="space-y-3">
            <Label>Scope</Label>
            <DropDownList data={[ 'Current View', 'All Rows' ]} defaultValue={'Current View'} />
            <Label>Format</Label>
            <DropDownList data={[ 'CSV', 'PDF' ]} defaultValue={'CSV'} />
          </div>
          <DialogActionsBar>
            <Button fillMode="flat" onClick={()=> setExportOpen(false)}>Cancel</Button>
            <Button onClick={()=> { setExportOpen(false); setToasts(t=> [{ id: Date.now(), type:{ style:'success'}, title:'Export started', description:'You will be notified when ready.', duration:3000 }, ...t]); }}>Export</Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  );
}

    
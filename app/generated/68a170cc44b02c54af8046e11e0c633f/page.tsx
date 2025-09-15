
    'use client'; 


    import React from 'react';
import { AppBar, AppBarSection, AppBarSpacer, Avatar, Drawer, DrawerContent, StackLayout, Breadcrumb, TabStrip, TabStripTab, Menu, MenuItem } from '@progress/kendo-react-layout';
import { Button, ButtonGroup, Toolbar, FloatingActionButton } from '@progress/kendo-react-buttons';
import { Badge } from '@progress/kendo-react-indicators';
import { Popup } from '@progress/kendo-react-popup';
import { ListView } from '@progress/kendo-react-listview';
import { Switch } from '@progress/kendo-react-inputs';
import { DropDownList, ComboBox, MultiSelect, AutoComplete } from '@progress/kendo-react-dropdowns';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Pager } from '@progress/kendo-react-data-tools';
import { Card, CardHeader, CardBody, CardFooter } from '@progress/kendo-react-layout';
import { Sparkline, Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartTooltip, ChartZoomable, ChartAxisDefaults, ChartAxisDefaultsCrosshair } from '@progress/kendo-react-charts';
import { DateRangePicker, DatePicker } from '@progress/kendo-react-dateinputs';
import { Dialog } from '@progress/kendo-react-dialogs';
import { NumericTextBox, TextArea, TextBox } from '@progress/kendo-react-inputs';
import { Notification } from '@progress/kendo-react-notification';
import { Tooltip } from '@progress/kendo-react-tooltip';

    function SaaSDashboard() {
  // Mock data
  const brand = { logoUrl: 'https://dummyimage.com/40x40/000/fff.png&text=SA', name: 'SaaSPro' };
  const user = { name: 'Alex Johnson', role: 'Admin', avatarUrl: 'https://i.pravatar.cc/48?img=3' };
  const notifications = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    type: i % 2 ? 'payment' : 'system',
    message: i % 2 ? `Payment received #INV-10${i}` : `System maintenance ${i+1}h notice`,
    createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
    read: i > 2
  }));
  const navigationItems = [
    { text: 'Dashboard', route: '/', selected: true, icon: 'home' },
    { text: 'Invoices', route: '/invoices' },
    { text: 'Customers', route: '/customers' },
    { text: 'Reports', route: '/reports' }
  ];
  const breadcrumbs = [
    { id: '1', text: 'Home' },
    { id: '2', text: 'Dashboard' }
  ];
  const kpis = [
    { label: 'MRR', value: 84500, unit: 'USD', delta: 4.8, trend: 'up', tooltip: 'Monthly Recurring Revenue', series: [64,68,70,72,74,78,84] },
    { label: 'Active Users', value: 12580, unit: '', delta: 2.1, trend: 'up', tooltip: 'Monthly active users', series: [10,10.5,11,11.7,12.1,12.4,12.58] },
    { label: 'Churn', value: 2.3, unit: '%', delta: -0.3, trend: 'down', tooltip: 'Customer churn rate', series: [3.2,3.1,2.9,2.8,2.6,2.4,2.3] },
    { label: 'ARPU', value: 27.4, unit: 'USD', delta: 1.2, trend: 'up', tooltip: 'Avg. revenue per user', series: [24,24.5,25,26,26.5,27,27.4] }
  ];
  const chartMeta = { currency: 'USD', granularity: ['Daily','Weekly','Monthly','Quarterly'] };
  const revenueSeries = Array.from({ length: 12 }).map((_, i) => ({ date: new Date(2025, i, 1), value: 50000 + i * 3800 + (i%2?2500:-1500) }));
  const userGrowthSeries = Array.from({ length: 12 }).map((_, i) => ({ date: new Date(2025, i, 1), value: 800 + i * 120 }));
  const transactions = Array.from({ length: 25 }).map((_, i) => ({
    id: i + 1,
    user: { name: `Customer ${i+1}`, avatarUrl: `https://i.pravatar.cc/40?img=${(i%10)+1}` },
    amount: 49.99 + (i % 5) * 25,
    currency: 'USD',
    status: ['Paid','Pending','Failed','Refunded'][i % 4],
    method: ['Card','Bank','PayPal','Cash'][i % 4],
    createdAt: new Date(Date.now() - i * 86400_000),
    invoiceUrl: `https://example.com/invoices/INV-10${i}`
  }));
  const footerLinks = [
    { text: 'Privacy', url: '#' },
    { text: 'Terms', url: '#' },
    { text: 'Status', url: '#' }
  ];

  // Local state
  const [drawerExpanded, setDrawerExpanded] = React.useState(true);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const notifAnchorRef = React.useRef(null);
  const [granularityIndex, setGranularityIndex] = React.useState(2);
  const [page, setPage] = React.useState({ skip: 0, take: 10, total: 250 });
  const [density, setDensity] = React.useState('comfortable');
  const [themeDark, setThemeDark] = React.useState(false);

  // Helpers
  const currencyFmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });
  const dateFmt = (d) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: undefined }).format(d);

  // Header search mock
  const [searchQuery, setSearchQuery] = React.useState('');
  const searchIndex = React.useMemo(() => (
    ['Invoice INV-1042','User Jane Doe','User John Smith','Invoice INV-1099']
  ), []);
  const filteredSearch = React.useMemo(() => searchIndex.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase())), [searchIndex, searchQuery]);

  return (
    <div className={themeDark ? 'k-theme-dark' : ''}>
      {/* Header */}
      <AppBar positionMode="sticky" className="shadow-md">
        <AppBarSection>
          <StackLayout orientation="horizontal" gap={8} align={{ horizontal: 'start', vertical: 'middle' }}>
            <a href="/" aria-label="Home">
              <Avatar shape="circle" size="small">
                <img src={brand.logoUrl} alt={brand.name} />
              </Avatar>
            </a>
            <a href="/" className="font-semibold">{brand.name}</a>
          </StackLayout>
        </AppBarSection>
        <AppBarSpacer style={{ width: 16 }} />
        <AppBarSection style={{ flex: 1 }}>
          <AutoComplete
            size="small"
            style={{ width: '100%' }}
            placeholder="Search…"
            data={filteredSearch}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.value)}
          />
        </AppBarSection>
        <AppBarSpacer style={{ width: 16 }} />
        <AppBarSection>
          <StackLayout orientation="horizontal" gap={8} align={{ horizontal: 'end', vertical: 'middle' }}>
            <span ref={notifAnchorRef}>
              <Button aria-label="Notifications" fillMode="flat" onClick={() => setNotifOpen((o) => !o)}>
                Notifications
                <Badge themeColor="error">{notifications.filter(n=>!n.read).length}</Badge>
              </Button>
            </span>
            <Popup anchor={notifAnchorRef.current} show={notifOpen} onClose={() => setNotifOpen(false)}>
              <div style={{ width: 320 }} className="p-2 bg-white shadow-lg">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="font-medium">Notifications</span>
                  <Button size="small" fillMode="flat" onClick={() => setNotifOpen(false)}>Close</Button>
                </div>
                <ListView
                  style={{ maxHeight: 280, overflow: 'auto' }}
                  data={notifications}
                  item={(props) => (
                    <div className={`px-3 py-2 ${props.dataItem.read ? 'opacity-60' : ''}`}>
                      <div className="text-sm">{props.dataItem.message}</div>
                      <div className="text-xs text-gray-500">{new Date(props.dataItem.createdAt).toLocaleString()}</div>
                    </div>
                  )}
                />
                <div className="px-2 py-2">
                  <Button size="small">Mark all as read</Button>
                </div>
              </div>
            </Popup>
            <Menu>
              <MenuItem text="Help">
                <MenuItem text="Docs" url="#" />
                <MenuItem text="Contact" url="#" />
              </MenuItem>
            </Menu>
            <Switch ariaLabel="Toggle theme" checked={themeDark} onChange={(e) => setThemeDark(e.value)} />
            <Menu items={[{ text: user.name, items: [{ text: 'Profile' }, { text: 'Settings' }, { text: 'Sign out' }] }]} />
          </StackLayout>
        </AppBarSection>
      </AppBar>

      {/* Body with sidebar */}
      <div className="flex">
        <Drawer
          expanded={drawerExpanded}
          position="start"
          mode="push"
          items={navigationItems}
          onSelect={() => {}}
          mini={!drawerExpanded}
          width={220}
        >
          <DrawerContent>
            <div className="p-3">
              <Button fillMode="flat" onClick={() => setDrawerExpanded((v)=>!v)} aria-expanded={drawerExpanded}>Toggle</Button>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Main content */}
        <main className="flex-1 p-4 space-y-6 overflow-auto">
          <Breadcrumb data={breadcrumbs} />
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <Toolbar>
              <Button>Export</Button>
              <Button>Refresh</Button>
            </Toolbar>
          </div>

          {/* Filters */}
          <Toolbar className="gap-2 flex-wrap">
            <DateRangePicker size="small" />
            <MultiSelect size="small" placeholder="Status" data={[ 'Paid','Pending','Failed','Refunded' ]} />
            <DropDownList size="small" data={[ 'Card','Bank','PayPal','Cash' ]} defaultValue={'Card'} />
            <TextBox placeholder="Search…" size="small" style={{ width: 220 }} />
            <Button themeColor="primary" size="small">Apply</Button>
            <Button size="small">Reset</Button>
          </Toolbar>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <Card key={k.label} className="shadow-sm">
                <CardHeader>
                  <Tooltip>
                    <span title={k.tooltip} className="text-sm font-medium">{k.label}</span>
                  </Tooltip>
                </CardHeader>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold">
                      {k.unit === 'USD' ? currencyFmt.format(k.value) : `${k.value}${k.unit}`}
                    </div>
                    <Badge themeColor={k.trend === 'up' ? 'success' : 'error'}>{`${k.delta}%`}</Badge>
                  </div>
                  <div className="mt-2">
                    <Sparkline data={k.series} type="line" />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <Card className="shadow-sm">
            <CardHeader>
              <TabStrip selected={granularityIndex} onSelect={(e)=>setGranularityIndex(e.selected)}>
                {chartMeta.granularity.map((g, idx) => (
                  <TabStripTab key={g} title={g}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                      <Card className="shadow-sm">
                        <CardHeader>
                          <div className="font-medium">Revenue ({chartMeta.currency})</div>
                        </CardHeader>
                        <CardBody>
                          <Chart style={{ height: 300 }}>
                            <ChartTooltip shared={true} />
                            <ChartZoomable mousewheel={true} />
                            <ChartCategoryAxis>
                              <ChartCategoryAxisItem categories={revenueSeries.map(r=>r.date)} />
                            </ChartCategoryAxis>
                            <ChartSeries>
                              <ChartSeriesItem type="line" data={revenueSeries.map(r=>r.value)} name="Revenue" />
                            </ChartSeries>
                          </Chart>
                        </CardBody>
                        <CardFooter>
                          <Toolbar>
                            <Button>Download</Button>
                            <Button>Export CSV</Button>
                          </Toolbar>
                        </CardFooter>
                      </Card>

                      <Card className="shadow-sm">
                        <CardHeader>
                          <div className="font-medium">User Growth</div>
                        </CardHeader>
                        <CardBody>
                          <Chart style={{ height: 300 }}>
                            <ChartAxisDefaults>
                              <ChartAxisDefaultsCrosshair visible={true} />
                            </ChartAxisDefaults>
                            <ChartTooltip shared={true} />
                            <ChartCategoryAxis>
                              <ChartCategoryAxisItem categories={userGrowthSeries.map(r=>r.date)} />
                            </ChartCategoryAxis>
                            <ChartSeries>
                              <ChartSeriesItem type="column" data={userGrowthSeries.map(r=>r.value)} name="New Users" />
                              <ChartSeriesItem type="line" data={userGrowthSeries.map(r=>r.value*1.1)} name="Active Users" />
                            </ChartSeries>
                          </Chart>
                        </CardBody>
                      </Card>
                    </div>
                  </TabStripTab>
                ))}
              </TabStrip>
            </CardHeader>
          </Card>

          {/* Transactions Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <Toolbar className="gap-2 flex-wrap">
                <DropDownList size="small" data={[10,25,50,100]} value={page.take} onChange={(e)=>setPage(p=>({ ...p, take: e.value }))} />
                <ButtonGroup>
                  <Button selected={density==='compact'} onClick={()=>setDensity('compact')}>Compact</Button>
                  <Button selected={density!=='compact'} onClick={()=>setDensity('comfortable')}>Comfortable</Button>
                </ButtonGroup>
                <MultiSelect size="small" placeholder="Columns" data={[ 'User','Amount','Status','Method','Date','Actions' ]} />
                <Button>Export CSV</Button>
              </Toolbar>
            </CardHeader>
            <CardBody>
              <Grid
                data={transactions.slice(page.skip, page.skip + page.take)}
                dataItemKey="id"
                style={{ maxHeight: 520 }}
                size={density==='compact' ? 'small' : 'medium'}
                sortable
                scrollable
              >
                <GridColumn field="user.name" title="User" width={220} cell={(td) => (
                  <td.style {...td.tdProps}>
                    <div className="flex items-center gap-2">
                      <Avatar size="small">
                        <img src={td.dataItem.user.avatarUrl} alt={td.dataItem.user.name} />
                      </Avatar>
                      <span>{td.dataItem.user.name}</span>
                    </div>
                  </td.style>
                )} />
                <GridColumn field="amount" title="Amount" width={140} cell={(td)=>(
                  <td.style {...td.tdProps} className="text-right">{currencyFmt.format(td.dataItem.amount)}</td.style>
                )} />
                <GridColumn field="status" title="Status" width={140} cell={(td)=>(
                  <td.style {...td.tdProps}>
                    <Badge themeColor={td.dataItem.status==='Paid'?'success':td.dataItem.status==='Pending'?'warning':td.dataItem.status==='Refunded'?'info':'error'}>{td.dataItem.status}</Badge>
                  </td.style>
                )} />
                <GridColumn field="method" title="Method" width={120} />
                <GridColumn field="createdAt" title="Date" width={160} cell={(td)=>(
                  <td.style {...td.tdProps}>
                    <Tooltip>
                      <span title={new Date(td.dataItem.createdAt).toISOString()}>{dateFmt(td.dataItem.createdAt)}</span>
                    </Tooltip>
                  </td.style>
                )} />
                <GridColumn title="Actions" width={180} cell={(td)=>(
                  <td.style {...td.tdProps}>
                    <div className="flex items-center gap-2">
                      <a href={td.dataItem.invoiceUrl} target="_blank" rel="noreferrer" className="text-primary-600">View</a>
                      <Button size="small">Refund</Button>
                    </div>
                  </td.style>
                )} />
              </Grid>
            </CardBody>
            <CardFooter>
              <Pager
                skip={page.skip}
                take={page.take}
                total={page.total}
                onPageChange={(e)=>setPage({ skip: e.skip, take: e.take, total: page.total })}
              />
            </CardFooter>
          </Card>
        </main>
      </div>

      {/* Footer */}
      <footer className="px-4 py-3 border-t flex items-center justify-between">
        <Menu items={footerLinks.map(f=>({ text: f.text, url: f.url }))} />
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">v1.2.3</span>
          <DropDownList size="small" data={['en-US','de-DE','fr-FR']} defaultValue={'en-US'} />
        </div>
      </footer>

      {/* Quick Actions (FAB) */}
      <FloatingActionButton position={{ horizontal: 'end', vertical: 'bottom' }} align={{ horizontal: 'end', vertical: 'bottom' }} style={{ position: 'fixed', right: 24, bottom: 24 }} items={[
        { text: 'Create Invoice' },
        { text: 'Add Customer' },
        { text: 'Record Payment' }
      ]} />

      {/* Global notification slot example */}
      <div className="fixed right-4 top-4 space-y-2">
        <Notification type={{ style: 'success' }} closable={true}><span>Welcome back, {user.name}!</span></Notification>
      </div>
    </div>
  );
}

export default SaaSDashboard;
    
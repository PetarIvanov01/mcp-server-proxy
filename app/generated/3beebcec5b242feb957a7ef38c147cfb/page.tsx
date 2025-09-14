
    'use client'; 


    import React from 'react';
import { AppBar, AppBarSection, AppBarSpacer, Card, CardHeader, CardBody, PanelBar, PanelBarItem, Avatar as KendoAvatar, Breadcrumb } from '@progress/kendo-react-layout';
import { StackLayout } from '@progress/kendo-react-layout';
import { Button, DropDownButton, Chip } from '@progress/kendo-react-buttons';
import { Badge } from '@progress/kendo-react-indicators';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { AutoComplete } from '@progress/kendo-react-dropdowns';
import { ListView } from '@progress/kendo-react-listview';
import { Switch } from '@progress/kendo-react-inputs';
import { Menu } from '@progress/kendo-react-layout';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { DateRangePicker } from '@progress/kendo-react-dateinputs';
import { Input } from '@progress/kendo-react-inputs';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Pager } from '@progress/kendo-react-data-tools';
import { Sparkline } from '@progress/kendo-react-charts';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartLegend, ChartTooltip as KChartTooltip, ChartArea } from '@progress/kendo-react-charts';
import { SvgIcon } from '@progress/kendo-react-common';
import { plusIcon, bellIcon, questionCircleIcon, downloadIcon } from '@progress/kendo-svg-icons';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Skeleton } from '@progress/kendo-react-indicators';

    export default function SaaSDashboardShell() {
  const [themeDark, setThemeDark] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifItems, setNotifItems] = React.useState([
    { id: 1, title: 'Payment received', snippet: 'Invoice #1842 paid', timestamp: '2m', read: false },
    { id: 2, title: 'New signup', snippet: 'Alice joined plan Pro', timestamp: '1h', read: false },
    { id: 3, title: 'Export ready', snippet: 'Your CSV export is complete', timestamp: '3h', read: true }
  ]);
  const unread = notifItems.filter(n => !n.read).length;
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const user = { name: 'Jordan Lee', role: 'Admin', avatarUrl: 'https://i.pravatar.cc/80?img=13' };
  const orgs = [
    { id: 'acme', name: 'Acme Inc.', logo: 'https://dummyimage.com/24x24/111827/ffffff&text=A' },
    { id: 'globex', name: 'Globex', logo: 'https://dummyimage.com/24x24/2563eb/ffffff&text=G' },
    { id: 'initech', name: 'Initech', logo: 'https://dummyimage.com/24x24/16a34a/ffffff&text=I' }
  ];
  const [org, setOrg] = React.useState(orgs[0]);
  const [globalSearch, setGlobalSearch] = React.useState('');
  const searchData = ['Customers', 'Invoices', 'Transactions', 'MRR Report', 'AR Aging', 'Settings'];

  // Filters
  const [dateRange, setDateRange] = React.useState({ start: new Date(new Date().setDate(new Date().getDate()-29)), end: new Date() });
  const segments = [
    { id: 'all', label: 'All segments' },
    { id: 'pro', label: 'Pro' },
    { id: 'enterprise', label: 'Enterprise' },
    { id: 'trial', label: 'Trial' }
  ];
  const [segment, setSegment] = React.useState(segments[0]);
  const [keyword, setKeyword] = React.useState('');

  // KPI mock
  const kpis = [
    { key: 'MRR', title: 'Monthly Recurring Revenue', value: 128540, delta: 5.2, series: [95,98,102,105,110,115,118,120,122,128], note: 'MRR = sum of monthly subscription revenue' },
    { key: 'ARR', title: 'Annual Recurring Revenue', value: 1542480, delta: 4.1, series: [1200,1240,1290,1330,1380,1420,1470,1490,1520,1542] },
    { key: 'ACTIVE', title: 'Active Users', value: 18432, delta: 2.7, series: [15,15.2,15.6,16,16.4,16.9,17.3,17.9,18.2,18.4] },
    { key: 'CHURN', title: 'Churn Rate', value: 3.1, delta: -0.4, series: [4.2,4.1,3.9,3.8,3.6,3.5,3.3,3.2,3.1,3.1] }
  ];

  // Charts mock
  const categories = Array.from({length: 30}, (_,i)=>`Day ${i+1}`);
  const revenueSeries = [
    { name: 'MRR', data: [95,96,98,99,100,102,104,105,106,108,110,112,113,115,116,118,119,120,121,123,124,125,126,127,128,129,130,131,132,133] },
    { name: 'Expansion', data: [5,5,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20] }
  ];
  const [showLegend, setShowLegend] = React.useState(true);
  const [userChartType, setUserChartType] = React.useState('area');

  // Grid mock
  const [txPage, setTxPage] = React.useState({ skip: 0, take: 10 });
  const [txSearch, setTxSearch] = React.useState('');
  const txAll = Array.from({ length: 128 }).map((_, i) => ({
    id: i+1,
    date: new Date(2025, 8, 1 + (i%28)),
    customer: { name: `Customer ${i+1}`, avatar: `https://i.pravatar.cc/40?img=${(i%70)+1}` },
    plan: ['Pro','Enterprise','Starter'][i%3],
    amount: ((i%5)+1) * 49.0 + (i%3)*10,
    status: ['Paid','Pending','Failed'][i%3],
    method: ['Card','PayPal','Bank'][i%3]
  }));
  const filteredTx = txAll.filter(r => r.customer.name.toLowerCase().includes(txSearch.toLowerCase()));
  const pageData = filteredTx.slice(txPage.skip, txPage.skip + txPage.take);

  // Notification/Toasts
  const [toasts, setToasts] = React.useState([{ id: 't1', type: 'success', text: 'Welcome back!' }]);
  const removeToast = id => setToasts(prev => prev.filter(t => t.id !== id));

  // Dialog
  const [dialog, setDialog] = React.useState({ open: false, title: '', action: '' });

  const formatCurrency = v => v.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

  return (
    <div className={`min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}>
      {/* Header */}
      <AppBar className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <AppBarSection>
          <div className="flex items-center gap-3">
            <KendoAvatar type="image" rounded="medium">
              <img className="h-8 w-8 rounded-md shadow-sm" src="https://dummyimage.com/64x64/111827/ffffff&text=A" alt="Acme" />
            </KendoAvatar>
            <span className="text-lg font-semibold tracking-tight">Acme Analytics</span>
          </div>
        </AppBarSection>
        <AppBarSpacer style={{ width: 16 }} />
        <AppBarSection className="hidden md:flex flex-1 max-w-xl mx-6">
          <AutoComplete
            className="w-full"
            data={searchData}
            placeholder="Search..."
            value={globalSearch}
            onChange={e => setGlobalSearch(e.value)}
            clearButton
          />
        </AppBarSection>
        <AppBarSpacer />
        <AppBarSection className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <Button fillMode="flat" onClick={()=>setNotifOpen(p=>!p)} className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Notifications">
              <SvgIcon icon={bellIcon} />
            </Button>
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full shadow">{unread}</span>
            )}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2">
                <ListView
                  className="divide-y divide-gray-200 dark:divide-gray-700"
                  data={notifItems}
                  item={(props)=> {
                    const it = props.dataItem;
                    return (
                      <div className="p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" onClick={()=>{
                        setNotifItems(prev=>prev.map(n=> n.id===it.id ? { ...n, read: true } : n));
                        setNotifOpen(false);
                      }}>
                        <div className="flex items-start justify-between">
                          <div className="font-medium">{it.title}</div>
                          <span className="text-xs text-gray-500">{it.timestamp}</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{it.snippet}</div>
                        {!it.read && <span className="inline-block mt-1 h-2 w-2 rounded-full bg-blue-600" />}
                      </div>
                    );
                  }}
                />
              </div>
            )}
          </div>
          <Button fillMode="flat" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" onClick={()=>setHelpOpen(p=>!p)} aria-label="Help">
            <SvgIcon icon={questionCircleIcon} />
          </Button>
          <Switch className="mx-2" checked={themeDark} onChange={(e)=>setThemeDark(e.value)} ariaLabel="Toggle theme" />
          <div className="relative flex items-center gap-2">
            <KendoAvatar type="image" rounded="full" border>
              <img className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800" src={user.avatarUrl} alt={user.name} />
            </KendoAvatar>
            <DropDownButton
              text={`${user.name} • ${user.role}`}
              items={[{ text: 'Profile' }, { text: 'Settings' }, { text: 'Sign out' }]}
              onItemClick={(e)=>{
                if (e.item?.text === 'Sign out') setToasts(prev=>[{ id: Date.now()+'' , type:'info', text:'Signing out...' }, ...prev]);
              }}
            />
          </div>
        </AppBarSection>
      </AppBar>

      {/* Body: Sidebar + Main */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-white dark:bg-gray-850 border-r border-gray-200 dark:border-gray-700 transition-all duration-200">
          <div className="m-3 self-end">
            <Button fillMode="flat" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Collapse sidebar">≡</Button>
          </div>
          <div className="mx-3 mb-2">
            <DropDownList
              data={orgs}
              textField="name"
              dataItemKey="id"
              value={org}
              onChange={(e)=>setOrg(e.value)}
              valueRender={(el, value)=> (
                <div className="flex items-center gap-2">
                  <img src={value.logo} alt="logo" className="h-4 w-4 rounded" />
                  <span>{value.name}</span>
                </div>
              )}
              itemRender={(li, itemProps)=> React.cloneElement(li, {}, (
                <div className="flex items-center gap-2">
                  <img src={itemProps.dataItem.logo} alt="logo" className="h-4 w-4 rounded" />
                  <span>{itemProps.dataItem.name}</span>
                </div>
              ))}
            />
          </div>
          <nav className="flex-1 overflow-y-auto px-2">
            <StackLayout orientation="vertical" gap={8}>
              <a className="px-2 py-2 rounded-md bg-gray-100 dark:bg-gray-700 font-medium" href="#">Dashboard</a>
              <a className="px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" href="#">Analytics</a>
              <a className="px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" href="#">Transactions</a>
              <a className="px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" href="#">Customers</a>
              <a className="px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" href="#">Billing</a>
              <a className="px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" href="#">Settings</a>
            </StackLayout>
          </nav>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500">v2.3.1</div>
            <ProgressBar value={62} labelVisible className="mt-2" />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Page header */}
          <section className="px-4 sm:px-6 lg:px-10 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <Breadcrumb data={[{ id:'home', text:'Home' }, { id:'dash', text:'Dashboard' }]} />
              </div>
              <div className="flex items-center gap-2">
                <Button className="bg-gray-900 hover:bg-black text-white px-3 py-2 rounded-md dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white" onClick={()=> setToasts(prev=>[{ id: Date.now()+'' , type:'success', text:'Data refreshed' }, ...prev])}>Refresh</Button>
                <DropDownButton
                  className="relative"
                  text="Export"
                  items={[{ text: 'CSV' }, { text: 'XLSX' }, { text: 'PDF' }]}
                  onItemClick={(e)=> setToasts(prev=>[{ id: Date.now()+'' , type:'info', text:`Exporting ${e.item.text}...` }, ...prev])}
                />
              </div>
            </div>
            {/* Filters */}
            <Form
              initialValues={{}}
              render={() => (
                <FormElement>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DateRangePicker className="w-full" value={dateRange} onChange={(e)=> setDateRange(e.value)} />
                    <DropDownList className="w-full" data={segments} textField="label" dataItemKey="id" value={segment} onChange={(e)=> setSegment(e.value)} />
                    <Input className="w-full" value={keyword} onChange={(e)=> setKeyword(e.value)} placeholder="Keyword search" />
                  </div>
                </FormElement>
              )}
            />
          </section>

          {/* KPI Grid */}
          <section className="px-4 sm:px-6 lg:px-10 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {kpis.map(k => (
                <Tooltip key={k.key} content={k.note}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{k.title}</div>
                    <div className="mt-2 text-3xl font-semibold">{k.key==='CHURN' ? `${k.value.toFixed(1)}%` : formatCurrency(k.value)}</div>
                    <div className={`mt-1 flex items-center gap-2 ${k.delta>=0 ? 'text-green-600' : 'text-red-600'}`}>{k.delta>=0?'▲':'▼'} {Math.abs(k.delta).toFixed(1)}%</div>
                    <div className="mt-3 h-10">
                      <Sparkline type="area" data={k.series} transitions={true} style={{ height: '40px', width: '100%' }} />
                    </div>
                  </div>
                </Tooltip>
              ))}
            </div>
          </section>

          {/* Charts Row */}
          <section className="px-4 sm:px-6 lg:px-10 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold">Revenue Trend</h3>
                  <div className="flex items-center gap-2">
                    <Chip text="Last 30 days" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200" />
                    <Switch checked={showLegend} onChange={(e)=>setShowLegend(e.value)} ariaLabel="Legend" />
                    <Button className="px-3 py-1.5 rounded-md bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900" onClick={()=> setToasts(prev=>[{ id: Date.now()+'' , type:'success', text:'Chart image downloaded' }, ...prev])}>
                      <SvgIcon icon={downloadIcon} />
                    </Button>
                  </div>
                </div>
                <Chart style={{ height: 288 }}>
                  <ChartArea background="transparent" />
                  <ChartLegend visible={showLegend} />
                  <KChartTooltip shared={true} />
                  <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={categories} />
                  </ChartCategoryAxis>
                  <ChartSeries>
                    {revenueSeries.map(s => (
                      <ChartSeriesItem key={s.name} type="line" data={s.data} name={s.name} />
                    ))}
                  </ChartSeries>
                </Chart>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold">User Growth</h3>
                  <div className="flex items-center gap-2">
                    <Button className="px-3 py-1.5 rounded-md border" onClick={()=>setUserChartType('area')}>Area</Button>
                    <Button className="px-3 py-1.5 rounded-md border" onClick={()=>setUserChartType('bar')}>Bar</Button>
                    <Button className="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700" onClick={()=>{/* reset zoom noop in demo */}}>Reset</Button>
                  </div>
                </div>
                <Chart style={{ height: 288 }}>
                  <ChartArea background="transparent" />
                  <KChartTooltip shared={true} />
                  <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={categories} />
                  </ChartCategoryAxis>
                  <ChartSeries>
                    <ChartSeriesItem type={userChartType} data={revenueSeries[0].data.map(v=> v*120)} name="Users" />
                  </ChartSeries>
                </Chart>
              </div>
            </div>
          </section>

          {/* Transactions Table */}
          <section className="px-4 sm:px-6 lg:px-10 pb-24">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">Recent Transactions</h3>
              <div className="flex items-center gap-3">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{filteredTx.length}</span>
                <Input className="w-56" value={txSearch} onChange={(e)=>{ setTxSearch(e.value); setTxPage(p=>({ ...p, skip: 0 })); }} placeholder="Search transactions" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <Grid data={pageData} dataItemKey="id" autoProcessData={true} style={{ width: '100%' }}>
                <GridToolbar>
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2 w-full">
                    <Button className="px-3 py-1.5 rounded-md bg-red-600 text-white">Refund</Button>
                    <Button className="px-3 py-1.5 rounded-md bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900">Export</Button>
                    <Button className="px-3 py-1.5 rounded-md border">Tag</Button>
                  </div>
                </GridToolbar>
                <Column field="date" title="Date" format="{0:MM/dd/yyyy}" />
                <Column field="customer.name" title="Customer" cell={(props)=>{
                  const it = props.dataItem;
                  return (
                    <td className={props.tdProps?.className} style={props.tdProps?.style}>
                      <div className="flex items-center gap-2"><img src={it.customer.avatar} alt={it.customer.name} className="h-6 w-6 rounded-full" />{it.customer.name}</div>
                    </td>
                  );
                }} />
                <Column field="plan" title="Plan" />
                <Column field="amount" title="Amount" className="text-right" cell={(p)=> (<td className="text-right">{formatCurrency(p.dataItem.amount)}</td>)} />
                <Column field="status" title="Status" cell={(p)=> (
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${p.dataItem.status==='Paid' ? 'bg-green-100 text-green-700' : p.dataItem.status==='Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{p.dataItem.status}</span>
                  </td>
                )} />
                <Column field="method" title="Method" />
                <Column title="Actions" cell={()=> (<td className="text-right"><Button fillMode="flat">•••</Button></td>)} />
              </Grid>
              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <Pager
                  skip={txPage.skip}
                  take={txPage.take}
                  total={filteredTx.length}
                  onPageChange={(e)=> setTxPage({ skip: e.skip, take: e.take })}
                  previousNext
                  type="numeric"
                  pageSizes={[10,20,50]}
                  adaptive
                />
              </div>
            </div>
          </section>
        </main>

        {/* FAB */}
        <div className="fixed bottom-6 right-6">
          <Button className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center" onClick={()=> setUserMenuOpen(p=>!p)} aria-label="Quick actions">
            <SvgIcon icon={plusIcon} />
          </Button>
          {userMenuOpen && (
            <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden">
              <StackLayout orientation="vertical" gap={0}>
                {['Create invoice','Add customer','Record payment','New report'].map(text => (
                  <button key={text} className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-left" onClick={()=> setDialog({ open: true, title: text, action: text })}>{text}</button>
                ))}
              </StackLayout>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-10 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-sm text-gray-500">© 2025 Acme Inc.</span>
          <a href="#status" className="px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">All systems operational</a>
          <div className="flex items-center gap-3">
            <DropDownList className="min-w-32" data={[{code:'en',label:'English'},{code:'es',label:'Español'}]} textField="label" dataItemKey="code" defaultValue={{code:'en',label:'English'}} />
            <a href="#shortcuts" className="text-sm text-blue-600 hover:underline" onClick={()=> setDialog({ open: true, title: 'Keyboard Shortcuts', action: 'shortcuts' })}>Keyboard shortcuts</a>
          </div>
        </div>
      </footer>

      {/* Toasts */}
      <NotificationGroup style={{ position:'fixed', top: 16, right: 16, zIndex: 50, gap: 8, display:'flex', flexDirection:'column' }}>
        {toasts.map(t => (
          <Notification key={t.id} type={{ style: t.type, icon: true }} closable onClose={()=>removeToast(t.id)}>
            <span>{t.text}</span>
          </Notification>
        ))}
      </NotificationGroup>

      {/* Global Dialog */}
      {dialog.open && (
        <Dialog title={dialog.title} onClose={()=> setDialog({ open:false, title:'', action:'' })} className="z-50">
          <p className="mb-4 text-sm text-gray-700 dark:text-gray-200">This is a placeholder form for “{dialog.action}”.</p>
          <FieldWrapper>
            <Input placeholder="Name" />
          </FieldWrapper>
          <FieldWrapper>
            <Input placeholder="Notes" />
          </FieldWrapper>
          <DialogActionsBar>
            <Button onClick={()=> setDialog({ open:false, title:'', action:'' })}>Cancel</Button>
            <Button themeColor="primary" onClick={()=> { setDialog({ open:false, title:'', action:'' }); setToasts(prev=>[{ id: Date.now()+'' , type:'success', text:`${dialog.action} saved` }, ...prev]); }}>Save</Button>
          </DialogActionsBar>
        </Dialog>
      )}

      {/* Skeleton placeholder (hidden) */}
      <div className="hidden">
        <Skeleton shape={'rectangle'} style={{ width: '100%', height: 120 }} />
      </div>
    </div>
  );
}

    
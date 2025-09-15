
    'use client'; 


    import * as React from 'react';
import { AppBar, AppBarSection, AppBarSpacer, StackLayout, TabStrip, TabStripTab, Drawer, DrawerContent, Stepper } from '@progress/kendo-react-layout';
import { Avatar } from '@progress/kendo-react-layout';
import { Menu } from '@progress/kendo-react-layout';
import { Breadcrumb } from '@progress/kendo-react-layout';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { Card } from '@progress/kendo-react-layout';
import { Button, ButtonGroup, FloatingActionButton, Chip } from '@progress/kendo-react-buttons';
import { TextBox, NumericTextBox, Switch, TextArea, RadioGroup } from '@progress/kendo-react-inputs';
import { AutoComplete, DropDownList, MultiSelect } from '@progress/kendo-react-dropdowns';
import { ListView } from '@progress/kendo-react-listview';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Pager } from '@progress/kendo-react-data-tools';
import { RangeSlider } from '@progress/kendo-react-inputs';
import { DateRangePicker } from '@progress/kendo-react-dateinputs';
import { Upload } from '@progress/kendo-react-upload';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Skeleton } from '@progress/kendo-react-indicators';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartLegend, ChartSeriesDefaults } from '@progress/kendo-react-charts';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import 'hammerjs';

    export default function RealEstateDashboard() {
  // Mock data
  const navItems = [
    { text: 'Dashboard' },
    { text: 'Listings' },
    { text: 'Clients' },
    { text: 'Analytics' },
    { text: 'Tasks' },
    { text: 'Settings' }
  ];
  const locations = ['San Francisco, CA', '94110', 'Noe Valley', 'Mission, SF', 'Oakland, CA'];
  const bedsOptions = ['Any', '1+', '2+', '3+', '4+', '5+'];
  const bathsOptions = ['Any', '1+', '2+', '3+'];
  const statusOptions = ['Active', 'Pending', 'Sold'];
  const sortByOptions = [
    { text: 'Price', value: 'price' },
    { text: 'Date', value: 'date' },
    { text: 'Days on Market', value: 'dom' }
  ];
  const propertyTypes = ['House', 'Condo', 'Townhome', 'Multi-family', 'Land'];
  const savedSearches = [
    { id: 1, name: 'Family Homes in 94110', chips: ['3+ beds', '2+ baths'], lastRun: '2d ago' },
    { id: 2, name: 'Condos under $800k', chips: ['Condo', 'Max $800k'], lastRun: '5d ago' }
  ];
  const listings = [
    {
      id: 'ls-1',
      title: '123 Main St, San Francisco, CA',
      status: 'Active',
      price: 1250000,
      facts: '3 bd • 2 ba • 1,450 sqft • Built 1995',
      note: 'Sunny Noe Valley home with updated kitchen and landscaped yard.',
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop'],
    }
  ];
  const kpiSeries = [1.02, 1.05, 1.03, 1.06, 1.05];
  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const clientRows = [
    { id: 1, name: 'Jane Smith', stage: 'Active', budget: 900000, area: 'Mission, SF', lastContact: '2025-09-10', agent: 'A. Johnson', nextTask: 'Schedule tour' },
    { id: 2, name: 'Robert Lee', stage: 'Nurture', budget: 1200000, area: 'Noe Valley', lastContact: '2025-09-07', agent: 'J. Chen', nextTask: 'Send comps' }
  ];

  // Local UI state
  const [viewMode, setViewMode] = React.useState<'grid' | 'map'>('grid');
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [sortBy, setSortBy] = React.useState(sortByOptions[0]);
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc');
  const [priceMin, setPriceMin] = React.useState<number | null>(null);
  const [priceMax, setPriceMax] = React.useState<number | null>(null);
  const [keyword, setKeyword] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [beds, setBeds] = React.useState(bedsOptions[0]);
  const [baths, setBaths] = React.useState(bathsOptions[0]);
  const [filtersOpenHouse, setFiltersOpenHouse] = React.useState(false);
  const [filters, setFilters] = React.useState({ range: { start: 400000, end: 1500000 }, sqft: null as number | null, lot: null as number | null, year: null as number | null, domMax: null as number | null, hoaMax: null as number | null, status: statusOptions[0], types: [] as string[], keywords: '' });
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [newListingOpen, setNewListingOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [notif, setNotif] = React.useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  // Handlers
  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setNotif({ type: 'success', text: 'Search applied.' });
  };
  const clearAll = () => {
    setPriceMin(null); setPriceMax(null); setBeds('Any'); setBaths('Any'); setKeyword(''); setLocation('');
  };
  const applyFilters = (e: React.FormEvent) => { e.preventDefault(); setNotif({ type: 'success', text: 'Filters applied.' }); };

  // Utilities
  const currency = (v?: number | null) => (v == null ? '' : v.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-2 text-xl font-semibold text-blue-700" aria-label="Acme Realty home">
            <Avatar type="text" rounded="full" size="large">AR</Avatar>
            <span>Acme Realty</span>
          </a>

          <nav className="hidden md:flex items-center gap-4" aria-label="Primary">
            <Menu items={navItems} />
          </nav>

          <form onSubmit={onSubmitSearch} className="hidden lg:flex items-center gap-2 flex-1 max-w-2xl" role="search" aria-label="Quick property search">
            <AutoComplete className="w-56" data={locations} value={location} onChange={(e) => setLocation(e.value)} placeholder="City, ZIP, neighborhood" filterable />
            <TextBox className="w-52" value={keyword} onChange={(e) => setKeyword(e.value)} placeholder="Keywords / MLS ID" />
            <NumericTextBox className="w-32" value={priceMin ?? undefined} onChange={(e) => setPriceMin(e.value)} format="c0" placeholder="Min" />
            <NumericTextBox className="w-32" value={priceMax ?? undefined} onChange={(e) => setPriceMax(e.value)} format="c0" placeholder="Max" />
            <DropDownList className="w-28" data={bedsOptions} value={beds} onChange={(e) => setBeds(e.value)} />
            <DropDownList className="w-28" data={bathsOptions} value={baths} onChange={(e) => setBaths(e.value)} />
            <Button themeColor="primary" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Search</Button>
          </form>

          <div className="hidden md:inline-flex">
            <ButtonGroup>
              <Button togglable selected={viewMode==='grid'} onClick={() => setViewMode('grid')} aria-pressed={viewMode==='grid'}>Grid</Button>
              <Button togglable selected={viewMode==='map'} onClick={() => setViewMode('map')} aria-pressed={viewMode==='map'}>Map</Button>
            </ButtonGroup>
          </div>

          <div className="flex items-center gap-3">
            <Button fillMode="flat" className="relative p-2 rounded-full hover:bg-gray-100" aria-label="Notifications">
              Notifications
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center text-xs bg-red-600 text-white rounded-full px-1.5">3</span>
            </Button>
            <DropDownList data={["Profile","Team","Billing","Logout"]} defaultValue={'Profile'} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Saved Searches */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 font-medium">Saved Searches</div>
            <ListView
              className="divide-y divide-gray-100"
              data={savedSearches}
              item={(props) => (
                <div className="px-4 py-3 flex items-start justify-between gap-2">
                  <div className="text-sm">
                    <div className="text-sm font-medium text-gray-900">{props.dataItem.name}</div>
                    <div className="text-xs text-gray-500">Last run {props.dataItem.lastRun}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {props.dataItem.chips.map((c:string) => <Chip key={c} text={c} />)}
                    <Button size="small" fillMode="link" className="text-sm text-blue-600 hover:underline">Load</Button>
                  </div>
                </div>
              )}
            />
          </section>

          {/* Filters */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={applyFilters} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price Range</label>
                <RangeSlider className="w-full" min={100000} max={5000000} step={50000} value={filters.range} onChange={(e) => setFilters({ ...filters, range: e.value })} />
                <div className="mt-1 text-xs text-gray-600">{currency(filters.range.start)} – {currency(filters.range.end)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Beds</label>
                <RadioGroup className="flex gap-3" data={['1+','2+','3+','4+','5+']} value={beds} onChange={(e) => setBeds(e.value)} layout="horizontal" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Baths</label>
                <RadioGroup className="flex gap-3" data={['1+','2+','3+']} value={baths} onChange={(e) => setBaths(e.value)} layout="horizontal" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Property Type</label>
                <MultiSelect className="w-full" data={propertyTypes} value={filters.types} onChange={(e) => setFilters({ ...filters, types: e.value })} placeholder="Select types" />
              </div>
              <DropDownList className="w-full" data={statusOptions} value={filters.status} onChange={(e)=>setFilters({ ...filters, status: e.value })} label={"Status"} />
              <NumericTextBox className="w-full" value={filters.sqft ?? undefined} onChange={(e)=>setFilters({ ...filters, sqft: e.value })} placeholder="Min Sqft" />
              <NumericTextBox className="w-full" value={filters.lot ?? undefined} onChange={(e)=>setFilters({ ...filters, lot: e.value })} placeholder="Min Lot (sqft)" />
              <NumericTextBox className="w-full" value={filters.year ?? undefined} onChange={(e)=>setFilters({ ...filters, year: e.value })} placeholder="Year built min" />
              <div className="flex items-center justify-between">
                <span className="text-sm">Open house only</span>
                <Switch checked={filtersOpenHouse} onChange={(e)=>setFiltersOpenHouse(e.value)} />
              </div>
              <NumericTextBox className="w-full" value={filters.domMax ?? undefined} onChange={(e)=>setFilters({ ...filters, domMax: e.value })} placeholder="Days on market max" />
              <NumericTextBox className="w-full" value={filters.hoaMax ?? undefined} onChange={(e)=>setFilters({ ...filters, hoaMax: e.value })} format="c0" placeholder="HOA fee max" />
              <TextArea className="w-full" value={filters.keywords} onChange={(e)=>setFilters({ ...filters, keywords: e.value })} placeholder="Keywords" autoSize />
              <div className="flex items-center gap-2 pt-2">
                <Button themeColor="primary" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Apply</Button>
                <Button type="button" onClick={()=>{setFilters({ ...filters, types: [], status: statusOptions[0], sqft:null, lot:null, year:null, domMax:null, hoaMax:null, keywords:'', range:{start:400000,end:1500000}});}} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md">Reset</Button>
                <Button type="button" onClick={()=>setConfirmOpen(true)} className="text-blue-700 hover:text-blue-800 px-3 py-2">Save Search</Button>
              </div>
            </form>
          </section>
        </aside>

        {/* Content */}
        <section className="lg:col-span-9 space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-wrap items-center gap-3">
            <Breadcrumb className="text-sm text-gray-600" data={[{ id: '1', text: 'Dashboard' }, { id: '2', text: 'Listings' }]} />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">245 results</span>
              <Chip text="3+ beds" onRemove={() => setBeds('Any')} removable />
              <Button fillMode="link" className="text-sm text-blue-700 hover:underline" onClick={clearAll}>Clear all</Button>
            </div>
            <form className="ml-auto flex items-center gap-2">
              <DropDownList className="w-40" data={sortByOptions} textField="text" dataItemKey="value" value={sortBy} onChange={(e)=>setSortBy(e.value)} />
              <ButtonGroup>
                <Button togglable selected={sortDir==='asc'} onClick={()=>setSortDir('asc')}>Asc</Button>
                <Button togglable selected={sortDir==='desc'} onClick={()=>setSortDir('desc')}>Desc</Button>
              </ButtonGroup>
            </form>
            <div className="w-full">
              <TabStrip selected={selectedTab} onSelect={(e)=>setSelectedTab(e.selected)} scrollable>
                <TabStripTab title="Properties">
                  <div className="space-y-4">
                    {viewMode === 'map' && (
                      <div className="h-72 w-full rounded-lg overflow-hidden bg-gray-200" />
                    )}
                    {/* Property cards grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {listings.map((l)=> (
                        <div key={l.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden relative">
                          <div className="h-48 bg-black">
                            <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" />
                          </div>
                          <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">{l.status}</span>
                          <div className="px-4 pt-3 text-lg font-semibold">{l.title}</div>
                          <div className="px-4 text-sm text-gray-700">{currency(l.price)} • {l.facts}</div>
                          <div className="px-4 pb-2 text-sm text-gray-600 line-clamp-2">{l.note}</div>
                          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
                            <ButtonGroup className="flex items-center gap-2">
                              <Button size="small">Fav</Button>
                              <Button size="small">Share</Button>
                              <Button size="small">Contact</Button>
                            </ButtonGroup>
                            <Button size="small" themeColor="primary" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md" onClick={()=>setDrawerOpen(true)}>Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <Pager total={245} skip={0} take={12} previousNext navigatable pageSizes={[12,24,48]} />
                    </div>
                  </div>
                </TabStripTab>

                <TabStripTab title="Analytics">
                  <div className="space-y-4">
                    <form className="bg-white border border-gray-200 rounded-lg p-3 flex flex-wrap items-center gap-3">
                      <DateRangePicker />
                      <DropDownList className="w-56" data={["City","ZIP","Neighborhood"]} defaultValue={'City'} />
                      <DropDownList className="w-56" data={["Median Price","DOM","Inventory"]} defaultValue={'Median Price'} />
                    </form>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-600">Median Price</div>
                        <div className="text-2xl font-semibold">$1.05M</div>
                      </div>
                      <div className="bg-white rounded-lg shadow p-4">
                        <Chart>
                          <ChartCategoryAxis>
                            <ChartCategoryAxisItem categories={categories} />
                          </ChartCategoryAxis>
                          <ChartSeries>
                            <ChartSeriesItem type="line" data={kpiSeries} name="Median Price ($M)" />
                          </ChartSeries>
                          <ChartLegend position="bottom" />
                          <ChartSeriesDefaults labels={{ visible: false }} />
                        </Chart>
                      </div>
                      <div className="bg-white rounded-lg shadow p-4">
                        <Chart>
                          <ChartCategoryAxis>
                            <ChartCategoryAxisItem categories={["House","Condo","Townhome"]} />
                          </ChartCategoryAxis>
                          <ChartSeries>
                            <ChartSeriesItem type="column" data={[120, 80, 45]} name="Inventory" />
                          </ChartSeries>
                        </Chart>
                      </div>
                      <div className="bg-white rounded-lg shadow p-4">
                        <div className="h-48 bg-gray-100 rounded" />
                      </div>
                      <div className="bg-white rounded-lg shadow p-4">
                        <Chart>
                          <ChartSeries>
                            <ChartSeriesItem type="donut" data={[{ category: 'Referral', value: 40 }, { category: 'Online', value: 35 }, { category: 'Open House', value: 25 }]} categoryField="category" field="value" />
                          </ChartSeries>
                          <ChartLegend position="bottom" />
                        </Chart>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50">Export CSV</Button>
                        <Button className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50">Export PNG</Button>
                        <Button className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50">Export PDF</Button>
                      </div>
                    </div>
                  </div>
                </TabStripTab>

                <TabStripTab title="Clients">
                  <div className="space-y-4">
                    <form className="bg-white border border-gray-200 rounded-lg p-3 flex flex-wrap items-center gap-3">
                      <TextBox className="w-72" placeholder="Search clients" />
                      <DropDownList className="w-48" data={["Buyer","Seller","Investor"]} defaultValue={'Buyer'} />
                      <DropDownList className="w-48" data={["Active","Nurture","Closed"]} defaultValue={'Active'} />
                    </form>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <Grid data={clientRows} autoProcessData dataItemKey="id" sortable pageable>
                        <GridColumn field="name" title="Name" />
                        <GridColumn field="stage" title="Stage" />
                        <GridColumn field="budget" title="Budget" cell={(td) => <td style={td.style}>{currency(td.dataItem.budget)}</td>} />
                        <GridColumn field="area" title="Target area" />
                        <GridColumn field="lastContact" title="Last contact" />
                        <GridColumn field="agent" title="Agent" />
                        <GridColumn field="nextTask" title="Next task" />
                        <GridColumn title="Actions" cell={() => (
                          <td className="text-right">
                            <ButtonGroup className="inline-flex gap-1">
                              <Button size="small">View</Button>
                              <Button size="small">Email</Button>
                              <Button size="small">Note</Button>
                              <Button size="small">Assign</Button>
                            </ButtonGroup>
                          </td>
                        )} />
                      </Grid>
                    </div>
                    <div className="flex justify-end">
                      <Pager total={clientRows.length} skip={0} take={10} pageSizes={[10,20,50]} previousNext />
                    </div>
                  </div>
                </TabStripTab>
              </TabStrip>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <a href="#" className="hover:text-gray-900">Help Center</a>
                <a href="#" className="hover:text-gray-900">Training</a>
                <a href="#" className="hover:text-gray-900">Contact Support</a>
              </div>
              <div className="text-sm text-gray-600">© 2025 Acme Realty • (415) 555-1234</div>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">v2.3.1</span>
            </div>
          </footer>
        </section>
      </main>

      {/* Property Drawer */}
      <Drawer expanded={drawerOpen} position="end" mode="overlay" width={720} onOverlayClick={()=>setDrawerOpen(false)}>
        <DrawerContent>
          {drawerOpen && (
            <div className="fixed inset-y-0 right-0 w-[720px] bg-white shadow-xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b"> <div className="font-semibold">123 Main St, San Francisco, CA</div> <Button onClick={()=>setDrawerOpen(false)}>Close</Button></div>
              <div className="h-64 bg-black" />
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded">Price: $1,250,000</div>
                <div className="p-3 bg-gray-50 rounded">Beds: 3</div>
                <div className="p-3 bg-gray-50 rounded">Baths: 2</div>
              </div>
              <div className="p-4">
                <TabStrip>
                  <TabStripTab title="Overview">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">Spacious updated home...</p>
                      <Chip text="Near parks" />
                    </div>
                  </TabStripTab>
                  <TabStripTab title="Features">
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Garage</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Backyard</label>
                    </div>
                  </TabStripTab>
                  <TabStripTab title="Map">
                    <div className="h-72 bg-gray-200 rounded" />
                  </TabStripTab>
                  <TabStripTab title="Documents">
                    <div className="space-y-2 divide-y">
                      <div className="flex items-center justify-between py-2"><span className="text-sm">Disclosure.pdf</span><Button className="px-3 py-1.5 rounded border">Download</Button></div>
                    </div>
                  </TabStripTab>
                  <TabStripTab title="Activity">
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">No recent activity.</div>
                    </div>
                  </TabStripTab>
                </TabStrip>
              </div>
              <div className="sticky bottom-0 p-3 border-t bg-white flex items-center gap-2 justify-end">
                <Button themeColor="primary" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Schedule Showing</Button>
                <Button className="px-4 py-2 rounded border">Share</Button>
                <Button className="px-4 py-2 rounded border">Add to Tour</Button>
                <Button className="px-4 py-2 rounded border">Create CMA</Button>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      {/* Floating Action */}
      <div className="fixed bottom-6 right-6 z-50">
        <FloatingActionButton text="Add Listing" onClick={()=>setNewListingOpen(true)} />
      </div>

      {/* New Listing Modal */}
      {newListingOpen && (
        <Dialog title={'New Listing'} onClose={()=>setNewListingOpen(false)} width={900} autoFocus>
          <div className="p-4">
            <Stepper items={[{ label: 'Basics' }, { label: 'Details' }, { label: 'Pricing' }, { label: 'Media' }, { label: 'Publish' }]} />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <AutoComplete data={["123 Main St","456 Pine St"]} placeholder="Address" />
              <DropDownList data={propertyTypes} defaultValue={'House'} />
              <DropDownList data={statusOptions} defaultValue={'Active'} />
              <NumericTextBox placeholder="Beds" />
              <NumericTextBox placeholder="Baths" step={0.5} />
              <NumericTextBox placeholder="Square feet" />
              <NumericTextBox placeholder="Lot size" />
              <NumericTextBox placeholder="Year built" />
              <MultiSelect data={["Garage","Pool","AC","Solar"]} placeholder="Features" />
              <NumericTextBox format="c0" placeholder="List price" />
              <NumericTextBox format="c0" placeholder="HOA fee" />
              <NumericTextBox format="c0" placeholder="Annual taxes" />
              <div className="col-span-2 space-y-3 mt-2">
                <Upload multiple saveUrl={'https://demos.telerik.com/kendo-ui/service-v4/upload/save'} removeUrl={'https://demos.telerik.com/kendo-ui/service-v4/upload/remove'} />
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-video bg-gray-200 rounded" />
                  <div className="aspect-video bg-gray-200 rounded" />
                  <div className="aspect-video bg-gray-200 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Publish visibility</span>
                  <Switch />
                </div>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Syndicate to portals</label>
                <Button fillMode="link" className="text-blue-700 hover:underline" type="button">Preview</Button>
              </div>
            </div>
          </div>
          <DialogActionsBar>
            <div className="flex items-center justify-between w-full">
              <ProgressBar style={{ width: 192 }} value={50} />
              <div className="flex items-center gap-2">
                <Button className="px-4 py-2 rounded border">Save Draft</Button>
                <Button className="px-4 py-2 rounded border">Validate</Button>
                <Button themeColor="primary" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Publish</Button>
              </div>
            </div>
          </DialogActionsBar>
        </Dialog>
      )}

      {/* Confirmation Dialog */}
      {confirmOpen && (
        <Dialog title={'Save current filters as search?'} onClose={()=>setConfirmOpen(false)} autoFocus>
          <p className="m-4">You can load this search later from the sidebar. Proceed?</p>
          <DialogActionsBar>
            <Button onClick={()=>setConfirmOpen(false)}>Cancel</Button>
            <Button themeColor="primary" onClick={()=>{ setConfirmOpen(false); setNotif({ type: 'success', text: 'Saved search created.' }); }}>Confirm</Button>
          </DialogActionsBar>
        </Dialog>
      )}

      {/* Toast/Notification */}
      <NotificationGroup
        style={{ left: '50%', transform: 'translateX(-50%)', position: 'fixed', bottom: 16, zIndex: 50 }}
      >
        {notif && (
          <Notification closable onClose={()=>setNotif(null)} type={{ style: notif.type, icon: true }}>
            <span>{notif.text}</span>
          </Notification>
        )}
      </NotificationGroup>

      {/* Global skeletons (hidden placeholder for demo) */}
      <div className="hidden">
        <Skeleton shape={'rectangle'} style={{ width: '100%', height: 200 }} />
      </div>
    </div>
  );
}

    
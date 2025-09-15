'use client';

import React, { useState } from 'react';
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
  Drawer,
  DrawerContent,
  PanelBar,
  PanelBarItem,
  TabStrip,
  TabStripTab,
  StackLayout,
  Avatar,
  Breadcrumb,
  Card,
  CardHeader,
  CardTitle,
  CardBody
} from '@progress/kendo-react-layout';
import {
  Button,
  ButtonGroup,
  Chip,
  Toolbar,
  FloatingActionButton
} from '@progress/kendo-react-buttons';
import {
  AutoComplete,
  DropDownList,
  MultiSelect
} from '@progress/kendo-react-dropdowns';
import {
  Checkbox,
  RangeSlider,
  NumericTextBox,
  TextBox
} from '@progress/kendo-react-inputs';
import { DatePicker, DateRangePicker } from '@progress/kendo-react-dateinputs';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { ListView, ListViewItemWrapper } from '@progress/kendo-react-listview';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Badge } from '@progress/kendo-react-indicators';
import { Editor, EditorTools } from '@progress/kendo-react-editor';
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartLegend,
  ChartTooltip
} from '@progress/kendo-react-charts';
import { SVGIcon, SvgIcon } from '@progress/kendo-react-common';
import {
  searchIcon,
  menuIcon,
  plusIcon,
  bellIcon,
  userIcon,
  heartIcon,
  starIcon
} from '@progress/kendo-svg-icons';

export default function RealEstateAgentDashboard() {
  const user = {
    name: 'Alex Morgan',
    email: 'alex@agencypro.co',
    avatar: 'https://i.pravatar.cc/64?img=32'
  };
  const permissions = { canAddListing: true };
  const breadcrumbs = [
    { id: 'home', text: 'Home' },
    { id: 'dashboard', text: 'Dashboard' },
    { id: 'agent', text: 'Agent' }
  ];
  const navItems = [
    { text: 'Properties' },
    { text: 'Analytics' },
    { text: 'Clients' }
  ];
  const [viewMode, setViewMode] = useState('list');
  const [tab, setTab] = useState(0);
  const [searchText, setSearchText] = useState('');
  const suggestions = [
    'Austin, TX',
    'Round Rock',
    'Downtown Austin',
    '78704',
    'Lakeway'
  ];

  // Saved searches mock
  const savedSearches = [
    {
      id: 's1',
      name: 'East Austin <$900k',
      resultsCount: 42,
      lastRun: '2025-09-10'
    },
    {
      id: 's2',
      name: 'Waterfront 3+bd',
      resultsCount: 18,
      lastRun: '2025-09-11'
    }
  ];

  // Filters mock state
  const [price, setPrice] = useState({ start: 400000, end: 900000 });
  const [types, setTypes] = useState(['House']);
  const [beds, setBeds] = useState<number>(3);
  const [baths, setBaths] = useState<number>(2);
  const [sqft, setSqft] = useState({ start: 1200, end: 3000 });
  const [isNew, setIsNew] = useState(false);
  const [hasDrop, setHasDrop] = useState(true);
  const [listedSince, setListedSince] = useState<Date | null>(null);
  const [keywords, setKeywords] = useState<string>('pool');

  // Properties mock
  const properties = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    price: 825000 + i * 5000,
    address: `12${i} Maple St, Austin, TX`
  }));

  // Clients mock for Grid
  const clients = [
    {
      id: 1,
      name: 'Jane Doe',
      stage: 'Active',
      lastContact: new Date(2025, 8, 10),
      budget: 900000,
      email: 'jane@example.com',
      phone: '(555) 010-2345'
    },
    {
      id: 2,
      name: 'John Carter',
      stage: 'New',
      lastContact: new Date(2025, 8, 8),
      budget: 650000,
      email: 'john@example.com',
      phone: '(555) 010-1122'
    }
  ];

  // Analytics datasets
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const medianPrice = [700, 710, 720, 705, 715, 730];
  const inventoryByType = [
    { category: 'House', value: 120 },
    { category: 'Condo', value: 80 },
    { category: 'Townhome', value: 40 }
  ];
  const domTrend = [30, 28, 27, 32, 29, 26];
  const statusMix = [
    { category: 'Active', value: 65 },
    { category: 'Pending', value: 20 },
    { category: 'Sold', value: 15 }
  ];

  const {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    OrderedList,
    UnorderedList,
    Undo,
    Redo,
    Link: EdLink,
    Unlink
  } = EditorTools;

  const [fabOpen, setFabOpen] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <AppBar className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
        <AppBarSection>
          <div className="flex items-center gap-3">
            <Avatar type="image" size="large" rounded="full">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                alt="Agency"
                style={{ width: 32, height: 32 }}
              />
            </Avatar>
            <span className="text-lg font-semibold text-gray-900">
              Agent Dashboard
            </span>
          </div>
        </AppBarSection>
        <AppBarSpacer style={{ width: 12 }} />
        <AppBarSection className="hidden md:flex items-center text-sm text-gray-500">
          <Breadcrumb data={breadcrumbs} />
        </AppBarSection>
        <AppBarSpacer style={{ width: 12 }} />
        <AppBarSection className="flex-1 max-w-3xl mx-4">
          <div className="flex items-center gap-2">
            <AutoComplete
              className="w-full"
              data={suggestions}
              value={searchText}
              onChange={(e) => setSearchText(e.value)}
              placeholder="Search properties, neighborhoods, zips..."
            />
            <Button className="ml-2 inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md">
              Advanced
            </Button>
          </div>
        </AppBarSection>
        <AppBarSection className="hidden md:flex items-center gap-2">
          <ButtonGroup>
            <Button
              togglable
              selected={viewMode === 'map'}
              onClick={() => setViewMode('map')}
              title="Map"
            >
              Map
            </Button>
            <Button
              togglable
              selected={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              title="List"
            >
              List
            </Button>
          </ButtonGroup>
        </AppBarSection>
        <AppBarSpacer />
        <AppBarSection className="flex items-center gap-2 ml-auto">
          <Button
            className="hidden lg:inline-flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            disabled={!permissions.canAddListing}
          >
            Add Listing
          </Button>
          <Button
            fillMode="flat"
            title="Notifications"
            className="relative text-gray-600 hover:text-gray-900"
          >
            <SvgIcon icon={bellIcon} />
            <Badge
              className="absolute -top-1 -right-1"
              themeColor="error"
              size="small"
            >
              3
            </Badge>
          </Button>
          <DropDownList
            className="ml-1"
            data={[
              { text: 'Profile' },
              { text: 'Settings' },
              { text: 'Sign out' }
            ]}
            textField="text"
            defaultValue={{ text: user.name }}
          />
        </AppBarSection>
      </AppBar>

      {/* Main wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-80 shrink-0 hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <h3 className="font-semibold mb-3">Saved Searches</h3>
              <ListView
                className="divide-y divide-gray-100"
                data={savedSearches}
                item={(props) => (
                  <ListViewItemWrapper style={{ padding: 12 }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{props.dataItem.name}</div>
                        <div className="text-xs text-gray-500">
                          {props.dataItem.resultsCount} results • last run{' '}
                          {props.dataItem.lastRun}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="small" fillMode="flat">
                          Pin
                        </Button>
                        <Button size="small" fillMode="flat">
                          Edit
                        </Button>
                        <Button size="small" fillMode="flat">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </ListViewItemWrapper>
                )}
              />
              <Button className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md">
                Save Current Search
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">
                    Price range
                  </label>
                  <RangeSlider
                    min={0}
                    max={2000000}
                    step={50000}
                    value={price}
                    onChange={(e) => setPrice(e.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">
                    Property type
                  </label>
                  <MultiSelect
                    data={['House', 'Condo', 'Townhome']}
                    value={types}
                    onChange={(e) => setTypes(e.value)}
                    placeholder="Select types"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Beds</label>
                  <NumericTextBox
                    min={0}
                    max={10}
                    step={1}
                    value={beds}
                    onChange={(e) => setBeds(e.value ?? 0)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Baths
                  </label>
                  <NumericTextBox
                    min={0}
                    max={10}
                    step={1}
                    value={baths}
                    onChange={(e) => setBaths(e.value ?? 0)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">
                    Square footage
                  </label>
                  <RangeSlider
                    min={500}
                    max={8000}
                    step={100}
                    value={sqft}
                    onChange={(e) => setSqft(e.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Checkbox
                    label="New this week"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Checkbox
                    label="Price drops"
                    checked={hasDrop}
                    onChange={(e) => setHasDrop(e.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">
                    Listed since
                  </label>
                  <DatePicker
                    value={listedSince}
                    onChange={(e) => setListedSince(e.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">
                    Keywords
                  </label>
                  <TextBox
                    value={keywords}
                    onChange={(e) => setKeywords(String(e.value ?? ''))}
                    placeholder="e.g., pool, waterfront"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Chip
                text={`Price: $${(price.start / 1000).toFixed(0)}k–$${(
                  price.end / 1000
                ).toFixed(0)}k`}
                removable
              />
              <Chip text={`${beds}+ bd`} removable />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
              <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md w-full text-left">
                Luxury ($1M+)
              </Button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <TabStrip
              className="mb-4"
              selected={tab}
              onSelect={(e) => setTab(e.selected)}
            >
              <TabStripTab title="Properties">
                <div>
                  <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-3 mb-3">
                    <span className="text-sm text-gray-600">245 results</span>
                    <div className="flex items-center gap-2">
                      <DropDownList
                        data={[
                          { text: 'Price' },
                          { text: 'DOM' },
                          { text: 'Newest' }
                        ]}
                        textField="text"
                        defaultValue={{ text: 'Price' }}
                      />
                      <Button>Comfortable</Button>
                      <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md">
                        Export
                      </Button>
                    </div>
                  </div>

                  {/* Property grid cards (HTML + Kendo bits) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {properties.map((p) => (
                      <Card
                        key={p.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative"
                      >
                        <CardHeader>
                          <CardTitle>{`$${p.price.toLocaleString()}`}</CardTitle>
                        </CardHeader>
                        <div className="aspect-video bg-gray-100 flex items-center justify-center">
                          <SvgIcon icon={starIcon} />
                        </div>
                        <Badge className="absolute top-3 left-3 bg-emerald-600 text-white">
                          New
                        </Badge>
                        <CardBody>
                          <div className="p-0 space-y-2">
                            <div className="text-sm text-gray-600">
                              {p.address}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-700">
                              <span>3 bd</span>
                              <span>2 ba</span>
                              <span>1,850 sqft</span>
                            </div>
                          </div>
                        </CardBody>
                        <div className="p-4 pt-0 flex items-center justify-between">
                          <Button
                            fillMode="flat"
                            svgIcon={heartIcon}
                            title="Favorite"
                          />
                          <Checkbox label="Compare" />
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md">
                            Contact
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabStripTab>

              <TabStripTab title="Analytics">
                <div>
                  <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-3 mb-3">
                    <DateRangePicker />
                    <DropDownList
                      data={['Austin', 'Round Rock', 'Cedar Park']}
                      defaultValue="Austin"
                    />
                    <DropDownList
                      data={['Median Price', 'Inventory', 'DOM']}
                      defaultValue="Median Price"
                    />
                    <Button className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md">
                      Download
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 col-span-1 xl:col-span-2">
                      <Chart style={{ height: 256 }}>
                        <ChartLegend position="bottom" />
                        <ChartCategoryAxis>
                          <ChartCategoryAxisItem categories={months} />
                        </ChartCategoryAxis>
                        <ChartSeries>
                          <ChartSeriesItem
                            type="line"
                            data={medianPrice}
                            name="Median Price ($k)"
                          />
                        </ChartSeries>
                        <ChartTooltip render={(e: any) => `$${e.value}k`} />
                      </Chart>
                    </Card>

                    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <Chart style={{ height: 256 }}>
                        <ChartCategoryAxis>
                          <ChartCategoryAxisItem
                            categories={inventoryByType.map((i) => i.category)}
                          />
                        </ChartCategoryAxis>
                        <ChartSeries>
                          <ChartSeriesItem
                            type="column"
                            data={inventoryByType.map((i) => i.value)}
                            name="Inventory"
                          />
                        </ChartSeries>
                      </Chart>
                    </Card>

                    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <Chart style={{ height: 256 }}>
                        <ChartCategoryAxis>
                          <ChartCategoryAxisItem categories={months} />
                        </ChartCategoryAxis>
                        <ChartSeries>
                          <ChartSeriesItem
                            type="area"
                            data={domTrend}
                            name="DOM"
                          />
                        </ChartSeries>
                      </Chart>
                    </Card>

                    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <Chart style={{ height: 256 }}>
                        <ChartSeries>
                          <ChartSeriesItem
                            type="donut"
                            data={statusMix}
                            categoryField="category"
                            field="value"
                          />
                        </ChartSeries>
                      </Chart>
                    </Card>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:col-span-2 xl:col-span-4">
                      {[
                        {
                          label: 'Median Price',
                          value: '$715,000',
                          delta: '+2.3%'
                        },
                        { label: 'Inventory', value: '1,240', delta: '-3.1%' },
                        { label: 'DOM', value: '29', delta: '-1 day' },
                        {
                          label: 'Sale-to-List',
                          value: '98.2%',
                          delta: '+0.4%'
                        }
                      ].map((k) => (
                        <Card
                          key={k.label}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                        >
                          <div className="text-sm text-gray-500">{k.label}</div>
                          <div className="text-2xl font-semibold">
                            {k.value}
                          </div>
                          <Badge className="mt-1 bg-emerald-50 text-emerald-700">
                            {k.delta}
                          </Badge>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabStripTab>

              <TabStripTab title="Clients">
                <div>
                  <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-3 mb-3">
                    <AutoComplete
                      className="flex-1"
                      data={['Jane', 'John', 'Alex', 'Maria']}
                      placeholder="Search clients"
                    />
                    <MultiSelect
                      data={['VIP', 'Investor', 'Hot', 'Cold']}
                      placeholder="Segments"
                    />
                    <Button className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md">
                      Bulk Email
                    </Button>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <Grid
                      data={clients}
                      style={{ maxHeight: 420 }}
                      sortable
                      selectable={{ enabled: true }}
                    >
                      <GridColumn field="name" title="Name" />
                      <GridColumn field="stage" title="Stage" />
                      <GridColumn
                        field="lastContact"
                        title="Last Contact"
                        format="{0:MM/dd/yyyy}"
                      />
                      <GridColumn
                        field="budget"
                        title="Budget"
                        format="{0:c0}"
                      />
                      <GridColumn field="email" title="Email" />
                      <GridColumn field="phone" title="Phone" />
                      <GridColumn title="Actions" />
                    </Grid>
                  </div>

                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-700">3 selected</span>
                    <div className="flex items-center gap-2">
                      <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md">
                        Tag
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md">
                        Email
                      </Button>
                    </div>
                  </div>
                </div>
              </TabStripTab>
            </TabStrip>
          </main>
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6">
        <FloatingActionButton
          svgIcon={plusIcon}
          items={[
            { text: 'Manual Listing' },
            { text: 'Import MLS' },
            { text: 'Drafts' }
          ]}
          modal={false}
          onItemClick={(e: any) => {
            if (e.item?.text === 'Drafts') {
              setConfirmDiscard(true);
            }
          }}
        />
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t border-gray-200 bg-white">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-600 flex flex-wrap gap-4">
          <a className="hover:text-gray-900" href="#">
            About
          </a>
          <a className="hover:text-gray-900" href="#">
            Help
          </a>
          <a className="hover:text-gray-900" href="#">
            Terms
          </a>
          <a className="hover:text-gray-900" href="#">
            Privacy
          </a>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex items-center justify-between">
          <span className="text-sm text-gray-600">All systems operational</span>
          <div className="flex items-center gap-3">
            <DropDownList data={['en-US', 'es-ES']} defaultValue="en-US" />
            <DropDownList data={['USD', 'EUR', 'GBP']} defaultValue="USD" />
          </div>
        </div>
      </footer>

      {confirmDiscard && (
        <Dialog
          title="Discard unsaved changes?"
          onClose={() => setConfirmDiscard(false)}
        >
          <p>Discard unsaved changes?</p>
          <DialogActionsBar>
            <Button
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md"
              onClick={() => setConfirmDiscard(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md"
              onClick={() => setConfirmDiscard(false)}
            >
              Discard
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  );
}

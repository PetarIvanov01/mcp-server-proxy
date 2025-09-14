'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button, FloatingActionButton } from '@progress/kendo-react-buttons';
import type { FloatingActionButtonItemEvent } from '@progress/kendo-react-buttons';
import { Avatar } from '@progress/kendo-react-layout';
import { Tooltip } from '@progress/kendo-react-tooltip';
import {
  TextBox,
  NumericTextBox,
  TextArea,
  RangeSlider
} from '@progress/kendo-react-inputs';
import type { RangeSliderChangeEvent } from '@progress/kendo-react-inputs';
import {
  ComboBox,
  DropDownList,
  MultiSelect
} from '@progress/kendo-react-dropdowns';
import type {
  ComboBoxFilterChangeEvent,
  ComboBoxChangeEvent
} from '@progress/kendo-react-dropdowns';
import { DateRangePicker } from '@progress/kendo-react-dateinputs';
import {
  Grid,
  GridColumn as Column,
  GridToolbar
} from '@progress/kendo-react-grid';
import type { GridCellProps } from '@progress/kendo-react-grid';
import { Pager } from '@progress/kendo-react-data-tools';
import { ListView, ListViewItemWrapper } from '@progress/kendo-react-listview';
import type { ListViewItemProps } from '@progress/kendo-react-listview';
import {
  Notification,
  NotificationGroup
} from '@progress/kendo-react-notification';
import { Dialog } from '@progress/kendo-react-dialogs';
import {
  Sparkline,
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartLegend,
  ChartSeriesDefaults
} from '@progress/kendo-react-charts';
import {
  bellIcon,
  cogIcon,
  chevronLeftIcon,
  infoIcon,
  plusIcon,
  refreshIcon
} from '@progress/kendo-svg-icons';
import type { SVGIcon } from '@progress/kendo-react-common';

export default function SaaSDashboard(): React.JSX.Element {
  // Mock data and state
  const [, setTheme] = React.useState<'light' | 'dark'>('light');
  const [, setDrawerExpanded] = React.useState<boolean>(true);
  const [notificationsOpen, setNotificationsOpen] =
    React.useState<boolean>(false);
  const [quickSettingsOpen, setQuickSettingsOpen] =
    React.useState<boolean>(false);
  const [searchValue, setSearchValue] = React.useState<string | null>('');
  const [searchData, setSearchData] = React.useState<string[]>([
    'Alice Johnson (User)',
    'INV-10422 (Transaction)',
    'Usage Report (Doc)'
  ]);
  const [loadingSearch, setLoadingSearch] = React.useState<boolean>(false);

  const [datePreset, setDatePreset] = React.useState<string>('Last 30 days');
  const [dateRange, setDateRange] = React.useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: new Date(new Date().setDate(new Date().getDate() - 29)),
    end: new Date()
  });

  const [, setExporting] = React.useState<boolean>(false);
  const [, setRefreshing] = React.useState<boolean>(false);

  const [amountRange, setAmountRange] = React.useState<{
    start: number;
    end: number;
  }>({ start: 0, end: 1000 });
  const [statusChips, setStatusChips] = React.useState<string[]>([
    'Paid',
    'Refunded'
  ]);
  const [txSearch, setTxSearch] = React.useState<string>('');

  // Grid state (modern API)
  const [gridPage, setGridPage] = React.useState<{
    skip: number;
    take: number;
  }>({ skip: 0, take: 10 });
  const [gridSelect] = React.useState<boolean>(false);

  const transactions = React.useMemo(
    () =>
      Array.from({ length: 57 }).map((_, i) => ({
        id: `TX-${1000 + i}`,
        date: new Date(Date.now() - i * 86400000),
        customer:
          ['Alice', 'Bob', 'Clara', 'Diego', 'Eva'][i % 5] +
          ' ' +
          ['Johnson', 'Mills', 'Nguyen', 'Gomez', 'Smith'][i % 5],
        plan: ['Free', 'Pro', 'Business', 'Enterprise'][i % 4],
        amount: +(Math.random() * 1200).toFixed(2),
        status: ['Paid', 'Pending', 'Refunded', 'Failed'][i % 4],
        paymentMethod: ['Card', 'Wire', 'PayPal'][i % 3]
      })),
    []
  );

  const pageData = React.useMemo(
    () => transactions.slice(gridPage.skip, gridPage.skip + gridPage.take),
    [transactions, gridPage]
  );

  // Charts mock
  const categories = Array.from({ length: 12 }).map((_, i) => `M${i + 1}`);
  const revenueSeriesA = categories.map(() =>
    Math.round(5000 + Math.random() * 4000)
  );
  const revenueSeriesB = categories.map(() =>
    Math.round(3000 + Math.random() * 2500)
  );

  const usersSeries = categories.map(() =>
    Math.round(200 + Math.random() * 180)
  );

  // ListView mock
  type Announcement = { id: number; title: string; time: string };
  const announcements: Announcement[] = [
    { id: 1, title: 'New Analytics Beta', time: '2h ago' },
    { id: 2, title: 'Invoices export improvements', time: '1d ago' },
    { id: 3, title: 'System maintenance on Saturday', time: '3d ago' }
  ];

  // Notifications
  const [toasts, setToasts] = React.useState<
    { id: number; type: 'success' | 'error' | 'info'; text: string }[]
  >([]);
  const pushToast = (t: { type: 'success' | 'error' | 'info'; text: string }) =>
    setToasts((prev) => [...prev, { id: Date.now(), ...t }]);
  const closeToast = (id: number) =>
    setToasts((prev) => prev.filter((n) => n.id !== id));

  // Handlers
  const onSearchFilter = (e: ComboBoxFilterChangeEvent) => {
    setLoadingSearch(true);
    const val = e.filter?.value ?? '';
    setTimeout(() => {
      setSearchData(
        ['Users', 'Transactions', 'Docs']
          .flatMap((k) => [`${val} ${k} A`, `${val} ${k} B`])
          .filter((x) => x.trim().length > 0)
      );
      setLoadingSearch(false);
    }, 400);
  };

  const doExport = async (format: 'csv' | 'pdf') => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 900));
    setExporting(false);
    pushToast({
      type: 'success',
      text: `Exported ${format.toUpperCase()} for ${datePreset}`
    });
  };

  const doRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 700));
    setRefreshing(false);
    pushToast({ type: 'info', text: 'Data refreshed' });
  };

  const [showAdvancedRange, setShowAdvancedRange] =
    React.useState<boolean>(false);
  const [showCreateCustomer, setShowCreateCustomer] =
    React.useState<boolean>(false);
  const [showRefund, setShowRefund] = React.useState<boolean>(false);

  // Refund form state
  const [refundAmount, setRefundAmount] = React.useState<number | null>(50);
  const [refundReason, setRefundReason] = React.useState<string>('');

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/70 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <Avatar size="large" className="h-8 w-8 rounded overflow-hidden">
                <Image
                  src="/logo.svg"
                  alt="Acme Cloud"
                  width={32}
                  height={32}
                />
              </Avatar>
              <span className="text-lg font-semibold tracking-tight">
                Acme Cloud
              </span>
            </div>
            {/* Search */}
            <div className="hidden md:flex md:flex-1 max-w-xl">
              <ComboBox
                className="w-full"
                data={searchData}
                loading={loadingSearch}
                value={searchValue}
                placeholder="Search users, transactions, docs..."
                clearButton={true}
                filterable={true}
                onFilterChange={onSearchFilter}
                onChange={(e: ComboBoxChangeEvent) =>
                  setSearchValue(e.value as string)
                }
                popupSettings={{ width: '100%' }}
              />
            </div>
            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                title="Notifications"
                aria-label="Notifications"
                className="relative inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setNotificationsOpen((s) => !s)}
                svgIcon={bellIcon as unknown as SVGIcon}
                fillMode="clear"
              />
              {notificationsOpen && (
                <div className="absolute mt-12 right-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-80 p-2">
                  <div className="text-sm font-medium px-2 py-1">
                    Notifications
                  </div>
                  <div className="max-h-64 overflow-auto divide-y divide-gray-100 dark:divide-gray-800">
                    {[
                      { t: '3 new payments', time: 'Now' },
                      { t: 'Export ready', time: '1h' }
                    ].map((n) => (
                      <div
                        key={`${n.t}-${n.time}`}
                        className="px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                      >
                        <div className="text-sm">{n.t}</div>
                        <div className="text-xs text-gray-500">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                title="Quick settings"
                aria-label="Quick settings"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setQuickSettingsOpen((s) => !s)}
                svgIcon={cogIcon as unknown as SVGIcon}
                fillMode="clear"
              />
              {quickSettingsOpen && (
                <div className="absolute mt-12 right-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-56 p-2">
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() =>
                      setTheme((t) => (t === 'light' ? 'dark' : 'light'))
                    }
                  >
                    Toggle Theme
                  </button>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Density: Comfortable
                  </button>
                </div>
              )}

              <div className="relative">
                <Button
                  title="Account"
                  aria-label="Account"
                  className="h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-blue-500 transition"
                  fillMode="clear"
                >
                  <Avatar
                    size="small"
                    className="h-9 w-9 rounded-full overflow-hidden"
                  >
                    <Image
                      src="/avatar.png"
                      alt="User"
                      width={36}
                      height={36}
                    />
                  </Avatar>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex w-full">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
          <div className="h-14 px-3 border-b border-gray-200 dark:border-gray-800 items-center justify-between hidden md:flex">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Navigation
            </h3>
            <Button
              className="h-9 w-9 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setDrawerExpanded((s) => !s)}
              svgIcon={chevronLeftIcon as unknown as SVGIcon}
              fillMode="clear"
            />
          </div>
          <nav className="flex-1 overflow-y-auto py-2">
            <button
              type="button"
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 w-full text-left"
            >
              <span className="h-5 w-5" />
              <span className="text-sm">Dashboard</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
            >
              <span className="h-5 w-5" />
              <span className="text-sm">Analytics</span>
              <span className="ml-auto bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs px-1.5 py-0.5 rounded">
                New
              </span>
            </button>
          </nav>
          <div className="border-t border-gray-200 dark:border-gray-800 p-3 text-xs text-gray-500">
            v2.3.1 · Help
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Page header */}
            <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-semibold tracking-tight">
                Dashboard
              </h1>
              <div className="flex items-center gap-3">
                <form
                  className="flex items-center gap-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <DropDownList
                    className="w-44"
                    data={[
                      'Today',
                      'Yesterday',
                      'Last 7 days',
                      'Last 30 days',
                      'This month',
                      'Last month'
                    ]}
                    value={datePreset}
                    onChange={(e) => setDatePreset(e.value as string)}
                  />
                  <DateRangePicker
                    className="w-72"
                    value={dateRange}
                    onChange={(e) =>
                      setDateRange({
                        start: e.value?.start ?? null,
                        end: e.value?.end ?? null
                      })
                    }
                  />
                </form>
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md shadow-sm"
                    onClick={() => doExport('csv')}
                  >
                    Export
                  </Button>
                  <Button
                    className="h-10 w-10 inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={doRefresh}
                    svgIcon={refreshIcon as unknown as SVGIcon}
                  />
                </div>
              </div>
            </section>

            {/* KPI cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    MRR
                  </span>
                  <Tooltip content="Monthly Recurring Revenue">
                    <span className="text-gray-400">
                      <Button
                        fillMode="clear"
                        svgIcon={infoIcon as unknown as SVGIcon}
                      />
                    </span>
                  </Tooltip>
                </div>
                <div className="mt-2 text-2xl font-semibold">$120,340</div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs px-2 py-0.5 rounded">
                    +4.3% MoM
                  </span>
                  <Sparkline
                    className="h-10 w-24"
                    data={Array.from({ length: 30 }).map(
                      () => 100 + Math.random() * 20
                    )}
                    type="area"
                  />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Active Users
                  </span>
                  <Tooltip content="Active users last 30 days">
                    <span className="text-gray-400">
                      <Button
                        fillMode="clear"
                        svgIcon={infoIcon as unknown as SVGIcon}
                      />
                    </span>
                  </Tooltip>
                </div>
                <div className="mt-2 text-2xl font-semibold">18,432</div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-xs px-2 py-0.5 rounded">
                    -1.2% WoW
                  </span>
                  <Sparkline
                    className="h-10 w-24"
                    data={Array.from({ length: 30 }).map(
                      () => 80 + Math.random() * 25
                    )}
                    type="line"
                  />
                </div>
              </div>
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Revenue Trend</h3>
                  <div className="flex items-center gap-2">
                    <DropDownList
                      className="w-36"
                      data={['Daily', 'Weekly', 'Monthly']}
                      defaultValue="Monthly"
                    />
                    <MultiSelect
                      className="w-48"
                      data={[
                        'Pro',
                        'Business',
                        'Enterprise',
                        'NA',
                        'EU',
                        'APAC'
                      ]}
                      placeholder="Segments"
                    />
                  </div>
                </div>
                <Chart style={{ height: '18rem' }}>
                  <ChartLegend />
                  <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={categories} />
                  </ChartCategoryAxis>
                  <ChartSeries>
                    <ChartSeriesItem
                      type="line"
                      name="Subscriptions"
                      data={revenueSeriesA}
                    />
                    <ChartSeriesItem
                      type="line"
                      name="Add-ons"
                      data={revenueSeriesB}
                    />
                  </ChartSeries>
                </Chart>
              </div>
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">User Growth</h3>
                  <div className="flex items-center gap-2">
                    <DropDownList
                      className="w-36"
                      data={['Daily', 'Weekly', 'Monthly']}
                      defaultValue="Monthly"
                    />
                    <MultiSelect
                      className="w-48"
                      data={['Free', 'Pro', 'Business', 'Enterprise']}
                      placeholder="Tiers"
                    />
                  </div>
                </div>
                <Chart style={{ height: '18rem' }}>
                  <ChartLegend />
                  <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={categories} />
                  </ChartCategoryAxis>
                  <ChartSeriesDefaults stack={true} />
                  <ChartSeries>
                    <ChartSeriesItem
                      type="area"
                      name="New Users"
                      data={usersSeries}
                    />
                    <ChartSeriesItem
                      type="area"
                      name="Returning"
                      data={usersSeries.map((v) => Math.round(v * 0.6))}
                    />
                  </ChartSeries>
                </Chart>
              </div>
            </section>

            {/* Filters + Grid */}
            <section className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex gap-2">
                  <Button
                    togglable={true}
                    selected={statusChips.includes('Paid')}
                    onClick={() =>
                      setStatusChips((s) =>
                        s.includes('Paid')
                          ? s.filter((x) => x !== 'Paid')
                          : [...s, 'Paid']
                      )
                    }
                  >
                    Paid
                  </Button>
                  <Button
                    togglable={true}
                    selected={statusChips.includes('Pending')}
                    onClick={() =>
                      setStatusChips((s) =>
                        s.includes('Pending')
                          ? s.filter((x) => x !== 'Pending')
                          : [...s, 'Pending']
                      )
                    }
                  >
                    Pending
                  </Button>
                  <Button
                    togglable={true}
                    selected={statusChips.includes('Refunded')}
                    onClick={() =>
                      setStatusChips((s) =>
                        s.includes('Refunded')
                          ? s.filter((x) => x !== 'Refunded')
                          : [...s, 'Refunded']
                      )
                    }
                  >
                    Refunded
                  </Button>
                </div>
                <RangeSlider
                  className="w-64"
                  min={0}
                  max={2000}
                  value={amountRange}
                  onChange={(e: RangeSliderChangeEvent) =>
                    setAmountRange({ start: e.value.start, end: e.value.end })
                  }
                />
                <div className="w-72">
                  <TextBox
                    value={txSearch}
                    onChange={(e) => setTxSearch(e.value)}
                    placeholder="Search transactions"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <Grid
                  style={{ maxHeight: '560px' }}
                  data={pageData}
                  dataItemKey="id"
                  sortable={true}
                  filterable={true}
                  autoProcessData={true}
                  pageSize={gridPage.take}
                  pageable={true}
                  total={transactions.length}
                  skip={gridPage.skip}
                  onPageChange={(e) =>
                    setGridPage({ skip: e.page.skip, take: e.page.take })
                  }
                  className="divide-y divide-gray-200 dark:divide-gray-800"
                >
                  <GridToolbar>
                    {gridSelect && (
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                        <Button
                          className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded"
                          onClick={() => setShowRefund(true)}
                        >
                          Refund
                        </Button>
                        <Button
                          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1.5 rounded"
                          onClick={() => doExport('csv')}
                        >
                          Export Selected
                        </Button>
                      </div>
                    )}
                  </GridToolbar>
                  <Column
                    field="date"
                    title="Date"
                    cell={(td: GridCellProps) => (
                      <td {...td.tdProps}>
                        {new Date(
                          (td.dataItem as any).date
                        ).toLocaleDateString()}
                      </td>
                    )}
                  />
                  <Column field="customer" title="Customer" />
                  <Column field="plan" title="Plan" />
                  <Column
                    field="amount"
                    title="Amount"
                    cell={(td: GridCellProps) => (
                      <td {...td.tdProps}>
                        ${((td.dataItem as any).amount as number).toFixed(2)}
                      </td>
                    )}
                  />
                  <Column
                    field="status"
                    title="Status"
                    cell={(td: GridCellProps) => (
                      <td {...td.tdProps}>
                        <span
                          className={
                            (td.dataItem as any).status === 'Paid'
                              ? 'px-2 py-1 rounded text-xs bg-emerald-100 text-emerald-700'
                              : (td.dataItem as any).status === 'Pending'
                              ? 'px-2 py-1 rounded text-xs bg-amber-100 text-amber-700'
                              : (td.dataItem as any).status === 'Refunded'
                              ? 'px-2 py-1 rounded text-xs bg-blue-100 text-blue-700'
                              : 'px-2 py-1 rounded text-xs bg-rose-100 text-rose-700'
                          }
                        >
                          {(td.dataItem as any).status}
                        </span>
                      </td>
                    )}
                  />
                  <Column field="paymentMethod" title="Payment Method" />
                </Grid>
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <Pager
                    skip={gridPage.skip}
                    take={gridPage.take}
                    total={transactions.length}
                    onPageChange={(e) =>
                      setGridPage({ skip: e.skip, take: e.take })
                    }
                    previousNext={true}
                    type="numeric"
                    pageSizes={[10, 20, 30]}
                  />
                </div>
              </div>
            </section>

            {/* Secondary panels */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4">
                <h3 className="text-sm font-medium mb-2">Announcements</h3>
                <div className="space-y-3">
                  <ListView
                    data={announcements}
                    item={(p: ListViewItemProps<Announcement>) => (
                      <ListViewItemWrapper>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            className="text-blue-600 hover:underline"
                          >
                            {p.dataItem.title}
                          </button>
                          <span className="text-xs text-gray-500">
                            {p.dataItem.time}
                          </span>
                        </div>
                      </ListViewItemWrapper>
                    )}
                  />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4">
                <h3 className="text-sm font-medium mb-2">System Health</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500">API Latency</span>
                    <div className="text-lg font-semibold">182 ms</div>
                    <Sparkline
                      className="h-8 w-full"
                      type="area"
                      data={Array.from({ length: 24 }).map(
                        () => 150 + Math.random() * 60
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500">Error Rate</span>
                    <div className="text-lg font-semibold">0.42%</div>
                    <Sparkline
                      className="h-8 w-full"
                      type="line"
                      data={Array.from({ length: 24 }).map(() => Math.random())}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="mt-6 border-t border-gray-200 dark:border-gray-800 py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                <span>© 2025 Acme Cloud</span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Privacy
                  </button>
                  <button
                    type="button"
                    className="hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Terms
                  </button>
                  <button
                    type="button"
                    className="hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Status
                  </button>
                  <DropDownList
                    className="min-w-[8rem]"
                    data={['English', 'Deutsch', 'Français']}
                    defaultValue="English"
                  />
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <FloatingActionButton
          svgIcon={plusIcon as unknown as SVGIcon}
          align={{ horizontal: 'end', vertical: 'end' }}
          items={[
            { text: 'New Invoice' },
            { text: 'Add Customer' },
            { text: 'Create Report' }
          ]}
          onItemClick={(e: FloatingActionButtonItemEvent) => {
            const text = e.item?.text;
            if (text === 'Add Customer') setShowCreateCustomer(true);
            if (text === 'New Invoice')
              pushToast({ type: 'info', text: 'Open invoice modal (demo)' });
            if (text === 'Create Report')
              pushToast({
                type: 'success',
                text: 'Navigating to report builder (demo)'
              });
          }}
        />
      </div>

      {/* Notifications */}
      <NotificationGroup
        style={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 60
        }}
      >
        {toasts.map((t) => (
          <Notification
            key={t.id}
            type={{ style: t.type, icon: true }}
            closable={true}
            onClose={() => closeToast(t.id)}
          >
            <span>{t.text}</span>
          </Notification>
        ))}
      </NotificationGroup>

      {/* Advanced Date Range Dialog */}
      {showAdvancedRange && (
        <Dialog
          title="Advanced Date Range"
          onClose={() => setShowAdvancedRange(false)}
        >
          <div className="space-y-3">
            <DateRangePicker
              value={dateRange}
              onChange={(e) =>
                setDateRange({
                  start: e.value?.start ?? null,
                  end: e.value?.end ?? null
                })
              }
            />
            <div className="flex gap-2 justify-end">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                onClick={() => setShowAdvancedRange(false)}
              >
                Apply
              </Button>
              <Button
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700"
                onClick={() => setShowAdvancedRange(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Create Customer Drawer (simplified as Dialog) */}
      {showCreateCustomer && (
        <Dialog
          title="Create Customer"
          onClose={() => setShowCreateCustomer(false)}
        >
          <div className="space-y-4">
            <TextBox placeholder="Customer name" />
            <TextBox placeholder="Email" />
            <DropDownList
              data={['Free', 'Pro', 'Business', 'Enterprise']}
              defaultValue="Pro"
            />
            <div className="flex gap-2 justify-end">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  setShowCreateCustomer(false);
                  pushToast({ type: 'success', text: 'Customer created' });
                }}
              >
                Create
              </Button>
              <Button
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700"
                onClick={() => setShowCreateCustomer(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Refund Dialog */}
      {showRefund && (
        <Dialog title="Refund Transaction" onClose={() => setShowRefund(false)}>
          <div className="space-y-3">
            <NumericTextBox
              format="c2"
              min={0}
              max={2000}
              value={refundAmount ?? undefined}
              onChange={(e) => setRefundAmount(e.value as number)}
            />
            <TextArea
              placeholder="Reason (required)"
              value={refundReason}
              onChange={(e) => setRefundReason(e.value as string)}
            />
            <div className="flex gap-2 justify-end">
              <Button
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  setShowRefund(false);
                  pushToast({ type: 'success', text: 'Refund submitted' });
                }}
              >
                Confirm Refund
              </Button>
              <Button
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700"
                onClick={() => setShowRefund(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}


    'use client'; 


    import * as React from 'react';
import { AppBar, AppBarSection, AppBarSpacer, Drawer, DrawerContent, Card, CardHeader, CardTitle, CardBody, CardActions, TabStrip, TabStripTab, Stepper, StackLayout, ExpansionPanel } from '@progress/kendo-react-layout';
import { Avatar } from '@progress/kendo-react-layout';
//import { p } from '@progress/kendo-react-common';
import { Chip, Button, Toolbar, DropDownButton } from '@progress/kendo-react-buttons';
import { Badge } from '@progress/kendo-react-indicators';
import { Switch } from '@progress/kendo-react-inputs';
import { AutoComplete, DropDownList, ComboBox } from '@progress/kendo-react-dropdowns';
import { Breadcrumb } from '@progress/kendo-react-layout';
import { DateRangePicker } from '@progress/kendo-react-dateinputs';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { ListView } from '@progress/kendo-react-listview';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartTitle, ChartLegend, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import { Sparkline } from '@progress/kendo-react-charts';
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { TextBox, TextArea } from '@progress/kendo-react-inputs';
import { Upload } from '@progress/kendo-react-upload';
import { Dialog } from '@progress/kendo-react-dialogs';
//import { Scheduler, DayView, WeekView, MonthView } from '@progress/kendo-react-scheduler';
import { Loader } from '@progress/kendo-react-indicators';
import { Popup } from '@progress/kendo-react-popup';
import { bellIcon, userIcon, calendarIcon, plusIcon, envelopeIcon, refreshIcon, linkVerticalIcon, chevronDownIcon, folderIcon, eyeIcon, externalLinkIcon } from '@progress/kendo-svg-icons';

    export default function PatientPortalShell() {
  // Mock data
  const patientProfile = { name: 'Jane Doe', avatar: '', dob: '1986-04-18', MRN: 'MRN-204893', primaryProvider: 'Dr. Patel' };
  const authSession = { token: 'abc123', roles: ['patient'], expires: new Date(Date.now() + 45 * 60000), twoFA: true };
  const notificationsSummary = [
    { id: 1, title: 'Lab result available', time: '2h', unread: true },
    { id: 2, title: 'Appointment confirmed', time: '1d', unread: false }
  ];
  const quickActions = [
    { text: 'Schedule', svgIcon: calendarIcon },
    { text: 'New Message', svgIcon: envelopeIcon },
    { text: 'Refill', svgIcon: plusIcon }
  ];
  const breadcrumbData = [{ id: 'home', text: 'Home' }, { id: 'dashboard', text: 'Dashboard' }];
  const defaultDateRange = { start: new Date(Date.now() - 7 * 24 * 3600000), end: new Date() };

  const [masked, setMasked] = React.useState(true);
  const [drawerOpen, setDrawerOpen] = React.useState(true);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState('');
  const [showDialog, setShowDialog] = React.useState(false);
  const [range, setRange] = React.useState(defaultDateRange);
  const [loading, setLoading] = React.useState(false);

  // Sidebar items
  const navItems = [
    { text: 'Dashboard', icon: folderIcon, route: '/' },
    { text: 'Appointments', icon: calendarIcon, route: '/appointments' },
    { text: 'Medical Records', icon: folderIcon, route: '/records' },
    { text: 'Prescriptions', icon: folderIcon, route: '/rx' },
    { text: 'Billing', icon: folderIcon, route: '/billing', badge: 2 }
  ];

  // Appointments widget
  const appointments = [
    { id: 1, dateTime: new Date(Date.now() + 2*3600000), location: 'Main Clinic', provider: 'Dr. Patel', purpose: 'Follow-up', status: 'Scheduled', tele: false },
    { id: 2, dateTime: new Date(Date.now() + 26*3600000), location: 'Telehealth', provider: 'Dr. Wong', purpose: 'Derm consult', status: 'Scheduled', tele: true },
    { id: 3, dateTime: new Date(Date.now() + 72*3600000), location: 'Cardiology', provider: 'Dr. Lee', purpose: 'Echo review', status: 'Scheduled', tele: false }
  ];

  // Recent results (grid)
  const results = [
    { id: 101, name: 'Hemoglobin A1C', date: new Date(), keyValue: '6.2 %', flag: 'H', unread: true },
    { id: 102, name: 'Lipid Panel - LDL', date: new Date(Date.now()-86400000), keyValue: '96 mg/dL', flag: 'N', unread: false },
    { id: 103, name: 'TSH', date: new Date(Date.now()-172800000), keyValue: '1.9 uIU/mL', flag: 'N', unread: false }
  ];

  // Med reminders
  const medicationList = [
    { id: 'm1', name: 'Atorvastatin', dose: '20 mg', schedule: 'Daily 9:00 PM', nextDue: new Date(Date.now()+3600000), eligibleRefill: true },
    { id: 'm2', name: 'Metformin', dose: '500 mg', schedule: 'BID 8:00 AM/PM', nextDue: new Date(Date.now()+2*3600000), eligibleRefill: false }
  ];

  // Charts mock
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const steps = [8200, 10500, 9800, 5600, 12000, 9100, 7600];
  const hr = [72, 75, 70, 78, 74, 73, 71];

  // Form mocks
  const providers = [
    { id: 1, name: 'Dr. Patel', specialty: 'Primary Care' },
    { id: 2, name: 'Dr. Wong', specialty: 'Dermatology' },
    { id: 3, name: 'Care Team', specialty: 'General' }
  ];

  const onGlobalRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const maskText = (t) => (masked ? '••••••' : t);

  const AppointmentItem = (props) => {
    const a = props.dataItem;
    return (
      <div className="flex items-center justify-between py-2">
        <div>
          <div className="font-medium">{a.purpose} • {a.provider}</div>
          <div className="text-sm text-gray-600">{a.dateTime.toLocaleString()} • {a.location}</div>
        </div>
        <div className="flex items-center gap-2">
          <Chip size="small" text={a.status} themeColor="info" />
          {a.tele && <Chip size="small" text="Televisit" themeColor="primary" />}
        </div>
      </div>
    );
  };

  const onResultRowClick = (e) => alert(`Open details for: ${e.dataItem.name}`);

  const notificationItems = notificationsSummary.map(n => ({ text: n.title }));

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      {/* Header */}
      <AppBar themeColor="inverse" className="sticky top-0 z-30">
        <AppBarSection>
          <Button fillMode="flat" onClick={() => setDrawerOpen(!drawerOpen)} aria-label="Toggle navigation">☰</Button>
          <AppBarSpacer style={{ width: 8 }} />
          <Avatar type="icon" rounded="full" size="small"><span>🏥</span></Avatar>
          <p className="ml-2 font-semibold">Health Portal</p>
        </AppBarSection>
        <AppBarSpacer />
        <AppBarSection className="hidden md:flex items-center gap-3">
          <Avatar type="image" rounded="full" size="small">
            {patientProfile.avatar ? (<img src={patientProfile.avatar} alt={patientProfile.name} />) : (<span className="k-avatar-text">{patientProfile.name.split(' ').map(s=>s[0]).join('')}</span>)}
          </Avatar>
          <p>{masked ? 'Patient' : patientProfile.name}</p>
          <Chip size="small" text={masked ? 'MRN ••••' : patientProfile.MRN} />
          <Switch ariaLabel="Privacy mask" checked={masked} onChange={(e)=>setMasked(e.value)} />
        </AppBarSection>
        <AppBarSpacer />
        <AppBarSection className="w-full md:w-auto">
          <AutoComplete
            data={["Appointments","Records","Medications","Billing"]}
            suggest
            placeholder="Search portal"
            value={searchValue}
            onChange={(e)=>setSearchValue(e.value)}
            className="w-full md:w-80"
          />
        </AppBarSection>
        <AppBarSpacer />
        <AppBarSection className="flex items-center gap-2">
          <Toolbar>
            <Button themeColor="primary" svgIcon={calendarIcon} onClick={()=>setShowDialog(true)}>Schedule</Button>
            <Button svgIcon={envelopeIcon}>New Message</Button>
            <Button themeColor="warning">Refill</Button>
          </Toolbar>
          <DropDownButton text="Notifications" items={notificationItems} svgIcon={bellIcon} />
          <DropDownButton text="Account" items={[{ text:'Profile'},{ text:'Settings'},{ text:'Help'},{ text:'Logout'}]} svgIcon={userIcon} />
        </AppBarSection>
      </AppBar>

      {/* Body layout */}
      <div className="flex">
        <Drawer
          expanded={drawerOpen}
          position="start"
          mode="push"
          width={260}
          items={navItems.map((n)=>({ text: n.text }))}
        >
          <DrawerContent>
            {/* Main content */}
            <div className="p-4 md:p-6">
              <Card className="mb-4">
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <CardTitle>Dashboard</CardTitle>
                      <Breadcrumb data={breadcrumbData} />
                    </div>
                    <div className="flex items-center gap-3">
                      <DateRangePicker value={range} onChange={(e)=>setRange(e.value)} />
                      <Button svgIcon={refreshIcon} onClick={onGlobalRefresh} disabled={loading}>
                        {loading ? 'Refreshing...' : 'Refresh'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Responsive grid of widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Upcoming Appointments */}
                <Card className="">
                  <CardHeader><CardTitle>Upcoming Appointments</CardTitle></CardHeader>
                  <CardBody>
                    <ListView data={appointments} item={AppointmentItem} navigatable className="" />
                    <div className="mt-3 flex gap-2">
                      <Button onClick={()=>alert('Reschedule flow')}>Reschedule</Button>
                      <Button title="Check-in availability may vary" disabled={false}>Check-in</Button>
                      <Button endIcon={externalLinkIcon} onClick={()=>window.open('https://tele.example.com','_blank','noopener')}>Join Televisit</Button>
                    </div>
                  </CardBody>
                  <CardActions>
                    <Button fillMode="flat">View All</Button>
                  </CardActions>
                </Card>

                {/* Recent Test Results */}
                <Card>
                  <CardHeader><CardTitle>Recent Test Results</CardTitle></CardHeader>
                  <CardBody>
                    <Grid
                      data={results}
                      autoProcessData
                      dataItemKey="id"
                      size="small"
                      style={{ maxHeight: 320 }}
                      onRowClick={onResultRowClick}
                    >
                      <GridColumn field="name" title="Test" />
                      <GridColumn field="date" title="Date" cells={{ data: (p)=> <td {...p.tdProps}>{new Date(p.dataItem.date).toLocaleDateString()}</td> }} />
                      <GridColumn field="keyValue" title="Value" />
                      <GridColumn field="flag" title="Flag" cells={{ data: (p)=> <td {...p.tdProps} className={p.dataItem.flag==='H'?'text-red-600':'text-emerald-600'}>{p.dataItem.flag}</td> }} />
                    </Grid>
                  </CardBody>
                </Card>

                {/* Medication Reminders */}
                <Card>
                  <CardHeader><CardTitle>Medication Reminders</CardTitle></CardHeader>
                  <CardBody>
                    <ListView
                      data={medicationList}
                      item={(props)=>{
                        const m = props.dataItem;
                        return (
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <div className="font-medium">{m.name} • {m.dose}</div>
                              <div className="text-sm text-gray-600">Next: {m.nextDue.toLocaleTimeString()}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button themeColor="success" onClick={()=>alert('Taken recorded')}>Taken</Button>
                              <Button disabled={!m.eligibleRefill} onClick={()=>alert('Refill request queued')}>Request Refill</Button>
                            </div>
                          </div>
                        );
                      }}
                    />
                  </CardBody>
                </Card>

                {/* Health Metrics Charts */}
                <Card className="xl:col-span-2">
                  <CardHeader><CardTitle>Health Metrics</CardTitle></CardHeader>
                  <CardBody>
                    <TabStrip selected={selectedTab} onSelect={(e)=>setSelectedTab(e.selected)}>
                      <TabStripTab title="Vitals">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Chart>
                            <ChartTitle text="Heart Rate" />
                            <ChartLegend position="bottom" />
                            <ChartCategoryAxis><ChartCategoryAxisItem categories={days} /></ChartCategoryAxis>
                            <ChartSeries>
                              <ChartSeriesItem type="line" data={hr} name="HR (bpm)" />
                            </ChartSeries>
                          </Chart>
                          <Chart>
                            <ChartTitle text="Steps" />
                            <ChartCategoryAxis><ChartCategoryAxisItem categories={days} /></ChartCategoryAxis>
                            <ChartSeries>
                              <ChartSeriesItem type="column" data={steps} name="Steps" />
                            </ChartSeries>
                          </Chart>
                        </div>
                      </TabStripTab>
                      <TabStripTab title="Labs">
                        <div className="flex items-center gap-6">
                          <Chart style={{ width: '70%' }}>
                            <ChartTitle text="Glucose (mg/dL)" />
                            <ChartCategoryAxis><ChartCategoryAxisItem categories={days} /></ChartCategoryAxis>
                            <ChartSeries>
                              <ChartSeriesItem type="line" data={[98,104,96,110,102,95,99]} name="Glucose" />
                            </ChartSeries>
                          </Chart>
                          <div className="flex-1">
                            <p className="mb-2">A1C trend</p>
                            <Sparkline data={[6.6,6.4,6.3,6.2,6.1,6.0]} />
                          </div>
                        </div>
                      </TabStripTab>
                      <TabStripTab title="Activity">
                        <Chart>
                          <ChartTitle text="Active Minutes" />
                          <ChartCategoryAxis><ChartCategoryAxisItem categories={days} /></ChartCategoryAxis>
                          <ChartSeries>
                            <ChartSeriesItem type="line" data={[34,42,28,50,39,33,29]} name="Minutes" />
                          </ChartSeries>
                        </Chart>
                      </TabStripTab>
                    </TabStrip>
                  </CardBody>
                </Card>

                {/* Quick Contact Form */}
                <Card>
                  <CardHeader><CardTitle>Quick Contact</CardTitle></CardHeader>
                  <CardBody>
                    <Form
                      initialValues={{ to: providers[0], subject: 'Question about medication', body: '', files: [] }}
                      onSubmit={(vals)=>{ alert('Message sent'); }}
                      render={(formProps) => (
                        <FormElement>
                          <FieldWrapper>
                            <label className="k-label">To</label>
                            <DropDownList data={providers} textField="name" dataItemKey="id" value={formProps.valueGetter('to')} onChange={(e)=>formProps.onChange({ value: e.value, field: 'to' })} />
                          </FieldWrapper>
                          <FieldWrapper>
                            <label className="k-label">Subject</label>
                            <TextBox maxLength={120} value={formProps.valueGetter('subject')} onChange={(e)=>formProps.onChange({ value: e.value, field: 'subject' })} />
                          </FieldWrapper>
                          <FieldWrapper>
                            <label className="k-label">Message</label>
                            <TextArea rows={4} autoSize value={formProps.valueGetter('body')} onChange={(e)=>formProps.onChange({ value: e.value, field: 'body' })} />
                          </FieldWrapper>
                          <FieldWrapper>
                            <label className="k-label">Attachments</label>
                            <Upload
                              restrictions={{ allowedExtensions: ['.pdf','.jpg','.png'], maxFileSize: 5*1024*1024 }}
                              saveUrl={'https://demos.telerik.com/kendo-react-ui/service-v4/upload/save'}
                              removeUrl={'https://demos.telerik.com/kendo-react-ui/service-v4/upload/remove'}
                            />
                          </FieldWrapper>
                          <div className="flex gap-2 mt-3">
                            <Button type="submit" themeColor="primary">Send</Button>
                            <Button onClick={()=>alert('Draft saved')}>Save Draft</Button>
                            <Button fillMode="flat" onClick={()=>formProps.onFormReset()}>Cancel</Button>
                          </div>
                        </FormElement>
                      )}
                    />
                  </CardBody>
                </Card>

                {/* Billing Summary */}
                <Card>
                  <CardHeader><CardTitle>Billing Summary</CardTitle></CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded bg-emerald-50">
                        <div className="text-xs text-gray-600">Balance Due</div>
                        <div className="text-lg font-semibold">{maskText('$245.40')}</div>
                      </div>
                      <div className="p-3 rounded bg-amber-50">
                        <div className="text-xs text-gray-600">Due Date</div>
                        <div className="text-lg font-semibold">{maskText('Sep 28')}</div>
                      </div>
                      <div className="p-3 rounded bg-sky-50">
                        <div className="text-xs text-gray-600">Last Payment</div>
                        <div className="text-lg font-semibold">{maskText('$100 • Aug 30')}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button themeColor="primary">Go to Billing</Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t bg-white px-6 py-4 text-sm">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex gap-4">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">HIPAA Notice</a>
            <a href="#">Contact Support</a>
          </div>
          <div className="flex items-center gap-2">
            <p>Locale</p>
            <DropDownList data={[{ code:'en-US', name:'English (US)' },{ code:'es-ES', name:'Español' }]} textField="name" dataItemKey="code" defaultValue={{ code:'en-US', name:'English (US)' }} style={{ width: 200 }} />
          </div>
        </div>
      </footer>

      {/* Global Dialog: Schedule */}
      {showDialog && (
        <Dialog title="Schedule Appointment" onClose={()=>setShowDialog(false)} style={{ width: 800 }}>
          <div className="space-y-4">
            <Stepper items={[{ label:'Service' },{ label:'Provider' },{ label:'Time' },{ label:'Review' }]} value={0} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DropDownList label="Service" data={[{ id:1, name:'Annual Physical' },{ id:2, name:'Derm Consult' }]} textField="name" dataItemKey="id" />
              <ComboBox data={providers} textField="name" dataItemKey="id" filterable placeholder="Search provider" />
              <DropDownList label="Location" data={[{ id:'tele', name:'Telehealth' },{ id:'clinic', name:'Main Clinic' }]} textField="name" dataItemKey="id" />
            </div>
            {/* <Scheduler height={300}>
              <WeekView />
            </Scheduler> */}
            <div className="flex justify-end gap-2">
              <Button onClick={()=>setShowDialog(false)}>Cancel</Button>
              <Button themeColor="primary" onClick={()=>{ alert('Appointment booked'); setShowDialog(false); }}>Confirm</Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Route loader */}
      {loading && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-40">
          <Loader type="infinite-spinner" size="large" />
        </div>
      )}
    </div>
  );
}

    
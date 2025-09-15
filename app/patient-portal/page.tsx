'use client';

import * as React from 'react';
import { StackLayout, AppBar, AppBarSection, AppBarSpacer, Drawer, DrawerContent, Card, CardHeader, CardTitle, CardBody, CardActions, TabStrip, TabStripTab, Stepper } from '@progress/kendo-react-layout';
import { Breadcrumb } from '@progress/kendo-react-layout';
import { Avatar } from '@progress/kendo-react-layout';
import { Typography } from '@progress/kendo-react-common';
import { Button, ButtonGroup } from '@progress/kendo-react-buttons';
import { Badge } from '@progress/kendo-react-indicators';
import { Popup } from '@progress/kendo-react-popup';
import { ListView, ListViewItemProps, ListViewItemWrapper } from '@progress/kendo-react-listview';
import { Dialog } from '@progress/kendo-react-dialogs';
import { Grid, GridColumn, GridRowClickEvent, GridCustomCellProps } from '@progress/kendo-react-grid';
import { DateRangePicker } from '@progress/kendo-react-dateinputs';
import { DatePicker, DateTimePicker, TimePicker } from '@progress/kendo-react-dateinputs';
import { Switch, Input, TextArea, MaskedTextBox, NumericTextBox, RadioGroup } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Upload } from '@progress/kendo-react-upload';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Loader } from '@progress/kendo-react-indicators';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { AutoComplete } from '@progress/kendo-react-dropdowns';
import { Scheduler, DayView, WeekView, MonthView } from '@progress/kendo-react-scheduler';
import { Chart, ChartTitle, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartLegend } from '@progress/kendo-react-charts';
import { LinearGauge } from '@progress/kendo-react-gauges';
import '@progress/kendo-theme-default/dist/all.css';

export default function PatientPortal() {
  // Mock data
  const authenticatedUser = { id: 'u1', name: 'Jane Admin' };
  const patientProfile = { name: 'John Doe', avatarUrl: '', mrn: '123456', dob: '01/01/1980', status: 'Active' };
  const breadcrumbs = [
    { id: 'home', text: 'Home' },
    { id: 'portal', text: 'Patient Portal' },
    { id: 'dashboard', text: 'Dashboard' }
  ];
  const notifications = {
    unreadCount: 3,
    items: [
      { id: 1, title: 'Lab results available', time: '2h ago', type: 'info', link: '#' },
      { id: 2, title: 'Appointment confirmed for Sep 25', time: '1d ago', type: 'success', link: '#' },
      { id: 3, title: 'Billing statement ready', time: '3d ago', type: 'warning', link: '#' }
    ]
  };
  const navItems = [
    { id: 'dash', text: 'Dashboard', route: '#dashboard', selected: true },
    { id: 'appt', text: 'Appointments', route: '#appointments' },
    { id: 'records', text: 'Medical Records', route: '#records' },
    { id: 'rx', text: 'Prescriptions', route: '#prescriptions' },
    { id: 'billing', text: 'Billing', route: '#billing' },
    { id: 'msgs', text: 'Messages', route: '#messages' }
  ];
  const appointments = {
    upcoming: [
      { id: 101, dateTime: new Date(new Date().setDate(new Date().getDate()+1)), provider: 'Dr. Smith', location: 'Televisit', type: 'Follow-up', status: 'Confirmed', visitLink: '#' },
      { id: 102, dateTime: new Date(new Date().setDate(new Date().getDate()+3)), provider: 'Dr. Lee', location: 'Main Clinic', type: 'Annual Exam', status: 'Pending', visitLink: '' }
    ]
  };
  const testResults = {
    recent: [
      { id: 'lab1', name: 'CBC', date: '2025-09-10', value: 'Normal', units: '', status: 'Normal' },
      { id: 'lab2', name: 'Lipid Panel', date: '2025-09-05', value: 'LDL 110', units: 'mg/dL', status: 'Borderline' },
      { id: 'lab3', name: 'A1C', date: '2025-08-20', value: '6.1', units: '%', status: 'High' }
    ]
  };
  const medications = {
    reminders: [
      { id: 'm1', medName: 'Atorvastatin', dose: '20 mg', time: new Date(), takenToday: false, refillEligible: true },
      { id: 'm2', medName: 'Metformin', dose: '500 mg', time: new Date(new Date().setHours(20,0,0,0)), takenToday: true, refillEligible: false }
    ]
  };
  const patientMetrics = {
    bp: [
      { date: new Date(2025,8,1), systolic: 122, diastolic: 78 },
      { date: new Date(2025,8,8), systolic: 126, diastolic: 80 },
      { date: new Date(2025,8,15), systolic: 118, diastolic: 76 }
    ],
    hr: [
      { date: new Date(2025,8,1), value: 72 },
      { date: new Date(2025,8,8), value: 75 },
      { date: new Date(2025,8,15), value: 69 }
    ],
    steps: [
      { day: 'Mon', steps: 8200 }, { day: 'Tue', steps: 10400 }, { day: 'Wed', steps: 6900 }, { day: 'Thu', steps: 12000 }, { day: 'Fri', steps: 9800 }
    ],
    bmi: 27.4
  };
  const providersList = [
    { id: 'p1', name: 'Dr. Anna Smith', specialty: 'Internal Medicine' },
    { id: 'p2', name: 'Dr. Ben Lee', specialty: 'Cardiology' }
  ];
  const visitTypes = [ 'Annual Exam', 'Follow-up', 'New Patient', 'Televisit' ];
  const pharmacies = [
    { id: 'ph1', name: 'CVS #100', address: '100 Main St', distance: '0.8 mi' },
    { id: 'ph2', name: 'Walgreens #200', address: '200 Oak Ave', distance: '1.5 mi' }
  ];
  const invoices = [
    { id: 'INV-1001', date: '2025-08-30', amount: 120.5, status: 'Unpaid', pdfUrl: '#' },
    { id: 'INV-1000', date: '2025-07-15', amount: 75.0, status: 'Paid', pdfUrl: '#' }
  ];
  const billingSummary = {
    balanceDue: { amount: 120.5, dueDate: '2025-09-30', overdue: true },
    lastPayment: { date: '2025-07-20', amount: 75.0, method: 'Visa •••• 4242' },
    upcoming: { nextStatement: '2025-10-01' }
  };

  // UI state
  const notifBtnRef = React.useRef(null);
  const [showNotif, setShowNotif] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [drawerExpanded, setDrawerExpanded] = React.useState(true);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [range, setRange] = React.useState({ start: new Date(2025,8,1), end: new Date(2025,8,30) });
  const [globalToasts, setGlobalToasts] = React.useState<Array<{ id: number; type: { style: 'info' | 'success' | 'warning' | 'error'; icon: boolean }; text: string }>>([{ id: 1, type: { style: 'info', icon: true }, text: 'Welcome back!' }]);
  const [busy, setBusy] = React.useState(false);
  const [stepValue, setStepValue] = React.useState(0);

  // Handlers
  const onRowClick = (e: GridRowClickEvent) => {};
  const openToast = (msg: string, style: 'info' | 'success' | 'warning' | 'error' = 'success') => setGlobalToasts((t)=>[...t,{ id: Date.now(), type:{ style, icon:true }, text: msg }]);

  // Renderers
  const NotificationItem = (props: ListViewItemProps) => {
    const item = props.dataItem;
    return (
      <ListViewItemWrapper style={{ padding: 12, borderBottom: '1px solid #eee' }}>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <span>{item.title}</span>
          <small style={{ color:'#6b7280' }}>{item.time}</small>
        </div>
      </ListViewItemWrapper>
    );
  };

  const StatusCell = (props: GridCustomCellProps) => (
    <td {...props.tdProps}>
      <Badge themeColor={props.dataItem.status === 'Confirmed' ? 'success' : 'warning'} rounded="full">{props.dataItem.status}</Badge>
    </td>
  );

  const ActionCell = (props: GridCustomCellProps) => (
    <td {...props.tdProps}>
      <Button size="small" onClick={()=>openToast('Opening details','info')}>View</Button>
    </td>
  );

  return (
    <Tooltip position="bottom" showCallout={true}>
      <div style={{ minHeight:'100vh', background:'#f7f7f9' }}>
        {/* Header */}
        <AppBar positionMode="sticky" themeColor="dark">
          <AppBarSection>
            <Button fillMode="flat" onClick={()=>setDrawerExpanded((e)=>!e)} aria-label="Toggle navigation">☰</Button>
            <AppBarSpacer style={{ width: 8 }} />
            <Avatar type="text" style={{ marginRight: 8 }}>PP</Avatar>
            <Typography.h4>Patient Portal</Typography.h4>
          </AppBarSection>
          <AppBarSection style={{ flex: 1, justifyContent:'center' }}>
            <Breadcrumb data={breadcrumbs} ariaLabel="Breadcrumb" textField="text" valueField="id" />
          </AppBarSection>
          <AppBarSection>
            <Card style={{ background:'transparent', boxShadow:'none' }}>
              <CardBody>
                <StackLayout orientation="horizontal" gap={8} align={{ vertical:'middle' }}>
                  <Avatar type="text" size="small">{patientProfile.name.split(' ').map(n=>n[0]).join('')}</Avatar>
                  <Typography.p>{patientProfile.name} • MRN {patientProfile.mrn} • DOB {patientProfile.dob}</Typography.p>
                  <Badge themeColor="success" rounded="full">{patientProfile.status}</Badge>
                </StackLayout>
              </CardBody>
            </Card>
            <AppBarSpacer style={{ width: 12 }} />
            <span title="Notifications">
              <Button ref={notifBtnRef} fillMode="flat" onClick={()=>setShowNotif((s)=>!s)}>
                Notifications
                {notifications.unreadCount > 0 && <Badge position="inside" themeColor="info" rounded="full">{notifications.unreadCount}</Badge>}
              </Button>
            </span>
            <Popup show={showNotif} anchor={notifBtnRef.current} onClose={()=>setShowNotif(false)}>
              <div style={{ width: 320, maxHeight: 360, overflow:'auto', background:'#fff', boxShadow:'0 2px 10px rgba(0,0,0,0.1)', padding:8 }}>
                <ListView data={notifications.items} item={NotificationItem} navigatable={true} />
              </div>
            </Popup>
            <Button fillMode="flat" onClick={()=>openToast('Open settings','info')} aria-label="Settings">Settings</Button>
            <Button themeColor="error" onClick={()=>setShowLogoutConfirm(true)}>Logout</Button>
          </AppBarSection>
        </AppBar>

        {/* Layout */}
        <Drawer
          expanded={drawerExpanded}
          mode="push"
          mini={false}
          width={220}
          items={navItems}
          onSelect={()=>{}}
        >
          <DrawerContent>
            <div style={{ padding:16 }}>
              {/* Dashboard grid/stack */}
              <StackLayout gap={16} orientation="vertical">
                <StackLayout orientation="horizontal" gap={16} style={{ flexWrap:'wrap' }}>
                  {/* Upcoming Appointments */}
                  <Card style={{ flex:'1 1 480px' }}>
                    <CardHeader>
                      <StackLayout orientation="horizontal" align={{ vertical:'middle' }} gap={8}>
                        <CardTitle>Upcoming Appointments</CardTitle>
                        <div style={{ marginLeft:'auto' }}>
                          <ButtonGroup>
                            <Button size="small" onClick={()=>openToast('Reschedule clicked','info')}>Reschedule</Button>
                            <Button size="small" themeColor="primary" onClick={()=>openToast('Join Televisit','success')}>Join Televisit</Button>
                          </ButtonGroup>
                        </div>
                      </StackLayout>
                    </CardHeader>
                    <CardBody>
                      <Grid data={appointments.upcoming} autoProcessData={true} dataItemKey="id" style={{ maxHeight: 260 }} onRowClick={onRowClick} sortable={true}>
                        <GridColumn field="dateTime" title="Date/Time" format="{0:MM/dd/yyyy h:mm a}" />
                        <GridColumn field="provider" title="Provider" />
                        <GridColumn field="location" title="Location/Type" />
                        <GridColumn field="status" title="Status" cells={{ data: StatusCell }} />
                        <GridColumn title="Actions" cells={{ data: ActionCell }} />
                      </Grid>
                    </CardBody>
                  </Card>

                  {/* Recent Test Results */}
                  <Card style={{ flex:'1 1 320px' }}>
                    <CardHeader>
                      <CardTitle>Recent Test Results</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <ListView
                        data={testResults.recent}
                        item={(p)=>{
                          const it = p.dataItem;
                          return (
                            <ListViewItemWrapper style={{ padding:10, borderBottom:'1px solid #eee' }}>
                              <div style={{ display:'flex', justifyContent:'space-between' }}>
                                <div>
                                  <strong>{it.name}</strong>
                                  <div style={{ color:'#6b7280', fontSize:12 }}>{it.date}</div>
                                </div>
                                <div style={{ textAlign:'right' }}>
                                  <Badge rounded="full" themeColor={it.status==='High'?'warning':'success'}>{it.status}</Badge>
                                  <div>{it.value} {it.units}</div>
                                </div>
                              </div>
                            </ListViewItemWrapper>
                          );
                        }}
                      />
                    </CardBody>
                    <CardActions>
                      <Button onClick={()=>openToast('Navigate to all results','info')}>View All</Button>
                    </CardActions>
                  </Card>
                </StackLayout>

                {/* Medication Reminders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Medication Reminders</CardTitle>
                  </CardHeader>
                  <CardBody>
                    {medications.reminders.map((m)=> (
                      <div key={m.id} style={{ display:'grid', gridTemplateColumns:'1fr 200px 120px 100px', gap:12, alignItems:'center', padding:'8px 0', borderBottom:'1px solid #f0f0f0' }}>
                        <div>
                          <strong>{m.medName} {m.dose}</strong>
                        </div>
                        <TimePicker value={m.time} format="hh:mm a" />
                        <Switch checked={m.takenToday} onChange={()=>openToast('Adherence updated','success')} ariaLabel={`Taken ${m.medName}`} />
                        <Button disabled={!m.refillEligible} onClick={()=>openToast('Refill requested','success')}>Refill</Button>
                      </div>
                    ))}
                  </CardBody>
                </Card>

                {/* Health Metrics */}
                <Card>
                  <CardHeader>
                    <StackLayout orientation="horizontal" gap={12} align={{ vertical:'middle' }}>
                      <CardTitle>Health Metrics</CardTitle>
                      <div style={{ marginLeft:'auto' }}>
                        <DateRangePicker value={range} onChange={(e)=>setRange(e.value as { start: Date; end: Date })} />
                      </div>
                    </StackLayout>
                  </CardHeader>
                  <CardBody>
                    <StackLayout orientation="horizontal" gap={16} style={{ flexWrap:'wrap' }}>
                      <div style={{ flex:'1 1 360px', minWidth:280, background:'#fff' }}>
                        <Chart>
                          <ChartTitle text="Blood Pressure & Heart Rate" />
                          <ChartCategoryAxis>
                            <ChartCategoryAxisItem categories={patientMetrics.bp.map(p=>p.date)} />
                          </ChartCategoryAxis>
                          <ChartSeries>
                            <ChartSeriesItem type="line" data={patientMetrics.bp.map(p=>p.systolic)} name="Systolic" />
                            <ChartSeriesItem type="line" data={patientMetrics.bp.map(p=>p.diastolic)} name="Diastolic" />
                            <ChartSeriesItem type="line" data={patientMetrics.hr.map(h=>h.value)} name="Heart Rate" />
                          </ChartSeries>
                          <ChartLegend position="bottom" />
                          <ChartValueAxis>
                            <ChartValueAxisItem />
                          </ChartValueAxis>
                        </Chart>
                      </div>
                      <div style={{ flex:'1 1 300px', minWidth:260, background:'#fff' }}>
                        <Chart>
                          <ChartTitle text="Daily Steps" />
                          <ChartCategoryAxis>
                            <ChartCategoryAxisItem categories={patientMetrics.steps.map(s=>s.day)} />
                          </ChartCategoryAxis>
                          <ChartSeries>
                            <ChartSeriesItem type="column" data={patientMetrics.steps.map(s=>s.steps)} name="Steps" />
                          </ChartSeries>
                        </Chart>
                      </div>
                      <div style={{ flex:'0 0 220px', minWidth:220, textAlign:'center', background:'#fff', padding:16 }}>
                        <Typography.h6>BMI</Typography.h6>
                        <LinearGauge pointer={{ value: patientMetrics.bmi }} scale={{ min: 16, max: 40, majorUnit: 4 }} />
                        <div style={{ marginTop:8 }}>{patientMetrics.bmi}</div>
                      </div>
                    </StackLayout>
                  </CardBody>
                </Card>

                {/* Quick Contact Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Contact</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <form onSubmit={(e)=>{ e.preventDefault(); setBusy(true); setTimeout(()=>{ setBusy(false); openToast('Message sent');}, 1000); }}>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                        <div>
                          <label className="k-label">Provider</label>
                          <DropDownList data={providersList} textField="name" dataItemKey="id" defaultValue={providersList[0]} itemRender={(li, itemProps)=>React.cloneElement(li, li.props, (<div><div>{itemProps.dataItem.name}</div><small style={{ color:'#6b7280' }}>{itemProps.dataItem.specialty}</small></div>))} />
                        </div>
                        <div>
                          <label className="k-label">Subject</label>
                          <Input required placeholder="Subject" />
                        </div>
                        <div style={{ gridColumn:'1 / span 2' }}>
                          <label className="k-label">Message</label>
                          <TextArea rows={4} placeholder="Type your message..." />
                        </div>
                        <div>
                          <label className="k-label">Priority</label>
                          <RadioGroup data={[{ label:'Normal', value:'normal' },{ label:'Urgent', value:'urgent' }]} defaultValue={'normal'} layout="horizontal" />
                        </div>
                        <div>
                          <label className="k-label">Attachment (optional)</label>
                          <Upload autoUpload={false} restrictions={{ allowedExtensions:['.pdf','.png','.jpg'], maxFileSize: 2*1024*1024 }} saveUrl={'https://demos.telerik.com/service/v2/odata/upload/save'} removeUrl={'https://demos.telerik.com/service/v2/odata/upload/remove'} />
                        </div>
                      </div>
                      <div style={{ marginTop:12, textAlign:'right' }}>
                        <Button themeColor="primary" type="submit">Send Message</Button>
                      </div>
                    </form>
                  </CardBody>
                </Card>

                {/* Scheduling Section (Stepper + Scheduler) */}
                <Card>
                  <CardHeader>
                    <StackLayout orientation="horizontal" gap={8} align={{ vertical:'middle' }}>
                      <CardTitle>Schedule an Appointment</CardTitle>
                      <span title="Scheduling policies">ℹ️</span>
                      <Button fillMode="link" onClick={()=>openToast('Open help','info')}>Help</Button>
                    </StackLayout>
                  </CardHeader>
                  <CardBody>
                    <Stepper value={stepValue} onChange={(e)=>setStepValue(e.value)} items={[{ label:'Select Type' },{ label:'Choose Provider' },{ label:'Pick Time' },{ label:'Confirm' }]} />
                    {stepValue===0 && (
                      <div style={{ marginTop:16 }}>
                        <DropDownList data={visitTypes} defaultValue={visitTypes[0]} />
                      </div>
                    )}
                    {stepValue===1 && (
                      <div style={{ marginTop:16 }}>
                        <AutoComplete data={providersList} textField="name" placeholder="Search provider" itemRender={(li, p)=>React.cloneElement(li, li.props, (<div><strong>{p.dataItem.name}</strong><div style={{ fontSize:12, color:'#6b7280' }}>{p.dataItem.specialty}</div></div>))} />
                      </div>
                    )}
                    {stepValue===2 && (
                      <div style={{ marginTop:16, display:'grid', gridTemplateColumns:'280px 1fr', gap:16 }}>
                        <DateTimePicker />
                        <Scheduler height={400}>
                          <WeekView />
                          <MonthView />
                        </Scheduler>
                        <div style={{ gridColumn:'1 / span 2' }}>
                          <TextArea rows={3} placeholder="Notes for provider..." />
                        </div>
                      </div>
                    )}
                    {stepValue===3 && (
                      <div style={{ marginTop:16 }}>
                        <Card style={{ background:'#fafafa' }}>
                          <CardBody>
                            <div>Summary: Type: {visitTypes[0]} • Provider: {providersList[0].name} • Time: {new Date().toLocaleString()}</div>
                          </CardBody>
                        </Card>
                        <div style={{ marginTop:12, textAlign:'right' }}>
                          <Button themeColor="primary" onClick={()=>openToast('Appointment confirmed')}>Confirm</Button>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>

                {/* Medical Records Section (Tabs) */}
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Records</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <TabStrip selected={selectedTab} onSelect={(e)=>setSelectedTab(e.selected)}>
                      <TabStripTab title="Encounters">
                        <Grid data={[{ id:1, date:'2025-08-10', type:'Office Visit', provider:'Dr. Smith' }]} autoProcessData={true} pageable={true} style={{ height: 300 }}>
                          <GridColumn field="date" title="Date" />
                          <GridColumn field="type" title="Type" />
                          <GridColumn field="provider" title="Provider" />
                        </Grid>
                      </TabStripTab>
                      <TabStripTab title="Lab Results">
                        <Grid data={testResults.recent} autoProcessData={true} style={{ height: 300 }}>
                          <GridColumn field="name" title="Test" />
                          <GridColumn field="date" title="Date" />
                          <GridColumn field="value" title="Value" />
                          <GridColumn field="status" title="Status" />
                        </Grid>
                      </TabStripTab>
                      <TabStripTab title="Imaging">
                        <StackLayout gap={8} orientation="horizontal" style={{ flexWrap:'wrap' }}>
                          {[1,2,3].map(i=> (
                            <img key={i} src={`https://picsum.photos/seed/${i}/160/120`} alt="Imaging thumbnail" loading="lazy" style={{ borderRadius:8 }} onClick={()=>openToast('Open viewer','info')} />
                          ))}
                        </StackLayout>
                      </TabStripTab>
                      <TabStripTab title="Documents">
                        <Grid data={[{ id:'D-1', title:'Discharge Summary', date:'2025-05-02' }]} autoProcessData={true}>
                          <GridColumn field="title" title="Title" />
                          <GridColumn field="date" title="Date" />
                          <GridColumn title="Actions" cells={{ data: (p)=> (<td {...p.tdProps}><Button size="small">View</Button> <Button size="small">Download</Button></td>) }} />
                        </Grid>
                      </TabStripTab>
                    </TabStrip>
                  </CardBody>
                </Card>

                {/* Prescriptions Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Prescriptions</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Grid data={[{ id:'rx1', name:'Atorvastatin', dose:'20 mg', directions:'QD', status:'Active' }]} autoProcessData={true}>
                      <GridColumn field="name" title="Name" />
                      <GridColumn field="dose" title="Dose" />
                      <GridColumn field="directions" title="Directions" />
                      <GridColumn title="Status" cells={{ data: (p)=> (<td {...p.tdProps}><Badge themeColor="success" rounded="full">{p.dataItem.status}</Badge></td>) }} />
                      <GridColumn title="Refill" cells={{ data: (p)=> (<td {...p.tdProps}><Button size="small" onClick={()=>openToast('Refill requested')}>Refill</Button></td>) }} />
                    </Grid>
                    <div style={{ marginTop:16 }}>
                      <CardTitle style={{ display:'block', marginBottom:8 }}>Refill Request</CardTitle>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                        <DropDownList data={pharmacies} textField="name" dataItemKey="id" defaultValue={pharmacies[0]} itemRender={(li, p)=>React.cloneElement(li, li.props, (<div><div>{p.dataItem.name}</div><small style={{ color:'#6b7280' }}>{p.dataItem.address} • {p.dataItem.distance}</small></div>))} />
                        <NumericTextBox label="Quantity" min={1} max={90} defaultValue={30} />
                        <TextArea rows={3} placeholder="Notes to provider/pharmacist" style={{ gridColumn:'1 / span 2' }} />
                        <div style={{ gridColumn:'1 / span 2', textAlign:'right' }}>
                          <Button themeColor="primary" onClick={()=>openToast('Refill submitted')}>Submit</Button>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Billing Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Billing</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <StackLayout orientation="horizontal" gap={16} style={{ flexWrap:'wrap' }}>
                      <Card style={{ flex:'1 1 260px' }}>
                        <CardBody>
                          <Typography.h6>Balance Due</Typography.h6>
                          <div style={{ fontSize:24, fontWeight:700 }}>${billingSummary.balanceDue.amount.toFixed(2)}</div>
                          <div>Due by {billingSummary.balanceDue.dueDate}</div>
                          {billingSummary.balanceDue.overdue && <Badge themeColor="error" rounded="full">Overdue</Badge>}
                        </CardBody>
                      </Card>
                      <Card style={{ flex:'1 1 260px' }}>
                        <CardBody>
                          <Typography.h6>Last Payment</Typography.h6>
                          <div>${billingSummary.lastPayment.amount.toFixed(2)} on {billingSummary.lastPayment.date}</div>
                          <div>{billingSummary.lastPayment.method}</div>
                        </CardBody>
                      </Card>
                      <Card style={{ flex:'1 1 260px' }}>
                        <CardBody>
                          <Typography.h6>Upcoming</Typography.h6>
                          <div>Next statement: {billingSummary.upcoming.nextStatement}</div>
                        </CardBody>
                      </Card>
                    </StackLayout>

                    <div style={{ marginTop:16 }}>
                      <Grid data={invoices} autoProcessData={true} pageable={true} style={{ maxHeight: 300 }}>
                        <GridColumn field="id" title="Invoice #" />
                        <GridColumn field="date" title="Date" />
                        <GridColumn field="amount" title="Amount" format="{0:c}" />
                        <GridColumn field="status" title="Status" />
                        <GridColumn title="Actions" cells={{ data: (p)=> (
                          <td {...p.tdProps}>
                            <Button size="small">View</Button> <Button size="small">Download</Button> <Button size="small" themeColor="primary" onClick={()=>openToast('Open payment form','info')}>Pay</Button>
                          </td>
                        ) }} />
                      </Grid>
                    </div>
                  </CardBody>
                </Card>

                {/* Footer */}
                <StackLayout orientation="horizontal" gap={12} style={{ justifyContent:'space-between', padding:'12px 4px', color:'#6b7280' }}>
                  <StackLayout orientation="horizontal" gap={12}>
                    <a href="#privacy">Privacy</a>
                    <a href="#terms">Terms</a>
                    <a href="#accessibility">Accessibility</a>
                  </StackLayout>
                  <StackLayout orientation="horizontal" gap={8} align={{ vertical:'middle' }}>
                    <DropDownList data={[{ code:'en', name:'English' },{ code:'es', name:'Español' }]} textField="name" dataItemKey="code" defaultValue={{ code:'en', name:'English' }} />
                    <small>v2.3.1</small>
                  </StackLayout>
                </StackLayout>
              </StackLayout>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Global Feedback */}
        <NotificationGroup style={{ position:'fixed', right: 16, bottom: 16, zIndex: 1000, display:'flex', flexDirection:'column', gap:8 }}>
          {globalToasts.map((n)=> (
            <Notification key={n.id} type={n.type} closable={true} onClose={()=>setGlobalToasts((t)=>t.filter(x=>x.id!==n.id))}>
              <span>{n.text}</span>
            </Notification>
          ))}
        </NotificationGroup>
        {busy && (
          <div style={{ position:'fixed', inset:0, background:'rgba(255,255,255,0.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
            <Loader type="infinite-spinner" size="large" />
          </div>
        )}

        {/* Confirm Logout Dialog */}
        {showLogoutConfirm && (
          <Dialog title="Confirm Logout" onClose={()=>setShowLogoutConfirm(false)}>
            <div style={{ marginBottom:16 }}>Are you sure you want to logout?</div>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
              <Button onClick={()=>setShowLogoutConfirm(false)}>Cancel</Button>
              <Button themeColor="error" onClick={()=>{ openToast('Logged out','info'); setShowLogoutConfirm(false); }}>Logout</Button>
            </div>
          </Dialog>
        )}
      </div>
    </Tooltip>
  );
}

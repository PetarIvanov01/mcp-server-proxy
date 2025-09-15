'use client';

import * as React from 'react';
import { AppBar, AppBarSection, AppBarSpacer, Avatar, Card, Splitter, SplitterPane, StackLayout, PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { Toolbar, Button, ButtonGroup } from '@progress/kendo-react-buttons';
import { Drawer, DrawerContent } from '@progress/kendo-react-layout';
import { ListView } from '@progress/kendo-react-listview';
import { Badge, Loader, Skeleton } from '@progress/kendo-react-indicators';
import { DateRangePicker } from '@progress/kendo-react-dateinputs';
import { Grid, GridColumn, GridRowClickEvent } from '@progress/kendo-react-grid';
import { Pager, PageChangeEvent } from '@progress/kendo-react-data-tools';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { TreeView, TreeViewItemClickEvent, TreeViewExpandChangeEvent } from '@progress/kendo-react-treeview';
import { Dialog } from '@progress/kendo-react-dialogs';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartLegend, ChartTitle, ChartTooltip } from '@progress/kendo-react-charts';
import { Form, Field, FormElement, FormRenderProps, FieldRenderProps, FormSeparator } from '@progress/kendo-react-form';
import { Label } from '@progress/kendo-react-labels';
import { Input, TextArea, TextBox } from '@progress/kendo-react-inputs';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { SvgIcon } from '@progress/kendo-react-common';
import { menuIcon, linkIcon, calendarIcon, imageIcon, chevronLeftIcon, chevronRightIcon, hyperlinkOpenIcon, instagramIcon, twitterIcon, facebookIcon } from '@progress/kendo-svg-icons';

export default function RockBandSite() {
  // Theme tokens (simplified)
  const theme = React.useMemo(() => ({ containerMax: 1200 }), []);

  // Mock data
  const bandMeta = {
    name: 'Neon Howl',
    logoUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=128&h=128&fit=crop',
    heroBackgroundUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1600&h=900&fit=crop',
    tagline: 'Amplify the night. Feel the roar.'
  };

  const navigationItems = [
    { id: 'hero', label: 'Hero', href: '#hero' },
    { id: 'tour', label: 'Tour', href: '#tour' },
    { id: 'gallery', label: 'Gallery', href: '#gallery' },
    { id: 'about', label: 'About Us', href: '#about' },
    { id: 'contact', label: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { platform: 'Twitter', url: 'https://twitter.com/neonhowl', icon: twitterIcon },
    { platform: 'Instagram', url: 'https://instagram.com/neonhowl', icon: instagramIcon },
    { platform: 'Facebook', url: 'https://facebook.com/neonhowl', icon: facebookIcon }
  ];

  const externalLinks = { ticketmasterUrl: 'https://www.ticketmaster.com/search?q=Neon+Howl' };

  const tourAnnouncement = { text: '2025 World Tour', dateRange: 'Mar–Nov 2025' };

  const initialRange = { start: new Date(), end: new Date(new Date().getTime() + 1000*60*60*24*30) };

  const allTourDates = React.useMemo(() => ([
    { id: 1, date: new Date(2025, 2, 12), venue: 'Echo Arena', city: 'Liverpool, UK', status: 'Low Tickets', ticketUrl: externalLinks.ticketmasterUrl, address: 'Kings Dock', openers: 'Feral Lights' },
    { id: 2, date: new Date(2025, 3, 5), venue: 'Velvet Hall', city: 'Berlin, DE', status: 'Available', ticketUrl: externalLinks.ticketmasterUrl, address: 'Mitte 12', openers: 'Static Pulse' },
    { id: 3, date: new Date(2025, 4, 22), venue: 'Sonic Dome', city: 'Austin, USA', status: 'Sold Out', ticketUrl: externalLinks.ticketmasterUrl, address: 'Riverside Dr', openers: 'Night Ember' },
    { id: 4, date: new Date(2025, 6, 3), venue: 'Neon Theatre', city: 'Tokyo, JP', status: 'Available', ticketUrl: externalLinks.ticketmasterUrl, address: 'Shibuya', openers: 'Kaze' }
  ]), [externalLinks.ticketmasterUrl]);

  const galleryCategories = [
    { text: 'Live Shows', expanded: true, items: [{ text: '2024 Tour' }, { text: 'Festivals' }] },
    { text: 'Studio', items: [{ text: 'Recording' }, { text: 'Mixing' }] },
    { text: 'Behind the Scenes' }
  ];

  const galleryImages = [
    { id: 'g1', category: 'Live Shows', title: 'Stage Inferno', thumbUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400', fullUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1400' },
    { id: 'g2', category: 'Studio', title: 'Vocal Booth', thumbUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=401', fullUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1401' },
    { id: 'g3', category: 'Behind the Scenes', title: 'Backstage Laughs', thumbUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=402', fullUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1402' }
  ];

  const listensOverTime = {
    months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    listens: [220, 250, 260, 300, 420, 480, 510, 550, 590, 620, 700, 760]
  };
  const generationDistribution = [
    { category: 'GenX', value: 10 },
    { category: 'Millennials', value: 40 },
    { category: 'GenZ', value: 45 },
    { category: 'Other', value: 5 }
  ];

  const contactInfo = [
    { icon: linkIcon, label: 'Booking', value: 'booking@neonhowl.com' },
    { icon: linkIcon, label: 'Management', value: 'management@neonhowl.com' },
    { icon: linkIcon, label: 'Press', value: 'press@neonhowl.com' },
    { icon: linkIcon, label: 'Phone', value: '+1 (555) 014-7812' },
    { icon: linkIcon, label: 'Address', value: '221B Sunset Blvd, Los Angeles, CA' }
  ];

  // UI State
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const [activeHash, setActiveHash] = React.useState('#hero');
  const [dateRange, setDateRange] = React.useState(initialRange);
  const [page, setPage] = React.useState({ skip: 0, take: 5 });
  const [selectedCategory, setSelectedCategory] = React.useState('Live Shows');
  const [lightboxId, setLightboxId] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [notification, setNotification] = React.useState<{ show: boolean; type: 'success' | 'error' | 'info' | 'warning'; text: string }>({ show: false, type: 'success', text: '' });

  // Helpers
  const scrollTo = (href: string) => {
    const id = href.replace('#','');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveHash('#' + id);
      setDrawerOpen(false);
    }
  };

  const filteredTours = React.useMemo(() => {
    const { start, end } = dateRange;
    return allTourDates.filter(d => (!start || d.date >= start) && (!end || d.date <= end));
  }, [allTourDates, dateRange]);

  const pagedTours = React.useMemo(() => filteredTours.slice(page.skip, page.skip + page.take), [filteredTours, page]);

  const onPagerChange = (e: PageChangeEvent) => setPage({ skip: e.skip, take: e.take });

  // Drawer items
  const drawerItems = navigationItems.map((n) => ({ text: n.label, selected: '#' + n.id === activeHash, route: n.href }));

  // Contact form validators
  const required = (value: any) => (value ? '' : 'This field is required.');
  const emailRe = /\S+@\S+\.[\S]+/;
  const emailValidator = (value: any) => (emailRe.test(value || '') ? '' : 'Enter a valid email.');
  const minMsg = (v: any) => (v && v.length >= 10 ? '' : 'Min 10 characters');

  const NameInput = (props: any) => {
    const { validationMessage, visited, ...others } = props;
    return (
      <div>
        <Label> Name </Label>
        <Input {...others} />
        {visited && validationMessage && <div className="k-text-error k-mt-1">{validationMessage}</div>}
      </div>
    );
  };
  const EmailInput = (props: any) => {
    const { validationMessage, visited, ...others } = props;
    return (
      <div>
        <Label> Email </Label>
        <Input type="email" {...others} />
        {visited && validationMessage && <div className="k-text-error k-mt-1">{validationMessage}</div>}
      </div>
    );
  };
  const MessageInput = (props: any) => {
    const { validationMessage, visited, ...others } = props;
    return (
      <div>
        <Label> Message </Label>
        <TextArea rows={5} maxLength={500} {...others} />
        {visited && validationMessage && <div className="k-text-error k-mt-1">{validationMessage}</div>}
      </div>
    );
  };

  const onSubmitContact = async (values: any) => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setNotification({ show: true, type: 'success', text: 'Thanks! We\'ll get back to you soon.' });
    setTimeout(() => setNotification({ show: false, type: 'success', text: '' }), 2500);
  };

  // Gallery derived
  const thumbs = galleryImages.filter(i => i.category === selectedCategory || selectedCategory === i.category || (selectedCategory && i.category?.includes(selectedCategory)) || selectedCategory === 'Live Shows' && i.category === 'Live Shows');
  const currentImage = lightboxId ? galleryImages.find(i => i.id === lightboxId) : null;
  const stepLightbox = (dir: number) => {
    if (!currentImage) return;
    const list = thumbs.length ? thumbs : galleryImages;
    const idx = list.findIndex(i => i.id === currentImage.id);
    const next = (idx + dir + list.length) % list.length;
    setLightboxId(list[next].id);
  };

  React.useEffect(() => {
    const onScroll = () => {
      const ids = navigationItems.map(n => n.id);
      let current = 'hero';
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom >= 80) current = id;
        }
      });
      setActiveHash('#' + current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ maxWidth: '100%', margin: 0 }}>
      {/* Header */}
      <AppBar positionMode="sticky" themeColor="dark" style={{ top: 0, zIndex: 10 }}>
        <AppBarSection>
          <StackLayout orientation="horizontal" gap={8} align={{ horizontal: 'start', vertical: 'middle' }}>
            <Avatar type="image" size="large" rounded="full">
              <img src={bandMeta.logoUrl} alt={bandMeta.name} width={40} height={40} />
            </Avatar>
            <h2 className="k-h2" style={{ margin: 0 }}>{bandMeta.name}</h2>
          </StackLayout>
        </AppBarSection>
        <AppBarSpacer style={{ width: 8 }} />
        <AppBarSection className="k-hidden md:k-display-flex">
          <ButtonGroup>
            {navigationItems.map((n) => (
              <Button key={n.id} fillMode="flat" selected={'#'+n.id===activeHash} aria-current={'#'+n.id===activeHash? 'page': undefined} onClick={() => scrollTo(n.href)}>
                {n.label}
              </Button>
            ))}
          </ButtonGroup>
        </AppBarSection>
        <AppBarSpacer />
        <AppBarSection>
          <StackLayout orientation="horizontal" gap={8} align={{ horizontal: 'end', vertical: 'middle' }}>
            <Button themeColor="primary" onClick={() => window.open(externalLinks.ticketmasterUrl, '_blank', 'noopener')} endIcon={<SvgIcon icon={hyperlinkOpenIcon} />}>
              Buy Tickets
            </Button>
            <Button fillMode="flat" svgIcon={menuIcon} aria-controls="mobile-drawer" aria-expanded={isDrawerOpen} onClick={() => setDrawerOpen(!isDrawerOpen)} className="md:k-hidden" />
          </StackLayout>
        </AppBarSection>
      </AppBar>

      {/* Drawer (mobile) */}
      <Drawer expanded={isDrawerOpen} position="start" mode="overlay" width={240} items={drawerItems} onSelect={(e) => { const item = navigationItems[e.itemIndex]; if (item) scrollTo(item.href); }}>
        <DrawerContent />
      </Drawer>

      {/* Main */}
      <main id="content" style={{ maxWidth: theme.containerMax, margin: '0 auto', padding: '24px 16px' }}>
        {/* Hero */}
        <section id="hero" style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.6), rgba(0,0,0,.6)), url(${bandMeta.heroBackgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <Card style={{ background: 'rgba(0,0,0,0.35)', color: 'white', padding: 24, maxWidth: 780, width: '100%' }}>
              <StackLayout orientation="vertical" gap={12}>
                <h1 className="k-h1" style={{ margin: 0 }}>{bandMeta.name}</h1>
                <div className="k-text-secondary">{bandMeta.tagline}</div>
                <div>
                  <Badge themeColor="info">{tourAnnouncement.text} · {tourAnnouncement.dateRange}</Badge>
                </div>
                <Button size="large" themeColor="primary" onClick={() => window.open(externalLinks.ticketmasterUrl, '_blank', 'noopener')} endIcon={<SvgIcon icon={hyperlinkOpenIcon} />}>Get Tickets</Button>
              </StackLayout>
            </Card>
          </div>
        </section>

        {/* Tour */}
        <section id="tour" style={{ marginBottom: 32 }}>
          <h2 className="k-h2" style={{ marginBottom: 12 }}>Tour Dates</h2>
          <StackLayout orientation="vertical" gap={12}>
            <StackLayout orientation="horizontal" gap={12} align={{ horizontal: 'start', vertical: 'middle' }}>
              <DateRangePicker value={dateRange} onChange={(e: any) => setDateRange({ start: e.value.start || new Date(), end: e.value.end || new Date() })} style={{ maxWidth: 360 }} />
              <ButtonGroup>
                <Button togglable selected={false} onClick={() => setDateRange({ start: new Date(), end: new Date(Date.now()+1000*60*60*24*30) })}>Next 30 Days</Button>
                <Button togglable selected={false} onClick={() => setDateRange({ start: new Date(new Date().getFullYear(),0,1), end: new Date(new Date().getFullYear(),11,31) })}>This Year</Button>
              </ButtonGroup>
            </StackLayout>

            <Tooltip content={(props: any) => (<div style={{ padding: 8 }}>{props.title}</div>)} anchorElement="target" position="bottom">
              <Grid data={pagedTours} autoProcessData={true} dataItemKey="id" navigatable={true} style={{ width: '100%' }} onRowClick={(e: GridRowClickEvent) => { const url = e.dataItem.ticketUrl; if (url) window.open(url, '_blank', 'noopener'); }} pageable={false} sortable={true}>
                <GridColumn field="date" title="Date" width="160px" format="{0:MMM dd, yyyy}" />
                <GridColumn field="venue" title="Venue" cells={{ data: (p) => <td {...p.tdProps} title={`${p.dataItem.address} — Openers: ${p.dataItem.openers}`}>{p.children}</td> }} />
                <GridColumn field="city" title="City" width="200px" />
                <GridColumn field="status" title="Status" width="160px" cells={{ data: (p) => <td {...p.tdProps}><Badge themeColor={p.dataItem.status==='Sold Out' ? 'error' : (p.dataItem.status==='Low Tickets' ? 'warning':'success')}>{p.dataItem.status}</Badge></td> }} />
                <GridColumn title="Actions" width="160px" cells={{ data: (p) => <td {...p.tdProps}><Button size="small" onClick={(e)=>{ e.stopPropagation(); window.open(p.dataItem.ticketUrl,'_blank','noopener'); }}>Buy</Button></td> }} />
              </Grid>
            </Tooltip>

            <Pager skip={page.skip} take={page.take} total={filteredTours.length} onPageChange={(e: PageChangeEvent) => onPagerChange(e)} previousNext={true} type="numeric" pageSizes={[5,10]} />
          </StackLayout>
        </section>

        {/* Gallery */}
        <section id="gallery" style={{ marginBottom: 32 }}>
          <h2 className="k-h2" style={{ marginBottom: 12 }}>Gallery</h2>
          <Splitter style={{ height: 480 }}>
            <SplitterPane size="30%" min="200px" orientation="vertical" overlay={false} containsSplitter={false}>
              <PanelBar expandMode="multiple">
                <PanelBarItem title="Categories">
                  <TreeView data={galleryCategories} expandIcons={true} onItemClick={(e: TreeViewItemClickEvent) => setSelectedCategory(e.item.text)} onExpandChange={(e: TreeViewExpandChangeEvent) => { e.item.expanded = !e.item.expanded; }} aria-label="Gallery categories" />
                </PanelBarItem>
              </PanelBar>
            </SplitterPane>
            <SplitterPane orientation="vertical" overlay={false} containsSplitter={false}>
              {thumbs.length === 0 ? (
                <Skeleton shape="rectangle" style={{ width: '100%', height: '100%' }} />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                  {thumbs.map(img => (
                    <Card key={img.id} style={{ cursor: 'pointer', overflow: 'hidden' }} onClick={() => setLightboxId(img.id)}>
                      <div style={{ position: 'relative', paddingTop: '66%', background: `url(${img.thumbUrl}) center/cover no-repeat` }} aria-label={img.title} />
                      <div style={{ padding: 8 }}>{img.title}</div>
                    </Card>
                  ))}
                </div>
              )}
            </SplitterPane>
          </Splitter>

          {currentImage && (
            <Dialog title={currentImage.title} onClose={() => setLightboxId(null)}>
              <StackLayout orientation="vertical" gap={12}>
                <div style={{ width: '100%', maxHeight: '60vh', overflow: 'hidden', borderRadius: 8 }}>
                  <img src={currentImage.fullUrl} alt={currentImage.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <StackLayout orientation="horizontal" gap={8} align={{ horizontal: 'center', vertical: 'middle' }}>
                  <Button startIcon={<SvgIcon icon={chevronLeftIcon} />} onClick={() => stepLightbox(-1)}>Prev</Button>
                  <Button endIcon={<SvgIcon icon={chevronRightIcon} />} onClick={() => stepLightbox(1)}>Next</Button>
                  <Button onClick={() => setLightboxId(null)}>Close</Button>
                </StackLayout>
              </StackLayout>
            </Dialog>
          )}
        </section>

        {/* About */}
        <section id="about" style={{ marginBottom: 32 }}>
          <h2 className="k-h2" style={{ marginBottom: 12 }}>About Us</h2>
          <StackLayout orientation="vertical" gap={16}>
            <p>
              Neon Howl formed in 2019, melding analog synths with blistering guitars. From underground clubs to sold-out arenas, our sound celebrates the energy of live music and the electricity of night life.
            </p>
            <StackLayout orientation="horizontal" gap={16} className="k-flex-wrap">
              <Card style={{ flex: '1 1 320px', padding: 12 }}>
                <Chart>
                  <ChartTitle text="Spotify Listens (last 12 months)" />
                  <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={listensOverTime.months} />
                  </ChartCategoryAxis>
                  <ChartSeries>
                    <ChartSeriesItem type="line" data={listensOverTime.listens} name="Listens" style="smooth" />
                  </ChartSeries>
                  <ChartTooltip render={(e: any) => (<div style={{ padding: 6 }}>{e.point?.category}: {e.point?.value}</div>)} />
                </Chart>
              </Card>
              <Card style={{ flex: '1 1 320px', padding: 12 }}>
                <Chart>
                  <ChartTitle text="Listener Generations" />
                  <ChartSeries>
                    <ChartSeriesItem type="pie" data={generationDistribution} field="value" categoryField="category" />
                  </ChartSeries>
                  <ChartLegend position="right" />
                </Chart>
              </Card>
            </StackLayout>
          </StackLayout>
        </section>

        {/* Contact */}
        <section id="contact" style={{ marginBottom: 32 }}>
          <h2 className="k-h2" style={{ marginBottom: 12 }}>Contact Us</h2>
          <StackLayout orientation="horizontal" gap={16} className="k-flex-wrap">
            <Card style={{ flex: '1 1 420px', padding: 16 }}>
              <Form
                initialValues={{ name: 'Alex Fan', email: 'alex@example.com', message: 'Hi Neon Howl! I\'d like to inquire about booking.' }}
                onSubmit={onSubmitContact}
                render={(formProps /** @type {FormRenderProps} */) => (
                  <FormElement style={{ width: '100%' }}>
                    <Field name="name" component={NameInput} validator={required} />
                    <Field name="email" component={EmailInput} validator={(v) => required(v) || emailValidator(v)} />
                    <Field name="message" component={MessageInput} validator={(v) => required(v) || minMsg(v)} />
                    <FormSeparator />
                    <StackLayout orientation="horizontal" gap={8}>
                      <Button themeColor="primary" type="submit" disabled={!formProps.allowSubmit || submitting}>Send Message</Button>
                      <Button type="reset" onClick={formProps.onFormReset}>Reset</Button>
                      {submitting && <Loader type="infinite-spinner" />}
                    </StackLayout>
                  </FormElement>
                )}
              />
              <NotificationGroup style={{ position: 'fixed', top: 80, right: 16 }}>
                {notification.show && (
                  <Notification type={{ style: notification.type, icon: true }} closable={true} onClose={() => setNotification({ show: false, type: 'success', text: '' })}>
                    <span>{notification.text}</span>
                  </Notification>
                )}
              </NotificationGroup>
            </Card>

            <Card style={{ flex: '1 1 300px', padding: 16 }}>
              <h3 className="k-h4" style={{ marginTop: 0 }}>Contact Info</h3>
              <ListView
                data={contactInfo}
                item={(props) => (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--kendo-color-border,#2a2a2a20)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <SvgIcon icon={props.dataItem.icon} />
                      <strong>{props.dataItem.label}:</strong>
                    </span>
                    <Button fillMode="link" onClick={() => navigator.clipboard.writeText(props.dataItem.value)}>{props.dataItem.value}</Button>
                  </div>
                )}
              />
              <Toolbar overflow="scroll" style={{ marginTop: 12 }}>
                {socialLinks.map((s) => (
                  <Button key={s.platform} svgIcon={s.icon} fillMode="flat" onClick={() => window.open(s.url, '_blank', 'noopener')} aria-label={s.platform} />
                ))}
              </Toolbar>
            </Card>
          </StackLayout>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--kendo-color-border,#2a2a2a20)', padding: '24px 16px' }}>
        <div style={{ maxWidth: theme.containerMax, margin: '0 auto' }}>
          <StackLayout orientation="horizontal" gap={16} className="k-flex-wrap">
            <Card style={{ flex: '1 1 260px', padding: 12 }}>
              <StackLayout orientation="horizontal" gap={8} align={{ vertical: 'middle' }}>
                <Avatar type="image" size="large" rounded="full">
                  <img src={bandMeta.logoUrl} alt={`${bandMeta.name} logo`} width={40} height={40} />
                </Avatar>
                <div>
                  <div className="k-h5" style={{ margin: 0 }}>{bandMeta.name}</div>
                  <div className="k-text-secondary">{bandMeta.tagline}</div>
                </div>
              </StackLayout>
            </Card>

            <Card style={{ flex: '1 1 220px', padding: 12 }}>
              <h4 className="k-h5" style={{ marginTop: 0 }}>Quick Links</h4>
              <ListView
                data={navigationItems}
                item={(p) => (
                  <Button fillMode="link" onClick={() => scrollTo(p.dataItem.href)}>{p.dataItem.label}</Button>
                )}
              />
            </Card>

            <Card style={{ flex: '1 1 320px', padding: 12 }}>
              <h4 className="k-h5" style={{ marginTop: 0 }}>Newsletter</h4>
              <StackLayout orientation="horizontal" gap={8}>
                <TextBox placeholder="you@example.com" style={{ flex: 1 }} />
                <Button themeColor="primary">Subscribe</Button>
              </StackLayout>
              <Toolbar overflow="scroll" style={{ marginTop: 12 }}>
                {socialLinks.map((s) => (
                  <Button key={s.platform} svgIcon={s.icon} fillMode="flat" onClick={() => window.open(s.url, '_blank', 'noopener')} aria-label={s.platform} />
                ))}
              </Toolbar>
            </Card>
          </StackLayout>
          <div style={{ borderTop: '1px solid var(--kendo-color-border,#2a2a2a20)', marginTop: 16, paddingTop: 12, textAlign: 'center' }}>
            © {new Date().getFullYear()} {bandMeta.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

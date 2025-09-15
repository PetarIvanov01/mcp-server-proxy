
    'use client'; 


    import * as React from 'react';
import { StackLayout, AppBar, AppBarSection, AppBarSpacer, Card, CardHeader, CardTitle, CardBody, CardActions, GridLayout } from '@progress/kendo-react-layout';
import { Menu } from '@progress/kendo-react-layout';
import { Avatar } from '@progress/kendo-react-layout';
import { Button, Chip, Toolbar } from '@progress/kendo-react-buttons';
import { Drawer, DrawerContent, ExpansionPanel, ExpansionPanelContent } from '@progress/kendo-react-layout';
import { ListView, ListViewItemProps } from '@progress/kendo-react-listview';
import { Typography } from '@progress/kendo-react-common';
import { Label, Error as KendoError } from '@progress/kendo-react-labels';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Badge } from '@progress/kendo-react-indicators';
import { Popup } from '@progress/kendo-react-popup';
import { Dialog } from '@progress/kendo-react-dialogs';
import { ScrollView } from '@progress/kendo-react-scrollview';
import { Form, Field, FormElement, FieldWrapper, FormRenderProps, FieldRenderProps } from '@progress/kendo-react-form';
import { TextBox, TextArea, Checkbox } from '@progress/kendo-react-inputs';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { SvgIcon } from '@progress/kendo-react-common';
import { menuIcon, eyeIcon, downloadIcon, linkIcon } from '@progress/kendo-svg-icons';

    export default function PortfolioLandingPage() {
  // Mock data
  const brand = { logoSrc: 'https://placehold.co/40x40', altText: 'Brand Logo' };
  const navigationItems = [
    { text: 'Home', url: '#home' },
    { text: 'Skills', url: '#skills' },
    { text: 'Work', url: '#work' },
    { text: 'Testimonials', url: '#testimonials' },
    { text: 'Contact', url: '#contact' }
  ];
  const cta = { label: 'Contact', href: '#contact' };

  const hero = {
    headline: 'Hi, I’m Jane Doe',
    subheadline: 'Designer & Front-end Developer',
    bio: 'I craft elegant web experiences with performance and accessibility in mind.',
    primaryCta: { label: 'View Work', href: '#work' },
    secondaryCta: { label: 'Download CV', href: '/Jane-Doe-CV.pdf' }
  };
  const profileImage = { src: 'https://placehold.co/640x800', alt: 'Jane Doe headshot' };
  const socialLinks = [
    { platform: 'Twitter', url: 'https://twitter.com/', icon: 'k-i-twitter' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/', icon: 'k-i-linkedin' },
    { platform: 'GitHub', url: 'https://github.com/', icon: 'k-i-github' }
  ];
  const skills = [
    { name: 'JavaScript', levelPercent: 85 },
    { name: 'React', levelPercent: 90 },
    { name: 'TypeScript', levelPercent: 80 },
    { name: 'UI/UX', levelPercent: 75 }
  ];
  const portfolioItems = [
    {
      id: 1,
      title: 'E‑commerce Redesign',
      coverSrc: 'https://placehold.co/800x600',
      alt: 'E‑commerce cover',
      media: [
        { src: 'https://placehold.co/1200x800?text=Slide+1' },
        { src: 'https://placehold.co/1200x800?text=Slide+2' }
      ],
      categories: ['UI', 'Web'],
      description: 'A modern redesign focused on conversion.',
      role: 'Lead Designer',
      tools: ['Figma', 'React', 'KendoReact'],
      liveLink: 'https://example.com'
    },
    {
      id: 2,
      title: 'SaaS Dashboard',
      coverSrc: 'https://placehold.co/800x600',
      alt: 'SaaS cover',
      media: [
        { src: 'https://placehold.co/1200x800?text=Dashboard+1' },
        { src: 'https://placehold.co/1200x800?text=Dashboard+2' }
      ],
      categories: ['Product', 'Web'],
      description: 'Analytics dashboard for growth teams.',
      role: 'Front-end Engineer',
      tools: ['React', 'KendoReact', 'TypeScript'],
      liveLink: 'https://example.com'
    }
  ];
  const testimonials = [
    {
      quote: 'Outstanding collaboration and attention to detail.',
      name: 'Alex Doe',
      title: 'CMO',
      company: 'Acme Inc.',
      avatarSrc: 'https://placehold.co/64x64',
      companyLogoSrc: 'https://placehold.co/100x40?text=Acme'
    },
    {
      quote: 'Delivered beyond expectations on a tight timeline.',
      name: 'Maria Green',
      title: 'Founder',
      company: 'Startly',
      avatarSrc: 'https://placehold.co/64x64',
      companyLogoSrc: 'https://placehold.co/100x40?text=Startly'
    }
  ];
  const contact = {
    apiEndpoint: '/api/contact',
    successMessage: 'Your message has been sent successfully.',
    errorMessage: 'Something went wrong. Please try again.'
  };
  const contactDetails = {
    email: 'hello@janedoe.dev',
    phone: '+1 (555) 010-1234',
    location: 'Remote • NYC time',
    officeHours: 'Mon–Fri, 9am–5pm'
  };
  const footerLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Work', href: '#work' },
    { label: 'Contact', href: '#contact' }
  ];

  // Header state
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [activeAnchor, setActiveAnchor] = React.useState('#home');

  React.useEffect(() => {
    const onScroll = () => {
      const ids = ['#home', '#skills', '#work', '#testimonials', '#contact'];
      const offsets = ids.map((id) => {
        const el = document.querySelector(id);
        return { id, top: el ? Math.abs((el as HTMLElement).getBoundingClientRect().top) : Infinity };
      });
      offsets.sort((a, b) => a.top - b.top);
      setActiveAnchor(offsets[0].id);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onMenuSelect = (e: any) => {
    const href = e.item?.url;
    if (href) {
      e.syntheticEvent.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setDrawerOpen(false);
    }
  };

  // Portfolio modal state
  const [selectedItem, setSelectedItem] = React.useState(null as null | typeof portfolioItems[number]);

  // Contact form submit state
  const [notify, setNotify] = React.useState<{ type: 'success' | 'error'; visible: boolean }>({ type: 'success', visible: false });

  // Skills animation helper
  const [inView, setInView] = React.useState(false);
  const skillsRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setInView(true);
    }, { threshold: 0.2 });
    if (skillsRef.current) io.observe(skillsRef.current);
    return () => io.disconnect();
  }, []);

  // ListView item renderers
  const MobileNavItem = (props: ListViewItemProps) => (
    <div className="px-4 py-3 hover:bg-gray-50">
      <a
        href={props.dataItem.url}
        onClick={(e) => {
          e.preventDefault();
          document.querySelector(props.dataItem.url)?.scrollIntoView({ behavior: 'smooth' });
          setDrawerOpen(false);
        }}
        className="block text-gray-800"
      >
        {props.dataItem.text}
      </a>
    </div>
  );

  const ToolsTag = ({ text }: { text: string }) => (
    <Chip size="small" themeColor="base" rounded="full" fillMode="outline">{text}</Chip>
  );

  const ContactTextField = (fieldProps: FieldRenderProps) => {
    const { validationMessage, visited, label, ...others } = fieldProps as any;
    return (
      <FieldWrapper>
        <Label editorId={others.id}>{label}</Label>
        <TextBox {...others} />
        {visited && validationMessage && <KendoError>{validationMessage}</KendoError>}
      </FieldWrapper>
    );
  };

  const ContactTextArea = (fieldProps: FieldRenderProps) => {
    const { validationMessage, visited, label, ...others } = fieldProps as any;
    return (
      <FieldWrapper>
        <Label editorId={others.id}>{label}</Label>
        <TextArea {...others} rows={5} autoSize={true} />
        {visited && validationMessage && <KendoError>{validationMessage}</KendoError>}
      </FieldWrapper>
    );
  };

  const required = (value: any) => (value ? '' : 'This field is required.');
  const min20 = (value: string) => (value && value.length >= 20 ? '' : 'Please enter at least 20 characters.');
  const emailRx = /\S+@\S+\.\S+/;
  const emailValidator = (value: string) => (emailRx.test(value) ? '' : 'Enter a valid email address.');

  const submitContact = async (values: any) => {
    try {
      await new Promise((r) => setTimeout(r, 800));
      // pretend POST to contact.apiEndpoint
      setNotify({ type: 'success', visible: true });
    } catch (e) {
      setNotify({ type: 'error', visible: true });
    } finally {
      setTimeout(() => setNotify({ type: 'success', visible: false }), 3000);
    }
  };

  const categories = ['All', ...Array.from(new Set(portfolioItems.flatMap((p) => p.categories)))];
  const [activeCategory, setActiveCategory] = React.useState('All');
  const filteredPortfolio = activeCategory === 'All' ? portfolioItems : portfolioItems.filter((p) => p.categories.includes(activeCategory));

  return (
    <div className="min-h-screen text-gray-800">
      {/* Header */}
      <AppBar positionMode="sticky" className="backdrop-blur bg-white/80 shadow-sm">
        <AppBarSection>
          <a href="#home" onClick={(e)=>{e.preventDefault();document.querySelector('#home')?.scrollIntoView({behavior:'smooth'});}} className="flex items-center gap-2">
            <Avatar type="image" size="medium" rounded="full">
              <img src={brand.logoSrc} alt={brand.altText} width={32} height={32} />
            </Avatar>
            <span className="font-semibold">Jane Doe</span>
          </a>
        </AppBarSection>
        <AppBarSpacer style={{ flex: 1 }} />
        <AppBarSection className="hidden md:block">
          <Menu
            items={navigationItems.map((n) => ({ text: n.text, url: n.url, cssClass: activeAnchor === n.url ? 'k-selected' : '' }))}
            onSelect={onMenuSelect}
          />
        </AppBarSection>
        <AppBarSection className="hidden md:block">
          <Button themeColor="primary" onClick={()=>document.querySelector(cta.href)?.scrollIntoView({behavior:'smooth'})}>{cta.label}</Button>
        </AppBarSection>
        <AppBarSection className="md:hidden">
          <Button aria-controls="mobile-drawer" aria-expanded={drawerOpen} fillMode="flat" svgIcon={menuIcon} onClick={()=>setDrawerOpen((s)=>!s)} />
        </AppBarSection>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        expanded={drawerOpen}
        position="end"
        mode="overlay"
        items={[]}
        onOverlayClick={()=>setDrawerOpen(false)}
      >
        <DrawerContent>
          <div id="mobile-drawer" className="p-4 space-y-4">
            <ListView data={navigationItems} item={MobileNavItem} />
            <Button themeColor="secondary" onClick={()=>{document.querySelector(cta.href)?.scrollIntoView({behavior:'smooth'}); setDrawerOpen(false);}} className="w-full">{cta.label}</Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4">
        {/* Hero */}
        <section id="home" className="py-16">
          <GridLayout cols={[{ width: '100%' }, { width: '100%' }]} gap={{ rows: 24, cols: 24 }}>
            <div>
              <Card className="shadow-md rounded-xl overflow-hidden">
                <CardBody>
                  <img src={profileImage.src} alt={profileImage.alt} className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-[1.02]" />
                </CardBody>
              </Card>
            </div>
            <div className="flex items-center">
              <StackLayout orientation="vertical" gap={16}>
                <h1 className="text-4xl md:text-5xl font-extrabold">{hero.headline}</h1>
                <p className="text-xl text-gray-600">{hero.subheadline}</p>
                <p className="text-gray-700">{hero.bio}</p>
                <StackLayout gap={12}>
                  <Button themeColor="primary" size="large" onClick={()=>document.querySelector(hero.primaryCta.href)?.scrollIntoView({behavior:'smooth'})} startIcon={<SvgIcon icon={eyeIcon} />}>{hero.primaryCta.label}</Button>
                  <a href={hero.secondaryCta.href} download>
                    <Button fillMode="outline" size="large" startIcon={<SvgIcon icon={downloadIcon} />}> {hero.secondaryCta.label}</Button>
                  </a>
                </StackLayout>
                <StackLayout gap={8}>
                  {socialLinks.map((s) => (
                    <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform} className="text-gray-600 hover:text-gray-900">
                      <span className={`k-icon ${s.icon}`} />
                    </a>
                  ))}
                </StackLayout>
              </StackLayout>
            </div>
          </GridLayout>
        </section>

        {/* Skills */}
        <section id="skills" className="py-16 border-t" ref={skillsRef}>
          <StackLayout orientation="vertical" gap={16}>
            <h2 className="text-3xl font-bold">Skills</h2>
            <p className="text-gray-600">A snapshot of tools and technologies I work with.</p>
            <GridLayout cols={[{ width: '1fr' }, { width: '1fr' }, { width: '1fr' }]} gap={{ rows: 16, cols: 16 }}>
              {skills.map((s) => (
                <Card key={s.name} className="p-4 rounded-lg shadow-sm">
                  <StackLayout orientation="vertical" gap={8}>
                    <Label>{s.name}</Label>
                    <ProgressBar value={inView ? s.levelPercent : 0} ariaLabel={`${s.name} proficiency`} animation={{ duration: 600 }} />
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Badge fillMode="outline" themeColor="info">{s.levelPercent}%</Badge>
                    </div>
                  </StackLayout>
                </Card>
              ))}
            </GridLayout>
          </StackLayout>
        </section>

        {/* Portfolio */}
        <section id="work" className="py-16 border-t">
          <StackLayout orientation="vertical" gap={16}>
            <h2 className="text-3xl font-bold">Selected Work</h2>
            <p className="text-gray-600">A curated selection of recent projects.</p>
            <Toolbar className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Chip key={cat} selected={activeCategory === cat} onClick={()=>setActiveCategory(cat)} rounded="full" fillMode={activeCategory===cat?'solid':'outline'}>{cat}</Chip>
              ))}
            </Toolbar>
            <GridLayout cols={[{ width: '1fr' }, { width: '1fr' }, { width: '1fr' }]} gap={{ rows: 16, cols: 16 }}>
              {filteredPortfolio.map((item) => (
                <Card key={item.id} className="group overflow-hidden rounded-xl shadow-md">
                  <CardBody>
                    <div className="relative">
                      <img src={item.coverSrc} alt={item.alt} className="w-full h-auto rounded-md" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button fillMode="link" themeColor="light" onClick={()=>setSelectedItem(item)} startIcon={<SvgIcon icon={eyeIcon} />}>Quick View</Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <CardTitle>{item.title}</CardTitle>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.categories.map((c) => (<ToolsTag key={c} text={c} />))}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </GridLayout>
          </StackLayout>
        </section>

        {/* Portfolio Dialog */}
        {selectedItem && (
          <Dialog title={selectedItem.title} onClose={()=>setSelectedItem(null)} width={900} height={600}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <ScrollView style={{ height: 460 }} pageable={true} endless={false}>
                  {selectedItem.media.map((m, idx) => (
                    <div key={idx} className="h-[460px] flex items-center justify-center bg-gray-50">
                      <img src={m.src} alt={`${selectedItem.title} ${idx+1}`} className="max-h-full w-auto" />
                    </div>
                  ))}
                </ScrollView>
              </div>
              <div className="space-y-4 overflow-auto" style={{ maxHeight: 460 }}>
                <ExpansionPanel title="Details" expanded={true} onAction={()=>{}}>
                  <ExpansionPanelContent>
                    <p className="text-gray-700 mb-3">{selectedItem.description}</p>
                    <div className="text-sm text-gray-600"><strong>Role:</strong> {selectedItem.role}</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedItem.tools.map((t) => (<ToolsTag key={t} text={t} />))}
                    </div>
                    {selectedItem.liveLink && (
                      <a href={selectedItem.liveLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-4">
                        <Button endIcon={<SvgIcon icon={linkIcon} />} themeColor="primary">View Live</Button>
                      </a>
                    )}
                  </ExpansionPanelContent>
                </ExpansionPanel>
              </div>
            </div>
          </Dialog>
        )}

        {/* Testimonials */}
        <section id="testimonials" className="py-16 border-t">
          <h2 className="text-3xl font-bold mb-6">What Clients Say</h2>
          <ScrollView style={{ height: 260 }} pageable={true}>
            {testimonials.map((t, idx) => (
              <div key={idx} className="h-[260px] flex items-center justify-center">
                <Card className="max-w-2xl p-6 shadow-md">
                  <StackLayout orientation="vertical" gap={12}>
                    <blockquote className="text-xl text-gray-800">“{t.quote}”</blockquote>
                    <StackLayout gap={12}>
                      <Avatar type="image" rounded="full" size="large">
                        <img src={t.avatarSrc} alt={t.name} width={48} height={48} />
                      </Avatar>
                      <div>
                        <strong className="block">{t.name}</strong>
                        <span className="text-gray-600 text-sm">{t.title}{t.company ? `, ${t.company}` : ''}</span>
                      </div>
                    </StackLayout>
                    {t.companyLogoSrc && <img src={t.companyLogoSrc} alt={`${t.company} logo`} className="h-6 opacity-70" />}
                  </StackLayout>
                </Card>
              </div>
            ))}
          </ScrollView>
        </section>

        {/* Contact */}
        <section id="contact" className="py-16 border-t">
          <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
          <p className="text-gray-600 mb-8">Have a project in mind? Let's talk.</p>
          <GridLayout cols={[{ width: '100%' }, { width: '100%' }]} gap={{ rows: 24, cols: 24 }}>
            <Card className="p-6 shadow-sm">
              <Form
                onSubmit={submitContact}
                initialValues={{ name: 'Jane Client', email: 'client@example.com', subject: '', message: '', consent: false }}
                render={(formRenderProps: FormRenderProps) => (
                  <FormElement>
                    <StackLayout orientation="vertical" gap={12}>
                      <Field name="name" id="name" label="Name" component={ContactTextField} validator={required} />
                      <Field name="email" id="email" label="Email" component={ContactTextField} validator={(v)=> required(v) || emailValidator(v)} />
                      <Field name="subject" id="subject" label="Subject" component={ContactTextField} />
                      <Field name="message" id="message" label="Message" component={ContactTextArea} validator={(v)=> required(v) || min20(v)} />
                      <Field
                        name="consent"
                        component={() => null}
                        render={(fieldProps: FieldRenderProps) => (
                          <Checkbox checked={fieldProps.value} onChange={(e)=> fieldProps.onChange({ target: { value: e.value } })} label="I agree to the Privacy Policy" />
                        )}
                      />
                      <div className="pt-2">
                        <Button themeColor="primary" type="submit" disabled={!formRenderProps.allowSubmit}>Send Message</Button>
                      </div>
                    </StackLayout>
                  </FormElement>
                )}
              />
            </Card>
            <aside>
              <PanelBar expandMode="multiple" className="rounded-lg overflow-hidden shadow-sm">
                <PanelBarItem title="Email"><div className="p-4">{contactDetails.email}</div></PanelBarItem>
                <PanelBarItem title="Phone"><div className="p-4">{contactDetails.phone}</div></PanelBarItem>
                <PanelBarItem title="Location"><div className="p-4">{contactDetails.location}</div></PanelBarItem>
                <PanelBarItem title="Office Hours"><div className="p-4">{contactDetails.officeHours}</div></PanelBarItem>
              </PanelBar>
            </aside>
          </GridLayout>

          <NotificationGroup style={{ right: 20, bottom: 20 }}>
            {notify.visible && (
              <Notification type={{ style: notify.type, icon: true }} closable={true} onClose={()=>setNotify({ ...notify, visible:false })}>
                <span>{notify.type === 'success' ? contact.successMessage : contact.errorMessage}</span>
              </Notification>
            )}
          </NotificationGroup>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <GridLayout cols={[{ width: '100%' }, { width: '100%' }]} gap={{ rows: 16, cols: 16 }}>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <StackLayout orientation="vertical" gap={6}>
                {footerLinks.map((l) => (
                  <a key={l.label} href={l.href} onClick={(e)=>{e.preventDefault();document.querySelector(l.href)?.scrollIntoView({behavior:'smooth'});}} className="text-gray-700 hover:text-gray-900">{l.label}</a>
                ))}
              </StackLayout>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Follow</h4>
              <StackLayout gap={8}>
                {socialLinks.map((s) => (
                  <a key={s.platform} href={s.url} aria-label={s.platform} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                    <span className={`k-icon ${s.icon}`} />
                  </a>
                ))}
              </StackLayout>
            </div>
          </GridLayout>
          <hr className="my-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-600">
            <p>© 2025 Jane Doe. All rights reserved.</p>
            <StackLayout gap={12}>
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
            </StackLayout>
          </div>
        </div>
      </footer>
    </div>
  );
}
    
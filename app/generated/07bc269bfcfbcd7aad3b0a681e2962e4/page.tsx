
    'use client'; 


    import React from 'react';
import { AppBar, AppBarSection, AppBarSpacer, Drawer, DrawerContent, PanelBar, PanelBarItem, TabStrip, TabStripTab, StackLayout, Card, CardHeader, CardTitle, CardBody, CardActions } from '@progress/kendo-react-layout';
import { Button, Chip } from '@progress/kendo-react-buttons';
import { Avatar } from '@progress/kendo-react-layout';
import { Menu } from '@progress/kendo-react-layout';
import { SVGIcon } from '@progress/kendo-react-common';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { Badge } from '@progress/kendo-react-indicators';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Dialog } from '@progress/kendo-react-dialogs';
import { ScrollView } from '@progress/kendo-react-scrollview';
import { Rating } from '@progress/kendo-react-inputs';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Form, Field, FormElement, FieldWrapper, FormRenderProps } from '@progress/kendo-react-form';
import { Label, Error } from '@progress/kendo-react-labels';
import { TextBox, TextArea, Checkbox } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Loader } from '@progress/kendo-react-indicators';
import { Pager } from '@progress/kendo-react-data-tools';
import { menuIcon } from '@progress/kendo-svg-icons';

    export default function PortfolioLanding() {
  // Mock data
  const siteName = 'Alex Porter';
  const logoUrl = 'https://dummyimage.com/80x32/111/fff&text=A';
  const navigationItems = [
    { label: 'Home', href: '#home' },
    { label: 'Skills', href: '#skills' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' }
  ];
  const primaryCTA = { label: 'Contact', href: '#contact' };
  const user = {
    name: 'Alex Porter',
    role: 'Product Designer',
    intro: 'I design and build delightful, accessible digital products with a focus on outcomes.',
    headshotUrl: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&q=80',
    resumeUrl: 'https://example.com/alex-porter-resume.pdf'
  };
  const socialLinks = [
    { platform: 'GitHub', url: 'https://github.com/alexportfolio' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/alexportfolio' },
    { platform: 'Twitter', url: 'https://twitter.com/alexportfolio' }
  ];
  const skills = [
    { label: 'UX Research', level: 90 },
    { label: 'UI Design', level: 88 },
    { label: 'Prototyping', level: 82 },
    { label: 'Frontend (React)', level: 75 },
    { label: 'Design Systems', level: 86 },
    { label: 'Accessibility', level: 80 }
  ];
  const categories = ['All', 'Web', 'Mobile', 'Brand'];
  const projects = [
    {
      id: 1,
      title: 'E‑commerce Redesign',
      tags: ['Web', 'UX', 'UI'],
      category: 'Web',
      thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&q=80',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1502882705085-cb9f4fe88f89?w=1400&q=80', caption: 'Homepage concept' }
      ]
    },
    {
      id: 2,
      title: 'Banking App',
      tags: ['Mobile', 'Design'],
      category: 'Mobile',
      thumbnailUrl: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=1000&q=80',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80', caption: 'Accounts screen' }
      ]
    },
    {
      id: 3,
      title: 'Brand System',
      tags: ['Brand'],
      category: 'Brand',
      thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&q=80',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=1400&q=80', caption: 'Logo grid' }
      ]
    }
  ];
  const testimonials = [
    {
      quote: 'Alex delivered beyond expectations. Our metrics improved across the board.',
      clientName: 'Jamie Lee',
      clientTitle: 'VP Product',
      company: 'Nimbus',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
      rating: 5
    },
    {
      quote: 'A consummate professional with a strong eye for detail and usability.',
      clientName: 'Priya Nair',
      clientTitle: 'Head of Design',
      company: 'Orbit',
      avatarUrl: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=80',
      rating: 5
    }
  ];
  const contactConfig = {
    recipientEmail: 'hello@alexportfolio.com',
    subjectOptions: ['General Inquiry', 'Project Proposal', 'Speaking / Workshop'],
    successMsg: 'Thanks! Your message was sent successfully.',
    failureMsg: 'Something went wrong. Please try again.'
  };
  const contactInfo = {
    email: 'hello@alexportfolio.com',
    phone: '+1 (555) 010-9900',
    location: 'San Francisco, CA',
    hours: 'Mon–Fri, 9am–6pm PT'
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [categoryIndex, setCategoryIndex] = React.useState(0);
  const [lightbox, setLightbox] = React.useState({ open: false, media: [], title: '' });
  const [toast, setToast] = React.useState({ open: false, style: 'success', text: '' });
  const filtered = projects.filter(p => categoryIndex === 0 || p.category === categories[categoryIndex]);

  const handleSmoothScroll = (href) => (e) => {
    e.preventDefault();
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onSubmitForm = async (data) => {
    try {
      await new Promise(r => setTimeout(r, 900));
      setToast({ open: true, style: 'success', text: contactConfig.successMsg });
    } catch {
      setToast({ open: true, style: 'error', text: contactConfig.failureMsg });
    }
  };

  return (
    <div id="home" className="min-h-screen bg-white text-gray-900 antialiased selection:bg-gray-900 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2" onClick={handleSmoothScroll('#home')}>
            <img src={logoUrl} alt={siteName} className="h-8 w-auto object-contain" />
            <span className="text-lg font-semibold tracking-tight">{siteName}</span>
          </a>

          <div className="hidden md:flex items-center gap-6" role="menubar" aria-label="Primary">
            {navigationItems.map((item) => (
              <a key={item.href} href={item.href} onClick={handleSmoothScroll(item.href)} className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button className="hidden md:inline-flex bg-gray-900 hover:bg-black text-white text-sm px-4 py-2 rounded-md shadow-sm transition-colors" onClick={handleSmoothScroll(primaryCTA.href)}>
              {primaryCTA.label}
            </Button>
            <Button className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-gray-100" svgIcon={menuIcon} aria-label="Open menu" onClick={() => setMobileOpen(true)} />
          </div>
        </nav>
        {/* Mobile Drawer */}
        <Drawer expanded={mobileOpen} mode="overlay" position="start" width={300} onOverlayClick={() => setMobileOpen(false)} className="md:hidden">
          <DrawerContent>
            <div className="p-4">
              {navigationItems.map((item) => (
                <a key={item.href} href={item.href} onClick={(e)=>{handleSmoothScroll(item.href)(e); setMobileOpen(false);}} className="block px-4 py-3 text-gray-800 hover:bg-gray-100 rounded">
                  {item.label}
                </a>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </header>

      <main className="relative">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col gap-5 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">{user.name} — {user.role}</h1>
              <p className="text-lg text-gray-600">{user.intro}</p>
              <div className="flex items-center gap-4 pt-2">
                <Button className="bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-md shadow transition" onClick={handleSmoothScroll('#portfolio')}>View Work</Button>
                <a className="border border-gray-300 hover:border-gray-400 text-gray-800 px-5 py-3 rounded-md transition" href={user.resumeUrl} target="_blank" rel="noreferrer">Download CV</a>
              </div>
              <div className="flex items-center gap-4">
                {socialLinks.map((s)=> (
                  <a key={s.platform} href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <span className="sr-only">{s.platform}</span>
                    <span aria-hidden className="h-5 w-5">●</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="justify-self-center md:justify-self-end w-64 h-64 sm:w-80 sm:h-80 rounded-2xl object-cover shadow-xl ring-1 ring-black/5 animate-fade-in overflow-hidden">
              <img src={user.headshotUrl} alt={`Portrait of ${user.name}`} className="w-full h-full rounded-2xl object-cover" />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <header className="mb-10">
              <h2 className="text-3xl font-bold">Skills</h2>
              <p className="text-gray-600">A selection of my core competencies</p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill)=> (
                <Card key={skill.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <Label className="block text-sm font-medium text-gray-800 mb-2">{skill.label}</Label>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <ProgressBar value={skill.level} animation={{ duration: 600 }} ariaLabel={`${skill.label} level ${skill.level}%`} progressStyle={{ backgroundColor: '#111827' }} className="!h-3 !bg-transparent" />
                  </div>
                  <span className="mt-3 inline-flex items-center px-2 py-1 rounded-full bg-gray-900 text-white text-xs">{skill.level}%</span>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section id="portfolio" className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <header className="mb-10 flex items-end justify-between gap-4">
              <h2 className="text-3xl font-bold">Portfolio</h2>
              <div className="hidden md:flex items-center gap-2">
                {categories.map((c, idx)=> (
                  <button key={c} onClick={()=>setCategoryIndex(idx)} className={`px-4 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-100 ${idx===categoryIndex? 'bg-gray-900 text-white':''}`}>{c}</button>
                ))}
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project)=> (
                <div key={project.id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
                  <img src={project.thumbnailUrl} alt={project.title} loading="lazy" className="w-full h-56 object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button className="bg-white/90 hover:bg-white text-gray-900 text-sm px-3 py-2 rounded-md" onClick={()=> setLightbox({ open:true, media: project.media, title: project.title })}>View</Button>
                    <a href="#" className="text-white underline underline-offset-2">Details</a>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{project.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.tags.map((tag)=> (
                        <Chip key={tag} className="px-2 py-0.5 text-xs bg-gray-100 rounded-full text-gray-700" text={tag} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {lightbox.open && (
              <Dialog title={lightbox.title} onClose={()=> setLightbox({ open:false, media:[], title:'' })} style={{ maxWidth: '64rem' }}>
                <div className="relative">
                  <ScrollView style={{ height: 420 }}>
                    {lightbox.media.map((m, i)=> (
                      <div key={i} className="relative">
                        {m.type==='image' && (
                          <img src={m.url} alt={m.caption} className="block w-full rounded-lg object-contain max-h-[420px] bg-black" />
                        )}
                        <div className="absolute bottom-2 left-2 right-2 text-sm text-white/90">{m.caption}</div>
                      </div>
                    ))}
                  </ScrollView>
                </div>
              </Dialog>
            )}
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <header className="mb-10 text-center">
              <h2 className="text-3xl font-bold">What Clients Say</h2>
            </header>
            <div className="relative">
              <ScrollView style={{ height: 320 }} contentStyle={{ padding: '0 1rem' }} tabIndex={0}>
                {testimonials.map((t, idx)=> (
                  <div key={idx} className="px-4">
                    <Card className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                      <p className="text-lg text-gray-800 italic">“{t.quote}”</p>
                      <div className="mt-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full ring-1 ring-gray-200 overflow-hidden">
                          <img src={t.avatarUrl} alt={t.clientName} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <strong className="block">{t.clientName}</strong>
                          <span className="text-sm text-gray-600">{t.clientTitle}, {t.company}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Rating value={t.rating} readonly={true} />
                      </div>
                    </Card>
                  </div>
                ))}
              </ScrollView>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100">Prev</Button>
                <Button className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100">Next</Button>
                <div className="flex items-center gap-2">
                  {testimonials.map((_, i)=> (
                    <button key={i} className={`h-2.5 w-2.5 rounded-full ${i===0? 'bg-gray-900':'bg-gray-300'}`} aria-label={`Go to slide ${i+1}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm">
              <Form onSubmit={onSubmitForm} render={(formProps: FormRenderProps) => (
                <FormElement>
                  <div className="grid grid-cols-1 gap-6">
                    <FieldWrapper>
                      <Label className="block text-sm font-medium mb-1">Name</Label>
                      <Field name="name" component={TextBox} placeholder="Your full name" />
                      <Error>{formProps.errors?.name}</Error>
                    </FieldWrapper>
                    <FieldWrapper>
                      <Label className="block text-sm font-medium mb-1">Email</Label>
                      <Field name="email" type="email" component={TextBox} placeholder="you@example.com" />
                      <Error>{formProps.errors?.email}</Error>
                    </FieldWrapper>
                    <FieldWrapper>
                      <Label className="block text-sm font-medium mb-1">Subject</Label>
                      <Field name="subject" component={DropDownList} data={contactConfig.subjectOptions} defaultValue="Select a subject" />
                    </FieldWrapper>
                    <FieldWrapper>
                      <Label className="block text-sm font-medium mb-1">Message</Label>
                      <Field name="message" component={TextArea} rows={5} placeholder="How can I help?" />
                    </FieldWrapper>
                    <div className="inline-flex items-center gap-2">
                      <Field name="consent" type="checkbox" component={Checkbox} />
                      <span>I consent to having this website store my submitted information.</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <Button type="submit" className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-md disabled:opacity-60" disabled={!formProps.allowSubmit}>Send Message</Button>
                    {formProps.submitting && <Loader type="infinite-spinner" />}
                  </div>
                </FormElement>
              )}/>
            </div>
            <aside className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Get in touch</h3>
                <ul className="space-y-2">
                  <li>
                    <a href={`mailto:${contactInfo.email}`} className="text-gray-700 hover:text-gray-900 underline">{contactInfo.email}</a>
                  </li>
                  <li>
                    <a href={`tel:${contactInfo.phone}`} className="text-gray-700 hover:text-gray-900 underline">{contactInfo.phone}</a>
                  </li>
                  <li>
                    <p className="text-gray-600">{contactInfo.location}</p>
                  </li>
                </ul>
              </div>
              <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-100"></div>
            </aside>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            <section>
              <div className="flex items-center gap-2 mb-3">
                <img src={logoUrl} alt={siteName} className="h-6 w-6" />
                <span className="font-semibold">{siteName}</span>
              </div>
              <p className="text-gray-300">Designer & developer crafting delightful digital products.</p>
            </section>
            <section>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2">
                {navigationItems.map((l)=> (
                  <li key={l.href}><a href={l.href} onClick={handleSmoothScroll(l.href)} className="text-gray-300 hover:text-white">{l.label}</a></li>
                ))}
              </ul>
            </section>
            <section>
              <h4 className="font-semibold mb-3">Follow</h4>
              <div className="flex items-center gap-3">
                {socialLinks.map((s)=> (
                  <a key={s.platform} href={s.url} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center" aria-label={s.platform}>
                    <span aria-hidden className="h-5 w-5">●</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
          <div className="border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} {siteName}</p>
              <Button className="bg-white text-gray-900 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100" onClick={handleSmoothScroll('#home')}>Back to top</Button>
            </div>
          </div>
        </footer>
      </main>

      {/* Toasts */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="pointer-events-auto fixed top-4 right-4 space-y-2">
          <NotificationGroup>
            {toast.open && (
              <Notification type={{ style: toast.style, icon: true }} closable onClose={()=> setToast({ ...toast, open:false })}>
                <span>{toast.text}</span>
              </Notification>
            )}
          </NotificationGroup>
        </div>
      </div>
    </div>
  );
}

    
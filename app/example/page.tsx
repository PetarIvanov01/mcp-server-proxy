'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
  Drawer,
  DrawerContent,
  Menu,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Breadcrumb,
  TabStrip,
  TabStripTab,
  StackLayout,
  BottomNavigation,
  ExpansionPanel
} from '@progress/kendo-react-layout';
import { Button, Chip } from '@progress/kendo-react-buttons';
import { Badge, Loader, Skeleton } from '@progress/kendo-react-indicators';
import { DropDownList, AutoComplete } from '@progress/kendo-react-dropdowns';
import {
  Input,
  TextBox,
  TextArea,
  Checkbox,
  RadioGroup,
  RadioButton,
  Switch,
  Rating
} from '@progress/kendo-react-inputs';
import { Label, Error } from '@progress/kendo-react-labels';
import { ListView } from '@progress/kendo-react-listview';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Pager } from '@progress/kendo-react-data-tools';
import { Notification } from '@progress/kendo-react-notification';
import { Dialog } from '@progress/kendo-react-dialogs';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { ScrollView } from '@progress/kendo-react-scrollview';
import { ArcGauge } from '@progress/kendo-react-gauges';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { SvgIcon } from '@progress/kendo-react-common';
import {
  searchIcon,
  menuIcon,
  userIcon,
  cartIcon,
  playIcon
} from '@progress/kendo-svg-icons';

export default function GuitarLandingPage() {
  // Global state
  const [currency, setCurrency] = useState('USD');
  const [locale, setLocale] = useState('EN');
  const [cartCount, setCartCount] = useState(0);
  const [compareSelectedIds, setCompareSelectedIds] = useState([]); // string[] ids
  const [promoVisible, setPromoVisible] = useState(true);
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [productPage, setProductPage] = useState({ skip: 0, take: 8 });
  const [searchTerm, setSearchTerm] = useState('');

  // Audio/Sound demo state
  const [styleFilter, setStyleFilter] = useState('All');
  const [pickupPosition, setPickupPosition] = useState('Neck');
  const [isOverdrive, setIsOverdrive] = useState(false);
  const [riffFilter, setRiffFilter] = useState('All');
  const [bufferingClipId, setBufferingClipId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [audioToast, setAudioToast] = useState(false);

  // Audio modal
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [modalAudio, setModalAudio] = useState({
    productId: null,
    clipId: null,
    src: '',
    title: ''
  });
  const modalAudioRef = useRef(null);
  const [modalProgress, setModalProgress] = useState(0);

  // Newsletter toast
  const [newsletterToast, setNewsletterToast] = useState(false);

  // Contact toast
  const [contactToast, setContactToast] = useState(false);

  // Store locator
  const [storeQuery, setStoreQuery] = useState('');
  const [storesLoading, setStoresLoading] = useState(false);
  const [storesError, setStoresError] = useState('');

  // Mock Data
  const navItems = [
    { text: 'Shop', href: '#shop' },
    { text: 'Sound', href: '#sound' },
    { text: 'Features', href: '#features' },
    { text: 'Compare', href: '#compare' },
    { text: 'Reviews', href: '#reviews' },
    { text: 'FAQ', href: '#faq' },
    { text: 'Contact', href: '#contact' }
  ];

  const headerSuggestions = [
    'RS-6 Modern Electric',
    'AD-4 Acoustic',
    'Stage Starter Pack',
    'Acoustic Essentials'
  ];

  const products = [
    {
      id: 'rs6',
      name: 'RS-6 Modern Electric',
      series: 'Modern',
      image:
        'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1200&auto=format&fit=crop',
      price: 1299,
      promoPrice: 1199,
      rating: 4.8,
      reviewsCount: 324,
      badges: ['Best Seller'],
      finishes: ['Cherry', 'Sunburst', 'Matte Black'],
      specs: { scale: '25.5"', weight: '7.8 lb' },
      audioDemos: [
        {
          clipId: 'rock',
          title: 'Rock Riff',
          duration: 28,
          url: 'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav'
        }
      ],
      inventory: 'In Stock'
    },
    {
      id: 'ad4',
      name: 'AD-4 Acoustic',
      series: 'Acoustic',
      image:
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop',
      price: 899,
      rating: 4.6,
      reviewsCount: 189,
      badges: ['New'],
      finishes: ['Natural', 'Mahogany'],
      specs: { scale: '25.5"', weight: '4.5 lb' },
      audioDemos: [
        {
          clipId: 'fingerstyle',
          title: 'Fingerstyle',
          duration: 34,
          url: 'https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav'
        }
      ],
      inventory: 'In Stock'
    }
  ];

  const audioClips = [
    {
      clipId: 'rock',
      productId: 'rs6',
      title: 'RS-6 • Rock Riff',
      duration: 28,
      url: 'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav',
      style: 'Rock',
      pickup: 'Bridge',
      gain: 'Overdrive'
    },
    {
      clipId: 'fingerstyle',
      productId: 'ad4',
      title: 'AD-4 • Fingerstyle',
      duration: 34,
      url: 'https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav',
      style: 'Jazz',
      pickup: 'Neck',
      gain: 'Clean'
    }
  ];

  const styles = ['All', 'Blues', 'Rock', 'Jazz', 'Metal'];
  const riffs = ['All', 'Rock Riff', 'Fingerstyle'];

  const testimonials = [
    {
      quote: 'The RS-6 sings. It’s the best guitar I’ve owned.',
      author: 'Alex M., Touring Guitarist',
      rating: 5,
      avatar: 'https://i.pravatar.cc/100?img=12'
    },
    {
      quote: 'Playability is unreal. Setup was perfect out of the box.',
      author: 'Jamie L., Session Musician',
      rating: 5,
      avatar: 'https://i.pravatar.cc/100?img=36'
    }
  ];

  const pressLogos = [
    {
      src: 'https://dummyimage.com/140x50/000/fff&text=Guitar+Mag',
      alt: 'Guitar Mag'
    },
    {
      src: 'https://dummyimage.com/140x50/000/fff&text=Sound+Lab',
      alt: 'Sound Lab'
    },
    {
      src: 'https://dummyimage.com/140x50/000/fff&text=Studio+Pro',
      alt: 'Studio Pro'
    }
  ];

  const gallery = [
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=1200&auto=format&fit=crop',
      alt: 'Vintage Sunburst'
    },
    {
      type: 'video',
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      alt: 'Workshop Video'
    }
  ];

  const bundles = [
    {
      id: 'stage-pack',
      title: 'Stage Starter Pack',
      image:
        'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1200&auto=format&fit=crop',
      description: 'RS-6, hard case, leather strap, 3 sets of 10–46 strings.',
      price: 1399,
      savings: 120
    },
    {
      id: 'acoustic-essentials',
      title: 'Acoustic Essentials',
      image:
        'https://images.unsplash.com/photo-1506807803488-8eafc15316c3?q=80&w=1200&auto=format&fit=crop',
      description: 'AD-4, gig bag, humidifier, clip-on tuner.',
      price: 949,
      savings: 80
    }
  ];

  const faqItems = [
    {
      id: 'shipping',
      question: 'How long does shipping take?',
      answer:
        'Most orders ship in 1–2 business days and arrive within 3–5 days in the US.'
    },
    {
      id: 'setup',
      question: 'Do you set up the guitar before shipping?',
      answer:
        'Yes, each guitar is inspected, Plek-leveled, and set up for optimal playability.'
    },
    {
      id: 'warranty',
      question: 'What does the lifetime warranty cover?',
      answer:
        'Covers manufacturing defects in materials and workmanship under normal use.'
    },
    {
      id: 'returns',
      question: 'What is your return policy?',
      answer:
        '30-day no-questions-asked returns. Free return shipping in the continental US.',
      cta: true
    }
  ];

  const locatorStores = [
    {
      id: 'store-1',
      storeName: 'Guitar Haven - Downtown',
      address: '123 Melody Ave, Suite 5, Nashville, TN',
      hours: 'Open until 8pm',
      distance: '1.2 mi'
    }
  ];

  // Helpers
  const currencies = ['USD', 'EUR', 'GBP'];
  const locales = ['EN', 'ES', 'DE'];
  const formatPrice = (value) =>
    new Intl.NumberFormat(locale === 'EN' ? 'en-US' : 'en', {
      style: 'currency',
      currency
    }).format(value);
  const onCompareToggle = (productId, checked) => {
    setCompareSelectedIds((prev) => {
      const set = new Set(prev);
      if (checked) set.add(productId);
      else set.delete(productId);
      return Array.from(set);
    });
  };

  // Audio modal progress
  useEffect(() => {
    const el = modalAudioRef.current;
    if (!el) return;
    const onTime = () => {
      if (el.duration) setModalProgress((el.currentTime / el.duration) * 100);
    };
    el.addEventListener('timeupdate', onTime);
    return () => el.removeEventListener('timeupdate', onTime);
  }, [audioModalOpen]);

  const filteredClips = audioClips.filter(
    (c) =>
      (styleFilter === 'All' || c.style === styleFilter) &&
      (riffFilter === 'All' || c.title.includes(riffFilter)) &&
      (pickupPosition ? c.pickup === pickupPosition : true) &&
      (isOverdrive ? c.gain === 'Overdrive' : true)
  );

  const totalProducts = products.length;

  // Handlers
  const handleProductPageChange = (e) => {
    setProductPage({ skip: e.skip, take: e.take });
  };

  const openAudioModal = (clip) => {
    setModalAudio({
      productId: clip.productId,
      clipId: clip.clipId,
      src: clip.url,
      title: clip.title
    });
    setModalProgress(0);
    setAudioModalOpen(true);
  };

  const mobileNavItems = [
    { text: 'Shop', href: '#shop' },
    { text: 'Sound', href: '#sound' },
    { text: 'Features', href: '#features' },
    { text: 'Compare', href: '#compare' },
    { text: 'Reviews', href: '#reviews' },
    { text: 'FAQ', href: '#faq' },
    { text: 'Contact', href: '#contact' }
  ];

  const compareGridData = [
    { spec: 'Pickups', RS6: 'HH Alnico V', AD4: 'Piezo' },
    { spec: 'Price', RS6: formatPrice(1299), AD4: formatPrice(899) },
    { spec: 'Warranty', RS6: 'Lifetime', AD4: 'Lifetime' }
  ];

  // Anchor helper
  const scrollToAnchor = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div id="top" className="min-h-screen bg-white text-gray-900">
      {/* Promo Banner */}
      {promoVisible && (
        <div className="w-full bg-emerald-600 text-white text-center text-sm py-2 flex items-center justify-center gap-2">
          <span>Free Shipping on Orders Over $99</span>
          <Button
            size="small"
            themeColor="light"
            onClick={() => setPromoVisible(false)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Header AppBar */}
      <AppBar position="sticky" className="top-0 z-40 shadow bg-white">
        <AppBarSection>
          <a href="#top" aria-label="Home" className="flex items-center gap-2">
            <img
              src="https://dummyimage.com/40x40/000/fff&text=G"
              alt="Brand Logo"
              className="h-10 w-10"
            />
            <span className="font-semibold hidden sm:block">Guitars Co.</span>
          </a>
        </AppBarSection>
        <AppBarSection className="hidden lg:block">
          <Menu items={navItems.map((n) => ({ text: n.text, url: n.href }))} />
        </AppBarSection>
        <AppBarSpacer />
        <AppBarSection className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <SvgIcon icon={searchIcon} />
            <AutoComplete
              data={headerSuggestions}
              placeholder="Search guitars"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.value)}
              style={{ width: 220 }}
              aria-label="Search products"
            />
          </div>
          <Button fillMode={'flat'} onClick={() => alert('Open Account')}>
            {' '}
            <SvgIcon icon={userIcon} /> <span className="sr-only">Account</span>{' '}
          </Button>
          <div className="relative">
            <Button fillMode={'flat'} onClick={() => alert('Open Cart')}>
              <SvgIcon icon={cartIcon} />
              <span className="sr-only">Cart</span>
            </Button>
            {cartCount > 0 && (
              <Badge
                position="outside"
                align={{ horizontal: 'end', vertical: 'top' }}
                size="small"
              >
                {cartCount}
              </Badge>
            )}
          </div>
          <DropDownList
            data={currencies}
            value={currency}
            onChange={(e) => setCurrency(e.value)}
            style={{ width: 90 }}
          />
          <DropDownList
            data={locales}
            value={locale}
            onChange={(e) => setLocale(e.value)}
            style={{ width: 80 }}
          />
        </AppBarSection>
        <AppBarSection className="md:hidden">
          <Button
            aria-label="Open Menu"
            onClick={() => setDrawerExpanded(true)}
          >
            <SvgIcon icon={menuIcon} />
          </Button>
        </AppBarSection>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        expanded={drawerExpanded}
        position="start"
        mode="overlay"
        width={300}
        onOverlayClick={() => setDrawerExpanded(false)}
      >
        <DrawerContent>
          <div className="p-4 space-y-4">
            <nav className="space-y-2">
              {mobileNavItems.map((item) => (
                <Button
                  key={item.text}
                  fillMode="flat"
                  className="w-full justify-start"
                  onClick={() => {
                    setDrawerExpanded(false);
                    scrollToAnchor(item.href);
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </nav>
            <ExpansionPanel title="Electric Guitars">
              <div className="flex flex-col gap-2 p-2">
                <a
                  className="text-sm text-gray-700"
                  href="#shop"
                  onClick={() => setDrawerExpanded(false)}
                >
                  Solid Body
                </a>
                <a
                  className="text-sm text-gray-700"
                  href="#shop"
                  onClick={() => setDrawerExpanded(false)}
                >
                  Semi-Hollow
                </a>
              </div>
            </ExpansionPanel>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <Breadcrumb
          data={[
            { id: '1', text: 'Home' },
            { id: '2', text: 'Guitars' }
          ]}
          ariaLabel="Breadcrumb"
        />
      </div>

      <main className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-12"
          id="hero"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Find Your Signature Tone
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Handcrafted guitars engineered for stage and studio.
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-6">
              <li>Premium tonewoods & pro setup</li>
              <li>30-day free returns</li>
              <li>Lifetime warranty</li>
            </ul>
            <div className="flex gap-3">
              <Button
                themeColor="primary"
                onClick={() => scrollToAnchor('#shop')}
              >
                Shop Guitars
              </Button>
              <Button onClick={() => scrollToAnchor('#sound')}>
                Hear the Tone
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow">
              <video
                className="w-full h-auto"
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                poster="https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1200&auto=format&fit=crop"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Hero guitar demo video"
              />
            </div>
            <Button
              className="absolute bottom-4 left-4"
              themeColor="light"
              onClick={() => scrollToAnchor('#sound')}
            >
              <SvgIcon icon={playIcon} /> Play Demo
            </Button>
          </div>
          <div
            className="col-span-full flex flex-wrap gap-4 mt-2"
            aria-label="Trust badges"
          >
            <Badge themeColor="success" rounded="large">
              Lifetime Warranty
            </Badge>
            <Badge themeColor="info" rounded="large">
              Free Returns
            </Badge>
            <Badge themeColor="primary" rounded="large">
              Secure Checkout
            </Badge>
          </div>
        </section>

        {/* Product Highlights */}
        <section id="shop" className="py-10">
          <h2 className="text-3xl font-semibold mb-4">Top Picks</h2>
          <TabStrip
            selected={activeTab}
            onSelect={(e) => setActiveTab(e.selected)}
          >
            <TabStripTab title="Top Sellers">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .slice(productPage.skip, productPage.skip + productPage.take)
                  .map((p) => (
                    <Card key={p.id} className="shadow border rounded-md">
                      <CardHeader>
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                      </CardHeader>
                      <CardBody>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{p.name}</h3>
                          {p.badges?.[0] && (
                            <Badge themeColor="warning">{p.badges[0]}</Badge>
                          )}
                        </div>
                        <div className="mt-1 text-gray-600">{p.series}</div>
                        <div className="mt-2 flex items-baseline gap-2">
                          {p.promoPrice ? (
                            <>
                              <span className="text-xl font-bold">
                                {formatPrice(p.promoPrice)}
                              </span>
                              <span className="line-through text-gray-400">
                                {formatPrice(p.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold">
                              {formatPrice(p.price)}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Rating
                            value={p.rating}
                            max={5}
                            readonly
                            ariaLabelledBy={`rating-${p.id}`}
                          />
                          <span className="text-sm text-gray-500">
                            ({p.reviewsCount})
                          </span>
                        </div>
                        <div
                          className="mt-3 flex flex-wrap gap-2"
                          aria-label="Finish options"
                        >
                          {p.finishes.map((f) => (
                            <Chip key={f} text={f} />
                          ))}
                        </div>
                      </CardBody>
                      <CardFooter>
                        <div className="flex flex-wrap gap-2 items-center">
                          <Button onClick={() => alert('Navigate to details')}>
                            View Details
                          </Button>
                          {p.audioDemos?.[0] && (
                            <Button
                              fillMode="outline"
                              onClick={() =>
                                openAudioModal({
                                  ...p.audioDemos[0],
                                  productId: p.id,
                                  title: `${p.name} • ${p.audioDemos[0].title}`
                                })
                              }
                            >
                              Hear Demo
                            </Button>
                          )}
                          <Checkbox
                            label={`Add to Compare`}
                            checked={compareSelectedIds.includes(p.id)}
                            onChange={(e) => onCompareToggle(p.id, e.value)}
                          />
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Pager
                  skip={productPage.skip}
                  take={productPage.take}
                  total={totalProducts}
                  onPageChange={handleProductPageChange}
                  pageSizes={[4, 8, 12]}
                />
                <Button
                  fillMode="link"
                  onClick={() => alert('Navigate to catalog')}
                >
                  View All
                </Button>
              </div>
            </TabStripTab>
            <TabStripTab title="New Arrivals">
              <Skeleton shape="text" style={{ width: '50%', height: 24 }} />
              <Skeleton style={{ width: '100%', height: 200, marginTop: 16 }} />
            </TabStripTab>
            <TabStripTab title="Acoustic">
              <div className="text-gray-600">
                Explore our acoustic collection.
              </div>
            </TabStripTab>
            <TabStripTab title="Electric">
              <div className="text-gray-600">
                Explore our electric collection.
              </div>
            </TabStripTab>
          </TabStrip>
        </section>

        {/* Sound Demos */}
        <section id="sound" className="py-10">
          <h2 className="text-3xl font-semibold mb-4">Hear the Tone</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <DropDownList
              data={styles}
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.value)}
              style={{ width: 160 }}
            />
            <RadioGroup
              value={pickupPosition}
              onChange={(e) => setPickupPosition(e.value)}
              aria-label="Pickup position"
            >
              <RadioButton value="Neck" label="Neck" />
              <RadioButton value="Bridge" label="Bridge" />
            </RadioGroup>
            <div className="flex items-center gap-2">
              <span className="text-sm">Clean</span>
              <Switch
                checked={isOverdrive}
                onChange={(e) => setIsOverdrive(e.value)}
                aria-label="Clean / Overdrive"
              />
              <span className="text-sm">Overdrive</span>
            </div>
            <DropDownList
              data={riffs}
              value={riffFilter}
              onChange={(e) => setRiffFilter(e.value)}
              style={{ width: 160 }}
            />
          </div>

          <div className="mt-6">
            <ListView
              data={filteredClips}
              item={(props) => {
                const clip = props.dataItem;
                return (
                  <div
                    className="flex items-center gap-4 p-3 border-b"
                    role="group"
                    aria-label={`${clip.title}`}
                  >
                    <div className="min-w-48 font-medium">{clip.title}</div>
                    <Button
                      onClick={() => openAudioModal(clip)}
                      themeColor="primary"
                    >
                      <SvgIcon icon={playIcon} /> Play
                    </Button>
                    <span className="text-sm text-gray-500">{`0:${clip.duration}`}</span>
                  </div>
                );
              }}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button onClick={() => alert('Download spec sheets')}>
              Download Spec Sheet
            </Button>
            {bufferingClipId && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader type="infinite-spinner" /> Buffering audio...
              </div>
            )}
          </div>

          {audioToast && (
            <div className="fixed bottom-4 right-4">
              <Notification
                type={{ style: 'error', icon: true }}
                closable={true}
                onClose={() => setAudioToast(false)}
              >
                Audio failed to load. Please try again.
              </Notification>
            </div>
          )}
        </section>

        {/* Features & Craftsmanship */}
        <section id="features" className="py-10">
          <h2 className="text-3xl font-semibold mb-6">
            Built by Luthiers, Trusted by Artists
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow border">
              <CardBody>
                <h3 className="text-xl font-semibold mb-2">
                  Premium Tonewoods
                </h3>
                <p className="text-gray-600">
                  Carefully selected maple, mahogany, and rosewood deliver rich
                  harmonics.
                </p>
              </CardBody>
            </Card>
            <Card className="shadow border">
              <CardBody>
                <h3 className="text-xl font-semibold mb-2">
                  Pro Setup Included
                </h3>
                <p className="text-gray-600">
                  Plek-leveled frets and low action right out of the case.
                </p>
              </CardBody>
            </Card>
            <Card className="shadow border">
              <CardBody>
                <h3 className="text-xl font-semibold mb-2">
                  Hand-wound Pickups
                </h3>
                <p className="text-gray-600">
                  Articulate response from custom-voiced single-coils and
                  humbuckers.
                </p>
              </CardBody>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <img
              className="rounded-lg shadow"
              src="https://images.unsplash.com/photo-1512427691650-3c8a936aeda2?q=80&w=1200&auto=format&fit=crop"
              alt="Fretwork close-up"
            />
            <video
              className="rounded-lg shadow"
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              controls
              aria-label="Workshop timelapse video"
            />
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm">in</span>
              <Switch aria-label="Unit preference" />
              <span className="text-sm">mm</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[480px] w-full text-left border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 border">Spec</th>
                    <th className="p-2 border">Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border">Scale Length</td>
                    <td className="p-2 border">24.75"–25.5" (629–648mm)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">Weight</td>
                    <td className="p-2 border">6.8–9.0 lb (3.1–4.1 kg)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section id="compare" className="py-10">
          <h2 className="text-3xl font-semibold mb-4">Compare Models</h2>
          <div className="flex items-center gap-3 mb-4">
            {compareSelectedIds.slice(0, 3).map((id) => {
              const p = products.find((x) => x.id === id);
              if (!p) return null;
              return (
                <div key={id} className="flex items-center gap-2">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                  <span className="text-sm">{p.name}</span>
                </div>
              );
            })}
            {compareSelectedIds.length > 0 && (
              <Button onClick={() => setCompareSelectedIds([])}>
                Clear All
              </Button>
            )}
          </div>

          <div className="overflow-x-auto">
            <Grid
              data={compareGridData}
              style={{ minWidth: 600 }}
              selectable={{ enabled: true }}
            >
              <GridColumn field="spec" title="Spec" width="180px" />
              <GridColumn field="RS6" title="RS-6 Modern" />
              <GridColumn field="AD4" title="AD-4 Acoustic" />
            </Grid>
          </div>

          {compareSelectedIds.length < 2 && (
            <div className="mt-4 text-gray-600">
              Add two or more models to compare.
            </div>
          )}
        </section>

        {/* Testimonials & Social Proof */}
        <section id="reviews" className="py-10">
          <h2 className="text-3xl font-semibold mb-4">
            Trusted by Players Everywhere
          </h2>
          <ScrollView style={{ width: '100%', height: 220 }}>
            {testimonials.map((t, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4">
                <Avatar type="image">
                  <img src={t.avatar} alt={t.author} />
                </Avatar>
                <div>
                  <blockquote className="text-lg font-medium">
                    “{t.quote}”
                  </blockquote>
                  <div className="text-sm text-gray-600">— {t.author}</div>
                  <div className="mt-2">
                    <Rating value={t.rating} readonly />
                  </div>
                </div>
              </div>
            ))}
          </ScrollView>

          <div className="mt-6 flex items-center gap-6">
            <ArcGauge value={96} aria-label="Aggregate rating" />
            <div className="text-gray-700">4.8/5 from 1,234 reviews</div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6 items-center">
            {pressLogos.map((l, i) => (
              <img
                key={i}
                src={l.src}
                alt={l.alt}
                className="h-10 object-contain grayscale"
              />
            ))}
          </div>
        </section>

        {/* Gallery & Media */}
        <section className="py-10">
          <h2 className="text-3xl font-semibold mb-4">See the Finish</h2>
          <ScrollView style={{ width: '100%', height: 360 }}>
            {gallery.map((m, i) => (
              <div
                key={i}
                className="w-full h-full flex items-center justify-center bg-gray-50"
              >
                {m.type === 'image' ? (
                  <img
                    src={m.src}
                    alt={m.alt}
                    className="max-h-80 object-contain"
                  />
                ) : (
                  <video
                    src={m.src}
                    controls
                    className="max-h-80"
                    aria-label="Gallery video"
                  />
                )}
              </div>
            ))}
          </ScrollView>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Vintage Sunburst', 'Arctic White', 'Midnight Blue'].map((f) => (
              <Chip key={f} text={f} />
            ))}
          </div>
        </section>

        {/* Accessories / Bundles */}
        <section className="py-10">
          <h2 className="text-3xl font-semibold mb-4">Complete the Rig</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bundles.map((b) => (
              <Card key={b.id} className="shadow border">
                <CardHeader>
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardBody>
                  <h3 className="text-xl font-semibold">{b.title}</h3>
                  <p className="text-gray-600 mt-2">{b.description}</p>
                  <div className="mt-2 font-bold">
                    {formatPrice(b.price)}{' '}
                    <span className="text-sm font-normal text-emerald-600">
                      (Save {formatPrice(b.savings)})
                    </span>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button
                    themeColor="primary"
                    onClick={() => setCartCount((c) => c + 1)}
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-10">
          <h2 className="text-3xl font-semibold mb-4">FAQ</h2>
          <div className="space-y-3">
            {faqItems.map((f) => (
              <ExpansionPanel key={f.id} title={f.question}>
                <div className="p-2 text-gray-700">{f.answer}</div>
                {f.cta && (
                  <div className="p-2">
                    <Button onClick={() => scrollToAnchor('#contact')}>
                      Contact Support
                    </Button>
                  </div>
                )}
              </ExpansionPanel>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-10">
          <h2 className="text-3xl font-semibold mb-2">
            Join the Tone Community
          </h2>
          <p className="text-gray-600 mb-4">
            Get exclusive artist demos, setup tips, and early access to new
            models.
          </p>
          <div className="max-w-xl">
            <Form
              onSubmit={(values) => {
                if (
                  !values.email ||
                  !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)
                ) {
                  return;
                }
                setTimeout(() => setNewsletterToast(true), 300);
              }}
              render={(formRenderProps) => (
                <FormElement className="space-y-4">
                  <div>
                    <Label editorId="newsletter-email">Email</Label>
                    <Field
                      name="email"
                      id="newsletter-email"
                      component={Input}
                      placeholder="you@example.com"
                    />
                    {formRenderProps.touched?.email &&
                      formRenderProps.errors?.email && (
                        <Error>Please enter a valid email</Error>
                      )}
                  </div>
                  <div>
                    <Field
                      name="consent"
                      type="checkbox"
                      component={Checkbox}
                      label="I agree to receive emails"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      themeColor="primary"
                      disabled={formRenderProps.submitting}
                      type="submit"
                    >
                      Sign Up
                    </Button>
                    <a href="#" className="text-sm underline">
                      Privacy Policy
                    </a>
                  </div>
                </FormElement>
              )}
            />
          </div>
          {newsletterToast && (
            <div className="fixed bottom-4 right-4">
              <Notification
                type={{ style: 'success', icon: true }}
                closable
                onClose={() => setNewsletterToast(false)}
              >
                Thanks! Check your inbox to confirm.
              </Notification>
            </div>
          )}
        </section>

        {/* Store Locator / Contact */}
        <section id="contact" className="py-10">
          <h2 className="text-3xl font-semibold mb-4">
            Find a Store or Get in Touch
          </h2>

          {/* Store search */}
          <Form
            onSubmit={() => {
              setStoresLoading(true);
              setStoresError('');
              setTimeout(() => setStoresLoading(false), 800);
            }}
            render={(props) => (
              <FormElement className="flex flex-wrap items-end gap-3">
                <div className="min-w-[240px]">
                  <Label editorId="store-search">City or ZIP</Label>
                  <Field
                    name="query"
                    id="store-search"
                    component={TextBox}
                    value={storeQuery}
                    onChange={(e) => setStoreQuery(e.value)}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => alert('Request geolocation')}
                >
                  Use My Location
                </Button>
                <Button type="submit" themeColor="primary">
                  Search
                </Button>
              </FormElement>
            )}
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ListView
                data={locatorStores}
                item={(p) => {
                  const s = p.dataItem;
                  return (
                    <div className="p-3 border-b">
                      <div className="font-semibold">{s.storeName}</div>
                      <div className="text-sm text-gray-600">{s.address}</div>
                      <Badge themeColor="success" className="mt-2">
                        {s.hours}
                      </Badge>
                    </div>
                  );
                }}
              />
            </div>
            <div>
              <Card className="h-full">
                <CardBody>
                  <iframe
                    title="Map"
                    src="https://maps.google.com/maps?q=Nashville%20TN&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-64 rounded"
                  />
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Contact mini-form */}
          <div className="mt-8 max-w-xl">
            <Form
              onSubmit={(values) => {
                if (!values.name || !values.email) return;
                setTimeout(() => setContactToast(true), 400);
              }}
              render={(p) => (
                <FormElement className="space-y-4">
                  <div>
                    <Label editorId="c-name">Name</Label>
                    <Field id="c-name" name="name" component={Input} />
                  </div>
                  <div>
                    <Label editorId="c-email">Email</Label>
                    <Field id="c-email" name="email" component={Input} />
                  </div>
                  <div>
                    <Label>Topic</Label>
                    <DropDownList
                      data={['Setup', 'Warranty', 'Orders', 'Other']}
                      defaultValue={'Select Topic'}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <Label editorId="c-message">Message</Label>
                    <Field
                      id="c-message"
                      name="message"
                      component={TextArea}
                      rows={4}
                    />
                  </div>
                  <Button type="submit" themeColor="primary">
                    Send
                  </Button>
                </FormElement>
              )}
            />
            <div className="mt-4">
              <Button onClick={() => alert('Open booking flow')}>
                Book an In-Store Demo
              </Button>
            </div>
            {storesLoading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <Loader type="pulsing" /> Loading...
              </div>
            )}
            {storesError && (
              <Error>
                We couldn't complete your request. Please try again.
              </Error>
            )}
            {contactToast && (
              <div className="fixed bottom-4 right-4">
                <Notification
                  type={{ style: 'success', icon: true }}
                  closable
                  onClose={() => setContactToast(false)}
                >
                  Thanks! We’ll be in touch soon.
                </Notification>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Sticky Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow z-40">
        <div className="max-w-7xl mx-auto px-2">
          <BottomNavigation
            items={[
              { text: 'Shop', onClick: () => scrollToAnchor('#shop') },
              { text: 'Sound', onClick: () => scrollToAnchor('#sound') },
              { text: 'Compare', onClick: () => scrollToAnchor('#compare') },
              {
                text: `Compare (${compareSelectedIds.length})`,
                onClick: () => scrollToAnchor('#compare')
              },
              { text: 'Buy Now', onClick: () => alert('Buy Now') },
              { text: 'View Cart', onClick: () => alert('Open Cart') }
            ]}
          />
        </div>
      </div>

      {/* Audio Player Modal */}
      {audioModalOpen && (
        <Dialog
          title={modalAudio.title}
          onClose={() => setAudioModalOpen(false)}
        >
          <div className="space-y-3">
            <audio
              ref={modalAudioRef}
              src={modalAudio.src}
              controls
              autoPlay
              onError={() => {
                setAudioToast(true);
                setAudioModalOpen(false);
              }}
            />
            <ProgressBar value={modalProgress} />
            <div className="text-right">
              <Button onClick={() => setAudioModalOpen(false)}>Close</Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

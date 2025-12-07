'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo, LogoText } from '@/components/logo';
import { PromptBox } from '@/components/prompt-box';
import { QuickScanForm } from '@/components/quick-scan-form';
import { TestimonialsCarousel } from '@/components/testimonials-carousel';
import ClickSpark from '@/components/ClickSpark';
import Orb from '@/components/orb';
import Link from 'next/link';
import {
  Zap,
  BarChart3,
  Rocket,
  Workflow,
  Code2,
  CheckCircle2,
  Sparkles,
  Target,
  Users,
  AlertCircle,
  FileText,
  MessageSquare,
  Mail,
  Database,
  Video,
  ExternalLink,
  ChevronDown,
  Calendar
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
  isError?: boolean;
}

export default function Home() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const heroSectionRef = useRef<HTMLDivElement>(null);

  const handleMessage = (message: { role: 'user' | 'assistant'; message: string; timestamp: string; isError?: boolean }) => {
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      role: message.role,
      message: message.message,
      timestamp: message.timestamp,
      isError: message.isError,
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [chatMessages]);

  // Track mouse position for Orb hover effect (edge/ring only)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroSectionRef.current) return;

      const rect = heroSectionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      const size = Math.min(width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const uvX = ((x - centerX) / size) * 2.0;
      const uvY = ((y - centerY) / size) * 2.0;

      const distance = Math.sqrt(uvX * uvX + uvY * uvY);

      // Only trigger hover when cursor is on the ring/edge (between 0.5 and 0.85)
      // Inner radius 0.5, outer radius 0.85 defines the interactive ring
      if (distance >= 0.5 && distance <= 0.85) {
        // Handle hover state if needed
      } else {
        // Handle non-hover state if needed
      }
    };

    const handleMouseLeave = () => {
      // Handle mouse leave if needed
    };

    window.addEventListener('mousemove', handleMouseMove);
    heroSectionRef.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      heroSectionRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowStats(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: Rocket,
      title: 'Happy Sprint Machine',
      description: 'De bewezen methodologie om AI-gedreven innovaties snel en efficiënt te realiseren in sprints.',
    },
    {
      icon: Zap,
      title: 'n8n Automation',
      description: 'Krachtige workflow automation met n8n. Beheer en monitor al je automations vanuit één dashboard.',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Volg performance metrics en success rates met live statistieken en interactieve charts.',
    },
    {
      icon: Target,
      title: 'Sprint-gebaseerd',
      description: 'Werk in korte, gefocuste sprints om snel resultaat te boeken en continue te verbeteren.',
    },
    {
      icon: Workflow,
      title: 'Webhook Triggers',
      description: 'Trigger workflows on demand met support voor zowel GET als POST webhook methods.',
    },
    {
      icon: Code2,
      title: 'Modern Tech Stack',
      description: 'Gebouwd met Next.js 15, TypeScript, Shadcn UI en Tailwind CSS voor optimale performance.',
    },
  ];

  const useCases = [
    {
      icon: FileText,
      title: 'OCR & Document Extraction',
      description: 'Automatische data-extractie uit complexe, ongestructureerde documenten zoals contracten, facturen en juridische stukken. Van PDF naar gestructureerde database.',
      result: 'Dagvaarding verwerkt in 30 seconden → automatisch gegenereerde samenvatting + key points extractie',
      duration: '1-2 weken',
      tech: ['OCR', 'Langchain', 'OpenAI', 'n8n'],
    },
    {
      icon: MessageSquare,
      title: 'Conversational AI Chatbot',
      description: 'WhatsApp of webchat bot met gespreksgeheugen, context-awareness en intelligente lead qualification. Volledig geautomatiseerde customer journey.',
      result: '80% van leads gekwalificeerd zonder menselijke tussenkomst, 24/7 beschikbaar',
      duration: '2-3 weken',
      tech: ['Langchain Agent', 'OpenAI', 'Twilio', 'n8n'],
    },
    {
      icon: Mail,
      title: 'Email Triage & Automation',
      description: 'Automatische categorisatie, prioritering en afhandeling van inkomende emails. Intelligente routing naar de juiste persoon of afdeling.',
      result: 'Inbox zero in 1 uur i.p.v. 4 uur, belangrijke emails krijgen direct aandacht',
      duration: '1 week',
      tech: ['Gmail API', 'AI Classification', 'n8n'],
    },
    {
      icon: Target,
      title: 'Lead Qualification Pipeline',
      description: 'End-to-end lead scoring, data enrichment en automatische follow-up. State management zorgt dat geen enkele lead door de mazen glipt.',
      result: 'Leads gescoord en verrijkt binnen 2 minuten, 40% hogere conversie door timely follow-up',
      duration: '1-2 weken',
      tech: ['n8n', 'Google Sheets', 'OpenAI', 'CRM'],
    },
    {
      icon: Database,
      title: 'Data Pipeline & Sync',
      description: 'Real-time synchronisatie tussen je systemen. CRM, ERP, tools - alles altijd up-to-date zonder handmatige import/export.',
      result: 'Data sync elke 5 minuten, 0 handmatige invoer, 100% data consistency',
      duration: '1-2 weken',
      tech: ['REST API', 'Webhooks', 'n8n', 'Database'],
    },
    {
      icon: FileText,
      title: 'Document Generation',
      description: 'Automatische generatie van contracten, offertes, rapporten op basis van templates en data. Met optionele review-workflow.',
      result: '50 contracten gegenereerd in 10 minuten, consistente formatting, 0 typfouten',
      duration: '1-2 weken',
      tech: ['Google Docs', 'Templates', 'n8n', 'OpenAI'],
    },
    {
      icon: Video,
      title: 'Meeting Notes & Transcription',
      description: 'Automatische transcriptie, samenvatting en actie-items uit meetings. Gedeeld met team binnen 5 minuten na afloop.',
      result: 'Notulen klaar voordat meeting voorbij is, action items automatisch in task manager',
      duration: '1 week',
      tech: ['Whisper', 'OpenAI', 'Calendar', 'n8n'],
    },
    {
      icon: Zap,
      title: 'Proactive Reminders & Nudges',
      description: 'Intelligente herinneringen op het juiste moment. Bij no-response, abandoned flows of gemiste deadlines. Verhoogt conversie met 30%.',
      result: '30% meer conversies door timely nudges, automated follow-up op WhatsApp/email',
      duration: '1 week',
      tech: ['n8n', 'Scheduler', 'Twilio', 'Logic'],
    },
  ];

  const pricing = [
    {
      name: 'Starter Sprint',
      price: '€2.500',
      description: 'Voor eerste verkenning',
      features: [
        '1 Week Sprint',
        'Happy Sprint Machine methodologie',
        'Basis Dashboard Setup',
        '5 Workflows',
        'Email Support',
      ],
      cta: 'Start Sprint',
      highlighted: false,
    },
    {
      name: 'Growth Sprint',
      price: '€7.500',
      description: 'Voor schaalbare groei',
      features: [
        '4 Weken Sprint',
        'Volledige Happy Sprint Machine',
        'Advanced Analytics Dashboard',
        'Unlimited Workflows',
        'Priority Support',
        'Team Training',
        'Custom Integrations',
      ],
      cta: 'Start Sprint',
      highlighted: true,
    },
    {
      name: 'Enterprise Sprint',
      price: 'Op maat',
      description: 'Voor grote organisaties',
      features: [
        'Doorlopende Sprints',
        'Dedicated Sprint Team',
        'Enterprise Dashboard',
        'Unlimited Everything',
        '24/7 Support',
        'On-site Training',
        'Custom Development',
      ],
      cta: 'Contact Ons',
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: 'Wat is de Happy Sprint Machine methodologie?',
      answer: 'De Happy Sprint Machine is onze unieke aanpak voor AI-implementatie. We werken in korte, gefocuste sprints waarbij we snel prototypes bouwen, testen en itereren. Dit zorgt voor snelle resultaten, continue feedback en tevreden teams - vandaar "Happy"!',
    },
    {
      question: 'Hoe lang duurt een typische sprint?',
      answer: 'Een standaard sprint duurt 1-4 weken, afhankelijk van de complexiteit en scope. We starten altijd met een intake om de juiste sprint-lengte te bepalen en concrete doelen te stellen.',
    },
    {
      question: 'Wat is n8n en hoe past het in jullie aanpak?',
      answer: 'n8n is een krachtige open-source workflow automation tool. Wij gebruiken het als basis voor het dashboard, waarmee je al je automations kunt monitoren, beheren en triggeren. Het past perfect bij onze sprint-methodologie: snel bouwen, direct resultaat.',
    },
    {
      question: 'Kunnen jullie integreren met onze bestaande systemen?',
      answer: 'Absoluut! Een groot voordeel van n8n en onze aanpak is de flexibiliteit. We kunnen integreren met vrijwel elk systeem via APIs, webhooks of databases. In de sprint bekijken we samen wat nodig is.',
    },
    {
      question: 'Wat gebeurt er na een sprint?',
      answer: 'Na elke sprint evalueren we samen de resultaten. Je kunt kiezen om door te gaan met een nieuwe sprint voor verdere ontwikkeling, of het systeem zelfstandig te beheren. We bieden ook onderhoud en support aan.',
    },
    {
      question: 'Werken jullie ook op locatie?',
      answer: 'Ja, voor Enterprise Sprints komen we graag on-site voor kickoff meetings en training. Voor andere sprints werken we remote, met regelmatige check-ins via video calls.',
    },
  ];

  return (
    <ClickSpark
      sparkColor={theme === 'dark' ? '#ff6b35' : 'hsl(var(--primary))'}
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <div className="min-h-screen bg-background">
        {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-3">
            <Logo className="h-8" />
            <LogoText />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              Over Ons
            </Link>
            <a href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </a>
            <a href="https://calendar.app.google/hzFh9uHLzH8qaCYXA" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-colors hover:text-primary">
              Plan Gesprek
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroSectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0">
          {isMounted && theme === 'dark' && (
            <Orb hue={0} hoverIntensity={0.3} rotateOnHover={true} forceHoverState={false} />
          )}
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 gap-1">
              <Sparkles className="h-3 w-3" />
              Happy Sprint Machine
            </Badge>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-down">
              Stop met praten over AI.{' '}
              <span className="text-primary">
                Start met bouwen.
              </span>
            </h1>

            <div className="mx-auto max-w-2xl w-full">
              {chatMessages.length > 0 && (
                <div ref={chatContainerRef} className="rounded-lg p-4 max-h-80 overflow-y-auto space-y-3 mb-3 animate-fade-in">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 flex-shrink-0 ${
                          msg.role === 'user'
                            ? 'bg-black/70 dark:bg-white/10 text-white rounded-br-none'
                            : msg.isError
                            ? 'bg-red-500/20 dark:bg-red-500/10 text-red-900 dark:text-red-100 rounded-bl-none'
                            : 'bg-white/10 dark:bg-white/5 text-foreground rounded-bl-none'
                        }`}
                      >
                        {msg.isError && <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-xs font-semibold">Error</span>
                        </div>}
                        <p className="text-sm break-words leading-relaxed">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <PromptBox className="w-full" onMessage={handleMessage} />
            </div>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              We bouwen werkende AI-oplossingen in 1-4 weken. Geen maandenlange projecten, 
              geen vage beloftes. Concrete automation die direct waarde levert.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://calendar.app.google/hzFh9uHLzH8qaCYXA" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full sm:w-auto font-semibold">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Plan Gratis Kennismakingsgesprek
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="container mx-auto px-4 py-8 border-b">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center transition-all duration-700 ${
          showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div style={{ transitionDelay: '0ms' }}>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">12</div>
            <div className="text-sm text-muted-foreground">Sprints Voltooid</div>
          </div>
          <div style={{ transitionDelay: '100ms' }}>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">6+</div>
            <div className="text-sm text-muted-foreground">Tevreden Klanten</div>
          </div>
          <div style={{ transitionDelay: '200ms' }}>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">24+</div>
            <div className="text-sm text-muted-foreground">Workflows Live</div>
          </div>
          <div style={{ transitionDelay: '300ms' }}>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">95%</div>
            <div className="text-sm text-muted-foreground">Tevredenheid</div>
          </div>
        </div>
      </section>

      {/* What We Build Section - Projects */}
      <section className="border-y bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <Badge className="mb-4">De Methodologie</Badge>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                De Happy Sprint Machine®
              </h2>
              <p className="text-lg text-muted-foreground">
                Snelle resultaten, tevreden teams, en continue verbetering
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Sprint Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We starten met een duidelijk doel en concrete deliverables voor de sprint.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Snel Bouwen</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    In korte iteraties bouwen we prototypes en working solutions.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Happy Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Direct waarde, tevreden stakeholders, en concrete business impact.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4">Concrete Oplossingen</Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Wat we voor je bouwen
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Geen vage beloftes. Dit zijn de concrete automations die we opleveren, 
              met echte voorbeelden uit onze sprints.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {useCases.slice(0, showAllProjects ? useCases.length : 2).map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-lg hover:border-primary/50 transition-all group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {useCase.duration}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {useCase.description}
                    </p>
                    
                    <div className="bg-muted/50 rounded-lg p-3 border border-muted">
                      <p className="text-xs font-semibold text-primary mb-1.5">
                        💡 Voorbeeld resultaat:
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {useCase.result}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {useCase.tech.map((tech, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-normal">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {!showAllProjects && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAllProjects(true)}
                className="group"
              >
                Meer weergeven
                <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-y bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Happy Sprint Machine Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="mb-4">De Methodologie</Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              De Happy Sprint Machine®
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              De bewezen methode voor 100% voorspelbare software-projecten. Gebaseerd op korte sprints, 
              gedegen voorbereiding en uitstekend gedocumenteerde communicatie.
            </p>
            <a 
              href="https://dehappysprintmachine.nl/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline font-medium"
            >
              Lees meer over de methodologie
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="text-center border-2 hover:border-primary/50 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Sprint Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We starten met een duidelijk doel en concrete deliverables voor de sprint.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/50 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Snel Bouwen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  In korte iteraties bouwen we prototypes en working solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/50 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Happy Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Direct waarde, tevreden stakeholders, en concrete business impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why AI Sprint Studio Section */}
      <section className="border-y bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Waarom AI Sprint Studio
              </h2>
            </div>

            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                Bij AI Sprint Studio geloven we dat AI niet iets is wat je vervangt, maar iets wat je versterkt.
                We bestaan om bedrijven productiever, slimmer en menselijker te maken door AI voor hén te laten werken, niet andersom.
              </p>

              <p>
                Veel organisaties weten dat ze &quot;iets met AI&quot; moeten, maar missen richting. Wij helpen ze om die eerste stap te zetten, de juiste strategie te bepalen en daarna concreet resultaat te boeken.
                Altijd transparant, zonder jargon, en met focus op impact.
              </p>

              <p>
                Wij brengen structuur in de AI-chaos, zodat mensen en technologie samen sneller vooruitgaan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Start je AI Sprint
          </h2>
          <p className="text-lg text-muted-foreground">
            Kies de sprint die bij jouw ambities past
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {pricing.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col transition-all hover:shadow-xl hover:-translate-y-2 animate-fade-in-up ${
                plan.highlighted
                  ? 'border-primary shadow-lg shadow-primary/20 scale-105 animate-glow'
                  : ''
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== 'Op maat' && <span className="text-muted-foreground"> / sprint</span>}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <a href="https://calendar.app.google/hzFh9uHLzH8qaCYXA" target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button 
                    className="w-full" 
                    variant={plan.highlighted ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Veelgestelde Vragen
            </h2>
            <p className="text-lg text-muted-foreground">
              Alles wat je wilt weten over AI Sprint Studio
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Quick Scan CTA Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <QuickScanForm />
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Logo className="h-8" />
                <LogoText />
              </div>
              <p className="text-sm text-muted-foreground">
                AI-automation in snelle sprints met de Happy Sprint Machine methodologie.
              </p>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-semibold">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">Over Ons</Link></li>
                <li><Link href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://docs.n8n.io" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">n8n Documentatie</a></li>
                <li><Link href="/login" className="text-muted-foreground hover:text-foreground">Happy Sprint Machine</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">Ons Team</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-semibold">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:info@aisprintstudio.nl" className="text-muted-foreground hover:text-foreground">info@aisprintstudio.nl</a></li>
                <li><a href="https://calendar.app.google/hzFh9uHLzH8qaCYXA" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Plan een Gesprek</a></li>
                <li className="text-muted-foreground">Nederland</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 AI Sprint Studio. Gebouwd met de Happy Sprint Machine.
          </div>
        </div>
      </footer>

      {/* Floating Calendar Button */}
      <a
        href="https://calendar.app.google/hzFh9uHLzH8qaCYXA"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 h-14 px-6 gap-2 bg-primary/65 hover:bg-primary backdrop-blur-sm"
        >
          <Calendar className="h-5 w-5" />
          <span className="hidden sm:inline font-semibold">Plan Gesprek</span>
        </Button>
      </a>
      </div>
    </ClickSpark>
  );
}

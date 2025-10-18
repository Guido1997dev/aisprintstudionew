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
import Orb from '@/components/orb';
import Link from 'next/link';
import {
  Zap,
  BarChart3,
  Rocket,
  Workflow,
  Code2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  Users,
  AlertCircle
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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

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

  const features = [
    {
      icon: Rocket,
      title: 'Happy Sprint Machine',
      description: 'Onze bewezen methodologie om AI-gedreven innovaties snel en efficiënt te realiseren in sprints.',
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0">
          {theme === 'dark' && (
            <Orb hue={0} hoverIntensity={0.3} rotateOnHover={true} forceHoverState={false} />
          )}
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 gap-1">
              <Sparkles className="h-3 w-3" />
              Happy Sprint Machine
            </Badge>

            <h1 className="mb-12 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-down">
              Bouw en schaal je business met{' '}
              <span className="text-primary">
                AI-automation
              </span>{' '}
              in snelle sprints.
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

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground mt-12">
              Met de Happy Sprint Machine methodologie realiseren we AI-gedreven automations in korte, effectieve sprints.
              Monitor, beheer en optimaliseer al je workflows vanuit één krachtig dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto font-semibold">
                  <Rocket className="mr-2 h-4 w-4" />
                  Start Je Sprint
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto group">
                  Leer Meer Over Ons
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Happy Sprint Machine Section */}
      <section className="border-y bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <Badge className="mb-4">Onze Methodologie</Badge>
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

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Alles wat je nodig hebt voor succesvolle AI-automation
          </h2>
          <p className="text-lg text-muted-foreground">
            Van concept tot productie in één geïntegreerd platform
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 transition-all hover:border-primary/50 hover:shadow-lg hover:scale-105 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-transform group-hover:scale-110 animate-float" style={{ animationDelay: `${index * 200}ms` }}>
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Why AI Sprint Studio Section */}
      <section className="border-y bg-muted/50 py-20 md:py-32">
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
                Veel organisaties weten dat ze "iets met AI" moeten, maar missen richting. Wij helpen ze om die eerste stap te zetten, de juiste strategie te bepalen en daarna concreet resultaat te boeken.
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
      <section id="pricing" className="container mx-auto px-4 py-20 md:py-32">
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
                <Button 
                  className="w-full" 
                  variant={plan.highlighted ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
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

      {/* CTA Section */}
      <section className="border-y bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Klaar voor jouw AI Sprint?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Start vandaag nog met de Happy Sprint Machine en zie resultaten binnen weken, niet maanden.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="font-semibold w-full sm:w-auto">
                  <Rocket className="mr-2 h-4 w-4" />
                  Start Je Sprint Nu
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Users className="mr-2 h-4 w-4" />
                  Ontmoet Het Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
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
                <li className="text-muted-foreground">Nederland</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 AI Sprint Studio. Gebouwd met de Happy Sprint Machine.
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function PortfolioPage() {
  const projects = [
    {
      title: 'n8n Automation Platform',
      description: 'Enterprise-grade workflow automation platform enabling businesses to connect their tools and automate complex processes.',
      tags: ['Automation', 'Integration', 'Workflows'],
      metrics: {
        workflows: '50+',
        executions: '10k+',
        uptime: '99.9%'
      }
    },
    {
      title: 'Client Dashboard',
      description: 'Real-time monitoring and control dashboard for automation workflows with analytics and trigger capabilities.',
      tags: ['Dashboard', 'Analytics', 'Real-time'],
      metrics: {
        users: '100+',
        automations: '200+',
        integrations: '30+'
      }
    },
    {
      title: 'AI-Powered Automation',
      description: 'Intelligent automation solutions leveraging AI to enhance decision-making and process optimization.',
      tags: ['AI', 'Machine Learning', 'Optimization'],
      metrics: {
        accuracy: '95%',
        time_saved: '1000h',
        efficiency: '+40%'
      }
    }
  ];

  const services = [
    {
      name: 'Workflow Automation',
      description: 'Design and implement custom automation workflows tailored to your business needs.'
    },
    {
      name: 'System Integration',
      description: 'Connect disparate systems and create seamless data flows across your organization.'
    },
    {
      name: 'Analytics & Monitoring',
      description: 'Track performance metrics and gain insights into your automation effectiveness.'
    },
    {
      name: 'AI Integration',
      description: 'Incorporate AI and machine learning into your automation workflows for smarter operations.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-950/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold">AI</span>
            <span className="text-xl font-bold text-primary">SPRINT</span>
            <span className="text-lg font-normal italic">studio</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/portfolio">
              <Button variant="ghost">Portfolio</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="default">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4" variant="secondary">
          Happy Sprint Machine
        </Badge>
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
          AI-Automation in Snelle Sprints
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Met de Happy Sprint Machine methodologie realiseren we AI-automations die echt waarde leveren. Snel, effectief en met tevreden teams.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="font-semibold">
              View Dashboard
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="font-semibold">
            Contact Us
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Workflows', value: '50+' },
            { label: 'Monthly Executions', value: '10k+' },
            { label: 'System Uptime', value: '99.9%' },
            { label: 'Happy Clients', value: '100+' }
          ].map((stat, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Featured Projects</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our latest automation solutions and see how we&apos;re helping businesses achieve more.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-3 gap-2 text-center">
                  {Object.entries(project.metrics).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-lg font-bold text-primary">{value}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {key.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Our Services</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive automation solutions designed to meet your unique business needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Ready to Automate?</CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Let&apos;s discuss how automation can transform your business operations.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="font-semibold">
                Get Started
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm dark:bg-slate-950/50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 AI Sprint Studio. Gebouwd met de Happy Sprint Machine.</p>
        </div>
      </footer>
    </div>
  );
}


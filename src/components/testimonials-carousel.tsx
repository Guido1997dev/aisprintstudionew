'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Enorme tijdsbesparing met de OCR automatisering. Van handmatig werk naar volledig geautomatiseerd. Guido denkt praktisch mee en levert snel.",
    name: "Jochem Croon",
    role: "Aviation Lawyer",
    company: "Croon Aviation Lawyers"
  },
  {
    quote: "Deskundig en betrokken. Guido vertaalde onze salesproces uitdagingen naar concrete, werkende oplossingen. Als iets niet werkte, werd het direct opgelost.",
    name: "Jelle Bruinsma",
    role: "Financieel Specialist",
    company: "Private Vastgoedfinanciering"
  },
  {
    quote: "Binnen 2 weken een werkende chatbot die 70% van onze vragen afhandelt. Geen technische praatjes, gewoon resultaat.",
    name: "Lisa van Dam",
    role: "Operations Manager",
    company: "DataFlow Solutions"
  },
  {
    quote: "De automatisering van ons email triage bespaart ons team 15 uur per week. Precies wat we nodig hadden, snel opgeleverd.",
    name: "Mark Hendriksen",
    role: "CTO",
    company: "CloudBase"
  },
  {
    quote: "Eindelijk iemand die begrijpt wat we bedoelen. Van idee naar werkend systeem in één sprint. Aanrader.",
    name: "Sophie de Vries",
    role: "Product Lead",
    company: "InnovateLab"
  }
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative max-w-3xl mx-auto py-8">
      <div className="text-center px-4">
        {/* Quote - Smaller and more subtle */}
        <p className="text-base md:text-lg text-muted-foreground/90 italic mb-4 leading-relaxed">
          "{currentTestimonial.quote}"
        </p>

        {/* Author - Inline and compact */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="font-semibold text-foreground">{currentTestimonial.name}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{currentTestimonial.role}</span>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <span className="text-muted-foreground hidden sm:inline">{currentTestimonial.company}</span>
        </div>
      </div>

      {/* Navigation Arrows - Smaller and more subtle */}
      <button
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 border border-border/50 hover:bg-muted transition-colors flex items-center justify-center opacity-60 hover:opacity-100"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 border border-border/50 hover:bg-muted transition-colors flex items-center justify-center opacity-60 hover:opacity-100"
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots Indicator - Smaller */}
      <div className="flex justify-center gap-1.5 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(index);
            }}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-6 bg-primary' 
                : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}


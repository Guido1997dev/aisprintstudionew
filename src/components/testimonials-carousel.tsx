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
    <div className="relative max-w-4xl mx-auto">
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="pt-6 px-8 md:px-12">
          <div className="text-center">
            {/* Quote */}
            <p className="text-lg md:text-xl text-muted-foreground italic mb-6 leading-relaxed">
              "{currentTestimonial.quote}"
            </p>

            {/* Author */}
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="text-primary font-semibold text-lg">
                  {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <p className="font-semibold text-foreground">{currentTestimonial.name}</p>
              <p className="text-sm text-muted-foreground">
                {currentTestimonial.role}
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                {currentTestimonial.company}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-10 w-10 rounded-full bg-background border shadow-sm hover:bg-muted transition-colors flex items-center justify-center"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-10 w-10 rounded-full bg-background border shadow-sm hover:bg-muted transition-colors flex items-center justify-center"
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-8 bg-primary' 
                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}


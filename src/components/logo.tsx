export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center">
        {/* Network/Connection Icon */}
        <svg viewBox="0 0 100 100" className="h-full w-auto" fill="currentColor">
          <path d="M50,30 L40,45 L30,40 L25,50 L30,60 L40,55 L50,70 L60,55 L70,60 L75,50 L70,40 L60,45 L50,30 Z" />
          <circle cx="50" cy="30" r="4" />
          <circle cx="50" cy="70" r="4" />
          <circle cx="25" cy="50" r="4" />
          <circle cx="75" cy="50" r="4" />
          <circle cx="35" cy="38" r="3" />
          <circle cx="65" cy="38" r="3" />
          <circle cx="35" cy="62" r="3" />
          <circle cx="65" cy="62" r="3" />
        </svg>
      </div>
    </div>
  );
}

export function LogoText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-baseline gap-1 ${className}`}>
      <span className="text-xl font-bold text-foreground">AI</span>
      <span className="text-xl font-bold text-primary">SPRINT</span>
      <span className="text-lg font-normal text-foreground italic">studio</span>
    </div>
  );
}


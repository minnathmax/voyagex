export const VoyageXLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="vx-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#9333EA" />
      </linearGradient>
      <linearGradient id="vx-glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    
    {/* Outer orbit representing global reach */}
    <circle 
      cx="50" cy="50" r="42" 
      stroke="url(#vx-gradient)" 
      strokeWidth="6" 
      strokeDasharray="80 30" 
      strokeLinecap="round" 
      className="origin-center" 
      opacity="0.9" 
    />
    
    {/* Inner planet glow */}
    <circle cx="50" cy="50" r="28" fill="url(#vx-gradient)" opacity="0.15" />
    
    {/* The 'V' shape */}
    <path 
      d="M 35 38 L 50 62 L 65 38" 
      stroke="url(#vx-gradient)" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    
    {/* Flight path curve crossing the V */}
    <path 
      d="M 25 50 C 40 30, 60 30, 75 50" 
      stroke="url(#vx-glow)" 
      strokeWidth="5" 
      strokeLinecap="round" 
      fill="none" 
    />
    
    {/* Airplane shape at the end of the curve */}
    <path 
      d="M 75 50 L 84 41 L 70 47 Z" 
      fill="url(#vx-gradient)" 
    />
  </svg>
);

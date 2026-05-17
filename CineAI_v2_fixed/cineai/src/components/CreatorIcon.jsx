export default function CreatorIcon({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="creatorBg" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#2d1b4e"/>
          <stop offset="100%" stopColor="#0d0a14"/>
        </radialGradient>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd700" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#ff6b35" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="100" height="100" rx="18" fill="url(#creatorBg)"/>
      <rect width="100" height="100" rx="18" fill="none" stroke="#4a2878" strokeWidth="1"/>

      {/* Spotlight beams */}
      <path d="M50 15 L20 75 L30 75 Z" fill="rgba(255,215,0,0.06)"/>
      <path d="M50 15 L70 75 L80 75 Z" fill="rgba(255,107,53,0.06)"/>
      <path d="M50 15 L38 75 L62 75 Z" fill="rgba(255,215,0,0.08)"/>

      {/* Stage/platform */}
      <ellipse cx="50" cy="78" rx="38" ry="6" fill="#1a0f2e" stroke="#4a2878" strokeWidth="1"/>
      <rect x="14" y="74" width="72" height="4" rx="2" fill="#221540"/>

      {/* Film reel left */}
      <circle cx="20" cy="55" r="12" fill="#1a1a2e" stroke="#4a2878" strokeWidth="1.5"/>
      <circle cx="20" cy="55" r="8" fill="#111" stroke="#333" strokeWidth="1"/>
      <circle cx="20" cy="55" r="3" fill="#222"/>
      {[0, 60, 120, 180, 240, 300].map((d, i) => (
        <line key={i}
          x1={20 + 3 * Math.cos(d * Math.PI / 180)}
          y1={55 + 3 * Math.sin(d * Math.PI / 180)}
          x2={20 + 7 * Math.cos(d * Math.PI / 180)}
          y2={55 + 7 * Math.sin(d * Math.PI / 180)}
          stroke="#444" strokeWidth="1.2"
        />
      ))}

      {/* Film reel right */}
      <circle cx="80" cy="55" r="12" fill="#1a1a2e" stroke="#4a2878" strokeWidth="1.5"/>
      <circle cx="80" cy="55" r="8" fill="#111" stroke="#333" strokeWidth="1"/>
      <circle cx="80" cy="55" r="3" fill="#222"/>
      {[0, 60, 120, 180, 240, 300].map((d, i) => (
        <line key={i}
          x1={80 + 3 * Math.cos(d * Math.PI / 180)}
          y1={55 + 3 * Math.sin(d * Math.PI / 180)}
          x2={80 + 7 * Math.cos(d * Math.PI / 180)}
          y2={55 + 7 * Math.sin(d * Math.PI / 180)}
          stroke="#444" strokeWidth="1.2"
        />
      ))}

      {/* Center star (main) */}
      <circle cx="50" cy="30" r="16" fill="url(#starGlow)" opacity="0.6"/>
      <polygon
        points="50,12 53.5,22 64,22 55.5,28.5 58.5,39 50,33 41.5,39 44.5,28.5 36,22 46.5,22"
        fill="#FFD700" stroke="#FFA500" strokeWidth="0.5"
      />

      {/* Small stars around */}
      <polygon points="18,22 19.2,25.5 23,25.5 20,27.5 21.2,31 18,29 14.8,31 16,27.5 13,25.5 16.8,25.5"
        fill="#c084fc" opacity="0.8" transform="scale(0.65) translate(10, 8)"/>
      <polygon points="82,22 83.2,25.5 87,25.5 84,27.5 85.2,31 82,29 78.8,31 80,27.5 77,25.5 80.8,25.5"
        fill="#c084fc" opacity="0.8" transform="scale(0.65) translate(60, 8)"/>

      {/* Play button overlay on star */}
      <polygon points="46,26 46,34 56,30" fill="rgba(0,0,0,0.5)"/>

      {/* Sparkle dots */}
      <circle cx="30" cy="18" r="1.5" fill="#ffd700" opacity="0.7"/>
      <circle cx="70" cy="15" r="1"   fill="#c084fc" opacity="0.8"/>
      <circle cx="15" cy="35" r="1"   fill="#60a5fa" opacity="0.6"/>
      <circle cx="85" cy="38" r="1.5" fill="#ffd700" opacity="0.7"/>
      <circle cx="25" cy="12" r="1"   fill="#f472b6" opacity="0.7"/>
      <circle cx="75" cy="25" r="1"   fill="#34d399" opacity="0.6"/>

      {/* Film strip across bottom */}
      <rect x="14" y="68" width="72" height="8" rx="1" fill="#111" stroke="#333" strokeWidth="0.5"/>
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <rect key={i} x={16 + i * 8} y="69.5" width="5" height="5" rx="0.5" fill="#222" stroke="#333" strokeWidth="0.3"/>
      ))}

      {/* Label */}
      <text x="50" y="96" fontFamily="Georgia, serif" fontSize="9" fontWeight="bold" fill="#ffd700" textAnchor="middle" letterSpacing="1">
        CREATOR
      </text>
    </svg>
  );
}

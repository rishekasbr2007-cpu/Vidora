export default function CameraIcon({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="camBg" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#1a1a2e"/>
          <stop offset="100%" stopColor="#0a0a14"/>
        </radialGradient>
        <radialGradient id="lensGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4a8fff" stopOpacity="0.6"/>
          <stop offset="60%" stopColor="#1a3a7a" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx="18" fill="url(#camBg)"/>
      <rect width="100" height="100" rx="18" fill="none" stroke="#2a2a4a" strokeWidth="1"/>
      <rect x="10" y="32" width="70" height="44" rx="6" fill="#181828" stroke="#3a3a5a" strokeWidth="1.2"/>
      <rect x="28" y="22" width="30" height="14" rx="4" fill="#141420" stroke="#3a3a5a" strokeWidth="1"/>
      <circle cx="45" cy="54" r="17" fill="#0d0d1a" stroke="#3a3a5a" strokeWidth="1.5"/>
      <circle cx="45" cy="54" r="13" fill="#050510" stroke="#2a2a4a" strokeWidth="1"/>
      <circle cx="45" cy="54" r="9"  fill="url(#lensGlow)"/>
      <circle cx="45" cy="54" r="5"  fill="#0a1a3a" stroke="#2255aa" strokeWidth="0.8"/>
      <circle cx="42" cy="51" r="2"  fill="rgba(100,160,255,0.35)"/>
      <circle cx="44" cy="48" r="1"  fill="rgba(255,255,255,0.2)"/>
      <circle cx="78" cy="38" r="5" fill="#222238" stroke="#4a4a7a" strokeWidth="1"/>
      <circle cx="78" cy="38" r="3" fill="#e05a2b"/>
      <circle cx="76" cy="65" r="3" fill="#e05a2b" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="80" cy="52" r="5" fill="#1a1a2e" stroke="#3a3a5a" strokeWidth="1"/>
      <text x="50" y="95" fontFamily="monospace" fontSize="8" fontWeight="bold"
        fill="#4a8fff" textAnchor="middle" letterSpacing="1.5">C!neAI</text>
    </svg>
  );
}

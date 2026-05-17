export default function DeveloperIcon({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="devBg" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#0d1f0d"/>
          <stop offset="100%" stopColor="#080d08"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx="18" fill="url(#devBg)"/>
      <rect width="100" height="100" rx="18" fill="none" stroke="#1a3a1a" strokeWidth="1"/>
      {/* Monitor */}
      <rect x="12" y="18" width="76" height="52" rx="4" fill="#0a140a" stroke="#1e4a1e" strokeWidth="1.5"/>
      <rect x="16" y="22" width="68" height="44" rx="2" fill="#050f05"/>
      {/* Code lines */}
      <text x="20" y="36" fontFamily="monospace" fontSize="7" fill="#22c55e">{'<Vidora'}</text>
      <text x="24" y="45" fontFamily="monospace" fontSize="6" fill="#4ade80">{'version="2.0"'}</text>
      <text x="24" y="53" fontFamily="monospace" fontSize="6" fill="#86efac">{'ai={true}'}</text>
      <text x="20" y="62" fontFamily="monospace" fontSize="7" fill="#22c55e">{'/>'}</text>
      {/* Cursor blink */}
      <rect x="40" y="56" width="5" height="7" rx="1" fill="#22c55e">
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
      </rect>
      {/* Stand */}
      <rect x="42" y="70" width="16" height="6" rx="1" fill="#0f1f0f" stroke="#1e4a1e" strokeWidth="1"/>
      <rect x="34" y="76" width="32" height="4" rx="2" fill="#0f1f0f" stroke="#1e4a1e" strokeWidth="1"/>
      {/* Label */}
      <text x="50" y="95" fontFamily="monospace" fontSize="8" fontWeight="bold"
        fill="#22c55e" textAnchor="middle" letterSpacing="1">DEV</text>
    </svg>
  );
}

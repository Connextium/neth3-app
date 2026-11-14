'use client';

import {
  useState,
  useEffect,
  useRef,
  useId,
  type ReactNode,
  type CSSProperties,
  type FormEvent,
} from 'react';

// ─────────────────────────────────────────────────────────────
// Fonts, CDN Assets, Routes & Multi-Rail Data Constants
// ─────────────────────────────────────────────────────────────

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Gilda+Display&family=Give+You+Glory&family=Instrument+Serif&family=Inter+Tight:ital,wght@0,400;0,500;0,600;1,400&family=KoHo:wght@400&family=Onest:wght@500&family=Sorts+Mill+Goudy&display=swap';

const THREE_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

type PageRoute =
  | 'home'
  | 'about'
  | 'capabilities'
  | 'corridors'
  | 'case-studies'
  | 'process'
  | 'testimonials'
  | 'contact';

type PaymentArtVariant =
  | 'strip-payouts'
  | 'strip-checkout'
  | 'strip-stablecoin'
  | 'strip-multichain'
  | 'strip-fx'
  | 'strip-escrow'
  | 'deploy-fernlight'
  | 'deploy-northbeam'
  | 'deploy-kitewise'
  | 'deploy-tessera'
  | 'deploy-ordinal'
  | 'deploy-quillio';

type CorridorRegionVariant =
  | 'corridor-na-latam'
  | 'corridor-eu-apac'
  | 'corridor-global-clearing'
  | 'corridor-b2b-supply'
  | 'corridor-crypto-bridge'
  | 'corridor-marketplace';

const NAV_LINKS: { label: string; route: PageRoute; hash: string }[] = [
  { label: 'Overview', route: 'home', hash: '#home' },
  { label: 'About & Architecture', route: 'about', hash: '#/about' },
  { label: 'Capabilities & APIs', route: 'capabilities', hash: '#/capabilities' },
  { label: 'Global Corridors', route: 'corridors', hash: '#/corridors' },
  { label: 'Case Studies', route: 'case-studies', hash: '#/case-studies' },
  { label: 'Settlement Process', route: 'process', hash: '#/process' },
  { label: 'Testimonials & SLA', route: 'testimonials', hash: '#/testimonials' },
  { label: 'Contact & Sandbox', route: 'contact', hash: '#/contact' },
];

const STRIP_ITEMS: {
  art: PaymentArtVariant;
  alt: string;
  tag: string;
  accent: string;
}[] = [
  {
    art: 'strip-stablecoin',
    alt: 'Stablecoin Treasury',
    tag: 'w = (az+b)/(cz+d) · 1:1',
    accent: '#059669',
  },
  {
    art: 'strip-payouts',
    alt: 'Instant Cross-Border Payouts',
    tag: 'Ψ(x,t) = A·sech²(x-vt)',
    accent: '#e83f20',
  },
  {
    art: 'strip-multichain',
    alt: 'Multi-Chain Liquidity',
    tag: 'dx/dt = σ(y-x) · MESH',
    accent: '#7c3aed',
  },
  {
    art: 'strip-checkout',
    alt: 'Crypto Merchant Checkout',
    tag: 'xₙ₊₁ = r·xₙ(1-xₙ) → σ(t)',
    accent: '#0284c7',
  },
  {
    art: 'strip-fx',
    alt: '24/7 FX Routing',
    tag: 'ds² = gᵢⱼ dxⁱ dxʲ · 8 BPS',
    accent: '#d97706',
  },
  {
    art: 'strip-escrow',
    alt: 'Programmable Escrow',
    tag: '∑ cₙ·eⁱⁿʷᵗ → δ(t-τ)',
    accent: '#38bdf8',
  },
];

const AVATAR_PHOTOS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=640&q=80',
];

// ─────────────────────────────────────────────────────────────
// Multi-Chromatic Mathematical, Complexity Function & Skyline Art
// ─────────────────────────────────────────────────────────────

function AbstractPaymentArt({
  variant,
  compact = false,
  className = '',
}: {
  variant: PaymentArtVariant;
  compact?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');

  const paletteMap: Record<
    PaymentArtVariant,
    {
      bg1: string;
      bg2: string;
      bg3: string;
      bg4: string;
      ink: string;
      c1: string;
      c2: string;
      c3: string;
      c4: string;
      dark: boolean;
      formula: string;
    }
  > = {
    'strip-stablecoin': {
      bg1: '#fef6ea',
      bg2: '#daf5ea',
      bg3: '#dce9ff',
      bg4: '#fde4dc',
      ink: '#24303c',
      c1: '#059669',
      c2: '#d97706',
      c3: '#2563eb',
      c4: '#e83f20',
      dark: false,
      formula: 'w = (az+b)/(cz+d) · 1:1',
    },
    'strip-payouts': {
      bg1: '#e0f4fe',
      bg2: '#ffece3',
      bg3: '#ece3ff',
      bg4: '#dcf7ef',
      ink: '#1c334a',
      c1: '#e83f20',
      c2: '#0284c7',
      c3: '#0d9488',
      c4: '#f59e0b',
      dark: false,
      formula: 'Ψ(x,t) = A·sech²(x - vt)',
    },
    'strip-multichain': {
      bg1: '#efe6ff',
      bg2: '#fef3dc',
      bg3: '#dcf6f0',
      bg4: '#fde4ee',
      ink: '#2a1d4a',
      c1: '#7c3aed',
      c2: '#059669',
      c3: '#ea580c',
      c4: '#0284c7',
      dark: false,
      formula: 'dx/dt = σ(y - x) · MESH',
    },
    'strip-checkout': {
      bg1: '#e2f9f1',
      bg2: '#e4ecff',
      bg3: '#fee7f0',
      bg4: '#fef4dc',
      ink: '#153330',
      c1: '#0284c7',
      c2: '#e11d48',
      c3: '#059669',
      c4: '#d97706',
      dark: false,
      formula: 'xₙ₊₁ = r·xₙ(1-xₙ) → σ(t)',
    },
    'strip-fx': {
      bg1: '#fdebf1',
      bg2: '#e2eeff',
      bg3: '#fef5df',
      bg4: '#e1f7ef',
      ink: '#24223b',
      c1: '#e83f20',
      c2: '#2563eb',
      c3: '#d97706',
      c4: '#059669',
      dark: false,
      formula: 'ds² = gᵢⱼ dxⁱ dxʲ · 8 BPS',
    },
    'strip-escrow': {
      bg1: '#162342',
      bg2: '#311e4d',
      bg3: '#153d47',
      bg4: '#472136',
      ink: '#f8fafc',
      c1: '#38bdf8',
      c2: '#fb7185',
      c3: '#34d399',
      c4: '#fbbf24',
      dark: true,
      formula: '∑ cₙ·eⁱⁿʷᵗ → δ(t - τ)',
    },
    'deploy-fernlight': {
      bg1: '#fef6ea',
      bg2: '#daf5ea',
      bg3: '#dce9ff',
      bg4: '#fde4dc',
      ink: '#24303c',
      c1: '#059669',
      c2: '#d97706',
      c3: '#2563eb',
      c4: '#e83f20',
      dark: false,
      formula: '0.42s · ISO-20022',
    },
    'deploy-northbeam': {
      bg1: '#efe6ff',
      bg2: '#fef3dc',
      bg3: '#dcf6f0',
      bg4: '#fde4ee',
      ink: '#2a1d4a',
      c1: '#7c3aed',
      c2: '#059669',
      c3: '#ea580c',
      c4: '#0284c7',
      dark: false,
      formula: 'LORENZ · 24/7 PvP',
    },
    'deploy-kitewise': {
      bg1: '#e2f9f1',
      bg2: '#e4ecff',
      bg3: '#fee7f0',
      bg4: '#fef4dc',
      ink: '#153330',
      c1: '#0284c7',
      c2: '#e11d48',
      c3: '#059669',
      c4: '#d97706',
      dark: false,
      formula: 'FEIGENBAUM · 0% REV',
    },
    'deploy-tessera': {
      bg1: '#162342',
      bg2: '#311e4d',
      bg3: '#153d47',
      bg4: '#472136',
      ink: '#f8fafc',
      c1: '#38bdf8',
      c2: '#fb7185',
      c3: '#34d399',
      c4: '#fbbf24',
      dark: true,
      formula: '140+ RAILS · 1 API',
    },
    'deploy-ordinal': {
      bg1: '#fdebf1',
      bg2: '#e2eeff',
      bg3: '#fef5df',
      bg4: '#e1f7ef',
      ink: '#24223b',
      c1: '#e83f20',
      c2: '#2563eb',
      c3: '#d97706',
      c4: '#059669',
      dark: false,
      formula: 'GEODESIC · τ = 1.40s',
    },
    'deploy-quillio': {
      bg1: '#e0f4fe',
      bg2: '#ffece3',
      bg3: '#ece3ff',
      bg4: '#dcf7ef',
      ink: '#1c334a',
      c1: '#e83f20',
      c2: '#0284c7',
      c3: '#0d9488',
      c4: '#f59e0b',
      dark: false,
      formula: 'SOLITON · 1.1s LATAM',
    },
  };

  const pal = paletteMap[variant] ?? paletteMap['strip-stablecoin'];

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={`block size-full select-none ${className}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={pal.bg1} />
          <stop offset="35%" stopColor={pal.bg2} />
          <stop offset="70%" stopColor={pal.bg3} />
          <stop offset="100%" stopColor={pal.bg4} />
        </linearGradient>
        <radialGradient id={`orb1-${uid}`} cx="20%" cy="24%" r="56%">
          <stop
            offset="0%"
            stopColor={pal.c1}
            stopOpacity={pal.dark ? '0.38' : '0.28'}
          />
          <stop offset="100%" stopColor={pal.c1} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`orb2-${uid}`} cx="82%" cy="28%" r="54%">
          <stop
            offset="0%"
            stopColor={pal.c2}
            stopOpacity={pal.dark ? '0.34' : '0.25'}
          />
          <stop offset="100%" stopColor={pal.c2} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`orb3-${uid}`} cx="48%" cy="82%" r="58%">
          <stop
            offset="0%"
            stopColor={pal.c3}
            stopOpacity={pal.dark ? '0.32' : '0.24'}
          />
          <stop offset="100%" stopColor={pal.c3} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`orb4-${uid}`} cx="84%" cy="78%" r="48%">
          <stop
            offset="0%"
            stopColor={pal.c4}
            stopOpacity={pal.dark ? '0.3' : '0.22'}
          />
          <stop offset="100%" stopColor={pal.c4} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`veil-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            stopColor={pal.c1}
            stopOpacity={pal.dark ? '0.28' : '0.18'}
          />
          <stop
            offset="33%"
            stopColor={pal.c2}
            stopOpacity={pal.dark ? '0.24' : '0.16'}
          />
          <stop
            offset="66%"
            stopColor={pal.c3}
            stopOpacity={pal.dark ? '0.26' : '0.17'}
          />
          <stop
            offset="100%"
            stopColor={pal.c4}
            stopOpacity={pal.dark ? '0.28' : '0.18'}
          />
        </linearGradient>
        <linearGradient id={`tower-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            offset="0%"
            stopColor={pal.c3}
            stopOpacity={pal.dark ? '0.42' : '0.26'}
          />
          <stop
            offset="65%"
            stopColor={pal.c1}
            stopOpacity={pal.dark ? '0.22' : '0.12'}
          />
          <stop offset="100%" stopColor={pal.c2} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#bg-${uid})`} />
      <rect width="400" height="300" fill={`url(#orb1-${uid})`} />
      <rect width="400" height="300" fill={`url(#orb2-${uid})`} />
      <rect width="400" height="300" fill={`url(#orb3-${uid})`} />
      <rect width="400" height="300" fill={`url(#orb4-${uid})`} />

      {!compact && (
        <text
          x="382"
          y="22"
          textAnchor="end"
          fill={pal.ink}
          fillOpacity={pal.dark ? '0.56' : '0.48'}
          fontFamily="monospace"
          fontSize="8.5"
          letterSpacing="0.7"
        >
          {pal.formula}
        </text>
      )}

      {(variant === 'strip-stablecoin' || variant === 'deploy-fernlight') && (
        <g strokeLinecap="round">
          <polygon points="66,216 70,118 92,118 96,216" fill={`url(#tower-${uid})`} />
          <line x1="81" y1="82" x2="81" y2="118" stroke={pal.c3} strokeOpacity="0.45" strokeWidth="0.6" />
          <polygon points="104,216 104,142 128,132 128,216" fill={pal.c1} fillOpacity="0.14" />
          <polygon points="274,216 274,136 298,126 298,216" fill={pal.c2} fillOpacity="0.14" />
          <polygon points="306,216 310,112 332,112 336,216" fill={`url(#tower-${uid})`} />
          <line x1="321" y1="76" x2="321" y2="112" stroke={pal.c1} strokeOpacity="0.45" strokeWidth="0.6" />
          <path d="M 54 216 A 146 124 0 0 1 346 216 Z" fill={`url(#veil-${uid})`} />
          <path d="M 94 216 A 106 88 0 0 1 306 216" fill="none" stroke={pal.c1} strokeOpacity="0.45" strokeWidth="0.6" />
          <circle cx="200" cy="118" r="44" fill="none" stroke={pal.c2} strokeOpacity="0.58" strokeWidth="0.65" />
          <circle cx="176" cy="118" r="21" fill={pal.c1} fillOpacity="0.14" stroke={pal.c1} strokeOpacity="0.6" strokeWidth="0.55" />
          <circle cx="224" cy="118" r="21" fill={pal.c3} fillOpacity="0.14" stroke={pal.c3} strokeOpacity="0.6" strokeWidth="0.55" />
          <circle cx="200" cy="94" r="21" fill={pal.c4} fillOpacity="0.14" stroke={pal.c4} strokeOpacity="0.6" strokeWidth="0.55" />
          <path d="M 18 196 Q 64 174 110 196 T 200 196 T 290 196 T 382 196" fill="none" stroke={pal.c1} strokeOpacity="0.82" strokeWidth="0.8" />
          <path d="M 18 196 Q 64 218 110 196 T 200 196 T 290 196 T 382 196" fill="none" stroke={pal.c4} strokeOpacity="0.74" strokeWidth="0.7" strokeDasharray="2.5 3" />
          <circle cx="200" cy="118" r="2.8" fill={pal.c2} />
          <circle cx="81" cy="118" r="2.2" fill={pal.c3} />
          <circle cx="321" cy="112" r="2.2" fill={pal.c1} />
        </g>
      )}

      {(variant === 'strip-payouts' || variant === 'deploy-quillio') && (
        <g strokeLinecap="round">
          <polygon points="32,204 36,112 56,112 60,204" fill={`url(#tower-${uid})`} />
          <line x1="46" y1="74" x2="46" y2="112" stroke={pal.c2} strokeOpacity="0.55" strokeWidth="0.65" />
          <polygon points="66,204 66,136 88,128 88,204" fill={pal.c3} fillOpacity="0.16" />
          <polygon points="94,204 94,158 112,158 112,204" fill={pal.c2} fillOpacity="0.14" />
          <path d="M 278 204 L 292 124 L 306 204" fill="none" stroke={pal.c3} strokeOpacity="0.55" strokeWidth="0.85" />
          <polygon points="314,204 314,122 338,110 338,204" fill={`url(#tower-${uid})`} />
          <polygon points="344,204 348,134 368,134 372,204" fill={pal.c1} fillOpacity="0.16" />
          <path d="M 46 112 C 118 46, 212 42, 326 110 Q 194 138 46 112 Z" fill={`url(#veil-${uid})`} />
          <path d="M 46 112 C 118 46, 212 42, 326 110" fill="none" stroke={pal.c1} strokeOpacity="0.78" strokeWidth="0.8" />
          {[88, 122, 156, 190, 224, 258, 292].map((tx, idx) => (
            <line
              key={tx}
              x1={174 + idx * 4}
              y1={64 + idx * 1.4}
              x2={tx}
              y2="196"
              stroke={idx % 2 === 0 ? pal.c2 : pal.c3}
              strokeOpacity="0.32"
              strokeWidth="0.45"
            />
          ))}
          <path
            d="M 18 198 C 72 198, 102 192, 130 198 C 152 203, 168 154, 190 198 C 206 230, 222 142, 240 198 C 256 234, 274 166, 296 198 C 318 212, 344 196, 382 198"
            fill="none"
            stroke={pal.c4}
            strokeOpacity="0.88"
            strokeWidth="0.85"
          />
          <path
            d="M 18 202 C 88 202, 128 196, 166 202 C 194 206, 214 174, 238 202 C 260 222, 286 186, 318 202 C 344 208, 364 200, 382 202"
            fill="none"
            stroke={pal.c2}
            strokeOpacity="0.62"
            strokeWidth="0.6"
            strokeDasharray="2 3"
          />
          <circle cx="46" cy="112" r="2.6" fill={pal.c2} />
          <circle cx="186" cy="66" r="2.8" fill={pal.c1} />
          <circle cx="240" cy="198" r="3" fill={pal.c4} />
          <circle cx="326" cy="110" r="2.6" fill={pal.c3} />
        </g>
      )}

      {(variant === 'strip-multichain' || variant === 'deploy-northbeam') && (
        <g strokeLinecap="round">
          <polygon points="54,204 58,124 70,124 74,204" fill={`url(#tower-${uid})`} />
          <polygon points="80,204 84,124 96,124 100,204" fill={`url(#tower-${uid})`} />
          <polygon points="106,204 110,124 122,124 126,204" fill={`url(#tower-${uid})`} />
          <path d="M 46 118 Q 90 112 142 114 L 136 123 L 48 123 Z" fill={pal.c1} fillOpacity="0.22" />
          <path d="M 46 118 Q 90 112 142 114" fill="none" stroke={pal.c1} strokeOpacity="0.65" strokeWidth="0.7" />
          <polygon points="276,204 276,138 302,132 302,204" fill={pal.c4} fillOpacity="0.15" />
          <polygon points="318,204 328,104 333,104 343,204" fill={`url(#tower-${uid})`} />
          <line x1="330.5" y1="66" x2="330.5" y2="104" stroke={pal.c3} strokeOpacity="0.55" strokeWidth="0.7" />
          <ellipse cx="200" cy="154" rx="132" ry="28" fill="none" stroke={pal.c4} strokeOpacity="0.38" strokeWidth="0.55" />
          <ellipse cx="200" cy="128" rx="102" ry="22" fill="none" stroke={pal.c2} strokeOpacity="0.44" strokeWidth="0.55" />
          <path
            d="M 200 134 C 150 74, 68 90, 82 148 C 94 194, 166 182, 200 134 C 234 86, 306 74, 318 122 C 332 178, 248 192, 200 134 Z"
            fill="none"
            stroke={pal.c1}
            strokeOpacity="0.78"
            strokeWidth="0.8"
          />
          <path
            d="M 200 134 C 160 86, 92 98, 104 144 C 114 182, 174 172, 200 134 C 226 96, 286 86, 296 124 C 308 170, 238 182, 200 134 Z"
            fill="none"
            stroke={pal.c3}
            strokeOpacity="0.7"
            strokeWidth="0.65"
            strokeDasharray="3 2.5"
          />
          <circle cx="90" cy="116" r="2.8" fill={pal.c1} />
          <circle cx="200" cy="134" r="3" fill={pal.c2} />
          <circle cx="330.5" cy="104" r="2.8" fill={pal.c3} />
        </g>
      )}

      {(variant === 'strip-checkout' || variant === 'deploy-kitewise') && (
        <g strokeLinecap="round">
          <path d="M 52 204 C 48 164, 52 126, 66 116 C 80 126, 84 164, 80 204 Z" fill={`url(#tower-${uid})`} />
          <polygon points="92,204 92,134 118,148 118,204" fill={pal.c1} fillOpacity="0.14" />
          <polygon points="318,204 318,112 346,136 346,204" fill={`url(#tower-${uid})`} />
          <line x1="318" y1="112" x2="346" y2="164" stroke={pal.c3} strokeOpacity="0.4" strokeWidth="0.55" />
          <polygon points="354,204 354,126 376,126 376,204" fill={pal.c2} fillOpacity="0.14" />
          <path d="M 34 188 C 88 86, 182 44, 294 68 C 338 78, 366 110, 378 152 C 314 122, 236 132, 172 174 C 118 208, 66 204, 34 188 Z" fill={`url(#veil-${uid})`} />
          <path d="M 34 188 C 88 86, 182 44, 294 68 C 338 78, 366 110, 378 152" fill="none" stroke={pal.c1} strokeOpacity="0.68" strokeWidth="0.75" />
          <path d="M 28 78 C 84 78, 112 98, 150 116 C 192 136, 234 144, 286 144" fill="none" stroke={pal.c2} strokeOpacity="0.76" strokeWidth="0.75" />
          <path d="M 28 104 C 80 104, 110 110, 150 116" fill="none" stroke={pal.c4} strokeOpacity="0.72" strokeWidth="0.65" />
          <path d="M 28 196 C 88 196, 116 176, 154 164 C 196 150, 236 144, 286 144" fill="none" stroke={pal.c3} strokeOpacity="0.8" strokeWidth="0.75" />
          <path d="M 28 166 C 84 166, 114 164, 154 164" fill="none" stroke={pal.c1} strokeOpacity="0.72" strokeWidth="0.65" />
          <path d="M 28 138 C 116 138, 198 144, 380 144" fill="none" stroke={pal.c3} strokeOpacity="0.88" strokeWidth="0.85" />
          <circle cx="286" cy="144" r="26" fill="none" stroke={pal.c2} strokeOpacity="0.45" strokeWidth="0.55" strokeDasharray="2 3" />
          <circle cx="286" cy="144" r="14" fill={pal.c3} fillOpacity="0.18" stroke={pal.c3} strokeOpacity="0.68" strokeWidth="0.65" />
          <circle cx="150" cy="116" r="2.4" fill={pal.c2} />
          <circle cx="154" cy="164" r="2.4" fill={pal.c1} />
          <circle cx="286" cy="144" r="3.4" fill={pal.c4} />
        </g>
      )}

      {(variant === 'strip-fx' || variant === 'deploy-ordinal') && (
        <g strokeLinecap="round">
          <polygon points="44,204 62,84 80,204" fill={`url(#tower-${uid})`} />
          <polygon points="88,204 88,132 114,132 114,204" fill={pal.c2} fillOpacity="0.14" />
          <polygon points="304,204 304,124 330,114 330,204" fill={pal.c4} fillOpacity="0.15" />
          <polygon points="338,204 342,96 362,96 366,204" fill={`url(#tower-${uid})`} />
          <polygon points="200,42 298,196 102,196" fill={`url(#veil-${uid})`} />
          <polygon points="200,42 200,196 102,196" fill={pal.c2} fillOpacity="0.1" />
          <polygon points="200,42 298,196 200,196" fill={pal.c3} fillOpacity="0.1" />
          <path d="M 148 118 Q 200 146 252 118" fill="none" stroke={pal.ink} strokeOpacity="0.26" strokeWidth="0.5" />
          <path d="M 122 158 Q 200 184 278 158" fill="none" stroke={pal.ink} strokeOpacity="0.26" strokeWidth="0.5" />
          <path d="M 18 134 Q 50 108 82 134 T 144 134" fill="none" stroke={pal.ink} strokeOpacity="0.68" strokeWidth="0.8" />
          <path d="M 144 134 L 248 114 L 382 68" fill="none" stroke={pal.c1} strokeOpacity="0.84" strokeWidth="0.8" />
          <path d="M 144 134 L 248 126 L 382 126" fill="none" stroke={pal.c2} strokeOpacity="0.84" strokeWidth="0.8" />
          <path d="M 144 134 L 248 138 L 382 182" fill="none" stroke={pal.c4} strokeOpacity="0.84" strokeWidth="0.8" />
          <circle cx="144" cy="134" r="2.8" fill={pal.c1} />
          <circle cx="248" cy="126" r="2.8" fill={pal.c2} />
        </g>
      )}

      {(variant === 'strip-escrow' || variant === 'deploy-tessera') && (
        <g strokeLinecap="round">
          <polygon points="54,204 62,134 78,134 86,204" fill={pal.c1} fillOpacity="0.2" />
          <polygon points="64,134 68,88 72,88 76,134" fill={pal.c3} fillOpacity="0.28" />
          <line x1="70" y1="54" x2="70" y2="88" stroke={pal.c4} strokeOpacity="0.65" strokeWidth="0.7" />
          <path d="M 114 202 Q 158 76 234 106 Q 206 160 216 202 Z" fill={pal.c1} fillOpacity="0.22" />
          <path d="M 204 202 Q 254 64 334 112 Q 300 164 310 202 Z" fill={pal.c2} fillOpacity="0.22" />
          <circle cx="176" cy="126" r="42" fill="none" stroke={pal.c1} strokeOpacity="0.58" strokeWidth="0.6" />
          <circle cx="214" cy="110" r="21" fill="none" stroke={pal.c3} strokeOpacity="0.68" strokeWidth="0.6" />
          <line x1="176" y1="126" x2="214" y2="110" stroke={pal.c4} strokeOpacity="0.72" strokeWidth="0.6" />
          <path d="M 18 202 C 118 202, 168 202, 184 184 C 194 172, 196 98, 200 98 C 204 98, 206 172, 216 184 C 232 202, 282 202, 382 202" fill="none" stroke={pal.c4} strokeOpacity="0.92" strokeWidth="0.85" />
          <circle cx="200" cy="98" r="3.2" fill={pal.c4} />
          <circle cx="176" cy="126" r="2.5" fill={pal.c1} />
          <circle cx="214" cy="110" r="2.5" fill={pal.c3} />
        </g>
      )}
    </svg>
  );
}

function CorridorRegionArt({
  variant,
  className = '',
}: {
  variant: CorridorRegionVariant;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');

  const themes: Record<
    CorridorRegionVariant,
    {
      skyTop: string;
      skyMid: string;
      skyLow: string;
      glow: string;
      water: string;
      towerA: string;
      towerB: string;
      towerC: string;
      arc1: string;
      arc2: string;
      win: string;
      dark: boolean;
      label: string;
    }
  > = {
    'corridor-na-latam': {
      skyTop: '#fef2e4',
      skyMid: '#fde2d2',
      skyLow: '#d7f3ec',
      glow: '#fb923c',
      water: '#0d9488',
      towerA: '#233858',
      towerB: '#3b5984',
      towerC: '#0f766e',
      arc1: '#e83f20',
      arc2: '#0d9488',
      win: '#fde68a',
      dark: false,
      label: 'NYC · SÃO PAULO · MEXICO CITY',
    },
    'corridor-eu-apac': {
      skyTop: '#162647',
      skyMid: '#23426e',
      skyLow: '#334278',
      glow: '#38bdf8',
      water: '#1e3a5f',
      towerA: '#1d3258',
      towerB: '#284577',
      towerC: '#2b5876',
      arc1: '#34d399',
      arc2: '#fbbf24',
      win: '#7dd3fc',
      dark: true,
      label: 'LONDON · FRANKFURT · SINGAPORE · TOKYO',
    },
    'corridor-global-clearing': {
      skyTop: '#e6f7f2',
      skyMid: '#fef6e4',
      skyLow: '#e3ecff',
      glow: '#34d399',
      water: '#2563eb',
      towerA: '#1e3a5f',
      towerB: '#047857',
      towerC: '#1d4ed8',
      arc1: '#059669',
      arc2: '#e83f20',
      win: '#fef08a',
      dark: false,
      label: 'ZURICH · DUBAI · HONG KONG',
    },
    'corridor-b2b-supply': {
      skyTop: '#f1eafe',
      skyMid: '#e2f5f4',
      skyLow: '#fef0e1',
      glow: '#8b5cf6',
      water: '#4338ca',
      towerA: '#2e276b',
      towerB: '#4338ca',
      towerC: '#0f766e',
      arc1: '#ea580c',
      arc2: '#7c3aed',
      win: '#fde047',
      dark: false,
      label: 'SHANGHAI PUDONG · ROTTERDAM',
    },
    'corridor-crypto-bridge': {
      skyTop: '#1d1c3d',
      skyMid: '#3f2454',
      skyLow: '#5e2b44',
      glow: '#fb7185',
      water: '#242047',
      towerA: '#23204a',
      towerB: '#332d66',
      towerC: '#47306b',
      arc1: '#fb923c',
      arc2: '#2dd4bf',
      win: '#fda4af',
      dark: true,
      label: 'MIAMI · ZUG · SEOUL · TAIPEI 101',
    },
    'corridor-marketplace': {
      skyTop: '#fdf0f4',
      skyMid: '#e6f6ef',
      skyLow: '#fef6e3',
      glow: '#f43f5e',
      water: '#0284c7',
      towerA: '#223654',
      towerB: '#0369a1',
      towerC: '#be123c',
      arc1: '#e11d48',
      arc2: '#059669',
      win: '#fef9c3',
      dark: false,
      label: 'TORONTO · SAN FRANCISCO · SYDNEY',
    },
  };

  const t = themes[variant] ?? themes['corridor-na-latam'];

  return (
    <svg
      viewBox="0 0 600 420"
      preserveAspectRatio="xMidYMid slice"
      className={`block size-full select-none ${className}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={t.skyTop} />
          <stop offset="52%" stopColor={t.skyMid} />
          <stop offset="100%" stopColor={t.skyLow} />
        </linearGradient>
        <radialGradient id={`sun-${uid}`} cx="50%" cy="62%" r="55%">
          <stop
            offset="0%"
            stopColor={t.glow}
            stopOpacity={t.dark ? '0.45' : '0.34'}
          />
          <stop offset="100%" stopColor={t.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`sea-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            offset="0%"
            stopColor={t.water}
            stopOpacity={t.dark ? '0.45' : '0.16'}
          />
          <stop
            offset="100%"
            stopColor={t.water}
            stopOpacity={t.dark ? '0.78' : '0.32'}
          />
        </linearGradient>
        <linearGradient id={`glassA-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={t.towerA} stopOpacity="0.88" />
          <stop offset="100%" stopColor={t.towerB} stopOpacity="0.62" />
        </linearGradient>
        <linearGradient id={`glassC-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={t.towerC} stopOpacity="0.86" />
          <stop offset="100%" stopColor={t.towerB} stopOpacity="0.58" />
        </linearGradient>
      </defs>

      <rect width="600" height="420" fill={`url(#sky-${uid})`} />
      <rect width="600" height="420" fill={`url(#sun-${uid})`} />
      <rect x="0" y="326" width="600" height="94" fill={`url(#sea-${uid})`} />
      <line
        x1="0"
        y1="326"
        x2="600"
        y2="326"
        stroke={t.win}
        strokeOpacity="0.45"
        strokeWidth="0.75"
      />
      {[344, 364, 386].map((ry, idx) => (
        <line
          key={ry}
          x1={48 + idx * 35}
          y1={ry}
          x2={552 - idx * 35}
          y2={ry}
          stroke={t.win}
          strokeOpacity="0.25"
          strokeWidth="0.6"
          strokeDasharray="16 14"
        />
      ))}

      <text
        x="576"
        y="32"
        textAnchor="end"
        fill={t.dark ? '#f8fafc' : '#1e293b'}
        fillOpacity={t.dark ? '0.68' : '0.56'}
        fontFamily="monospace"
        fontSize="10"
        letterSpacing="0.8"
      >
        {t.label}
      </text>

      {variant === 'corridor-na-latam' && (
        <g>
          <rect x="44" y="218" width="34" height="108" fill={t.towerB} fillOpacity="0.45" />
          <rect x="192" y="205" width="38" height="121" fill={t.towerB} fillOpacity="0.45" />
          <rect x="405" y="196" width="42" height="130" fill={t.towerB} fillOpacity="0.45" />
          <rect x="524" y="212" width="36" height="114" fill={t.towerB} fillOpacity="0.45" />
          <polygon points="88,326 94,132 126,132 132,326" fill={`url(#glassA-${uid})`} />
          <polygon points="94,132 110,122 126,132" fill={`url(#glassC-${uid})`} />
          <line x1="110" y1="68" x2="110" y2="122" stroke={t.towerA} strokeOpacity="0.8" strokeWidth="1.4" />
          <rect x="144" y="188" width="40" height="138" fill={`url(#glassA-${uid})`} />
          <rect x="151" y="156" width="26" height="32" fill={`url(#glassA-${uid})`} />
          <rect x="157" y="134" width="14" height="22" fill={`url(#glassC-${uid})`} />
          <line x1="164" y1="104" x2="164" y2="134" stroke={t.towerA} strokeOpacity="0.8" strokeWidth="1.3" />
          <path d="M 276 326 L 302 172 L 328 326" fill="none" stroke={t.towerC} strokeOpacity="0.85" strokeWidth="2.8" />
          {[242, 262, 282, 322, 342, 362].map((bx) => (
            <line key={bx} x1="302" y1="184" x2={bx} y2="296" stroke={t.arc2} strokeOpacity="0.6" strokeWidth="0.65" />
          ))}
          <path d="M 225 298 Q 302 288 382 298" fill="none" stroke={t.towerA} strokeOpacity="0.75" strokeWidth="1.8" />
          <polygon points="452,326 452,148 492,130 492,326" fill={`url(#glassA-${uid})`} />
          <rect x="498" y="168" width="28" height="158" fill={`url(#glassC-${uid})`} />
          {[150, 175, 200, 225, 250, 275].map((wy) => (
            <g key={wy} fill={t.win} fillOpacity="0.75">
              <rect x="102" y={wy} width="4" height="10" />
              <rect x="114" y={wy} width="4" height="10" />
              <rect x="464" y={wy} width="5" height="10" />
              <rect x="476" y={wy} width="5" height="10" />
            </g>
          ))}
          <path d="M 110 120 Q 300 44 472 130" fill="none" stroke={t.arc1} strokeWidth="1.2" />
          <path d="M 164 134 Q 300 84 512 168" fill="none" stroke={t.arc2} strokeWidth="0.9" strokeDasharray="4 4" />
          <circle cx="110" cy="120" r="3.5" fill={t.arc1} />
          <circle cx="302" cy="82" r="3" fill={t.win} />
          <circle cx="472" cy="130" r="3.5" fill={t.arc2} />
        </g>
      )}

      {variant === 'corridor-eu-apac' && (
        <g>
          <polygon points="66,326 94,104 122,326" fill={`url(#glassA-${uid})`} />
          <polygon points="82,326 94,104 104,326" fill={`url(#glassC-${uid})`} />
          <path d="M 136 326 C 130 264, 134 198, 154 182 C 174 198, 178 264, 172 326 Z" fill={`url(#glassC-${uid})`} />
          <path d="M 138 228 Q 154 218 170 228 M 135 262 Q 154 252 173 262 M 136 294 Q 154 284 172 294" fill="none" stroke={t.win} strokeOpacity="0.45" strokeWidth="0.7" />
          <rect x="246" y="182" width="22" height="144" fill={`url(#glassA-${uid})`} />
          <rect x="284" y="182" width="22" height="144" fill={`url(#glassA-${uid})`} />
          <rect x="322" y="182" width="22" height="144" fill={`url(#glassA-${uid})`} />
          <path d="M 230 174 Q 295 166 376 168 L 368 182 L 234 182 Z" fill={`url(#glassC-${uid})`} />
          <path d="M 232 174 Q 295 166 374 168" fill="none" stroke={t.arc1} strokeWidth="1.2" />
          <rect x="412" y="206" width="36" height="120" fill={`url(#glassA-${uid})`} />
          <polygon points="476,326 490,152 496,152 510,326" fill={`url(#glassC-${uid})`} />
          <rect x="484" y="186" width="18" height="8" rx="2" fill={t.arc1} />
          <rect x="487" y="144" width="12" height="6" rx="2" fill={t.arc2} />
          <line x1="493" y1="84" x2="493" y2="144" stroke={t.win} strokeWidth="1.4" />
          {[204, 232, 260, 288].map((wy) => (
            <g key={wy} fill={t.win} fillOpacity="0.65">
              <rect x="254" y={wy} width="5" height="12" />
              <rect x="292" y={wy} width="5" height="12" />
              <rect x="330" y={wy} width="5" height="12" />
              <rect x="422" y={wy} width="14" height="4" />
            </g>
          ))}
          <path d="M 94 104 Q 294 42 493 88" fill="none" stroke={t.arc1} strokeWidth="1.2" />
          <path d="M 154 182 Q 295 110 430 206" fill="none" stroke={t.arc2} strokeWidth="0.9" strokeDasharray="4 4" />
          <circle cx="94" cy="104" r="3.5" fill={t.arc1} />
          <circle cx="493" cy="88" r="3.5" fill={t.arc2} />
        </g>
      )}

      {variant === 'corridor-global-clearing' && (
        <g>
          <rect x="58" y="214" width="38" height="112" fill={t.towerB} fillOpacity="0.52" />
          <rect x="106" y="188" width="44" height="138" fill={`url(#glassA-${uid})`} />
          <polygon points="256,326 266,220 314,220 324,326" fill={`url(#glassA-${uid})`} />
          <polygon points="272,220 278,154 302,154 308,220" fill={`url(#glassC-${uid})`} />
          <polygon points="282,154 286,104 294,104 298,154" fill={`url(#glassA-${uid})`} />
          <line x1="290" y1="54" x2="290" y2="104" stroke={t.towerA} strokeOpacity="0.85" strokeWidth="1.5" />
          <polygon points="416,326 416,144 464,186 464,326" fill={`url(#glassC-${uid})`} />
          <line x1="416" y1="144" x2="464" y2="232" stroke={t.win} strokeWidth="0.85" />
          <line x1="464" y1="186" x2="416" y2="274" stroke={t.win} strokeWidth="0.85" />
          <line x1="440" y1="98" x2="440" y2="165" stroke={t.towerA} strokeOpacity="0.8" strokeWidth="1.3" />
          <rect x="478" y="156" width="44" height="170" fill={`url(#glassA-${uid})`} />
          <polygon points="478,156 500,142 522,156" fill={`url(#glassC-${uid})`} />
          <path d="M 128 188 Q 290 48 498 144" fill="none" stroke={t.arc1} strokeWidth="1.2" />
          <path d="M 290 76 Q 385 95 440 144" fill="none" stroke={t.arc2} strokeWidth="0.95" />
          <circle cx="290" cy="76" r="3.5" fill={t.arc2} />
          <circle cx="498" cy="144" r="3.5" fill={t.arc1} />
        </g>
      )}

      {variant === 'corridor-b2b-supply' && (
        <g>
          <line x1="126" y1="264" x2="104" y2="326" stroke={t.towerA} strokeOpacity="0.8" strokeWidth="2.4" />
          <line x1="126" y1="264" x2="148" y2="326" stroke={t.towerA} strokeOpacity="0.8" strokeWidth="2.4" />
          <line x1="126" y1="138" x2="126" y2="326" stroke={t.towerB} strokeOpacity="0.85" strokeWidth="3.2" />
          <circle cx="126" cy="248" r="19" fill={t.arc1} fillOpacity="0.88" />
          <circle cx="126" cy="176" r="13" fill={t.arc2} fillOpacity="0.88" />
          <circle cx="126" cy="134" r="6" fill={t.win} />
          <line x1="126" y1="88" x2="126" y2="128" stroke={t.towerA} strokeOpacity="0.8" strokeWidth="1.4" />
          <polygon points="196,326 204,158 242,158 250,326" fill={`url(#glassA-${uid})`} />
          <polygon points="212,158 223,116 234,158" fill={`url(#glassC-${uid})`} />
          <path d="M 276 326 C 272 246, 286 164, 294 94 L 332 106 C 324 176, 336 252, 330 326 Z" fill={`url(#glassA-${uid})`} />
          <path d="M 284 326 C 282 248, 296 168, 304 98" fill="none" stroke={t.win} strokeOpacity="0.6" strokeWidth="0.8" />
          <rect x="412" y="188" width="42" height="138" fill={`url(#glassC-${uid})`} />
          <rect x="466" y="164" width="46" height="162" fill={`url(#glassA-${uid})`} />
          <rect x="522" y="214" width="34" height="112" fill={t.towerB} fillOpacity="0.52" />
          <path d="M 126 134 Q 312 46 488 164" fill="none" stroke={t.arc1} strokeWidth="1.2" />
          <path d="M 314 102 Q 402 114 434 188" fill="none" stroke={t.arc2} strokeWidth="0.9" strokeDasharray="4 4" />
          <circle cx="126" cy="134" r="3.5" fill={t.arc1} />
          <circle cx="488" cy="164" r="3.5" fill={t.arc2} />
        </g>
      )}

      {variant === 'corridor-crypto-bridge' && (
        <g>
          <rect x="56" y="196" width="38" height="130" fill={`url(#glassA-${uid})`} />
          <polygon points="106,326 106,164 152,182 152,326" fill={`url(#glassC-${uid})`} />
          <rect x="262" y="274" width="48" height="52" fill={`url(#glassA-${uid})`} />
          {[246, 220, 194, 168, 142].map((segY, idx) => (
            <polygon
              key={segY}
              points={`${264 + idx},${segY + 26} ${258 + idx},${segY} ${314 - idx},${segY} ${308 - idx},${segY + 26}`}
              fill={idx % 2 === 0 ? `url(#glassC-${uid})` : `url(#glassA-${uid})`}
              stroke={t.win}
              strokeOpacity="0.38"
              strokeWidth="0.55"
            />
          ))}
          <line x1="286" y1="88" x2="286" y2="142" stroke={t.arc1} strokeWidth="1.6" />
          <polygon points="434,326 456,102 472,102 494,326" fill={`url(#glassC-${uid})`} />
          <line x1="464" y1="102" x2="464" y2="326" stroke={t.win} strokeOpacity="0.45" strokeWidth="0.75" />
          <rect x="508" y="202" width="36" height="124" fill={`url(#glassA-${uid})`} />
          <path d="M 128 172 Q 286 58 464 102" fill="none" stroke={t.arc1} strokeWidth="1.25" />
          <path d="M 286 96 Q 376 74 464 102" fill="none" stroke={t.arc2} strokeWidth="0.95" />
          <circle cx="128" cy="172" r="3.5" fill={t.arc1} />
          <circle cx="286" cy="96" r="3.5" fill={t.win} />
          <circle cx="464" cy="102" r="3.5" fill={t.arc2} />
        </g>
      )}

      {variant === 'corridor-marketplace' && (
        <g>
          <polygon points="102,326 110,168 118,168 126,326" fill={`url(#glassA-${uid})`} />
          <ellipse cx="114" cy="166" rx="22" ry="7" fill={`url(#glassC-${uid})`} />
          <line x1="114" y1="92" x2="114" y2="159" stroke={t.towerA} strokeOpacity="0.85" strokeWidth="1.6" />
          <polygon points="212,326 244,126 276,326" fill={`url(#glassC-${uid})`} />
          <rect x="223" y="210" width="8" height="44" fill={`url(#glassA-${uid})`} />
          <rect x="257" y="210" width="8" height="44" fill={`url(#glassA-${uid})`} />
          <rect x="448" y="164" width="44" height="162" fill={`url(#glassA-${uid})`} />
          <rect x="502" y="188" width="38" height="138" fill={`url(#glassC-${uid})`} />
          <path d="M 358 326 Q 374 256 416 246 Q 406 292 418 326 Z" fill="#ffffff" fillOpacity="0.92" />
          <path d="M 402 326 Q 418 268 452 262 Q 442 298 452 326 Z" fill="#ffffff" fillOpacity="0.85" />
          <path d="M 114 114 Q 244 58 470 164" fill="none" stroke={t.arc1} strokeWidth="1.2" />
          <path d="M 244 126 Q 332 146 414 246" fill="none" stroke={t.arc2} strokeWidth="0.9" strokeDasharray="4 4" />
          <circle cx="114" cy="114" r="3.5" fill={t.arc1} />
          <circle cx="244" cy="126" r="3.5" fill={t.arc2} />
          <circle cx="470" cy="164" r="3.5" fill={t.arc1} />
        </g>
      )}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared Responsive Artboard, Clipboard & Animation Primitives
// ─────────────────────────────────────────────────────────────

const DESIGN_W = 1600;

function useViewportWidth() {
  const [w, setW] = useState<number>(DESIGN_W);
  useEffect(() => {
    const on = () => setW(document.documentElement.clientWidth);
    on();
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return w;
}

function useDesignScale() {
  return useViewportWidth() / DESIGN_W;
}

function useIsDesktop() {
  return useViewportWidth() >= 768;
}

function at(
  left: number,
  top: number,
  width?: number,
  height?: number,
): CSSProperties {
  return { position: 'absolute', left, top, width, height };
}

function Artboard({
  height,
  id,
  className = '',
  children,
}: {
  height: number;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const s = useDesignScale();
  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height: height * s }}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: DESIGN_W,
          height,
          transform: `scale(${s})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </section>
  );
}

function useGoogleFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_URL}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);
}

function Responsive({
  desktop,
  mobile,
}: {
  desktop: ReactNode;
  mobile: ReactNode;
}) {
  useGoogleFonts();
  const isDesktop = useIsDesktop();
  return (
    <div className="font-['Inter_Tight',sans-serif] text-[#312c2c] antialiased">
      {isDesktop ? desktop : mobile}
    </div>
  );
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduce;
}

function copyTextSafe(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) {
        resolve(true);
        return;
      }
    } catch {
      // fallback below
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    } else {
      resolve(false);
    }
  });
}

function Reveal({
  children,
  delay = 0,
  className = '',
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const shown = reduce || visible;
  const ease = 'cubic-bezier(0.16,1,0.3,1)';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(48px) scale(0.97)',
        filter: shown ? 'none' : 'blur(10px)',
        transition: reduce
          ? undefined
          : `opacity 950ms ${ease} ${delay}ms, transform 950ms ${ease} ${delay}ms, filter 950ms ${ease} ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Marquee({
  children,
  copies = 2,
  duration = 40,
  reverse = false,
  gap = 0,
  offset = 0,
  className = '',
}: {
  children: ReactNode;
  copies?: number;
  duration?: number;
  reverse?: boolean;
  gap?: number;
  offset?: number;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = track.current;
    if (!el || typeof el.animate !== 'function' || prefersReducedMotion()) return;
    const anim = el.animate(
      [
        { transform: 'translateX(0)' },
        { transform: `translateX(-${100 / copies}%)` },
      ],
      {
        duration: duration * 1000,
        iterations: Infinity,
        direction: reverse ? 'reverse' : 'normal',
      },
    );
    const pause = () => anim.pause();
    const play = () => anim.play();
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', play);
    return () => {
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', play);
      anim.cancel();
    };
  }, [copies, duration, reverse]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max" style={{ marginLeft: offset }}>
        {Array.from({ length: copies }, (_, i) => (
          <div
            key={i}
            aria-hidden={i > 0}
            className="flex shrink-0 items-stretch"
            style={{ gap, paddingRight: gap }}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({
  children,
  dark = false,
  square = '#e83f20',
}: {
  children: ReactNode;
  dark?: boolean;
  square?: string;
}) {
  return (
    <div className="flex items-center gap-[5px]">
      <span
        className="block size-[8px] rounded-[2px]"
        style={{ background: square }}
      />
      <p
        className={`m-0 whitespace-nowrap text-[18px] capitalize leading-[24px] ${
          dark ? 'text-white' : 'text-black'
        }`}
      >
        {children}
      </p>
      <span
        className="block size-[8px] rounded-[2px]"
        style={{ background: square }}
      />
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  href,
  variant = 'primary',
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'dark' | 'outline';
  className?: string;
}) {
  const base =
    variant === 'primary'
      ? 'border border-[#d6d6d7] bg-[#e83f20] text-white'
      : variant === 'dark'
        ? 'border border-[#312c2c] bg-[#0e0300] text-white'
        : 'border border-[#312c2c]/30 bg-white/80 text-[#312c2c]';
  const sweep =
    variant === 'primary'
      ? 'bg-[#0e0301]'
      : variant === 'dark'
        ? 'bg-[#e83f20]'
        : 'bg-[#0e0301]';

  const inner = (
    <>
      <span
        className={`absolute inset-0 origin-left scale-x-0 ${sweep} transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100`}
      />
      <span className="relative block overflow-hidden whitespace-nowrap">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
        >
          {children}
        </span>
      </span>
    </>
  );

  const cls = `group relative inline-flex cursor-pointer items-center overflow-hidden rounded-[10px] px-[20px] py-[10px] text-[17px] font-medium leading-[26px] no-underline transition-[transform,box-shadow,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:text-white hover:shadow-[0_14px_28px_-12px_rgba(15,2,0,0.55)] active:scale-[0.97] ${base} ${className}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {inner}
      </button>
    );
  }
  return (
    <a href={href || '#'} className={cls}>
      {inner}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared WebGL Loader + Context-Colored Currency & Crypto Coin Atlas
// ─────────────────────────────────────────────────────────────

function loadThree(): Promise<any> {
  const w = window as any;
  if (w.THREE) return Promise.resolve(w.THREE);
  if (!w.__threeLoading) {
    w.__threeLoading = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${THREE_URL}"]`,
      );
      const script = existing ?? document.createElement('script');
      script.addEventListener('load', () => resolve(w.THREE));
      script.addEventListener('error', reject);
      if (!existing) {
        script.src = THREE_URL;
        script.async = true;
        document.head.appendChild(script);
      }
    });
  }
  return w.__threeLoading;
}

const TOKEN_COIN_SPECS = [
  {
    symbol: '$',
    ticker: 'USD',
    outer: '#0d4f28',
    inner: '#15803d',
    rim: '#4ade80',
    glyph: '#ecfdf5',
  },
  {
    symbol: '₿',
    ticker: 'BTC',
    outer: '#b45309',
    inner: '#f7931a',
    rim: '#fdba74',
    glyph: '#fffbeb',
  },
  {
    symbol: 'Ξ',
    ticker: 'ETH',
    outer: '#3730a3',
    inner: '#627eea',
    rim: '#a5b4fc',
    glyph: '#eef2ff',
  },
  {
    symbol: '₮',
    ticker: 'USDT',
    outer: '#115e59',
    inner: '#26a17b',
    rim: '#5eead4',
    glyph: '#f0fdfa',
  },
  {
    symbol: '$',
    ticker: 'USDC',
    outer: '#1d4ed8',
    inner: '#2775ca',
    rim: '#93c5fd',
    glyph: '#eff6ff',
  },
  {
    symbol: '€',
    ticker: 'EUR',
    outer: '#172554',
    inner: '#1e40af',
    rim: '#fde047',
    glyph: '#fef9c3',
  },
  {
    symbol: '◎',
    ticker: 'SOL',
    outer: '#4c1d95',
    inner: '#7c3aed',
    rim: '#2dd4bf',
    glyph: '#f5f3ff',
  },
  {
    symbol: '£',
    ticker: 'GBP',
    outer: '#881337',
    inner: '#be123c',
    rim: '#fda4af',
    glyph: '#fff1f2',
  },
];

function createCoinAtlas(THREE: any) {
  const cols = 4;
  const rows = 2;
  const cell = 512;

  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = cols * cell;
  colorCanvas.height = rows * cell;
  const cCtx = colorCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = cols * cell;
  bumpCanvas.height = rows * cell;
  const bCtx = bumpCanvas.getContext('2d')!;

  bCtx.fillStyle = '#606060';
  bCtx.fillRect(0, 0, bumpCanvas.width, bumpCanvas.height);

  TOKEN_COIN_SPECS.forEach((spec, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const ox = col * cell;
    const oy = row * cell;
    const cx = ox + cell / 2;
    const cy = oy + cell / 2;
    const r = cell * 0.455;

    const grad = cCtx.createRadialGradient(
      cx - r * 0.25,
      cy - r * 0.25,
      r * 0.08,
      cx,
      cy,
      r,
    );
    grad.addColorStop(0, spec.inner);
    grad.addColorStop(0.84, spec.outer);
    grad.addColorStop(1, '#09090b');

    cCtx.save();
    cCtx.beginPath();
    cCtx.arc(cx, cy, r, 0, Math.PI * 2);
    cCtx.fillStyle = grad;
    cCtx.fill();

    cCtx.lineWidth = 14;
    cCtx.strokeStyle = spec.rim;
    cCtx.stroke();

    cCtx.beginPath();
    cCtx.arc(cx, cy, r * 0.81, 0, Math.PI * 2);
    cCtx.lineWidth = 4;
    cCtx.setLineDash([12, 10]);
    cCtx.strokeStyle = spec.rim;
    cCtx.stroke();
    cCtx.setLineDash([]);

    for (let d = 0; d < 24; d++) {
      const a = (d / 24) * Math.PI * 2;
      cCtx.beginPath();
      cCtx.arc(
        cx + Math.cos(a) * (r * 0.89),
        cy + Math.sin(a) * (r * 0.89),
        3.2,
        0,
        Math.PI * 2,
      );
      cCtx.fillStyle = spec.rim;
      cCtx.fill();
    }

    cCtx.fillStyle = spec.glyph;
    cCtx.textAlign = 'center';
    cCtx.textBaseline = 'middle';
    cCtx.font = '700 205px "Inter Tight", system-ui, sans-serif';
    cCtx.fillText(spec.symbol, cx, cy - 12);

    cCtx.fillStyle = spec.rim;
    cCtx.font = '600 44px "Inter Tight", system-ui, sans-serif';
    cCtx.fillText(spec.ticker, cx, cy + 124);
    cCtx.restore();

    bCtx.save();
    bCtx.beginPath();
    bCtx.arc(cx, cy, r, 0, Math.PI * 2);
    bCtx.fillStyle = '#8a8a8a';
    bCtx.fill();
    bCtx.lineWidth = 16;
    bCtx.strokeStyle = '#ffffff';
    bCtx.stroke();

    bCtx.fillStyle = '#ffffff';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    bCtx.font = '700 205px "Inter Tight", system-ui, sans-serif';
    bCtx.fillText(spec.symbol, cx, cy - 12);
    bCtx.font = '600 44px "Inter Tight", system-ui, sans-serif';
    bCtx.fillText(spec.ticker, cx, cy + 124);
    bCtx.restore();
  });

  const map = new THREE.CanvasTexture(colorCanvas);
  map.encoding = THREE.sRGBEncoding;
  map.anisotropy = 4;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.anisotropy = 4;

  return { map, bumpMap };
}

function applyAtlasTileUV(geo: any, tileIndex: number) {
  const cols = 4;
  const rows = 2;
  const col = tileIndex % cols;
  const row = Math.floor(tileIndex / cols);
  const u0 = col / cols;
  const u1 = (col + 1) / cols;
  const v1 = 1 - row / rows;
  const v0 = 1 - (row + 1) / rows;

  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i);
    const v = uv.getY(i);
    uv.setXY(i, u0 + u * (u1 - u0), v0 + v * (v1 - v0));
  }
  uv.needsUpdate = true;
}

// ─────────────────────────────────────────────────────────────
// Navbar (Floating Card with Expandable Dropdown Menu)
// ─────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <svg width="30" height="22" viewBox="0 0 30 22" fill="#E83F20" aria-hidden>
      <path d="M14.9656 0C14.9912 0.0336371 14.9853 0.0353799 15 0.098268C15.0006 0.325537 14.6692 1.3237 14.5949 1.57142C13.756 4.36606 12.7305 6.69365 10.9678 7.19114C10.4992 7.32337 9.91589 7.28433 9.43252 7.28828L6.31885 7.30179C5.7473 7.30864 4.90018 7.21215 4.35884 7.47166C3.45933 7.90287 2.91311 9.45459 2.45973 10.9387C1.91208 10.9387 1.36442 10.9387 0.816761 10.9387C0.634209 10.9387 0.302218 10.9357 0.0782398 11.0393L0.00718012 11.0872L0 11.0509C0.155145 10.3727 0.339693 9.72828 0.52371 9.0739C1.38707 6.00385 2.59167 3.29705 4.42714 2.42289C4.95878 2.16968 5.29361 2.19222 5.82024 2.17105C6.25387 2.15498 6.68755 2.14644 7.12139 2.14537L10.0731 2.08719C10.9376 2.07249 11.7897 2.14883 12.6407 1.8067C13.505 1.45912 14.1852 0.690142 14.9656 0Z" />
      <path d="M14.9656 22C14.9912 21.9664 14.9853 21.9646 15 21.9017C15.0006 21.6745 14.6692 20.6763 14.5949 20.4286C13.756 17.6339 12.7305 15.3064 10.9678 14.8089C10.4992 14.6766 9.91589 14.7157 9.43252 14.7117L6.31885 14.6982C5.7473 14.6914 4.90018 14.7879 4.35884 14.5283C3.45933 14.0971 2.91311 12.5454 2.45973 11.0613C1.91208 11.0613 1.36442 11.0613 0.816761 11.0613C0.634209 11.0613 0.302218 11.0643 0.0782398 10.9607L0.00718012 10.9128L0 10.9491C0.155145 11.6273 0.339693 12.2717 0.52371 12.9261C1.38707 15.9961 2.59167 18.7029 4.42714 19.5771C4.95878 19.8303 5.29361 19.8078 5.82024 19.829C6.25387 19.845 6.68755 19.8536 7.12139 19.8546L10.0731 19.9128C10.9376 19.9275 11.7897 19.8512 12.6407 20.1933C13.505 20.5409 14.1852 21.3099 14.9656 22Z" />
      <path d="M15.0344 0C15.0088 0.0336371 15.0147 0.0353799 15 0.098268C14.9994 0.325537 15.3308 1.3237 15.4051 1.57142C16.244 4.36606 17.2695 6.69365 19.0322 7.19114C19.5008 7.32337 20.0841 7.28433 20.5675 7.28828L23.6811 7.30179C24.2527 7.30864 25.0998 7.21215 25.6412 7.47166C26.5407 7.90287 27.0869 9.45459 27.5403 10.9387C28.0879 10.9387 28.6356 10.9387 29.1832 10.9387C29.3658 10.9387 29.6978 10.9357 29.9218 11.0393L29.9928 11.0872L30 11.0509C29.8449 10.3727 29.6603 9.72828 29.4763 9.0739C28.6129 6.00385 27.4083 3.29705 25.5729 2.42289C25.0412 2.16968 24.7064 2.19222 24.1798 2.17105C23.7461 2.15498 23.3124 2.14644 22.8786 2.14537L19.9269 2.08719C19.0624 2.07249 18.2103 2.14883 17.3593 1.8067C16.495 1.45912 15.8148 0.690142 15.0344 0Z" />
      <path d="M15.0344 22C15.0088 21.9664 15.0147 21.9646 15 21.9017C14.9994 21.6745 15.3308 20.6763 15.4051 20.4286C16.244 17.6339 17.2695 15.3064 19.0322 14.8089C19.5008 14.6766 20.0841 14.7157 20.5675 14.7117L23.6811 14.6982C24.2527 14.6914 25.0998 14.7879 25.6412 14.5283C26.5407 14.0971 27.0869 12.5454 27.5403 11.0613C28.0879 11.0613 28.6356 11.0613 29.1832 11.0613C29.3658 11.0613 29.6978 11.0643 29.9218 10.9607L29.9928 10.9128L30 10.9491C29.8449 11.6273 29.6603 12.2717 29.4763 12.9261C28.6129 15.9961 27.4083 18.7029 25.5729 19.5771C25.0412 19.8303 24.7064 19.8078 24.1798 19.829C23.7461 19.845 23.3124 19.8536 22.8786 19.8546L19.9269 19.9128C19.0624 19.9275 18.2103 19.8512 17.3593 20.1933C16.495 20.5409 15.8148 21.3099 15.0344 22Z" />
    </svg>
  );
}

function Navbar({
  currentRoute,
  onNavigate,
}: {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const s = useDesignScale();

  const bar = (
    <div
      className={`relative rounded-[10px] bg-white transition-shadow duration-300 ${
        open
          ? 'shadow-[0_18px_40px_-12px_rgba(15,2,0,0.32)]'
          : 'shadow-[0_6px_20px_-10px_rgba(15,2,0,0.18)]'
      }`}
    >
      <div className="flex h-[44px] items-center justify-between px-[14px]">
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            onNavigate('home');
          }}
          className="flex cursor-pointer items-center gap-[7px] border-0 bg-transparent p-0 text-[#051227] no-underline"
        >
          <LogoMark />
          <span className="inline-flex items-baseline font-['Gilda_Display',serif] text-[19px] leading-none tracking-[-0.02em]">
            Neth
            <span className="ml-[2px] inline-block -translate-y-[2px] rounded-[5px] bg-[#feebe6] px-[5px] py-[1px] font-['Give_You_Glory',cursive] text-[18px] font-bold leading-none text-[#e83f20]">
              3
            </span>
          </span>
        </button>

        <div className="flex items-center gap-[10px]">
          {currentRoute !== 'home' && (
            <span className="rounded-full bg-[#feebe6] px-[8px] py-[2px] text-[11px] font-medium text-[#e83f20]">
              {NAV_LINKS.find((n) => n.route === currentRoute)?.label}
            </span>
          )}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="group relative flex h-[24px] w-[30px] cursor-pointer flex-col items-end justify-center gap-[5px] border-0 bg-transparent p-0"
          >
            <span
              className={`block h-[2px] rounded-[10px] bg-[#312c2c] transition-all duration-300 ${
                open ? 'w-[24px] translate-y-[7px] rotate-45' : 'w-[28px]'
              }`}
            />
            <span
              className={`block h-[2px] rounded-[10px] bg-[#312c2c] transition-all duration-300 ${
                open ? 'w-0 opacity-0' : 'w-[23px] group-hover:w-[28px]'
              }`}
            />
            <span
              className={`block h-[2px] rounded-[10px] bg-[#312c2c] transition-all duration-300 ${
                open ? 'w-[24px] -translate-y-[7px] -rotate-45' : 'w-[17px] group-hover:w-[28px]'
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          opacity: open ? 1 : 0,
        }}
      >
        <nav className="overflow-hidden">
          <ul className="m-0 flex list-none flex-col gap-[2px] border-t border-[#eedcd0] px-[14px] pb-[14px] pt-[8px]">
            {NAV_LINKS.map((l) => {
              const active = currentRoute === l.route;
              return (
                <li key={l.route}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onNavigate(l.route);
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between border-0 bg-transparent py-[6px] text-left text-[15px] transition-colors duration-200 ${
                      active
                        ? 'font-medium text-[#e83f20]'
                        : 'text-[#312c2c] hover:text-[#e83f20]'
                    }`}
                  >
                    <span>{l.label}</span>
                    {active && (
                      <span className="inline-block size-[6px] rounded-full bg-[#e83f20]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center font-['Inter_Tight',sans-serif]">
        <div
          className="pointer-events-auto w-[396px]"
          style={{
            marginTop: Math.max(12, 20 * s),
            transform: `scale(${Math.max(0.86, Math.min(1.06, s))})`,
            transformOrigin: 'top center',
          }}
        >
          {bar}
        </div>
      </div>
    );
  }
  return (
    <div className="fixed left-[16px] right-[16px] top-[14px] z-50 font-['Inter_Tight',sans-serif]">
      {bar}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section 01: Hero + Low-Density Context-Colored 3D WebGL Coin Wave
// ─────────────────────────────────────────────────────────────

function HeroHeadline({ className = '' }: { className?: string }) {
  return (
    <h1
      className={`font-['Gilda_Display',serif] font-normal capitalize ${className}`}
    >
      Settling <span className="text-[#e83f20]">value</span> that{' '}
      <span className="inline-block font-['Give_You_Glory',cursive] leading-[0.95] text-[#312c2c]">
        moves
      </span>{' '}
      across the world.
    </h1>
  );
}

function HeroIntro({ className = '' }: { className?: string }) {
  return (
    <p className={className}>
      Instant global settlement across 180+ countries—connecting fiat rails,{' '}
      <span className="italic text-[#e83f20]">regulated stablecoins</span>, and
      major cryptocurrencies in one unified payment frontier.
    </p>
  );
}

function MultiRailTile({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative flex h-[180px] w-[204px] flex-col justify-between overflow-hidden rounded-[12px] bg-[#feebe6] p-[16px] shadow-[0_12px_28px_-16px_rgba(49,44,44,0.35)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#5f4837]">
          Multi-Rail Liquidity
        </span>
        <span className="inline-block size-[7px] rounded-full bg-[#04DA8C]" />
      </div>
      <div className="flex flex-wrap gap-[5px]">
        {['USDC', 'USDT', 'EURC', 'BTC', 'ETH', 'SOL'].map((tok) => (
          <span
            key={tok}
            className="rounded-[5px] bg-white px-[7px] py-[2px] text-[11px] font-semibold text-[#312c2c]"
          >
            {tok}
          </span>
        ))}
      </div>
      <div className="flex items-baseline justify-between border-t border-[#312c2c]/10 pt-[8px]">
        <span className="font-['Gilda_Display',serif] text-[22px] leading-none text-[#e83f20]">
          &lt;1.8s
        </span>
        <span className="text-[11px] text-[#5f4837]">Global Finality</span>
      </div>
    </div>
  );
}

const ROPE = {
  path: [
    [-260, 860, 1.24],
    [0, 790, 1.22],
    [100, 772, 1.22],
    [200, 742, 1.2],
    [300, 688, 1.18],
    [400, 606, 1.16],
    [500, 520, 1.15],
    [600, 446, 1.16],
    [700, 386, 1.12],
    [800, 338, 1.08],
    [900, 302, 1.04],
    [1000, 278, 1.01],
    [1100, 260, 1.0],
    [1200, 236, 1.02],
    [1300, 196, 1.07],
    [1400, 152, 1.14],
    [1500, 96, 1.18],
    [1600, 30, 1.22],
    [1760, -80, 1.25],
  ] as [number, number, number][],
  bead: 38,
  strands: 2,
  touch: 1.8,
  along: 2.85,
  twist: 0.004,
  jitter: 0.14,
  flow: 0.34,
  spin: 0.22,
  boost: 1.7,
  hoverRadius: 270,
  hoverLift: 75,
  waveHeight: 18,
  waveLength: 260,
  swellHeight: 10,
  phaseJitter: 0.85,
  hex: 0.55,
  sizeVar: 0.06,
};

type RopeController = {
  render: (t: number, intro: number) => void;
  resize: () => void;
  pointer: (x: number, y: number) => void;
  hover: (ndcX: number, ndcY: number, inside: boolean) => void;
  dispose: () => void;
};

function createCoinRope(THREE: any, canvas: HTMLCanvasElement): RopeController {
  const P = ROPE;
  const W = 1600;
  const H = 769;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const fov = 30;
  const D = H / 2 / Math.tan(((fov / 2) * Math.PI) / 180);
  const camera = new THREE.PerspectiveCamera(fov, W / H, 10, 6000);
  camera.position.set(0, 0, D);

  scene.add(new THREE.HemisphereLight('#fff5eb', '#3b150e', 0.95));
  const key = new THREE.DirectionalLight('#fff2df', 1.45);
  key.position.set(-220, 920, 680);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#ffd0a8', 0.55);
  rim.position.set(420, -450, 320);
  scene.add(rim);

  const Z = new THREE.Vector3(0, 0, 1);
  const curve = new THREE.CatmullRomCurve3(
    P.path.map(([x, y]) => new THREE.Vector3(x - W / 2, H / 2 - y, 0)),
    false,
    'centripetal',
  );
  const length = curve.getLength();

  const sizeAtX = (x: number) => {
    const pth = P.path;
    if (x <= pth[0][0] - W / 2) return pth[0][2];
    for (let i = 1; i < pth.length; i++) {
      const x0 = pth[i - 1][0] - W / 2;
      const x1 = pth[i][0] - W / 2;
      if (x <= x1) {
        const f = (x - x0) / (x1 - x0);
        const e = f * f * (3 - 2 * f);
        return pth[i - 1][2] + (pth[i][2] - pth[i - 1][2]) * e;
      }
    }
    return pth[pth.length - 1][2];
  };

  const samples = 800;
  const fr: { p: any; t: any; n: any; k: number }[] = [];
  for (let i = 0; i <= samples; i++) {
    const u = i / samples;
    const t = curve.getTangentAt(u);
    const pt = curve.getPointAt(u);
    fr.push({
      p: pt,
      t,
      n: new THREE.Vector3().crossVectors(t, Z).normalize(),
      k: sizeAtX(pt.x),
    });
  }

  const p = new THREE.Vector3();
  const T = new THREE.Vector3();
  const N = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  let K = 1;

  const frameAt = (s: number) => {
    const u = Math.min(1, Math.max(0, s / length)) * samples;
    const i = Math.min(samples - 1, Math.floor(u));
    const f = u - i;
    const a = fr[i];
    const c = fr[i + 1];
    p.lerpVectors(a.p, c.p, f);
    T.lerpVectors(a.t, c.t, f).normalize();
    N.lerpVectors(a.n, c.n, f).normalize();
    K = a.k + (c.k - a.k) * f;
    if (s < 0) p.addScaledVector(T, s);
    else if (s > length) p.addScaledVector(T, s - length);
  };

  const r = P.bead;
  const S = P.strands;
  const R = (r * P.touch) / Math.sin(Math.PI / S);
  const helix = Math.sqrt(1 + (R * P.twist) ** 2);
  const rand = (i: number) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const strands: { list: number[]; a0: number }[] = [];
  for (let j = 0; j < S; j++) {
    const list: number[] = [];
    for (
      let s =
        -r * 6 -
        (j % 2) * r * P.along * P.hex -
        rand(j) * P.phaseJitter * r;
      s < length + r * 6;

    ) {
      list.push(s);
      frameAt(s);
      s += (2 * r * P.along * K) / helix;
    }
    strands.push({
      list,
      a0: (2 * Math.PI * j) / S + (rand(j + 50) - 0.5) * P.jitter,
    });
  }

  const { map, bumpMap } = createCoinAtlas(THREE);
  const edgeMat = new THREE.MeshStandardMaterial({
    color: '#d4af37',
    roughness: 0.35,
    metalness: 0.45,
  });

  const coinGeos: any[] = [];
  const coinMats: any[] = [];
  for (let t = 0; t < TOKEN_COIN_SPECS.length; t++) {
    const g = new THREE.CylinderGeometry(r, r, r * 0.3, 36, 1);
    g.rotateX(Math.PI / 2);
    applyAtlasTileUV(g, t);
    coinGeos.push(g);

    const faceMat = new THREE.MeshStandardMaterial({
      map,
      bumpMap,
      bumpScale: 1.5,
      roughness: 0.34,
      metalness: 0.22,
    });
    coinMats.push([edgeMat, faceMat, faceMat]);
  }

  interface CoinNode {
    mesh: any;
    strandIdx: number;
    slotIdx: number;
    ox: number;
    oy: number;
    oz: number;
    os: number;
  }

  const nodes: CoinNode[] = [];
  const group = new THREE.Group();
  scene.add(group);

  let seq = 0;
  for (let j = 0; j < strands.length; j++) {
    const L = strands[j].list;
    for (let i = 0; i < L.length - 1; i++) {
      const tile = (seq + j * 3) % TOKEN_COIN_SPECS.length;
      const mesh = new THREE.Mesh(coinGeos[tile], coinMats[tile]);
      group.add(mesh);
      nodes.push({
        mesh,
        strandIdx: j,
        slotIdx: i,
        ox: 0,
        oy: 0,
        oz: 0,
        os: 0,
      });
      seq++;
    }
  }

  const INTRO = { maxDelay: 0.55, flight: 1.75 };
  const INTRO_END = INTRO.maxDelay + INTRO.flight;
  const easeOut = (x: number) => 1 - Math.pow(1 - x, 4);

  const B = new THREE.Vector3();
  const hp = new THREE.Vector3();
  const hpTarget = new THREE.Vector3();
  const hit = new THREE.Vector3();
  const faceDir = new THREE.Vector3();
  const upAxis = new THREE.Vector3(0, 0, 1);

  let hoverOn = false;
  let hoverAmt = 0;
  let hoverVel = 0;
  let lastWave = 0;
  let residual = 0;

  function layout(time: number, intro: number) {
    const flying = intro < INTRO_END;
    const now = performance.now() / 1000;
    const dtw = lastWave ? Math.min(0.05, now - lastWave) : 0;
    lastWave = now;

    const goal = hoverOn && !flying ? 1 : 0;
    const w0 = 5;
    hoverVel += (w0 * w0 * (goal - hoverAmt) - 2 * w0 * hoverVel) * dtw;
    hoverAmt = Math.min(1, Math.max(0, hoverAmt + hoverVel * dtw));
    const amt = hoverAmt * hoverAmt * (3 - 2 * hoverAmt);

    hp.lerp(hpTarget, 1 - Math.exp(-dtw * 4.5));
    const follow = 1 - Math.exp(-dtw * 7);
    const waving =
      hoverAmt > 0.002 || Math.abs(hoverVel) > 0.001 || residual > 0.02;

    let maxOff = 0;
    const kWave = (2 * Math.PI) / P.waveLength;
    const steps = time * P.flow;
    const f = steps - Math.floor(steps);
    const cycle = Math.floor(steps);

    for (let idx = 0; idx < nodes.length; idx++) {
      const node = nodes[idx];
      const st = strands[node.strandIdx];
      const L = st.list;
      const i = node.slotIdx;
      const id = node.strandIdx * 10007 + (i - cycle);

      const s = L[i] + (L[i + 1] - L[i]) * f;
      frameAt(s);
      B.crossVectors(T, N);

      const th = st.a0 + P.twist * s - time * P.spin;
      const c = Math.cos(th);
      const sn = Math.sin(th);
      tmp.copy(N).multiplyScalar(c).addScaledVector(B, sn);

      const rad = R * K * 0.65;
      const sc = K * (1 + (rand(id * 3.17 + 9.4) - 0.5) * P.sizeVar);

      let x = p.x + tmp.x * rad;
      let y = p.y + tmp.y * rad;
      let z = p.z + tmp.z * rad;
      let scale = sc;

      if (flying) {
        const delay = rand(id * 1.73 + 0.31) * INTRO.maxDelay;
        const e = easeOut(
          Math.min(1, Math.max(0, (intro - delay) / INTRO.flight)),
        );
        const ang = rand(id * 2.91 + 5.7) * Math.PI * 2;
        const dist = (650 + rand(id * 4.13 + 1.9) * 850) * (1 - e);
        const swirl = (1 - e) * 1.5;
        x += Math.cos(ang + swirl) * dist;
        y += Math.sin(ang + swirl) * dist * 0.75;
        z += (rand(id * 6.07 + 2.2) - 0.35) * 1100 * (1 - e);
        scale = sc * (0.55 + 0.45 * e);
      }

      if (waving) {
        const d = Math.hypot(x - hp.x, y - hp.y);
        const near = Math.exp(-((d / P.hoverRadius) ** 2));
        const ripple = Math.sin(d * kWave - now * 3.2);
        const bob = Math.sin(now * 1.8 + rand(id * 5.3 + 0.7) * 6.28);
        const swell = Math.sin(s * 0.009 - now * 1.6);

        const ty =
          amt *
          (near * (P.hoverLift + P.waveHeight * ripple + 5 * bob) +
            P.swellHeight * swell);
        const tx = amt * near * ripple * P.waveHeight * 0.3 * T.x;
        const tz = amt * near * (35 + 12 * ripple);
        const ts = amt * near * (0.12 + 0.04 * ripple);

        node.ox += (tx - node.ox) * follow;
        node.oy += (ty - node.oy) * follow;
        node.oz += (tz - node.oz) * follow;
        node.os += (ts - node.os) * follow;
        maxOff = Math.max(maxOff, Math.abs(node.oy), Math.abs(node.oz));
      } else if (node.oy !== 0) {
        node.ox = 0;
        node.oy = 0;
        node.oz = 0;
        node.os = 0;
      }

      x += node.ox;
      y += node.oy;
      z += node.oz;
      scale *= 1 + node.os;

      node.mesh.position.set(x, y, z);
      node.mesh.scale.setScalar(scale);

      const tiltX = Math.sin(time * 1.4 + idx * 0.9) * 0.24;
      const tiltY = Math.cos(time * 1.1 + idx * 0.7) * 0.28;
      faceDir.set(tiltY, tiltX, 1).normalize();
      node.mesh.quaternion.setFromUnitVectors(upAxis, faceDir);
    }

    residual = maxOff;
  }

  let mx = 0;
  let my = 0;
  let tx = 0;
  let ty = 0;

  function render(time: number, intro: number) {
    layout(time, intro);
    mx += (tx - mx) * 0.06;
    my += (ty - my) * 0.06;
    camera.position.set(mx * 36, -my * 20, D);
    camera.lookAt(mx * 8, -my * 5, 0);
    renderer.render(scene, camera);
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    const onScreen = canvas.getBoundingClientRect().width / w || 1;
    renderer.setPixelRatio(
      Math.min(2, (window.devicePixelRatio || 1) * Math.min(1, onScreen)),
    );
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const fitH = Math.max(H, W / camera.aspect);
    camera.fov = (2 * Math.atan(fitH / 2 / D) * 180) / Math.PI;
    camera.updateProjectionMatrix();
  }

  resize();

  return {
    render,
    resize,
    pointer: (x: number, y: number) => {
      tx = x;
      ty = y;
    },
    hover: (nx: number, ny: number, inside: boolean) => {
      if (!inside) {
        hoverOn = false;
        return;
      }
      hit.set(nx, ny, 0.5).unproject(camera).sub(camera.position);
      hit.multiplyScalar(-camera.position.z / hit.z).add(camera.position);
      let onRope = false;
      for (let i = 0; i <= samples; i += 3) {
        const fp = fr[i];
        const reach = (R + r) * fp.k + (hoverOn ? P.hoverLift + 30 : 25);
        const dx = hit.x - fp.p.x;
        const dy = hit.y - fp.p.y;
        if (dx * dx + dy * dy <= reach * reach) {
          onRope = true;
          break;
        }
      }
      hoverOn = onRope;
      if (!onRope) return;
      hpTarget.copy(hit);
      if (hoverAmt < 0.01) hp.copy(hpTarget);
    },
    dispose: () => {
      coinGeos.forEach((g: any) => g.dispose());
      coinMats.forEach((mats: any) => mats[1].dispose());
      edgeMat.dispose();
      map.dispose();
      bumpMap.dispose();
      renderer.dispose();
    },
  };
}

function CoinRope({
  className = '',
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let rope: RopeController | null = null;
    let raf = 0;
    let visible = false;
    let seen = false;
    let cancelled = false;
    const reduce = prefersReducedMotion();

    let clock = 0;
    let last = 0;
    let speed = 0;
    let intro = 0;
    let push = 0;

    const tick = (now: number) => {
      raf = 0;
      if (!rope || !visible) {
        last = 0;
        return;
      }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      push *= Math.exp(-dt * 1.6);
      speed += (1 + push - speed) * Math.min(1, dt * 2.5);
      clock += dt * speed;
      intro += dt;
      last = now;
      rope.render(clock, reduce ? Infinity : intro);
      if (!reduce) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (!visible) seen = false;
      if (visible && !was && !seen && !reduce) intro = 0;
      if (visible) seen = true;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });

    const ro = new ResizeObserver(() => {
      rope?.resize();
      if (reduce && rope) rope.render(0, Infinity);
    });

    let px = -1;
    let py = -1;
    const onMove = (e: PointerEvent) => {
      rope?.pointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
      const b = canvas.getBoundingClientRect();
      const inside = e.clientY >= b.top && e.clientY <= b.bottom;
      if (inside && px >= 0) {
        push = Math.min(
          ROPE.boost - 1,
          push + Math.hypot(e.clientX - px, e.clientY - py) / 260,
        );
      }
      px = e.clientX;
      py = e.clientY;
      const over = inside && e.clientX >= b.left && e.clientX <= b.right;
      rope?.hover(
        ((e.clientX - b.left) / b.width) * 2 - 1,
        -((e.clientY - b.top) / b.height) * 2 + 1,
        over,
      );
    };

    const onLeave = (e: PointerEvent) => {
      if (!e.relatedTarget) rope?.hover(0, 0, false);
    };

    loadThree()
      .then((THREE) => {
        if (cancelled) return;
        rope = createCoinRope(THREE, canvas);
        rope.resize();
        rope.render(0, reduce ? Infinity : 0);
        setReady(true);
        io.observe(canvas);
        ro.observe(canvas);
        if (!reduce) {
          window.addEventListener('pointermove', onMove);
          document.addEventListener('pointerout', onLeave);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onLeave);
      rope?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`block transition-opacity duration-1000 motion-reduce:transition-none ${
        ready ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={style}
    />
  );
}

function HeroDesktop({ onNavigate }: { onNavigate: (route: PageRoute) => void }) {
  return (
    <Artboard id="home" height={770} className="bg-[#eedcd0]">
      <CoinRope style={at(0, 1, 1600, 769)} />

      <div style={at(60, 123, 376)}>
        <Reveal>
          <HeroIntro className="text-[20px] leading-[27px] text-[#312c2c]" />
        </Reveal>
        <Reveal delay={150} className="mt-[20px]">
          <MultiRailTile />
        </Reveal>
      </div>

      <div style={at(820, 440, 720)}>
        <Reveal delay={200}>
          <HeroHeadline className="m-0 text-[66px] leading-[74px] tracking-[-1.98px] text-[#312c2c]" />
        </Reveal>
        <Reveal delay={320} className="mt-[28px] flex items-center gap-[14px]">
          <ActionButton onClick={() => onNavigate('contact')}>
            Start Settling Today
          </ActionButton>
          <ActionButton
            variant="outline"
            onClick={() => onNavigate('capabilities')}
          >
            Explore API Docs
          </ActionButton>
        </Reveal>
      </div>
    </Artboard>
  );
}

function HeroMobile({ onNavigate }: { onNavigate: (route: PageRoute) => void }) {
  return (
    <section
      id="home"
      className="overflow-hidden bg-[#eedcd0] pb-[44px] pt-[96px]"
    >
      <div className="px-[20px]">
        <Reveal>
          <HeroHeadline className="m-0 text-[40px] leading-[46px] tracking-[-1.2px] text-[#312c2c]" />
        </Reveal>
        <Reveal delay={120} className="mt-[20px]">
          <HeroIntro className="text-[17px] leading-[25px] text-[#312c2c]" />
        </Reveal>
        <Reveal delay={200} className="mt-[24px] flex flex-wrap gap-[10px]">
          <ActionButton onClick={() => onNavigate('contact')}>
            Start Settling Today
          </ActionButton>
          <ActionButton
            variant="outline"
            onClick={() => onNavigate('capabilities')}
          >
            API Docs
          </ActionButton>
        </Reveal>
      </div>
      <div className="relative mt-[28px] aspect-[1600/769] w-full">
        <CoinRope className="absolute inset-0 size-full" />
        <Reveal delay={260} className="absolute left-[20px] top-[-8px]">
          <MultiRailTile className="!h-[126px] !w-[164px] !p-[12px]" />
        </Reveal>
      </div>
    </section>
  );
}

function HeroSection({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  return (
    <Responsive
      desktop={<HeroDesktop onNavigate={onNavigate} />}
      mobile={<HeroMobile onNavigate={onNavigate} />}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Section 02: Platform Overview, Metrics, Live Settlement Terminal & Abstract Strip
// ─────────────────────────────────────────────────────────────

const METRICS = [
  { value: '<1.8s', label: 'Settlement Finality' },
  { value: '180+', label: 'Supported Countries' },
  { value: '$48B+', label: 'Annualized Volume' },
  { value: '99.998%', label: 'Network Uptime' },
  { value: '0.08%', label: 'Flat FX Spread' },
  { value: '24/7/365', label: 'Real-Time Clearing' },
];

const PRINCIPLES = [
  'Instant fiat & stablecoin parity',
  'Native BTC, ETH & SOL liquidity',
  'Automated KYT & global compliance',
];

type LogoName =
  | 'tessera'
  | 'northbeam'
  | 'quillio'
  | 'fernlight'
  | 'ordinal'
  | 'kitewise';

const CLIENTS: { name: string; icon: LogoName }[] = [
  { name: 'Tessera', icon: 'tessera' },
  { name: 'Northbeam', icon: 'northbeam' },
  { name: 'Quillio', icon: 'quillio' },
  { name: 'Fernlight', icon: 'fernlight' },
  { name: 'Ordinal', icon: 'ordinal' },
  { name: 'Kitewise', icon: 'kitewise' },
];

const CORRIDOR_TERMINAL_MODES = [
  {
    pair: 'USD → USDC',
    sourceRail: 'FedNow / ACH',
    targetRail: 'Ethereum / Solana',
    amount: '$250,000.00',
    settled: '250,000.00 USDC',
    time: '0.84s',
    fee: '$0.00 (1:1 Mint)',
  },
  {
    pair: 'EUR → EURC',
    sourceRail: 'SEPA Instant',
    targetRail: 'Base / Polygon',
    amount: '€180,000.00',
    settled: '180,000.00 EURC',
    time: '1.12s',
    fee: '0.04% FX',
  },
  {
    pair: 'BTC → SGD',
    sourceRail: 'Bitcoin Lightning',
    targetRail: 'Singapore FAST',
    amount: '2.5000 BTC',
    settled: 'S$318,450.00',
    time: '1.45s',
    fee: '0.08% Spread',
  },
  {
    pair: 'USDT → GBP',
    sourceRail: 'TRON / Arbitrum',
    targetRail: 'UK Faster Payments',
    amount: '120,000.00 USDT',
    settled: '£94,680.00',
    time: '0.96s',
    fee: '0.08% Spread',
  },
];

function LogoIcon({ name, size }: { name: LogoName; size: number }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.27 } as const;
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden>
      {name === 'tessera' && (
        <g {...p}>
          <rect x="5.67" y="5.67" width="9.92" height="9.92" rx="2.27" />
          <circle cx="23.375" cy="10.625" r="4.96" />
          <circle cx="10.625" cy="23.375" r="4.96" />
          <rect x="18.42" y="18.42" width="9.92" height="9.92" rx="2.27" />
        </g>
      )}
      {name === 'northbeam' && (
        <g {...p} strokeWidth={2.41} strokeLinecap="round">
          <circle cx="17" cy="18.42" r="5.95" />
          <path d="M17 4.96V9.21M6.375 9.92L9.35 12.89M27.625 9.92L24.65 12.89M4.25 29.04H29.75" />
        </g>
      )}
      {name === 'quillio' && (
        <g {...p} strokeLinecap="round" strokeLinejoin="round">
          <path d="M27.625 6.375C17 7.08 9.21 14.17 7.79 26.21C13.46 25.5 17.71 23.375 20.54 19.83H14.875C19.125 18.42 21.96 16.72 23.66 14.17H18.42C22.95 12.18 26.21 9.92 27.625 6.375Z" />
          <path d="M5.67 28.33L9.92 24.08" />
        </g>
      )}
      {name === 'fernlight' && (
        <path
          {...p}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 29.75V19.125M17 19.125V18.42M17 19.125C12.04 19.125 8.5 16.29 8.5 10.625C14.17 10.625 17 14.17 17 18.42M17 18.42V13.46M17 13.46V12.75C17 8.5 19.83 4.96 25.5 4.96C25.5 10.625 21.96 13.46 17 13.46Z"
        />
      )}
      {name === 'ordinal' && (
        <g {...p}>
          <circle cx="17" cy="17" r="12.04" />
          <circle cx="17" cy="17" r="6.8" />
          <circle cx="17" cy="17" r="1.98" fill="currentColor" stroke="none" />
        </g>
      )}
      {name === 'kitewise' && (
        <g {...p} strokeLinejoin="round">
          <path d="M17 4.25L25.5 14.875L17 29.75L8.5 14.875L17 4.25Z" />
          <path d="M8.5 14.875H25.5M17 4.25V29.75" />
        </g>
      )}
    </svg>
  );
}

function PlatformQuote({ className = '' }: { className?: string }) {
  return (
    <blockquote
      className={`m-0 font-['Gilda_Display',serif] capitalize text-[#302d2c] ${className}`}
    >
      “Modern finance isn’t <span className="text-[#e83f20]">borders</span>. It’s
      how global{' '}
      <span className="inline-block font-['Give_You_Glory',cursive] leading-[0.95]">
        liquidity
      </span>{' '}
      moves before legacy rails even open.”
    </blockquote>
  );
}

function PlatformCaption() {
  return (
    <div className="flex items-center gap-[16px]">
      <span className="block h-px w-[80px] bg-[#e83f20]" />
      <p className="m-0 whitespace-nowrap text-[16px] leading-[1.8] text-[#8e869c]">
        “Trusted by 300+ fintechs &amp; global treasuries”
      </p>
      <span className="block h-px w-[80px] bg-[#e83f20]" />
    </div>
  );
}

function Metric({
  value,
  label,
  small = false,
}: {
  value: string;
  label: string;
  small?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-baseline gap-[6px] whitespace-nowrap py-[4px]">
      <p
        className={`m-0 font-['Goudy_Old_Style','Sorts_Mill_Goudy',serif] font-bold text-white [font-variant-numeric:lining-nums] ${
          small ? 'text-[36px] leading-[44px]' : 'text-[56px] leading-[66px]'
        }`}
      >
        {value}
      </p>
      <p
        className={`m-0 capitalize text-[#c7c6c6] ${
          small ? 'text-[14px] leading-[20px]' : 'text-[16px] leading-[26px]'
        }`}
      >
        / {label}
      </p>
    </div>
  );
}

function ClientLogo({
  name,
  icon,
  small = false,
}: {
  name: string;
  icon: LogoName;
  small?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-[13px] text-[#8e869c] opacity-90 transition-colors duration-300 hover:text-[#e83f20]">
      <LogoIcon name={icon} size={small ? 24 : 34} />
      <p
        className={`m-0 whitespace-nowrap font-['Onest',sans-serif] font-medium leading-[1.2] tracking-[-0.01em] ${
          small ? 'text-[20px]' : 'text-[28.77px]'
        }`}
      >
        {name}
      </p>
    </div>
  );
}

function TreasuryPreviewCard({ mobile = false }: { mobile?: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeRoute = CORRIDOR_TERMINAL_MODES[activeIdx];

  return (
    <div
      className={`group relative overflow-hidden rounded-[24px] bg-[#0e0201] text-white shadow-[0_28px_60px_-20px_rgba(14,2,1,0.45)] ${
        mobile ? 'w-full p-[20px]' : 'size-full p-[26px]'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <AbstractPaymentArt variant="strip-multichain" compact />
      </div>
      <div className="relative z-10 flex h-full flex-col justify-between gap-[12px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <span className="inline-block size-[8px] animate-pulse rounded-full bg-[#04DA8C]" />
            <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#eedcd0]/80">
              Live Multi-Rail Settlement
            </span>
          </div>
          <span className="rounded-full border border-white/15 bg-white/10 px-[10px] py-[2px] text-[11px] text-[#04DA8C]">
            Finality {activeRoute.time}
          </span>
        </div>

        <div className="flex flex-wrap gap-[6px]">
          {CORRIDOR_TERMINAL_MODES.map((mode, idx) => (
            <button
              key={mode.pair}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`cursor-pointer rounded-full border px-[10px] py-[4px] text-[12px] font-medium transition-colors ${
                idx === activeIdx
                  ? 'border-[#e83f20] bg-[#e83f20] text-white'
                  : 'border-white/15 bg-white/5 text-[#eedcd0]/80 hover:bg-white/15'
              }`}
            >
              {mode.pair}
            </button>
          ))}
        </div>

        <div className="rounded-[16px] border border-white/10 bg-white/[0.04] p-[16px]">
          <div className="flex items-baseline justify-between gap-[12px]">
            <div>
              <p className="m-0 text-[11px] uppercase tracking-[0.06em] text-[#c7c6c6]">
                Source ({activeRoute.sourceRail})
              </p>
              <p className="m-0 mt-[2px] font-['Gilda_Display',serif] text-[24px] text-white">
                {activeRoute.amount}
              </p>
            </div>
            <span className="text-[18px] text-[#e83f20]">→</span>
            <div className="text-right">
              <p className="m-0 text-[11px] uppercase tracking-[0.06em] text-[#c7c6c6]">
                Delivered ({activeRoute.targetRail})
              </p>
              <p className="m-0 mt-[2px] font-['Gilda_Display',serif] text-[24px] text-[#04DA8C]">
                {activeRoute.settled}
              </p>
            </div>
          </div>

          <div className="mt-[12px] flex items-center justify-between border-t border-white/10 pt-[10px] text-[12px] text-[#c7c6c6]">
            <span>Network &amp; FX Spread: {activeRoute.fee}</span>
            <span className="text-white">ISO 20022 Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlatformIntro({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate: (route: PageRoute) => void;
}) {
  return (
    <>
      <Reveal>
        <h2
          className={`m-0 font-['Gilda_Display',serif] font-normal capitalize text-[#302d2c] ${
            mobile
              ? 'text-[40px] leading-[48px] tracking-[-1.2px]'
              : 'text-[60px] leading-[74px] tracking-[-1.8px]'
          }`}
        >
          Built For The <span className="text-[#e83f20]">Payment Frontier.</span>
        </h2>
      </Reveal>
      <Reveal delay={200} className={mobile ? 'mt-[16px]' : 'mt-[23px]'}>
        <p
          className={`m-0 text-[#5f4837] ${
            mobile ? 'text-[17px] leading-[27px]' : 'text-[20px] leading-[30px]'
          }`}
        >
          Neth3 unifies{' '}
          <span className="italic text-[#e83f20]">180+ local payment rails</span>,
          regulated stablecoins (USDC, USDT, EURC), and major cryptocurrencies (BTC, ETH, SOL)
          into a single programmatic settlement fabric that clears globally in under two seconds.
        </p>
      </Reveal>
      <Reveal delay={300} className={mobile ? 'mt-[20px]' : 'mt-[30px]'}>
        <ul className="m-0 list-none p-0">
          {PRINCIPLES.map((p) => (
            <li
              key={p}
              className="flex items-center gap-[10px] text-[16px] leading-[30px] text-[#5f4837]"
            >
              <span className="block size-[8px] rounded-full bg-[#e83f20]" />
              {p}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={380} className={mobile ? 'mt-[28px]' : 'mt-[46px]'}>
        <ActionButton onClick={() => onNavigate('about')}>
          Explore Payment Architecture
        </ActionButton>
      </Reveal>
    </>
  );
}

function StripCard({
  art,
  alt,
  tag,
  accent,
  w,
  h,
  onNavigate,
}: {
  art: PaymentArtVariant;
  alt: string;
  tag: string;
  accent: string;
  w: number;
  h: number;
  onNavigate: (route: PageRoute) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onNavigate('capabilities')}
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-[22px] border-0 bg-white/70 p-0 text-left shadow-[0_14px_34px_-20px_rgba(49,44,44,0.2)] transition-shadow duration-500 hover:shadow-[0_24px_44px_-20px_rgba(49,44,44,0.3)]"
      style={{ width: w, height: h }}
    >
      <div className="size-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]">
        <AbstractPaymentArt variant={art} compact />
      </div>
      <div className="absolute inset-x-[14px] bottom-[14px] rounded-[16px] bg-white/90 px-[15px] py-[12px] backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[2px]">
        <div className="flex items-center gap-[6px]">
          <span
            className="inline-block size-[6px] shrink-0 rounded-full"
            style={{ backgroundColor: accent }}
          />
          <span className="truncate font-mono text-[11px] font-medium leading-[15px] tracking-[0.02em] text-[#5f4837]">
            {tag}
          </span>
        </div>
        <p className="m-0 mt-[5px] font-['Gilda_Display',serif] text-[18px] leading-[23px] text-[#261712]">
          {alt}
        </p>
      </div>
    </button>
  );
}

function PlatformDesktop({ onNavigate }: { onNavigate: (route: PageRoute) => void }) {
  return (
    <Artboard id="about" height={1660} className="bg-[#efded1]">
      <div className="bg-[#0e0201]" style={at(0, 0, 1600, 166)}>
        <Marquee className="absolute left-0 top-[46px] w-[1600px]" offset={-100} gap={44} duration={45}>
          {METRICS.map((m) => (
            <Metric key={m.label} {...m} />
          ))}
        </Marquee>
      </div>

      <Reveal style={at(280, 246, 1040)}>
        <PlatformQuote className="text-center text-[56px] leading-[72px] tracking-[-1.68px]" />
      </Reveal>
      <Reveal delay={200} className="flex justify-center" style={at(0, 536, 1600)}>
        <PlatformCaption />
      </Reveal>

      <div style={at(0, 598, 1600, 35)}>
        <Marquee offset={-21.6} gap={58} duration={40} reverse>
          {CLIENTS.concat(CLIENTS.slice(0, 2)).map((c, i) => (
            <ClientLogo key={i} {...c} />
          ))}
        </Marquee>
      </div>

      <div style={at(60, 718, 680)}>
        <PlatformIntro onNavigate={onNavigate} />
      </div>
      <Reveal delay={150} style={at(890, 718, 650, 440)}>
        <TreasuryPreviewCard />
      </Reveal>

      <div style={at(0, 1278, 1600, 326)}>
        <Marquee offset={-105} gap={20} duration={50}>
          {STRIP_ITEMS.map((img) => (
            <StripCard
              key={img.alt}
              {...img}
              w={285}
              h={322}
              onNavigate={onNavigate}
            />
          ))}
        </Marquee>
      </div>
    </Artboard>
  );
}

function PlatformMobile({ onNavigate }: { onNavigate: (route: PageRoute) => void }) {
  return (
    <section id="about" className="bg-[#efded1] pb-[56px]">
      <div className="bg-[#0e0201] py-[28px]">
        <Marquee gap={28} duration={35}>
          {METRICS.map((m) => (
            <Metric key={m.label} {...m} small />
          ))}
        </Marquee>
      </div>

      <div className="px-[20px] pt-[56px] text-center">
        <Reveal>
          <PlatformQuote className="text-[30px] leading-[38px] tracking-[-0.9px]" />
        </Reveal>
        <Reveal delay={200} className="mt-[28px] flex justify-center [&_span]:!w-[40px]">
          <PlatformCaption />
        </Reveal>
      </div>
      <Marquee className="mt-[20px]" gap={36} duration={30} reverse>
        {CLIENTS.map((c) => (
          <ClientLogo key={c.name} {...c} small />
        ))}
      </Marquee>

      <div className="px-[20px] pt-[56px]">
        <PlatformIntro mobile onNavigate={onNavigate} />
        <Reveal delay={150} className="mt-[32px]">
          <TreasuryPreviewCard mobile />
        </Reveal>
      </div>

      <Marquee className="mt-[40px]" gap={14} duration={40}>
        {STRIP_ITEMS.map((img) => (
          <StripCard
            key={img.alt}
            {...img}
            w={220}
            h={246}
            onNavigate={onNavigate}
          />
        ))}
      </Marquee>
    </section>
  );
}

function PlatformSection({ onNavigate }: { onNavigate: (route: PageRoute) => void }) {
  return (
    <Responsive
      desktop={<PlatformDesktop onNavigate={onNavigate} />}
      mobile={<PlatformMobile onNavigate={onNavigate} />}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Section 03: Capabilities ("What Neth3 Delivers Best.")
// ─────────────────────────────────────────────────────────────

type ServiceIconName =
  | 'rails'
  | 'stablecoins'
  | 'crypto'
  | 'fx'
  | 'checkout'
  | 'treasury';

const CAPABILITIES: {
  title: string;
  text: string;
  icon: ServiceIconName;
  x: number;
  y: number;
}[] = [
  {
    title: 'Global Fiat Rails',
    text: 'Direct SEPA Instant, FedNow, PIX, SPEI, and Faster Payments clearing across 180+ countries.',
    icon: 'rails',
    x: 589,
    y: 115,
  },
  {
    title: 'Stablecoin Clearing',
    text: '1:1 institutional minting and instant redemption across USDC, USDT, PYUSD, and EURC.',
    icon: 'stablecoins',
    x: 90,
    y: 238,
  },
  {
    title: 'Major Crypto Gateway',
    text: 'Native settlement and liquidity routing for Bitcoin, Ethereum, Solana, and Layer-2 networks.',
    icon: 'crypto',
    x: 1088,
    y: 238,
  },
  {
    title: 'Cross-Border FX Engine',
    text: 'Real-time algorithmic FX routing with zero weekend lockups and locked mid-market rates.',
    icon: 'fx',
    x: 90,
    y: 539,
  },
  {
    title: 'Merchant Checkout API',
    text: 'Drop-in global checkout accepting cards, local wallets, and crypto with instant fiat payout.',
    icon: 'checkout',
    x: 1088,
    y: 539,
  },
  {
    title: 'Treasury & Escrow',
    text: 'Multi-currency liquidity pools, automated sweeps, and smart-contract escrow orchestration.',
    icon: 'treasury',
    x: 589,
    y: 662,
  },
];

function ServiceIcon({ name }: { name: ServiceIconName }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className="block h-full w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {name === 'rails' && (
        <>
          <circle cx="24" cy="24" r="15" />
          <ellipse cx="24" cy="24" rx="7" ry="15" />
          <path d="M9 24h30M11.5 16.5h25M11.5 31.5h25" />
        </>
      )}
      {name === 'stablecoins' && (
        <>
          <circle cx="24" cy="24" r="14" />
          <path d="M24 14v20M28 18.5c0-2-1.8-3.5-4-3.5s-4 1.5-4 3.5c0 2.2 1.8 3.2 4 4s4 1.8 4 4c0 2-1.8 3.5-4 3.5s-4-1.5-4-3.5" />
        </>
      )}
      {name === 'crypto' && (
        <>
          <polygon points="24,8 37,24 24,40 11,24" />
          <polyline points="11,24 24,29 37,24" />
          <line x1="24" y1="8" x2="24" y2="40" />
        </>
      )}
      {name === 'fx' && (
        <>
          <path d="M10 17h26M29 11l7 6-7 6" />
          <path d="M38 31H12M19 25l-7 6 7 6" />
        </>
      )}
      {name === 'checkout' && (
        <>
          <rect x="8" y="12" width="32" height="24" rx="4" />
          <path d="M8 19h32M15 28h7M29 28h4" />
        </>
      )}
      {name === 'treasury' && (
        <>
          <rect x="10" y="10" width="28" height="28" rx="5" />
          <circle cx="24" cy="24" r="6" />
          <path d="M24 14v4M24 30v4M14 24h4M30 24h4" />
        </>
      )}
    </svg>
  );
}

function CapabilitiesHeading({ className = '' }: { className?: string }) {
  return (
    <h2
      className={`m-0 font-['Gilda_Display',serif] font-normal capitalize text-[#302d2c] ${className}`}
    >
      What Neth3 Delivers{' '}
      <span className="inline-block font-['Give_You_Glory',cursive] leading-[0.95] text-[#e83f20]">
        Best.
      </span>
    </h2>
  );
}

function CapabilityCard({
  title,
  text,
  icon,
  wide = false,
  onClick,
}: {
  title: string;
  text: string;
  icon: ServiceIconName;
  wide?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex cursor-pointer overflow-hidden rounded-[12px] border-0 bg-white text-left transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[6px] hover:shadow-[0_24px_40px_-24px_rgba(232,63,32,0.55)] ${
        wide ? 'h-[123px] w-[423px] p-[10px]' : 'w-full gap-[14px] p-[8px]'
      }`}
    >
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-[#e83f20] text-white ${
          wide ? 'h-[103px] w-[112px]' : 'h-[88px] w-[92px]'
        }`}
      >
        <span
          className={`block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-[1.12] ${
            wide ? 'h-[66px] w-[66px]' : 'h-[54px] w-[54px]'
          }`}
        >
          <ServiceIcon name={icon} />
        </span>
      </div>
      <div
        className={
          wide ? 'ml-[13px] mt-[8px] w-[272px]' : 'min-w-0 flex-1 py-[6px] pr-[6px]'
        }
      >
        <h3
          className={`m-0 font-['Gilda_Display',serif] font-normal capitalize text-[#302d2c] transition-colors duration-300 group-hover:text-[#e83f20] ${
            wide
              ? 'text-[25px] leading-[30px] tracking-[-0.75px]'
              : 'text-[22px] tracking-[-0.6px]'
          }`}
        >
          {title}
        </h3>
        <p
          className={`m-0 text-[#5e4836] ${
            wide
              ? 'mt-[6px] text-[15px] leading-[21px]'
              : 'mt-[4px] text-[15px] leading-[21px]'
          }`}
        >
          {text}
        </p>
      </div>
    </button>
  );
}

function CapabilitiesDesktop({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const [spread, setSpread] = useState(false);

  useEffect(() => {
    if (reduce) {
      setSpread(true);
      return;
    }
    const el = stage.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSpread(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => setSpread(e.isIntersecting),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const CX = 800 - 423 / 2;
  const CY = 450 - 123 / 2;
  const ease = 'cubic-bezier(0.16,1,0.3,1)';

  return (
    <Artboard id="services" height={900} className="bg-[#efded0]">
      <div ref={stage} className="pointer-events-none" style={at(0, 0, 1600, 900)} />
      <div
        className="flex justify-center"
        style={{
          ...at(0, 391, 1600),
          opacity: spread ? 1 : 0,
          transition: `opacity 700ms ${ease} ${spread ? 450 : 0}ms`,
        }}
      >
        <Badge>Capabilities</Badge>
      </div>
      <div
        style={{
          ...at(0, 429, 1600),
          opacity: spread ? 1 : 0,
          transition: `opacity 900ms ${ease} ${spread ? 550 : 0}ms`,
        }}
      >
        <CapabilitiesHeading className="text-center text-[60px] leading-[74px] tracking-[-1.8px]" />
      </div>
      {CAPABILITIES.map((card, i) => {
        const tilt = [-6, 4, -3, 5, -5, 3][i % 6];
        const stacked = `translate(${CX - card.x}px, ${CY - card.y}px) rotate(${tilt}deg) scale(0.92)`;
        return (
          <div
            key={card.title}
            style={{
              ...at(card.x, card.y, 423, 123),
              zIndex: CAPABILITIES.length - i,
              transform: spread ? 'none' : stacked,
              transition: `transform 1200ms ${ease} ${spread ? 150 + i * 90 : 0}ms`,
            }}
          >
            <CapabilityCard
              {...card}
              wide
              onClick={() => onNavigate('capabilities')}
            />
          </div>
        );
      })}
    </Artboard>
  );
}

function CapabilitiesMobile({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  return (
    <section id="services" className="bg-[#efded0] px-[20px] py-[64px]">
      <Reveal className="flex justify-center">
        <Badge>Capabilities</Badge>
      </Reveal>
      <Reveal delay={200} className="mt-[14px]">
        <CapabilitiesHeading className="text-center text-[40px] leading-[48px] tracking-[-1.2px]" />
      </Reveal>
      <div className="mt-[32px] flex flex-col gap-[14px]">
        {CAPABILITIES.map((s, i) => (
          <Reveal key={s.title} delay={i * 80}>
            <CapabilityCard {...s} onClick={() => onNavigate('capabilities')} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CapabilitiesSection({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  return (
    <Responsive
      desktop={<CapabilitiesDesktop onNavigate={onNavigate} />}
      mobile={<CapabilitiesMobile onNavigate={onNavigate} />}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Section 04: Global Corridors ("Corridors We’ve Unlocked.")
// ─────────────────────────────────────────────────────────────

type Box = { x: number; y: number; w: number; h?: number };

const CORRIDORS: {
  name: string;
  tags: string;
  regionArt: CorridorRegionVariant;
  alt: string;
  badge: string;
  img: Box;
  cap: Box;
}[] = [
  {
    name: 'North America ↔ LATAM',
    tags: 'USD · USDC · PIX & SPEI Instant',
    regionArt: 'corridor-na-latam',
    alt: 'New York, São Paulo, and Mexico City skyline connected by cross-hemisphere payment arcs',
    badge: '0.6s Settlement · PIX & SPEI',
    img: { x: 60, y: 278, w: 629, h: 440 },
    cap: { x: 64, y: 732, w: 625 },
  },
  {
    name: 'Europe ↔ APAC Treasury',
    tags: 'EURC · SGD · JPY · Multi-Chain',
    regionArt: 'corridor-eu-apac',
    alt: 'London Shard, Singapore Marina Bay Sands, and Tokyo Skytree financial skyline',
    badge: '24/7 Cross-Timezone Clearing',
    img: { x: 749, y: 361, w: 791, h: 554 },
    cap: { x: 766, y: 934, w: 774 },
  },
  {
    name: 'Global Stablecoin Clearing',
    tags: 'USDC · USDT · EURC · Zero Slippage',
    regionArt: 'corridor-global-clearing',
    alt: 'Zurich, Dubai Burj Khalifa, and Hong Kong Victoria Harbour high-rise skyline',
    badge: '1:1 Institutional Peg',
    img: { x: 105, y: 975, w: 584, h: 447 },
    cap: { x: 105, y: 1445, w: 584 },
  },
  {
    name: 'Cross-Border B2B Supply',
    tags: '180+ Countries · Invoice Finality',
    regionArt: 'corridor-b2b-supply',
    alt: 'Shanghai Pudong Oriental Pearl, Shanghai Tower, and Rotterdam harbor skyline',
    badge: 'Eliminates T+3 Wire Delays',
    img: { x: 870, y: 1154, w: 634, h: 447 },
    cap: { x: 895, y: 1643, w: 609 },
  },
  {
    name: '24/7 Crypto-to-Fiat Bridge',
    tags: 'BTC · ETH · SOL → Local Bank Rails',
    regionArt: 'corridor-crypto-bridge',
    alt: 'Miami Brickell, Seoul Lotte World Tower, and Taipei 101 skyline',
    badge: '0.08% Flat Institutional Fee',
    img: { x: 79, y: 1759, w: 791, h: 554 },
    cap: { x: 96, y: 2332, w: 774 },
  },
  {
    name: 'Embedded Marketplace Payouts',
    tags: 'Split Settlements · Global Creators',
    regionArt: 'corridor-marketplace',
    alt: 'Toronto CN Tower, San Francisco Transamerica Pyramid, and Sydney Harbour skyline',
    badge: 'Batch 50,000+ Recipients',
    img: { x: 944, y: 1786, w: 584, h: 447 },
    cap: { x: 944, y: 2256, w: 584 },
  },
];

function ArrowIcon() {
  return (
    <span className="block size-[24px] shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[6px] group-hover:-rotate-45">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="rotate-90"
        aria-hidden
      >
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
          <path d="M12.25 4V20" />
          <path d="M6.59 9.66C9.5 9.66 12.25 7.1 12.25 4" />
          <path d="M17.91 9.66C15 9.66 12.25 7.1 12.25 4" />
        </g>
      </svg>
    </span>
  );
}

function CorridorsHeading({ className = '' }: { className?: string }) {
  return (
    <h2
      className={`m-0 font-['Gilda_Display',serif] font-normal capitalize text-white ${className}`}
    >
      Corridors We’ve{' '}
      <span className="inline-block font-['Give_You_Glory',cursive] leading-[0.95] text-black">
        Unlocked.
      </span>
    </h2>
  );
}

function CorridorCaption({
  name,
  tags,
  small = false,
}: {
  name: string;
  tags: string;
  small?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-white">
      <div>
        <h3
          className={`m-0 inline-block bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat font-['Gilda_Display',serif] font-normal capitalize transition-[background-size] duration-500 group-hover:bg-[length:100%_1px] ${
            small
              ? 'text-[24px] leading-[30px] tracking-[-0.7px]'
              : 'text-[30px] leading-[35px] tracking-[-0.9px]'
          }`}
        >
          {name}
        </h3>
        <p className={`m-0 leading-[22px] ${small ? 'text-[14px]' : 'text-[16px]'}`}>
          {tags}
        </p>
      </div>
      <ArrowIcon />
    </div>
  );
}

function ProjectImage({
  regionArt,
  alt,
  badge,
  delay = 0,
}: {
  regionArt: CorridorRegionVariant;
  alt: string;
  badge: string;
  delay?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const artLayer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = wrap.current;
    const el = box.current;
    const im = artLayer.current;
    if (!outer || !el || !im || prefersReducedMotion()) return;

    const A = 9;
    const DURATION = 1.6;
    let p = 0;
    let raf = 0;
    let last = 0;
    let timer = 0;

    const apply = (now: number) => {
      if (p >= 1) {
        el.style.clipPath = 'none';
        im.style.transform = '';
        return;
      }
      const e = 1 - Math.pow(1 - p, 3);
      const level = e * (100 + 2 * A) - A;
      const amp = A * Math.sqrt(1 - e);
      const t = now / 1000;
      const pts: string[] = [];
      for (let i = 24; i >= 0; i--) {
        const x = i / 24;
        const y =
          level +
          amp *
            Math.sin(x * Math.PI * 3 + t * 4.5) *
            (0.6 + 0.4 * Math.sin(x * Math.PI + t * 1.7));
        pts.push(`${(x * 100).toFixed(2)}% ${y.toFixed(2)}%`);
      }
      el.style.clipPath = `polygon(0% 0%, 100% 0%, ${pts.join(',')})`;
      im.style.transform = `translateY(${-(1 - e) * 16}%) scale(${
        1 + 0.12 * (1 - e)
      })`;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      p = Math.min(1, p + dt / DURATION);
      apply(now);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    const hide = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      p = 0;
      apply(performance.now());
    };

    hide();
    const io = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer);
        if (entry.isIntersecting) {
          timer = window.setTimeout(() => {
            if (!raf) raf = requestAnimationFrame(tick);
          }, delay);
        } else {
          hide();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(outer);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [delay]);

  return (
    <div
      ref={wrap}
      aria-label={alt}
      className="relative size-full overflow-hidden rounded-[14px] bg-[#14243b]"
    >
      <div ref={box} className="relative size-full overflow-hidden">
        <div ref={artLayer} className="size-full">
          <CorridorRegionArt variant={regionArt} />
        </div>
        <div className="absolute left-[18px] top-[18px] rounded-full bg-white/88 px-[13px] py-[5px] text-[12px] font-medium text-[#261712] shadow-sm backdrop-blur-md">
          {badge}
        </div>
      </div>
    </div>
  );
}

function CorridorsDesktop({ onNavigate }: { onNavigate: (route: PageRoute) => void }) {
  return (
    <Artboard id="work" height={2492} className="bg-[#e83f20]">
      <Reveal className="flex justify-center" style={at(0, 100, 1600)}>
        <Badge dark square="#fefffe">
          Global Corridors
        </Badge>
      </Reveal>
      <Reveal delay={200} style={at(0, 138, 1600)}>
        <CorridorsHeading className="text-center text-[60px] leading-[74px] tracking-[-1.8px]" />
      </Reveal>

      {CORRIDORS.map((p, i) => {
        const left = Math.min(p.img.x, p.cap.x);
        const right = Math.max(p.img.x + p.img.w, p.cap.x + p.cap.w);
        const height = p.cap.y + 57 - p.img.y;
        return (
          <div key={p.name} style={at(left, p.img.y, right - left, height)}>
            <button
              type="button"
              onClick={() => onNavigate('corridors')}
              className="group absolute inset-0 block cursor-pointer border-0 bg-transparent p-0 text-left no-underline"
              aria-label={`${p.name} — ${p.tags}`}
            >
              <div
                className="overflow-hidden rounded-[14px]"
                style={at(p.img.x - left, 0, p.img.w, p.img.h)}
              >
                <div className="size-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
                  <ProjectImage
                    regionArt={p.regionArt}
                    alt={p.alt}
                    badge={p.badge}
                    delay={(i % 2) * 160}
                  />
                </div>
              </div>
              <Reveal
                delay={500 + (i % 2) * 160}
                style={at(p.cap.x - left, p.cap.y - p.img.y, p.cap.w)}
              >
                <CorridorCaption name={p.name} tags={p.tags} />
              </Reveal>
            </button>
          </div>
        );
      })}
    </Artboard>
  );
}

function CorridorsMobile({ onNavigate }: { onNavigate: (route: PageRoute) => void }) {
  return (
    <section id="work" className="bg-[#e83f20] px-[20px] py-[64px]">
      <Reveal className="flex justify-center">
        <Badge dark square="#fefffe">
          Global Corridors
        </Badge>
      </Reveal>
      <Reveal delay={200} className="mt-[14px]">
        <CorridorsHeading className="text-center text-[40px] leading-[48px] tracking-[-1.2px]" />
      </Reveal>
      <div className="mt-[36px] flex flex-col gap-[36px]">
        {CORRIDORS.map((p) => (
          <button
            type="button"
            key={p.name}
            onClick={() => onNavigate('corridors')}
            className="group block cursor-pointer border-0 bg-transparent p-0 text-left no-underline"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-[14px]">
              <ProjectImage
                regionArt={p.regionArt}
                alt={p.alt}
                badge={p.badge}
              />
            </div>
            <Reveal delay={450} className="mt-[12px]">
              <CorridorCaption name={p.name} tags={p.tags} small />
            </Reveal>
          </button>
        ))}
      </div>
    </section>
  );
}

function CorridorsSection({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  return (
    <Responsive
      desktop={<CorridorsDesktop onNavigate={onNavigate} />}
      mobile={<CorridorsMobile onNavigate={onNavigate} />}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Section 05: Case Studies ("From Latency To Liquidity.")
// ─────────────────────────────────────────────────────────────

const DEPLOYMENTS: {
  client: string;
  logo: LogoName;
  metric: string;
  project: string;
  year: string;
  art: PaymentArtVariant;
  summary: string;
  before: string;
  after: string;
}[] = [
  {
    client: 'Fernlight Global',
    logo: 'fernlight',
    metric: '0.42s Settlement',
    project: 'Multi-Currency Stablecoin Treasury (USDC/EURC)',
    year: '2026',
    art: 'deploy-fernlight',
    summary:
      'Replaced 14 regional correspondent bank accounts with a unified USDC/EURC liquidity hub orchestrated via Neth3 ISO 20022 webhooks.',
    before: 'T+3 SWIFT wires · 2.4% FX drag',
    after: '0.42s finality · 0.08% flat spread',
  },
  {
    client: 'Northbeam FX',
    logo: 'northbeam',
    metric: '$1.4B Cleared',
    project: '24/7 BTC & ETH Liquidity Bridge (Institutional)',
    year: '2025',
    art: 'deploy-northbeam',
    summary:
      'Enabled weekend and after-hours institutional BTC and ETH settlement directly into SGD, EUR, and USD clearing accounts with zero counterparty lockup.',
    before: 'Monday morning market gap risk',
    after: '24/7/365 atomic PvP clearing',
  },
  {
    client: 'Kitewise Markets',
    logo: 'kitewise',
    metric: '0% Chargebacks',
    project: 'Global Crypto Merchant Checkout (E-Commerce)',
    year: '2025',
    art: 'deploy-kitewise',
    summary:
      'Embedded Neth3 Checkout across 62 storefronts, letting buyers pay in BTC, ETH, SOL, or USDT while merchants receive guaranteed local fiat.',
    before: '1.8% chargeback rate on cross-border cards',
    after: '0.0% reversals · +38% international conversion',
  },
  {
    client: 'Tessera Commerce',
    logo: 'tessera',
    metric: '140+ Local Rails',
    project: 'Instant Creator & Vendor Payouts (Marketplace)',
    year: '2024',
    art: 'deploy-tessera',
    summary:
      'Automated batch payouts to 48,000 global suppliers in PIX, SPEI, SEPA Instant, or USDC via a single idempotent API call.',
    before: '5-day batch reconciliation cycles',
    after: 'Sub-2-second programmable disbursements',
  },
  {
    client: 'Ordinal Treasury',
    logo: 'ordinal',
    metric: '-78% FX Cost',
    project: 'Programmable Cross-Border Escrow (B2B Trade)',
    year: '2024',
    art: 'deploy-ordinal',
    summary:
      'Deployed multi-sig stablecoin escrow triggered automatically upon customs and bill-of-lading oracle confirmation.',
    before: 'Expensive letters of credit ($1,200/tx)',
    after: 'Automated on-chain release in 1.4s',
  },
  {
    client: 'Quillio Remit',
    logo: 'quillio',
    metric: '1.1s LATAM Payout',
    project: 'US-to-Mexico & Brazil Stablecoin Corridor (Fintech)',
    year: '2023',
    art: 'deploy-quillio',
    summary:
      'Connected US FedNow inflows directly into USDC liquidity pools and local SPEI/PIX off-ramps with real-time KYT screening.',
    before: '4.6% consumer remittance fee',
    after: '0.35% all-in consumer cost · 1.1s delivery',
  },
];

function CaseStudiesHeading({ className = '' }: { className?: string }) {
  return (
    <h2
      className={`m-0 font-['Gilda_Display',serif] font-normal capitalize text-white ${className}`}
    >
      From Latency To{' '}
      <span className="inline-block font-['Give_You_Glory',cursive] leading-[0.95]">
        Liquidity.
      </span>
    </h2>
  );
}

function ClientMark({ name, logo }: { name: string; logo: LogoName }) {
  return (
    <div className="flex items-center gap-[9px] text-white">
      <LogoIcon name={logo} size={24} />
      <span className="font-['Onest',sans-serif] text-[20px] font-medium leading-[24px] tracking-[-0.2px]">
        {name}
      </span>
    </div>
  );
}

const rowBase =
  'group block rounded-[20px] border border-solid border-[#543732] bg-[#0e0300] text-white no-underline transition-[border-color,background-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#e83e20] hover:bg-[#1d0806]';

function HoverPreview({
  art,
  alt,
  active,
  x,
  tilt,
}: {
  art: PaymentArtVariant;
  alt: string;
  active: boolean;
  x: number;
  tilt: number;
}) {
  return (
    <div
      aria-label={alt}
      className="pointer-events-none absolute top-1/2 z-10 h-[166px] w-[158px] overflow-hidden rounded-[14px] border border-white/25 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.85)]"
      style={{
        left: 0,
        transform: `translate(${x - 79}px, -50%) rotate(${
          active ? tilt : 0
        }deg) scale(${active ? 1 : 0.4})`,
        opacity: active ? 1 : 0,
        transition:
          'transform 650ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease, clip-path 600ms cubic-bezier(0.16,1,0.3,1)',
        clipPath: active
          ? 'inset(0% 0% 0% 0% round 14px)'
          : 'inset(50% 50% 50% 50% round 14px)',
      }}
    >
      <AbstractPaymentArt variant={art} compact />
    </div>
  );
}

function CaseStudiesDesktop({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  const [hover, setHover] = useState(-1);
  const [px, setPx] = useState(0);
  const [tilt, setTilt] = useState(0);
  const lastX = useRef(0);
  const settle = useRef(0);

  const track = (
    e: { clientX: number; currentTarget: HTMLElement },
    i: number,
  ) => {
    const b = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - b.left) / b.width) * 1440;
    setTilt(Math.max(-8, Math.min(8, (x - lastX.current) * 0.4)));
    lastX.current = x;
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => setTilt(0), 140);
    setPx(Math.max(85, Math.min(1440 - 85, x)));
    if (hover !== i) setHover(i);
  };

  const list = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (reduce) {
      setOpen(true);
      return;
    }
    const el = list.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setOpen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => setOpen(e.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const ease = 'cubic-bezier(0.16,1,0.3,1)';

  return (
    <Artboard id="case-study" height={1218} className="bg-[#0e0300]">
      <Reveal className="flex justify-center" style={at(0, 80, 1600)}>
        <Badge dark>Case Studies</Badge>
      </Reveal>
      <Reveal delay={200} style={at(0, 118, 1600)}>
        <CaseStudiesHeading className="text-center text-[60px] leading-[74px] tracking-[-1.8px]" />
      </Reveal>

      <div
        ref={list}
        className="pointer-events-none"
        style={at(80, 258, 1440, 880)}
      />
      {DEPLOYMENTS.map((c, i) => (
        <div
          key={c.client}
          style={{
            ...at(80, 258 + i * 150, 1440, 130),
            zIndex: hover === i ? 20 : DEPLOYMENTS.length - i,
            transform: open
              ? 'none'
              : `translateY(${-i * 150 + i * 8}px) scale(${1 - i * 0.02})`,
            opacity: open || i < 3 ? 1 : 0,
            transition: open
              ? `transform 900ms ${ease} ${200 + i * 160}ms, opacity 300ms ease ${
                  200 + i * 160
                }ms`
              : `transform 500ms ${ease}, opacity 300ms ease`,
          }}
        >
          <button
            type="button"
            onClick={() => onNavigate('case-studies')}
            className={`${rowBase} relative h-full w-full cursor-pointer text-left`}
            onMouseEnter={(e) => track(e, i)}
            onMouseMove={(e) => track(e, i)}
            onMouseLeave={() => setHover(-1)}
          >
            <HoverPreview
              art={c.art}
              alt={`${c.client} deployment`}
              active={hover === i}
              x={px}
              tilt={tilt}
            />
            <div className="absolute left-[49px] top-[52px] h-[24px] w-[220px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[8px]">
              <ClientMark name={c.client} logo={c.logo} />
            </div>
            <p className="absolute left-[534px] top-[52px] m-0 -translate-x-1/2 whitespace-nowrap font-['Gilda_Display',serif] text-[20px] capitalize leading-[24px] tracking-[-0.6px] transition-colors duration-300 group-hover:text-[#e83e20]">
              {c.metric}
            </p>
            <p className="absolute left-[981.5px] top-[52px] m-0 -translate-x-1/2 whitespace-nowrap text-[18px] capitalize leading-[24px]">
              {c.project}
            </p>
            <p className="absolute left-[1364.5px] top-[52px] m-0 -translate-x-1/2 whitespace-nowrap text-[18px] leading-[24px]">
              / {c.year}
            </p>
          </button>
        </div>
      ))}
    </Artboard>
  );
}

function CaseStudiesMobile({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  return (
    <section id="case-study" className="bg-[#0e0300] px-[20px] py-[64px]">
      <Reveal className="flex justify-center">
        <Badge dark>Case Studies</Badge>
      </Reveal>
      <Reveal delay={200} className="mt-[14px]">
        <CaseStudiesHeading className="text-center text-[40px] leading-[48px] tracking-[-1.2px]" />
      </Reveal>
      <div className="mt-[32px] flex flex-col gap-[12px]">
        {DEPLOYMENTS.map((c, i) => (
          <Reveal key={c.client} delay={i * 60}>
            <button
              type="button"
              onClick={() => onNavigate('case-studies')}
              className={`${rowBase} w-full cursor-pointer p-[20px] text-left`}
            >
              <div className="flex items-center justify-between">
                <ClientMark name={c.client} logo={c.logo} />
                <span className="text-[16px] leading-[24px]">/ {c.year}</span>
              </div>
              <div className="mt-[14px] aspect-[285/322] w-[120px] overflow-hidden rounded-[12px] border border-white/15">
                <AbstractPaymentArt variant={c.art} compact />
              </div>
              <p className="m-0 mt-[14px] font-['Gilda_Display',serif] text-[22px] capitalize leading-[28px] group-hover:text-[#e83e20]">
                {c.metric}
              </p>
              <p className="m-0 mt-[4px] text-[15px] leading-[22px] text-white/80">
                {c.project}
              </p>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CaseStudiesSection({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  return (
    <Responsive
      desktop={<CaseStudiesDesktop onNavigate={onNavigate} />}
      mobile={<CaseStudiesMobile onNavigate={onNavigate} />}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Section 06: Settlement Process ("How Neth3 Moves Money Globally.")
// ─────────────────────────────────────────────────────────────

type StepIcon = 'connect' | 'route' | 'settle' | 'reconcile';

const STEPS: {
  no: string;
  title: string;
  icon: StepIcon;
  x: number;
  text: string;
}[] = [
  {
    no: '01',
    title: 'Connect',
    icon: 'connect',
    x: 80,
    text: 'Integrate a single REST API or hosted checkout widget to accept local bank transfers, cards, stablecoins (USDC/USDT), and major crypto assets.',
  },
  {
    no: '02',
    title: 'Route',
    icon: 'route',
    x: 442,
    text: 'Neth3’s liquidity engine automatically selects the fastest, lowest-cost path across 180+ domestic payment rails and Layer-1/Layer-2 blockchains.',
  },
  {
    no: '03',
    title: 'Settle',
    icon: 'settle',
    x: 805,
    text: 'Funds convert and clear atomically in under 1.8 seconds with real-time KYT screening, zero FX slippage, and 24/7/365 weekend availability.',
  },
  {
    no: '04',
    title: 'Reconcile',
    icon: 'reconcile',
    x: 1167,
    text: 'Every transaction emits signed webhooks, cryptographic proofs, and ISO 20022 ledger entries for automated multi-currency treasury accounting.',
  },
];

const DEFAULT_ACTIVE = 2;

function StepIconSvg({ name }: { name: StepIcon }) {
  return (
    <svg
      viewBox="0 0 116 116"
      className="block h-full w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {name === 'connect' && (
        <>
          <path d="M14.5 40.93V33.31C14.5 22.92 22.92 14.5 33.32 14.5H39.55" />
          <path d="M14.5 75.07V82.69C14.5 93.08 22.92 101.5 33.32 101.5H39.39" />
          <path d="M101.5 75.07V82.69C101.5 93.08 93.08 101.5 82.69 101.5H76.46" />
          <path d="M101.5 40.93V33.31C101.5 22.92 93.08 14.5 82.68 14.5H76.61" />
          <circle cx="58" cy="58" r="18" />
          <path d="M46 58h24M58 46v24" />
        </>
      )}
      {name === 'route' && (
        <>
          <circle cx="32" cy="34" r="10" />
          <circle cx="84" cy="82" r="10" />
          <circle cx="84" cy="34" r="10" />
          <path d="M42 34h32M39 41l38 34M84 44v28" />
        </>
      )}
      {name === 'settle' && (
        <>
          <path d="M79.77 20.27V30.46C79.77 34.01 82.28 36.23 85.84 36.23H95.43C98.98 36.23 101.5 34.02 101.5 30.46V20.27C101.5 16.71 98.98 14.5 95.43 14.5H85.84C82.28 14.5 79.77 16.71 79.77 20.27Z" />
          <path d="M14.5 20.27V30.46C14.5 34.01 17.01 36.23 20.57 36.23H30.16C33.72 36.23 36.23 34.02 36.23 30.46V20.27C36.23 16.71 33.72 14.5 30.16 14.5H20.57C17.01 14.5 14.5 16.71 14.5 20.27Z" />
          <path d="M79.77 85.54V95.72C79.77 99.27 82.28 101.5 85.84 101.5H95.43C98.98 101.5 101.5 99.28 101.5 95.72V85.54C101.5 81.98 98.98 79.76 95.43 79.76H85.84C82.28 79.76 79.77 81.98 79.77 85.54Z" />
          <path d="M14.5 85.54V95.72C14.5 99.27 17.01 101.5 20.57 101.5H30.16C33.72 101.5 36.23 99.28 36.23 95.72V85.54C36.23 81.98 33.72 79.76 30.16 79.76H20.57C17.01 79.76 14.5 81.98 14.5 85.54Z" />
          <path d="M36.34 25.28H79.8M36.34 90.63H79.8M25.54 36.23V79.76M90.63 36.23V79.76" />
          <path d="M47 59l8 8 16-18" />
        </>
      )}
      {name === 'reconcile' && (
        <>
          <rect x="24" y="18" width="68" height="80" rx="10" />
          <path d="M40 42h36M40 58h36M40 74h22" />
          <circle cx="76" cy="74" r="6" />
        </>
      )}
    </svg>
  );
}

function ProcessHeading({ className = '' }: { className?: string }) {
  return (
    <h2
      className={`m-0 font-['Gilda_Display',serif] font-normal capitalize text-[#302d2c] ${className}`}
    >
      How Neth3 Moves{' '}
      <span className="inline-block font-['Give_You_Glory',cursive] leading-[0.95] text-[#e83f20]">
        Money
      </span>{' '}
      Globally.
    </h2>
  );
}

function StepCard({
  step,
  active,
  onActivate,
  small = false,
}: {
  step: (typeof STEPS)[number];
  active: boolean;
  onActivate: () => void;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      aria-pressed={active}
      className={`relative block h-full w-full cursor-pointer overflow-hidden border-0 p-0 text-left transition-[background-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        small ? 'rounded-[14px]' : 'rounded-[16px]'
      } ${
        active
          ? 'bg-[#e83f20] text-white'
          : 'bg-white text-[#302d2c] hover:-translate-y-[4px]'
      }`}
    >
      <span
        className={`absolute font-['Inter_Tight',sans-serif] capitalize ${
          small
            ? 'left-[16px] top-[14px] text-[16px] leading-[20px]'
            : 'left-[30px] top-[30px] text-[20px] leading-[25px]'
        }`}
      >
        {step.no}
      </span>
      <span
        className={`absolute left-1/2 -translate-x-1/2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          active ? 'scale-[1.06]' : ''
        } ${
          small
            ? 'top-[34px] h-[70px] w-[70px]'
            : 'top-[67px] h-[116px] w-[116px]'
        }`}
      >
        <StepIconSvg name={step.icon} />
      </span>
      <span
        className={`absolute left-0 w-full text-center font-['Gilda_Display',serif] capitalize transition-colors duration-500 ${
          active ? 'text-white' : 'text-[#4e4e4e]'
        } ${
          small
            ? 'top-[118px] text-[24px] leading-[28px]'
            : 'top-[233px] text-[40px] leading-[40px] tracking-[-1.2px]'
        }`}
      >
        {step.title}
      </span>
    </button>
  );
}

function StepText({
  active,
  className = '',
}: {
  active: number;
  className?: string;
}) {
  return (
    <div className={`grid ${className}`} aria-live="polite">
      {STEPS.map((s, i) => (
        <p
          key={s.no}
          className="m-0 transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [grid-area:1/1]"
          style={{
            opacity: i === active ? 1 : 0,
            transform: i === active ? 'none' : 'translateY(14px)',
            filter: i === active ? 'none' : 'blur(6px)',
          }}
          aria-hidden={i !== active}
        >
          {s.text}
        </p>
      ))}
    </div>
  );
}

function ProcessDesktop() {
  const [active, setActive] = useState(DEFAULT_ACTIVE);
  const row = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (reduce) {
      setOpen(true);
      return;
    }
    const el = row.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setOpen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => setOpen(e.isIntersecting),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const ease = 'cubic-bezier(0.16,1,0.3,1)';

  return (
    <Artboard id="process" height={753} className="bg-[#efded0]">
      <Reveal className="flex justify-center" style={at(0, 80, 1600)}>
        <Badge>Settlement Flow</Badge>
      </Reveal>
      <Reveal delay={200} style={at(0, 118, 1600)}>
        <ProcessHeading className="text-center text-[60px] leading-[74px] tracking-[-1.8px]" />
      </Reveal>
      <div
        ref={row}
        className="pointer-events-none"
        style={at(80, 238, 1440, 316)}
      />
      {STEPS.map((s, i) => (
        <div
          key={s.no}
          style={{
            ...at(s.x, 238, 353, 316),
            zIndex: STEPS.length - i,
            transform: open
              ? 'none'
              : `translateX(${STEPS[0].x - s.x + i * 10}px) scale(${1 - i * 0.03})`,
            transition: open
              ? `transform 900ms ${ease} ${200 + i * 180}ms`
              : `transform 500ms ${ease}`,
          }}
        >
          <StepCard
            step={s}
            active={active === i}
            onActivate={() => setActive(i)}
          />
        </div>
      ))}
      <Reveal delay={300} style={at(480, 594, 640)}>
        <StepText
          active={active}
          className="text-center text-[20px] leading-[30px] text-[#595859]"
        />
      </Reveal>
    </Artboard>
  );
}

function ProcessMobile() {
  const [active, setActive] = useState(DEFAULT_ACTIVE);
  return (
    <section id="process" className="bg-[#efded0] px-[20px] py-[64px]">
      <Reveal className="flex justify-center">
        <Badge>Settlement Flow</Badge>
      </Reveal>
      <Reveal delay={200} className="mt-[14px]">
        <ProcessHeading className="text-center text-[38px] leading-[46px] tracking-[-1.1px]" />
      </Reveal>
      <div className="mt-[32px] grid grid-cols-2 gap-[10px]">
        {STEPS.map((s, i) => (
          <Reveal key={s.no} delay={i * 80} className="h-[164px]">
            <StepCard
              step={s}
              active={active === i}
              onActivate={() => setActive(i)}
              small
            />
          </Reveal>
        ))}
      </div>
      <StepText
        active={active}
        className="mt-[24px] text-center text-[17px] leading-[26px] text-[#595859]"
      />
    </section>
  );
}

function ProcessSection() {
  return (
    <Responsive
      desktop={<ProcessDesktop />}
      mobile={<ProcessMobile />}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Section 07: Testimonials ("Trusted By Global Builders.")
// ─────────────────────────────────────────────────────────────

type TestimonialRegion = 'East Asia' | 'ASEAN';

const TESTIMONIALS: {
  quote: string;
  name: string;
  nativeName?: string;
  role: string;
  region: TestimonialRegion;
  corridor: string;
  photo: string;
}[] = [
  {
    quote:
      '“Neth3 connected our Singapore FAST, PayNow, and MAS-regulated stablecoin pools into regional ASEAN and global rails in under two weeks. Settlement finality dropped from T+2 to 0.7 seconds.”',
    name: 'Mei-Ling Chen',
    nativeName: '陳美玲',
    role: 'CEO, StraitPay Pte. Ltd. (Singapore)',
    region: 'ASEAN',
    corridor: 'SGD · PayNow · USDC → SEA & Global',
    photo: AVATAR_PHOTOS[0],
  },
  {
    quote:
      '“Settling cross-border JPY, USDC, and BTC liquidity 24/7 over weekends eliminated our Monday FX gap exposure while cutting treasury spread to 0.08% flat.”',
    name: 'Kenji Takahashi',
    nativeName: '高橋 健司',
    role: 'Managing Director, SakuraPay Co., Ltd. (Tokyo)',
    region: 'East Asia',
    corridor: 'JPY · Zengin · BTC → USD / EURC',
    photo: AVATAR_PHOTOS[1],
  },
  {
    quote:
      '“Linking Thailand PromptPay and Malaysia DuitNow with instant USDT and USDC liquidity enabled our Southeast Asian merchants to settle cross-border payouts in 0.9 seconds.”',
    name: 'Thanakorn Wongsuwan',
    nativeName: 'ธนากร วงศ์สุวรรณ',
    role: 'COO, SiamBridge Pay Co., Ltd. (Bangkok)',
    region: 'ASEAN',
    corridor: 'THB · PromptPay · DuitNow → USDT',
    photo: AVATAR_PHOTOS[2],
  },
  {
    quote:
      '“With Neth3’s multi-crypto checkout and instant local fiat settlement, our cross-border gaming and commerce merchants lifted international conversion by 41%.”',
    name: 'Seo-yeon Park',
    nativeName: '박서연',
    role: 'VP of Global Clearing, HanRiver Pay Ltd. (Seoul)',
    region: 'East Asia',
    corridor: 'KRW · KFTC · ETH / SOL → Global Fiat',
    photo: AVATAR_PHOTOS[3],
  },
  {
    quote:
      '“Disbursing real-time supplier and creator settlements across Vietnam NAPAS 247, Singapore, and Hong Kong in local currency or USDC takes a single idempotent API call now.”',
    name: 'Minh-Anh Nguyen',
    nativeName: 'Nguyễn Minh Anh · 阮明英',
    role: 'Head of Treasury, MekongPay Vietnam Co., Ltd. (Ho Chi Minh City)',
    region: 'ASEAN',
    corridor: 'VND · NAPAS 247 · USDC → Global Rails',
    photo: AVATAR_PHOTOS[4],
  },
];

const TESTIMONIALS_LEAD =
  'Hear from East Asian and Southeast Asian payment companies, licensed Pay Ltd. institutions, and treasuries settling on Neth3.';

function TestimonialsHeading({ className = '' }: { className?: string }) {
  return (
    <h2
      className={`m-0 font-['Gilda_Display',serif] font-normal capitalize text-[#302d2c] ${className}`}
    >
      Trusted By Global{' '}
      <span className="inline-block font-['Give_You_Glory',cursive] leading-[0.95] text-[#e83f20]">
        Builders.
      </span>
    </h2>
  );
}

function Stars() {
  return (
    <div className="flex items-center gap-[3px]" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="19.12"
          height="18"
          viewBox="0 0 19.1243 18"
          aria-hidden
        >
          <path
            d="M18.105 7.12H11.58L9.565 1.02L7.543 7.12L1.019 7.113L6.303 10.887L4.282 16.981L9.565 13.213L14.843 16.981L12.828 10.887L18.105 7.12Z"
            fill="#04DA8C"
          />
          <path
            d="M13.281 12.267L12.827 10.888L9.565 13.214L13.281 12.267Z"
            fill="#136848"
          />
        </svg>
      ))}
    </div>
  );
}

function Person({
  name,
  nativeName,
  role,
}: {
  name: string;
  nativeName?: string;
  role: string;
}) {
  return (
    <div className="text-[#0f2a2b]">
      <div className="flex flex-wrap items-baseline gap-[8px]">
        <p className="m-0 font-['Instrument_Serif',serif] text-[24px] leading-[30px]">
          {name}
        </p>
        {nativeName && (
          <span className="rounded-[6px] bg-[#feebe6] px-[8px] py-[1px] text-[13px] font-medium text-[#e83f20]">
            {nativeName}
          </span>
        )}
      </div>
      <p className="m-0 mt-[2px] font-['KoHo',sans-serif] text-[15px] leading-[21px] text-[#302d2c]">
        {role}
      </p>
    </div>
  );
}

function TestimonialCardDesktop({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <figure className="group relative m-0 h-[343px] w-[651px] shrink-0 overflow-hidden rounded-[20px] bg-white">
      <div className="absolute left-0 top-0 h-[343px] w-[301px] overflow-hidden bg-[#1e293b]">
        <img
          src={t.photo}
          alt={t.name}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://placehold.co/301x343/1e293b/f8fafc?text=' +
              encodeURIComponent(t.name);
          }}
          className="h-full w-full object-cover object-[50%_25%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
      </div>
      <blockquote className="absolute left-[321px] top-[24px] m-0 w-[296px] font-['KoHo',sans-serif] text-[16px] leading-[22px] text-[#0f2a2b]">
        {t.quote}
      </blockquote>
      <figcaption className="absolute left-[321px] top-[206px] flex w-[308px] flex-col gap-[10px]">
        <Stars />
        <Person name={t.name} nativeName={t.nativeName} role={t.role} />
      </figcaption>
    </figure>
  );
}

function TestimonialCardMobile({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <figure className="m-0 flex w-[290px] shrink-0 flex-col overflow-hidden rounded-[18px] bg-white">
      <div className="flex flex-1 flex-col gap-[16px] p-[18px]">
        <blockquote className="m-0 font-['KoHo',sans-serif] text-[15px] leading-[21px] text-[#0f2a2b]">
          {t.quote}
        </blockquote>
        <figcaption className="mt-auto flex flex-col gap-[10px]">
          <Stars />
          <Person name={t.name} nativeName={t.nativeName} role={t.role} />
        </figcaption>
      </div>
      <img
        src={t.photo}
        alt={t.name}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            'https://placehold.co/290x220/1e293b/f8fafc?text=' +
            encodeURIComponent(t.name);
        }}
        className="block h-[220px] w-full object-cover object-[50%_25%]"
      />
    </figure>
  );
}

function TestimonialsDesktop() {
  return (
    <Artboard id="testimonials" height={770} className="bg-[#efded1]">
      <Reveal style={at(80, 78)}>
        <Badge>Testimonials</Badge>
      </Reveal>
      <Reveal delay={200} style={at(80, 122, 620)}>
        <TestimonialsHeading className="text-[60px] leading-[74px] tracking-[-1.8px]" />
      </Reveal>
      <Reveal delay={300} style={at(1150, 180, 370)}>
        <p className="m-0 text-[20px] leading-[30px] text-[#585859]">
          {TESTIMONIALS_LEAD}
        </p>
      </Reveal>
      <Reveal delay={200} style={at(0, 330, 1600, 343)}>
        <Marquee offset={-139} gap={20} duration={70} copies={2}>
          {TESTIMONIALS.map((t) => (
            <TestimonialCardDesktop key={t.name} t={t} />
          ))}
        </Marquee>
      </Reveal>
    </Artboard>
  );
}

function TestimonialsMobile() {
  return (
    <section id="testimonials" className="bg-[#efded1] py-[64px]">
      <div className="px-[20px]">
        <Reveal>
          <Badge>Testimonials</Badge>
        </Reveal>
        <Reveal delay={200} className="mt-[14px]">
          <TestimonialsHeading className="text-[40px] leading-[48px] tracking-[-1.2px]" />
        </Reveal>
        <Reveal delay={300} className="mt-[14px]">
          <p className="m-0 text-[17px] leading-[26px] text-[#585859]">
            {TESTIMONIALS_LEAD}
          </p>
        </Reveal>
      </div>
      <Marquee className="mt-[32px]" gap={14} duration={40} copies={3}>
        {TESTIMONIALS.map((t) => (
          <TestimonialCardMobile key={t.name} t={t} />
        ))}
      </Marquee>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <Responsive
      desktop={<TestimonialsDesktop />}
      mobile={<TestimonialsMobile />}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Section 08: CTA + Sparse Context-Colored 3D WebGL Coin Dome
// ─────────────────────────────────────────────────────────────

const BALL = {
  W: 1600,
  H: 830,
  fov: 50,
  radius: 760,
  center: [0, -770, 300] as [number, number, number],
  tilt: [0.5, 0, 0.32] as [number, number, number],
  bead: 34,
  along: 2.55,
  ringGap: 6.2,
  spin: 0.06,
  hoverRadius: 240,
  hoverLift: 46,
  waveHeight: 20,
  waveLength: 250,
};

function createCoinBall(THREE: any, canvas: HTMLCanvasElement): RopeController {
  const P = BALL;
  const { W, H } = P;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const fov = P.fov;
  const D = H / 2 / Math.tan(((fov / 2) * Math.PI) / 180);
  const camera = new THREE.PerspectiveCamera(fov, W / H, 10, 8000);
  camera.position.set(0, 0, D);

  scene.add(new THREE.HemisphereLight('#fff4e8', '#3c150e', 0.95));
  const key = new THREE.DirectionalLight('#fff2df', 1.45);
  key.position.set(-200, 1000, 550);
  scene.add(key);

  const r = P.bead;
  const C = new THREE.Vector3(...P.center);
  const tiltQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(...P.tilt));

  type Bead = { phi: number; theta0: number; id: number };
  const list: Bead[] = [];
  const Rs = P.radius;
  const rings = Math.floor((Math.PI * Rs) / (P.ringGap * r));
  for (let j = 0; j < rings; j++) {
    const phi = ((j + 0.5) / rings) * Math.PI;
    const rho = Rs * Math.sin(phi);
    const n = Math.max(1, Math.floor((2 * Math.PI * rho) / (2 * r * P.along)));
    const off = j * 0.618 * 2 * Math.PI;
    for (let i = 0; i < n; i++) {
      list.push({ phi, theta0: off + (2 * Math.PI * i) / n, id: list.length });
    }
  }

  const count = list.length;
  const rand = (i: number) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const { map, bumpMap } = createCoinAtlas(THREE);
  const edgeMat = new THREE.MeshStandardMaterial({
    color: '#d4af37',
    roughness: 0.35,
    metalness: 0.45,
  });

  const coinGeos: any[] = [];
  const coinMats: any[] = [];
  for (let t = 0; t < TOKEN_COIN_SPECS.length; t++) {
    const g = new THREE.CylinderGeometry(r, r, r * 0.3, 32, 1);
    g.rotateX(Math.PI / 2);
    applyAtlasTileUV(g, t);
    coinGeos.push(g);

    const faceMat = new THREE.MeshStandardMaterial({
      map,
      bumpMap,
      bumpScale: 1.4,
      roughness: 0.34,
      metalness: 0.22,
    });
    coinMats.push([edgeMat, faceMat, faceMat]);
  }

  const group = new THREE.Group();
  scene.add(group);
  const meshes: any[] = [];
  for (let k = 0; k < count; k++) {
    const tile = k % TOKEN_COIN_SPECS.length;
    const m = new THREE.Mesh(coinGeos[tile], coinMats[tile]);
    group.add(m);
    meshes.push(m);
  }

  const INTRO = { maxDelay: 0.6, flight: 1.9 };
  const INTRO_END = INTRO.maxDelay + INTRO.flight;
  const easeOut = (x: number) => 1 - Math.pow(1 - x, 4);

  const hp = new THREE.Vector3();
  const hpTarget = new THREE.Vector3();
  const ray = new THREE.Ray();
  let hoverOn = false;
  let hoverAmt = 0;
  let hoverVel = 0;
  let lastT = 0;
  let residual = 0;
  const off = new Float32Array(count * 4);
  const kWave = (2 * Math.PI) / P.waveLength;

  const loc = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const faceDir = new THREE.Vector3();
  const upAxis = new THREE.Vector3(0, 0, 1);

  function layout(time: number, intro: number) {
    const flying = intro < INTRO_END;
    const now = performance.now() / 1000;
    const dt = lastT ? Math.min(0.05, now - lastT) : 0;
    lastT = now;

    const goal = hoverOn && !flying ? 1 : 0;
    hoverVel += (25 * (goal - hoverAmt) - 10 * hoverVel) * dt;
    hoverAmt = Math.min(1, Math.max(0, hoverAmt + hoverVel * dt));
    const amt = hoverAmt * hoverAmt * (3 - 2 * hoverAmt);

    hp.lerp(hpTarget, 1 - Math.exp(-dt * 4.5));
    const follow = 1 - Math.exp(-dt * 7);
    const waving =
      hoverAmt > 0.002 || Math.abs(hoverVel) > 0.001 || residual > 0.02;

    let maxOff = 0;
    const spin = time * P.spin;

    for (let k = 0; k < count; k++) {
      const b = list[k];
      const th = b.theta0 + spin;
      const sp = Math.sin(b.phi);
      loc.set(sp * Math.cos(th), Math.cos(b.phi), sp * Math.sin(th));
      dir.copy(loc).applyQuaternion(tiltQ);

      let x = C.x + dir.x * Rs;
      let y = C.y + dir.y * Rs;
      let z = C.z + dir.z * Rs;
      let scale = 1 + (rand(b.id * 3.17 + 9.4) - 0.5) * 0.06;

      const hidden = y < -H / 2 - 3 * r || dir.z < -0.25;

      if (flying) {
        const delay = rand(b.id * 1.73 + 0.31) * INTRO.maxDelay;
        const e = easeOut(
          Math.min(1, Math.max(0, (intro - delay) / INTRO.flight)),
        );
        const ang = rand(b.id * 2.91 + 5.7) * Math.PI * 2;
        const dist = (700 + rand(b.id * 4.13 + 1.9) * 900) * (1 - e);
        const sw = (1 - e) * 1.6;
        x += Math.cos(ang + sw) * dist;
        y -= Math.abs(Math.sin(ang + sw)) * dist * 0.6;
        z -= rand(b.id * 6.07 + 2.2) * 1400 * (1 - e);
        scale *= 0.3 + 0.7 * e * e;
      }

      const o4 = k * 4;
      if (waving) {
        const d = Math.hypot(x - hp.x, y - hp.y);
        const near = Math.exp(-((d / P.hoverRadius) ** 2));
        const ripple = Math.sin(d * kWave - now * 3.2);
        const bob = Math.sin(now * 1.8 + rand(b.id * 5.3 + 0.7) * 6.28);
        const lift =
          amt * near * (P.hoverLift + P.waveHeight * ripple + 5 * bob);

        off[o4] += (dir.x * lift - off[o4]) * follow;
        off[o4 + 1] +=
          (dir.y * lift + amt * near * 12 - off[o4 + 1]) * follow;
        off[o4 + 2] += (dir.z * lift - off[o4 + 2]) * follow;
        off[o4 + 3] +=
          (amt * near * (0.1 + 0.04 * ripple) - off[o4 + 3]) * follow;
        maxOff = Math.max(maxOff, Math.abs(off[o4 + 1]), Math.abs(off[o4 + 2]));
      } else if (off[o4 + 1] !== 0) {
        off[o4] = 0;
        off[o4 + 1] = 0;
        off[o4 + 2] = 0;
        off[o4 + 3] = 0;
      }

      x += off[o4];
      y += off[o4 + 1];
      z += off[o4 + 2];
      scale *= 1 + off[o4 + 3];
      if (hidden) scale = 0;

      const mesh = meshes[k];
      mesh.position.set(x, y, z);
      mesh.scale.setScalar(scale);

      faceDir
        .set(dir.x * 0.45, Math.max(0.15, dir.y * 0.45), 1)
        .normalize();
      mesh.quaternion.setFromUnitVectors(upAxis, faceDir);
    }

    residual = maxOff;
  }

  let mx = 0;
  let my = 0;
  let tx = 0;
  let ty = 0;

  function render(time: number, intro: number) {
    layout(time, intro);
    mx += (tx - mx) * 0.06;
    my += (ty - my) * 0.06;
    camera.position.set(mx * 40, -my * 24, D);
    camera.lookAt(mx * 10, -my * 6, 0);
    renderer.render(scene, camera);
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    const onScreen = canvas.getBoundingClientRect().width / w || 1;
    renderer.setPixelRatio(
      Math.min(2, (window.devicePixelRatio || 1) * Math.min(1, onScreen)),
    );
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const fitH = Math.max(H, W / camera.aspect);
    camera.fov = (2 * Math.atan(fitH / 2 / D) * 180) / Math.PI;
    camera.updateProjectionMatrix();
  }

  resize();

  return {
    render,
    resize,
    pointer: (x: number, y: number) => {
      tx = x;
      ty = y;
    },
    hover: (nx: number, ny: number, inside: boolean) => {
      if (!inside) {
        hoverOn = false;
        return;
      }
      ray.origin.copy(camera.position);
      ray.direction
        .set(nx, ny, 0.5)
        .unproject(camera)
        .sub(camera.position)
        .normalize();
      const hit = ray.intersectSphere(
        new THREE.Sphere(
          C,
          P.radius + r + (hoverOn ? P.hoverLift : 0),
        ),
        new THREE.Vector3(),
      );
      hoverOn = !!hit;
      if (!hit) return;
      hpTarget.copy(hit);
      if (hoverAmt < 0.01) hp.copy(hpTarget);
    },
    dispose: () => {
      coinGeos.forEach((g: any) => g.dispose());
      coinMats.forEach((mats: any) => mats[1].dispose());
      edgeMat.dispose();
      map.dispose();
      bumpMap.dispose();
      renderer.dispose();
    },
  };
}

function CoinBall({
  className = '',
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let ball: RopeController | null = null;
    let raf = 0;
    let visible = false;
    let cancelled = false;
    const reduce = prefersReducedMotion();

    let clock = 0;
    let intro = 0;
    let last = 0;

    const tick = (now: number) => {
      raf = 0;
      if (!ball || !visible) {
        last = 0;
        return;
      }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      clock += dt;
      intro += dt;
      ball.render(clock, intro);
      if (!reduce) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was) {
        intro = reduce ? Infinity : 0;
        if (!raf) raf = requestAnimationFrame(tick);
      }
    });

    const ro = new ResizeObserver(() => {
      ball?.resize();
      if (reduce && ball) ball.render(0, Infinity);
    });

    const onMove = (e: PointerEvent) => {
      ball?.pointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
      const b = canvas.getBoundingClientRect();
      const over =
        e.clientX >= b.left &&
        e.clientX <= b.right &&
        e.clientY >= b.top &&
        e.clientY <= b.bottom;
      ball?.hover(
        ((e.clientX - b.left) / b.width) * 2 - 1,
        -((e.clientY - b.top) / b.height) * 2 + 1,
        over,
      );
    };

    loadThree()
      .then((THREE) => {
        if (cancelled) return;
        ball = createCoinBall(THREE, canvas);
        ball.resize();
        ball.render(0, reduce ? Infinity : 0);
        setReady(true);
        io.observe(canvas);
        ro.observe(canvas);
        if (!reduce) window.addEventListener('pointermove', onMove);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      ball?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`block transition-opacity duration-1000 motion-reduce:transition-none ${
        ready ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={style}
    />
  );
}

function CTAHeading({ className = '' }: { className?: string }) {
  return (
    <h2
      className={`m-0 font-['Gilda_Display',serif] font-normal capitalize text-[#302d2c] ${className}`}
    >
      Ready To Scale? Let’s{' '}
      <span className="inline-block font-['Give_You_Glory',cursive] leading-[0.95] text-[#e83f20]">
        Move
      </span>{' '}
      Value.
    </h2>
  );
}

function CTADesktop({ onNavigate }: { onNavigate: (route: PageRoute) => void }) {
  return (
    <Artboard id="contact" height={830} className="bg-[#eeded0]">
      <CoinBall className="pointer-events-none" style={at(0, 0, 1600, 830)} />
      <Reveal className="flex justify-center" style={at(0, 68, 1600)}>
        <Badge>Instant Sandbox &amp; Dedicated Liquidity Desk</Badge>
      </Reveal>
      <Reveal delay={200} style={at(350, 117, 900)}>
        <CTAHeading className="text-center text-[82px] leading-[88px] tracking-[-2.46px]" />
      </Reveal>
      <Reveal
        delay={320}
        className="flex justify-center gap-[14px]"
        style={at(0, 316, 1600)}
      >
        <ActionButton onClick={() => onNavigate('contact')}>
          Open Sandbox Account
        </ActionButton>
        <ActionButton variant="outline" onClick={() => onNavigate('corridors')}>
          Simulate FX &amp; Fees
        </ActionButton>
      </Reveal>
    </Artboard>
  );
}

function CTAMobile({ onNavigate }: { onNavigate: (route: PageRoute) => void }) {
  return (
    <section id="contact" className="overflow-hidden bg-[#eeded0] pt-[64px]">
      <div className="px-[20px] text-center">
        <Reveal className="flex justify-center [&_p]:!text-[14px]">
          <Badge>Instant Sandbox &amp; Liquidity Desk</Badge>
        </Reveal>
        <Reveal delay={200} className="mt-[16px]">
          <CTAHeading className="text-[44px] leading-[52px] tracking-[-1.3px]" />
        </Reveal>
        <Reveal
          delay={320}
          className="mt-[24px] flex flex-wrap justify-center gap-[10px]"
        >
          <ActionButton onClick={() => onNavigate('contact')}>
            Open Sandbox
          </ActionButton>
          <ActionButton
            variant="outline"
            onClick={() => onNavigate('corridors')}
          >
            Simulate FX
          </ActionButton>
        </Reveal>
      </div>
      <div className="relative mt-[8px] aspect-[1600/520] w-full overflow-hidden">
        <CoinBall className="pointer-events-none absolute bottom-0 left-0 aspect-[1600/830] w-full" />
      </div>
    </section>
  );
}

function CTASection({ onNavigate }: { onNavigate: (route: PageRoute) => void }) {
  return (
    <Responsive
      desktop={<CTADesktop onNavigate={onNavigate} />}
      mobile={<CTAMobile onNavigate={onNavigate} />}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Section 09: Footer (Signature "Neth3" Wordmark)
// ─────────────────────────────────────────────────────────────

const VALUES = ['Instant', 'Borderless', 'Programmable', 'Compliant'];
const PITCH = [
  'Neth3 powers instant global value transfer across 180+ countries,',
  'bridging traditional bank rails, regulated stablecoins, and major',
  'cryptocurrencies in one unified settlement frontier.',
];

const QUICK_LINKS: { label: string; route: PageRoute }[] = [
  { label: 'Overview', route: 'home' },
  { label: 'Architecture', route: 'about' },
  { label: 'APIs', route: 'capabilities' },
  { label: 'Corridors', route: 'corridors' },
];

const SUPPORTED_RAILS: { label: string; route: PageRoute }[] = [
  { label: 'USDC · USDT · EURC', route: 'capabilities' },
  { label: 'BTC · ETH · SOL', route: 'capabilities' },
  { label: 'SEPA · PIX · SPEI', route: 'corridors' },
];

function FooterLinkRow({
  links,
  onNavigate,
  small = false,
}: {
  links: { label: string; route: PageRoute }[];
  onNavigate: (route: PageRoute) => void;
  small?: boolean;
}) {
  return (
    <ul
      className={`m-0 flex list-none flex-wrap items-center p-0 ${
        small ? 'gap-x-[12px] gap-y-[4px]' : 'gap-[16px]'
      }`}
    >
      {links.map((l, i) => (
        <li
          key={l.label}
          className={`flex items-center ${small ? 'gap-[12px]' : 'gap-[16px]'}`}
        >
          {i > 0 && <span className="block size-[8px] rounded-full bg-white" />}
          <button
            type="button"
            onClick={() => onNavigate(l.route)}
            className={`cursor-pointer border-0 bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat bg-transparent p-0 font-medium tracking-[0.01em] text-white no-underline transition-[background-size] duration-300 hover:bg-[length:100%_2px] ${
              small ? 'text-[17px] leading-[1.5]' : 'text-[22px] leading-[1.5]'
            }`}
          >
            {l.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

function PillButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative inline-flex cursor-pointer items-center overflow-hidden rounded-full border-0 bg-white px-[22px] py-[12px] text-[16px] font-medium leading-[26px] text-[#e83f20] no-underline transition-[transform,box-shadow,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:text-white hover:shadow-[0_14px_28px_-12px_rgba(15,2,0,0.55)] active:scale-[0.97]"
    >
      <span className="absolute inset-0 origin-left scale-x-0 bg-[#0e0300] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
      <span className="relative block overflow-hidden whitespace-nowrap">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
        >
          {children}
        </span>
      </span>
    </button>
  );
}

const wordmarkStyle: CSSProperties = {
  color: 'rgba(246,240,213,0.3)',
  WebkitTextStroke: '6px rgba(246,240,213,0.3)',
  paintOrder: 'stroke fill',
};

function FooterDesktop({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  return (
    <Artboard id="footer" height={1045} className="bg-[#e83f20] text-white">
      <Reveal
        className="flex justify-between px-[64px] text-[22px] font-semibold leading-[27px]"
        style={at(0, 80, 1600)}
      >
        {VALUES.map((v) => (
          <p key={v} className="m-0 whitespace-nowrap">
            {v}
          </p>
        ))}
      </Reveal>
      <div
        className="bg-[rgba(246,240,213,0.1)]"
        style={at(0, 131, 1600, 2)}
      />

      <Reveal delay={150} style={at(450, 205, 700)}>
        <p className="m-0 text-center text-[24px] font-medium leading-[1.55] text-[#f6f0d4]">
          {PITCH.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </Reveal>
      <Reveal delay={250} className="flex justify-center" style={at(0, 382, 1600)}>
        <PillButton onClick={() => onNavigate('contact')}>
          Launch Sandbox
        </PillButton>
      </Reveal>

      <div
        className="bg-[rgba(246,240,213,0.1)]"
        style={at(0, 488, 1600, 2)}
      />

      <div
        className="flex items-start justify-between px-[64px]"
        style={at(0, 524, 1600)}
      >
        <Reveal>
          <p className="m-0 font-['Gilda_Display',serif] text-[30px] uppercase leading-[28px]">
            Quick Links
          </p>
          <div className="mt-[10px]">
            <FooterLinkRow links={QUICK_LINKS} onNavigate={onNavigate} />
          </div>
        </Reveal>
        <Reveal delay={120} className="flex flex-col items-end">
          <p className="m-0 font-['Gilda_Display',serif] text-[30px] uppercase leading-[28px]">
            Supported Rails
          </p>
          <div className="mt-[10px]">
            <FooterLinkRow links={SUPPORTED_RAILS} onNavigate={onNavigate} />
          </div>
        </Reveal>
      </div>

      <Reveal delay={200} style={at(9, 616, 1590, 410)}>
        <p
          aria-hidden
          className="m-0 select-none whitespace-nowrap text-center font-['Gilda_Display',serif] text-[430px] leading-[430px]"
          style={wordmarkStyle}
        >
          Neth
          <span
            className="inline-block -translate-y-[26px] font-['Give_You_Glory',cursive] text-[410px]"
            style={{
              color: 'rgba(246,240,213,0.48)',
              WebkitTextStroke: '3px rgba(246,240,213,0.48)',
              marginLeft: '0.03em',
            }}
          >
            3
          </span>
        </p>
      </Reveal>
    </Artboard>
  );
}

function FooterMobile({ onNavigate }: { onNavigate: (route: PageRoute) => void }) {
  return (
    <footer
      id="footer"
      className="overflow-hidden bg-[#e83f20] pt-[48px] text-white"
    >
      <div className="grid grid-cols-2 gap-y-[10px] px-[20px] text-[18px] font-semibold">
        {VALUES.map((v) => (
          <p key={v} className="m-0">
            {v}
          </p>
        ))}
      </div>
      <div className="mt-[24px] h-[2px] bg-[rgba(246,240,213,0.1)]" />
      <div className="px-[20px] py-[44px] text-center">
        <Reveal>
          <p className="m-0 text-[19px] font-medium leading-[1.6] text-[#f6f0d4]">
            {PITCH.join(' ')}
          </p>
        </Reveal>
        <Reveal delay={150} className="mt-[36px] flex justify-center">
          <PillButton onClick={() => onNavigate('contact')}>
            Launch Sandbox
          </PillButton>
        </Reveal>
      </div>
      <div className="h-[2px] bg-[rgba(246,240,213,0.1)]" />
      <div className="flex flex-col gap-[28px] px-[20px] pt-[32px]">
        <div>
          <p className="m-0 font-['Gilda_Display',serif] text-[24px] uppercase leading-[28px]">
            Quick Links
          </p>
          <div className="mt-[8px]">
            <FooterLinkRow links={QUICK_LINKS} onNavigate={onNavigate} small />
          </div>
        </div>
        <div>
          <p className="m-0 font-['Gilda_Display',serif] text-[24px] uppercase leading-[28px]">
            Supported Rails
          </p>
          <div className="mt-[8px]">
            <FooterLinkRow
              links={SUPPORTED_RAILS}
              onNavigate={onNavigate}
              small
            />
          </div>
        </div>
      </div>
      <p
        aria-hidden
        className="m-0 mt-[16px] select-none whitespace-nowrap text-center font-['Gilda_Display',serif] text-[24vw] leading-[1.05]"
        style={{
          ...wordmarkStyle,
          WebkitTextStroke: '2px rgba(246,240,213,0.3)',
        }}
      >
        Neth
        <span
          className="inline-block -translate-y-[1.5vw] font-['Give_You_Glory',cursive]"
          style={{
            color: 'rgba(246,240,213,0.48)',
            WebkitTextStroke: '1.5px rgba(246,240,213,0.48)',
            marginLeft: '0.03em',
          }}
        >
          3
        </span>
      </p>
    </footer>
  );
}

function FooterSection({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  return (
    <Responsive
      desktop={<FooterDesktop onNavigate={onNavigate} />}
      mobile={<FooterMobile onNavigate={onNavigate} />}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Dedicated Destination Pages (All Dropdown Menu Items Navigable)
// ─────────────────────────────────────────────────────────────

function SubpageHeader({
  badge,
  titleLead,
  titleAccent,
  titleEnd,
  subtitle,
  dark = false,
  onNavigate,
}: {
  badge: string;
  titleLead: string;
  titleAccent: string;
  titleEnd?: string;
  subtitle: string;
  dark?: boolean;
  onNavigate: (route: PageRoute) => void;
}) {
  return (
    <header
      className={`px-[20px] pb-[56px] pt-[124px] md:px-[64px] md:pb-[72px] md:pt-[144px] ${
        dark
          ? 'bg-[#0e0300] text-white'
          : 'border-b border-[#312c2c]/10 bg-[#eedcd0] text-[#302d2c]'
      }`}
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-wrap items-center justify-between gap-[16px]">
          <Badge dark={dark}>{badge}</Badge>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`cursor-pointer rounded-full border px-[14px] py-[6px] text-[13px] font-medium transition-colors ${
              dark
                ? 'border-white/20 bg-white/5 text-white hover:border-[#e83f20] hover:bg-[#e83f20]'
                : 'border-[#312c2c]/20 bg-white/80 text-[#312c2c] hover:border-[#e83f20] hover:text-[#e83f20]'
            }`}
          >
            ← Back to Overview
          </button>
        </div>

        <h1 className="m-0 mt-[24px] max-w-[980px] font-['Gilda_Display',serif] text-[44px] font-normal capitalize leading-[52px] tracking-[-1.2px] md:text-[74px] md:leading-[84px] md:tracking-[-2.2px]">
          {titleLead}{' '}
          <span className="inline-block pl-[0.06em] font-['Give_You_Glory',cursive] leading-[1.05] text-[#e83f20]">
            {titleAccent}
          </span>
          {titleEnd ? ` ${titleEnd}` : ''}
        </h1>

        <p
          className={`m-0 mt-[20px] max-w-[740px] text-[18px] leading-[28px] md:text-[21px] md:leading-[32px] ${
            dark ? 'text-white/75' : 'text-[#5f4837]'
          }`}
        >
          {subtitle}
        </p>
      </div>
    </header>
  );
}

// ── Page 1: About & Architecture (#/about) ───────────────────────
const ARCH_LAYERS = [
  {
    layer: 'L7 · Programmable API & Webhooks',
    title: 'Idempotent REST, GraphQL & ISO 20022 Messaging',
    detail:
      'Unified JSON endpoints emit cryptographic settlement receipts, pacs.008 payment instructions, and camt.053 statements in real time.',
    latency: '< 18ms API edge',
  },
  {
    layer: 'L6 · Intent-Based Liquidity Orchestrator',
    title: 'Multi-Rail Smart Router & Best-Execution FX',
    detail:
      'Evaluates depth across 180+ domestic RTP networks, Tier-1 FX prime brokers, and on-chain DEX/RFQ pools every 200ms.',
    latency: '0.08% flat spread',
  },
  {
    layer: 'L5 · Compliance, KYT & Travel Rule Mesh',
    title: 'Real-Time Sanctions, AML & FATF Travel Rule Screening',
    detail:
      'Inline wallet risk scoring, VASP counterparty verification, and automated SAR/STR audit trails built directly into pre-settlement validation.',
    latency: '< 45ms inline check',
  },
  {
    layer: 'L4 · Stablecoin & Multi-Chain Settlement',
    title: '1:1 USDC, USDT, EURC + BTC, ETH & SOL Clearing',
    detail:
      'Native mint/burn contracts on Ethereum, Solana, Arbitrum, Base, Polygon, and Bitcoin Lightning with zero wrapped-bridge exposure.',
    latency: '< 1.8s global finality',
  },
  {
    layer: 'L1 · Custodial & Reserve Infrastructure',
    title: 'Segregated Bankruptcy-Remote Accounts & MPC-CMP HSMs',
    detail:
      '100% cash and short-duration T-bill backing with daily attestation proofs and FIPS 140-3 Level 4 multi-party computation signing.',
    latency: '99.998% SLA',
  },
];

function AboutArchitecturePage({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  const [selectedLayer, setSelectedLayer] = useState(0);

  return (
    <div className="bg-[#efded1] text-[#302d2c]">
      <SubpageHeader
        badge="About & Architecture"
        titleLead="Engineering The Global"
        titleAccent="Liquidity"
        titleEnd="Fabric."
        subtitle="Synthesizing the speed of programmable blockchains with the regulatory certainty of domestic real-time bank rails across 180+ jurisdictions."
        onNavigate={onNavigate}
      />

      <section className="mx-auto max-w-[1360px] px-[20px] py-[64px] md:px-[64px]">
        <div className="grid gap-[32px] lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Badge>Protocol Stack</Badge>
            <h2 className="m-0 mt-[14px] font-['Gilda_Display',serif] text-[36px] font-normal leading-[44px] md:text-[46px] md:leading-[54px]">
              Inspect Each Settlement Layer
            </h2>
            <p className="m-0 mt-[14px] text-[17px] leading-[27px] text-[#5f4837]">
              Select any layer of the Neth3 clearing stack to inspect how fiat,
              stablecoins, and major cryptocurrencies settle atomically.
            </p>
            <div className="mt-[24px] flex flex-col gap-[10px]">
              {ARCH_LAYERS.map((item, idx) => (
                <button
                  key={item.layer}
                  type="button"
                  onClick={() => setSelectedLayer(idx)}
                  className={`cursor-pointer rounded-[14px] border p-[16px] text-left transition-all ${
                    selectedLayer === idx
                      ? 'border-[#e83f20] bg-[#0e0300] text-white shadow-[0_14px_30px_-14px_rgba(14,3,0,0.5)]'
                      : 'border-[#312c2c]/15 bg-white text-[#302d2c] hover:border-[#e83f20]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[12px] font-medium uppercase tracking-[0.06em]">
                    <span
                      className={
                        selectedLayer === idx
                          ? 'text-[#e83f20]'
                          : 'text-[#8e869c]'
                      }
                    >
                      {item.layer}
                    </span>
                    <span className="text-[#04DA8C]">{item.latency}</span>
                  </div>
                  <p className="m-0 mt-[6px] font-['Gilda_Display',serif] text-[20px]">
                    {item.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[24px] bg-[#0e0300] p-[28px] text-white md:p-[40px] lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-[12px] border-b border-white/10 pb-[18px]">
                <span className="rounded-full bg-[#e83f20] px-[12px] py-[4px] text-[12px] font-semibold">
                  {ARCH_LAYERS[selectedLayer].layer}
                </span>
                <span className="text-[14px] font-medium text-[#04DA8C]">
                  Benchmark: {ARCH_LAYERS[selectedLayer].latency}
                </span>
              </div>

              <h3 className="m-0 mt-[24px] font-['Gilda_Display',serif] text-[32px] font-normal leading-[40px] md:text-[40px] md:leading-[48px]">
                {ARCH_LAYERS[selectedLayer].title}
              </h3>
              <p className="m-0 mt-[16px] text-[18px] leading-[30px] text-white/80">
                {ARCH_LAYERS[selectedLayer].detail}
              </p>

              <div className="mt-[32px] grid gap-[14px] sm:grid-cols-3">
                <div className="rounded-[14px] border border-white/10 bg-white/[0.04] p-[16px]">
                  <p className="m-0 text-[12px] uppercase text-[#c7c6c6]">
                    Reserve Backing
                  </p>
                  <p className="m-0 mt-[6px] font-['Gilda_Display',serif] text-[28px] text-[#04DA8C]">
                    100.4%
                  </p>
                  <p className="m-0 mt-[4px] text-[12px] text-white/60">
                    Real-time proof of reserve
                  </p>
                </div>
                <div className="rounded-[14px] border border-white/10 bg-white/[0.04] p-[16px]">
                  <p className="m-0 text-[12px] uppercase text-[#c7c6c6]">
                    ISO 20022 Native
                  </p>
                  <p className="m-0 mt-[6px] font-['Gilda_Display',serif] text-[28px] text-white">
                    pacs.008
                  </p>
                  <p className="m-0 mt-[4px] text-[12px] text-white/60">
                    Full bank ledger parity
                  </p>
                </div>
                <div className="rounded-[14px] border border-white/10 bg-white/[0.04] p-[16px]">
                  <p className="m-0 text-[12px] uppercase text-[#c7c6c6]">
                    Operating Window
                  </p>
                  <p className="m-0 mt-[6px] font-['Gilda_Display',serif] text-[28px] text-[#e83f20]">
                    24/7/365
                  </p>
                  <p className="m-0 mt-[4px] text-[12px] text-white/60">
                    Zero holiday cutoffs
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-[32px] flex flex-wrap items-center justify-between gap-[16px] border-t border-white/10 pt-[20px]">
              <span className="text-[14px] text-white/70">
                Ready to test multi-rail routing in your environment?
              </span>
              <ActionButton onClick={() => onNavigate('capabilities')}>
                Open API Playground →
              </ActionButton>
            </div>
          </div>
        </div>

        <div className="mt-[72px] rounded-[24px] bg-white p-[24px] shadow-[0_20px_50px_-24px_rgba(49,44,44,0.2)] md:p-[40px]">
          <Badge>Architecture Benchmark</Badge>
          <h2 className="m-0 mt-[14px] font-['Gilda_Display',serif] text-[34px] font-normal md:text-[44px]">
            Legacy Correspondent Banking vs. Neth3 Mesh
          </h2>
          <div className="mt-[24px] overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#312c2c]/15 text-[13px] uppercase tracking-[0.06em] text-[#8e869c]">
                  <th className="py-[14px] pr-[16px]">Dimension</th>
                  <th className="py-[14px] px-[16px]">Legacy SWIFT / Wire</th>
                  <th className="py-[14px] pl-[16px] text-[#e83f20]">
                    Neth3 Payment Frontier
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#312c2c]/10 text-[16px]">
                <tr>
                  <td className="py-[16px] pr-[16px] font-medium">
                    Settlement Finality
                  </td>
                  <td className="py-[16px] px-[16px] text-[#5f4837]">
                    2 to 5 business days (T+3)
                  </td>
                  <td className="py-[16px] pl-[16px] font-semibold text-[#15803d]">
                    &lt; 1.8 seconds deterministic
                  </td>
                </tr>
                <tr>
                  <td className="py-[16px] pr-[16px] font-medium">
                    FX &amp; Intermediary Fees
                  </td>
                  <td className="py-[16px] px-[16px] text-[#5f4837]">
                    2.5% – 4.8% hidden lifting fees
                  </td>
                  <td className="py-[16px] pl-[16px] font-semibold text-[#15803d]">
                    0.08% flat transparent spread
                  </td>
                </tr>
                <tr>
                  <td className="py-[16px] pr-[16px] font-medium">
                    Supported Value Types
                  </td>
                  <td className="py-[16px] px-[16px] text-[#5f4837]">
                    Bank-hours fiat only
                  </td>
                  <td className="py-[16px] pl-[16px] font-semibold text-[#15803d]">
                    Fiat + USDC, USDT, EURC + BTC, ETH, SOL
                  </td>
                </tr>
                <tr>
                  <td className="py-[16px] pr-[16px] font-medium">
                    Capital Efficiency
                  </td>
                  <td className="py-[16px] px-[16px] text-[#5f4837]">
                    Pre-funded nostro/vostro traps
                  </td>
                  <td className="py-[16px] pl-[16px] font-semibold text-[#15803d]">
                    Just-in-time on-demand liquidity
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Page 2: Capabilities & APIs (#/capabilities) ──────────────────
const API_ENDPOINTS = [
  {
    id: 'payout',
    method: 'POST',
    path: '/v2/payouts/instant',
    title: 'Cross-Border Fiat ↔ Stablecoin Payout',
    request: `{
  "idempotency_key": "neth3_ord_994821a",
  "source": { "currency": "USD", "amount": "50000.00", "rail": "FEDNOW" },
  "destination": { "asset": "USDC", "network": "SOLANA", "address": "7xKX...9pQw" },
  "compliance": { "travel_rule": true, "purpose_code": "SUPP" }
}`,
    response: `{
  "settlement_id": "stl_01J9X8K2M4N7P0Q",
  "status": "SETTLED",
  "delivered_amount": "50000.00 USDC",
  "fx_rate": "1.000000",
  "finality_ms": 640,
  "tx_hash": "5Uj9mK2...8vLp",
  "iso20022_end_to_end_id": "NETH320261113009948"
}`,
  },
  {
    id: 'checkout',
    method: 'POST',
    path: '/v2/checkout/crypto-session',
    title: 'Multi-Crypto Merchant Checkout with Instant Fiat Settlement',
    request: `{
  "merchant_id": "mrc_kitewise_eu",
  "invoice_amount": "4200.00",
  "invoice_currency": "EUR",
  "accepted_assets": ["BTC", "ETH", "SOL", "USDC", "USDT"],
  "auto_convert_to": "EURC",
  "chargeback_protection": true
}`,
    response: `{
  "session_id": "chk_live_88310f",
  "locked_quotes": {
    "BTC": "0.04412000",
    "ETH": "1.318500",
    "USDC": "4561.20"
  },
  "quote_ttl_seconds": 900,
  "settlement_rail": "SEPA_INSTANT"
}`,
  },
  {
    id: 'treasury',
    method: 'POST',
    path: '/v2/treasury/rebalance',
    title: 'Programmable Multi-Currency Liquidity Sweep',
    request: `{
  "vault_id": "vlt_global_ops",
  "from_asset": "USDT",
  "from_network": "TRON",
  "to_currency": "SGD",
  "to_rail": "FAST",
  "amount": "250000.00"
}`,
    response: `{
  "rebalance_id": "reb_77219c",
  "status": "COMPLETED",
  "credited": "335400.00 SGD",
  "spread_bps": 8,
  "elapsed_ms": 1180
}`,
  },
];

const SUPPORTED_ASSETS_MATRIX = [
  { symbol: 'USDC', name: 'USD Coin', type: 'Stablecoin', chains: 'Ethereum, Solana, Base, Arbitrum, Polygon', finality: '0.4s – 1.2s' },
  { symbol: 'USDT', name: 'Tether USD', type: 'Stablecoin', chains: 'Ethereum, TRON, Arbitrum, Solana, TON', finality: '0.6s – 1.5s' },
  { symbol: 'EURC', name: 'Euro Coin', type: 'Stablecoin', chains: 'Ethereum, Base, Solana, Avalanche', finality: '0.5s – 1.2s' },
  { symbol: 'BTC', name: 'Bitcoin', type: 'Crypto', chains: 'Bitcoin L1, Lightning Network', finality: '0.3s (LN)' },
  { symbol: 'ETH', name: 'Ethereum', type: 'Crypto', chains: 'Ethereum Mainnet, Arbitrum, Optimism, Base', finality: '0.8s (L2)' },
  { symbol: 'SOL', name: 'Solana', type: 'Crypto', chains: 'Solana Mainnet', finality: '0.4s' },
  { symbol: 'USD / EUR / GBP', name: 'G10 Instant Rails', type: 'Fiat RTP', chains: 'FedNow, RTP, SEPA Instant, UK FPS', finality: '< 1.8s' },
  { symbol: 'PIX / SPEI / FAST', name: 'Emerging RTP Rails', type: 'Fiat RTP', chains: 'Brazil PIX, Mexico SPEI, Singapore FAST', finality: '< 1.5s' },
];

function CapabilitiesPage({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [assetFilter, setAssetFilter] = useState<'All' | 'Stablecoin' | 'Crypto' | 'Fiat RTP'>('All');

  const ep = API_ENDPOINTS[activeEndpoint];

  const handleSimulate = () => {
    setRunning(true);
    window.setTimeout(() => setRunning(false), 450);
  };

  const handleCopy = () => {
    copyTextSafe(ep.request).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  };

  const filteredAssets =
    assetFilter === 'All'
      ? SUPPORTED_ASSETS_MATRIX
      : SUPPORTED_ASSETS_MATRIX.filter((a) => a.type === assetFilter);

  return (
    <div className="bg-[#efded1] text-[#302d2c]">
      <SubpageHeader
        badge="Capabilities & APIs"
        titleLead="Developer-First"
        titleAccent="Settlement"
        titleEnd="APIs."
        subtitle="Build global payouts, stablecoin treasury sweeps, and multi-crypto merchant checkout with predictable sub-second finality and idempotent REST endpoints."
        onNavigate={onNavigate}
      />

      <section className="mx-auto max-w-[1360px] px-[20px] py-[64px] md:px-[64px]">
        <div className="rounded-[24px] bg-[#0e0300] p-[24px] text-white shadow-[0_28px_60px_-20px_rgba(14,3,0,0.45)] md:p-[40px]">
          <div className="flex flex-wrap items-center justify-between gap-[16px]">
            <div>
              <Badge dark>Interactive API Playground</Badge>
              <h2 className="m-0 mt-[12px] font-['Gilda_Display',serif] text-[32px] font-normal md:text-[42px]">
                Test Neth3 v2 Endpoints Live
              </h2>
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {API_ENDPOINTS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveEndpoint(idx)}
                  className={`cursor-pointer rounded-full border px-[14px] py-[7px] text-[13px] font-medium transition-colors ${
                    activeEndpoint === idx
                      ? 'border-[#e83f20] bg-[#e83f20] text-white'
                      : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/15'
                  }`}
                >
                  {item.path}
                </button>
              ))}
            </div>
          </div>

          <p className="m-0 mt-[16px] text-[16px] text-white/75">{ep.title}</p>

          <div className="mt-[24px] grid gap-[20px] lg:grid-cols-2">
            <div className="rounded-[16px] border border-white/10 bg-[#180705] p-[18px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-[12px]">
                <div className="flex items-center gap-[8px]">
                  <span className="rounded-[6px] bg-[#04DA8C]/20 px-[8px] py-[2px] font-mono text-[12px] font-bold text-[#04DA8C]">
                    {ep.method}
                  </span>
                  <code className="text-[13px] text-white/90">{ep.path}</code>
                </div>
                <div className="flex items-center gap-[8px]">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="cursor-pointer rounded-[8px] border border-white/15 bg-white/5 px-[10px] py-[4px] text-[12px] text-white hover:bg-white/15"
                  >
                    {copied ? 'Copied!' : 'Copy JSON'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulate}
                    className="cursor-pointer rounded-[8px] border-0 bg-[#e83f20] px-[12px] py-[4px] text-[12px] font-medium text-white hover:bg-[#ff4d2c]"
                  >
                    {running ? 'Executing...' : '▶ Run Request'}
                  </button>
                </div>
              </div>
              <pre className="m-0 mt-[14px] overflow-x-auto font-mono text-[13px] leading-[21px] text-[#eedcd0]">
                {ep.request}
              </pre>
            </div>

            <div className="rounded-[16px] border border-white/10 bg-[#120503] p-[18px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-[12px]">
                <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#c7c6c6]">
                  200 OK · Cryptographic Receipt
                </span>
                <span className="text-[12px] text-[#04DA8C]">
                  {running ? 'Routing...' : 'Verified Signature'}
                </span>
              </div>
              <pre
                className={`m-0 mt-[14px] overflow-x-auto font-mono text-[13px] leading-[21px] text-[#04DA8C] transition-opacity duration-200 ${
                  running ? 'opacity-30' : 'opacity-100'
                }`}
              >
                {ep.response}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-[64px]">
          <div className="flex flex-wrap items-end justify-between gap-[16px]">
            <div>
              <Badge>Multi-Asset Coverage</Badge>
              <h2 className="m-0 mt-[12px] font-['Gilda_Display',serif] text-[36px] font-normal md:text-[46px]">
                Supported Stablecoins, Crypto &amp; Fiat Rails
              </h2>
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {(['All', 'Stablecoin', 'Crypto', 'Fiat RTP'] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setAssetFilter(tab)}
                    className={`cursor-pointer rounded-full border px-[14px] py-[6px] text-[13px] font-medium transition-colors ${
                      assetFilter === tab
                        ? 'border-[#0e0300] bg-[#0e0300] text-white'
                        : 'border-[#312c2c]/20 bg-white text-[#312c2c] hover:border-[#e83f20]'
                    }`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="mt-[28px] grid gap-[16px] md:grid-cols-2 lg:grid-cols-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.symbol}
                className="flex flex-col justify-between rounded-[18px] bg-white p-[22px] shadow-[0_12px_30px_-18px_rgba(49,44,44,0.25)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#feebe6] px-[10px] py-[3px] text-[11px] font-semibold text-[#e83f20]">
                      {asset.type}
                    </span>
                    <span className="text-[12px] font-medium text-[#15803d]">
                      {asset.finality}
                    </span>
                  </div>
                  <h3 className="m-0 mt-[14px] font-['Gilda_Display',serif] text-[26px] font-normal">
                    {asset.symbol}
                  </h3>
                  <p className="m-0 text-[14px] text-[#8e869c]">{asset.name}</p>
                </div>
                <p className="m-0 mt-[16px] border-t border-[#312c2c]/10 pt-[12px] text-[13px] leading-[20px] text-[#5f4837]">
                  Networks: {asset.chains}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Page 3: Global Corridors & Live FX Calculator (#/corridors) ──
const FX_DESTINATIONS = [
  { code: 'MXN', name: 'Mexico (SPEI Instant)', rateFromUSD: 20.14, time: '0.6s', rail: 'SPEI' },
  { code: 'BRL', name: 'Brazil (PIX Instant)', rateFromUSD: 5.78, time: '0.7s', rail: 'PIX' },
  { code: 'SGD', name: 'Singapore (FAST)', rateFromUSD: 1.34, time: '0.9s', rail: 'FAST' },
  { code: 'EUR', name: 'Eurozone (SEPA Instant)', rateFromUSD: 0.92, time: '1.1s', rail: 'SEPA Instant' },
  { code: 'GBP', name: 'United Kingdom (FPS)', rateFromUSD: 0.79, time: '0.9s', rail: 'Faster Payments' },
  { code: 'JPY', name: 'Japan (Zengin)', rateFromUSD: 153.8, time: '1.4s', rail: 'Zengin' },
];

const SOURCE_USD_EQUIV: Record<string, number> = {
  USD: 1,
  USDC: 1,
  EUR: 1.087,
  GBP: 1.266,
  BTC: 95200,
  ETH: 3185,
};

function GlobalCorridorsPage({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  const [amountInput, setAmountInput] = useState('100000');
  const [sourceAsset, setSourceAsset] = useState('USD');
  const [destIdx, setDestIdx] = useState(0);

  const numericAmount = Math.max(0, parseFloat(amountInput) || 0);
  const usdValue = numericAmount * (SOURCE_USD_EQUIV[sourceAsset] || 1);
  const dest = FX_DESTINATIONS[destIdx];
  const neth3FeeUsd = usdValue * 0.0008;
  const legacyFeeUsd = usdValue * 0.032 + 35;
  const savingsUsd = Math.max(0, legacyFeeUsd - neth3FeeUsd);
  const deliveredLocal = (usdValue - neth3FeeUsd) * dest.rateFromUSD;

  return (
    <div className="bg-[#efded1] text-[#302d2c]">
      <SubpageHeader
        badge="Global Corridors"
        titleLead="180+ Territories."
        titleAccent="Zero"
        titleEnd="Friction."
        subtitle="Compare Neth3’s 0.08% flat institutional FX spread and sub-2-second settlement finality against traditional correspondent wire fees."
        onNavigate={onNavigate}
      />

      <section className="mx-auto max-w-[1360px] px-[20px] py-[64px] md:px-[64px]">
        <div className="rounded-[24px] bg-[#0e0300] p-[24px] text-white shadow-[0_28px_60px_-20px_rgba(14,3,0,0.45)] md:p-[40px]">
          <Badge dark>Live FX &amp; Settlement Simulator</Badge>
          <h2 className="m-0 mt-[12px] font-['Gilda_Display',serif] text-[32px] font-normal md:text-[42px]">
            Calculate Total Landed Cost Across Rails
          </h2>

          <div className="mt-[28px] grid gap-[24px] lg:grid-cols-12">
            <div className="flex flex-col gap-[18px] lg:col-span-5">
              <div>
                <label className="block text-[12px] uppercase tracking-[0.06em] text-[#c7c6c6]">
                  You Send
                </label>
                <div className="mt-[8px] flex overflow-hidden rounded-[12px] border border-white/15 bg-white/5">
                  <input
                    type="number"
                    min="0"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full border-0 bg-transparent px-[16px] py-[12px] font-['Gilda_Display',serif] text-[24px] text-white outline-none"
                  />
                  <select
                    value={sourceAsset}
                    onChange={(e) => setSourceAsset(e.target.value)}
                    className="cursor-pointer border-0 border-l border-white/15 bg-[#1b0806] px-[14px] text-[15px] font-semibold text-white outline-none"
                  >
                    {Object.keys(SOURCE_USD_EQUIV).map((sym) => (
                      <option key={sym} value={sym}>
                        {sym}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-[0.06em] text-[#c7c6c6]">
                  Recipient Corridor &amp; Local Rail
                </label>
                <div className="mt-[8px] grid grid-cols-2 gap-[8px]">
                  {FX_DESTINATIONS.map((d, idx) => (
                    <button
                      key={d.code}
                      type="button"
                      onClick={() => setDestIdx(idx)}
                      className={`cursor-pointer rounded-[10px] border px-[12px] py-[10px] text-left transition-colors ${
                        destIdx === idx
                          ? 'border-[#e83f20] bg-[#e83f20] text-white'
                          : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <span className="block text-[14px] font-semibold">
                        {d.code} · {d.rail}
                      </span>
                      <span className="block text-[11px] opacity-80">
                        Finality {d.time}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[18px] border border-white/10 bg-white/[0.04] p-[24px] lg:col-span-7">
              <div className="grid gap-[20px] sm:grid-cols-2">
                <div>
                  <p className="m-0 text-[12px] uppercase tracking-[0.06em] text-[#c7c6c6]">
                    Recipient Receives ({dest.rail})
                  </p>
                  <p className="m-0 mt-[6px] font-['Gilda_Display',serif] text-[36px] text-[#04DA8C]">
                    {deliveredLocal.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                    })}{' '}
                    {dest.code}
                  </p>
                  <p className="m-0 mt-[4px] text-[13px] text-white/65">
                    Cleared in {dest.time} · 24/7/365
                  </p>
                </div>
                <div>
                  <p className="m-0 text-[12px] uppercase tracking-[0.06em] text-[#c7c6c6]">
                    Net Savings vs. SWIFT Wire
                  </p>
                  <p className="m-0 mt-[6px] font-['Gilda_Display',serif] text-[36px] text-[#e83f20]">
                    $
                    {savingsUsd.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="m-0 mt-[4px] text-[13px] text-white/65">
                    Neth3 Fee: $
                    {neth3FeeUsd.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                    })}{' '}
                    (0.08%)
                  </p>
                </div>
              </div>

              <div className="mt-[24px] flex flex-wrap items-center justify-between gap-[12px] border-t border-white/10 pt-[18px]">
                <span className="text-[13px] text-white/75">
                  Routing Path: {sourceAsset} → USDC Liquidity Pool →{' '}
                  {dest.rail}
                </span>
                <ActionButton onClick={() => onNavigate('contact')}>
                  Lock Institutional Rate
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[64px] grid gap-[24px] md:grid-cols-2 lg:grid-cols-3">
          {CORRIDORS.map((c) => (
            <div
              key={c.name}
              className="group overflow-hidden rounded-[20px] bg-white shadow-[0_14px_34px_-18px_rgba(49,44,44,0.2)] transition-transform duration-300 hover:-translate-y-[4px]"
            >
              <div className="relative h-[220px] w-full overflow-hidden bg-[#14243b]">
                <div className="size-full transition-transform duration-700 group-hover:scale-[1.06]">
                  <CorridorRegionArt variant={c.regionArt} />
                </div>
                <span className="absolute left-[14px] top-[14px] rounded-full bg-[#0e0201]/85 px-[12px] py-[4px] text-[12px] font-medium text-white">
                  {c.badge}
                </span>
              </div>
              <div className="p-[22px]">
                <h3 className="m-0 font-['Gilda_Display',serif] text-[26px] font-normal">
                  {c.name}
                </h3>
                <p className="m-0 mt-[6px] text-[15px] text-[#5f4837]">
                  {c.tags}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Page 4: Case Studies (#/case-studies) ────────────────────────
function CaseStudiesPage({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeStudy = DEPLOYMENTS[selectedIdx];

  return (
    <div className="bg-[#0e0300] text-white">
      <SubpageHeader
        dark
        badge="Case Studies"
        titleLead="From Latency To"
        titleAccent="Liquidity."
        subtitle="How global treasuries, crypto exchanges, and high-growth marketplaces use Neth3 to eliminate multi-day settlement delays and reduce FX drag."
        onNavigate={onNavigate}
      />

      <section className="mx-auto max-w-[1360px] px-[20px] py-[64px] md:px-[64px]">
        <div className="flex flex-wrap gap-[10px]">
          {DEPLOYMENTS.map((item, idx) => (
            <button
              key={item.client}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`cursor-pointer rounded-full border px-[18px] py-[9px] text-[14px] font-medium transition-colors ${
                selectedIdx === idx
                  ? 'border-[#e83f20] bg-[#e83f20] text-white'
                  : 'border-white/15 bg-white/5 text-white/80 hover:border-white/40'
              }`}
            >
              {item.client} ({item.metric})
            </button>
          ))}
        </div>

        <div className="mt-[32px] grid gap-[28px] rounded-[24px] border border-white/15 bg-[#190705] p-[24px] md:p-[40px] lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-[18px] border border-white/15">
              <AbstractPaymentArt variant={activeStudy.art} />
            </div>

            <div className="mt-[20px] grid grid-cols-2 gap-[12px]">
              <div className="rounded-[14px] border border-white/10 bg-black/30 p-[16px]">
                <p className="m-0 text-[11px] uppercase tracking-[0.06em] text-white/55">
                  Before Neth3
                </p>
                <p className="m-0 mt-[6px] text-[15px] font-medium text-[#fca5a5]">
                  {activeStudy.before}
                </p>
              </div>
              <div className="rounded-[14px] border border-[#04DA8C]/30 bg-[#04DA8C]/10 p-[16px]">
                <p className="m-0 text-[11px] uppercase tracking-[0.06em] text-[#04DA8C]">
                  After Neth3
                </p>
                <p className="m-0 mt-[6px] text-[15px] font-medium text-white">
                  {activeStudy.after}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <div className="flex items-center justify-between">
                <ClientMark name={activeStudy.client} logo={activeStudy.logo} />
                <span className="rounded-full bg-white/10 px-[12px] py-[4px] text-[13px]">
                  Deployed {activeStudy.year}
                </span>
              </div>

              <h2 className="m-0 mt-[20px] font-['Gilda_Display',serif] text-[34px] font-normal leading-[42px] md:text-[44px] md:leading-[52px]">
                {activeStudy.project}
              </h2>

              <p className="m-0 mt-[16px] text-[18px] leading-[30px] text-white/80">
                {activeStudy.summary}
              </p>
            </div>

            <div className="mt-[32px] flex flex-wrap items-center justify-between gap-[16px] border-t border-white/10 pt-[20px]">
              <div>
                <span className="text-[12px] uppercase tracking-[0.06em] text-white/55">
                  Headline Impact
                </span>
                <p className="m-0 font-['Gilda_Display',serif] text-[30px] text-[#e83f20]">
                  {activeStudy.metric}
                </p>
              </div>
              <ActionButton onClick={() => onNavigate('contact')}>
                Deploy Similar Architecture
              </ActionButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Page 5: Settlement Process (#/process) ───────────────────────
const STATE_MACHINE_EVENTS = [
  {
    step: '01',
    event: 'INTENT_SIGNED',
    ms: '+0ms',
    desc: 'Client signs idempotent payout instruction with HMAC-SHA256 payload digest.',
  },
  {
    step: '02',
    event: 'KYT_AND_TRAVEL_RULE_PASSED',
    ms: '+38ms',
    desc: 'Inline wallet screening, sanctions check, and IVMS101 VASP metadata exchange verified.',
  },
  {
    step: '03',
    event: 'LIQUIDITY_LOCKED',
    ms: '+112ms',
    desc: 'FX spread locked at 8 bps; USDC liquidity reserved in MPC-CMP treasury vault.',
  },
  {
    step: '04',
    event: 'ATOMIC_RAIL_CLEARING',
    ms: '+940ms',
    desc: 'On-chain finality achieved and local RTP credit pushed to beneficiary IBAN/account.',
  },
  {
    step: '05',
    event: 'ISO20022_WEBHOOK_EMITTED',
    ms: '+1,180ms',
    desc: 'Signed settlement.completed webhook and camt.054 reconciliation record delivered.',
  },
];

function SettlementProcessPage({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  const [pulseStep, setPulseStep] = useState(4);

  const replayTrace = () => {
    setPulseStep(0);
    [1, 2, 3, 4].forEach((stepIdx) => {
      window.setTimeout(() => setPulseStep(stepIdx), stepIdx * 280);
    });
  };

  return (
    <div className="bg-[#efded0] text-[#302d2c]">
      <SubpageHeader
        badge="Settlement Process"
        titleLead="Deterministic"
        titleAccent="Atomic"
        titleEnd="Clearing."
        subtitle="Trace every millisecond of a Neth3 cross-border settlement—from signed API intent and inline KYT screening to local bank finality."
        onNavigate={onNavigate}
      />

      <section className="mx-auto max-w-[1360px] px-[20px] py-[64px] md:px-[64px]">
        <div className="grid gap-[20px] md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.no}
              className="rounded-[20px] bg-white p-[26px] shadow-[0_14px_34px_-18px_rgba(49,44,44,0.2)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-['Gilda_Display',serif] text-[28px] text-[#e83f20]">
                  {step.no}
                </span>
                <span className="size-[46px] text-[#302d2c]">
                  <StepIconSvg name={step.icon} />
                </span>
              </div>
              <h3 className="m-0 mt-[18px] font-['Gilda_Display',serif] text-[30px] font-normal">
                {step.title}
              </h3>
              <p className="m-0 mt-[10px] text-[15px] leading-[24px] text-[#5e4836]">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-[56px] rounded-[24px] bg-[#0e0300] p-[24px] text-white md:p-[40px]">
          <div className="flex flex-wrap items-center justify-between gap-[16px]">
            <div>
              <Badge dark>Transaction State Machine</Badge>
              <h2 className="m-0 mt-[12px] font-['Gilda_Display',serif] text-[32px] font-normal md:text-[42px]">
                1.18-Second End-to-End Execution Trace
              </h2>
            </div>
            <ActionButton onClick={replayTrace}>
              ↻ Replay Settlement Trace
            </ActionButton>
          </div>

          <div className="mt-[28px] flex flex-col gap-[12px]">
            {STATE_MACHINE_EVENTS.map((ev, idx) => {
              const active = idx <= pulseStep;
              return (
                <div
                  key={ev.event}
                  className={`flex flex-col justify-between gap-[12px] rounded-[14px] border p-[18px] transition-all duration-300 md:flex-row md:items-center ${
                    active
                      ? 'border-[#04DA8C]/40 bg-white/[0.06] opacity-100'
                      : 'border-white/10 bg-white/[0.02] opacity-35'
                  }`}
                >
                  <div className="flex items-center gap-[14px]">
                    <span className="flex size-[32px] shrink-0 items-center justify-center rounded-full bg-[#e83f20] font-mono text-[12px] font-bold">
                      {ev.step}
                    </span>
                    <div>
                      <code className="text-[14px] font-semibold text-[#04DA8C]">
                        {ev.event}
                      </code>
                      <p className="m-0 mt-[4px] text-[14px] text-white/75">
                        {ev.desc}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[14px] font-semibold text-[#eedcd0]">
                    {ev.ms}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Page 6: Testimonials & SLA (#/testimonials) ──────────────────
const RAIL_UPTIME = [
  { rail: 'USDC / USDT Multi-Chain Router (APAC & Global)', uptime: '99.999%', p99: '680ms' },
  { rail: 'Singapore FAST & Hong Kong FPS Instant Clearing', uptime: '99.998%', p99: '740ms' },
  { rail: 'Tokyo Zengin & Seoul KFTC Cross-Border Bridge', uptime: '99.998%', p99: '890ms' },
  { rail: 'BTC Lightning & ETH L2 Institutional Gateway', uptime: '99.997%', p99: '920ms' },
  { rail: 'FedNow, SEPA Instant, PIX & SPEI Off-Ramps', uptime: '99.996%', p99: '1,040ms' },
];

const ASIAN_PAY_PARTNERS = [
  {
    entity: 'StraitPay Pte. Ltd.',
    native: '海峽支付有限公司',
    hub: 'Singapore · MAS MPI',
    rail: 'FAST · PayNow · USDC',
  },
  {
    entity: 'SakuraPay Co., Ltd.',
    native: 'サクラペイ株式会社',
    hub: 'Tokyo · FSA Registered',
    rail: 'Zengin · JPY · BTC',
  },
  {
    entity: 'SiamBridge Pay Co., Ltd.',
    native: 'บริษัท สยามบริดจ์ เพย์ จำกัด',
    hub: 'Bangkok · BOT Licensed',
    rail: 'PromptPay · THB · USDT',
  },
  {
    entity: 'HanRiver Pay Ltd.',
    native: '한강페이 주식회사',
    hub: 'Seoul · FSC Licensed',
    rail: 'KFTC · KRW · SOL',
  },
  {
    entity: 'VictoriaHarbor Pay Limited',
    native: '維港支付有限公司',
    hub: 'Hong Kong · HKMA SVF',
    rail: 'FPS · HKD · EURC',
  },
  {
    entity: 'MekongPay Vietnam Co., Ltd.',
    native: 'Công ty TNHH MekongPay Việt Nam',
    hub: 'Ho Chi Minh City · SBV Sandbox',
    rail: 'NAPAS 247 · VND · USDC',
  },
];

const COMPLIANCE_BADGES = [
  { code: 'SOC 2 Type II', desc: 'Annual independent security & availability audit' },
  { code: 'PCI-DSS Level 1', desc: 'Highest global payment card & checkout certification' },
  { code: 'ISO 27001', desc: 'Certified enterprise information security management' },
  { code: 'MiCA & VASP Ready', desc: 'Full EU stablecoin & FATF Travel Rule compliance' },
  { code: 'MAS · FSA · HKMA', desc: 'Regulated APAC & global Pay Ltd. clearing partners' },
];

function TestimonialsSLAPage({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  const [regionFilter, setRegionFilter] = useState<'All' | TestimonialRegion>('All');

  const visibleTestimonials =
    regionFilter === 'All'
      ? TESTIMONIALS
      : TESTIMONIALS.filter((item) => item.region === regionFilter);

  return (
    <div className="bg-[#efded1] text-[#302d2c]">
      <SubpageHeader
        badge="Testimonials & SLA"
        titleLead="Trusted By Asian &"
        titleAccent="Global"
        titleEnd="Pay Leaders."
        subtitle="Backed by a 99.998% contractual uptime SLA, 100% segregated stablecoin reserves, and licensed Pay Co., Ltd. and Pte. Ltd. partners across APAC and worldwide."
        onNavigate={onNavigate}
      />

      <section className="mx-auto max-w-[1360px] px-[20px] py-[64px] md:px-[64px]">
        <div className="mb-[28px] flex flex-wrap items-center justify-between gap-[16px]">
          <div>
            <Badge>Executive Endorsements (5 Featured Partners)</Badge>
            <h2 className="m-0 mt-[10px] font-['Gilda_Display',serif] text-[32px] font-normal md:text-[42px]">
              Asian &amp; Southeast Asian Pay Ltd. Partners
            </h2>
          </div>
          <div className="flex flex-wrap gap-[8px]">
            {(['All', 'East Asia', 'ASEAN'] as const).map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setRegionFilter(region)}
                className={`cursor-pointer rounded-full border px-[16px] py-[7px] text-[13px] font-medium transition-colors ${
                  regionFilter === region
                    ? 'border-[#0e0300] bg-[#0e0300] text-white'
                    : 'border-[#312c2c]/20 bg-white text-[#312c2c] hover:border-[#e83f20]'
                }`}
              >
                {region === 'All' ? `All Regions (${TESTIMONIALS.length})` : region}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-[24px] md:grid-cols-2">
          {visibleTestimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between gap-[20px] rounded-[22px] bg-white p-[26px] shadow-[0_14px_34px_-18px_rgba(49,44,44,0.2)] sm:flex-row"
            >
              <div className="relative h-[240px] w-full shrink-0 overflow-hidden rounded-[14px] bg-[#1e293b] sm:h-auto sm:w-[184px]">
                <img
                  src={t.photo}
                  alt={t.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://placehold.co/184x240/1e293b/f8fafc?text=' +
                      encodeURIComponent(t.name);
                  }}
                  className="size-full object-cover object-[50%_20%]"
                />
                <span className="absolute bottom-[10px] left-[10px] rounded-full bg-[#0e0300]/85 px-[10px] py-[3px] text-[11px] font-medium text-white backdrop-blur-sm">
                  {t.region}
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <span className="inline-block rounded-full bg-[#faf6f2] px-[10px] py-[3px] font-mono text-[11px] font-medium text-[#5f4837]">
                    {t.corridor}
                  </span>
                  <blockquote className="m-0 mt-[12px] font-['KoHo',sans-serif] text-[17px] leading-[25px] text-[#0f2a2b]">
                    {t.quote}
                  </blockquote>
                </div>
                <div className="mt-[18px] flex flex-col gap-[10px]">
                  <Stars />
                  <Person
                    name={t.name}
                    nativeName={t.nativeName}
                    role={t.role}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[64px]">
          <Badge>APAC &amp; Global Clearing Network</Badge>
          <h2 className="m-0 mt-[12px] font-['Gilda_Display',serif] text-[32px] font-normal md:text-[42px]">
            Licensed Pay Co., Ltd. &amp; Pte. Ltd. Ecosystem
          </h2>
          <div className="mt-[24px] grid gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
            {ASIAN_PAY_PARTNERS.map((partner) => (
              <div
                key={partner.entity}
                className="flex flex-col justify-between rounded-[18px] border border-[#312c2c]/12 bg-white p-[22px] shadow-[0_10px_28px_-18px_rgba(49,44,44,0.2)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-[8px]">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#e83f20]">
                      {partner.hub}
                    </span>
                    <span className="rounded-[6px] bg-[#feebe6] px-[8px] py-[2px] text-[12px] font-medium text-[#302d2c]">
                      {partner.native}
                    </span>
                  </div>
                  <h3 className="m-0 mt-[12px] font-['Gilda_Display',serif] text-[24px] font-normal text-[#302d2c]">
                    {partner.entity}
                  </h3>
                </div>
                <p className="m-0 mt-[14px] border-t border-[#312c2c]/10 pt-[10px] font-mono text-[12px] text-[#5f4837]">
                  Active Rails: {partner.rail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[64px] rounded-[24px] bg-[#0e0300] p-[24px] text-white md:p-[40px]">
          <div className="flex flex-wrap items-center justify-between gap-[16px]">
            <div>
              <Badge dark>Live Network Telemetry</Badge>
              <h2 className="m-0 mt-[12px] font-['Gilda_Display',serif] text-[32px] font-normal md:text-[42px]">
                90-Day Multi-Rail Uptime &amp; P99 Latency
              </h2>
            </div>
            <span className="inline-flex items-center gap-[8px] rounded-full border border-[#04DA8C]/40 bg-[#04DA8C]/10 px-[14px] py-[6px] text-[13px] font-medium text-[#04DA8C]">
              <span className="size-[8px] animate-pulse rounded-full bg-[#04DA8C]" />
              All 180+ Corridors Operational
            </span>
          </div>

          <div className="mt-[24px] divide-y divide-white/10">
            {RAIL_UPTIME.map((r) => (
              <div
                key={r.rail}
                className="flex flex-wrap items-center justify-between gap-[12px] py-[16px]"
              >
                <span className="text-[16px] font-medium">{r.rail}</span>
                <div className="flex items-center gap-[24px]">
                  <span className="font-mono text-[14px] text-[#04DA8C]">
                    Uptime {r.uptime}
                  </span>
                  <span className="font-mono text-[14px] text-[#eedcd0]">
                    P99 {r.p99}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[48px] grid gap-[16px] sm:grid-cols-2 lg:grid-cols-5">
          {COMPLIANCE_BADGES.map((b) => (
            <div
              key={b.code}
              className="rounded-[18px] border border-[#312c2c]/15 bg-white p-[20px]"
            >
              <p className="m-0 font-['Gilda_Display',serif] text-[22px] text-[#e83f20]">
                {b.code}
              </p>
              <p className="m-0 mt-[8px] text-[14px] leading-[21px] text-[#5f4837]">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Page 7: Contact & Sandbox Provisioning (#/contact) ───────────
function ContactSandboxPage({
  onNavigate,
}: {
  onNavigate: (route: PageRoute) => void;
}) {
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [volume, setVolume] = useState('$5M – $25M / mo');
  const [selectedRails, setSelectedRails] = useState<string[]>([
    'USDC / USDT',
    'BTC / ETH',
    'SEPA / FedNow',
  ]);
  const [sandboxKey, setSandboxKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const toggleRail = (rail: string) => {
    setSelectedRails((prev) =>
      prev.includes(rail) ? prev.filter((r) => r !== rail) : [...prev, rail],
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const randomHex = Math.random().toString(36).substring(2, 14).toUpperCase();
    setSandboxKey(`neth3_sandbox_live_${randomHex}`);
  };

  const handleCopyKey = () => {
    if (!sandboxKey) return;
    copyTextSafe(sandboxKey).then(() => {
      setCopiedKey(true);
      window.setTimeout(() => setCopiedKey(false), 1800);
    });
  };

  return (
    <div className="bg-[#eeded0] text-[#302d2c]">
      <SubpageHeader
        badge="Contact & Sandbox"
        titleLead="Start Settling On"
        titleAccent="Neth3"
        titleEnd="Today."
        subtitle="Provision instant sandbox API credentials in seconds or connect directly with our Americas, EMEA, and APAC institutional liquidity desks."
        onNavigate={onNavigate}
      />

      <section className="mx-auto max-w-[1360px] px-[20px] py-[64px] md:px-[64px]">
        <div className="grid gap-[32px] lg:grid-cols-12">
          <form
            onSubmit={handleSubmit}
            className="rounded-[24px] bg-white p-[26px] shadow-[0_20px_50px_-24px_rgba(49,44,44,0.2)] md:p-[40px] lg:col-span-7"
          >
            <Badge>Instant Developer Onboarding</Badge>
            <h2 className="m-0 mt-[12px] font-['Gilda_Display',serif] text-[32px] font-normal md:text-[42px]">
              Generate Sandbox API Credentials
            </h2>

            <div className="mt-[24px] grid gap-[18px] sm:grid-cols-2">
              <div>
                <label className="block text-[13px] font-medium text-[#5f4837]">
                  Company / Protocol Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Acme Treasury Ltd."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-[6px] w-full rounded-[10px] border border-[#312c2c]/20 bg-[#faf6f2] px-[14px] py-[11px] text-[15px] text-[#302d2c] outline-none focus:border-[#e83f20]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#5f4837]">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="engineering@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-[6px] w-full rounded-[10px] border border-[#312c2c]/20 bg-[#faf6f2] px-[14px] py-[11px] text-[15px] text-[#302d2c] outline-none focus:border-[#e83f20]"
                />
              </div>
            </div>

            <div className="mt-[18px]">
              <label className="block text-[13px] font-medium text-[#5f4837]">
                Projected Monthly Settlement Volume
              </label>
              <select
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="mt-[6px] w-full cursor-pointer rounded-[10px] border border-[#312c2c]/20 bg-[#faf6f2] px-[14px] py-[11px] text-[15px] text-[#302d2c] outline-none focus:border-[#e83f20]"
              >
                <option>$500K – $5M / mo</option>
                <option>$5M – $25M / mo</option>
                <option>$25M – $100M / mo</option>
                <option>$100M+ / mo (Enterprise Treasury)</option>
              </select>
            </div>

            <div className="mt-[18px]">
              <label className="block text-[13px] font-medium text-[#5f4837]">
                Target Rails &amp; Digital Assets
              </label>
              <div className="mt-[8px] flex flex-wrap gap-[8px]">
                {[
                  'USDC / USDT',
                  'EURC / PYUSD',
                  'BTC / ETH',
                  'SOL / L2s',
                  'SEPA / FedNow',
                  'PIX / SPEI / FAST',
                ].map((rail) => {
                  const active = selectedRails.includes(rail);
                  return (
                    <button
                      key={rail}
                      type="button"
                      onClick={() => toggleRail(rail)}
                      className={`cursor-pointer rounded-full border px-[13px] py-[6px] text-[13px] font-medium transition-colors ${
                        active
                          ? 'border-[#e83f20] bg-[#e83f20] text-white'
                          : 'border-[#312c2c]/20 bg-[#faf6f2] text-[#302d2c]'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {rail}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-[28px] flex flex-wrap items-center gap-[14px]">
              <button
                type="submit"
                className="cursor-pointer rounded-[10px] border-0 bg-[#e83f20] px-[24px] py-[12px] text-[16px] font-medium text-white transition-transform hover:-translate-y-[2px] hover:bg-[#0e0300]"
              >
                Mint Sandbox API Key
              </button>
              <span className="text-[13px] text-[#8e869c]">
                Includes $1,000,000 test USDC &amp; simulated RTP rails
              </span>
            </div>

            {sandboxKey && (
              <div className="mt-[24px] rounded-[16px] border border-[#04DA8C]/40 bg-[#0e0300] p-[18px] text-white">
                <div className="flex flex-wrap items-center justify-between gap-[10px]">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#04DA8C]">
                    ✓ Sandbox Environment Ready for {company || 'Your Team'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="cursor-pointer rounded-[8px] border border-white/20 bg-white/10 px-[10px] py-[4px] text-[12px] text-white hover:bg-white/20"
                  >
                    {copiedKey ? 'Copied!' : 'Copy Key'}
                  </button>
                </div>
                <code className="mt-[8px] block font-mono text-[15px] text-[#eedcd0]">
                  {sandboxKey}
                </code>
                <p className="m-0 mt-[6px] text-[12px] text-white/65">
                  Enabled rails: {selectedRails.join(' · ')} ({volume}) ·
                  Receipt sent to {email}
                </p>
              </div>
            )}
          </form>

          <div className="flex flex-col gap-[16px] lg:col-span-5">
            {[
              {
                region: 'Americas Liquidity Desk',
                city: 'New York · São Paulo · Mexico City',
                rails: 'FedNow, RTP, ACH, PIX, SPEI, USDC',
                hours: '24/7 Automated + Institutional Desk',
              },
              {
                region: 'EMEA Clearing Hub',
                city: 'London · Zurich · Frankfurt · Dubai',
                rails: 'SEPA Instant, UK Faster Payments, EURC',
                hours: '24/7 Automated + Institutional Desk',
              },
              {
                region: 'APAC Settlement Hub',
                city: 'Singapore · Tokyo · Hong Kong · Sydney',
                rails: 'FAST, Zengin, PayNow, USDT, SOL',
                hours: '24/7 Automated + Institutional Desk',
              },
            ].map((desk) => (
              <div
                key={desk.region}
                className="rounded-[20px] bg-[#0e0300] p-[24px] text-white"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#e83f20]">
                  {desk.city}
                </span>
                <h3 className="m-0 mt-[6px] font-['Gilda_Display',serif] text-[26px] font-normal">
                  {desk.region}
                </h3>
                <p className="m-0 mt-[8px] text-[14px] text-white/75">
                  Primary Rails: {desk.rails}
                </p>
                <p className="m-0 mt-[6px] text-[12px] text-[#04DA8C]">
                  {desk.hours}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Application Shell (Routes Between Overview & All 7 Payment Pages)
// ─────────────────────────────────────────────────────────────

export function App() {
  const [route, setRoute] = useState<PageRoute>('home');

  useEffect(() => {
    document.title = 'Neth3 — A Payment Frontier';
    document.body.style.backgroundColor = '#eedcd0';
    document.body.style.margin = '0';

    const syncFromHash = () => {
      const h = window.location.hash.replace(/^#\/?/, '');
      if (!h) {
        setRoute('home');
        return;
      }
      const matched = NAV_LINKS.find(
        (n) => n.route === h || n.hash.replace(/^#\/?/, '') === h,
      );
      if (matched) setRoute(matched.route);
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('popstate', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('popstate', syncFromHash);
    };
  }, []);

  const navigate = (nextRoute: PageRoute) => {
    setRoute(nextRoute);
    const target = NAV_LINKS.find((n) => n.route === nextRoute);
    if (target && typeof window !== 'undefined') {
      try {
        window.history.pushState(null, '', target.hash);
      } catch {
        try {
          window.history.replaceState(null, '', target.hash);
        } catch {
          // ignore sandboxed history restrictions
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#eedcd0]">
      <Navbar currentRoute={route} onNavigate={navigate} />

      {route === 'home' && (
        <>
          <HeroSection onNavigate={navigate} />
          <PlatformSection onNavigate={navigate} />
          <CapabilitiesSection onNavigate={navigate} />
          <CorridorsSection onNavigate={navigate} />
          <CaseStudiesSection onNavigate={navigate} />
          <ProcessSection />
          <TestimonialsSection />
          <CTASection onNavigate={navigate} />
        </>
      )}

      {route === 'about' && <AboutArchitecturePage onNavigate={navigate} />}
      {route === 'capabilities' && <CapabilitiesPage onNavigate={navigate} />}
      {route === 'corridors' && <GlobalCorridorsPage onNavigate={navigate} />}
      {route === 'case-studies' && <CaseStudiesPage onNavigate={navigate} />}
      {route === 'process' && <SettlementProcessPage onNavigate={navigate} />}
      {route === 'testimonials' && <TestimonialsSLAPage onNavigate={navigate} />}
      {route === 'contact' && <ContactSandboxPage onNavigate={navigate} />}

      <FooterSection onNavigate={navigate} />
    </main>
  );
}

export default App;
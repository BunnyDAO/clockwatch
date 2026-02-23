import React, { useState, useEffect } from 'react';

interface CityConfig {
  name: string;
  country: string;
  timezone: string;
  emoji: string;
  accent: string;
  bgGradient: string;
  borderColor: string;
  glowColor: string;
}

const cities: CityConfig[] = [
  {
    name: 'Seattle',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    emoji: '🌲',
    accent: 'text-emerald-400',
    bgGradient: 'from-emerald-950/40 to-teal-950/20',
    borderColor: 'border-emerald-800/40',
    glowColor: 'shadow-emerald-900/30',
  },
  {
    name: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    emoji: '🎡',
    accent: 'text-sky-400',
    bgGradient: 'from-sky-950/40 to-blue-950/20',
    borderColor: 'border-sky-800/40',
    glowColor: 'shadow-sky-900/30',
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    timezone: 'Europe/Madrid',
    emoji: '🏟️',
    accent: 'text-amber-400',
    bgGradient: 'from-amber-950/40 to-yellow-950/20',
    borderColor: 'border-amber-800/40',
    glowColor: 'shadow-amber-900/30',
  },
  {
    name: 'Seoul',
    country: 'South Korea',
    timezone: 'Asia/Seoul',
    emoji: '🏯',
    accent: 'text-rose-400',
    bgGradient: 'from-rose-950/40 to-pink-950/20',
    borderColor: 'border-rose-800/40',
    glowColor: 'shadow-rose-900/30',
  },
];

function getTimeData(timezone: string) {
  const now = new Date();

  const timeStr = now.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateStr = now.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const hour = parseInt(
    now.toLocaleString('en-US', { timeZone: timezone, hour: 'numeric', hour12: false })
  );

  let period = '';
  let periodEmoji = '';
  if (hour >= 5 && hour < 12) {
    period = 'Morning';
    periodEmoji = '🌅';
  } else if (hour >= 12 && hour < 17) {
    period = 'Afternoon';
    periodEmoji = '☀️';
  } else if (hour >= 17 && hour < 21) {
    period = 'Evening';
    periodEmoji = '🌆';
  } else {
    period = 'Night';
    periodEmoji = '🌙';
  }

  const offsetStr = now.toLocaleString('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
  }).split(', ')[1]?.split(' ').pop() || '';

  return { timeStr, dateStr, period, periodEmoji, offsetStr };
}

function AnalogClock({ timezone, accent }: { timezone: string; accent: string }) {
  const [angles, setAngles] = useState({ hour: 0, minute: 0, second: 0 });

  useEffect(() => {
    function update() {
      const now = new Date();
      const parts = now.toLocaleString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).split(':').map(Number);

      const [h, m, s] = parts;
      const hourAngle = ((h % 12) / 12) * 360 + (m / 60) * 30;
      const minuteAngle = (m / 60) * 360 + (s / 60) * 6;
      const secondAngle = (s / 60) * 360;
      setAngles({ hour: hourAngle, minute: minuteAngle, second: secondAngle });
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const accentColorMap: Record<string, string> = {
    'text-emerald-400': '#34d399',
    'text-sky-400': '#38bdf8',
    'text-rose-400': '#fb7185',
    'text-amber-400': '#fbbf24',
  };
  const accentHex = accentColorMap[accent] || '#34d399';

  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  const tickMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    const outer = r - 2;
    const inner = r - 10;
    return {
      x1: cx + outer * Math.cos(rad),
      y1: cy + outer * Math.sin(rad),
      x2: cx + inner * Math.cos(rad),
      y2: cy + inner * Math.sin(rad),
    };
  });

  function handCoords(angleDeg: number, length: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + length * Math.cos(rad),
      y: cy + length * Math.sin(rad),
    };
  }

  const hourEnd = handCoords(angles.hour, r * 0.5);
  const minuteEnd = handCoords(angles.minute, r * 0.7);
  const secondEnd = handCoords(angles.second, r * 0.8);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {/* Face */}
      <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />

      {/* Tick marks */}
      {tickMarks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1}
          x2={t.x2} y2={t.y2}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={i % 3 === 0 ? 2 : 1}
          strokeLinecap="round"
        />
      ))}

      {/* Hour hand */}
      <line
        x1={cx} y1={cy}
        x2={hourEnd.x} y2={hourEnd.y}
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Minute hand */}
      <line
        x1={cx} y1={cy}
        x2={minuteEnd.x} y2={minuteEnd.y}
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Second hand */}
      <line
        x1={cx} y1={cy}
        x2={secondEnd.x} y2={secondEnd.y}
        stroke={accentHex}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r="3" fill={accentHex} />
    </svg>
  );
}

function ClockCard({ city }: { city: CityConfig }) {
  const [timeData, setTimeData] = useState(() => getTimeData(city.timezone));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeData(getTimeData(city.timezone));
    }, 1000);
    return () => clearInterval(interval);
  }, [city.timezone]);

  const [hours, minutes, seconds] = timeData.timeStr.split(':');

  return (
    <div
      className={`relative rounded-2xl border ${city.borderColor} bg-gradient-to-br ${city.bgGradient} p-6 md:p-8 shadow-2xl ${city.glowColor} transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl`}
      role="region"
      aria-label={`Current time in ${city.name}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl" role="img" aria-label={city.name}>{city.emoji}</span>
            <h2 className="text-white font-semibold text-xl tracking-tight">{city.name}</h2>
          </div>
          <p className="text-white/40 text-sm font-medium">{city.country}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 ${city.accent}`}>
            {timeData.offsetStr}
          </span>
          <span className="text-white/40 text-xs">
            {timeData.periodEmoji} {timeData.period}
          </span>
        </div>
      </div>

      {/* Main clock display */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Digital time */}
        <div className="flex-1">
          <div className="flex items-baseline gap-0.5">
            <span className={`font-mono font-bold text-5xl md:text-6xl text-white leading-none tabular-nums`}>
              {hours}
            </span>
            <span className={`font-mono font-bold text-5xl md:text-6xl ${city.accent} leading-none animate-pulse`}>:</span>
            <span className={`font-mono font-bold text-5xl md:text-6xl text-white leading-none tabular-nums`}>
              {minutes}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className={`font-mono text-xl font-medium ${city.accent} tabular-nums`}>
              :{seconds}
            </span>
            <span className="text-white/30 text-xs">sec</span>
          </div>
        </div>

        {/* Analog clock */}
        <div className="flex-shrink-0">
          <AnalogClock timezone={city.timezone} accent={city.accent} />
        </div>
      </div>

      {/* Date */}
      <div className="border-t border-white/8 pt-4">
        <p className="text-white/50 text-sm font-medium">{timeData.dateStr}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-900/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-15%] w-[500px] h-[500px] rounded-full bg-sky-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-rose-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/50 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
            Live World Clock
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">
            Clock<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-sky-400 to-rose-400">watch</span>
          </h1>
          <p className="text-white/40 text-lg max-w-lg mx-auto">
            Real-time clocks across the globe — Seattle, London, Barcelona, and Seoul at a glance.
          </p>
        </header>

        {/* Clock cards */}
        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {cities.map((city) => (
              <ClockCard key={city.name} city={city} />
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-white/20 text-sm">
          <p>Times update every second &middot; All times are local to each city</p>
        </footer>
      </div>
    </div>
  );
}

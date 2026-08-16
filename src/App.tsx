import { useState, useEffect } from 'react'
import { PetProvider, usePetLogic } from '../context/PetContext'

// Stat configuration
const getStatConfig = (key: string) => {
  const statMap: Record<string, { label: string; color: string; trackColor: string; icon: any }> = {
    energy: {
      label: 'Energy',
      color: '#F2C94C',
      trackColor: '#FEF5D4',
      icon: EnergyIcon,
    },
    hunger: {
      label: 'Hunger',
      color: '#8BAF7C',
      trackColor: '#E8F2E4',
      icon: HungerIcon,
    },
    happiness: {
      label: 'Happiness',
      color: '#F4A0B0',
      trackColor: '#FDEEF1',
      icon: HappyIcon,
    },
  }
  return statMap[key]
}

function EnergyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path
        d="M8.5 1.5L3 8h4.5L5.5 12.5 11 6H6.5L8.5 1.5z"
        fill="#D4A010"
        stroke="#D4A010"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HungerIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <ellipse cx="7" cy="5.5" rx="3" ry="3.5" fill="#6A9A5A" />
      <path d="M5.5 4C5.5 4 6 2.5 7 2.2" stroke="#4A7A3A" strokeWidth="1" strokeLinecap="round" />
      <rect x="4.5" y="8.5" width="5" height="4" rx="2" fill="#6A9A5A" />
    </svg>
  )
}

function HappyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" fill="#F4A0B0" stroke="#E07090" strokeWidth="0.8" />
      <circle cx="5" cy="5.8" r="0.8" fill="#C04070" />
      <circle cx="9" cy="5.8" r="0.8" fill="#C04070" />
      <path d="M4.5 8.5C5 9.8 9 9.8 9.5 8.5" stroke="#C04070" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function StatBar({ stat, value }: { stat: ReturnType<typeof getStatConfig>; value: number }) {
  const Icon = stat.icon
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: 22, height: 22, backgroundColor: stat.trackColor, flexShrink: 0 }}
      >
        <Icon size={12} />
      </div>
      <div className="flex-1 relative" style={{ height: 9 }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: stat.trackColor }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: stat.color }}
        />
      </div>
      <span
        className="text-xs font-bold tabular-nums"
        style={{ color: '#7A6A5A', minWidth: 28, textAlign: 'right', fontSize: 11 }}
      >
        {Math.round(value)}%
      </span>
    </div>
  )
}

// The pet SVG — a cozy blob-like creature looking sleepy/tired
function PetSprite() {
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" fill="none">
      {/* Shadow */}
      <ellipse cx="65" cy="118" rx="32" ry="7" fill="rgba(100,70,40,0.10)" />
      {/* Body */}
      <ellipse cx="65" cy="80" rx="38" ry="34" fill="#C4A882" />
      {/* Belly patch */}
      <ellipse cx="65" cy="88" rx="22" ry="18" fill="#DEC9A8" />
      {/* Left ear */}
      <ellipse cx="34" cy="52" rx="10" ry="13" fill="#C4A882" transform="rotate(-15 34 52)" />
      <ellipse cx="34" cy="52" rx="6" ry="8" fill="#E8C4B0" transform="rotate(-15 34 52)" />
      {/* Right ear */}
      <ellipse cx="96" cy="52" rx="10" ry="13" fill="#C4A882" transform="rotate(15 96 52)" />
      <ellipse cx="96" cy="52" rx="6" ry="8" fill="#E8C4B0" transform="rotate(15 96 52)" />
      {/* Head */}
      <circle cx="65" cy="60" r="30" fill="#D4B490" />
      {/* Cheek blushes */}
      <ellipse cx="44" cy="68" rx="7" ry="4.5" fill="#F4A0B0" opacity="0.5" />
      <ellipse cx="86" cy="68" rx="7" ry="4.5" fill="#F4A0B0" opacity="0.5" />
      {/* Tired left eye — half closed */}
      <ellipse cx="54" cy="60" rx="6" ry="6" fill="white" />
      <path d="M48 60 Q54 57 60 60" fill="#D4B490" />
      <ellipse cx="54" cy="61" rx="3.5" ry="3.5" fill="#5A3A20" />
      <circle cx="55.5" cy="59.5" r="1" fill="white" />
      {/* Tired right eye — half closed */}
      <ellipse cx="76" cy="60" rx="6" ry="6" fill="white" />
      <path d="M70 60 Q76 57 82 60" fill="#D4B490" />
      <ellipse cx="76" cy="61" rx="3.5" ry="3.5" fill="#5A3A20" />
      <circle cx="77.5" cy="59.5" r="1" fill="white" />
      {/* Nose */}
      <ellipse cx="65" cy="68" rx="3" ry="2" fill="#A07850" />
      {/* Small neutral mouth */}
      <path d="M60 73 Q65 75 70 73" stroke="#A07850" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Tiny Zzz */}
      <text x="92" y="42" fontSize="10" fill="#C4A882" fontFamily="Nunito, sans-serif" fontWeight="800">z</text>
      <text x="98" y="34" fontSize="13" fill="#B0909A" fontFamily="Nunito, sans-serif" fontWeight="800">z</text>
    </svg>
  )
}

// Cozy room background
function CozyRoom() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 340 200" preserveAspectRatio="xMidYMid slice" fill="none">
      {/* Wall */}
      <rect width="340" height="200" fill="#F5E8D0" />
      {/* Wallpaper subtle dots */}
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 14 }, (_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={col * 26 + 13}
            cy={row * 26 + 13}
            r="2"
            fill="#E8D4B8"
          />
        ))
      )}
      {/* Floor */}
      <rect x="0" y="148" width="340" height="52" fill="#C9A87C" />
      {/* Floor highlight */}
      <rect x="0" y="148" width="340" height="6" fill="#D4B88C" />
      {/* Baseboard */}
      <rect x="0" y="148" width="340" height="4" fill="#B89060" />
      {/* Window */}
      <rect x="240" y="24" width="72" height="90" rx="6" fill="#B8D8E8" stroke="#C4A882" strokeWidth="2.5" />
      <rect x="240" y="24" width="72" height="90" rx="6" fill="url(#windowLight)" opacity="0.6" />
      {/* Window frame cross */}
      <line x1="276" y1="24" x2="276" y2="114" stroke="#C4A882" strokeWidth="2" />
      <line x1="240" y1="69" x2="312" y2="69" stroke="#C4A882" strokeWidth="2" />
      {/* Window curtains */}
      <path d="M232 20 Q240 60 236 114" fill="#F4A0B0" opacity="0.7" />
      <path d="M318 20 Q310 60 314 114" fill="#F4A0B0" opacity="0.7" />
      {/* Curtain tops */}
      <rect x="228" y="16" width="94" height="8" rx="4" fill="#E87898" opacity="0.6" />
      {/* Plant on left */}
      <rect x="18" y="118" width="28" height="30" rx="4" fill="#C4A882" />
      <rect x="20" y="116" width="24" height="6" rx="2" fill="#B09070" />
      <ellipse cx="32" cy="108" rx="16" ry="18" fill="#7AAA60" />
      <ellipse cx="22" cy="100" rx="10" ry="12" fill="#8ABB70" />
      <ellipse cx="42" cy="102" rx="10" ry="12" fill="#6A9A50" />
      {/* Small rug */}
      <ellipse cx="170" cy="164" rx="90" ry="20" fill="#E8A878" opacity="0.4" />
      <ellipse cx="170" cy="164" rx="72" ry="15" fill="#E8986A" opacity="0.3" />
      <defs>
        <linearGradient id="windowLight" x1="240" y1="24" x2="312" y2="114" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#B8D8E8" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
        stroke={active ? '#E8845A' : '#B0A090'}
        strokeWidth="1.8"
        fill={active ? '#FDE8DC' : 'none'}
        strokeLinejoin="round"
      />
      <rect x="8" y="13" width="6" height="7" rx="1" fill={active ? '#E8845A' : '#B0A090'} />
    </svg>
  )
}

function StatsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="12" width="4" height="8" rx="1.5" fill={active ? '#E8845A' : '#B0A090'} />
      <rect x="9" y="7" width="4" height="13" rx="1.5" fill={active ? '#E8845A' : '#B0A090'} />
      <rect x="15" y="4" width="4" height="16" rx="1.5" fill={active ? '#E8845A' : '#B0A090'} />
    </svg>
  )
}

function ShopIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M4 6h14l-2 9H6L4 6z"
        stroke={active ? '#E8845A' : '#B0A090'}
        strokeWidth="1.8"
        fill={active ? '#FDE8DC' : 'none'}
        strokeLinejoin="round"
      />
      <circle cx="9" cy="18.5" r="1.5" fill={active ? '#E8845A' : '#B0A090'} />
      <circle cx="15" cy="18.5" r="1.5" fill={active ? '#E8845A' : '#B0A090'} />
      <path d="M2 3h2.5l1.5 3" stroke={active ? '#E8845A' : '#B0A090'} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="3" stroke={active ? '#E8845A' : '#B0A090'} strokeWidth="1.8" />
      <path
        d="M11 2v2M11 18v2M2 11h2M18 11h2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M4.22 17.78l1.42-1.42M16.36 5.64l1.42-1.42"
        stroke={active ? '#E8845A' : '#B0A090'}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

const NAV_ITEMS = [
  { key: 'home', label: 'Home', Icon: HomeIcon },
  { key: 'stats', label: 'Stats', Icon: StatsIcon },
  { key: 'shop', label: 'Shop', Icon: ShopIcon },
  { key: 'settings', label: 'Settings', Icon: SettingsIcon },
]

export default function App() {
  return (
    <PetProvider>
      <AppContent />
    </PetProvider>
  )
}

function AppContent() {
  const { pet, setPet, depleteStats } = usePetLogic()
  const [activeNav, setActiveNav] = useState('home')
  const [focusMode, setFocusMode] = useState(false)
  const [mealLogged, setMealLogged] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null)
  const [isBouncing, setIsBouncing] = useState(false)

  // Deplete stats every 30 seconds (simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      depleteStats()
    }, 30000)
    return () => clearInterval(interval)
  }, [depleteStats])

  const handleTimer = () => {
    if (timerActive) {
      if (timerInterval) clearInterval(timerInterval)
      setTimerInterval(null)
      setTimerActive(false)
    } else {
      setTimerActive(true)
      const id = setInterval(() => setTimerSeconds((s) => s + 1), 1000)
      setTimerInterval(id)
    }
  }

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const now = new Date()
  const greeting =
    now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#FDFBF7',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 0 env(safe-area-inset-bottom)',
      }}
    >
      {/* Phone frame */}
      <div
        style={{
          width: '100%',
          maxWidth: 390,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: '#FDFBF7',
          overflow: 'hidden',
        }}
      >
        {/* Focus Mode overlay */}
        {focusMode && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(58, 46, 40, 0.45)',
              zIndex: 20,
              backdropFilter: 'grayscale(0.6) brightness(0.85)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Status bar */}
        <div
          style={{
            padding: '14px 24px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13, color: '#7A6A5A' }}>
            9:41
          </span>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {/* Signal */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <rect x="0" y="6" width="3" height="6" rx="1" fill="#7A6A5A" />
              <rect x="4.5" y="4" width="3" height="8" rx="1" fill="#7A6A5A" />
              <rect x="9" y="2" width="3" height="10" rx="1" fill="#7A6A5A" />
              <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#7A6A5A" opacity="0.35" />
            </svg>
            {/* Battery */}
            <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
              <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke="#7A6A5A" strokeWidth="1" />
              <rect x="2" y="2" width="12" height="8" rx="1.5" fill="#8BAF7C" />
              <path d="M19.5 4v4" stroke="#7A6A5A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Header */}
        <div style={{ padding: '12px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'Nunito Sans, sans-serif', fontSize: 13, color: '#9A8A7A', margin: 0 }}>
              {greeting}, Alex 👋
            </p>
            <h1
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 900,
                fontSize: 22,
                color: '#3A2E28',
                margin: '2px 0 0',
              }}
            >
              Mochi needs you!
            </h1>
          </div>
          {/* Avatar */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F5A87A 0%, #E8845A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 800,
              fontSize: 16,
              color: 'white',
            }}
          >
            A
          </div>
        </div>

        {/* Stat bars */}
        <div
          style={{
            margin: '14px 20px 0',
            backgroundColor: 'white',
            borderRadius: 20,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            boxShadow: '0 2px 12px rgba(100,70,40,0.08)',
            border: '1px solid rgba(200,180,160,0.25)',
          }}
        >
          {(['energy', 'hunger', 'happiness'] as const).map((key) => {
            const stat = getStatConfig(key)
            const value = pet[key]
            return <StatBar key={key} stat={stat} value={value} />
          })}
        </div>

        {/* Pet room */}
        <div
          style={{
            margin: '14px 20px 0',
            borderRadius: 24,
            overflow: 'hidden',
            position: 'relative',
            height: 210,
            boxShadow: '0 4px 20px rgba(100,70,40,0.13)',
            border: '2px solid rgba(200,180,160,0.3)',
          }}
        >
          {/* Room bg */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <CozyRoom />
          </div>
          {/* Pet */}
          <div
            onClick={() => {
              setIsBouncing(true)
              setPet((prev) => ({
                ...prev,
                happiness: Math.min(100, prev.happiness + 5),
              }))
              setTimeout(() => setIsBouncing(false), 600)
            }}
            className={isBouncing ? 'pet-bounce' : 'pet-breathing'}
            style={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              cursor: 'pointer',
            }}
          >
            <PetSprite />
          </div>
          {/* Status badge */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: 'rgba(253,251,247,0.92)',
              borderRadius: 20,
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              boxShadow: '0 1px 6px rgba(100,70,40,0.10)',
            }}
          >
            <span style={{ fontSize: 12 }}>😴</span>
            <span
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 700,
                fontSize: 11,
                color: '#9A7A5A',
              }}
            >
              Sleepy
            </span>
          </div>
          {/* Level badge */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(139,175,124,0.18)',
              borderRadius: 20,
              padding: '4px 10px',
              border: '1px solid rgba(139,175,124,0.4)',
            }}
          >
            <span
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 800,
                fontSize: 11,
                color: '#5A8A4A',
              }}
            >
              Lv. 7
            </span>
          </div>
        </div>

        {/* Step count strip */}
        <div
          style={{
            margin: '10px 20px 0',
            background: 'linear-gradient(135deg, #FDE8DC 0%, #F5F0E8 100%)',
            borderRadius: 14,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(232,132,90,0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>👟</span>
            <div>
              <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 16, color: '#3A2E28', margin: 0 }}>
                3,241
              </p>
              <p style={{ fontFamily: 'Nunito Sans, sans-serif', fontSize: 11, color: '#9A8A7A', margin: 0 }}>
                steps today
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 12, color: '#E8845A', margin: 0 }}>
              Goal: 8,000
            </p>
            <div
              style={{
                marginTop: 4,
                height: 5,
                width: 90,
                backgroundColor: 'rgba(232,132,90,0.2)',
                borderRadius: 99,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(3241 / 8000) * 100}%`,
                  backgroundColor: '#E8845A',
                  borderRadius: 99,
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ margin: '16px 20px 0' }}>
          <h2
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 800,
              fontSize: 16,
              color: '#3A2E28',
              margin: '0 0 10px',
            }}
          >
            Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {/* Log Meal */}
            <button
              onClick={() => {
                setMealLogged(!mealLogged)
                setPet((prev) => ({
                  ...prev,
                  hunger: Math.min(100, prev.hunger + 25),
                }))
              }}
              style={{
                background: mealLogged
                  ? 'linear-gradient(135deg, #8BAF7C 0%, #6A9A5A 100%)'
                  : 'white',
                border: `1.5px solid ${mealLogged ? '#6A9A5A' : 'rgba(200,180,160,0.3)'}`,
                borderRadius: 18,
                padding: '14px 14px',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: mealLogged
                  ? '0 4px 14px rgba(106,154,90,0.25)'
                  : '0 2px 10px rgba(100,70,40,0.07)',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: mealLogged ? 'rgba(255,255,255,0.25)' : '#E8F2E4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                  fontSize: 18,
                }}
              >
                📷
              </div>
              <p
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 800,
                  fontSize: 13,
                  color: mealLogged ? 'white' : '#3A2E28',
                  margin: 0,
                }}
              >
                {mealLogged ? 'Meal Logged ✓' : 'Log Meal'}
              </p>
              <p
                style={{
                  fontFamily: 'Nunito Sans, sans-serif',
                  fontSize: 11,
                  color: mealLogged ? 'rgba(255,255,255,0.8)' : '#9A8A7A',
                  margin: '2px 0 0',
                }}
              >
                {mealLogged ? 'Mochi is happy!' : 'Feed your pet'}
              </p>
            </button>

            {/* Hobby Timer */}
            <button
              onClick={handleTimer}
              style={{
                background: timerActive
                  ? 'linear-gradient(135deg, #E8845A 0%, #D06030 100%)'
                  : 'white',
                border: `1.5px solid ${timerActive ? '#D06030' : 'rgba(200,180,160,0.3)'}`,
                borderRadius: 18,
                padding: '14px 14px',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: timerActive
                  ? '0 4px 14px rgba(232,132,90,0.30)'
                  : '0 2px 10px rgba(100,70,40,0.07)',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: timerActive ? 'rgba(255,255,255,0.25)' : '#FDE8DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                  fontSize: 18,
                }}
              >
                ⏱️
              </div>
              <p
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 800,
                  fontSize: 13,
                  color: timerActive ? 'white' : '#3A2E28',
                  margin: 0,
                }}
              >
                {timerActive ? formatTimer(timerSeconds) : 'Hobby Timer'}
              </p>
              <p
                style={{
                  fontFamily: 'Nunito Sans, sans-serif',
                  fontSize: 11,
                  color: timerActive ? 'rgba(255,255,255,0.8)' : '#9A8A7A',
                  margin: '2px 0 0',
                }}
              >
                {timerActive ? 'Tap to stop' : 'Start activity'}
              </p>
            </button>
          </div>

          {/* Focus Mode toggle */}
          <div
            style={{
              marginTop: 10,
              backgroundColor: focusMode
                ? 'rgba(58, 46, 40, 0.07)'
                : 'white',
              border: `1.5px solid ${focusMode ? 'rgba(58,46,40,0.18)' : 'rgba(200,180,160,0.3)'}`,
              borderRadius: 18,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 10px rgba(100,70,40,0.06)',
              zIndex: 30,
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: focusMode ? 'rgba(58,46,40,0.12)' : '#EDE0D8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                🎓
              </div>
              <div>
                <p
                  style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 800,
                    fontSize: 13,
                    color: '#3A2E28',
                    margin: 0,
                  }}
                >
                  Focus Mode
                </p>
                <p
                  style={{
                    fontFamily: 'Nunito Sans, sans-serif',
                    fontSize: 11,
                    color: '#9A8A7A',
                    margin: '2px 0 0',
                  }}
                >
                  {focusMode ? 'Work session active' : 'Work / School'}
                </p>
              </div>
            </div>
            {/* Toggle switch */}
            <button
              onClick={() => setFocusMode(!focusMode)}
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                backgroundColor: focusMode ? '#3A2E28' : '#E0D4C8',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.25s ease',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 3,
                  left: focusMode ? 23 : 3,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  transition: 'left 0.25s ease',
                }}
              />
            </button>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, minHeight: 16 }} />

        {/* Bottom Navigation */}
        <div
          style={{
            backgroundColor: 'white',
            borderTop: '1px solid rgba(200,180,160,0.25)',
            padding: '10px 0 20px',
            display: 'flex',
            justifyContent: 'space-around',
            boxShadow: '0 -4px 20px rgba(100,70,40,0.08)',
          }}
        >
          {NAV_ITEMS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveNav(key)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 12px',
              }}
            >
              <Icon active={activeNav === key} />
              <span
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: activeNav === key ? 800 : 600,
                  fontSize: 10,
                  color: activeNav === key ? '#E8845A' : '#B0A090',
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

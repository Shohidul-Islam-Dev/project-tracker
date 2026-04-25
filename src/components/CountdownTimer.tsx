import { useState, useEffect } from 'react';
import { Timer, AlertTriangle, CheckCircle2, Hourglass } from 'lucide-react';

interface CountdownTimerProps {
  deadline: string; // date string like "2025-02-28"
  status: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeLeft(deadline: string): TimeLeft {
  const end = new Date(deadline + 'T23:59:59').getTime();
  const now = Date.now();
  const total = end - now;

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
  };
}

export default function CountdownTimer({ deadline, status }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(deadline));

  useEffect(() => {
    if (!deadline) return;
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(deadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (!deadline) {
    return (
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Timer className="w-5 h-5 text-gray-500" />
          <p className="text-sm text-gray-400">Delivery Countdown</p>
        </div>
        <p className="text-gray-500 text-sm">No deadline set</p>
      </div>
    );
  }

  const isCompleted = status === 'completed' || status === 'cancelled';
  const isExpired = timeLeft.total <= 0 && !isCompleted;
  const isUrgent = timeLeft.days <= 3 && timeLeft.total > 0 && !isCompleted;
  const isWarning = timeLeft.days <= 7 && timeLeft.days > 3 && !isCompleted;

  // Colors based on urgency
  const borderColor = isCompleted
    ? 'border-green-500/30'
    : isExpired
    ? 'border-red-500/50'
    : isUrgent
    ? 'border-red-500/30'
    : isWarning
    ? 'border-yellow-500/30'
    : 'border-blue-500/30';

  const bgColor = isCompleted
    ? 'bg-green-500/5'
    : isExpired
    ? 'bg-red-500/10'
    : isUrgent
    ? 'bg-red-500/5'
    : isWarning
    ? 'bg-yellow-500/5'
    : 'bg-blue-500/5';

  const accentColor = isCompleted
    ? 'text-green-400'
    : isExpired
    ? 'text-red-400'
    : isUrgent
    ? 'text-red-400'
    : isWarning
    ? 'text-yellow-400'
    : 'text-blue-400';

  const boxBg = isCompleted
    ? 'bg-green-500/10 border-green-500/20'
    : isExpired
    ? 'bg-red-500/15 border-red-500/30'
    : isUrgent
    ? 'bg-red-500/10 border-red-500/20'
    : isWarning
    ? 'bg-yellow-500/10 border-yellow-500/20'
    : 'bg-gray-800/80 border-gray-700/50';

  const numberColor = isCompleted
    ? 'text-green-300'
    : isExpired
    ? 'text-red-300'
    : isUrgent
    ? 'text-red-300'
    : isWarning
    ? 'text-yellow-300'
    : 'text-white';

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className={`${bgColor} border ${borderColor} rounded-2xl p-5 col-span-full`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          ) : isExpired ? (
            <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
          ) : (
            <Hourglass className={`w-5 h-5 ${accentColor} ${isUrgent ? 'animate-pulse' : ''}`} />
          )}
          <p className={`text-sm font-semibold ${accentColor}`}>
            {isCompleted
              ? 'Project Delivered'
              : isExpired
              ? '⚠️ Deadline Overdue!'
              : 'Time Remaining to Delivery'}
          </p>
        </div>
        <span className="text-xs text-gray-500">
          Deadline: {deadline}
        </span>
      </div>

      {isCompleted ? (
        <p className="text-green-300 text-sm">This project has been completed.</p>
      ) : isExpired ? (
        <>
          <p className="text-red-300 text-sm mb-4">The delivery deadline has passed. Please update the deadline or complete the project.</p>
          <div className="grid grid-cols-4 gap-3">
            {units.map(u => (
              <div key={u.label} className={`text-center p-3 rounded-xl border ${boxBg}`}>
                <p className="text-3xl lg:text-4xl font-bold font-mono text-red-400">0</p>
                <p className="text-xs text-red-400/60 mt-1 uppercase tracking-wider">{u.label}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {units.map(u => (
            <div key={u.label} className={`text-center p-3 rounded-xl border ${boxBg} transition-all`}>
              <p className={`text-3xl lg:text-4xl font-bold font-mono ${numberColor} tabular-nums`}>
                {String(u.value).padStart(2, '0')}
              </p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{u.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Urgency message */}
      {isUrgent && !isExpired && (
        <p className="mt-3 text-xs text-red-400 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          Less than 3 days remaining — deadline is approaching fast!
        </p>
      )}
      {isWarning && (
        <p className="mt-3 text-xs text-yellow-400 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          Less than a week remaining until delivery.
        </p>
      )}
    </div>
  );
}

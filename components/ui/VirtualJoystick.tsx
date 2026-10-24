'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';

interface VirtualJoystickProps {
  onChange: (vector: { x: number; y: number }) => void;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ onChange }) => {
  const [active, setActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const baseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  const maxRadius = 45; // Max joystick knob displacement in pixels

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (touchIdRef.current !== null) return;
      const touch = e.changedTouches[0];
      touchIdRef.current = touch.identifier;
      setActive(true);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (touchIdRef.current === null || !baseRef.current) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchIdRef.current) {
          const rect = baseRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          let deltaX = touch.clientX - centerX;
          let deltaY = touch.clientY - centerY;

          const distance = Math.hypot(deltaX, deltaY);
          if (distance > maxRadius) {
            deltaX = (deltaX / distance) * maxRadius;
            deltaY = (deltaY / distance) * maxRadius;
          }

          setKnobPos({ x: deltaX, y: deltaY });

          // Normalize values between -1 and 1 (invert Y for forward movement)
          const normX = deltaX / maxRadius;
          const normY = -deltaY / maxRadius;
          onChange({ x: normX, y: normY });
          break;
        }
      }
    },
    [onChange]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchIdRef.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touchIdRef.current = null;
          setActive(false);
          setKnobPos({ x: 0, y: 0 });
          onChange({ x: 0, y: 0 });
          break;
        }
      }
    },
    [onChange]
  );

  useEffect(() => {
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={baseRef}
      onTouchStart={handleTouchStart}
      className="relative w-32 h-32 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center select-none touch-none shadow-2xl"
    >
      {/* Direction Guide crosshairs */}
      <div className="absolute inset-x-4 top-1/2 h-[1px] bg-white/10" />
      <div className="absolute inset-y-4 left-1/2 w-[1px] bg-white/10" />

      {/* Dynamic Thumb Knob */}
      <div
        style={{
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          transition: active ? 'none' : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`w-14 h-14 rounded-full shadow-lg border border-white/30 flex items-center justify-center ${
          active ? 'bg-amber-500/80 scale-95' : 'bg-white/30 scale-100'
        }`}
      >
        <div className="w-4 h-4 rounded-full bg-white/70" />
      </div>
    </div>
  );
};

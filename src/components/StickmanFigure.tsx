import React from 'react';
import { StickmanCharacter } from '../types';

interface StickmanFigureProps {
  character: StickmanCharacter;
  size?: number; // size in px, default 160
  className?: string;
  animate?: boolean;
}

export const StickmanFigure: React.FC<StickmanFigureProps> = ({
  character,
  size = 160,
  className = '',
  animate = true,
}) => {
  const { hasHat, hatColor, bodyColor } = character;

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 120"
        width={size}
        height={size}
        className={`drop-shadow-md ${animate ? 'transition-transform duration-75' : ''}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow on ground */}
        <ellipse cx="50" cy="114" rx="24" ry="4" fill="currentColor" opacity="0.15" />

        {/* Legs */}
        {/* Left Leg */}
        <line
          x1="50"
          y1="78"
          x2="32"
          y2="110"
          stroke={bodyColor}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Right Leg */}
        <line
          x1="50"
          y1="78"
          x2="68"
          y2="110"
          stroke={bodyColor}
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Torso / Body */}
        <line
          x1="50"
          y1="42"
          x2="50"
          y2="80"
          stroke={bodyColor}
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Arms */}
        {/* Left Arm */}
        <line
          x1="50"
          y1="50"
          x2="24"
          y2="68"
          stroke={bodyColor}
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        {/* Right Arm */}
        <line
          x1="50"
          y1="50"
          x2="76"
          y2="66"
          stroke={bodyColor}
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        {/* Head */}
        <circle
          cx="50"
          cy="30"
          r="13"
          fill={bodyColor}
          stroke="white"
          strokeWidth="1.5"
        />

        {/* Friendly eyes */}
        <circle cx="46" cy="29" r="1.8" fill="white" />
        <circle cx="54" cy="29" r="1.8" fill="white" />
        <circle cx="46" cy="29" r="0.9" fill="#18181b" />
        <circle cx="54" cy="29" r="0.9" fill="#18181b" />

        {/* Hat if present */}
        {hasHat && (
          <g>
            {/* Hat Brim */}
            <path
              d="M 30 20 Q 50 16 70 20 L 73 23 Q 50 20 27 23 Z"
              fill={hatColor}
              stroke="#0f172a"
              strokeWidth="0.8"
            />
            {/* Hat Crown / Cap */}
            <path
              d="M 36 20 C 36 8, 64 8, 64 20 Z"
              fill={hatColor}
              stroke="#0f172a"
              strokeWidth="1"
            />
            {/* Hat ribbon detail */}
            <path
              d="M 36.5 18 Q 50 16 63.5 18"
              stroke="#ffffff"
              strokeWidth="1.8"
              fill="none"
              opacity="0.75"
            />
          </g>
        )}
      </svg>
    </div>
  );
};


import React from 'react';

export const Logo: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="white" stroke="url(#paint0_linear)" strokeWidth="2"/>
    <path d="M50 25C35 25 25 35 25 45C25 65 50 85 50 85C50 85 75 65 75 45C75 35 65 25 50 25Z" fill="url(#paint1_linear)"/>
    <rect x="45" y="40" width="10" height="20" fill="white"/>
    <rect x="40" y="45" width="20" height="10" fill="white"/>
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0F3460" />
        <stop offset="1" stopColor="#E94560" />
      </linearGradient>
      <linearGradient id="paint1_linear" x1="25" y1="25" x2="75" y2="85" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4A90E2" />
        <stop offset="1" stopColor="#D0021B" />
      </linearGradient>
    </defs>
  </svg>
);

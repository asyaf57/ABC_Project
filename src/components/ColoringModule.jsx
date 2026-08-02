import React, { useState, useRef, useEffect, useCallback } from 'react';
import { kidAudio } from '../utils/audio';

// ============================================================
// FULL-COLOR KID-FRIENDLY SVG ICONS (Guaranteed cross-device)
// ============================================================
const IconFill = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#DBEAFE"/>
    <path d="M24 10 L28 6 C30 4 33 7 31 9 L27 13" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" fill="#93C5FD"/>
    <path d="M10 18 L28 18 L26 34 L12 34 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" strokeLinejoin="round"/>
    <ellipse cx="19" cy="18" rx="9" ry="4" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2"/>
    <circle cx="9" cy="32" r="3" fill="#60A5FA" opacity="0.8"/>
    <circle cx="5" cy="38" r="2" fill="#60A5FA" opacity="0.6"/>
  </svg>
);

const IconBrush = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#FEF3C7"/>
    <rect x="14" y="8" width="9" height="15" rx="4" fill="#F59E0B" stroke="#92400E" strokeWidth="2"/>
    <path d="M14 23 L23 23 L22 30 L15 30 Z" fill="#FCD34D" stroke="#92400E" strokeWidth="1.5"/>
    <ellipse cx="18.5" cy="32" rx="5" ry="3.5" fill="#F87171" stroke="#92400E" strokeWidth="1.5"/>
    <path d="M15 13 Q18.5 17 22 13" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

const IconEraser = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#FDF2F8"/>
    <g transform="rotate(-20 20 20)">
      <rect x="8" y="14" width="24" height="14" rx="4" fill="#F472B6" stroke="#831843" strokeWidth="2"/>
      <rect x="8" y="14" width="11" height="14" rx="4" fill="#A5F3FC" stroke="#0E7490" strokeWidth="2"/>
      <line x1="19" y1="15" x2="19" y2="27" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    </g>
    <rect x="10" y="30" width="20" height="3" rx="1.5" fill="#C084FC" opacity="0.5"/>
  </svg>
);

const IconSave = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="8" fill="#10B981"/>
    <path d="M6 6 L18 6 L22 10 L22 22 L6 22 Z" fill="#ECFDF5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <rect x="10" y="6" width="8" height="7" rx="1" fill="#34D399" stroke="white" strokeWidth="1.5"/>
    <rect x="9" y="15" width="10" height="7" rx="1" fill="#6EE7B7" stroke="white" strokeWidth="1.5"/>
    <line x1="11" y1="19" x2="17" y2="19" stroke="#065F46" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconReset = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="8" fill="#F43F5E"/>
    <path d="M14 7 A7 7 0 1 1 7 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M7 7 L7 14 L14 14" stroke="white" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
  </svg>
);

const IconDone = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="13" fill="#F59E0B" stroke="#B45309" strokeWidth="2"/>
    <path d="M8 14 L12 18 L20 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ============================================================
// COLORING PAGES — Rich SVG with many separate areas to color
// ============================================================
const PAGES = [
  {
    id: 'princess',
    title: 'Putri Cantik',
    emoji: '👸',
    bg: 'linear-gradient(135deg, #fce7f3, #e9d5ff)',
    svg: `<svg viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg">
  <!-- Sky background -->
  <rect x="0" y="0" width="400" height="450" fill="white"/>
  <!-- Stars -->
  <path d="M40 40 L43 50 L53 50 L45 56 L48 66 L40 60 L32 66 L35 56 L27 50 L37 50 Z" fill="white" stroke="black" stroke-width="2"/>
  <path d="M360 30 L362 38 L370 38 L364 43 L366 51 L360 46 L354 51 L356 43 L350 38 L358 38 Z" fill="white" stroke="black" stroke-width="2"/>
  <!-- Crown -->
  <path d="M150 90 L160 65 L175 82 L200 55 L225 82 L240 65 L250 90 Z" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="200" cy="55" r="7" fill="white" stroke="black" stroke-width="2.5"/>
  <circle cx="160" cy="65" r="5" fill="white" stroke="black" stroke-width="2.5"/>
  <circle cx="240" cy="65" r="5" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Hair back -->
  <path d="M150 130 C130 100 270 100 250 130 C240 155 260 210 255 250 C240 230 210 220 200 220 C190 220 160 230 145 250 C140 210 160 155 150 130 Z" fill="white" stroke="black" stroke-width="3"/>
  <!-- Neck -->
  <rect x="190" y="205" width="20" height="25" rx="5" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Face -->
  <ellipse cx="200" cy="155" rx="48" ry="55" fill="white" stroke="black" stroke-width="3"/>
  <!-- Left eye -->
  <ellipse cx="182" cy="148" rx="10" ry="13" fill="white" stroke="black" stroke-width="2.5"/>
  <ellipse cx="183" cy="151" rx="5" ry="7" fill="black"/>
  <circle cx="185" cy="148" r="2.5" fill="white"/>
  <!-- Right eye -->
  <ellipse cx="218" cy="148" rx="10" ry="13" fill="white" stroke="black" stroke-width="2.5"/>
  <ellipse cx="219" cy="151" rx="5" ry="7" fill="black"/>
  <circle cx="221" cy="148" r="2.5" fill="white"/>
  <!-- Left eyebrow -->
  <path d="M173 132 Q182 126 191 132" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Right eyebrow -->
  <path d="M209 132 Q218 126 227 132" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Nose -->
  <ellipse cx="200" cy="165" rx="6" ry="4" fill="white" stroke="black" stroke-width="2"/>
  <!-- Left cheek blush -->
  <ellipse cx="170" cy="170" rx="12" ry="8" fill="white" stroke="black" stroke-width="1.5" opacity="0.6"/>
  <!-- Right cheek blush -->
  <ellipse cx="230" cy="170" rx="12" ry="8" fill="white" stroke="black" stroke-width="1.5" opacity="0.6"/>
  <!-- Mouth -->
  <path d="M185 182 Q200 195 215 182" fill="white" stroke="black" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M192 182 Q200 188 208 182" fill="white" stroke="black" stroke-width="1.5"/>
  <!-- Hair front strands -->
  <path d="M152 115 C145 140 143 175 148 200" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M248 115 C255 140 257 175 252 200" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Dress top -->
  <path d="M160 230 L240 230 L255 280 L145 280 Z" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <!-- Collar necklace -->
  <path d="M175 230 Q200 244 225 230" fill="white" stroke="black" stroke-width="2"/>
  <circle cx="200" cy="248" r="6" fill="white" stroke="black" stroke-width="2"/>
  <!-- Dress skirt -->
  <path d="M145 280 C100 340 80 420 90 450 L310 450 C320 420 300 340 255 280 Z" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <!-- Dress skirt details - horizontal waves -->
  <path d="M110 340 Q200 360 290 340" fill="none" stroke="black" stroke-width="2"/>
  <path d="M96 390 Q200 410 304 390" fill="none" stroke="black" stroke-width="2"/>
  <!-- Dress stars decoration -->
  <circle cx="200" cy="310" r="5" fill="white" stroke="black" stroke-width="2"/>
  <circle cx="170" cy="355" r="4" fill="white" stroke="black" stroke-width="2"/>
  <circle cx="230" cy="355" r="4" fill="white" stroke="black" stroke-width="2"/>
  <circle cx="155" cy="405" r="4" fill="white" stroke="black" stroke-width="2"/>
  <circle cx="245" cy="405" r="4" fill="white" stroke="black" stroke-width="2"/>
  <!-- Left arm -->
  <path d="M160 235 L105 280 L118 292 L168 255" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <!-- Left hand -->
  <circle cx="111" cy="286" r="12" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Right arm -->
  <path d="M240 235 L295 280 L282 292 L232 255" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <!-- Right hand -->
  <circle cx="289" cy="286" r="12" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Magic wand in right hand -->
  <line x1="295" y1="275" x2="340" y2="235" stroke="black" stroke-width="3"/>
  <path d="M340 235 L343 226 L350 230 L346 237 L354 239 L348 245 L352 252 L344 249 L341 256 L338 248 L330 248 L336 242 Z" fill="white" stroke="black" stroke-width="2"/>
</svg>`
  },
  {
    id: 'superhero',
    title: 'Superhero Keren',
    emoji: '🦸',
    bg: 'linear-gradient(135deg, #fee2e2, #fecaca)',
    svg: `<svg viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="400" height="450" fill="white"/>
  <!-- City buildings background -->
  <rect x="20" y="300" width="50" height="150" fill="white" stroke="black" stroke-width="2"/>
  <rect x="40" y="280" width="15" height="20" fill="white" stroke="black" stroke-width="1.5"/>
  <rect x="330" y="310" width="50" height="140" fill="white" stroke="black" stroke-width="2"/>
  <rect x="345" y="290" width="15" height="20" fill="white" stroke="black" stroke-width="1.5"/>
  <!-- Cape -->
  <path d="M155 195 C120 250 100 360 130 430 L160 420 C145 370 148 300 165 260 Z" fill="white" stroke="black" stroke-width="3"/>
  <path d="M245 195 C280 250 300 360 270 430 L240 420 C255 370 252 300 235 260 Z" fill="white" stroke="black" stroke-width="3"/>
  <!-- Mask -->
  <path d="M168 120 C160 100 175 88 185 100 C190 108 200 110 200 110 C200 110 210 108 215 100 C225 88 240 100 232 120 Z" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <ellipse cx="182" cy="115" rx="8" ry="6" fill="white" stroke="black" stroke-width="2"/>
  <ellipse cx="218" cy="115" rx="8" ry="6" fill="white" stroke="black" stroke-width="2"/>
  <!-- Head -->
  <ellipse cx="200" cy="145" rx="45" ry="50" fill="white" stroke="black" stroke-width="3"/>
  <!-- Eyes on mask -->
  <ellipse cx="183" cy="140" rx="9" ry="11" fill="white" stroke="black" stroke-width="2.5"/>
  <circle cx="184" cy="142" r="5" fill="black"/>
  <circle cx="186" cy="139" r="2" fill="white"/>
  <ellipse cx="217" cy="140" rx="9" ry="11" fill="white" stroke="black" stroke-width="2.5"/>
  <circle cx="218" cy="142" r="5" fill="black"/>
  <circle cx="220" cy="139" r="2" fill="white"/>
  <!-- Nose -->
  <path d="M196 155 Q200 162 204 155" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/>
  <!-- Mouth - determined smile -->
  <path d="M186 170 Q200 180 214 170" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Jaw chin -->
  <path d="M157 160 Q160 190 200 195 Q240 190 243 160" fill="none" stroke="black" stroke-width="2"/>
  <!-- Neck -->
  <rect x="190" y="193" width="20" height="20" rx="4" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Chest/body top -->
  <path d="M155 213 L245 213 L258 270 L142 270 Z" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <!-- Chest emblem circle -->
  <circle cx="200" cy="240" r="22" fill="white" stroke="black" stroke-width="3"/>
  <!-- Lightning bolt emblem -->
  <path d="M206 222 L196 240 L203 240 L194 258 L212 237 L204 237 Z" fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Belt -->
  <rect x="142" y="270" width="116" height="16" rx="5" fill="white" stroke="black" stroke-width="2.5"/>
  <rect x="190" y="266" width="20" height="24" rx="4" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Legs -->
  <path d="M142 286 L165 286 L170 380 L150 380 Z" fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M258 286 L235 286 L230 380 L250 380 Z" fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Boots -->
  <path d="M148 380 L170 380 L175 410 L160 420 L140 410 Z" fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M252 380 L230 380 L225 410 L240 420 L260 410 Z" fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Left arm/fist -->
  <path d="M155 218 L90 270 L100 285 L158 240" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="95" cy="277" r="18" fill="white" stroke="black" stroke-width="3"/>
  <path d="M83 272 Q95 266 107 272" fill="none" stroke="black" stroke-width="2"/>
  <path d="M83 278 Q95 284 107 278" fill="none" stroke="black" stroke-width="2"/>
  <!-- Right arm pointing up -->
  <path d="M245 218 L310 160 L322 172 L248 238" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="316" cy="166" r="18" fill="white" stroke="black" stroke-width="3"/>
  <!-- Web shooting effect -->
  <path d="M316 148 L316 120" stroke="black" stroke-width="2" stroke-dasharray="3 3"/>
  <path d="M316 148 L296 130" stroke="black" stroke-width="2" stroke-dasharray="3 3"/>
  <path d="M316 148 L336 130" stroke="black" stroke-width="2" stroke-dasharray="3 3"/>
</svg>`
  },
  {
    id: 'robot',
    title: 'Robot Canggih',
    emoji: '🤖',
    bg: 'linear-gradient(135deg, #dbeafe, #e0f2fe)',
    svg: `<svg viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="400" height="450" fill="white"/>
  <!-- Antenna -->
  <line x1="200" y1="48" x2="200" y2="90" stroke="black" stroke-width="4" stroke-linecap="round"/>
  <circle cx="200" cy="40" r="12" fill="white" stroke="black" stroke-width="3"/>
  <circle cx="200" cy="40" r="5" fill="black"/>
  <!-- Ear bolts -->
  <circle cx="135" cy="145" r="14" fill="white" stroke="black" stroke-width="3"/>
  <circle cx="265" cy="145" r="14" fill="white" stroke="black" stroke-width="3"/>
  <!-- Head -->
  <rect x="140" y="90" width="120" height="110" rx="28" fill="white" stroke="black" stroke-width="4"/>
  <!-- Left eye panel -->
  <rect x="155" y="108" width="42" height="38" rx="10" fill="white" stroke="black" stroke-width="3"/>
  <circle cx="176" cy="127" r="12" fill="white" stroke="black" stroke-width="2.5"/>
  <circle cx="176" cy="127" r="6" fill="black"/>
  <circle cx="179" cy="124" r="2.5" fill="white"/>
  <!-- Right eye panel -->
  <rect x="203" y="108" width="42" height="38" rx="10" fill="white" stroke="black" stroke-width="3"/>
  <circle cx="224" cy="127" r="12" fill="white" stroke="black" stroke-width="2.5"/>
  <circle cx="224" cy="127" r="6" fill="black"/>
  <circle cx="227" cy="124" r="2.5" fill="white"/>
  <!-- Mouth panel -->
  <rect x="158" y="158" width="84" height="26" rx="8" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Mouth teeth -->
  <line x1="172" y1="158" x2="172" y2="184" stroke="black" stroke-width="2"/>
  <line x1="186" y1="158" x2="186" y2="184" stroke="black" stroke-width="2"/>
  <line x1="200" y1="158" x2="200" y2="184" stroke="black" stroke-width="2"/>
  <line x1="214" y1="158" x2="214" y2="184" stroke="black" stroke-width="2"/>
  <line x1="228" y1="158" x2="228" y2="184" stroke="black" stroke-width="2"/>
  <!-- Neck connector -->
  <rect x="185" y="200" width="30" height="22" rx="5" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Shoulder hinge left -->
  <circle cx="135" cy="240" r="16" fill="white" stroke="black" stroke-width="3"/>
  <!-- Shoulder hinge right -->
  <circle cx="265" cy="240" r="16" fill="white" stroke="black" stroke-width="3"/>
  <!-- Torso -->
  <rect x="140" y="222" width="120" height="130" rx="20" fill="white" stroke="black" stroke-width="4"/>
  <!-- Chest panel / control area -->
  <rect x="157" y="238" width="86" height="70" rx="10" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Control buttons -->
  <circle cx="178" cy="255" r="8" fill="white" stroke="black" stroke-width="2"/>
  <circle cx="200" cy="255" r="8" fill="white" stroke="black" stroke-width="2"/>
  <circle cx="222" cy="255" r="8" fill="white" stroke="black" stroke-width="2"/>
  <!-- Screen display on chest -->
  <rect x="165" y="270" width="70" height="28" rx="5" fill="white" stroke="black" stroke-width="2"/>
  <path d="M172 280 L183 280 L187 275 L193 290 L197 280 L228 280" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Power core -->
  <circle cx="200" cy="320" r="14" fill="white" stroke="black" stroke-width="2.5"/>
  <circle cx="200" cy="320" r="7" fill="black"/>
  <circle cx="203" cy="317" r="2.5" fill="white"/>
  <!-- Left upper arm -->
  <path d="M135 240 L82 280 L92 296 L140 260" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <!-- Left forearm -->
  <rect x="60" y="280" width="32" height="65" rx="10" fill="white" stroke="black" stroke-width="3"/>
  <!-- Left hand -->
  <rect x="55" y="344" width="42" height="30" rx="8" fill="white" stroke="black" stroke-width="2.5"/>
  <rect x="60" y="342" width="8" height="15" rx="4" fill="white" stroke="black" stroke-width="2"/>
  <rect x="72" y="340" width="8" height="17" rx="4" fill="white" stroke="black" stroke-width="2"/>
  <rect x="84" y="342" width="8" height="15" rx="4" fill="white" stroke="black" stroke-width="2"/>
  <!-- Right upper arm -->
  <path d="M265 240 L318 280 L308 296 L260 260" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <!-- Right forearm -->
  <rect x="308" y="280" width="32" height="65" rx="10" fill="white" stroke="black" stroke-width="3"/>
  <!-- Right hand -->
  <rect x="303" y="344" width="42" height="30" rx="8" fill="white" stroke="black" stroke-width="2.5"/>
  <rect x="308" y="342" width="8" height="15" rx="4" fill="white" stroke="black" stroke-width="2"/>
  <rect x="320" y="340" width="8" height="17" rx="4" fill="white" stroke="black" stroke-width="2"/>
  <rect x="332" y="342" width="8" height="15" rx="4" fill="white" stroke="black" stroke-width="2"/>
  <!-- Hip -->
  <rect x="155" y="352" width="90" height="22" rx="8" fill="white" stroke="black" stroke-width="3"/>
  <!-- Left leg -->
  <rect x="158" y="374" width="40" height="70" rx="10" fill="white" stroke="black" stroke-width="3"/>
  <!-- Right leg -->
  <rect x="202" y="374" width="40" height="70" rx="10" fill="white" stroke="black" stroke-width="3"/>
  <!-- Left foot -->
  <path d="M153 440 L200 440 L202 448 L148 448 Z" fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Right foot -->
  <path d="M200 440 L248 440 L252 448 L198 448 Z" fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
</svg>`
  },
  {
    id: 'dinosaur',
    title: 'Dino Bahagia',
    emoji: '🦕',
    bg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    svg: `<svg viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="400" height="450" fill="white"/>
  <!-- Sun -->
  <circle cx="340" cy="60" r="30" fill="white" stroke="black" stroke-width="2.5"/>
  <line x1="340" y1="22" x2="340" y2="12" stroke="black" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="365" y1="35" x2="373" y2="27" stroke="black" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="378" y1="60" x2="388" y2="60" stroke="black" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="365" y1="85" x2="373" y2="93" stroke="black" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Clouds -->
  <path d="M40 80 C35 70 45 60 55 65 C57 55 70 55 75 62 C85 58 90 70 83 76 Z" fill="white" stroke="black" stroke-width="2"/>
  <!-- Spikes on back -->
  <path d="M218 150 L225 125 L235 148" fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M238 135 L248 108 L258 133" fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M258 122 L270 93 L282 120" fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M278 112 L292 82 L305 110" fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Long neck -->
  <path d="M220 160 C250 140 290 130 310 115 C325 103 320 88 308 85 C296 82 285 95 290 112 C282 100 268 92 260 100 C252 90 238 95 235 108 C228 115 224 138 220 160 Z" fill="white" stroke="black" stroke-width="3"/>
  <!-- Head -->
  <ellipse cx="310" cy="80" rx="38" ry="30" fill="white" stroke="black" stroke-width="3"/>
  <!-- Eye -->
  <circle cx="325" cy="72" r="10" fill="white" stroke="black" stroke-width="2.5"/>
  <circle cx="326" cy="73" r="5" fill="black"/>
  <circle cx="328" cy="71" r="2" fill="white"/>
  <!-- Nostril -->
  <ellipse cx="342" cy="78" rx="4" ry="3" fill="white" stroke="black" stroke-width="2"/>
  <!-- Smile -->
  <path d="M295 88 Q315 100 340 88" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Teeth -->
  <path d="M300 89 L303 96 L306 89" fill="white" stroke="black" stroke-width="1.5"/>
  <path d="M312 91 L315 98 L318 91" fill="white" stroke="black" stroke-width="1.5"/>
  <!-- Body -->
  <ellipse cx="175" cy="270" rx="110" ry="130" fill="white" stroke="black" stroke-width="4"/>
  <!-- Belly -->
  <ellipse cx="165" cy="285" rx="70" ry="90" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Belly scales -->
  <path d="M130 240 Q165 248 200 240" fill="none" stroke="black" stroke-width="2"/>
  <path d="M122 260 Q165 270 208 260" fill="none" stroke="black" stroke-width="2"/>
  <path d="M118 282 Q165 294 212 282" fill="none" stroke="black" stroke-width="2"/>
  <path d="M120 305 Q165 318 210 305" fill="none" stroke="black" stroke-width="2"/>
  <path d="M125 328 Q165 340 205 328" fill="none" stroke="black" stroke-width="2"/>
  <!-- Tail -->
  <path d="M280 300 C330 310 360 340 370 380 C365 395 350 390 345 375 C340 360 320 345 295 335 C278 330 268 318 280 300 Z" fill="white" stroke="black" stroke-width="3"/>
  <!-- Front left leg -->
  <path d="M100 370 C88 390 85 420 90 440 L115 440 C115 425 115 398 118 375 Z" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <!-- Front left foot -->
  <ellipse cx="102" cy="442" rx="22" ry="9" fill="white" stroke="black" stroke-width="2.5"/>
  <path d="M85 440 L88 452" stroke="black" stroke-width="2" stroke-linecap="round"/>
  <path d="M100 443 L100 455" stroke="black" stroke-width="2" stroke-linecap="round"/>
  <path d="M115 440 L118 452" stroke="black" stroke-width="2" stroke-linecap="round"/>
  <!-- Front right leg -->
  <path d="M220 368 C228 390 230 420 228 440 L252 440 C254 425 252 398 245 375 Z" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <!-- Front right foot -->
  <ellipse cx="240" cy="442" rx="22" ry="9" fill="white" stroke="black" stroke-width="2.5"/>
  <path d="M223 440 L225 452" stroke="black" stroke-width="2" stroke-linecap="round"/>
  <path d="M238 443 L238 455" stroke="black" stroke-width="2" stroke-linecap="round"/>
  <path d="M253 440 L256 452" stroke="black" stroke-width="2" stroke-linecap="round"/>
  <!-- Grass ground -->
  <path d="M0 430 Q50 420 100 430 Q150 440 200 428 Q250 418 300 430 Q350 440 400 428 L400 450 L0 450 Z" fill="white" stroke="black" stroke-width="2"/>
</svg>`
  },
  {
    id: 'unicorn',
    title: 'Unicorn Ajaib',
    emoji: '🦄',
    bg: 'linear-gradient(135deg, #fdf4ff, #fce7f3)',
    svg: `<svg viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="400" height="450" fill="white"/>
  <!-- Rainbow -->
  <path d="M20 200 C20 100 380 100 380 200" fill="none" stroke="black" stroke-width="2" stroke-dasharray="0"/>
  <path d="M40 200 C40 120 360 120 360 200" fill="none" stroke="black" stroke-width="2"/>
  <path d="M60 200 C60 140 340 140 340 200" fill="none" stroke="black" stroke-width="2"/>
  <!-- Stars scattered -->
  <path d="M60 60 L62 67 L69 67 L63 71 L65 78 L60 74 L55 78 L57 71 L51 67 L58 67 Z" fill="white" stroke="black" stroke-width="1.5"/>
  <path d="M340 80 L342 87 L349 87 L343 91 L345 98 L340 94 L335 98 L337 91 L331 87 L338 87 Z" fill="white" stroke="black" stroke-width="1.5"/>
  <!-- Horn -->
  <path d="M200 55 L188 100 L212 100 Z" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <line x1="194" y1="88" x2="206" y2="65" stroke="black" stroke-width="1.5"/>
  <line x1="189" y1="98" x2="210" y2="76" stroke="black" stroke-width="1.5"/>
  <!-- Left ear -->
  <path d="M155 105 L148 80 L172 98 Z" fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Right ear -->
  <path d="M245 105 L252 80 L228 98 Z" fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Mane flowing top -->
  <path d="M152 100 C130 115 125 145 130 165 C118 150 115 130 125 110 Z" fill="white" stroke="black" stroke-width="2.5"/>
  <path d="M160 95 C140 105 135 130 140 155 C128 140 126 115 138 100 Z" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Head -->
  <ellipse cx="200" cy="148" rx="52" ry="58" fill="white" stroke="black" stroke-width="3.5"/>
  <!-- Left eye -->
  <ellipse cx="180" cy="138" rx="12" ry="15" fill="white" stroke="black" stroke-width="2.5"/>
  <ellipse cx="181" cy="140" rx="6" ry="8" fill="black"/>
  <circle cx="184" cy="136" r="3" fill="white"/>
  <!-- Right eye -->
  <ellipse cx="220" cy="138" rx="12" ry="15" fill="white" stroke="black" stroke-width="2.5"/>
  <ellipse cx="221" cy="140" rx="6" ry="8" fill="black"/>
  <circle cx="224" cy="136" r="3" fill="white"/>
  <!-- Eyelashes -->
  <path d="M169 128 L165 120 M173 126 L170 118 M177 125 L175 117" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M209 128 L205 120 M213 126 L210 118 M217 125 L215 117" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Nose -->
  <ellipse cx="200" cy="168" rx="8" ry="5" fill="white" stroke="black" stroke-width="2"/>
  <!-- Nostrils -->
  <ellipse cx="196" cy="168" rx="2.5" ry="2" fill="black"/>
  <ellipse cx="204" cy="168" rx="2.5" ry="2" fill="black"/>
  <!-- Smile -->
  <path d="M185 180 Q200 192 215 180" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Cheek blush -->
  <ellipse cx="165" cy="162" rx="12" ry="8" fill="white" stroke="black" stroke-width="1.5"/>
  <ellipse cx="235" cy="162" rx="12" ry="8" fill="white" stroke="black" stroke-width="1.5"/>
  <!-- Neck -->
  <path d="M168 200 L175 230 L225 230 L232 200 Z" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Body -->
  <ellipse cx="200" cy="330" rx="110" ry="100" fill="white" stroke="black" stroke-width="4"/>
  <!-- Belly -->
  <ellipse cx="200" cy="340" rx="70" ry="65" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Mane flowing down -->
  <path d="M168 200 C148 240 145 290 148 330" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/>
  <path d="M160 198 C138 240 133 295 136 338" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/>
  <path d="M152 200 C128 245 124 298 127 340" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/>
  <!-- Tail -->
  <path d="M305 300 C340 280 360 310 355 350 C350 380 330 390 310 370" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/>
  <path d="M310 295 C348 272 368 305 362 348 C358 378 338 392 316 374" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/>
  <!-- Front left leg -->
  <rect x="148" y="408" width="35" height="40" rx="12" fill="white" stroke="black" stroke-width="3"/>
  <!-- Front right leg -->
  <rect x="217" y="408" width="35" height="40" rx="12" fill="white" stroke="black" stroke-width="3"/>
  <!-- Hooves -->
  <rect x="146" y="442" width="39" height="12" rx="6" fill="white" stroke="black" stroke-width="2.5"/>
  <rect x="215" y="442" width="39" height="12" rx="6" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Cutie mark on body -->
  <path d="M220 340 L223 330 L226 340 L236 340 L228 346 L231 356 L223 350 L215 356 L218 346 L210 340 Z" fill="white" stroke="black" stroke-width="2"/>
</svg>`
  },
  {
    id: 'mermaid',
    title: 'Putri Duyung',
    emoji: '🧜',
    bg: 'linear-gradient(135deg, #e0f2fe, #dbeafe)',
    svg: `<svg viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="400" height="450" fill="white"/>
  <!-- Ocean waves background -->
  <path d="M0 320 C60 305 130 335 200 315 C270 295 340 325 400 310 L400 450 L0 450 Z" fill="white" stroke="black" stroke-width="2"/>
  <!-- Bubbles -->
  <circle cx="50" cy="250" r="8" fill="white" stroke="black" stroke-width="1.5"/>
  <circle cx="65" cy="220" r="5" fill="white" stroke="black" stroke-width="1.5"/>
  <circle cx="340" cy="270" r="10" fill="white" stroke="black" stroke-width="1.5"/>
  <circle cx="355" cy="240" r="6" fill="white" stroke="black" stroke-width="1.5"/>
  <!-- Seaweed -->
  <path d="M30 380 C20 360 35 340 25 320 C18 305 30 295 35 305 C42 318 28 338 35 355 C42 370 30 380 30 380" fill="white" stroke="black" stroke-width="2"/>
  <path d="M370 390 C378 368 364 348 375 328 C382 313 370 303 365 313 C358 326 372 346 365 363 C358 378 370 390 370 390" fill="white" stroke="black" stroke-width="2"/>
  <!-- Hair flowing -->
  <path d="M148 100 C118 120 108 160 112 195 C100 175 98 140 110 112 Z" fill="white" stroke="black" stroke-width="2.5"/>
  <path d="M158 96 C125 115 115 158 118 195 C106 172 105 138 118 108 Z" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Hair right side -->
  <path d="M252 100 C282 120 292 160 288 195 C300 175 302 140 290 112 Z" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Head -->
  <ellipse cx="200" cy="148" rx="52" ry="58" fill="white" stroke="black" stroke-width="3.5"/>
  <!-- Left eye -->
  <ellipse cx="181" cy="137" rx="11" ry="14" fill="white" stroke="black" stroke-width="2.5"/>
  <ellipse cx="182" cy="139" rx="6" ry="8" fill="black"/>
  <circle cx="185" cy="135" r="2.5" fill="white"/>
  <!-- Right eye -->
  <ellipse cx="219" cy="137" rx="11" ry="14" fill="white" stroke="black" stroke-width="2.5"/>
  <ellipse cx="220" cy="139" rx="6" ry="8" fill="black"/>
  <circle cx="223" cy="135" r="2.5" fill="white"/>
  <!-- Eyelashes -->
  <path d="M171 127 L168 119 M175 125 L173 116" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M209 127 L206 119 M213 125 L211 116" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Nose -->
  <path d="M196 158 Q200 164 204 158" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/>
  <!-- Smile -->
  <path d="M185 174 Q200 187 215 174" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Cheeks -->
  <ellipse cx="165" cy="158" rx="12" ry="8" fill="white" stroke="black" stroke-width="1.5"/>
  <ellipse cx="235" cy="158" rx="12" ry="8" fill="white" stroke="black" stroke-width="1.5"/>
  <!-- Shell crown in hair -->
  <path d="M185 96 L188 86 L192 96 Z" fill="white" stroke="black" stroke-width="2"/>
  <path d="M200 90 L200 80 L205 90 Z" fill="white" stroke="black" stroke-width="2"/>
  <path d="M212 96 L215 86 L218 96 Z" fill="white" stroke="black" stroke-width="2"/>
  <!-- Neck -->
  <path d="M172 200 L178 228 L222 228 L228 200 Z" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Shell top/bra -->
  <path d="M165 228 C160 248 165 265 185 268 C165 275 155 270 152 255 C148 238 158 225 165 228 Z" fill="white" stroke="black" stroke-width="2.5"/>
  <path d="M235 228 C240 248 235 265 215 268 C235 275 245 270 248 255 C252 238 242 225 235 228 Z" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Waist -->
  <path d="M170 265 L180 290 L220 290 L230 265 Z" fill="white" stroke="black" stroke-width="2.5"/>
  <!-- Tail body -->
  <path d="M175 288 C155 330 145 380 155 430 L245 430 C255 380 245 330 225 288 Z" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <!-- Tail scales -->
  <path d="M178 308 Q200 316 222 308" fill="none" stroke="black" stroke-width="2"/>
  <path d="M172 328 Q200 338 228 328" fill="none" stroke="black" stroke-width="2"/>
  <path d="M168 350 Q200 362 232 350" fill="none" stroke="black" stroke-width="2"/>
  <path d="M164 372 Q200 386 236 372" fill="none" stroke="black" stroke-width="2"/>
  <path d="M162 394 Q200 408 238 394" fill="none" stroke="black" stroke-width="2"/>
  <!-- Tail fin -->
  <path d="M155 430 C120 440 90 460 100 448 C110 436 140 435 158 430" fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M245 430 C280 440 310 460 300 448 C290 436 260 435 242 430" fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Left arm -->
  <path d="M170 235 L112 295 L125 308 L176 255" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <!-- Left hand holding shell -->
  <circle cx="118" cy="301" r="15" fill="white" stroke="black" stroke-width="2.5"/>
  <path d="M110 295 C108 302 112 310 118 312 C124 310 128 302 126 295" fill="white" stroke="black" stroke-width="2"/>
  <!-- Right arm -->
  <path d="M230 235 L288 295 L275 308 L224 255" fill="white" stroke="black" stroke-width="3" stroke-linejoin="round"/>
  <!-- Right hand with fish -->
  <circle cx="282" cy="301" r="15" fill="white" stroke="black" stroke-width="2.5"/>
</svg>`
  }
];

// ============================================================
// COLOR PALETTE
// ============================================================
const COLORS = [
  // Row 1: Warm
  '#FF2D2D','#FF6B00','#FFD600','#FF69B4',
  // Row 2: Cool
  '#00C853','#00B0FF','#651FFF','#212121',
  // Row 3: Pastel
  '#FFCDD2','#FFE0B2','#F0F4C3','#B2DFDB',
  // Row 4: Pastel 2
  '#BBDEFB','#E1BEE7','#FCE4EC','#FFFFFF',
  // Row 5: Skin tones & natural
  '#FFDFC4','#E0AC69','#8D5524','#4E342E',
  // Row 6: Special
  '#FF8A65','#A5D6A7','#80DEEA','#CE93D8',
];

export default function ColoringModule({ onAddStars }) {
  const canvasRef = useRef(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [tool, setTool] = useState('fill');
  const [brushSize, setBrushSize] = useState(16);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [celebrationCount, setCelebrationCount] = useState(0);

  useEffect(() => {
    if (selectedPage) drawPageToCanvas(selectedPage);
  }, [selectedPage]);

  const drawPageToCanvas = (page) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    const blob = new Blob([page.svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const getXY = (e) => {
    const canvas = canvasRef.current;
    const r = canvas.getBoundingClientRect();
    const sx = canvas.width / r.width;
    const sy = canvas.height / r.height;
    const src = e.touches?.[0] ?? e;
    return { x: (src.clientX - r.left) * sx, y: (src.clientY - r.top) * sy };
  };

  const hexToRgb = (hex) => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  };

  const floodFill = useCallback((ctx, sx, sy, colorHex) => {
    const W = ctx.canvas.width, H = ctx.canvas.height;
    const ix = Math.floor(sx), iy = Math.floor(sy);
    if (ix < 0 || ix >= W || iy < 0 || iy >= H) return;
    const imgData = ctx.getImageData(0, 0, W, H);
    const d = imgData.data;
    const sp = (iy * W + ix) * 4;
    const sr = d[sp], sg = d[sp+1], sb = d[sp+2];
    // Block on dark strokes (outline)
    if (sr < 60 && sg < 60 && sb < 60) return;
    const fc = hexToRgb(colorHex);
    if (!fc) return;
    if (Math.abs(sr-fc.r)<5 && Math.abs(sg-fc.g)<5 && Math.abs(sb-fc.b)<5) return;
    const TOL = 80;
    const match = (p) => {
      if (d[p]<60 && d[p+1]<60 && d[p+2]<60) return false;
      return Math.abs(d[p]-sr)<=TOL && Math.abs(d[p+1]-sg)<=TOL && Math.abs(d[p+2]-sb)<=TOL;
    };
    const stack = [[ix, iy]];
    while (stack.length) {
      const [x, y] = stack.pop();
      let py = y, pp = (py * W + x) * 4;
      while (py >= 0 && match(pp)) { py--; pp -= W*4; }
      pp += W*4; py++;
      let rl=false, rr=false;
      while (py < H && match(pp)) {
        d[pp]=fc.r; d[pp+1]=fc.g; d[pp+2]=fc.b; d[pp+3]=255;
        if (x>0) { if (match(pp-4)) { if(!rl){stack.push([x-1,py]);rl=true;} } else rl=false; }
        if (x<W-1) { if (match(pp+4)) { if(!rr){stack.push([x+1,py]);rr=true;} } else rr=false; }
        pp+=W*4; py++;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, []);

  const handlePointerDown = (e) => {
    e.preventDefault();
    const {x, y} = getXY(e);
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    if (tool === 'fill') {
      kidAudio.playPop();
      // Run flood fill directly — no setState, no re-render, no overhead
      // Change cursor via DOM ref to give visual feedback without React re-render
      canvasRef.current.style.cursor = 'wait';
      floodFill(ctx, x, y, activeColor);
      canvasRef.current.style.cursor = 'crosshair';
    } else {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handlePointerMove = (e) => {
    e.preventDefault();
    if (!isDrawing || tool === 'fill') return;
    const {x, y} = getXY(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : activeColor;
    ctx.stroke();
  };

  const handlePointerUp = (e) => {
    e?.preventDefault();
    if (isDrawing) {
      canvasRef.current.getContext('2d').closePath();
      setIsDrawing(false);
    }
  };

  const handleFinish = () => {
    if (!isFinished) {
      kidAudio.playSuccess();
      onAddStars?.(20);
      setIsFinished(true);
      setCelebrationCount(c => c+1);
    }
  };

  const handleSave = () => {
    kidAudio.playPop();
    const a = document.createElement('a');
    a.download = `karya-${selectedPage.id}.png`;
    a.href = canvasRef.current.toDataURL('image/png');
    a.click();
  };

  const handleReset = () => {
    kidAudio.playPop();
    drawPageToCanvas(selectedPage);
    setIsFinished(false);
  };

  // ============================================================
  // GALLERY VIEW
  // ============================================================
  if (!selectedPage) {
    return (
      <div className="coloring-gallery-container">
        <div className="coloring-gallery-header">
          <div className="coloring-gallery-title-wrap">
            <h2 className="coloring-gallery-title">🎨 Pilih Gambar Favoritmu!</h2>
            <p className="coloring-gallery-subtitle">Sentuh gambar untuk mulai mewarnai</p>
          </div>
        </div>
        <div className="coloring-gallery-grid">
          {PAGES.map(page => (
            <button
              key={page.id}
              className="coloring-gallery-card"
              onClick={() => { kidAudio.playPop(); setSelectedPage(page); setIsFinished(false); }}
              style={{ '--card-bg': page.bg }}
            >
              <div className="coloring-gallery-preview" style={{ background: page.bg }}>
                <div dangerouslySetInnerHTML={{ __html: page.svg }} className="coloring-gallery-svg" />
              </div>
              <div className="coloring-gallery-label">
                <span className="coloring-gallery-emoji">{page.emoji}</span>
                <span className="coloring-gallery-name">{page.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================
  // CANVAS VIEW
  // ============================================================
  return (
    <div className="coloring-canvas-container">

      {/* Header Bar */}
      <div className="coloring-header-bar">
        <button className="coloring-back-btn" onClick={() => { kidAudio.playPop(); setSelectedPage(null); }}>
          ← Pilih Gambar
        </button>
        <span className="coloring-current-title">{selectedPage.emoji} {selectedPage.title}</span>
        <button className="coloring-hint-btn" onClick={() => kidAudio.speak('Pilih warna di sebelah kanan, lalu sentuh gambar untuk mewarnainya!')}>
          🔊 Petunjuk
        </button>
      </div>

      {/* Main Area: Tools + Canvas + Palette */}
      <div className="coloring-main-area">

        {/* Left Column: Toolbar + Canvas + Buttons */}
        <div className="coloring-left-column">

          {/* Tool Selector */}
          <div className="coloring-toolbar">
            <button
              className={`coloring-tool-btn ${tool === 'fill' ? 'active-fill' : ''}`}
              onClick={() => { kidAudio.playPop(); setTool('fill'); }}
              title="Ember Cat (isi penuh)"
            >
              <IconFill />
              <span>Ember Cat</span>
            </button>
            <button
              className={`coloring-tool-btn ${tool === 'brush' ? 'active-brush' : ''}`}
              onClick={() => { kidAudio.playPop(); setTool('brush'); }}
              title="Kuas Mewarnai"
            >
              <IconBrush />
              <span>Kuas</span>
            </button>
            <button
              className={`coloring-tool-btn ${tool === 'eraser' ? 'active-eraser' : ''}`}
              onClick={() => { kidAudio.playPop(); setTool('eraser'); }}
              title="Penghapus"
            >
              <IconEraser />
              <span>Hapus</span>
            </button>
          </div>

          {/* Brush Size Slider */}
          {tool !== 'fill' && (
            <div className="coloring-size-row">
              <span className="coloring-size-label">Tebal:</span>
              <input
                type="range" min="4" max="50" value={brushSize}
                onChange={e => setBrushSize(+e.target.value)}
                className="coloring-size-slider"
              />
              <div className="coloring-size-preview" style={{ width: Math.max(8, brushSize/2), height: Math.max(8, brushSize/2) }} />
            </div>
          )}

          {/* Canvas Frame */}
          <div className="coloring-canvas-frame">
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              className="coloring-canvas"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerOut={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
            {isFinished && (
              <div className="coloring-celebration-overlay">
                <div className="coloring-celebration-card">
                  <div style={{fontSize:'4rem'}}>🎉</div>
                  <h3>Luar Biasa!</h3>
                  <p>Karya mewarnaimu sangat indah! +20 ⭐</p>
                  <button onClick={() => setIsFinished(false)} className="coloring-continue-btn">
                    Lanjut Mewarnai
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons BELOW canvas */}
          <div className="coloring-action-row">
            <button className="coloring-action-btn btn-reset" onClick={handleReset}>
              <IconReset /> Ulangi Bersih
            </button>
            <button className="coloring-action-btn btn-save" onClick={handleSave}>
              <IconSave /> Simpan Karya
            </button>
            {!isFinished && (
              <button className="coloring-action-btn btn-done" onClick={handleFinish}>
                <IconDone /> Selesai! +20⭐
              </button>
            )}
          </div>

        </div>

        {/* Right Column: COLOR PALETTE — strictly vertical, right of canvas */}
        <div className="coloring-palette-column">
          <div className="coloring-palette-panel">
            <div className="coloring-palette-header">🎨 Warna</div>
            <div className="coloring-palette-grid">
              {COLORS.map((hex, i) => {
                const isLight = ['#FFFFFF','#F0F4C3','#FFDFC4','#FFE0B2','#FFCDD2','#FFD600'].includes(hex);
                const selected = activeColor === hex && tool !== 'eraser';
                return (
                  <button
                    key={i}
                    className={`coloring-color-swatch ${selected ? 'selected' : ''}`}
                    style={{ backgroundColor: hex, outline: selected ? `4px solid ${isLight ? '#333' : hex}` : undefined, outlineOffset: selected ? '3px' : undefined, boxShadow: selected ? `0 0 0 2px white, 0 0 0 5px ${hex}` : undefined }}
                    onClick={() => {
                      kidAudio.playPop();
                      setActiveColor(hex);
                      if (tool === 'eraser') setTool('fill');
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

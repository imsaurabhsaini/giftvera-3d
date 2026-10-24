'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  Eye,
  Layers,
  Smartphone,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
              Giftvera
            </span>
            <span className="text-[10px] ml-2 font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
              Self-Hosted
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/gift/demo"
            className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Try Live Demo</span>
          </Link>
          <Link
            href="/builder"
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl hover:opacity-90 shadow-lg shadow-amber-500/25 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create 3D Gift</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-6 py-20 relative overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/20 via-rose-500/15 to-purple-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Interactive Digital Memory Galleries</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Turn your memories into a{' '}
            <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
              3D Multiplayer Museum
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload photos, write a heartfelt dedication with AI assistance, and generate an unlisted 3D
            exhibition link. Loved ones explore together in real-time, see each other move, and share reactions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/builder"
              className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/30 hover:opacity-95 transition-all text-base tracking-wide"
            >
              <span>Build Your 3D Gift</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/gift/demo"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold px-6 py-4 rounded-2xl transition-colors text-base"
            >
              <Eye className="w-5 h-5 text-amber-400" />
              <span>Explore Demo Exhibition</span>
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-24 text-left relative z-10 w-full">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Full 3D WebGL Museum</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enclosed gallery hall with warm lighting, spotlight-illuminated frames, dynamic plaque stories, and inspection zoom.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3 hover:border-rose-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Real-Time Multiplayer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When family or friends open the link simultaneously, they join the same room automatically with 3D avatars, movement sync, and reaction emotes.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3 hover:border-purple-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Zero App & Zero Cost</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Works directly in Safari and Chrome on iPhone, Android, and Desktop. 100% self-hosted with local storage and zero cloud bills.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>Giftvera 3D Interactive Platform • Self-Hosted & Open Architecture</p>
      </footer>
    </div>
  );
}

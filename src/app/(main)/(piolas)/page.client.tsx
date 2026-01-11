'use client';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { Suspense, useState } from 'react';
import { GlobalRankClient } from '@/app/(main)/(piolas)/components/global-rank-client';
import { WeekRankClient } from '@/app/(main)/(piolas)/components/week-rank-client';
import { Database } from '@/types_db';

interface PiolasPageClientProps {
  initialWeekRank: Database['public']['Tables']['user_stats_session']['Row'][];
  initialGlobalRank: Database['public']['Tables']['user_stats']['Row'][];
}

export function PiolasPageClient({ initialWeekRank, initialGlobalRank }: PiolasPageClientProps) {
  const [activeTab, setActiveTab] = useState<'semanal' | 'global'>('semanal');

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
      <motion.div
        className="text-center mb-12 "
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
      >
        <motion.div className="text-6xl md:text-8xl font-black mb-4 uppercase tracking-wider relative inline-block font-pricedown-bl text-white text-border-shadow h-[100px] w-[500px]">
          <Image src="/header.png" alt="Piolas" width={1000} height={200} className="object-contain" />
        </motion.div>
      </motion.div>
      <motion.div
        className="flex items-center justify-center gap-4 mb-32"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.button
          onClick={() => setActiveTab('semanal')}
          className={`relative px-10 py-4 rounded-full font-black uppercase text-base transition-all duration-300 overflow-hidden ${
            activeTab === 'semanal' ? 'text-black' : 'text-zinc-400'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {activeTab === 'semanal' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-emerald-500"
              style={{
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.6), 0 0 60px rgba(16, 185, 129, 0.3)',
              }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          {activeTab !== 'semanal' && <div className="absolute inset-0 bg-zinc-800 border border-zinc-700" />}
          <span className="relative z-10">Semanal</span>
        </motion.button>

        <motion.button
          onClick={() => setActiveTab('global')}
          className={`relative px-10 py-4 rounded-full font-black uppercase text-base transition-all duration-300 overflow-hidden ${
            activeTab === 'global' ? 'text-black' : 'text-zinc-400'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {activeTab === 'global' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-emerald-500 "
              style={{
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.6), 0 0 60px rgba(16, 185, 129, 0.3)',
              }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          {activeTab !== 'global' && <div className="absolute inset-0 bg-zinc-800 border border-zinc-700" />}
          <span className="relative z-10">Global</span>
        </motion.button>
      </motion.div>
      <Suspense fallback={<div>Cargando...</div>}>
        <AnimatePresence mode="wait">
          {activeTab === 'semanal' ? (
            <WeekRankClient initialData={initialWeekRank} />
          ) : (
            <GlobalRankClient initialData={initialGlobalRank} />
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
}

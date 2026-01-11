'use client';

import { Crown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { useWeekRank } from '@/app/(main)/(piolas)/hooks/use-week-rank';
import { Database } from '@/types_db';

interface WeekRankClientProps {
  initialData: Database['public']['Tables']['user_stats_session']['Row'][];
}

export const WeekRankClient = ({ initialData }: WeekRankClientProps) => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 0;
  const pageSize = Number(searchParams.get('pageSize')) || 100;

  const { data, isLoading, error } = useWeekRank(page, pageSize);

  // Usar datos iniciales del cache si están disponibles, sino usar React Query
  const finalData = data && data.length > 0 ? data : initialData;

  if (isLoading && (!finalData || finalData.length === 0)) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!finalData || finalData.length === 0) {
    return <div>No hay datos disponibles</div>;
  }

  const top3 = finalData.slice(0, 3);
  const restOfPlayers = finalData.slice(3);

  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumPositions = [2, 1, 3];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="flex items-end justify-center gap-8 mb-24 px-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {podiumOrder.map((player, index) => {
          const displayPosition = podiumPositions[index];
          const heights = ['h-56', 'h-80', 'h-48'];
          const podiumGradients = [
            'from-zinc-500 via-zinc-400 to-zinc-600',
            'from-amber-400 via-yellow-400 to-amber-500',
            'from-amber-700 via-orange-600 to-amber-800',
          ];

          return (
            <motion.div
              key={`${player.user_id}`}
              className="flex flex-col items-center"
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.4 + index * 0.15,
                duration: 0.7,
                type: 'spring',
                bounce: 0.4,
              }}
            >
              <motion.div
                className="relative mb-6"
                whileHover={{ scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <AnimatePresence>
                  {displayPosition === 1 && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{
                        scale: 1,
                        rotate: 0,
                        y: [0, -12, 0],
                      }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{
                        scale: { duration: 0.5, delay: 0.8 },
                        rotate: { duration: 0.5, delay: 0.8 },
                        y: {
                          duration: 2.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: 'easeInOut',
                        },
                      }}
                      className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10"
                    >
                      <Crown className="w-12 h-12 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  className="relative w-28 h-28 rounded-full flex items-center justify-center text-5xl font-black shadow-2xl border-4 border-white/30"
                  style={{
                    // Randomize color
                    backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                    boxShadow: `0 0 40px hsl(${Math.random() * 360}, 70%, 50%)80, 0 0 80px hsl(${Math.random() * 360}, 70%, 50%)40`,
                  }}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/20"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                    }}
                  />
                  <span className="relative z-10 text-white drop-shadow-lg">{player.username.charAt(0)}</span>
                </motion.div>
              </motion.div>

              <motion.p
                className="text-xl font-black mb-2 text-amber-400 text-center drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.15 }}
              >
                {player.username}
              </motion.p>
              <motion.p
                className="text-base text-zinc-300 mb-6 font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 + index * 0.15 }}
              >
                {player.points} <span className="text-xs text-zinc-400">PTS</span>
              </motion.p>

              <motion.div
                className={`${heights[index]} w-36 bg-linear-to-t ${podiumGradients[index]} rounded-t-2xl flex items-center justify-center text-7xl font-black text-white/95 shadow-2xl relative overflow-hidden border-t-4 border-white/20`}
                whileHover={{
                  boxShadow:
                    displayPosition === 1 ? '0 0 50px rgba(251, 191, 36, 0.8)' : '0 0 30px rgba(255, 255, 255, 0.3)',
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-linear-to-b from-white/30 via-transparent to-transparent"
                  animate={{
                    y: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'linear',
                  }}
                />
                <motion.span
                  className="relative z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 1 + index * 0.15,
                    type: 'spring',
                    stiffness: 200,
                    damping: 10,
                  }}
                >
                  {displayPosition}
                </motion.span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-amber-500/20 overflow-hidden shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{
          boxShadow: '0 0 50px rgba(251, 191, 36, 0.1)',
        }}
      >
        <div className="grid grid-cols-[80px_1fr_120px] gap-4 px-8 py-5 bg-zinc-800/80 text-zinc-400 text-sm font-black uppercase border-b border-amber-500/20">
          <div>#</div>
          <div>Usuario</div>
          <div className="text-right">Puntos</div>
        </div>

        {restOfPlayers.map((player, index) => (
          <motion.div
            key={`${player.user_id}`}
            className="grid grid-cols-[80px_1fr_120px] gap-4 px-8 py-5 border-t border-zinc-800/50 transition-all duration-300 cursor-pointer group"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + index * 0.05, duration: 0.3 }}
            whileHover={{
              x: 8,
              backgroundColor: 'rgba(39, 39, 42, 0.6)',
              transition: { duration: 0.2 },
            }}
          >
            <div className="text-zinc-500 font-bold text-lg">#{index + 4}</div>
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white shadow-lg border-2 border-white/20"
                style={{
                  backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                }}
                whileHover={{
                  scale: 1.3,
                  rotate: 360,
                  boxShadow: `0 0 25px hsl(${Math.random() * 360}, 70%, 50%)`,
                }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                {player.username.charAt(0)}
              </motion.div>
              <span className="font-bold text-white text-lg group-hover:text-amber-300 transition-colors">
                {player.username}
              </span>
            </div>
            <motion.div
              className="text-right font-black text-2xl"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <span className="bg-linear-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                {player.points}
              </span>
              <span className="text-xs text-zinc-400">pts</span>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

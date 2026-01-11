'use client';

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Crown, MessageSquare, Star, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import React from 'react';
import { getUserProfile, type UserProfile } from '@/app/(main)/(piolas)/actions/profile-action';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileViewProps {
  profile: UserProfile;
  username: string;
}

export const ProfileView = ({ profile, username }: ProfileViewProps) => {
  // Calcular estadísticas agregadas
  const aggregated = profile.userStats.reduce(
    (acc, stat) => ({
      totalPoints: acc.totalPoints + stat.points,
      totalStars: acc.totalStars + stat.stars,
      totalMessages: acc.totalMessages + stat.messages_count,
      totalWalltexts: acc.totalWalltexts + stat.walltext_count,
      channels: acc.channels + 1,
      isOg: acc.isOg || stat.is_og,
    }),
    {
      totalPoints: 0,
      totalStars: 0,
      totalMessages: 0,
      totalWalltexts: 0,
      channels: 0,
      isOg: false,
    }
  );

  const profilePic = profile.userStats[0]?.profile_pic || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-4 py-12 max-w-6xl relative z-10"
    >
      {/* Header del perfil */}
      <Card className="mb-8 bg-background/80 backdrop-blur-sm border-2">
        <CardHeader>
          <div className="flex items-center gap-6">
            {profilePic ? (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary"
              >
                <Image src={profilePic} alt={username} fill className="object-cover" unoptimized />
              </motion.div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-primary/50 flex items-center justify-center text-4xl font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {/* <CardTitle className="text-3xl">{username}</CardTitle> */}
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-4xl md:text-5xl font-bold text-foreground mb-2 text-balance"
                >
                  {username}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-muted-foreground text-lg"
                >
                  {aggregated.isOg && (
                    <Badge variant="default" className="bg-amber-500 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      OG
                    </Badge>
                  )}
                </motion.p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <StatCard
              icon={Star}
              label="Estrellas"
              value={aggregated.totalStars}
              color="bg-amber-500/10 text-amber-500"
              index={0}
            />
            <StatCard
              icon={Trophy}
              label="Puntos"
              value={aggregated.totalPoints}
              color="bg-orange-500/10 text-orange-500"
              index={1}
            />
            <StatCard
              icon={MessageSquare}
              label="Mensajes"
              value={aggregated.totalMessages}
              color="bg-blue-500/10 text-blue-500"
              index={2}
            />
            <StatCard
              icon={Calendar}
              label="Sesiones"
              value={profile.sessions.length}
              color="bg-emerald-500/10 text-emerald-500"
              index={3}
            />
          </motion.div>
        </CardContent>
      </Card>

      {/* Estadísticas por canal */}
      {profile.userStats.length > 1 && (
        <Card className="mb-8 bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Estadísticas por Canal</CardTitle>
            <CardDescription>Desglose de puntos y estrellas por cada canal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.userStats.map(stat => (
                <motion.div
                  key={`${stat.user_id}-${stat.channel}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-4">
                    <div className="font-semibold">{stat.channel}</div>
                    {stat.is_og && (
                      <Badge variant="outline" className="text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        OG
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{stat.stars}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">{stat.points}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.messages_count} msgs</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial de sesiones */}
      <Card className="bg-background/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Sesiones Anteriores</CardTitle>
          <CardDescription>Historial de las últimas {profile.sessions.length} sesiones</CardDescription>
        </CardHeader>
        <CardContent>
          {profile.sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No hay sesiones registradas</div>
          ) : (
            <div className="space-y-3">
              {profile.sessions.map((session, index) => {
                // stream_sessions puede ser un objeto o un array, normalizamos a objeto
                const streamSession = Array.isArray(session.stream_sessions)
                  ? session.stream_sessions[0]
                  : session.stream_sessions;

                if (!streamSession) return null;

                const startDate = new Date(streamSession.started_at);
                const endDate = streamSession.ended_at ? new Date(streamSession.ended_at) : null;
                const duration = endDate ? Math.round((endDate.getTime() - startDate.getTime()) / 1000 / 60) : null;

                return (
                  <motion.div
                    key={session.session_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-semibold">{session.channel}</div>
                        {streamSession.is_live && (
                          <Badge variant="destructive" className="text-xs">
                            En vivo
                          </Badge>
                        )}
                        {!streamSession.is_live && endDate && (
                          <Badge variant="secondary" className="text-xs">
                            Finalizada
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(startDate, { addSuffix: true, locale: es })}
                        {endDate && duration && ` • ${duration} minutos`}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{session.points}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{session.messages_count} msgs</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  index,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-accent/0 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
      <div className="relative bg-card border border-border/50 rounded-2xl p-6 backdrop-blur-sm overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={false}
        />
        <div className="relative flex flex-col items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className={`p-3 rounded-xl ${color}`}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
          <div className="text-center">
            <motion.div
              key={value}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-foreground mb-1"
            >
              {value.toLocaleString()}
            </motion.div>
            <div className="text-sm text-muted-foreground font-medium">{label}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

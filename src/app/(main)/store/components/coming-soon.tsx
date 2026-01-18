'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function ComingSoon() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 50) {
          clearInterval(interval);
          return 50;
        }
        return prev + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#0078D7] text-white font-sans flex items-center justify-center p-8 md:p-16">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-[120px] md:text-[180px] leading-none font-extralight mb-8"
        >
          :)
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl font-light leading-relaxed mb-8"
        >
          Estamos preparando la tienda. Guardá tus puntos papu
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl md:text-2xl font-light mb-12"
        >
          {progress}% completado
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex gap-6 items-start"
        >
          <div className="bg-white p-2 shrink-0">
            <QRCode />
          </div>
          <div className="text-sm font-light leading-relaxed opacity-90">
            <p className="mb-2">Para estar más al tanto de las actualizaciones, segui a bananirou ó escanea el QR</p>
            <p className="font-normal">@bananirou</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function QRCode() {
  return (
    <div className="w-[100px] h-[100px]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 999 999">
        <rect width="999" height="999" fill="#0078D7" x="0" y="0"></rect>
        <g fill="white">
          <g transform="translate(270,54) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,54) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,54) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,54) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(513,54) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(594,54) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,54) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,54) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,81) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,81) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,81) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,81) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(432,81) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(459,81) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,81) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(513,81) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(567,81) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,81) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,81) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,108) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(351,108) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,108) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,108) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(459,108) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,108) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(594,108) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(621,108) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,108) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,108) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,108) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,135) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(459,135) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,135) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(513,135) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,135) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,135) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,135) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,162) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,162) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(432,162) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(459,162) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,162) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,162) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(567,162) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(621,162) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,162) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,189) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,189) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,189) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(513,189) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(567,189) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,216) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,216) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,216) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(432,216) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,216) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,216) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(594,216) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,216) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,216) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,243) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(351,243) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,243) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(432,243) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(459,243) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(513,243) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(567,243) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(594,243) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(621,243) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,243) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(108,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(135,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(162,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(216,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(351,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(513,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(729,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(756,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(783,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(864,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(891,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(918,270) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(108,297) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(135,297) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(162,297) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(189,297) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,297) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,297) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,297) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(459,297) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,297) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(729,297) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(756,297) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(864,297) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(918,297) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(54,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(81,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(135,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(162,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(189,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(216,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(243,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(432,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(459,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(567,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(594,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(756,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(783,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(891,324) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(54,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(81,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(135,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(162,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(189,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(243,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(351,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(567,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(729,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(756,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(837,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(864,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(891,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(918,351) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(81,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(135,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(162,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(216,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(243,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(567,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(621,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(783,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(918,378) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(81,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(135,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(162,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(189,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(243,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(432,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(459,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(513,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(567,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(594,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(756,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(810,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(837,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(918,405) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(54,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(81,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(108,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(135,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(189,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(216,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(243,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(351,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(432,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(459,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(567,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(783,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(810,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(891,432) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(54,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(135,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(162,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(189,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(351,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(432,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(567,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(594,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(621,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(729,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(810,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(837,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(918,459) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(54,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(162,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(216,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(432,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(513,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(729,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(783,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(810,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(864,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(918,486) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(54,513) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(81,513) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(108,513) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(135,513) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(243,513) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,513) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,513) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,513) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,513) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(513,513) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(567,513) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(594,513) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,513) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,513) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(756,513) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(108,540) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(162,540) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(216,540) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(243,540) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,540) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(351,540) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,540) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,540) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(567,540) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(621,540) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,540) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(783,540) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(810,540) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(864,540) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(54,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(189,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(459,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(513,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(594,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(621,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(729,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(810,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(837,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(864,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(891,567) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(54,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(81,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(108,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(189,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(216,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(243,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(351,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(432,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(513,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(783,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(810,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(837,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(891,594) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(54,621) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(108,621) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(189,621) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(243,621) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,621) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,621) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,621) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(459,621) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,621) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,621) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(594,621) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(729,621) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(918,621) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(54,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(108,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(135,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(162,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(216,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(243,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(459,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(513,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(594,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(810,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(837,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(864,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(891,648) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(54,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(108,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(135,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(162,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(513,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(621,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(783,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(837,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(864,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(891,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(918,675) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(54,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(108,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(162,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(189,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(216,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(459,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(594,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(729,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(756,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(783,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(810,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(891,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(918,702) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,729) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,729) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,729) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,729) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,729) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(432,729) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(621,729) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,729) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,729) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(810,729) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(864,729) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(918,729) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,756) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(432,756) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(567,756) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(621,756) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,756) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,756) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(756,756) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(810,756) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(837,756) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(864,756) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(891,756) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(351,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(432,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(567,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(594,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(621,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(810,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(837,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(864,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(891,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(918,783) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,810) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,810) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,810) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(432,810) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(486,810) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,810) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(621,810) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,810) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(729,810) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(756,810) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(783,810) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(810,810) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(891,810) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(918,810) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,837) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,837) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,837) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(351,837) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(513,837) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(594,837) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,837) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(729,837) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(810,837) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(864,837) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(891,837) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(270,864) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(351,864) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(540,864) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,864) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,864) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(729,864) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(756,864) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(837,864) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(864,864) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,891) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,891) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(351,891) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,891) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,891) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(432,891) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(513,891) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(594,891) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(729,891) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(756,891) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(783,891) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(864,891) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(297,918) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(324,918) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(351,918) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(378,918) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(405,918) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(621,918) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(648,918) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(675,918) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(702,918) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(756,918) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(837,918) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(864,918) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
          <g transform="translate(891,918) scale(4.635)">
            <rect width="6" height="6"></rect>
          </g>
        </g>
        <g>
          <g transform="translate(54,54)" fill="white">
            <g transform="scale(13.5)">
              <path d="M0,0v14h14V0H0z M12,12H2V2h10V12z"></path>
            </g>
          </g>
          <g transform="translate(756,54)" fill="white">
            <g transform="scale(13.5)">
              <path d="M0,0v14h14V0H0z M12,12H2V2h10V12z"></path>
            </g>
          </g>
          <g transform="translate(54,756)" fill="white">
            <g transform="scale(13.5)">
              <path d="M0,0v14h14V0H0z M12,12H2V2h10V12z"></path>
            </g>
          </g>
          <g transform="translate(108,108)" fill="white">
            <g transform="scale(13.5)">
              <rect width="6" height="6"></rect>
            </g>
          </g>
          <g transform="translate(810,108)" fill="white">
            <g transform="scale(13.5)">
              <rect width="6" height="6"></rect>
            </g>
          </g>
          <g transform="translate(108,810)" fill="white">
            <g transform="scale(13.5)">
              <rect width="6" height="6"></rect>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

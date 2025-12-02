import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Atom, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GamePromoWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 z-40"
    >
      <Link to={createPageUrl('News')}>
        <div className="group relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
          
          <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-3 rounded-xl shadow-xl cursor-pointer hover:scale-105 transition-transform">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span className="font-semibold text-sm">Défi du Jour</span>
              </div>
              <p className="text-[10px] text-emerald-100">Quiz & pendu chimique</p>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
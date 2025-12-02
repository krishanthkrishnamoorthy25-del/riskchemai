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
          
          <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Atom className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="font-semibold">Défi du Jour</span>
                </div>
                <p className="text-xs text-emerald-100">Quiz spectroscopie & pendu chimique</p>
              </div>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Thermometer, 
  Gauge, 
  FlaskConical, 
  Droplets, 
  Clock, 
  Zap,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  BookOpen
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const parameterIcons = {
  'Température': Thermometer,
  'Temperature': Thermometer,
  'Pression': Gauge,
  'Pressure': Gauge,
  'Catalyseur': Zap,
  'Catalyst': Zap,
  'Solvant': Droplets,
  'Solvent': Droplets,
  'Concentration': FlaskConical,
  'pH': FlaskConical,
  'Temps': Clock,
  'Time': Clock,
};

const influenceColors = {
  'critique': 'bg-red-100 text-red-700 border-red-200',
  'élevé': 'bg-orange-100 text-orange-700 border-orange-200',
  'modéré': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'faible': 'bg-blue-100 text-blue-700 border-blue-200',
  'nul': 'bg-slate-100 text-slate-500 border-slate-200',
};

function ParameterCard({ param, onAskQuestion }) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = parameterIcons[param.parameter] || Zap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg overflow-hidden bg-white"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${influenceColors[param.influence_level]?.split(' ')[0] || 'bg-slate-100'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900">{param.parameter}</p>
                {param.optimal_range && (
                  <p className="text-xs text-slate-500">Optimal: {param.optimal_range}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={influenceColors[param.influence_level]}>
                {param.influence_level}
              </Badge>
              {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
            {/* Current Effect */}
            {param.current_effect && (
              <div className="text-sm text-slate-700">
                <span className="font-medium">Effet actuel: </span>
                {param.current_effect}
              </div>
            )}

            {/* Increase/Decrease Effects */}
            <div className="grid grid-cols-2 gap-2">
              {param.increase_effect && (
                <div className="p-2 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-1 text-xs font-medium text-red-700 mb-1">
                    <ArrowUp className="w-3 h-3" />
                    Si augmenté
                  </div>
                  <p className="text-xs text-red-600">{param.increase_effect}</p>
                </div>
              )}
              {param.decrease_effect && (
                <div className="p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-1 text-xs font-medium text-blue-700 mb-1">
                    <ArrowDown className="w-3 h-3" />
                    Si diminué
                  </div>
                  <p className="text-xs text-blue-600">{param.decrease_effect}</p>
                </div>
              )}
            </div>

            {/* Optimization Tip */}
            {param.optimization_tip && (
              <div className="p-2 bg-emerald-50 rounded-lg flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-emerald-800">Conseil d'optimisation</p>
                  <p className="text-xs text-emerald-700">{param.optimization_tip}</p>
                </div>
              </div>
            )}

            {/* Reference */}
            {param.reference && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <BookOpen className="w-3 h-3" />
                <span>{param.reference}</span>
              </div>
            )}

            {/* Ask Question Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-xs"
              onClick={() => onAskQuestion(param.parameter)}
            >
              <MessageCircle className="w-3 h-3" />
              Comment optimiser ce paramètre ?
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}

export default function ParametersInfluence({ parameters, onAskOptimization }) {
  if (!parameters || parameters.length === 0) return null;

  // Sort by influence level
  const sortOrder = { 'critique': 0, 'élevé': 1, 'modéré': 2, 'faible': 3, 'nul': 4 };
  const sortedParams = [...parameters].sort((a, b) => 
    (sortOrder[a.influence_level] || 5) - (sortOrder[b.influence_level] || 5)
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">Paramètres d'influence</p>
        <div className="flex gap-1">
          {['critique', 'élevé', 'modéré', 'faible'].map(level => {
            const count = parameters.filter(p => p.influence_level === level).length;
            if (count === 0) return null;
            return (
              <Badge key={level} variant="outline" className={`text-xs ${influenceColors[level]}`}>
                {count} {level}
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="grid gap-2">
        {sortedParams.map((param, i) => (
          <ParameterCard 
            key={i} 
            param={param} 
            onAskQuestion={onAskOptimization}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="p-2 bg-slate-50 rounded-lg">
        <p className="text-xs text-slate-500 text-center">
          Cliquez sur un paramètre pour voir comment l'optimiser
        </p>
      </div>
    </div>
  );
}
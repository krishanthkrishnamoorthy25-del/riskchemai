import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FlaskConical, Download, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AnalysisHistory({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">Aucune analyse</h3>
        <p className="text-slate-500">Vos analyses apparaîtront ici après votre première utilisation.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">Historique des analyses</h3>
        <p className="text-sm text-slate-500 mt-1">
          Note : seules les métadonnées sont conservées, pas le contenu des analyses
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {logs.map((log) => (
          <div key={log.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {log.substances_count} substance{log.substances_count > 1 ? 's' : ''} analysée{log.substances_count > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {format(new Date(log.analysis_date), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                </p>
              </div>
            </div>

            {log.export_format && log.export_format !== 'none' && (
              <Badge variant="outline" className="gap-1">
                <Download className="w-3 h-3" />
                {log.export_format.toUpperCase()}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
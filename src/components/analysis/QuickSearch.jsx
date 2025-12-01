import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Loader2 } from 'lucide-react';

export default function QuickSearch({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Ajouter une substance (nom ou CAS)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 h-9 text-sm"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        size="sm"
        disabled={!query.trim() || isLoading}
        className="bg-emerald-500 hover:bg-emerald-600 h-9"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
}
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, Send, Loader2, ExternalLink, 
  ChevronDown, ChevronUp, BookOpen, Search
} from 'lucide-react';

export default function AnalysisChat({ substances }) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleAsk = async () => {
    if (!question.trim() || isLoading) return;

    const userQuestion = question.trim();
    setQuestion('');
    setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setIsLoading(true);

    const substancesList = substances.map(s => `${s.name} (CAS: ${s.cas || 'N/A'})`).join(', ');

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es un expert en sécurité chimique et HSE. L'utilisateur a analysé les substances suivantes : ${substancesList}

QUESTION DE L'UTILISATEUR : ${userQuestion}

INSTRUCTIONS IMPORTANTES :
1. Réponds de manière précise et concise à la question
2. Utilise UNIQUEMENT des données provenant de sources officielles et fiables
3. Pour CHAQUE information fournie, cite la source exacte
4. Si tu n'es pas sûr ou si l'information n'est pas disponible dans les sources officielles, dis-le clairement

SOURCES À PRIVILÉGIER (par ordre de priorité) :
- PubChem (NIH) : données chimiques, propriétés physico-chimiques
- ECHA (European Chemicals Agency) : classification CLP, REACH
- INRS (Institut National de Recherche et de Sécurité) : fiches toxicologiques
- GESTIS (IFA) : valeurs limites d'exposition
- NIOSH : limites d'exposition professionnelle
- HSDB (Hazardous Substances Data Bank) : données toxicologiques

FORMAT DE RÉPONSE :
- Réponse claire et structurée
- Chaque fait important doit être suivi de [Source: NOM_SOURCE]
- Termine par une liste des URLs de référence`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            answer: { type: "string" },
            sources: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  url: { type: "string" },
                  reliability: { type: "string" }
                }
              }
            },
            confidence: { type: "string" }
          }
        }
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.answer,
        sources: response.sources || [],
        confidence: response.confidence
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        sources: []
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "Quelles sont les valeurs limites d'exposition ?",
    "Y a-t-il des effets sur la santé à long terme ?",
    "Quels sont les premiers secours en cas d'exposition ?",
    "Ces substances sont-elles cancérogènes ?",
    "Quelles sont les réactions dangereuses possibles ?"
  ];

  if (!substances || substances.length === 0) return null;

  return (
    <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
      <CardHeader 
        className="cursor-pointer hover:bg-indigo-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="w-5 h-5 text-indigo-600" />
            Questions sur l'analyse
          </CardTitle>
          <Button variant="ghost" size="sm">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-sm text-slate-500">
          Posez une question pour obtenir des informations complémentaires vérifiées
        </p>
      </CardHeader>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <CardContent className="space-y-4">
              {/* Questions suggérées */}
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Search className="w-3 h-3" />
                    Questions fréquentes :
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => setQuestion(q)}
                        className="text-xs bg-white border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`${msg.role === 'user' ? 'ml-8' : 'mr-8'}`}
                  >
                    <div className={`p-4 rounded-xl ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white border border-slate-200'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      
                      {/* Sources */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            Sources consultées :
                          </p>
                          <div className="space-y-1">
                            {msg.sources.map((source, j) => (
                              <a
                                key={j}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-indigo-600 hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>{source.name}</span>
                                {source.reliability && (
                                  <Badge variant="outline" className="text-[10px] py-0">
                                    {source.reliability}
                                  </Badge>
                                )}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Niveau de confiance */}
                      {msg.confidence && (
                        <div className="mt-2">
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] ${
                              msg.confidence === 'high' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              msg.confidence === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-slate-50 text-slate-700'
                            }`}
                          >
                            Fiabilité : {msg.confidence === 'high' ? 'Élevée' : msg.confidence === 'medium' ? 'Moyenne' : msg.confidence}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Recherche dans les sources officielles...
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                  placeholder="Posez une question sur les substances analysées..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleAsk}
                  disabled={!question.trim() || isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-[10px] text-slate-400 text-center">
                Les réponses sont basées sur des sources officielles (PubChem, ECHA, INRS). 
                Vérifiez toujours les informations auprès d'un expert HSE.
              </p>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
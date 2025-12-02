import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Atom, Trophy, Calendar, RefreshCw, Loader2, 
  CheckCircle2, XCircle, HelpCircle, Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

// Générateur de date unique pour le jeu du jour
const getTodayKey = () => format(new Date(), 'yyyy-MM-dd');

export default function DailyChemistryGame({ compact = false }) {
  const [gameType, setGameType] = useState(null); // 'spectrum' ou 'hangman'
  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResult, setShowResult] = useState(false);
  
  // Pendu
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrongGuesses = 6;

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    setIsLoading(true);
    
    // Vérifier si déjà joué aujourd'hui
    const todayKey = getTodayKey();
    const playedData = localStorage.getItem('chemistry_game_played');
    if (playedData) {
      const parsed = JSON.parse(playedData);
      if (parsed.date === todayKey) {
        setHasPlayedToday(true);
        setGameData(parsed.gameData);
        setGameType(parsed.gameType);
        setShowResult(true);
        setIsCorrect(parsed.wasCorrect);
        setIsLoading(false);
        return;
      }
    }

    // Alterner entre les jeux selon le jour
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const todayGameType = dayOfYear % 2 === 0 ? 'spectrum' : 'hangman';
    setGameType(todayGameType);

    try {
      if (todayGameType === 'spectrum') {
        await generateSpectrumGame();
      } else {
        await generateHangmanGame();
      }
    } catch (error) {
      console.error('Error loading game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSpectrumGame = async () => {
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un expert en spectroscopie. Génère un quiz basé sur un spectre RMN ou IR réel d'une molécule simple.

Choisis une molécule courante (éthanol, acétone, benzène, acide acétique, chloroforme, etc.)

Fournis:
1. Le type de spectre (RMN ¹H, RMN ¹³C, ou IR)
2. Une description textuelle des pics caractéristiques (comme dans un article)
3. 4 propositions de molécules dont UNE est la bonne réponse
4. La bonne réponse
5. Une explication pédagogique

Format la description comme un vrai résultat spectroscopique.`,
      response_json_schema: {
        type: "object",
        properties: {
          spectrum_type: { type: "string" },
          spectrum_description: { type: "string" },
          options: { 
            type: "array", 
            items: { 
              type: "object",
              properties: {
                name: { type: "string" },
                formula: { type: "string" }
              }
            }
          },
          correct_index: { type: "number" },
          explanation: { type: "string" },
          source_hint: { type: "string" }
        }
      }
    });

    setGameData(response);
  };

  const generateHangmanGame = async () => {
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Choisis un mot de chimie pour un jeu du pendu (7-12 lettres).

Exemples: CATALYSE, MOLECULE, ELECTRON, POLYMERE, REACTION, ISOTOPE, OXYDATION, SOLVANT, CRISTAL, ENZYME

Fournis:
1. Le mot (en majuscules, sans accents)
2. Un indice court (1 phrase)
3. La définition complète`,
      response_json_schema: {
        type: "object",
        properties: {
          word: { type: "string" },
          hint: { type: "string" },
          definition: { type: "string" }
        }
      }
    });

    setGameData(response);
  };

  const handleSpectrumAnswer = (index) => {
    if (hasPlayedToday || showResult) return;
    
    setSelectedAnswer(index);
    const correct = index === gameData.correct_index;
    setIsCorrect(correct);
    setShowResult(true);
    setHasPlayedToday(true);

    // Sauvegarder
    localStorage.setItem('chemistry_game_played', JSON.stringify({
      date: getTodayKey(),
      gameType: 'spectrum',
      gameData,
      wasCorrect: correct
    }));

    if (correct) {
      toast.success('Bravo ! Bonne réponse !');
    } else {
      toast.error('Dommage ! Réessayez demain.');
    }
  };

  const handleLetterGuess = (letter) => {
    if (hasPlayedToday || guessedLetters.includes(letter)) return;
    
    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    if (!gameData.word.includes(letter)) {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      
      if (newWrong >= maxWrongGuesses) {
        setShowResult(true);
        setIsCorrect(false);
        setHasPlayedToday(true);
        localStorage.setItem('chemistry_game_played', JSON.stringify({
          date: getTodayKey(),
          gameType: 'hangman',
          gameData,
          wasCorrect: false
        }));
        toast.error(`Perdu ! Le mot était : ${gameData.word}`);
      }
    } else {
      // Vérifier si gagné
      const wordLetters = gameData.word.split('');
      const allFound = wordLetters.every(l => newGuessed.includes(l));
      if (allFound) {
        setShowResult(true);
        setIsCorrect(true);
        setHasPlayedToday(true);
        localStorage.setItem('chemistry_game_played', JSON.stringify({
          date: getTodayKey(),
          gameType: 'hangman',
          gameData,
          wasCorrect: true
        }));
        toast.success('Bravo ! Vous avez trouvé le mot !');
      }
    }
  };

  const renderHangman = () => {
    const parts = ['○', '|', '/', '\\', '/', '\\'];
    return (
      <div className="text-center font-mono text-2xl mb-4">
        <div className="text-slate-400">
          {parts.slice(0, wrongGuesses).map((p, i) => (
            <span key={i} className="text-red-500">{p}</span>
          ))}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {wrongGuesses}/{maxWrongGuesses} erreurs
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className={compact ? 'border-emerald-200 bg-emerald-50' : ''}>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Atom className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Défi Chimie du Jour</h3>
              <p className="text-xs text-slate-500">
                {gameType === 'spectrum' ? 'Quiz Spectroscopie' : 'Pendu Chimique'}
              </p>
            </div>
            {hasPlayedToday && (
              <Badge className={isCorrect ? 'bg-emerald-500' : 'bg-red-500'}>
                {isCorrect ? 'Réussi !' : 'Raté'}
              </Badge>
            )}
          </div>
          
          {hasPlayedToday ? (
            <p className="text-sm text-slate-600">
              Revenez demain pour un nouveau défi !
            </p>
          ) : (
            <Button size="sm" className="w-full bg-emerald-500 hover:bg-emerald-600">
              Jouer maintenant
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-emerald-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Atom className="w-5 h-5 text-emerald-500" />
            Défi Chimie du Jour
          </CardTitle>
          <Badge variant="outline" className="gap-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(), 'dd MMMM', { locale: fr })}
          </Badge>
        </div>
        <p className="text-sm text-slate-500">
          {gameType === 'spectrum' 
            ? 'Identifiez la molécule à partir de son spectre' 
            : 'Trouvez le mot chimique caché'}
        </p>
      </CardHeader>
      
      <CardContent>
        {gameType === 'spectrum' && gameData && (
          <div className="space-y-6">
            {/* Type de spectre */}
            <div className="p-4 bg-slate-100 rounded-lg">
              <Badge className="mb-2 bg-indigo-500">{gameData.spectrum_type}</Badge>
              <p className="text-sm font-mono text-slate-700">
                {gameData.spectrum_description}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              {gameData.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSpectrumAnswer(index)}
                  disabled={showResult}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    showResult
                      ? index === gameData.correct_index
                        ? 'border-emerald-500 bg-emerald-50'
                        : selectedAnswer === index
                          ? 'border-red-500 bg-red-50'
                          : 'border-slate-200 bg-slate-50 opacity-50'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <span className="font-semibold text-slate-900">{option.name}</span>
                  <span className="text-sm text-slate-500 block">{option.formula}</span>
                </button>
              ))}
            </div>

            {/* Résultat */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl ${isCorrect ? 'bg-emerald-100' : 'bg-amber-100'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-semibold">
                      {isCorrect ? 'Excellent !' : 'Pas tout à fait...'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{gameData.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {gameType === 'hangman' && gameData && (
          <div className="space-y-6">
            {/* Indice */}
            <div className="p-4 bg-amber-50 rounded-lg flex items-start gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">{gameData.hint}</p>
            </div>

            {/* Pendu visuel */}
            {renderHangman()}

            {/* Mot à deviner */}
            <div className="flex justify-center gap-2 flex-wrap">
              {gameData.word?.split('').map((letter, i) => (
                <div
                  key={i}
                  className={`w-10 h-12 border-b-4 border-slate-300 flex items-center justify-center text-2xl font-bold ${
                    guessedLetters.includes(letter) ? 'text-slate-900' : 'text-transparent'
                  }`}
                >
                  {guessedLetters.includes(letter) || showResult ? letter : '_'}
                </div>
              ))}
            </div>

            {/* Clavier */}
            {!showResult && (
              <div className="flex flex-wrap justify-center gap-1">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleLetterGuess(letter)}
                    disabled={guessedLetters.includes(letter)}
                    className={`w-8 h-10 rounded font-medium text-sm transition-colors ${
                      guessedLetters.includes(letter)
                        ? gameData.word.includes(letter)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-red-200 text-red-700'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            )}

            {/* Résultat */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl ${isCorrect ? 'bg-emerald-100' : 'bg-amber-100'}`}
                >
                  <p className="font-semibold mb-2">
                    {isCorrect ? '🎉 Bravo !' : `Le mot était : ${gameData.word}`}
                  </p>
                  <p className="text-sm text-slate-700">{gameData.definition}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {hasPlayedToday && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg text-center">
            <p className="text-sm text-slate-600">
              ⏰ Prochain défi dans {24 - new Date().getHours()}h
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
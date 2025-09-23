'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Scale,
  Gavel,
  BrainCircuit,
  Lightbulb,
  FileText,
  Shield,
  ListOrdered,
  AlertTriangle,
  Sparkles,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  getLegalAdvice,
  type GetLegalAdviceOutput,
} from '@/ai/flows/get-legal-advice';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { validateQuery, saveQueryToStorage, getQueryFromStorage, clearQueryFromStorage, formatCharacterCount, isNearLimit } from '@/lib/utils';

type Language = 'en' | 'ur';

interface ExampleCase {
  id: string;
  lang: Language;
  text: string;
  category: string;
}

const examples: ExampleCase[] = [
  {
    id: 'landlord-deposit',
    lang: 'en',
    text: 'My landlord is refusing to return my 2-month security deposit without any reason.',
    category: 'Property/Rental',
  },
  {
    id: 'consumer-refund',
    lang: 'en',
    text: 'I bought a new smartphone that stopped working after 3 days. The shop is refusing refund.',
    category: 'Consumer Rights',
  },
  {
    id: 'land-grab',
    lang: 'ur',
    text: 'کسی نے میری غیر حاضرگی میں میری زمین پر قبضہ کر لیا ہے۔',
    category: 'Property',
  },
  {
    id: 'employment-termination',
    lang: 'ur',
    text: 'میرے employer نے بغیر کسی notice کے مجھے نوکری سے نکال دیا ہے۔',
    category: 'Employment',
  },
  {
    id: 'defamation',
    lang: 'en',
    text: 'Someone is spreading false rumors about me on social media.',
    category: 'Defamation',
  },
];

const MAX_QUERY_LENGTH = 2000;
const MIN_QUERY_LENGTH = 10;

export default function LawPlanClient() {
  const [language, setLanguage] = useState<Language>('en');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GetLegalAdviceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Auto-save query to localStorage
  useEffect(() => {
    const savedQuery = getQueryFromStorage();
    if (savedQuery) {
      setQuery(savedQuery);
    }
  }, []);

  useEffect(() => {
    if (query.trim()) {
      saveQueryToStorage(query);
    }
  }, [query]);

  const handleAnalyzeCase = useCallback(async () => {
    const validationError = validateQuery(query, language);
    if (validationError) {
      toast({
        title: language === 'en' ? 'Invalid Query' : 'غلط سوال',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const advice = await getLegalAdvice({ query: query.trim(), language });
      setResult(advice);
      setRetryCount(0);
      toast({
        title: language === 'en' ? 'Analysis Complete' : 'تجزیہ مکمل',
        description: language === 'en' 
          ? 'Your legal analysis is ready.'
          : 'آپ کا قانونی تجزیہ تیار ہے۔',
      });
    } catch (error) {
      console.error('Error processing case:', error);
      const errorMessage = language === 'en'
        ? 'An error occurred while processing your case. Please try again.'
        : 'آپ کے کیس کو پروسیس کرتے وقت خرابی ہوئی۔ براہ کرم دوبارہ کوشش کریں۔';
      
      setError(errorMessage);
      toast({
        title: language === 'en' ? 'Analysis Failed' : 'تجزیہ ناکام',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [query, language, validateQuery, toast]);

  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      handleAnalyzeCase();
    }
  }, [retryCount, handleAnalyzeCase]);

  const handleClear = useCallback(() => {
    setQuery('');
    setResult(null);
    setError(null);
    setRetryCount(0);
    clearQueryFromStorage();
    textareaRef.current?.focus();
  }, []);

  const loadExample = useCallback((text: string, lang: Language) => {
    setQuery(text);
    setLanguage(lang);
    setResult(null);
    setError(null);
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAnalyzeCase();
    }
  }, [handleAnalyzeCase]);

  return (
    <div 
      className="flex flex-col min-h-screen text-foreground bg-cover bg-center bg-fixed bg-gradient-to-br from-background via-background to-secondary/20"
      style={{
        backgroundImage: "url('/images/background.jpg')",
      }}
    >
      <div className="flex flex-col min-h-screen bg-black/30">
        {isLoading && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="loading-title"
          >
            <div className="relative w-48 h-48 flex items-center justify-center">
              <Gavel className="w-32 h-32 text-primary hammer-animation -scale-x-100" />
              <Loader2 className="absolute w-8 h-8 text-primary animate-spin" />
            </div>
            <p id="loading-title" className="text-xl mt-4 text-white">
              {language === 'en' ? 'Analyzing your case...' : 'آپ کے کیس کا تجزیہ ہو رہا ہے...'}
            </p>
            <p className="text-sm mt-2 text-white/70">
              {language === 'en' ? 'This may take a few moments' : 'یہ کچھ لمحات لے سکتا ہے'}
            </p>
          </div>
        )}
        <header className="px-4 lg:px-6 h-20 flex items-center justify-center border-b border-border/20 sticky top-0 bg-background/50 backdrop-blur-lg z-10">
          <div className="flex items-center gap-3 font-semibold text-xl font-serif">
            <Scale className="h-7 w-7 text-primary" aria-hidden="true" />
            <span className="text-2xl tracking-tight">JusticeAI Pakistan</span>
          </div>
          <div className="absolute right-6 w-[120px]">
            <Select
              value={language}
              onValueChange={value => setLanguage(value as Language)}
              aria-label={language === 'en' ? 'Select language' : 'زبان منتخب کریں'}
            >
              <SelectTrigger className="w-full bg-secondary border-border/50">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ur">اردو</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="shadow-2xl bg-card/70 border-border/30">
              <CardHeader className="text-center">
                <CardTitle className="font-serif flex items-center justify-center gap-3 text-3xl">
                  <BrainCircuit className="h-8 w-8 text-primary/80" aria-hidden="true" />
                  {language === 'en' ? 'Describe Your Legal Situation' : 'اپنی قانونی صورتحال بیان کریں'}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  {language === 'en' 
                    ? 'Enter your query below. Our AI will provide an analysis and a step-by-step action plan.'
                    : 'نیچے اپنا سوال درج کریں۔ ہماری AI تجزیہ اور قدم بہ قدم عمل کا منصوبہ فراہم کرے گی۔'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Textarea
                    ref={textareaRef}
                    placeholder={
                      language === 'en'
                        ? 'Explain your legal issue in detail...'
                        : 'اپنا قانونی مسئلہ تفصیل سے بیان کریں...'
                    }
                    className="min-h-[150px] resize-y text-base p-4 border-border/50 focus:ring-primary/50 bg-secondary/30"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={MAX_QUERY_LENGTH}
                    aria-label={language === 'en' ? 'Legal query input' : 'قانونی سوال کی ان پٹ'}
                    aria-describedby="query-help query-counter"
                    disabled={isLoading}
                  />
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span id="query-help">
                      {language === 'en' 
                        ? `Minimum ${MIN_QUERY_LENGTH} characters required`
                        : `کم از کم ${MIN_QUERY_LENGTH} حروف درکار ہیں`
                      }
                    </span>
                    <span id="query-counter" className={isNearLimit(query.length, MAX_QUERY_LENGTH) ? 'text-destructive' : ''}>
                      {formatCharacterCount(query.length, MAX_QUERY_LENGTH)}
                    </span>
                  </div>
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                      {retryCount < 3 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRetry}
                          className="mt-2"
                          disabled={isLoading}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          {language === 'en' ? 'Retry' : 'دوبارہ کوشش کریں'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex-wrap gap-4 justify-center">
                <Button
                  onClick={handleAnalyzeCase}
                  disabled={isLoading || !query.trim() || query.length < MIN_QUERY_LENGTH}
                  size="lg"
                  aria-describedby="analyze-help"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-5 w-5" />
                  )}
                  {language === 'en'
                    ? 'Analyze Case & Get Action Plan'
                    : 'مقدمہ کا تجزیہ کریں'}
                </Button>
                <Button
                  onClick={handleClear}
                  variant="secondary"
                  disabled={isLoading}
                >
                  {language === 'en' ? 'Clear' : 'صاف کریں'}
                </Button>
              </CardFooter>
              <div id="analyze-help" className="sr-only">
                {language === 'en' 
                  ? 'Press Ctrl+Enter or Cmd+Enter to quickly analyze your case'
                  : 'اپنے کیس کا فوری تجزیہ کرنے کے لیے Ctrl+Enter یا Cmd+Enter دبائیں'
                }
              </div>
            </Card>

            <Card className="min-h-[300px] shadow-2xl bg-card/70 border-border/30">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-3 text-3xl">
                  <Lightbulb className="h-8 w-8 text-primary/80" aria-hidden="true" />
                  {language === 'en' ? 'Legal Analysis & Action Plan' : 'قانونی تجزیہ اور عمل کا منصوبہ'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-8" role="region" aria-label={language === 'en' ? 'Legal analysis results' : 'قانونی تجزیہ کے نتائج'}>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h3 className="font-serif mb-3 text-2xl flex items-center gap-3 font-semibold text-primary">
                        <FileText className="h-6 w-6" aria-hidden="true" />
                        {language === 'ur' ? 'قانونی تجزیہ' : 'Legal Analysis'}
                      </h3>
                      <div className="text-muted-foreground whitespace-pre-wrap text-base leading-relaxed prose prose-invert">
                        {result.legalAnalysis}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h3 className="font-serif mb-3 text-2xl flex items-center gap-3 font-semibold text-primary">
                        <Shield className="h-6 w-6" aria-hidden="true" />
                        {language === 'ur' ? 'آپ کے حقوق' : 'Your Rights'}
                      </h3>
                      <div className="text-muted-foreground whitespace-pre-wrap text-base leading-relaxed prose prose-invert">
                        {result.rightsAnalysis}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h3 className="font-serif mb-3 text-2xl flex items-center gap-3 font-semibold text-primary">
                        <ListOrdered className="h-6 w-6" aria-hidden="true" />
                        {language === 'ur' ? 'عمل کا منصوبہ' : 'Action Plan'}
                      </h3>
                      <div className="text-muted-foreground whitespace-pre-wrap text-base leading-relaxed prose prose-invert">
                        {result.actionPlan}
                      </div>
                    </div>
                    <Separator />
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <h3 className="font-serif mb-3 text-xl flex items-center gap-3 font-semibold text-destructive">
                        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
                        {language === 'ur'
                          ? 'اہم نوٹس'
                          : 'Important Disclaimer'}
                      </h3>
                      <div className="text-destructive/80 whitespace-pre-wrap text-sm leading-relaxed">
                        {result.disclaimer}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full min-h-[200px] items-center justify-center text-center text-muted-foreground/60">
                    <div>
                      <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" aria-hidden="true" />
                      <p className="text-lg">
                        {language === 'en' 
                          ? 'Your analysis and action plan will appear here.'
                          : 'آپ کا تجزیہ اور عمل کا منصوبہ یہاں ظاہر ہوگا۔'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Accordion
              type="single"
              collapsible
              className="bg-card/70 border border-border/30 rounded-lg p-2"
            >
              <AccordionItem value="examples" className="border-none">
                <AccordionTrigger className="text-lg font-serif hover:no-underline px-4">
                  💡 {language === 'en' ? 'Example Cases' : 'مثالی کیسز'}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {examples.map((ex) => (
                      <Button
                        key={ex.id}
                        variant="outline"
                        className="text-left h-auto whitespace-normal bg-secondary/50 hover:bg-secondary border-border/50 p-4"
                        onClick={() => loadExample(ex.text, ex.lang)}
                        disabled={isLoading}
                        aria-label={`Load example: ${ex.text}`}
                      >
                        <div className="text-left">
                          <div className="text-xs text-muted-foreground mb-1">
                            {ex.category}
                          </div>
                          <div className="text-sm">
                            {ex.text}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="text-center text-xs text-muted-foreground/60 pt-8">
              <p className="font-semibold text-sm">
                ⚠️ Important Disclaimer / اہم انتباہ:
              </p>
              <p>
                JusticeAI provides legal information based on Pakistani laws.
                This is not legal advice. Always consult with a qualified
                lawyer for your specific situation.
              </p>
              <p>
                عدالتAI پاکستانی قوانین کی بنیاد پر قانونی معلومات فراہم کرتا
                ہے۔ یہ قانونی مشورہ نہیں ہے۔ اپنی مخصوص صورت حال کے لیے ہمیشہ
                کوالیفائیڈ وکیل سے مشورہ کریں۔
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

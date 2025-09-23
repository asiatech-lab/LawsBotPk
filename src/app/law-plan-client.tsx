'use client';

import { useState } from 'react';
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

type Language = 'en' | 'ur';

const examples = [
  {
    lang: 'en',
    text: 'My landlord is refusing to return my 2-month security deposit without any reason.',
  },
  {
    lang: 'en',
    text: 'I bought a new smartphone that stopped working after 3 days. The shop is refusing refund.',
  },
  {
    lang: 'ur',
    text: 'کسی نے میری غیر حاضرگی میں میری زمین پر قبضہ کر لیا ہے۔',
  },
  {
    lang: 'ur',
    text: 'میرے employer نے بغیر کسی notice کے مجھے نوکری سے نکال دیا ہے۔',
  },
  {
    lang: 'en',
    text: 'Someone is spreading false rumors about me on social media.',
  },
];

export default function LawPlanClient() {
  const [language, setLanguage] = useState<Language>('en');
  const [query, setQuery] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GetLegalAdviceOutput | null>(null);

  const { toast } = useToast();

  const handleAnalyzeCase = async () => {
    if (!query.trim()) {
      toast({
        title: 'Query is empty',
        description: 'Please enter a legal query to analyze.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const advice = await getLegalAdvice({ query, language });
      setResult(advice);
    } catch (error) {
      console.error('Error processing case:', error);
      toast({
        title: 'Analysis Failed',
        description:
          'An error occurred while processing your case. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
  };

  const loadExample = (text: string, lang: Language) => {
    setQuery(text);
    setLanguage(lang);
  };

  return (
    <div
      className="flex flex-col min-h-screen text-foreground bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://ercevskoe-r29.gosweb.gosuslugi.ru/netcat_files/37/45/femida.jpg')",
      }}
    >
      <div className="flex flex-col min-h-screen bg-black/30">
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <Gavel className="w-32 h-32 text-primary hammer-animation -scale-x-100" />
            </div>
            <p className="text-xl mt-4 text-white">
              Analyzing your case...
            </p>
          </div>
        )}
        <header className="px-4 lg:px-6 h-20 flex items-center justify-center border-b border-border/20 sticky top-0 bg-background/50 backdrop-blur-lg z-10">
          <div className="flex items-center gap-3 font-semibold text-xl font-serif">
            <Scale className="h-7 w-7 text-primary" />
            <span className="text-2xl tracking-tight">JusticeAI Pakistan</span>
          </div>
          <div className="absolute right-6 w-[120px]">
            <Select
              value={language}
              onValueChange={value => setLanguage(value as Language)}
            >
              <SelectTrigger className="w-full bg-secondary border-border/50">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ur">Urdu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="shadow-2xl bg-card/70 border-border/30">
              <CardHeader className="text-center">
                <CardTitle className="font-serif flex items-center justify-center gap-3 text-3xl">
                  <BrainCircuit className="h-8 w-8 text-primary/80" />
                  Describe Your Legal Situation
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Enter your query below. Our AI will provide an analysis and a
                  step-by-step action plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={
                    language === 'en'
                      ? 'Explain your legal issue in detail...'
                      : 'اپنا قانونی مسئلہ تفصیل سے بیان کریں...'
                  }
                  className="min-h-[150px] resize-y text-base p-4 border-border/50 focus:ring-primary/50 bg-secondary/30"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex-wrap gap-4 justify-center">
                <Button
                  onClick={handleAnalyzeCase}
                  disabled={isLoading}
                  size="lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
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
            </Card>

            <Card className="min-h-[300px] shadow-2xl bg-card/70 border-border/30">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-3 text-3xl">
                  <Lightbulb className="h-8 w-8 text-primary/80" />
                  Legal Analysis & Action Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-8">
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h3 className="font-serif mb-3 text-2xl flex items-center gap-3 font-semibold text-primary">
                        <FileText className="h-6 w-6" />
                        {language === 'ur' ? 'قانونی تجزیہ' : 'Legal Analysis'}
                      </h3>
                      <div className="text-muted-foreground whitespace-pre-wrap text-base leading-relaxed prose prose-invert">
                        {result.legalAnalysis}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h3 className="font-serif mb-3 text-2xl flex items-center gap-3 font-semibold text-primary">
                        <Shield className="h-6 w-6" />
                        {language === 'ur' ? 'آپ کے حقوق' : 'Your Rights'}
                      </h3>
                      <div className="text-muted-foreground whitespace-pre-wrap text-base leading-relaxed prose prose-invert">
                        {result.rightsAnalysis}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h3 className="font-serif mb-3 text-2xl flex items-center gap-3 font-semibold text-primary">
                        <ListOrdered className="h-6 w-6" />
                        {language === 'ur' ? 'عمل کا منصوبہ' : 'Action Plan'}
                      </h3>
                      <div className="text-muted-foreground whitespace-pre-wrap text-base leading-relaxed prose prose-invert">
                        {result.actionPlan}
                      </div>
                    </div>
                    <Separator />
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <h3 className="font-serif mb-3 text-xl flex items-center gap-3 font-semibold text-destructive">
                        <AlertTriangle className="h-6 w-6" />
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
                    <p className="text-lg">
                      Your analysis and action plan will appear here.
                    </p>
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
                  💡 Example Cases / مثالی کیسز
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {examples.map((ex, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="text-left h-auto whitespace-normal bg-secondary/50 hover:bg-secondary border-border/50"
                        onClick={() =>
                          loadExample(ex.text, ex.lang as Language)
                        }
                      >
                        {ex.text}
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

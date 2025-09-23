import { useState, useCallback } from 'react';
import { getLegalAdvice, type GetLegalAdviceOutput } from '@/ai/flows/get-legal-advice';
import { useToast } from '@/hooks/use-toast';

type Language = 'en' | 'ur';

interface UseLegalAnalysisReturn {
  isLoading: boolean;
  result: GetLegalAdviceOutput | null;
  error: string | null;
  retryCount: number;
  analyzeCase: (query: string, language: Language) => Promise<void>;
  retry: () => void;
  clear: () => void;
}

export function useLegalAnalysis(): UseLegalAnalysisReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GetLegalAdviceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const { toast } = useToast();

  const analyzeCase = useCallback(async (query: string, language: Language) => {
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
  }, [toast]);

  const retry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      // Note: This would need the original query and language to retry
      // For now, we'll handle retry in the component
    }
  }, [retryCount]);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
    setRetryCount(0);
  }, []);

  return {
    isLoading,
    result,
    error,
    retryCount,
    analyzeCase,
    retry,
    clear,
  };
}

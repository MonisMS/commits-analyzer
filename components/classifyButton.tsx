'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Brain } from 'lucide-react';
import { toast } from 'sonner';

export function ClassifyButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClassify = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/classification/classify', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Classification Complete', {
          description: `Classified ${data.data.classified} commits`,
        });
        // Refresh to show updated stats
        window.location.reload();
      } else {
        toast.error('Classification Failed', {
          description: data.error || 'Failed to classify commits',
        });
      }
    } catch {
      toast.error('Classification Error', {
        description: 'Network error occurred during classification',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleClassify} 
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Classifying...
        </>
      ) : (
        <>
          <Brain className="mr-2 h-4 w-4" />
          Classify Commits
        </>
      )}
    </Button>
  );
}


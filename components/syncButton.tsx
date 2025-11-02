'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function SyncButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/github/sync', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Sync Successful', {
          description: `Added ${data.data.commitsAdded} commits from ${data.data.repositoriesSynced} repositories`,
        });
      } else {
        toast.error('Sync Failed', {
          description: data.error || 'Failed to sync GitHub data',
        });
      }
    } catch {
      toast.error('Sync Error', {
        description: 'Network error occurred during sync',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSync} 
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Syncing...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync GitHub Data
        </>
      )}
    </Button>
  );
}
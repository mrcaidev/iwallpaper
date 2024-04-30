import { useToast } from "components/ui/use-toast";
import { useEffect } from "react";

export function useErrorToast(error: string) {
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({ variant: "destructive", description: error });
    }
  }, [error]);
}

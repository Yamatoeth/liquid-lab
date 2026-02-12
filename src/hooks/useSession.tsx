import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export function useSession() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sessionData) => {
      if (mounted) setSession(sessionData?.session ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session };
}

export default useSession;

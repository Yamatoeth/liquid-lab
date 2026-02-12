import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { syncLocalFavoritesToSupabase } from "@/lib/favorites";
import { useToast } from "./use-toast";

export function useSession() {
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      // regular session (from storage/cookie)
      const { data } = await supabase.auth.getSession();
      if (mounted) setSession(data.session ?? null);

      // handle redirect result (OAuth/magic link) without relying on auto-injected inline scripts
      try {
        const { data: urlData, error: urlErr } = await supabase.auth.getSessionFromUrl({ storeSession: true });
        if (!urlErr && urlData?.session && mounted) {
          setSession(urlData.session);
        }
      } catch (e) {
        // ignore; CSP/extension issues could surface here in some environments
        console.debug('getSessionFromUrl:', e);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((event, sessionData) => {
      const s = sessionData?.session ?? null
      if (mounted) setSession(s);
      // On sign in, attempt to sync any local favorites to Supabase
      if (event === 'SIGNED_IN' && s) {
        (async () => {
          try {
            const { synced, failed } = await syncLocalFavoritesToSupabase(s)
            if (synced > 0) {
              toast({ title: 'Favorites synced', description: `${synced} favorite(s) merged.` })
            }
            if (failed > 0) {
              toast({ title: 'Favorites sync partial', description: `${failed} favorite(s) failed to sync.` })
            }
          } catch (e: any) {
            console.warn('Favorites sync failed', e)
            toast({ title: 'Favorites sync failed', description: e?.message || 'Could not sync favorites.' })
          }
        })()
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session };
}

export default useSession;

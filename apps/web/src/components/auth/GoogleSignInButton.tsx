import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../state/auth";

declare global {
  interface Window {
    google?: any;
  }
}

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Google script failed")));
      return;
    }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Google script failed"));
    document.head.appendChild(s);
  });
}

export default function GoogleSignInButton() {
  const auth = useAuth();
  const ref = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  const enabled = useMemo(() => Boolean(clientId && clientId.length > 10), [clientId]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      if (!enabled) return;
      try {
        await loadGoogleScript();
        if (cancelled) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (resp: { credential?: string }) => {
            if (!resp.credential) return;
            try {
              await auth.loginWithGoogle(resp.credential);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Google login failed");
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        if (ref.current) {
          ref.current.innerHTML = "";
          window.google.accounts.id.renderButton(ref.current, {
            theme: "outline",
            size: "large",
            shape: "pill",
            text: "continue_with",
            width: 320,
          });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Google login failed");
      }
    }
    void init();
    return () => {
      cancelled = true;
    };
  }, [enabled, clientId, auth]);

  if (!enabled) {
    return (
      <button className="btn-secondary w-full opacity-60 cursor-not-allowed" disabled>
        Google sign-in (set `VITE_GOOGLE_CLIENT_ID`)
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <div ref={ref} className="flex justify-center" />
      {error ? <div className="text-xs text-rose-700 text-center">{error}</div> : null}
    </div>
  );
}


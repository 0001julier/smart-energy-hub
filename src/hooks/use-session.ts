import { useEffect, useState } from "react";
import { getSession, type Session } from "@/lib/auth";

export function useSession(): Session | null {
  const [s, setS] = useState<Session | null>(() => getSession());
  useEffect(() => {
    const sync = () => setS(getSession());
    window.addEventListener("auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return s;
}

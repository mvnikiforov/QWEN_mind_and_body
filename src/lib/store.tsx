import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loadDB,
  subscribe,
  getSession,
  login as dbLogin,
  logout as dbLogout,
  type DB,
  type Session,
} from "./db";

interface StoreValue {
  db: DB;
  session: Session | null;
  login: (login: string, password: string) => boolean;
  logout: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(() => loadDB());
  const [session, setSession] = useState<Session | null>(() => getSession());

  useEffect(() => {
    return subscribe(() => setDb({ ...loadDB() }));
  }, []);

  const login = useCallback((l: string, p: string) => {
    const s = dbLogin(l, p);
    if (s) {
      setSession(s);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    dbLogout();
    setSession(null);
    if (typeof window !== "undefined") window.location.hash = "#/";
  }, []);

  const value = useMemo(() => ({ db, session, login, logout }), [db, session, login, logout]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

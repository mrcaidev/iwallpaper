import { Session } from "@supabase/supabase-js";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { snakeToCamelObject } from "utils/case";
import { supabase } from "utils/supabase";
import { User } from "utils/types";

const UserContext = createContext<User | undefined>(undefined);

export function UserProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => setSession(session));

    return () => subscription.unsubscribe();
  }, []);

  const user = useMemo(() => extractUserFromSession(session), [session]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

function extractUserFromSession(session: Session | null) {
  if (!session) {
    return undefined;
  }

  const { id, email, userMetadata } = snakeToCamelObject(session.user);
  return { id, email, ...userMetadata } as User;
}

export function useUser() {
  return useContext(UserContext);
}

"use client";

import { Session } from "@supabase/supabase-js";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabaseClient } from "supabase/client";
import { snakeToCamelJson } from "utils/case";
import { User } from "utils/types";

const UserContext = createContext<User | null>(null);

export function UserProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabaseClient.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_, session) =>
      setSession(session),
    );

    return () => subscription.unsubscribe();
  }, []);

  const user = useMemo(() => extractUserFromSession(session), [session]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

function extractUserFromSession(session: Session | null) {
  if (!session) {
    return null;
  }

  const { id, email, userMetadata } = snakeToCamelJson(session.user);
  return { id, email, ...userMetadata } as User;
}

export function useUser() {
  return useContext(UserContext);
}

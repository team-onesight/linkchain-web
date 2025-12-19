import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store.ts";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { refreshSession } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshSession();
        setIsInitialized(true);
      } catch (e) {
        console.log(e);
      }
    };
    initAuth().then(() => {
      setIsInitialized(true);
    });
  }, []);

  return (
    <div style={
      isInitialized ? { display: "block" } : { display: "none" }
    }>
      {children}
    </div>
  );
};

export { AuthProvider };

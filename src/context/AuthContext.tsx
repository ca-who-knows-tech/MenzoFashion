import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  user: any | null;
  setUser: (u: any | null) => void;
  googleReady: boolean;
  promptSignIn: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<any | null>(() => {
    try {
      const raw = localStorage.getItem('menzo_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [googleReady, setGoogleReady] = useState(false);

  const setUser = (u: any | null) => {
    try {
      if (u) {
        localStorage.setItem('menzo_user', JSON.stringify(u));
      } else {
        localStorage.removeItem('menzo_user');
      }
    } catch (e) {
      // ignore storage errors
    }
    setUserState(u);
  };

  useEffect(() => {
    // Initialize Google Identity Services once for the app
    const initializeGoogle = () => {
      const win = window as any;
      if (win.google && win.google.accounts && win.google.accounts.id) {
        win.google.accounts.id.initialize({
          client_id: import.meta.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE',
          callback: (response: any) => {
            try {
              const userObject = JSON.parse(atob(response.credential.split('.')[1]));
              setUser(userObject);
            } catch (e) {
              console.error('Failed to parse Google credential', e);
            }
          },
        });
        setGoogleReady(true);
      }
    };

    const checkLoaded = () => {
      const win = window as any;
      if (win.google && win.google.accounts && win.google.accounts.id) {
        initializeGoogle();
      } else {
        setTimeout(checkLoaded, 100);
      }
    };

    checkLoaded();
  }, []);

  const promptSignIn = () => {
    const win = window as any;
    if (win.google && win.google.accounts && win.google.accounts.id && googleReady) {
      try {
        // Create a temporary container for the button
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.zIndex = '9999';
        document.body.appendChild(container);

        win.google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
        });

        // Auto-click the button
        setTimeout(() => {
          const btn = container.querySelector('div[role="button"]') as HTMLElement;
          if (btn) btn.click();
        }, 100);

        // Clean up after interaction
        setTimeout(() => {
          if (container.parentNode) container.parentNode.removeChild(container);
        }, 5000);
      } catch (e) {
        console.error('google sign-in failed', e);
      }
    } else {
      console.warn('Google Identity Services not ready');
    }
  };

  return (
    <AuthContext.Provider value={{ user: userState, setUser, googleReady, promptSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;

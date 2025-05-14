'use client';

import BubbleStack from '@/components/common/Bubble';
import { Logo } from '@/components/common/Logo';
import SplashScreen from '@/components/composed/SplashScreen';
import {
  AppState,
  AppStateContext,
  initialState,
  reducer,
} from '@/hooks/useAppState';
import { PATHNAME } from '@/configurations/pathnames';
import { theme } from '@/theme/theme';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useReducer, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { theme: currentTheme } = state as AppState;
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setInterval(() => {
      setShowSplashScreen(false);
    }, 1000);
  }, []);

  if (showSplashScreen) {
    return <SplashScreen />;
  }

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      <ThemeProvider theme={theme[currentTheme]}>
        <StyledMain>
          {pathname !== PATHNAME.appSignIn && (
            <StyledLogoPositioning>
              <Link href={PATHNAME.app} style={{ display: 'flex' }}>
                <Logo.Symbol width={34} />
              </Link>
            </StyledLogoPositioning>
          )}

          {children}
        </StyledMain>
        <BubbleStack />
      </ThemeProvider>
    </AppStateContext.Provider>
  );
}

const StyledMain = styled.main`
  ${({ theme }) => theme.mainBackgroundStyles};
  display: flex;
  padding-top: 50px;
  min-height: 100vh;
  align-items: center;
  flex-direction: column;
  padding: 2rem 1em 8rem 1em;
  overflow-x: hidden;
`;

const StyledLogoPositioning = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: row;
  position: absolute;
  top: 12px;
  left: 12px;
  align-items: center;
`;

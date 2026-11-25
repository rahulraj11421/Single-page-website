import { useCallback, useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { NsfwModal } from './components/NsfwModal';
import { SearchModal } from './components/SearchModal';
import { RouterProvider, useRouter } from './lib/router';
import { AboutPage } from './pages/AboutPage';
import { ActivityPage } from './pages/ActivityPage';
import { DetailPage } from './pages/DetailPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { GraveyardPage } from './pages/GraveyardPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SectionPage } from './pages/SectionPage';
import { SubmitPage } from './pages/SubmitPage';

const THEME_KEY = 'kuraindex_theme';
const NSFW_KEY = 'kuraindex_nsfw';

function AppShell() {
  const { pathname } = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [nsfwModalOpen, setNsfwModalOpen] = useState(false);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [showNsfw, setShowNsfw] = useState<boolean>(() => {
    try {
      return localStorage.getItem(NSFW_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Storage unavailable
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(NSFW_KEY, String(showNsfw));
    } catch {
      // Storage unavailable
    }
  }, [showNsfw]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (!isTyping && e.key === '/') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleRequestToggleNsfw = useCallback(() => {
    if (showNsfw) {
      setShowNsfw(false);
    } else {
      setNsfwModalOpen(true);
    }
  }, [showNsfw]);

  const confirmNsfw = useCallback(() => {
    setShowNsfw(true);
    setNsfwModalOpen(false);
  }, []);

  let page: React.ReactNode;

  if (pathname === '/' || pathname === '') {
    page = (
      <HomePage
        theme={theme}
        onToggleTheme={toggleTheme}
        showNsfw={showNsfw}
        onRequestToggleNsfw={handleRequestToggleNsfw}
      />
    );
  } else if (pathname.startsWith('/section/')) {
    const category = pathname.slice('/section/'.length).replace(/\/+$/, '');
    page = <SectionPage category={category} showNsfw={showNsfw} />;
  } else if (pathname.startsWith('/s/')) {
    const slug = pathname.slice('/s/'.length).replace(/\/+$/, '');
    page = <DetailPage slug={slug} showNsfw={showNsfw} />;
  } else if (pathname === '/graveyard') {
    page = <GraveyardPage showNsfw={showNsfw} />;
  } else if (pathname === '/activity') {
    page = <ActivityPage showNsfw={showNsfw} />;
  } else if (pathname === '/about') {
    page = <AboutPage />;
  } else if (pathname === '/disclaimer') {
    page = <DisclaimerPage />;
  } else if (pathname === '/submit') {
    page = <SubmitPage />;
  } else {
    page = <NotFoundPage onOpenSearch={() => setSearchOpen(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f5] text-zinc-900 dark:bg-[#0f0f0f] dark:text-zinc-100">
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        showNsfw={showNsfw}
        onRequestToggleNsfw={handleRequestToggleNsfw}
      />
      <div className="flex-1">{page}</div>
      <Footer
        theme={theme}
        onToggleTheme={toggleTheme}
        showNsfw={showNsfw}
        onRequestToggleNsfw={handleRequestToggleNsfw}
      />
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        showNsfw={showNsfw}
      />
      <NsfwModal
        open={nsfwModalOpen}
        onConfirm={confirmNsfw}
        onCancel={() => setNsfwModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppShell />
    </RouterProvider>
  );
}

import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

'use client';

// Ensures it's a Client Component
import { usePathname } from 'next/navigation';

import Footer from './Footer';
import Navbar from './Navbar';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? '';
  const hideNavbarRoutes = ['/login', '/register'];

  return (
    <>
      {!hideNavbarRoutes.includes(pathname) && <Navbar />}
      {children}
      {!hideNavbarRoutes.includes(pathname) && <Footer />}
    </>
  );
}

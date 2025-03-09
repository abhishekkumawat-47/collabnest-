"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const showNavbar = pathname !== '/welcome' && pathname !== '/';

  return (
    <>
      {showNavbar && <Navbar />}
    </>
  );
}

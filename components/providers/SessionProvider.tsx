// components/providers/SessionProvider.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export default function NextAuthSessionProvider({ 
  children,
  session
}: { 
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
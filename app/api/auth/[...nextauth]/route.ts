// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            tenantId: process.env.AZURE_AD_TENANT_ID,
            authorization: {
                params: {
                    scope: 'openid profile email',
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            // ✅ Restrict to iitp.ac.in email
            // return true;
            console.log('profile', account, profile);
            if (profile?.email?.endsWith('@iitp.ac.in')) {
                return true;
            }
            return false;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

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
          scope: 'openid profile email offline_access User.Read', // OnlineMeetings.ReadWrite  ---> after admin approval we can use this  
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (profile?.email?.endsWith('@iitp.ac.in')) {
        return true;
      }
      return false;
    },
    async jwt({ token,account, profile }) {
      // Add user role to token
      // This is where you'd determine the user's role
      // You could check against a database, or use specific email patterns, etc.

      if (account) {
        //console.log("Account from JWT callback:", account);
        //console.log("Access Token from Azure AD:", account?.access_token);
        token.accessToken = account.access_token;
        token.expiresAt = account.expires_at;
        token.refreshToken = account.refresh_token;
        token.tokenType = account.token_type;
      }
      
      if (profile) {
        // Example: determine role based on email or other profile data
        // You'll need to implement your own logic here
        // const email = profile.email || token.email;
        
        // // Example role determination (customize based on your needs)
        // if (email === 'admin@iitp.ac.in') {
        //   token.role = 'admin';
        // } else if (email?.includes('moderator')) {
        //   token.role = 'moderator';
        // } else {
        //   token.role = 'user';
        // }
        
        // Preserve other profile information
        token.oid = profile.oid;
        token.email = profile.email;
        token.name = profile.name;
        // token.preferred_username = profile.preferred_username;
      }
      
      return token;
    },
    async session({ session, token }) {
      // Add role and other user info to the session
      //console.log("token" , token);
      if (token) {
        session.user = {
          ...session.user,
        //   id: token.sub,
        //   oid: token.oid,
          email: token.email,
          name: token.name,
        //   role: token.role,
        //   preferredUsername: token.preferred_username,
        };
        session.accessToken = token.accessToken;
        //console.log("Access Token in session:", session);
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
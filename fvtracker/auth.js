import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db/mongoDb";
import authLib from "@/lib/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        login: {
          label: "Email ili username",
          type: "text",
          placeholder: "unesite email ili username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("Authorizing with credentials:", credentials);
        return await authLib.authorizationHandlers.handleCredentials(
          credentials,
        );
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider == "google") {
        const authorize =
          await authLib.authorizationHandlers.handleOAuth(profile);
        return !!authorize;
      }
      if (account.provider == "credentials") {
        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.appUserId = user.appUserId;
        token.email = user.email;
        token.managerModelName = user.managerModelName;
        token.displayName = user.displayName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.appUserId = token.appUserId;
        session.user.email = token.email;
        session.user.managerModelName = token.managerModelName;
        session.user.displayName = token.displayName;
      }
      return session;
    },
  },
});

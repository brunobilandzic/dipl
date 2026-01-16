import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db/mongoDb";
import { handleOAuth, authorizeCredentials } from "./handler";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "unesite email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // credentials contain email and password
        const appUser = await authorizeCredentials(credentials);
        return appUser;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      const { authorize, redirectTo } = await handleOAuth(user.email);
      if (redirectTo) {
        return redirectTo;
      }
      return !!authorize;
    },
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

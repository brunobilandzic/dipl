import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db/mongoDb";
import { handleCredentials } from "@/lib/auth/handlers";
import users from "./lib/users";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        login: {
          label: "Email ili username",
          type: "text",
          placeholder: "Email ili username",
        },
        password: { label: "Lozinka", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("Authorizing with credentials:", credentials);
        try {
          return await handleCredentials(credentials);
        } catch (error) {
          // proslijedi poruku bačene greške do klijenta preko `code`
          const signinError = new CredentialsSignin(error.message);
          signinError.code = error.message;
          throw signinError;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider == "credentials") {
        return true;
      }
      return false;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.appUserId = user.appUserId;
        token.email = user.email;
        token.managerModelName = user.managerModelName;
        token.name = user.name;
        token.roleStatus = user.roleStatus;
        token.username = user.username;
        token.displayName = `${user.name} ${user.surname}`;
        token.managerId = user.managerId;
        token.isAdmin = user.isAdmin || false;
        token.workerType = user.workerType || null;
        token.workerId = user.workerId || null;
        token.generalManagerRequest = user.generalManagerRequest || null;
        token.employed = user.employed ?? null;
      }

      if (account && account.provider === "google") {
        const email = token.email ?? profile?.email;
        const appUser = await users.getAppUser({ email });
        if (appUser) {
          token.appUserId = appUser._id.toString();
          token.displayName = appUser.username || appUser.name;
        }
        if (appUser && appUser.rootManager) {
          await appUser.populate("rootManager");
          token.managerModelName = appUser.rootManager
            ? appUser.rootManager.managerModelName
            : null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.appUserId = token.appUserId;
        session.user.email = token.email;
        session.user.managerModelName = token.managerModelName;
        session.user.displayName = token.displayName;
        session.user.name = token.displayName;
        session.user.roleStatus = token.roleStatus;
        session.user.username = token.username;
        session.user.managerId = token.managerId;
        session.user.isAdmin = token.isAdmin || false;
        session.user.workerType = token.workerType || null;
        session.user.workerId = token.workerId || null;
        session.user.generalManagerRequest =
          token.generalManagerRequest || null;
        session.user.employed = token.employed ?? null;
        session.user.name = token.displayName;
      }
      return session;
    },
  },
});

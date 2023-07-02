import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import repository from "#src/services/repository.mjs";
import registeredUserService from "#src/services/registeredUser.mjs";

export const authOptions = {
  pages: false,
  adapter: MongoDBAdapter(repository.getClientPromise()),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async session({ session }) {
      const { email, name, picture } = session.user;
      const registeredUser = await registeredUserService.upsertRegisteredUser({
        email,
        name,
        picture,
      });
      session.user.registeredUserId = registeredUser._id;
      session.user.invited = registeredUser.invited;
      session.user.accessRequested = registeredUser.accessRequested;

      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 30 * 24 * 60 * 60,
  },
};
export default NextAuth(authOptions);

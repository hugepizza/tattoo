import NextAuth, { AuthOptions, DefaultUser, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "../../prisma";

declare module "next-auth" {
  interface Session {
    user?: DefaultUser;
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
  events: {
    createUser: async (message: { user: User }) => {
      await prisma.userCredit.create({
        data: {
          userId: message.user.id,
        },
      });
    },
  },
  pages: { signIn: "/auth/signin", signOut: "/auth/signout", newUser: "/home" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

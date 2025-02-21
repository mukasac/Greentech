import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { compare } from "bcrypt";

// Define custom types to extend NextAuth types
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
    permissions: string[];
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: string;
      permissions: string[];
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    permissions: string[];
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth",
    signOut: '/auth',
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  }
                }
              }
            },
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        // Extract permissions
        const permissions = user.role.permissions.map((p) => p.permission.name);

        return {
          id: user.id,
          email: user.email,
          name: user.name || undefined, // Convert null to undefined
          role: user.role.name,
          permissions,
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.role as string,
        permissions: token.permissions as string[],
      };
      console.log('Session data:', session);

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log('User data in jwt callback:', user);

        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
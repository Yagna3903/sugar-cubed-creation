// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

const isDev = process.env.NODE_ENV !== "production";

// 30-minute session, no sliding refresh
const ADMIN_SESSION_SECONDS = 60 * 15;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  // Short-lived admin session
  session: {
    strategy: "jwt",
    maxAge: ADMIN_SESSION_SECONDS, // expire after 30 min
    updateAge: 0,                  // don't extend on activity
  },
  // (also set JWT maxAge for good measure)
  jwt: {
    maxAge: ADMIN_SESSION_SECONDS,
  },

  providers: [
    // Dev-only credentials provider
    Credentials({
      name: "Developer Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!isDev) return null; // safety: block in prod

        const email = creds?.email?.toLowerCase().trim();
        const password = creds?.password?.trim();

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
          const user = await prisma.user.upsert({
            where: { email },
            update: { role: "admin" },
            create: { email, role: "admin", name: "Admin" },
          });
          return { id: user.id, email: user.email, name: user.name, role: user.role };
        }
        return null;
      },
    }),

    // (Optional) Email magic-link via Resend
    ...(process.env.RESEND_API_KEY
      ? [
          EmailProvider({
            from: process.env.EMAIL_FROM!, // required
            async sendVerificationRequest({ identifier, url }) {
              const resend = new Resend(process.env.RESEND_API_KEY);
              await resend.emails.send({
                from: process.env.EMAIL_FROM!,
                to: identifier,
                subject: "Your login link",
                html: `<p>Click to sign in:</p><p><a href="${url}">${url}</a></p>`,
              });
            },
          }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id ?? token.id;
        token.role = (user as any).role ?? token.role;
      }
      if (!user && token?.email) {
        const u = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, role: true },
        });
        if (u) {
          token.id = u.id;
          token.role = u.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) (session.user as any).id = token.id;
      if (token?.role) (session.user as any).role = token.role;
      return session;
    },
    async signIn({ user }) {
      return !!user?.email;
    },
  },

  pages: { signIn: "/admin/login" },
};

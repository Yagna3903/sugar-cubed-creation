// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

const ADMIN_SESSION_SECONDS = 60 * 30;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
    maxAge: ADMIN_SESSION_SECONDS,
    updateAge: 0,
  },
  jwt: { maxAge: ADMIN_SESSION_SECONDS },

  providers: [
    Credentials({
      name: "Developer/Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        // ✅ Allow creds in dev, or when explicitly enabled in prod
        const allowCreds =
          process.env.NODE_ENV !== "production" ||
          process.env.ALLOW_CREDENTIALS_LOGIN === "true";
        if (!allowCreds) return null;

        const email = creds?.email?.toLowerCase().trim();
        const password = creds?.password?.trim();
        if (!email || !password) return null;

        // Check env-configured admin login
        if (
          email === (process.env.ADMIN_EMAIL || "").toLowerCase() &&
          password === process.env.ADMIN_PASSWORD
        ) {
          const user = await prisma.user.upsert({
            where: { email },
            update: { role: "admin", name: "Admin" },
            create: { email, role: "admin", name: "Admin" },
          });
          return { id: user.id, email: user.email, name: user.name ?? "Admin", role: user.role } as any;
        }
        return null; // Wrong creds
      },
    }),

    // OPTIONAL: keep Email magic-link if you use it
    ...(process.env.RESEND_API_KEY
      ? [
          EmailProvider({
            from: process.env.EMAIL_FROM!,
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
        (token as any).id = (user as any).id ?? (token as any).id;
        (token as any).role = (user as any).role ?? (token as any).role;
      }
      if (!user && token?.email) {
        const u = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, role: true },
        });
        if (u) {
          (token as any).id = u.id;
          (token as any).role = u.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if ((token as any)?.id) (session.user as any).id = (token as any).id;
      if ((token as any)?.role) (session.user as any).role = (token as any).role;
      return session;
    },
    async signIn({ user }) {
      return !!user?.email;
    },
  },

  pages: { signIn: "/admin/login" },
};

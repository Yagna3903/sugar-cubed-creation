import NextAuth from "next-auth";

declare module "next-auth" {
  interface User { role?: "admin" | "customer" }
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "admin" | "customer";
      id?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "customer";
    id?: string;
  }
}

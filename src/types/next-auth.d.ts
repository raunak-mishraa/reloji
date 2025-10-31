import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
   user: {
      id: string;
      name?: string | null;
      email?: string | null;
      phone?: string | null;
      role?: string | null;
      isPremium?: boolean | null;
    } & DefaultSession["user"];
  }

 interface User extends DefaultUser {
    id: string;
    phone?: string | null;
    role?: string | null;
    isPremium?: boolean | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    phone?: string | null;
    role?: string | null;
    isPremium?: boolean | null;
  }
}

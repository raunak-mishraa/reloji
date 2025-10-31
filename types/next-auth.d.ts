import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isPremium: boolean;
      phone: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    isPremium: boolean;
    phone: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    isPremium: boolean;
    phone: string | null;
  }
}


import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      coupleId?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    coupleId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    coupleId?: string
  }
}

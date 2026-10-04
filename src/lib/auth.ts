import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(credentials.email) as any;
        
        if (!user || user.password === 'OAUTH_USER') {
          throw new Error("No user found with this email");
        }

        if (user.isVerified === 0) {
          throw new Error("Please verify your email before logging in.");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const reqHeaders = await headers();
          let ip = reqHeaders.get("x-forwarded-for") || reqHeaders.get("x-real-ip");
          
          if (ip) {
            ip = ip.split(',')[0].trim();
            if (ip === "::1" || ip === "::ffff:127.0.0.1") ip = "127.0.0.1";
          }

          if (!ip && process.env.NODE_ENV === 'development') {
            ip = "127.0.0.1";
          } else if (!ip) {
            ip = "Unknown";
          }

          // Check if user already exists
          const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get(user.id);
          
          if (!existingUser) {
            // Check if this is the very first user in the database
            const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
            const isFirstUser = userCount.count === 0;

            if (!isFirstUser) {
              // Check public registration setting
              const stmt = db.prepare("SELECT value FROM settings WHERE key = 'public_registration'");
              const setting = stmt.get() as any;
              
              // Default is false if not set in DB
              const isPublicEnabled = setting ? setting.value === 'true' : false;

              if (!isPublicEnabled) {
                console.log("Login blocked: Public registration is disabled.");
                return false; // Blocks sign in
              }
            }
          }

          // Default everyone to 'user'
          const userRole = 'user';

          const stmt = db.prepare(`
            INSERT INTO users (id, name, email, password, image, role, lastIp) 
            VALUES (?, ?, ?, 'OAUTH_USER', ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET 
              name = excluded.name,
              email = excluded.email,
              image = excluded.image,
              lastIp = excluded.lastIp
          `);
          stmt.run(user.id, user.name, user.email, user.image, userRole, ip);
        } catch (error) {
          console.error("Error upserting Google user:", error);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.sub; // This is the Google unique user ID
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getAuthSession = () => getServerSession(authOptions);

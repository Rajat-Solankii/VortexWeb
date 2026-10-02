"use client";

import { LogIn, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

export default function SignInButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {user.user_metadata.avatar_url && (
          <img 
            src={user.user_metadata.avatar_url} 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-white/20"
          />
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:text-white transition-all text-sm font-bold"
          title="Sign Out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 bg-vortex-purple text-white rounded-lg text-sm font-bold hover:bg-vortex-purple/80 hover:shadow-[0_0_15px_rgba(124,77,255,0.4)] transition-all"
    >
      <LogIn className="h-4 w-4" />
      <span className="hidden sm:inline">Sign In</span>
    </button>
  );
}

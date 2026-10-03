"use client";

import { LogIn, LogOut, Mail, Lock, X, User as UserIcon, Eye, EyeOff, UserRound } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

export default function SignInButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          setIsModalOpen(false); // Close modal on successful login
          if (window.location.pathname === "/") {
            router.push("/home");
          }
        }
      }
    );

    const handleOpenModal = (e: any) => {
      if (e.detail?.message) {
        setAuthError(e.detail.message);
      } else {
        setAuthError("");
      }
      setIsModalOpen(true);
    };

    window.addEventListener('open-auth-modal', handleOpenModal);

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener('open-auth-modal', handleOpenModal);
    };
  }, []);

  const handleGoogleSignIn = async () => {
    const nextPath = pathname === "/" ? "/home" : pathname;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${nextPath}`,
      },
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    // Custom Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    if (isSignUp && !username.trim()) {
      setAuthError("Please enter a username.");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setAuthError("Passwords do not match!");
      return;
    }
    
    if (isSignUp) {
      setAuthError("Email Sign Up is Coming Soon! Please use Google for now.");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const nextPath = pathname === "/" ? "/home" : pathname;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: username
            },
            emailRedirectTo: `${location.origin}/auth/callback?next=${nextPath}`,
          },
        });
        if (error) throw error;
        setAuthError("Success! Check your email for the confirmation link to activate your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem("vortex_history");
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <Link 
            href="/profile" 
            className="text-gray-300 hover:text-white hover:bg-white/10 px-2 xl:px-3 py-1.5 rounded-lg text-[13px] xl:text-sm font-bold transition-all hidden sm:block"
          >
            My List
          </Link>
          <Link href="/profile" title="View Profile" className="transition-transform hover:scale-110">
            {user.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-white/20 hover:border-vortex-purple shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-vortex-purple flex items-center justify-center border border-white/20 hover:border-vortex-purple shadow-sm">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
            )}
          </Link>
        </div>
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

  const inputClasses = "w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-vortex-purple focus:border-transparent transition-all [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#121212_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]";

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 xl:px-4 xl:py-2 bg-vortex-purple text-white rounded-full text-sm font-bold hover:bg-vortex-purple/80 hover:shadow-[0_0_15px_rgba(124,77,255,0.4)] transition-all"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">Sign In</span>
      </button>

      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-vortex-black border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden"
              >
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-white mb-2">
                    {isSignUp ? "Create an Account" : "Welcome Back"}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {isSignUp ? "Sign up to save your favorite movies and shows." : "Sign in to access your Watchlist."}
                  </p>
                </div>

                {/* Google Button */}
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-bold py-3 px-4 rounded-xl transition-all mb-6"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.72 17.57V20.33H19.28C21.36 18.41 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                    <path d="M12 23C14.97 23 17.46 22.02 19.28 20.33L15.72 17.57C14.74 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.7 5.82 14.1H2.15V16.94C3.96 20.53 7.69 23 12 23Z" fill="#34A853"/>
                    <path d="M5.82 14.1C5.6 13.44 5.47 12.74 5.47 12C5.47 11.26 5.6 10.56 5.82 9.9V7.06H2.15C1.41 8.53 1 10.22 1 12C1 13.78 1.41 15.47 2.15 16.94L5.82 14.1Z" fill="#FBBC05"/>
                    <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.69 1 3.96 3.47 2.15 7.06L5.82 9.9C6.7 7.3 9.13 5.38 12 5.38Z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative bg-vortex-black px-4 text-xs font-medium text-gray-500 uppercase tracking-widest">
                    Or
                  </div>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4" noValidate>
                  
                  {/* Username Field - Only for Sign Up */}
                  <AnimatePresence>
                    {isSignUp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserRound className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Display Name"
                            className={inputClasses}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className={inputClasses}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isSignUp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            className={inputClasses}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {authError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-sm text-center ${authError.includes("Success") ? "text-green-400" : "text-red-400"}`}
                    >
                      {authError}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-vortex-purple hover:bg-vortex-purple/80 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center mt-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      isSignUp ? "Create Account" : "Sign In"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setAuthError("");
                    }}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

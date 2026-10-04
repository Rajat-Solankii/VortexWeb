"use client";

import { LogIn, LogOut, Mail, Lock, X, User as UserIcon, Eye, EyeOff, UserRound, Bookmark, ChevronDown, Settings, FolderPlus, Clock, Bell, Pencil, ArrowLeft, Play, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion"; // Force rebuild
import { usePathname, useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { fetchTMDB, cleanData } from "@/lib/tmdb";

export default function SignInButton() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotificationsView, setShowNotificationsView] = useState(false);
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
  const [dynamicNotifications, setDynamicNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [customName, setCustomName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameInput, setEditNameInput] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetchTMDB('/movie/now_playing', { language: 'en-US', page: '1' });
        if (res && res.results) {
          const latest = cleanData(res.results).slice(0, 3);
          const readIds = JSON.parse(localStorage.getItem('readNotificationIds') || '[]');
          const notifications = latest.map((movie: any, idx: number) => ({
            id: movie.id,
            title: "New Movie Release",
            message: `${movie.title} is now available to stream in 4K HDR.`,
            time: "Just now",
            type: "movie",
            read: readIds.includes(movie.id)
          }));
          setDynamicNotifications(notifications);
          setUnreadCount(notifications.filter((n: any) => !n.read).length);
        }
      } catch (e) {
        console.error("Failed to load notifications", e);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    setMounted(true);
    
    // Load custom name if it exists
    const savedName = localStorage.getItem("customUserName");
    if (savedName) {
      setCustomName(savedName);
    }

    if (window.location.hash === '#login') {
      setIsModalOpen(true);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    const handleOpenModal = (e: any) => {
      if (e.detail?.message) {
        setAuthError(e.detail.message);
      } else {
        setAuthError("");
      }
      setIsModalOpen(true);
    };

    window.addEventListener('open-auth-modal', handleOpenModal);
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#login') {
        setIsModalOpen(true);
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    });

    return () => {
      window.removeEventListener('open-auth-modal', handleOpenModal);
    };
  }, []);

  const handleGoogleSignIn = async () => {
    const nextPath = pathname === "/" ? "/home" : pathname;
    await signIn('google', { callbackUrl: nextPath });
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
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setAuthError(result.error);
      } else {
        setIsModalOpen(false);
        const nextPath = pathname === "/" ? "/home" : pathname;
        router.push(nextPath);
      }
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem("vortex_history");
    await signOut({ callbackUrl: "/" });
  };

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        {/* Watchlist/Bookmark Icon */}
        <Link href="/profile" className="text-gray-400 hover:text-white transition-colors" title="My List">
          <Bookmark className="w-[18px] h-[18px]" />
        </Link>
        
        {/* Dropdown container */}
        <div 
          className="relative group"
          onMouseLeave={() => setShowNotificationsView(false)}
        >
          <button className="flex items-center gap-1 focus:outline-none relative py-2">
            <div className="relative">
              {user.image ? (
                <img src={user.image} alt="Profile" className="w-8 h-8 rounded-full border border-white/10" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-vortex-purple flex items-center justify-center border border-white/10">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
              )}
              {/* Notification Dot */}
              {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#7047eb] rounded-full border-2 border-[#07090e]"></span>}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </button>
          
          {/* Dropdown Menu (Hidden by default, shown on hover) */}
          <div 
            className="absolute right-0 top-full mt-0 w-80 bg-[#141519] border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden transform origin-top-right scale-95 group-hover:scale-100 rounded-xl"
          >
            {/* Header */}
            {!showNotificationsView ? (
              <>
                <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
                   {user.image ? (
                    <img src={user.image} alt="Profile" className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-vortex-purple flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    {isEditingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editNameInput}
                          onChange={(e) => setEditNameInput(e.target.value)}
                          className="w-full bg-black/30 border border-[#7047eb]/50 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#7047eb]"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setCustomName(editNameInput);
                              localStorage.setItem("customUserName", editNameInput);
                              setIsEditingName(false);
                            } else if (e.key === 'Escape') {
                              setIsEditingName(false);
                            }
                          }}
                        />
                        <button 
                          onClick={() => {
                            setCustomName(editNameInput);
                            localStorage.setItem("customUserName", editNameInput);
                            setIsEditingName(false);
                          }}
                          className="text-[#7047eb] hover:text-white transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-white truncate">{customName || user.name}</p>
                    )}
                  </div>
                  {!isEditingName && (
                    <button 
                      onClick={() => {
                        setEditNameInput(customName || user.name || "");
                        setIsEditingName(true);
                      }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* Links */}
                <div className="py-2">
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                    <Bookmark className="w-[18px] h-[18px]" />
                    Watchlist
                  </Link>
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                    <FolderPlus className="w-[18px] h-[18px]" />
                    Collections
                  </Link>
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                    <Clock className="w-[18px] h-[18px]" />
                    History
                  </Link>
                  <div className="my-2 border-t border-white/10"></div>
                  <button 
                    onClick={() => setShowNotificationsView(true)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-[18px] h-[18px]" />
                      Notifications
                    </div>
                    {unreadCount > 0 && <span className="bg-[#7047eb] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                  </button>
                  <div className="my-2 border-t border-white/10"></div>
                  <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-left">
                    <LogOut className="w-[18px] h-[18px]" />
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col h-full max-h-[400px]">
                <div className="flex items-center gap-3 p-4 bg-white/5 border-b border-white/10">
                  <button 
                    onClick={() => setShowNotificationsView(false)}
                    className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-sm font-bold text-white">Notifications</h3>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                  {dynamicNotifications.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                      No new notifications
                    </div>
                  ) : dynamicNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      onClick={() => {
                        if (!notification.read) {
                          const readIds = JSON.parse(localStorage.getItem('readNotificationIds') || '[]');
                          if (!readIds.includes(notification.id)) {
                            localStorage.setItem('readNotificationIds', JSON.stringify([...readIds, notification.id]));
                          }
                          setDynamicNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
                          setUnreadCount(prev => Math.max(0, prev - 1));
                        }
                        if (notification.type === 'movie' || notification.type === 'episode') {
                          router.push(`/${notification.type === 'episode' ? 'tv' : 'movie'}/${notification.id}`);
                        }
                        setShowNotificationsView(false);
                      }}
                      className={`p-3 rounded-lg flex gap-3 hover:bg-white/5 transition-colors cursor-pointer ${!notification.read ? 'bg-white/[0.03]' : ''}`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {notification.type === 'episode' && <div className="w-8 h-8 rounded-full bg-[#7047eb]/20 flex items-center justify-center text-[#b794f6]"><Play className="w-4 h-4 ml-0.5" /></div>}
                        {notification.type === 'movie' && <div className="w-8 h-8 rounded-full bg-[#7047eb]/20 flex items-center justify-center text-[#7047eb]"><Play className="w-4 h-4 ml-0.5" /></div>}
                        {notification.type === 'system' && <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center text-gray-400"><Bell className="w-4 h-4" /></div>}
                      </div>
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-xs font-bold text-white leading-tight">{notification.title}</h4>
                          {!notification.read && <span className="w-1.5 h-1.5 rounded-full bg-[#7047eb] flex-shrink-0 mt-1"></span>}
                        </div>
                        <p className="text-xs text-gray-400 mb-1 leading-snug">{notification.message}</p>
                        <span className="text-[10px] text-gray-500 font-medium">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/10">
                  <button 
                    onClick={() => {
                      const allIds = dynamicNotifications.map(n => n.id);
                      const readIds = JSON.parse(localStorage.getItem('readNotificationIds') || '[]');
                      const newReadIds = Array.from(new Set([...readIds, ...allIds]));
                      localStorage.setItem('readNotificationIds', JSON.stringify(newReadIds));
                      setDynamicNotifications(prev => prev.map(n => ({...n, read: true})));
                      setUnreadCount(0);
                    }}
                    className="w-full py-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors text-center"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
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

"use client";

import { LogIn, LogOut, Mail, Lock, X, User as UserIcon, Eye, EyeOff, UserRound, Bookmark, ChevronDown, Settings, FolderPlus, Clock, Bell, Pencil, ArrowLeft, Play, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion"; // Force rebuild
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { fetchTMDB, cleanData } from "@/lib/tmdb";
import AuthModal from "./AuthModal";

export default function SignInButton() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user;
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const authParam = searchParams.get("auth");
  const isModalOpen = !!authParam;
  
  const [showNotificationsView, setShowNotificationsView] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Notification State
  const [dynamicNotifications, setDynamicNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [customName, setCustomName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameInput, setEditNameInput] = useState("");
  const [imageError, setImageError] = useState(false);

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
      router.replace(`${pathname}?auth=login`, { scroll: false });
    }

    const handleOpenModal = (e: any) => {
      router.push(`${pathname}?auth=login`, { scroll: false });
    };

    window.addEventListener('open-auth-modal', handleOpenModal);
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#login') {
        router.replace(`${pathname}?auth=login`, { scroll: false });
      }
    });

    return () => {
      window.removeEventListener('open-auth-modal', handleOpenModal);
    };
  }, []);

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
              {user.image && !imageError ? (
                <img 
                  src={user.image} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-white/10" 
                  onError={() => setImageError(true)}
                />
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
                   {user.image && !imageError ? (
                    <img 
                      src={user.image} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full" 
                      onError={() => setImageError(true)}
                    />
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
        onClick={() => router.push(`${pathname}?auth=login`, { scroll: false })}
        className="flex items-center gap-1.5 px-3 py-2 xl:px-4 xl:py-2 bg-vortex-purple text-white rounded-full text-sm font-bold hover:bg-vortex-purple/80 hover:shadow-[0_0_15px_rgba(124,77,255,0.4)] transition-all"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">Sign In</span>
      </button>

      {mounted && typeof document !== "undefined" && createPortal(
        <AuthModal isOpen={isModalOpen} onClose={() => router.push(pathname, { scroll: false })} />,
        document.body
      )}
    </>
  );
}

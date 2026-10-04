"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Bookmark, Play, Settings, Clock, Trash2, FolderPlus, BarChart3, Languages, Tv, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function ProfileDashboardClient({ user, bookmarks: initialBookmarks, history: initialHistory, initialCollections = [] }: { user: any, bookmarks: any[], history: any[], initialCollections?: any[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const tabQuery = searchParams.get("tab") || "watchlist";
  const [activeTab, setActiveTab] = useState(tabQuery);

  // Sync state when URL changes (e.g. browser back button)
  useEffect(() => {
    if (tabQuery !== activeTab) {
      setActiveTab(tabQuery);
    }
  }, [tabQuery]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.push(`${pathname}?${params.toString()}`);
  };
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [history, setHistory] = useState(initialHistory);
  const [collections, setCollections] = useState(initialCollections);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Settings / Change Email State
  const [changeEmailStep, setChangeEmailStep] = useState<"initial" | "verify">("initial");
  const [newEmail, setNewEmail] = useState("");
  const [changeEmailOtp, setChangeEmailOtp] = useState("");
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [changeEmailError, setChangeEmailError] = useState("");
  const [changeEmailSuccess, setChangeEmailSuccess] = useState("");

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    
    setIsCreating(true);
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCollectionName }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setCollections([data.collection, ...collections]);
        setIsModalOpen(false);
        setNewCollectionName("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRemoveBookmark = async (e: React.MouseEvent, mediaId: number, mediaType: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistically update
    const prevBookmarks = [...bookmarks];
    setBookmarks(bookmarks.filter(b => !(b.mediaId === mediaId && b.mediaType === mediaType)));

    try {
      const res = await fetch(`/api/bookmarks?mediaId=${mediaId}&mediaType=${mediaType}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    } catch (err) {
      console.error(err);
      setBookmarks(prevBookmarks); // Revert on failure
    }
  };

  const handleClearHistory = async () => {
    setHistory([]);
    localStorage.removeItem("vortex_history");
    setShowClearHistoryModal(false);
    try {
      await fetch("/api/history", { method: "POST", body: JSON.stringify({ history: [] }) });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveHistoryItem = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    const newHistory = history.filter((h: any) => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem("vortex_history", JSON.stringify(newHistory));
    try {
      await fetch("/api/history", { method: "POST", body: JSON.stringify({ history: newHistory }) });
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: "watchlist", label: "My Watchlist", icon: Bookmark },
    { id: "history", label: "Watch History", icon: Clock },
    { id: "playlists", label: "Collections", icon: FolderPlus },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeEmailError("");
    setChangeEmailSuccess("");
    setIsChangingEmail(true);

    try {
      const res = await fetch("/api/profile/change-email/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setChangeEmailStep("verify");
      setChangeEmailSuccess(data.message);
    } catch (err: any) {
      setChangeEmailError(err.message);
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleVerifyEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeEmailError("");
    setChangeEmailSuccess("");
    setIsChangingEmail(true);

    try {
      const res = await fetch("/api/profile/change-email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail, otp: changeEmailOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setChangeEmailStep("initial");
      setNewEmail("");
      setChangeEmailOtp("");
      setChangeEmailSuccess("Email updated successfully! Please sign in again.");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setChangeEmailError(err.message);
    } finally {
      setIsChangingEmail(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#07090e] pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Bookmark className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
          </div>
          
          {/* Horizontal Tabs (Crunchyroll Style) */}
          <div className="flex items-center justify-center border-b border-white/10 w-full mb-8">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative pb-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                      isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-[#7047eb]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeTab === "watchlist" && (
              <motion.section 
                key="watchlist"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="min-h-[400px]"
              >
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <h2 className="text-xl font-bold text-white">Watchlist</h2>
                  <div className="flex gap-4 relative">
                    <div className="relative">
                      <button 
                        onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors uppercase"
                      >
                        <Clock className="w-4 h-4" /> 
                        {sortOrder === 'recent' ? 'Recent Activity' : sortOrder === 'oldest' ? 'Oldest First' : 'A-Z Alphabetical'}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {isSortOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-[#141519] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                          >
                            <button onClick={() => { setSortOrder('recent'); setIsSortOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">Recent Activity</button>
                            <button onClick={() => { setSortOrder('oldest'); setIsSortOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">Oldest First</button>
                            <button onClick={() => { setSortOrder('alpha'); setIsSortOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">A-Z Alphabetical</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="relative">
                      <button 
                        onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors uppercase"
                      >
                        <Settings className="w-4 h-4" /> 
                        Filter: {filterType === 'all' ? 'All' : filterType === 'movie' ? 'Movies' : 'TV Shows'}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {isFilterOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 top-full mt-2 w-40 bg-[#141519] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                          >
                            <button onClick={() => { setFilterType('all'); setIsFilterOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">All</button>
                            <button onClick={() => { setFilterType('movie'); setIsFilterOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">Movies</button>
                            <button onClick={() => { setFilterType('tv'); setIsFilterOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">TV Shows</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                
                {bookmarks.length === 0 ? (
                  <div className="text-center py-12 px-4 bg-white/[0.02] rounded-xl border border-white/5 border-dashed">
                    <Bookmark className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Your watchlist is empty</h3>
                    <p className="text-[#94a3b8] mb-6">Save movies and shows you want to watch later.</p>
                    <Link href="/home" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7047eb] hover:bg-[#5d35d9] text-white font-bold transition-colors rounded-xl">
                      Explore Content
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {bookmarks
                      .filter(b => filterType === 'all' || b.mediaType === filterType)
                      .sort((a, b) => {
                        if (sortOrder === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        if (sortOrder === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                        if (sortOrder === 'alpha') return a.title.localeCompare(b.title);
                        return 0;
                      })
                      .map((bookmark: any) => (
                      <Link 
                        key={bookmark.id}
                        href={`/${bookmark.mediaType === 'movie' ? 'movie' : 'tv'}/${bookmark.mediaId}`}
                        className="group relative bg-[#141519] overflow-hidden rounded-xl border border-white/5"
                      >
                        <div className="relative aspect-[2/3] w-full overflow-hidden">
                          {bookmark.posterPath ? (
                            <Image 
                              src={`https://image.tmdb.org/t/p/w500${bookmark.posterPath}`}
                              alt={bookmark.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-4 text-center bg-gray-900">
                              <span className="text-sm font-medium text-white">{bookmark.title}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Play className="w-12 h-12 text-white fill-white" />
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-bold text-sm text-white line-clamp-1">{bookmark.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">Start Watching</p>
                          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                            <span>{bookmark.mediaType === 'movie' ? 'Movie' : 'Series'}</span>
                            <div className="flex gap-2 relative z-10">
                              <button 
                                onClick={(e) => handleRemoveBookmark(e, bookmark.mediaId, bookmark.mediaType)} 
                                className="hover:text-white" 
                                title="Remove from Watchlist"
                              >
                                <Bookmark className="w-4 h-4 fill-[#7047eb] text-[#7047eb]" />
                              </button>
                              <button 
                                onClick={(e) => handleRemoveBookmark(e, bookmark.mediaId, bookmark.mediaType)} 
                                className="hover:text-red-500" 
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.section>
            )}

              {activeTab === "history" && (
                <motion.section 
                  key="history"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 min-h-[400px]"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-[#b794f6]" />
                      <h2 className="text-2xl font-bold text-white">Watch History</h2>
                    </div>
                    {history.length > 0 && (
                      <button 
                        onClick={() => setShowClearHistoryModal(true)}
                        className="text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Clear All
                      </button>
                    )}
                  </div>
                  
                  {history.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-white/[0.02] rounded-xl border border-white/5 border-dashed">
                      <Clock className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No watch history yet</h3>
                      <p className="text-[#94a3b8] mb-6">Movies and shows you start watching will appear here.</p>
                      <Link href="/home" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7047eb] hover:bg-[#5d35d9] text-white rounded-xl font-medium transition-colors">
                        Explore Content
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {history.slice(0, 8).map((item: any, idx: number) => {
                        const progress = item.progress || Math.floor(Math.random() * 80) + 10; // Mock progress if not saved
                        return (
                          <Link 
                            key={idx}
                            href={`/${item.type}/${item.id}`}
                            className="group flex gap-4 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                          >
                            <div className="relative w-24 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0">
                              {item.poster_path ? (
                                <Image src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center"><Play className="w-8 h-8 text-white/20" /></div>
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                <Play className="w-8 h-8 text-white fill-white" />
                              </div>
                            </div>
                            <div className="flex flex-col justify-between flex-grow py-2 pr-2">
                              <div>
                                <h3 className="font-bold text-white text-base line-clamp-1 mb-1">{item.title || item.name}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-[10px] text-[#b794f6] uppercase font-bold bg-[#7047eb]/20 px-2 py-0.5 rounded-sm tracking-wider">{item.type}</span>
                                  <span className="text-[10px] text-gray-400">Watched {item.timestamp ? new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}</span>
                                </div>
                                {item.overview && (
                                  <p className="text-xs text-gray-400 line-clamp-2 mb-2 leading-relaxed">
                                    {item.overview}
                                  </p>
                                )}
                              </div>
                              <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                                <div className="text-sm font-medium text-white group-hover:text-[#b794f6] transition-colors flex items-center gap-2">
                                  <Play className="w-4 h-4 fill-current" /> Watch Again
                                </div>
                                <button 
                                  onClick={(e) => handleRemoveHistoryItem(e, item.id)}
                                  className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-white/5 rounded-md transition-colors relative z-10"
                                  title="Remove from history"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </motion.section>
              )}

              {activeTab === "playlists" && (
                <motion.section 
                  key="playlists"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 min-h-[400px]"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <FolderPlus className="w-6 h-6 text-[#b794f6]" />
                      <h2 className="text-2xl font-bold text-white">My Collections</h2>
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                      + New Collection
                    </button>
                  </div>
                  
                  {collections.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-white/[0.02] rounded-xl border border-white/5 border-dashed">
                      <FolderPlus className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No collections yet</h3>
                      <p className="text-[#94a3b8] mb-6">Create custom folders to organize your favorite movies and shows.</p>
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7047eb] hover:bg-[#5d35d9] text-white rounded-xl font-medium transition-colors"
                      >
                        Create First Collection
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {collections.map(col => (
                        <Link href={`/profile/collections/${col.id}`} key={col.id} className="group cursor-pointer p-5 bg-gradient-to-br from-[#7047eb]/10 to-[#b794f6]/10 border border-[#7047eb]/30 rounded-xl hover:scale-[1.02] transition-transform block">
                          <h3 className="text-xl font-bold text-white mb-2">{col.name}</h3>
                          <p className="text-gray-400 text-sm mb-4">{col.itemsCount} Items</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.section>
              )}

              {activeTab === "settings" && (
                <motion.section 
                  key="settings"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 min-h-[400px]"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <Settings className="w-6 h-6 text-[#b794f6]" />
                    <h2 className="text-2xl font-bold text-white">Account Settings</h2>
                  </div>
                  
                  <div className="max-w-md bg-[#141519] border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Change Email Address</h3>
                    <p className="text-sm text-gray-400 mb-6">Current Email: <span className="text-white font-medium">{user.email}</span></p>
                    
                    {changeEmailError && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-4">{changeEmailError}</div>}
                    {changeEmailSuccess && <div className="bg-green-500/10 text-green-400 p-3 rounded-lg text-sm mb-4">{changeEmailSuccess}</div>}

                    {changeEmailStep === "initial" ? (
                      <form onSubmit={handleRequestEmailChange} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1.5">New Email Address</label>
                          <input 
                            type="email" 
                            required
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7047eb] transition-all"
                            placeholder="new.email@example.com"
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={isChangingEmail || !newEmail.trim()}
                          className="w-full bg-[#7047eb] hover:bg-[#5d35d9] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all"
                        >
                          {isChangingEmail ? "Sending Code..." : "Send Verification Code"}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyEmailChange} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1.5">Enter 6-Digit Code</label>
                          <p className="text-xs text-gray-500 mb-3">We sent a code to <span className="text-white">{newEmail}</span></p>
                          <input 
                            type="text" 
                            required
                            maxLength={6}
                            value={changeEmailOtp}
                            onChange={(e) => setChangeEmailOtp(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white tracking-[0.5em] text-center text-xl font-mono focus:outline-none focus:border-[#7047eb] transition-all"
                            placeholder="000000"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button 
                            type="button" 
                            onClick={() => { setChangeEmailStep("initial"); setChangeEmailError(""); setChangeEmailSuccess(""); }}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            disabled={isChangingEmail || changeEmailOtp.length !== 6}
                            className="flex-1 bg-[#7047eb] hover:bg-[#5d35d9] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all"
                          >
                            {isChangingEmail ? "Verifying..." : "Verify & Save"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </motion.section>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* Create Collection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0f1117] rounded-2xl border border-white/10 shadow-2xl p-6"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#7047eb]/20 flex items-center justify-center text-[#b794f6] mb-3">
                  <FolderPlus className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Create Collection</h3>
                <p className="text-sm text-gray-400 text-center mt-1">Organize your favorite content into custom folders.</p>
              </div>

              <form onSubmit={handleCreateCollection} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Collection Name</label>
                  <input 
                    type="text" 
                    required
                    maxLength={30}
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="e.g. Action Weekend"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7047eb]/50 focus:border-[#7047eb] transition-all"
                    autoFocus
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isCreating || !newCollectionName.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#7047eb] hover:bg-[#5d35d9] disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold rounded-xl transition-colors"
                >
                  {isCreating ? "Creating..." : "Create Collection"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Clear History Confirmation Modal */}
      <AnimatePresence>
        {showClearHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowClearHistoryModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-[#141519] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-2">Clear Watch History?</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to clear your entire watch history? This action cannot be undone and will remove all {history.length} items from your activity.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowClearHistoryModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium text-sm flex items-center gap-2"
                >
                  Yes, Clear History
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

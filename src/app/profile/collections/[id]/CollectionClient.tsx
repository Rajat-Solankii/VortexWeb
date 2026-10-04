"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Play, Bookmark, Trash2, Edit2, Check, X } from "lucide-react";
import Image from "next/image";

export default function CollectionClient({ initialCollection, initialItems }: { initialCollection: any, initialItems: any[] }) {
  const router = useRouter();
  const [collection, setCollection] = useState(initialCollection);
  const [items, setItems] = useState(initialItems);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(initialCollection.name);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleRemoveItem = async (e: React.MouseEvent, mediaId: string, mediaType: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const prevItems = [...items];
    setItems(items.filter(item => !(item.mediaId === mediaId && item.mediaType === mediaType)));
    
    try {
      const res = await fetch(`/api/collections/items?collectionId=${collection.id}&mediaId=${mediaId}&mediaType=${mediaType}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove item");
    } catch (err) {
      console.error(err);
      setItems(prevItems);
    }
  };

  const handleRename = async () => {
    if (!editName.trim() || editName.trim() === collection.name) {
      setIsEditing(false);
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await fetch(`/api/collections/${collection.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      if (res.ok) {
        setCollection({ ...collection, name: editName.trim() });
        setIsEditing(false);
        router.refresh(); // Tell Next.js to revalidate layout
      }
    } catch (err) {
      console.error(err);
    }
    setIsSaving(false);
  };

  const handleDeleteCollection = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/collections/${collection.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/profile");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/profile" className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-[#141519] text-white text-3xl font-bold rounded-lg px-3 py-1 outline-none border border-white/10 focus:border-[#7047eb] transition-colors w-full sm:w-auto"
                  autoFocus
                  disabled={isSaving}
                />
                <button 
                  onClick={handleRename}
                  disabled={isSaving}
                  className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => { setIsEditing(false); setEditName(collection.name); }}
                  disabled={isSaving}
                  className="p-2 bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">{collection.name}</h1>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="p-1.5 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                    title="Edit Name"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-400">{items.length} Items</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" /> 
            {isDeleting ? "Deleting..." : "Delete Collection"}
          </button>
        </div>

        {items.length === 0 ? (
          <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
            <Bookmark className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">This collection is empty</h3>
            <p className="text-gray-400 mb-6">Start browsing and add some movies or shows to this collection!</p>
            <Link href="/home" className="inline-block px-6 py-3 bg-[#7047eb] hover:bg-[#5d35d9] text-white rounded-xl font-bold transition-colors">
              Explore Content
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {items.map((item) => (
              <Link 
                key={item.id} 
                href={`/${item.mediaType === 'episode' ? 'tv' : item.mediaType}/${item.mediaId}`}
                className="group relative block rounded-xl overflow-hidden aspect-[2/3] bg-[#141519] border border-white/5 hover:border-[#7047eb]/50 transition-colors"
              >
                {item.posterPath ? (
                  <Image src={`https://image.tmdb.org/t/p/w500${item.posterPath}`} alt={item.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gray-900">
                    <Play className="w-10 h-10 text-white/20 mb-2" />
                    <span className="text-sm text-gray-400 line-clamp-2">{item.title}</span>
                  </div>
                )}
                
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleRemoveItem(e, item.mediaId, item.mediaType)}
                    className="p-2 bg-black/60 hover:bg-red-500/80 backdrop-blur-sm rounded-full text-white transition-colors"
                    title="Remove from Collection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="w-full">
                    <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">{item.title}</h3>
                    <span className="text-[10px] text-[#b794f6] font-bold uppercase tracking-wider">{item.mediaType}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#141519] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Delete Collection?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete <span className="text-white font-medium">"{collection.name}"</span>? This action cannot be undone and will remove all {items.length} items from it.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCollection}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium text-sm flex items-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete It"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

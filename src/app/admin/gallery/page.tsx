"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  Trash2,
  Edit2,
  Star,
  CheckCircle2,
  AlertCircle,
  Plus,
  Loader2,
  X,
  Eye,
  Sparkles,
} from "lucide-react";
import { GalleryImage } from "@/lib/types";

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"manage" | "upload">("upload");

  // Multi-file upload states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadCategory, setUploadCategory] = useState("Worship & Services");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadPhotographer, setUploadPhotographer] = useState("Church Media Unit");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  // Edit Modal states
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Worship & Services",
    "Conferences & Revivals",
    "Community Outreach",
    "Youth & Young Adults",
    "Choir & Music Ministry",
    "Children & Sunday School",
    "Milestones & Dedications",
  ];

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
      }
    } catch (err) {
      console.error("Failed to load gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);

      // Generate previews
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(filesArray);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Fast client-side image compression: shrinks heavy 8-15MB phone camera photos to ~250KB in milliseconds
  const compressImageForWeb = async (file: File): Promise<File> => {
    if (!file.type.startsWith("image/") || file.size < 400 * 1024) {
      return file;
    }

    return new Promise((resolve) => {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Scale to maximum 1920px (full HD is optimal for web)
        const maxDim = 1920;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const cleanBase = file.name.replace(/\.[^/.]+$/, "");
            const compressed = new File([blob], `${cleanBase}.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressed);
          },
          "image/jpeg",
          0.82
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    });
  };

  // Submit batch upload with compression and progressive per-photo uploading
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setUploadError("Please select at least one photograph to upload.");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setUploadMessage("");

    try {
      let successCount = 0;

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadProgress(
          `Optimizing & uploading ${i + 1} of ${selectedFiles.length} (${file.name})...`
        );

        // 1. Shrink heavy mobile camera photo
        const optimizedFile = await compressImageForWeb(file);

        // 2. Upload individually so it never exceeds Vercel's 4.5MB request limit
        const formData = new FormData();
        formData.append("file", optimizedFile);
        formData.append("category", uploadCategory);
        formData.append(
          "title",
          uploadTitle || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
        );
        formData.append("caption", uploadCaption);
        formData.append("photographer", uploadPhotographer);

        const res = await fetch("/api/admin/gallery/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Upload failed for ${file.name}`);
        }

        successCount++;
      }

      setUploadMessage(
        `Success! ${successCount} photo(s) have been optimized, uploaded, and are now live on the church website.`
      );
      clearSelectedFiles();
      setUploadTitle("");
      setUploadCaption("");
      fetchImages();
      setActiveTab("manage");
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(
        err.message ||
          "Network error occurred during upload. Please check your internet connection."
      );
    } finally {
      setIsUploading(false);
      setUploadProgress("");
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (img: GalleryImage) => {
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: img.id, isFeatured: !img.isFeatured }),
      });
      if (res.ok) {
        setImages((prev) =>
          prev.map((item) =>
            item.id === img.id ? { ...item, isFeatured: !img.isFeatured } : item
          )
        );
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  // Delete image
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo from the church gallery?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/gallery?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setImages((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Failed to delete image.");
      }
    } catch {
      alert("Error deleting image.");
    }
  };

  // Save edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingImage),
      });
      if (res.ok) {
        const data = await res.json();
        setImages((prev) =>
          prev.map((item) => (item.id === editingImage.id ? data.image : item))
        );
        setEditingImage(null);
      }
    } catch {
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-burgundy-700 uppercase tracking-widest font-sans">
            Media Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-obsidian-950">
            Church Photo Gallery CMS
          </h1>
          <p className="text-xs text-obsidian-600 mt-0.5">
            Photos uploaded here immediately reflect on the public gallery and homepage preview.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center space-x-2 bg-ivory-200 p-1 rounded-xl border border-ivory-300">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === "upload"
                ? "bg-burgundy-700 text-white shadow-sm"
                : "text-obsidian-700 hover:text-obsidian-950"
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-gold-300" />
            <span>Upload Photos</span>
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === "manage"
                ? "bg-burgundy-700 text-white shadow-sm"
                : "text-obsidian-700 hover:text-obsidian-950"
            }`}
          >
            <span>Manage Gallery ({images.length})</span>
          </button>
        </div>
      </div>

      {uploadMessage && (
        <div className="p-4 rounded-2xl bg-sanctuary-50 border border-sanctuary-400 text-sanctuary-900 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-sanctuary-700 flex-shrink-0" />
          <span>{uploadMessage}</span>
          <Link
            href="/gallery"
            target="_blank"
            className="ml-auto underline font-bold"
          >
            View in Public Gallery &rarr;
          </Link>
        </div>
      )}

      {/* UPLOAD TAB */}
      {activeTab === "upload" && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-ivory-300 shadow-subtle space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-lg font-serif font-bold text-obsidian-950">
              Drag & Drop Image Upload
            </h2>
            <p className="text-xs text-obsidian-600 mt-0.5">
              Upload high-resolution photography from Sunday services, conventions, choir events, and outreach.
            </p>
          </div>

          {uploadError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{uploadError}</span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-6">
            {/* Drag and drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gold-400 hover:border-burgundy-700 bg-ivory-50/80 hover:bg-gold-50/40 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-full bg-burgundy-50 border border-burgundy-200 text-burgundy-700 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6 text-burgundy-700" />
              </div>

              <div>
                <p className="font-serif font-bold text-base text-obsidian-950">
                  Click to select or drag and drop photographs here
                </p>
                <p className="text-xs text-obsidian-500 mt-1">
                  Supports JPEG, PNG, WEBP (Single or multi-file upload up to 20 images at once)
                </p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs shadow-xs">
                    {selectedFiles.length} file(s) selected
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Previews */}
            {previews.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-obsidian-700">
                  <span>Selected Photos ({previews.length}):</span>
                  <button
                    type="button"
                    onClick={clearSelectedFiles}
                    className="text-red-600 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {previews.map((src, i) => (
                    <div
                      key={i}
                      className="relative h-24 rounded-xl overflow-hidden border border-ivory-300 shadow-xs"
                    >
                      <Image
                        src={src}
                        alt={`Preview ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-obsidian-800 mb-1">
                  Category *
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-obsidian-800 mb-1">
                  Photographer / Unit
                </label>
                <input
                  type="text"
                  value={uploadPhotographer}
                  onChange={(e) => setUploadPhotographer(e.target.value)}
                  placeholder="e.g. FBC Media Unit"
                  className="w-full p-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-obsidian-800 mb-1">
                  Default Title (Optional)
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Sunday Morning Worship"
                  className="w-full p-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-obsidian-800 mb-1">
                  Caption / Description (Optional)
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="e.g. Congregational prayers and praise..."
                  className="w-full p-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                disabled={isUploading || selectedFiles.length === 0}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-800 hover:to-burgundy-900 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-gold-300" />
                    <span>{uploadProgress || "Uploading to Sanctuary Gallery..."}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-gold-300" />
                    <span>Upload {selectedFiles.length} Photograph(s)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={clearSelectedFiles}
                className="px-4 py-3 rounded-xl bg-ivory-200 hover:bg-ivory-300 text-obsidian-800 font-semibold text-xs"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MANAGE TAB */}
      {activeTab === "manage" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-subtle space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-obsidian-950">
                All Gallery Photographs ({images.length})
              </h2>
              <p className="text-xs text-obsidian-600">
                Manage titles, categories, feature on homepage, or delete.
              </p>
            </div>

            <button
              onClick={() => setActiveTab("upload")}
              className="inline-flex items-center px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold text-xs shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Upload More</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-obsidian-500 text-xs">
              Loading church photos...
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16 bg-ivory-100 rounded-2xl border border-ivory-300">
              <p className="font-serif font-bold text-obsidian-900">
                No photographs in the gallery yet.
              </p>
              <p className="text-xs text-obsidian-500 mt-1">
                Upload your first photo to see it on the website!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="rounded-2xl overflow-hidden border border-ivory-300 bg-ivory-50 flex flex-col justify-between shadow-xs group"
                >
                  <div>
                    <div className="relative h-44 w-full bg-black">
                      <Image
                        src={img.imageUrl}
                        alt={img.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-full bg-black/70 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                          {img.category}
                        </span>
                      </div>

                      {img.isFeatured && (
                        <div className="absolute top-2 right-2 p-1 rounded-full bg-gold-500 text-obsidian-950 shadow">
                          <Star className="w-3.5 h-3.5 fill-obsidian-950" />
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-1">
                      <h4 className="font-serif font-bold text-sm text-obsidian-950 truncate">
                        {img.title}
                      </h4>
                      <p className="text-xs text-obsidian-600 line-clamp-2 leading-relaxed">
                        {img.caption}
                      </p>
                      <p className="text-[10px] text-obsidian-400 pt-1">
                        {new Date(img.date || img.createdAt).toLocaleDateString()} &bull; {img.photographer || "Media Unit"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 border-t border-ivory-200 bg-white flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleFeatured(img)}
                      className={`inline-flex items-center text-[11px] font-semibold ${
                        img.isFeatured
                          ? "text-gold-700"
                          : "text-obsidian-500 hover:text-gold-600"
                      }`}
                      title="Toggle homepage featured"
                    >
                      <Star
                        className={`w-3.5 h-3.5 mr-1 ${
                          img.isFeatured ? "fill-gold-500 text-gold-500" : ""
                        }`}
                      />
                      <span>{img.isFeatured ? "Featured" : "Feature"}</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setEditingImage(img)}
                        className="p-1.5 rounded-lg text-obsidian-600 hover:bg-ivory-200 hover:text-burgundy-700"
                        title="Edit details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(img.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setEditingImage(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 sm:p-8 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-ivory-300 pb-3">
              <h3 className="font-serif font-bold text-lg text-obsidian-950">
                Edit Photograph Details
              </h3>
              <button
                onClick={() => setEditingImage(null)}
                className="p-1.5 rounded-lg text-obsidian-400 hover:text-obsidian-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-obsidian-800 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingImage.title}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, title: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-ivory-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-obsidian-800 mb-1">
                  Caption
                </label>
                <textarea
                  rows={3}
                  value={editingImage.caption}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, caption: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-ivory-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Category
                  </label>
                  <select
                    value={editingImage.category}
                    onChange={(e) =>
                      setEditingImage({
                        ...editingImage,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Photographer
                  </label>
                  <input
                    type="text"
                    value={editingImage.photographer || ""}
                    onChange={(e) =>
                      setEditingImage({
                        ...editingImage,
                        photographer: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-edit"
                  checked={editingImage.isFeatured}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      isFeatured: e.target.checked,
                    })
                  }
                  className="rounded border-ivory-300 text-burgundy-700"
                />
                <label htmlFor="featured-edit" className="text-obsidian-800 font-semibold cursor-pointer">
                  Feature this photograph on the Homepage Preview
                </label>
              </div>

              <div className="pt-3 border-t border-ivory-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-2 rounded-xl bg-ivory-200 text-obsidian-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-burgundy-700 text-white font-bold text-xs hover:bg-burgundy-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

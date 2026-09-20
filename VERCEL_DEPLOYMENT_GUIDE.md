# First Baptist Church Jobele — GitHub & Vercel Deployment Guide

This guide provides step-by-step instructions to push the **First Baptist Church Jobele ("Sanctuary of Divine Power")** web application to **GitHub** and deploy it to **Vercel** with global CDN caching, SSL certificates, and persistent Cloud Media Storage.

---

## 1. Quick Summary of Architecture

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
- **CMS Administration**: `/admin` (Protected with JWT session cookies and bcrypt hashing)
- **Staff Self-Registration**: `/admin/register` (Protected with Church Staff Security Passcode)
- **Cloud Media Storage**: Integrated Cloudinary adapter (`src/lib/storage.ts`) with seamless fallback to local disk
- **Public Experience**: 100% responsive across mobile (320px–414px), tablet (768px–1024px), and desktop (1280px+)

---

## 2. Pushing to GitHub

### Step 2.1: Initialize Git and Stage Files
Open your terminal in the project directory (`C:\Users\Acer\.gemini\antigravity\scratch\fbc-jobele`) and run:

```bash
# Initialize local git repository
git init

# Add all project source files (excluding node_modules and .next via .gitignore)
git add .

# Make the initial production commit
git commit -m "feat: complete production church web app and CMS for FBC Jobele"
```

### Step 2.2: Create a Repository on GitHub
1. Go to [https://github.com/new](https://github.com/new) and log in.
2. Enter repository name: `fbc-jobele` (or `first-baptist-church-jobele`).
3. Choose **Public** (or **Private**).
4. Do **not** initialize with README or .gitignore (we already have them).
5. Click **Create repository**.

### Step 2.3: Link and Push to GitHub
Copy the repository URL from GitHub and run:

```bash
# Set main branch
git branch -M main

# Add your GitHub remote (replace with your actual GitHub username)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/fbc-jobele.git

# Push the codebase to GitHub
git push -u origin main
```

---

## 3. Deploying to Vercel (1-Click Deployment)

### Step 3.1: Import into Vercel
1. Log in to [https://vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Select your GitHub account and find `fbc-jobele`.
4. Click **Import**.

### Step 3.2: Configure Environment Variables
In the **Environment Variables** section on Vercel, add the following key-value pairs:

| Variable Name | Value | Purpose |
|---------------|-------|---------|
| `JWT_SECRET` | `fbc-jobele-divine-power-secret-key-2026-unshakable` | Secret key for admin session cookies |
| `CHURCH_STAFF_PASSCODE` | `FBC-JOBELE-COVENANT-2026` | Security key required for `/admin/register` |
| `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` | Cloudinary Cloud Name (for live photo uploads) |
| `CLOUDINARY_API_KEY` | `your_api_key` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | `your_api_secret` | Cloudinary API Secret |
| `NEXT_PUBLIC_SITE_URL` | `https://fbc-jobele.vercel.app` (or custom domain) | Canonical site domain |

> [!TIP]
> **Free Cloudinary Account Setup (2 Minutes)**:
> 1. Sign up for free at [https://cloudinary.com](https://cloudinary.com).
> 2. On your Dashboard, copy **Cloud Name**, **API Key**, and **API Secret**.
> 3. Paste them into Vercel's Environment Variables.
> With Cloudinary connected, every photo uploaded through `/admin/gallery` or sermon cover will instantly persist on Cloudinary's worldwide CDN with zero storage limits on Vercel's serverless functions!

### Step 3.3: Deploy
1. Click **Deploy**.
2. Vercel will automatically build the Next.js project and provision your live website with automatic SSL (`https://...`).

---

## 4. Admin Access & Staff Onboarding

### Default Pre-Configured Accounts:
- **Super Administrator**:
  - Email: `admin@fbcjobele.org`
  - Password: `JobeleFaith2026!`
- **Content & Media Admin**:
  - Email: `media@fbcjobele.org`
  - Password: `MediaTeam2026!`
- **Pastoral Care & Prayer Desk**:
  - Email: `pastor@fbcjobele.org`
  - Password: `PrayerDesk2026!`

### Self-Registration for New Church Staff:
Church staff, pastors, or media workers can create their own accounts at:
`https://your-domain.com/admin/register`
by supplying the official **Church Staff Passcode**: `FBC-JOBELE-COVENANT-2026`.

---

## 5. Ongoing Updates & Zero-Downtime Releases

Whenever you or your team make changes:
```bash
git add .
git commit -m "Update church announcement / content"
git push
```
Vercel will automatically build and deploy the update with zero downtime!

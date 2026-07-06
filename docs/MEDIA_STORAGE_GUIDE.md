# 📸 Media Storage & Optimization Guide

This project is built to handle international traffic, so storing images on the local server is not scalable. Instead, we use a cloud-native approach to optimize and store all media files (like passports, tour images, profile pictures, etc.).

## 🏗️ Architecture

1. **Upload & Optimize (Node.js + Sharp)**: 
   When an admin or user uploads an image, it is received in memory via `multer`. We immediately pass this image to the `sharp` library to:
   - Resize it (e.g., max width 1920px).
   - Convert it to the highly efficient **WebP** format.
   - Compress it (Quality set to 80%) to save 60-80% of bandwidth without losing visual quality.

2. **Storage (Cloudflare R2)**:
   The optimized WebP buffer is uploaded directly to **Cloudflare R2**. 
   *Why Cloudflare R2?* It is S3-compatible, significantly cheaper than AWS S3, and most importantly, it charges **$0 for Egress (Data Transfer)**, making it perfect for international audiences.

3. **Delivery (Cloudflare CDN)**:
   Images are served via a custom Cloudflare domain (`R2_PUBLIC_URL`), ensuring ultra-fast loading times worldwide due to Edge caching.

---

## 🛠️ How to configure

1. Create a Cloudflare account and enable **R2**.
2. Create a new Bucket (e.g., `blb-travel-media`).
3. Go to "Settings" of your bucket and enable "Public Access" or map a custom domain.
4. Get your R2 API Credentials.
5. Add the following to your `.env` file:

```env
# Cloudflare R2 Configuration
R2_ACCOUNT_ID="your_cloudflare_account_id"
R2_ACCESS_KEY_ID="your_r2_access_key"
R2_SECRET_ACCESS_KEY="your_r2_secret_key"
R2_BUCKET_NAME="blb-travel-media"
R2_PUBLIC_URL="https://pub-xxxxxx.r2.dev"
```

---

## 💻 How to use the API

We have created a ready-to-use endpoint for uploading images:

**Endpoint:** `POST /api/media/upload`

**Body (form-data):**
- `image`: The file to upload (JPEG, PNG, etc.)
- `folder` (optional): The folder name in R2 (e.g., `passports`, `packages`). Default is `general`.

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://pub-xxxxxx.r2.dev/passports/random-uuid.webp"
  }
}
```

Whenever you need to save an image in the database, simply call this API first to get the optimized `url`, and save that `url` in your PostgreSQL database!

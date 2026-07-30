# Firestore index deployment

Composite indexes are versioned in `firestore.indexes.json`. Deploy them to the Firebase project before releasing this build:

```sh
npx firebase-tools deploy --only firestore:indexes --project "$VITE_FIREBASE_PROJECT_ID"
```

Index builds can take several minutes. A missing or still-building index is now surfaced in the UI as a data-loading error rather than an empty result.

# Cloudinary delivery

Set `VITE_CLOUDINARY_DELIVERY_HOST` to your Cloudinary custom CNAME (for example `media.example.com`) after configuring it in Cloudinary and DNS. This avoids browser tracking-prevention treatment of `res.cloudinary.com`. Until then, the app continues using the Cloudinary URL returned at upload time.

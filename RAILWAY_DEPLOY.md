# 🚂 Railway Deploy Guide

## Step 1 — GitHub မှာ Repo တင်

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/gaming-topup-store.git
git push -u origin main
```

## Step 2 — Railway Project တည်ဆောက်

1. https://railway.app သွားပါ
2. **"Start a New Project"** နှိပ်
3. **"Deploy from GitHub repo"** ရွေး
4. သင့် repo ကို ရွေး → **"Deploy Now"**

## Step 3 — Environment Variables ထည့်

Railway dashboard → သင့် service → **"Variables"** tab

အောက်ပါတွေ တစ်ခုချင်းထည့်ပါ (Firebase Console မှာ ကြည့်လို့ရ):

| Variable | Value |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | yourproject.firebaseapp.com |
| `VITE_FIREBASE_DATABASE_URL` | https://yourproject-rtdb.firebaseio.com |
| `VITE_FIREBASE_PROJECT_ID` | your-project-id |
| `VITE_FIREBASE_STORAGE_BUCKET` | yourproject.firebasestorage.app |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 123456789 |
| `VITE_FIREBASE_APP_ID` | 1:123:web:abc |
| `VITE_FIREBASE_MEASUREMENT_ID` | G-XXXXXXX |
| `NODE_ENV` | production |

## Step 4 — Firebase မှာ Domain Allow လုပ်

Railway မှာ deploy ဖြစ်ရင် URL ရမယ် (e.g. `your-app.up.railway.app`)

Firebase Console → Authentication → **Settings** → **Authorized domains**
→ **"Add domain"** → Railway URL ထည့်

## Step 5 — Done! ✅

Railway က auto-build လုပ်ပြီး live ဖြစ်သွားမယ်။

---

## Admin Account Setup

Firebase Console → Authentication → Users → **"Add user"**
- Email: `admin@yourdomain.com`
- Password: (သင်ချင်တဲ့ password)

ပြီးရင် `client/src/contexts/AdminContext.tsx` မှာ:
```ts
const ADMIN_EMAILS = ['admin@yourdomain.com'];
```

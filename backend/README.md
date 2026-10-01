# NagarChitra BD - Production Backend Service

প্রডাকশন-গ্রেড আলাদা ব্যাকএন্ড সার্ভিস (Node.js + Express.js + TypeScript + PostgreSQL + Prisma ORM + Socket.io WebSockets)।

---

## 🚀 আর্কিটেকচার ওভারভিউ

- **রানটাইম ও ফ্রেমওয়ার্ক**: Node.js, Express.js, TypeScript
- **ডাটাবেস ও ORM**: PostgreSQL, Prisma ORM
- **রিয়েল-টাইম কমিউনিকেশন**: Socket.io (নতুন ইস্যু সাবমিশন, স্ট্যাটাস আপডেট, ভোট ব্রডকাস্ট)
- **নিরাপত্তা ও অথেন্টিকেশন**: JWT (JSON Web Tokens), bcryptjs পাসওয়ার্ড হ্যাশিং, Helmet, CORS
- **ভ্যালিডেশন**: Zod স্কিমা ভ্যালিডেশন
- **লগিং ও অডিট ট্রেইল**: Morgan HTTP লগার এবং ডাটাবেস সিকিউরিটি অডিট লগস

---

## 📁 ডিরেক্টরি স্ট্রাকচার

```
backend/
├── prisma/
│   ├── schema.prisma        # PostgreSQL স্কিমা (User, Issue, Location, Media, History, Votes)
│   └── seed.ts              # ডেমো ইউজার ও ঢাকার ইনিশিয়াল ইস্যু সিডিং স্ক্রিপ্ট
├── src/
│   ├── config/
│   │   └── env.ts           # এনভায়রনমেন্ট কনফিগারেশন
│   ├── controllers/
│   │   ├── authController.ts   # রেজিস্টার, লগইন, প্রোফাইল
│   │   ├── issueController.ts  # পূর্ণাঙ্গ ইস্যু CRUD, আপভোট, ডুপ্লিকেট চেকিং
│   │   ├── statsController.ts  # সার্বিক ও এলাকাভিত্তিক পরিসংখ্যান
│   │   └── auditController.ts  # অ্যাডমিন সিকিউরিটি অডিট
│   ├── middlewares/
│   │   ├── authMiddleware.ts   # JWT ভেরিফিকেশন ও RBAC রোল গার্ড
│   │   └── errorHandler.ts     # গ্লোবাল সেন্ট্রালাইজড এরর হ্যান্ডলার
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── issueRoutes.ts
│   │   ├── statsRoutes.ts
│   │   ├── auditRoutes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── prisma.ts        # প্রিসমা ক্লায়েন্ট সিঙ্গলটন
│   │   └── socketService.ts # Socket.io ব্রডকাস্টিং হেল্পার
│   └── server.ts            # মেইন এক্সপ্রেস ও ওয়েবসকেট সার্ভার
├── .env.example
├── .env
├── package.json
└── tsconfig.json
```

---

## ⚙️ ইনস্টলেশন ও রান করার নিয়মাবলী

### ১. ডাটাবেস কনফিগারেশন
আপনার লোকাল বা ক্লাউড (Supabase, Neon, Render, AWS RDS) PostgreSQL ডাটাবেসের কানেকশন স্ট্রিং `backend/.env` ফাইলে দিন:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/nagarchitra_db?schema=public"
JWT_SECRET="nagarchitra_jwt_secret_production_key_dhaka_civic_2026"
CORS_ORIGIN="http://localhost:3000"
```

### ২. প্রিসমা ক্লায়েন্ট ও মাইগ্রেশন
```bash
# প্রিসমা স্কিমা থেকে ক্লায়েন্ট জেনারেট করুন
npm run prisma:generate

# ডাটাবেসে টেবিল পুশ করুন
npm run prisma:push

# অথবা প্রডাকশন মাইগ্রেশন চালান
npm run prisma:migrate
```

### ৩. সিড ডাটা লোড করা (ঐচ্ছিক)
```bash
npm run prisma:seed
```
এটি স্বয়ংক্রিয়ভাবে ৩টি ডেমো অ্যাকাউন্ট এবং ঢাকার প্রধান সমস্যাগুলোর ডাটা তৈরি করবে:
- **নাগরিক**: `citizen@nagarchitra.bd` / `password123`
- **কর্তৃপক্ষ**: `authority@dncc.gov.bd` / `password123`
- **অ্যাডমিন**: `admin@nagarchitra.bd` / `password123`

### ৪. সার্ভার চালু করা
```bash
# ডেভেলপমেন্ট মোডে ওয়াচ সহ চালান
npm run dev

# অথবা বিল্ড ও প্রডাকশন মোডে চালান
npm run build
npm start
```
সার্ভারটি চালু হবে: `http://localhost:5000`

---

## 📡 প্রধান API এন্ডপয়েন্টসমূহ

### অথেন্টিকেশন (`/api/auth`)
- `POST /api/auth/register` - নতুন অ্যাকাউন্ট তৈরি
- `POST /api/auth/login` - লগইন ও JWT টোকেন গ্রহণ
- `GET /api/auth/me` - বর্তমান লগইনকৃত ইউজারের প্রোফাইল

### নাগরিক সমস্যা ও রিপোর্ট (`/api/issues`)
- `GET /api/issues` - ফিল্টারসহ সকল ইস্যুর তালিকা (`?status=...&category=...&area=...&search=...`)
- `GET /api/issues/:id` - নির্দিষ্ট ইস্যুর বিস্তারিত (টাইমলাইন, লোকেশন, ছবি ও ভোটসহ)
- `POST /api/issues` - নতুন নাগরিক সমস্যা সাবমিট করা
- `PATCH /api/issues/:id/status` - স্ট্যাটাস পরিবর্তন ও টাইমলাইন এন্ট্রি (কর্তৃপক্ষ/অ্যাডমিন)
- `POST /api/issues/:id/confirm` - "আমিও এটি দেখছি" নাগরিক সমর্থন/আপভোট
- `POST /api/issues/:id/vote` - সমাধান যাচাইকরণ ভোট (`FIXED` অথবা `STILL_EXISTS`)
- `POST /api/issues/:id/follow` - সমস্যা আপডেট ফলো করা
- `GET /api/issues/nearby?lat=...&lng=...&radius=500` - নিকটবর্তী ডুপ্লিকেট চিহ্নিতকরণ

### পরিসংখ্যান (`/api/stats`)
- `GET /api/stats/overall` - জাতীয়/নগর সার্বিক পরিসংখ্যান
- `GET /api/stats/areas` - মিরপুর, ধানমন্ডি, উত্তরা ইত্যাদি এলাকার সামারি

### অ্যাডমিন অডিট (`/api/audit`)
- `GET /api/audit` - সিকিউরিটি ও সিস্টেম অডিট লগ

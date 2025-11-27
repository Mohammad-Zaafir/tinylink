# 🔗 TinyLink — URL Shortener with Analytics

TinyLink is a full-stack URL shortener application built with **Next.js**, **TailwindCSS**, and **PostgreSQL (NeonDB)**.  
It allows users to:

- Create shortened URLs  
- Track click counts  
- View last click timestamps  
- Manage links (open, copy, delete)  
- Search links  
- Beautiful modern UI  
- Fully deployed using **Vercel**

---

## 🚀 Features

### ✅ URL Shortening
- Create short codes automatically or provide your own custom code  
- Validate target URLs before saving

### 📊 Analytics Dashboard
- Track total clicks  
- View last clicked date  
- List all created short URLs  
- Refresh link statistics anytime

### 🎨 Modern UI
- Clean, responsive dashboard  
- Built with TailwindCSS  
- Smooth layout with reusable components (`Layout.js`, `LinkRow.js`)

### 🌐 API Endpoints
Fully REST-based API served from `/api/*` routes.

### ☁️ Deployment-Ready
- Works perfectly with **Vercel + NeonDB PostgreSQL**  
- Environment variable support

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | **Next.js** |
| Styling | **TailwindCSS** |
| Database | **PostgreSQL (NeonDB)** |
| Deployment | **Vercel** |
| API | Next.js API Routes |
| Version Control | Git + GitHub |

---

## 📂 Project Structure

tinylink/
│── components/
│   ├── Layout.js          # App layout wrapper (header, footer)
│   └── LinkRow.js         # UI row for each shortened link
│
│── lib/
│   ├── db.js              # Database connection (Neon)
│   └── fetcher.js         # Utility fetch wrapper for API calls
│
│── pages/
│   ├── api/
│   │   ├── healthz.js     # Health check endpoint
│   │   ├── links.js       # Create/list links
│   │   └── code/
│   │       └── [code].js  # Redirect & analytics update
│   ├── index.js           # Main dashboard page
│   └── _app.js            # Global imports (CSS, layout)
│
│── prisma/
│   └── migrations.sql     # SQL schema for links table
│
│── styles/
│   └── globals.css        # Tailwind global styles
│
│── .env.local             # Local environment variables
│── next.config.js         # Next.js configuration
│── tailwind.config.js     # Tailwind configuration
│── package.json
└── README.md


⚙️ Environment Variables

Create a file named .env.local:

DATABASE_URL=postgresql://<your-neon-connection-url>
BASE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

For Vercel deployment, set these in Dashboard → Project Settings → Environment Variables:

DATABASE_URL = <your-neon-db-url>
NEXT_PUBLIC_BASE_URL = https://your-vercel-domain.vercel.app

After adding them, redeploy the project.

▶️ Running the Project Locally

1️⃣ Install dependencies
npm install

2️⃣ Start development server
npm run dev

3️⃣ Open in browser
http://localhost:3000

🌍 Deployment
Deploying on Vercel

Push project to GitHub

Visit https://vercel.com/new

Import your repository

Add environment variables

Deploy 🎉


👨‍💻 Author

Mohammad Zaafir
Built with ❤️ as part of Aganitha Cognitive Solutions assignment.

⭐ Support

If you like this project, give the repo a star ⭐ on GitHub!
It helps your profile and shows your work professionally.
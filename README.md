# 🛒 বাজার দর (BazarDor)

**প্রয়োজনীয় নিত্যপণ্যের দাম এক নজরে।**  
BazarDor is a modern, responsive price-tracking web application built to provide citizens with daily updates, analytics, and market comparisons for essential commodities in Bangladesh.

---

## 🛠️ Technologies Used

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** BetterAuth (MongoDB Adapter)
    - Supports Email/Password, Google OAuth, and GitHub OAuth
- **Database:** MongoDB Atlas
- **Notifications:** React-Toastify
- **Deployment:** Vercel

---

## ✨ Key Features

1. **Live Price Marquee Ticker (প্রাইস টিকার):**  
   An automated scrolling header marquee displaying real-time prices and percentage changes for all core commodities.

2. **Automated Price Risers & Fallers Sorting (আজ দাম বেড়েছে / কমেছে):**  
   Dedicated sections highlighting the top 6 price risers and top 6 price fallers, automatically sorted in descending order based on percentage fluctuations.

3. **Numeric Bengali Price Sorting (বাংলা সংখ্যা ভিত্তিক সর্টিং):**  
   Category filtering with custom numeric sorting capabilities (Default, Price: Low to High, Price: High to Low) fully compatible with Bengali numerals.

4. **Protected Market Price Comparison (বাজারভিত্তিক বিস্তারিত দাম):**  
   Detailed authenticated view providing market-wise minimum, maximum, and average price comparisons across different divisions in Bangladesh.

5. **Profile & Avatar Management (প্রোফাইল ব্যবস্থাপনা):**  
   Complete user session management featuring OAuth profile image auto-synchronization (Google & GitHub) and standard name/avatar update capabilities.

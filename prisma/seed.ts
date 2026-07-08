// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
 
  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("password123", 12);

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: "admin@yalla.app" },
    update: {},
    create: { 
      name: "Admin", 
      email: "admin@yalla.app", 
      password: adminPassword, 
      role: "admin" 
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "sara@example.com" },
    update: {},
    create: { 
      name: "Sara M.", 
      email: "sara@example.com", 
      password: userPassword, 
      role: "user" 
    },
  });

 
  // Create feedback (replaces reviews)
  await prisma.feedback.deleteMany();
  await prisma.feedback.createMany({
    data: [
      { 
        rating: 5, 
        category: "App experience", 
        message: "I booked my ride in literally 30 seconds. The driver was there before I even got downstairs.", 
        userName: "Sara M.", 
        userEmail: "sara@example.com" 
      },
      { 
        rating: 5, 
        category: "App experience", 
        message: "Switched from another app and never looked back. The live tracking is far more accurate.", 
        userName: "Karim J.", 
        userEmail: "karim@example.com" 
      },
      { 
        rating: 5, 
        category: "Ride quality", 
        message: "Love that I can set my driver preference. That feature alone makes Yalla my go-to.", 
        userName: "Lara N.", 
        userEmail: "lara@example.com" 
      },
      { 
        rating: 4, 
        category: "Pricing", 
        message: "Great app overall. Pricing is transparent and the Electric rides are a nice touch.", 
        userName: "Ahmad T.", 
        userEmail: "ahmad@example.com" 
      },
      { 
        rating: 5, 
        category: "Support", 
        message: "Customer support actually replied in minutes. The in-app chat is fast and the team reads it.", 
        userName: "Maya K.", 
        userEmail: "maya@example.com" 
      },
      { 
        rating: 5, 
        category: "App experience", 
        message: "Clean interface, fast booking, honest prices. I've taken over 200 rides on Yalla.", 
        userName: "Rami H.", 
        userEmail: "rami@example.com" 
      },
      // Driver feedback (mapped to Driver behavior category)
      { 
        rating: 5, 
        category: "Driver behavior", 
        message: "Yalla gives me more rides than any other app. Payouts arrive on time every week.", 
        userName: "Tony B.", 
        userEmail: "tony@example.com" 
      },
      { 
        rating: 5, 
        category: "Driver behavior", 
        message: "I've been driving with Yalla for 8 months. The support team actually picks up the phone.", 
        userName: "Joe K.", 
        userEmail: "joe@example.com" 
      },
      { 
        rating: 4, 
        category: "Pricing", 
        message: "Good volume of rides. I wish surge pricing was more generous during rush hour.", 
        userName: "Elias M.", 
        userEmail: "elias@example.com" 
      },
      { 
        rating: 5, 
        category: "Ride quality", 
        message: "The app is fast, the map is accurate, and passengers are always polite.", 
        userName: "Georges F.", 
        userEmail: "georges@example.com" 
      },
      // Additional feedback entries
      { 
        rating: 5, 
        category: "App experience", 
        message: "The booking flow is incredibly smooth. Under 30 seconds from open to confirmed driver.", 
        userName: "Sara M.", 
        userEmail: "sara@example.com" 
      },
      { 
        rating: 4, 
        category: "Driver behavior", 
        message: "Driver was polite and professional. Car was clean. Only small complaint is the radio was loud.", 
        userName: "Karim J.", 
        userEmail: "karim@example.com" 
      },
      { 
        rating: 5, 
        category: "Ride quality", 
        message: "Smooth ride, great AC, driver knew a shortcut. 10/10.", 
        userName: "Lara N.", 
        userEmail: "lara@example.com" 
      },
      { 
        rating: 3, 
        category: "Pricing", 
        message: "Prices have gone up recently. Still competitive but surge pricing could be clearer.", 
        userName: "Ahmad T.", 
        userEmail: "ahmad@example.com" 
      },
      { 
        rating: 5, 
        category: "Support", 
        message: "Support team replied in under 5 minutes. Issue was resolved immediately.", 
        userName: "Maya K.", 
        userEmail: "maya@example.com" 
      },
      { 
        rating: 4, 
        category: "App experience", 
        message: "Really love the driver preference feature. Would be great to save multiple addresses too.", 
        userName: "Rami H.", 
        userEmail: "rami@example.com" 
      },
    ],
  });
 
  await prisma.download.deleteMany();
  
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: ["admin@yalla.app", "sara@example.com"],
      },
    },
  });
  
  const userMap = Object.fromEntries(users.map(u => [u.email, u.id]));

  // Create downloads for real users (only one per platform per user)
  const downloadData = [
    // Admin user - iOS only
    { platform: "ios", userId: userMap["admin@yalla.app"] },
    // Sara - both platforms
    { platform: "ios", userId: userMap["sara@example.com"] },
    { platform: "android", userId: userMap["sara@example.com"] },
    // Anonymous downloads (20 of them)
    ...Array.from({ length: 20 }, (_, i) => ({
      platform: i % 2 === 0 ? "ios" : "android",
      userId: null,
      createdAt: new Date(Date.now() - i * 1.5 * 24 * 60 * 60 * 1000),
    })),
  ];

  await prisma.download.createMany({
    data: downloadData,
  });
 
  // Create events
  await prisma.event.deleteMany();
  await prisma.event.createMany({
    data: [
      { type: "page_view",       page: "/",         meta: { referrer: "google" } },
      { type: "page_view",       page: "/features", meta: { referrer: "direct" } },
      { type: "page_view",       page: "/download", meta: { referrer: "direct" } },
      { type: "button_click",    page: "/",         meta: { button: "get_the_app" } },
      { type: "download_click",  page: "/download", meta: { platform: "ios" } },
      { type: "download_click",  page: "/download", meta: { platform: "android" } },
      { type: "page_view",       page: "/reviews",  meta: { referrer: "direct" } },
      { type: "feedback_submit", page: "/feedback", meta: { rating: "5" } },
    ],
  });
 
}

main()
  .catch((e) => { 
    process.exit(1); 
  })
  .finally(async () => { 
    await prisma.$disconnect(); 
  });
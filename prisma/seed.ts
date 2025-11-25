import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  // Create admin user
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password,
      role: "ADMIN",
    },
  });

  console.log("✓ Created admin user");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "technology" },
      update: {},
      create: { name: "Technology", slug: "technology" },
    }),
    prisma.category.upsert({
      where: { slug: "business" },
      update: {},
      create: { name: "Business", slug: "business" },
    }),
    prisma.category.upsert({
      where: { slug: "sports" },
      update: {},
      create: { name: "Sports", slug: "sports" },
    }),
    prisma.category.upsert({
      where: { slug: "entertainment" },
      update: {},
      create: { name: "Entertainment", slug: "entertainment" },
    }),
    prisma.category.upsert({
      where: { slug: "science" },
      update: {},
      create: { name: "Science", slug: "science" },
    }),
    prisma.category.upsert({
      where: { slug: "health" },
      update: {},
      create: { name: "Health", slug: "health" },
    }),
  ]);

  console.log("✓ Created categories");

  // Sample news articles
  const newsArticles = [
    {
      title: "AI Revolution: How Machine Learning is Transforming Industries",
      content: JSON.stringify([
        { type: "paragraph", content: [{ type: "text", text: "Artificial Intelligence and Machine Learning are revolutionizing industries across the globe. From healthcare to finance, AI is making processes more efficient and accurate." }] },
        { type: "paragraph", content: [{ type: "text", text: "Companies are investing billions in AI research and development, leading to breakthrough innovations in natural language processing, computer vision, and predictive analytics." }] },
      ]),
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      categorySlug: "technology",
      views: 1250,
    },
    {
      title: "Global Markets Rally as Tech Stocks Surge",
      content: JSON.stringify([
        { type: "paragraph", content: [{ type: "text", text: "Stock markets worldwide experienced significant gains today as technology companies reported better-than-expected earnings." }] },
        { type: "paragraph", content: [{ type: "text", text: "Major tech giants saw their stock prices rise by double digits, boosting investor confidence and driving market indices to new heights." }] },
      ]),
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
      categorySlug: "business",
      views: 890,
    },
    {
      title: "Championship Finals: Underdogs Claim Victory in Stunning Upset",
      content: JSON.stringify([
        { type: "paragraph", content: [{ type: "text", text: "In a thrilling championship final, the underdog team secured a dramatic victory against all odds." }] },
        { type: "paragraph", content: [{ type: "text", text: "The match kept fans on the edge of their seats with incredible plays and last-minute heroics that will be remembered for years to come." }] },
      ]),
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
      categorySlug: "sports",
      views: 2100,
    },
    {
      title: "Breakthrough in Cancer Research Offers New Hope",
      content: JSON.stringify([
        { type: "paragraph", content: [{ type: "text", text: "Scientists have made a groundbreaking discovery in cancer treatment that could revolutionize how we approach the disease." }] },
        { type: "paragraph", content: [{ type: "text", text: "The new therapy shows promising results in clinical trials, with patients experiencing significant improvements and fewer side effects." }] },
      ]),
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800",
      categorySlug: "health",
      views: 1670,
    },
    {
      title: "Blockbuster Movie Breaks Box Office Records Worldwide",
      content: JSON.stringify([
        { type: "paragraph", content: [{ type: "text", text: "The latest blockbuster has shattered box office records, earning over $500 million in its opening weekend globally." }] },
        { type: "paragraph", content: [{ type: "text", text: "Critics and audiences alike have praised the film for its stunning visuals, compelling story, and outstanding performances." }] },
      ]),
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
      categorySlug: "entertainment",
      views: 3200,
    },
    {
      title: "Space Exploration: New Mission to Mars Announced",
      content: JSON.stringify([
        { type: "paragraph", content: [{ type: "text", text: "Space agencies have announced an ambitious new mission to Mars, aiming to establish a permanent human presence on the Red Planet." }] },
        { type: "paragraph", content: [{ type: "text", text: "The mission will utilize cutting-edge technology and represents a major step forward in humanity's quest to become a multi-planetary species." }] },
      ]),
      image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800",
      categorySlug: "science",
      views: 1890,
    },
    {
      title: "5G Technology Rollout Accelerates Across Major Cities",
      content: JSON.stringify([
        { type: "paragraph", content: [{ type: "text", text: "The deployment of 5G networks is rapidly expanding in urban areas, promising faster internet speeds and improved connectivity." }] },
        { type: "paragraph", content: [{ type: "text", text: "This next-generation wireless technology will enable new applications in IoT, autonomous vehicles, and smart city infrastructure." }] },
      ]),
      image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800",
      categorySlug: "technology",
      views: 1120,
    },
    {
      title: "Startup Unicorns: The Rise of Billion-Dollar Companies",
      content: JSON.stringify([
        { type: "paragraph", content: [{ type: "text", text: "The number of startup companies reaching unicorn status has surged this year, with innovative businesses disrupting traditional industries." }] },
        { type: "paragraph", content: [{ type: "text", text: "Venture capital funding has reached record levels as investors bet on the next generation of tech giants." }] },
      ]),
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
      categorySlug: "business",
      views: 750,
    },
    {
      title: "Olympic Athletes Prepare for Upcoming Games",
      content: JSON.stringify([
        { type: "paragraph", content: [{ type: "text", text: "Athletes from around the world are in intensive training as they prepare for the upcoming Olympic Games." }] },
        { type: "paragraph", content: [{ type: "text", text: "New records are expected to be broken as competitors push the boundaries of human performance." }] },
      ]),
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
      categorySlug: "sports",
      views: 1450,
    },
    {
      title: "Mental Health Awareness: Breaking the Stigma",
      content: JSON.stringify([
        { type: "paragraph", content: [{ type: "text", text: "Mental health professionals are working to reduce stigma and improve access to care for those struggling with mental health issues." }] },
        { type: "paragraph", content: [{ type: "text", text: "New initiatives and support programs are making it easier for people to seek help and receive proper treatment." }] },
      ]),
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800",
      categorySlug: "health",
      views: 980,
    },
    {
      title: "Streaming Wars: New Platform Launches with Exclusive Content",
      content: JSON.stringify([
        { type: "paragraph", content: [{ type: "text", text: "A new streaming service has entered the competitive market with a lineup of exclusive shows and movies." }] },
        { type: "paragraph", content: [{ type: "text", text: "The platform aims to differentiate itself through original content and innovative features that enhance the viewing experience." }] },
      ]),
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800",
      categorySlug: "entertainment",
      views: 1340,
    },
    {
      title: "Climate Change: Scientists Warn of Urgent Action Needed",
      content: JSON.stringify([
        { type: "paragraph", content: [{ type: "text", text: "Leading climate scientists have issued a stark warning about the accelerating pace of climate change and its potential impacts." }] },
        { type: "paragraph", content: [{ type: "text", text: "Immediate action is needed to reduce carbon emissions and transition to renewable energy sources to avoid catastrophic consequences." }] },
      ]),
      image: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800",
      categorySlug: "science",
      views: 2450,
    },
    {
      title: "Quantum Computing: The Next Frontier in Technology",
      content: JSON.stringify([
        { type: "paragraph", content: [{ type: "text", text: "Quantum computers are moving from theoretical concepts to practical applications, promising to solve problems that are impossible for classical computers." }] },
        { type: "paragraph", content: [{ type: "text", text: "Major tech companies and research institutions are racing to achieve quantum supremacy and unlock new possibilities in computing." }] },
      ]),
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
      categorySlug: "technology",
      views: 1560,
    },
    {
      title: "E-commerce Boom: Online Shopping Reaches New Heights",
      content: JSON.stringify([
        { type: "paragraph", content: [{ type: "text", text: "Online retail sales have surged to unprecedented levels as consumers increasingly prefer the convenience of e-commerce." }] },
        { type: "paragraph", content: [{ type: "text", text: "Retailers are investing heavily in digital infrastructure and delivery networks to meet growing demand." }] },
      ]),
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
      categorySlug: "business",
      views: 820,
    },
    {
      title: "Nutrition Science: New Study Reveals Benefits of Plant-Based Diet",
      content: JSON.stringify([
        { type: "paragraph", content: [{ type: "text", text: "A comprehensive study has found significant health benefits associated with plant-based diets, including reduced risk of chronic diseases." }] },
        { type: "paragraph", content: [{ type: "text", text: "Researchers recommend incorporating more fruits, vegetables, and whole grains into daily meals for optimal health." }] },
      ]),
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
      categorySlug: "health",
      views: 1180,
    },
  ];

  // Create news articles
  for (const article of newsArticles) {
    const category = categories.find((c) => c.slug === article.categorySlug);
    if (category) {
      await prisma.news.create({
        data: {
          title: article.title,
          content: article.content,
          image: article.image,
          published: true,
          views: article.views,
          authorId: user.id,
          categoryId: category.id,
        },
      });
    }
  }

  console.log("✓ Created 15 news articles");
  console.log("✓ Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

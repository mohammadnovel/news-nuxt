import { getNewsById, incrementNewsViews } from "@/actions/news";
import { getCommentsByNewsId } from "@/actions/comment";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Comments from "@/components/Comments";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Eye } from "lucide-react";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const news = await getNewsById(params.id);

  if (!news) {
    notFound();
  }

  // Increment view count
  await incrementNewsViews(params.id);

  // Get comments
  const comments = await getCommentsByNewsId(params.id);

  // Parse BlockNote content
  let parsedContent;
  try {
    parsedContent = JSON.parse(news.content);
  } catch {
    parsedContent = null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Article */}
        <article className="bg-white">
          {/* Featured Image */}
          {news.image && (
            <div className="w-full h-96 relative mb-8 rounded-lg overflow-hidden">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wide rounded">
              {news.category.name}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {news.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-8 pb-6 border-b-2 border-gray-200">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span className="font-medium">{news.author.name || news.author.email}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <time>{new Date(news.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</time>
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              <span>{(news.views || 0).toLocaleString()} views</span>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {parsedContent && Array.isArray(parsedContent) ? (
              parsedContent.map((block: any, index: number) => {
                if (block.type === "paragraph") {
                  return (
                    <p key={index} className="mb-6 text-gray-800 leading-relaxed text-lg">
                      {block.content?.map((item: any) => item.text).join("") || ""}
                    </p>
                  );
                }
                if (block.type === "heading") {
                  const level = block.props?.level || 2;
                  const text = block.content?.map((item: any) => item.text).join("") || "";
                  
                  if (level === 1) return <h1 key={index} className="text-4xl font-bold text-gray-900 mt-8 mb-4">{text}</h1>;
                  if (level === 2) return <h2 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{text}</h2>;
                  if (level === 3) return <h3 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{text}</h3>;
                  if (level === 4) return <h4 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">{text}</h4>;
                  if (level === 5) return <h5 key={index} className="text-lg font-bold text-gray-900 mt-4 mb-2">{text}</h5>;
                  return <h6 key={index} className="text-base font-bold text-gray-900 mt-4 mb-2">{text}</h6>;
                }
                if (block.type === "bulletListItem") {
                  return (
                    <li key={index} className="ml-6 mb-3 text-gray-800 text-lg list-disc">
                      {block.content?.map((item: any) => item.text).join("") || ""}
                    </li>
                  );
                }
                if (block.type === "numberedListItem") {
                  return (
                    <li key={index} className="ml-6 mb-3 text-gray-800 text-lg list-decimal">
                      {block.content?.map((item: any) => item.text).join("") || ""}
                    </li>
                  );
                }
                return null;
              })
            ) : (
              <div className="text-gray-800 whitespace-pre-wrap text-lg leading-relaxed">
                {news.content}
              </div>
            )}
          </div>

          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated: {new Date(news.updatedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <Link
                href="/"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Read more articles →
              </Link>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <Comments newsId={params.id} comments={comments} />
      </main>

      <Footer />
    </div>
  );
}

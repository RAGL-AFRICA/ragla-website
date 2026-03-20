import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Newspaper } from "lucide-react";

type NewsItem = {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
};

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from("news_posts")
          .select("id, title, content, image_url, published_at, created_at")
          .eq("category", "news")
          .order("published_at", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false });

        if (error) throw error;
        setNews(data || []);
      } catch (error) {
        console.error("Error loading news", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-padding bg-secondary">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">News</h1>
          <p className="text-muted-foreground mt-3">Latest and archived RAGLA news.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-xl bg-muted h-80" />
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-20 bg-background rounded-xl border border-dashed border-border">
              <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No news posts yet</h3>
              <p className="text-muted-foreground">News items will appear here after publishing.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <article key={item.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-52 object-cover" />}
                  <div className="p-5 space-y-3">
                    <h2 className="text-xl font-bold text-foreground break-words">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.published_at || item.created_at).toLocaleString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    {item.content && <p className="text-sm text-foreground whitespace-pre-wrap">{item.content}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;

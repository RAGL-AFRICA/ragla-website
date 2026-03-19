import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { FileText } from "lucide-react";

type PostItem = {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
};

const Posts = () => {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("news_posts")
          .select("id, title, content, image_url, published_at, created_at")
          .eq("category", "post")
          .order("published_at", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error("Error loading posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-padding bg-secondary">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Posts</h1>
          <p className="text-muted-foreground mt-3">General posts and updates.</p>
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
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-background rounded-xl border border-dashed border-border">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No posts yet</h3>
              <p className="text-muted-foreground">Published posts will appear here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((item) => (
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

export default Posts;

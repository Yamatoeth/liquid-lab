import { useState, useMemo } from "react";
import { snippets } from "@/data/snippets";
import Hero from "@/components/Hero";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredSnippets = useMemo(() => {
    return snippets.filter((snippet) => {
      const matchesSearch =
        searchQuery === "" ||
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || snippet.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* All-Access Banner */}
      <section className="border-b">
        <div className="container py-8">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-primary p-8 text-primary-foreground md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">All-Access Pass</h3>
                <p className="text-sm text-primary-foreground/70">
                  Unlock every snippet for $19/month or $149/year
                </p>
              </div>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex h-10 items-center rounded-lg bg-primary-foreground px-6 text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90"
            >
              Subscribe Now
            </Link>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main className="flex-1">
        <div className="container py-12">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Browse Snippets</h2>
              <p className="text-sm text-muted-foreground">
                {filteredSnippets.length} snippet{filteredSnippets.length !== 1 ? "s" : ""} available
              </p>
            </div>
            <CategoryFilter
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          {filteredSnippets.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSnippets.map((snippet) => (
                <ProductCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                No snippets found
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filter
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

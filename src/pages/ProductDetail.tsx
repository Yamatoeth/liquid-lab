import { useParams, Link } from "react-router-dom";
import { snippets } from "@/data/snippets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Check, Copy, Lock, Sparkles } from "lucide-react";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const snippet = snippets.find((s) => s.id === id);
  const [copied, setCopied] = useState(false);
  const [purchased] = useState(false);

  if (!snippet) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container flex flex-1 items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Snippet not found</h1>
            <Link to="/" className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container py-12">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>

          <div className="grid gap-12 lg:grid-cols-5">
            {/* Left: Details */}
            <div className="lg:col-span-2">
              <span className="mb-3 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                {snippet.category}
              </span>
              <h1 className="mb-4 text-3xl font-bold md:text-4xl">{snippet.title}</h1>
              <p className="mb-8 text-muted-foreground">{snippet.description}</p>

              <div className="mb-8 space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Features
                </h3>
                <ul className="space-y-2">
                  {snippet.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-foreground" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">${snippet.price}</span>
                  <span className="text-sm text-muted-foreground">one-time</span>
                </div>

                <button className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Buy this Snippet
                </button>

                <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors hover:bg-accent">
                  <Sparkles className="h-4 w-4" />
                  Unlock All with Subscription
                </button>
              </div>
            </div>

            {/* Right: Code Preview */}
            <div className="lg:col-span-3">
              <div className="overflow-hidden rounded-2xl border">
                <div className="flex items-center justify-between border-b bg-secondary/50 px-4 py-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    {snippet.id}.liquid
                  </span>
                  {purchased ? (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy Code
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Lock className="h-3.5 w-3.5" />
                      Purchase to copy
                    </span>
                  )}
                </div>

                <div className="relative">
                  <pre className="overflow-x-auto p-6 font-mono text-xs leading-relaxed text-foreground/80">
                    <code>{snippet.code}</code>
                  </pre>

                  {!purchased && (
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background via-background/80 to-transparent">
                      <div className="w-full p-6 text-center">
                        <Lock className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
                        <p className="text-sm font-medium">Purchase to unlock full code</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Buy for ${snippet.price} or subscribe for full access
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;

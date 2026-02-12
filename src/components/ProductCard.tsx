import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Snippet } from "@/data/snippets";

interface ProductCardProps {
  snippet: Snippet;
}

const ProductCard = ({ snippet }: ProductCardProps) => {
  return (
    <Link
      to={`/snippet/${snippet.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="aspect-[16/10] bg-secondary flex items-center justify-center overflow-hidden">
        <div className="p-6 font-mono text-xs leading-relaxed text-muted-foreground opacity-60 group-hover:opacity-80 transition-opacity">
          <pre className="whitespace-pre-wrap line-clamp-6">
            {snippet.code.slice(0, 200)}...
          </pre>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {snippet.category}
          </span>
        </div>
        <h3 className="mb-1 text-lg font-semibold group-hover:text-foreground">
          {snippet.title}
        </h3>
        <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">
          {snippet.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">${snippet.price}</span>
          <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            View Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

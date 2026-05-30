"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getRootCategories, getChildCategories, type Category } from "@/lib/data";

interface Props {
  activeSlug?: string;
}

function TreeNode({ category, activeSlug, level = 0 }: { category: Category; activeSlug?: string; level?: number }) {
  const children = getChildCategories(category.slug);
  const hasChildren = children.length > 0;
  const isActive = category.slug === activeSlug;
  const isParentOfActive = children.some((c) => c.slug === activeSlug);
  const [expanded, setExpanded] = useState(isActive || isParentOfActive);

  return (
    <div>
      <div className="flex items-center">
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 mr-1 hover:bg-bg-secondary rounded transition-colors"
          >
            <ChevronDown
              size={14}
              className={`text-text-muted transition-transform ${expanded ? "" : "-rotate-90"}`}
            />
          </button>
        )}
        <Link
          href={hasChildren && !children.some(c => c.slug === category.slug) ? "#" : `/kategori/${category.slug}`}
          onClick={hasChildren ? (e) => { if (!category.parentSlug) { e.preventDefault(); setExpanded(!expanded); } } : undefined}
          className={`flex-1 flex items-center justify-between px-3 py-2.5 text-sm rounded-xl transition-colors ${
            isActive
              ? "bg-accent-bg text-accent font-semibold"
              : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
          } ${!hasChildren && !level ? "ml-6" : ""}`}
        >
          <span>{category.name}</span>
          <span className="text-xs text-text-muted bg-bg-secondary px-2 py-0.5 rounded-full">
            {category.productCount}
          </span>
        </Link>
      </div>
      {hasChildren && expanded && (
        <div className="ml-5 mt-0.5 space-y-0.5 border-l border-border pl-2">
          {children.map((child) => (
            <TreeNode key={child.slug} category={child} activeSlug={activeSlug} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryTree({ activeSlug }: Props) {
  const roots = getRootCategories();

  return (
    <div className="bg-white border border-border rounded-2xl p-5 sticky top-36">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary mb-4">Kategoriler</h3>
      <div className="space-y-0.5">
        {roots.map((cat) => (
          <TreeNode key={cat.slug} category={cat} activeSlug={activeSlug} />
        ))}
      </div>
    </div>
  );
}

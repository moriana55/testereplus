import { ProductCard } from "./product-card";
import { type Product } from "@/lib/data";

interface Props {
  title: string;
  products: Product[];
}

export function RecommendedProducts({ title, products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-text-primary mb-6">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
        {products.slice(0, 6).map((product) => (
          <div key={product.id} className="min-w-[200px] lg:min-w-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

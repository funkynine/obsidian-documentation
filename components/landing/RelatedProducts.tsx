"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

interface Variety {
  id: string;
  name: string;
  image_url: string | null;
}

export function RelatedProducts({
  products,
  excludeId,
}: {
  products: Variety[];
  excludeId?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = products.filter((p) => p.id !== excludeId).slice(0, 6);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 140;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (items.length === 0) return null;

  return (
    <div className="mt-16 flex items-center gap-4">
      <button
        onClick={() => scroll("left")}
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
        aria-label="Попередній"
      >
        ‹
      </button>
      <div
        ref={scrollRef}
        className="flex flex-1 gap-4 overflow-x-auto py-2 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((v) => (
          <Link
            key={v.id}
            href={`/catalog/${v.id}`}
            className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-lg bg-card transition-opacity hover:opacity-90 md:w-32"
          >
            {v.image_url ? (
              <Image
                src={v.image_url}
                alt={v.name}
                fill
                className="object-cover"
                sizes="128px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-3xl text-muted-foreground">
                🌷
              </div>
            )}
          </Link>
        ))}
      </div>
      <button
        onClick={() => scroll("right")}
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
        aria-label="Наступний"
      >
        ›
      </button>
    </div>
  );
}

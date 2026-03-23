"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function CartBadge() {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/cart/count");
        if (res.ok) {
          const data = await res.json();
          setCount(data.count);
        }
      } catch {
        // Si falla, se queda en 0
      }
    }
    fetchCount();
  }, [pathname]);

  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
      {count > 99 ? "99+" : count}
    </span>
  );
}

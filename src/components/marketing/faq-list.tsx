"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { faqItems } from "@/lib/marketing/content";

type FaqListProps = {
  limit?: number;
  searchable?: boolean;
};

export function FaqList({ limit, searchable = false }: FaqListProps) {
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    let list = faqItems;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }
    if (limit) list = list.slice(0, limit);
    return list;
  }, [query, limit]);

  return (
    <div>
      {searchable && (
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search FAQs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-white"
            aria-label="Search FAQs"
          />
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-slate-600">No matching questions found.</p>
      ) : (
        <Accordion type="single" collapsible className="rounded-xl border border-slate-200 bg-white px-4">
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

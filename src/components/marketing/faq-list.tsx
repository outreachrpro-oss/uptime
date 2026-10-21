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
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search FAQs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-border bg-cream pl-9"
            aria-label="Search FAQs"
          />
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-ink-soft">No matching questions found.</p>
      ) : (
        <Accordion
          type="single"
          collapsible
          className="divide-y divide-border border-y border-border"
        >
          {items.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border-0 px-0"
            >
              <AccordionTrigger className="py-5 text-left text-base font-medium text-ink hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-ink-soft">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

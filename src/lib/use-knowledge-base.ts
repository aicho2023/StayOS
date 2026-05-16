"use client";

import { useEffect, useState } from "react";
import { defaultKnowledgeBase } from "@/lib/knowledge-base";

const key = "stay-os-knowledge-base";

export function useKnowledgeBase() {
  const [knowledgeBase, setKnowledgeBase] = useState(defaultKnowledgeBase);

  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    if (stored) {
      setKnowledgeBase(stored);
    } else {
      window.localStorage.setItem(key, defaultKnowledgeBase);
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === key && event.newValue) {
        setKnowledgeBase(event.newValue);
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  function save(next: string) {
    setKnowledgeBase(next);
    window.localStorage.setItem(key, next);
    window.dispatchEvent(new StorageEvent("storage", { key, newValue: next }));
  }

  function reset() {
    save(defaultKnowledgeBase);
  }

  return { knowledgeBase, save, reset };
}

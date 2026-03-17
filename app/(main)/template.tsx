"use client";

import Transition from "@/components/ui/transition";

export default function Template({ children }: { children: React.ReactNode }) {
  return <Transition>{children}</Transition>;
}

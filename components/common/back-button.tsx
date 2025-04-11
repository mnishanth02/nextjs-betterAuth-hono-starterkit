"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  label?: string;
  href?: string;
}

export function BackButton({ label, href }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button variant="link" className="cursor-pointer" onClick={handleClick} aria-label="Back">
      {label || "Back"}
    </Button>
  );
}

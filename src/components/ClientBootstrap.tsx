"use client";

import { useNavigationStore } from "@/store/navigation";
import { setLocale } from "@/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ClientBootstrap() {
  const pathname = usePathname();
  const { setPath } = useNavigationStore();

  useEffect(() => {
    setLocale();
  }, []);

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  return null;
}

"use client";

import { setLocale } from "@/utils";
import { useEffect } from "react";

export default function ClientBootstrap() {
  useEffect(() => {
    setLocale();
  }, []);

  return null;
}

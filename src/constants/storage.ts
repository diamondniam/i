import type { Spacing } from "@/types";

export const API_STORAGE_PREFIX = "@api:";

export const TTLs: Record<Spacing, number> = {
  "3xl": 60 * 60 * 24 * 7 * 1000, // 7d
  "2xl": 60 * 60 * 24 * 3 * 1000, // 3d
  xl: 60 * 60 * 24 * 1000, // 1d
  lg: 60 * 60 * 12 * 1000, // 12h
  md: 60 * 60 * 1 * 1000, // 1h
  sm: 60 * 15 * 1000, // 15min
  xs: 60 * 3 * 1000, // 3min
  xxs: 30 * 1 * 1000, // 30s
};

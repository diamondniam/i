"use client";

import { create } from "zustand";

type NavigationStore = {
  nickRoom: {
    isAnimating: boolean;
    dir?: "forward" | "backwards";
  };
  currentPath: string | null;
  previousPath: string | null;
  setPath: (path: string) => void;
  setNickRoomAnimating: (isAnimating: boolean) => void;
  setNickRoomAnimatingDir: (dir: "forward" | "backwards") => void;
};

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  currentPath: null,
  previousPath: null,
  nickRoom: { isAnimating: false, dir: "forward" },

  setPath: (path: string) => {
    const { currentPath } = get();
    set({ currentPath: path, previousPath: currentPath });
  },
  setNickRoomAnimating: (isAnimating: boolean) =>
    set((state) => ({ nickRoom: { ...state.nickRoom, isAnimating } })),
  setNickRoomAnimatingDir: (dir: "forward" | "backwards") =>
    set((state) => ({ nickRoom: { ...state.nickRoom, dir } })),
}));

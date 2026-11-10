export type View = "beranda" | "jejaring" | "karya" | "jasa" | "kolaborasi" | "workshop";

export type DialogMode = "post" | "jasa" | "kolaborasi" | null;

export type IconName =
  | "archive"
  | "bookmark"
  | "briefcase"
  | "calendar"
  | "check"
  | "close"
  | "comment"
  | "home"
  | "image"
  | "like"
  | "menu"
  | "network"
  | "plus"
  | "search"
  | "users";

export type Post = {
  id: number;
  author: string;
  discipline: string;
  location: string;
  type: string;
  body: string;
  image?: string;
  imageAlt?: string;
  imageCredit?: string;
  tags: string[];
  local?: boolean;
};

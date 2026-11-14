export type Discipline = {
  id: string;
  name: string;
  note: string;
  visual: string;
  credit: string;
};

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
};

export type NetworkProfile = {
  id: string;
  name: string;
  headline: string;
  location: string;
  disciplines: string[];
  banner: string;
  credit: string;
};

export type Organization = {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  disciplines: string[];
  accepting: boolean;
  banner: string;
  credit: string;
};

export type Opportunity = {
  id: string;
  title: string;
  detail: string;
};

export type Workshop = {
  id: string;
  cluster: string;
  title: string;
  format: string;
  description: string;
};

export type Slot = {
  id: string;
  date: string;
  time: string;
  status: "available" | "booked";
};

export type Listing = {
  id: string;
  kind: "service" | "product";
  title: string;
  discipline: string;
  location: string;
  description: string;
  price: number;
  unit: string;
  stock?: number;
  slots?: Slot[];
  image: string;
  credit: string;
};

export type Collaboration = {
  id: string;
  field: string;
  title: string;
  need: string;
};

export type SeedData = {
  disciplines: Discipline[];
  posts: Post[];
  networkProfiles: NetworkProfile[];
  organizations: Organization[];
  opportunities: Opportunity[];
  workshops: Workshop[];
  listings: Listing[];
  collaborations: Collaboration[];
};

export type CategoryId =
  | "coffee"
  | "espresso"
  | "latte"
  | "cappuccino"
  | "mocha"
  | "americano"
  | "cold-coffee"
  | "tea"
  | "pasta"
  | "pizza"
  | "burger"
  | "sandwich"
  | "breakfast"
  | "desserts"
  | "bakery"
  | "croissants"
  | "cookies"
  | "cakes"
  | "ice-cream"
  | "fresh-juice"
  | "smoothies"
  | "mocktails"
  | "snacks";

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar?: number;
  fiber?: number;
}

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  prepTime: number;
  calories: number;
  category: CategoryId;
  ingredients: string[];
  tags: string[];
  nutrition: NutritionInfo;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isBestSeller?: boolean;
  isSeasonal?: boolean;
}

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  description: string;
  image: string;
}

export interface CartItem {
  product: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  review: string;
  date: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  span?: "wide" | "tall";
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: number;
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface Achievement {
  id: string;
  value: string;
  label: string;
  description: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discount: number;
  image: string;
  endsAt: string;
  productIds: string[];
  code?: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface OpeningHours {
  day: string;
  hours: string;
  closed?: boolean;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "name";

export type ViewMode = "grid" | "list";

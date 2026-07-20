/**
 * content/works-types.ts
 * ---------------------------------------------------------------
 * This is the contract. Mock JSON in content/data/*.json is typed
 * against this file today; Supabase tables should mirror these same
 * field names later, so the migration is a data-source swap, not a
 * shape redesign. See content/works-api.ts for where that swap
 * actually happens.
 */

export type ProjectStatus = "published" | "draft" | "archived";
export type WorksCategory = "designs" | "case-studies" | "canvas";

export interface MediaItem {
  type: "image" | "video";
  src: string;
  alt: string;
  /** Poster frame for videos — required in practice, optional in the type. */
  poster?: string;
}

interface BaseWorkItem {
  id: string;
  slug: string;
  status: ProjectStatus;
  title: string;
  /** ISO 8601 date, e.g. "2026-06-12". Drives Recents ordering. */
  publishedDate: string;
  /**
   * Always a plain static image, even if heroMedia is a video —
   * used anywhere a lightweight thumbnail is needed (Recents grid,
   * prev/next preview strips) where rendering a full video would be
   * wasteful or visually noisy.
   */
  heroImage: string;
}

export interface DesignItem extends BaseWorkItem {
  category: "designs";
  heroMedia: MediaItem;
  shortDescription: string;
  otherMedia?: MediaItem[];
}

export interface CanvasItem extends BaseWorkItem {
  category: "canvas";
  heroMedia: MediaItem;
  shortDescription: string;
  otherMedia?: MediaItem[];
}

export interface FeatureBlock {
  subheading: string;
  description: string;
  media: MediaItem;
}

export interface CaseStudySection {
  /** e.g. "01. Visual Identity & Web Design" */
  title: string;
  overview: string;
  blocks: FeatureBlock[];
}

export interface CaseStudyItem extends BaseWorkItem {
  category: "case-studies";
  heroMedia: MediaItem;
  tagline: string;
  /** Deliverable tags, e.g. ["Web Design", "Webflow", "Branding"] */
  tags: string[];
  year: string;
  /** Empty/omitted -> detail page renders a "CASE COMING SOON" block instead of a link. */
  liveSiteUrl?: string;
  pullQuote?: string;
  client: string;
  context: string;
  objective: string;
  services: string[];
  credits?: string;
  sections: CaseStudySection[];
  resultMedia: MediaItem;
  impact?: string;
  testimonial?: { quote: string; author: string };
}

export type WorkItem = DesignItem | CanvasItem | CaseStudyItem;

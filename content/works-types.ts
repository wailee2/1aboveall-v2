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

/**
 * Discriminated union, not one loose object — this is what makes
 * `poster` REQUIRED when type is "video" but absent when type is
 * "image", enforced by the compiler rather than hoped for at
 * runtime. width/height are required on both variants: MediaRenderer's
 * "intrinsic" mode (see components/ui/MediaRenderer.tsx) needs real
 * pixel dimensions to render at natural aspect ratio without layout
 * shift, and these are meant to be generated automatically — see
 * scripts/generate-image-dimensions.mjs — never hand-typed.
 *
 * There is deliberately no separate "heroImage" field anywhere in
 * this file. A video's poster already IS its image representation —
 * storing a second, redundant image path for the same purpose is
 * duplicated data that can drift out of sync. Anywhere an image-only
 * representation of a MediaItem is needed (Recents, Selected Works,
 * OG tags, preview thumbnails), derive it with getMediaThumbnail()
 * from content/media-utils.ts instead.
 */

/**export interface MediaItem {
  type: "image" | "video";
  src: string;
  alt: string;
    Poster frame for videos — required in practice, optional in the type. 
  poster?: string;
}*/

export type MediaItem =
  | { type: "image"; 
      src: string; 
      alt: string; 
      width: number; 
      height: number 
    }
  | { type: "video"; 
      src: string; 
      poster: string; 
      alt: string; 
      width: number; 
      height: number
    };


interface BaseWorkItem {
  id: string;
  slug: string;
  status: ProjectStatus;
  title: string;
  /** ISO 8601 date, e.g. "2026-06-12". Drives Recents ordering. */
  publishedDate: string;
  /**
   * Published alone is NOT enough to appear on the homepage's
   * Selected Works section — that's a separate, deliberate curation
   * flag. A project can be published (visible on its category grid)
   * without being selected (not featured on the homepage).
   */
  selected: boolean;
  /**
   * Presentation-only data for the ONE place selected items render
   * as an asymmetric mosaic (home Selected Works) — deliberately
   * separate from the project's own identity fields, since this is
   * "how does it look in this one curated layout," not an inherent
   * property of the project itself. Only meaningful when
   * selected: true. See components/home/SelectedWorks.tsx for why
   * this is numeric/structured rather than a raw className.
   */
  selectedLayout?: {
    /** 1–12, assuming a 12-column grid. */
    colStart: number;
    colSpan: number;
    /** Narrows the item within its grid cell, e.g. 95 = 95% width. */
    widthPercent?: number;
    /** Which side the narrowed width hugs when narrower than its cell. */
    align?: "left" | "right";
  };
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

export interface MobileExperienceBlock {
  description: string;
  media: MediaItem[];
}

export interface CaseStudySection {
  /** e.g. "01. Visual Identity & Web Design" */
  title: string;
  overview: string;
  blocks: FeatureBlock[];
  mobileExperience?: MobileExperienceBlock;
  visualMedia?: MediaItem;
}



export interface CaseStudyItem extends BaseWorkItem {
  category: "case-studies";
  heroMedia: MediaItem;
  /** Deliverable services, e.g. ["Web Design", "Webflow", "Branding"] */
  services: string[];
  year: string;
  /** Empty/omitted -> detail page renders a "CASE COMING SOON" block instead of a link. */
  liveSiteUrl?: string;

  heroStatement?: string;
  tagline?: string;
  client?: string;
  context: string;
  objective: string;

  showcaseMedia: MediaItem;
  sections: CaseStudySection[];

  impact?: string;
  testimonial?: { quote: string; author: string };
}

export type WorkItem = DesignItem | CanvasItem | CaseStudyItem;

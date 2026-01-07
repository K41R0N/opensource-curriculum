/**
 * Content Type Definitions
 *
 * These types define the content schema for the DEVICES Curriculum.
 * They are front-end agnostic and should match the CMS config and
 * CONTENT_ARCHITECTURE.md documentation.
 *
 * @see /CONTENT_ARCHITECTURE.md
 */

// ============================================
// Core Content Types
// ============================================

export interface Cluster {
	/** Derived from order field - used for display (e.g., "Cluster 1") */
	id: number;
	/** Display name */
	title: string;
	/** URL-safe identifier (unique) */
	slug: string;
	/** Brief summary (1-2 sentences) */
	description: string;
	/** Extended overview (markdown body) */
	overview?: string;
	/** Lessons in this cluster (populated by loader) */
	lessons: Lesson[];
}

export interface Lesson {
	/** Composite ID: "{cluster.id}-{order}" */
	id: string;
	/** Display name */
	title: string;
	/** URL-safe identifier (unique within cluster) */
	slug: string;
	/** Parent cluster slug reference */
	cluster: string;
	/** Sort position within cluster (1-based) */
	order: number;
	/** Brief summary (1-2 sentences) */
	description: string;
	/** Original author of source material */
	author?: string;
	/** Hero/thumbnail image path */
	featured_image?: string;
	/** Learning objectives list */
	objectives?: string[];
	/** Core concepts with explanations */
	key_concepts?: KeyConcept[];
	/** Primary reading/task assignment */
	assignment?: Assignment;
	/** Reflection questions */
	knowledge_check?: Question[];
	/** Supplementary materials */
	additional_resources?: Resource[];
	/** Introduction/overview (markdown body) */
	content?: string;
}

// ============================================
// Nested Types
// ============================================

export interface KeyConcept {
	/** Concept name/title */
	name: string;
	/** Detailed explanation (markdown) */
	explanation: string;
}

export interface Assignment {
	/** Task instructions (markdown) */
	instructions: string;
	/** Link to reading material */
	url?: string;
	/** Display title for the reading */
	reading_title?: string;
}

export interface Question {
	/** The question text */
	question: string;
	/** Optional hint for reflection */
	hint?: string;
}

export interface Resource {
	/** Resource title */
	title: string;
	/** Resource author */
	author?: string;
	/** Link to resource */
	url?: string;
	/** Brief description */
	description?: string;
}

// ============================================
// Page Types
// ============================================

export interface Page {
	/** Page title */
	title: string;
	/** Optional subtitle */
	subtitle?: string;
	/** Main content (markdown) */
	body: string;
}

export interface HomePage {
	/** Main curriculum title (displayed in book cover) */
	title: string;
	/** One-sentence value proposition */
	tagline: string;
	/** Call-to-action button text */
	cta_text: string;
	/** Optional approach/philosophy section (markdown) */
	body?: string;
}

export interface AboutPage extends Page {
	title: string;
	subtitle?: string;
	body: string;
}

// ============================================
// Settings
// ============================================

export interface SiteSettings {
	/** Site name */
	title: string;
	/** SEO/meta description */
	description: string;
	/** Site author/owner */
	author: string;
	/** External blog link */
	substack_url?: string;
	/** Footer tagline */
	footer_text?: string;
}

// ============================================
// Component Data Contracts
// ============================================

/**
 * Data required to render a cluster card in any list/grid context
 */
export interface ClusterCardData {
	id: number;
	title: string;
	slug: string;
	description: string;
	lessonCount: number;
}

/**
 * Data required to render a lesson card in any list context
 */
export interface LessonCardData {
	title: string;
	slug: string;
	description: string;
	author?: string;
	order: number;
	clusterSlug: string;
}

/**
 * Navigation context for prev/next within a cluster
 */
export interface NavigationContext {
	cluster: {
		title: string;
		slug: string;
		id: number;
	};
	currentIndex: number;
	totalLessons: number;
	prevLesson?: {
		title: string;
		slug: string;
	};
	nextLesson?: {
		title: string;
		slug: string;
	};
}

// ============================================
// Utility Types
// ============================================

/**
 * Curriculum data structure as loaded from content
 */
export interface CurriculumData {
	clusters: Cluster[];
}

/**
 * Full lesson data as loaded for lesson pages
 */
export interface LessonPageData {
	lesson: Lesson | null;
	hasContent: boolean;
}

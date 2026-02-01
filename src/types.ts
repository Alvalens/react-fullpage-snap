export interface SectionInfo {
	index: number;
	anchor: string | null;
	element: HTMLElement | null;
}

export interface FullPageOptions {
	scrollingSpeed?: number;
	anchors?: string[];
	menu?: string;
	lockAnchors?: boolean;
	onSectionChange?: (prevIndex: number, nextIndex: number) => void;
	beforeScroll?: (origin: SectionInfo, destination: SectionInfo) => void;
	afterScroll?: (origin: SectionInfo, destination: SectionInfo) => void;
	keyboardScrolling?: boolean;
	touchScrolling?: boolean;
	wheelScrolling?: boolean;
	scrollThreshold?: number;
	touchThreshold?: number;
}

export interface FullPageContextValue {
	activeIndex: number;
	isScrolling: boolean;
	scrollDirection: "up" | "down" | null;
	totalSections: number;
	anchors: string[];
	moveTo: (target: number | string) => void;
	moveNext: () => void;
	movePrevious: () => void;
	getActiveSection: () => SectionInfo;
	setAllowScrolling: (allow: boolean) => void;
	registerSection: (element: HTMLElement) => () => void;
}

export interface ScrollAnimationOptions {
	targetY: number;
	duration: number;
	onComplete?: () => void;
	easing?: (t: number) => number;
}

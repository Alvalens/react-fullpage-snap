import { easeInOutCubic } from "./easing";
import type { ScrollAnimationOptions } from "../types";

let currentAnimationFrame: number | null = null;

/**
 * Smooth scroll to target Y position using requestAnimationFrame
 * Cancels any ongoing scroll animation
 */
export function scrollToPosition(options: ScrollAnimationOptions): void {
	const { targetY, duration, onComplete, easing = easeInOutCubic } = options;

	// Cancel any ongoing animation
	if (currentAnimationFrame !== null) {
		cancelAnimationFrame(currentAnimationFrame);
		currentAnimationFrame = null;
	}

	const startY = window.scrollY || window.pageYOffset;
	const distance = targetY - startY;
	const startTime = performance.now();

	// If already at target, complete immediately
	if (Math.abs(distance) < 1) {
		if (onComplete) onComplete();
		return;
	}

	function animate(currentTime: number): void {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const easedProgress = easing(progress);
		const currentY = startY + distance * easedProgress;

		window.scrollTo(0, currentY);

		if (progress < 1) {
			currentAnimationFrame = requestAnimationFrame(animate);
		} else {
			currentAnimationFrame = null;
			if (onComplete) onComplete();
		}
	}

	currentAnimationFrame = requestAnimationFrame(animate);
}

/**
 * Cancel any ongoing scroll animation
 */
export function cancelScrollAnimation(): void {
	if (currentAnimationFrame !== null) {
		cancelAnimationFrame(currentAnimationFrame);
		currentAnimationFrame = null;
	}
}

/**
 * Check if scroll animation is currently running
 */
export function isScrolling(): boolean {
	return currentAnimationFrame !== null;
}

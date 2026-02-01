# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2026-02-01

### Fixed

- **Trackpad scrolling**: Fixed stagger/jitter when using touchpad 2-finger scroll gestures on desktop
- Replaced time-based cooldown with gesture-based locking — one continuous trackpad gesture now triggers exactly one section scroll regardless of speed changes mid-gesture
- Cleaned up unused refs from previous iteration

## [1.0.1] - 2026-02-01

### Fixed

- **Mobile touch scrolling**: Fixed drift and jitter after snap animation on mobile devices
- Touch events now properly prevent native scroll momentum to ensure smooth section transitions
- Improved touch handling reliability on iOS and Android

## [1.0.0] - 2026-01-31

### Added

- Initial release

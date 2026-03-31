"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface TabBorderWrapperProps {
  /** Index of the active tab (0-based) within the tabs container */
  activeTabIndex: number;
  /** The tab buttons row content */
  tabsContent: React.ReactNode;
  /** The main content below the tabs */
  children: React.ReactNode;
  /** Whether to show the border (hide during loading/empty states) */
  showBorder?: boolean;
}

interface TabRect {
  left: number;
  width: number;
}

const BODY_RADIUS = 16; // Corner radius for the main content area
const TAB_RADIUS = 12; // Corner radius for the tab notch top corners
const CONCAVE_RADIUS = 10; // Radius for the concave curves at tab-body junctions
const STROKE_COLOR = "#E9EAEB";

/**
 * Generates an SVG path for the folder-tab border shape, matching the Figma design.
 * The notch wraps around the active tab, then continues as a rounded
 * rectangle around the content area. Uses concave curves at the junctions.
 *
 * Handles edge cases where the tab is near the left or right edge.
 */
function buildTabBorderPath(
  w: number,
  h: number,
  tabLeft: number,
  tabWidth: number,
  notchHeight: number,
): string {
  const R = BODY_RADIUS;
  const tr = TAB_RADIUS;
  const cr = CONCAVE_RADIUS;
  const tabRight = tabLeft + tabWidth;
  const bodyTop = notchHeight;

  // Determine if there's enough space for the left junction (body corner + concave curve)
  const hasLeftSpace = tabLeft > R + cr + 2;
  // Determine if there's enough space for the right junction
  const hasRightSpace = tabRight + cr + R + 2 < w;

  const segments: string[] = [];

  // ---- Top of tab notch ----
  segments.push(`M ${tabLeft + tr} 0.5`);
  segments.push(`L ${tabRight - tr} 0.5`);

  // ---- Top-right corner of tab ----
  segments.push(`A ${tr} ${tr} 0 0 1 ${tabRight} ${tr + 0.5}`);

  // ---- Right side of tab going down ----
  if (hasRightSpace) {
    // Standard: tab side → concave curve → body top edge
    segments.push(`L ${tabRight} ${bodyTop - cr}`);
    segments.push(`A ${cr} ${cr} 0 0 0 ${tabRight + cr} ${bodyTop}`);
    segments.push(`L ${w - R} ${bodyTop}`);
    segments.push(`A ${R} ${R} 0 0 1 ${w} ${bodyTop + R}`);
  } else {
    // Tab near right edge: smooth curve directly to body right edge
    segments.push(`L ${tabRight} ${bodyTop - cr}`);
    segments.push(`C ${tabRight} ${bodyTop} ${w} ${bodyTop} ${w} ${bodyTop + R}`);
  }

  // ---- Right edge down ----
  segments.push(`L ${w} ${h - R}`);
  segments.push(`A ${R} ${R} 0 0 1 ${w - R} ${h}`);

  // ---- Bottom edge ----
  segments.push(`L ${R} ${h}`);
  segments.push(`A ${R} ${R} 0 0 1 0 ${h - R}`);

  // ---- Left edge up ----
  if (hasLeftSpace) {
    // Standard: body left edge → body corner → horizontal → concave curve → tab left side
    segments.push(`L 0 ${bodyTop + R}`);
    segments.push(`A ${R} ${R} 0 0 1 ${R} ${bodyTop}`);
    segments.push(`L ${tabLeft - cr} ${bodyTop}`);
    segments.push(`A ${cr} ${cr} 0 0 0 ${tabLeft} ${bodyTop - cr}`);
  } else {
    // Tab near left edge: keep the corner/concave radii consistent (prefer arcs over a sharp cubic).
    segments.push(`L 0 ${bodyTop + R}`);

    // If the tab is extremely close to the edge, we can't fit a full R corner.
    // Clamp the arc end X so we still get a rounded join without overshooting the tab.
    const cornerEndX = Math.min(R, Math.max(0, tabLeft));
    segments.push(`A ${R} ${R} 0 0 1 ${cornerEndX} ${bodyTop}`);

    // Only add the straight segment if there is space before the concave arc.
    if (tabLeft - cr > cornerEndX) {
      segments.push(`L ${tabLeft - cr} ${bodyTop}`);
    }

    segments.push(`A ${cr} ${cr} 0 0 0 ${tabLeft} ${bodyTop - cr}`);
  }

  // ---- Left side of tab going up ----
  segments.push(`L ${tabLeft} ${tr + 0.5}`);

  // ---- Top-left corner of tab ----
  segments.push(`A ${tr} ${tr} 0 0 1 ${tabLeft + tr} 0.5`);

  segments.push("Z");

  return segments.join(" ");
}

export default function TabBorderWrapper({
  activeTabIndex,
  tabsContent,
  children,
  showBorder = true,
}: TabBorderWrapperProps) {
  const tabsRowRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tabRect, setTabRect] = useState<TabRect | null>(null);
  const [wrapperSize, setWrapperSize] = useState<{ width: number; height: number } | null>(null);

  const NOTCH_HEIGHT = 50; // tab height (32) + vertical padding (6+6)

  const measure = useCallback(() => {
    if (!tabsRowRef.current || !wrapperRef.current) return;

    const wrapperBox = wrapperRef.current.getBoundingClientRect();
    const buttons = tabsRowRef.current.querySelectorAll<HTMLButtonElement>("button");

    if (activeTabIndex >= 0 && activeTabIndex < buttons.length) {
      const btn = buttons[activeTabIndex];
      const btnBox = btn.getBoundingClientRect();

      // Raw position relative to the wrapper (with padding around the tab)
      const pad = 8;
      let left = btnBox.left - wrapperBox.left - pad;
      let right = btnBox.right - wrapperBox.left + pad;

      // Clamp to container bounds so the notch never overflows
      left = Math.max(0, left);
      right = Math.min(wrapperBox.width, right);

      // Only show notch if the tab has meaningful visible width
      const clampedWidth = right - left;
      if (clampedWidth > TAB_RADIUS * 2 + 4) {
        setTabRect({ left, width: clampedWidth });
      } else {
        // Tab is almost entirely scrolled out — collapse notch to body edge
        setTabRect(null);
      }
    }

    setWrapperSize({
      width: wrapperBox.width,
      height: wrapperBox.height,
    });
  }, [activeTabIndex]);

  useEffect(() => {
    const frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, [measure, activeTabIndex]);

  useEffect(() => {
    const observer = new ResizeObserver(measure);
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [measure]);

  // Re-measure on horizontal scroll of the tabs row so the notch follows the tab
  useEffect(() => {
    const el = tabsRowRef.current;
    if (!el) return;

    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [measure]);

  const showSvg = showBorder && wrapperSize && wrapperSize.width > 0;

  return (
    <div ref={wrapperRef} className="relative" style={{ paddingTop: NOTCH_HEIGHT }}>
      {/* SVG border overlay */}
      {showSvg ? (
        <svg
          className="pointer-events-none absolute inset-0 z-0"
          width={wrapperSize.width}
          height={wrapperSize.height}
          viewBox={`0 0 ${wrapperSize.width} ${wrapperSize.height}`}
          fill="none"
          aria-hidden="true"
        >
          <path
            d={
              tabRect
                ? buildTabBorderPath(
                    wrapperSize.width,
                    wrapperSize.height,
                    tabRect.left,
                    tabRect.width,
                    NOTCH_HEIGHT,
                  )
                : // Fallback: plain rounded rectangle when tab is scrolled out of view
                  `M ${BODY_RADIUS} ${NOTCH_HEIGHT} L ${wrapperSize.width - BODY_RADIUS} ${NOTCH_HEIGHT} A ${BODY_RADIUS} ${BODY_RADIUS} 0 0 1 ${wrapperSize.width} ${NOTCH_HEIGHT + BODY_RADIUS} L ${wrapperSize.width} ${wrapperSize.height - BODY_RADIUS} A ${BODY_RADIUS} ${BODY_RADIUS} 0 0 1 ${wrapperSize.width - BODY_RADIUS} ${wrapperSize.height} L ${BODY_RADIUS} ${wrapperSize.height} A ${BODY_RADIUS} ${BODY_RADIUS} 0 0 1 0 ${wrapperSize.height - BODY_RADIUS} L 0 ${NOTCH_HEIGHT + BODY_RADIUS} A ${BODY_RADIUS} ${BODY_RADIUS} 0 0 1 ${BODY_RADIUS} ${NOTCH_HEIGHT} Z`
            }
            fill="white"
            stroke={STROKE_COLOR}
            strokeWidth={1}
          />
        </svg>
      ) : null}

      {/* Tabs row — positioned inside the notch area */}
      <div
        ref={tabsRowRef}
        className="absolute left-2 right-0 top-1 z-10 overflow-x-auto scrollbar-hide ml-2 mr-2"
        style={{ height: NOTCH_HEIGHT, padding: "6px 12px" }}
      >
        {tabsContent}
      </div>

      {/* Content area */}
      <div className="relative z-10 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
        {children}
      </div>
    </div>
  );
}

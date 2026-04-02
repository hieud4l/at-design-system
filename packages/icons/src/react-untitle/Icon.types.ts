import type { ComponentType, SVGProps } from "react";

/**
 * Semantic icon size presets for AT Design System.
 * - `xs`: 12px — inline indicators, badges
 * - `sm`: 16px — compact UI, table cells
 * - `md`: 20px — default, buttons, inputs
 * - `lg`: 24px — prominent actions, headers
 * - `xl`: 32px — hero sections, empty states
 */
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
    /** The icon component to render (from @at/icons or style sub-paths) */
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    /** Semantic size preset. Defaults to "md" (20px). */
    size?: IconSize;
    /** Icon color. Prefer using CSS variables, e.g. "var(--color-text-brand)". */
    color?: string;
}

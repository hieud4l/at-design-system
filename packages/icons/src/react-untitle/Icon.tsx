import { forwardRef } from "react";
import type { IconProps } from "./Icon.types";

const ICON_SIZES = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
} as const;

/**
 * Icon wrapper component for AT Design System.
 *
 * Provides semantic size presets and consistent defaults
 * for icons from Untitled UI Icons PRO.
 *
 * @example
 * ```tsx
 * import { Icon } from "@at/icons";
 * import { Home01 } from "@at/icons";
 *
 * <Icon icon={Home01} size="md" />
 * <Icon icon={Home01} size="lg" color="var(--color-text-brand)" />
 * ```
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ icon: IconComponent, size = "md", color, className, ...rest }, ref) => {
        const pixelSize = ICON_SIZES[size];

        return (
            <IconComponent
                ref={ref}
                width={pixelSize}
                height={pixelSize}
                color={color}
                className={className}
                aria-hidden="true"
                {...rest}
            />
        );
    }
);

Icon.displayName = "Icon";

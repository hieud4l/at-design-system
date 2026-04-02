/* eslint-disable */
/* tslint:disable */
import * as React from 'react';
export interface CirclePlus18Props extends React.SVGAttributes<SVGElement> {
size?: string | number;
}
const CirclePlus18: React.FC<CirclePlus18Props> = ({size, ...props}) => (
  <svg viewBox="0 0 18 18" fill="currentColor" width={ size || "18" } height={ size || "18" } {...props}>
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" className="nc-icon-wrapper">
      <circle cx="9" cy="9" r="7.25" />
      <path stroke="var(--color-text-secondary700)" d="M5.75 9h6.5M9 5.75v6.5" />
    </g>
  </svg>
);
CirclePlus18.displayName = 'CirclePlus18';
export default CirclePlus18;
/* tslint:enable */
/* eslint-enable */

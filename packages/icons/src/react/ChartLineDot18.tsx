/* eslint-disable */
/* tslint:disable */
import * as React from 'react';
export interface ChartLineDot18Props extends React.SVGAttributes<SVGElement> {
size?: string | number;
}
const ChartLineDot18: React.FC<ChartLineDot18Props> = ({size, ...props}) => (
  <svg viewBox="0 0 18 18" fill="currentColor" width={ size || "18" } height={ size || "18" } {...props}>
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" className="nc-icon-wrapper">
      <path stroke="var(--color-text-secondary700)" d="m12.75 7.75-2.146 2.146a.5.5 0 0 1-.707 0L8.104 8.103a.5.5 0 0 0-.707 0l-2.146 2.146" />
      <path d="M15.25 8.244v5.006a2 2 0 0 1-2 2h-8.5a2 2 0 0 1-2-2v-8.5a2 2 0 0 1 2-2h5" />
      <path stroke="var(--color-text-secondary700)" d="M15 5.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5" />
    </g>
  </svg>
);
ChartLineDot18.displayName = 'ChartLineDot18';
export default ChartLineDot18;
/* tslint:enable */
/* eslint-enable */

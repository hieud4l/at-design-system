/* eslint-disable */
/* tslint:disable */
import * as React from 'react';
export interface Obj3DFront18Props extends React.SVGAttributes<SVGElement> {
size?: string | number;
}
const Obj3DFront18: React.FC<Obj3DFront18Props> = ({size, ...props}) => (
  <svg viewBox="0 0 18 18" fill="currentColor" width={ size || "18" } height={ size || "18" } {...props}>
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" className="nc-icon-wrapper">
      <path stroke="var(--color-text-secondary700)" d="M9 8.25V1M6.75 3 9 .75 11.25 3" />
      <path d="M15.748 8.624v3.251a.76.76 0 0 1-.413.664l-5.87 3.091a1 1 0 0 1-.932 0l-5.87-3.091a.76.76 0 0 1-.413-.664V8.624m6.749 7.121v-3.251" />
      <path d="M6 6.202 2.652 7.961a.75.75 0 0 0 0 1.327l5.883 3.09a1 1 0 0 0 .934 0l5.883-3.09a.75.75 0 0 0 0-1.327L12 6.199" />
    </g>
  </svg>
);
Obj3DFront18.displayName = 'Obj3DFront18';
export default Obj3DFront18;
/* tslint:enable */
/* eslint-enable */

/* eslint-disable */
/* tslint:disable */
import * as React from 'react';
export interface FaceEdit18Props extends React.SVGAttributes<SVGElement> {
size?: string | number;
}
const FaceEdit18: React.FC<FaceEdit18Props> = ({size, ...props}) => (
  <svg viewBox="0 0 18 18" fill="currentColor" width={ size || "18" } height={ size || "18" } {...props}>
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" className="nc-icon-wrapper">
      <path stroke="var(--color-text-secondary700)" d="M11.25 10.758a2.66 2.66 0 0 1-4.5 0" />
      <path fill="#000" stroke="var(--color-text-secondary700)" d="M6 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2m6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" dataStroke="none" />
      <path d="M16.247 8.057 16.25 8a7.25 7.25 0 0 0-14.5 0c0 3.82 2.96 6.936 6.71 7.214" />
      <path stroke="var(--color-text-secondary700)" d="m13.796 16.454 3.161-3.161a1 1 0 0 0 0-1.414l-.586-.586a1 1 0 0 0-1.414 0l-3.161 3.161L11 17.25z" />
    </g>
  </svg>
);
FaceEdit18.displayName = 'FaceEdit18';
export default FaceEdit18;
/* tslint:enable */
/* eslint-enable */

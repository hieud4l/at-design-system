import React, { lazy, Suspense } from "react";

const ChartLineDot18Icon = lazy(() => import("../react/ChartLineDot18"));

const ChartLineDot18 = (props: any) => (
  <Suspense fallback={null}>
    <ChartLineDot18Icon {...props} />
  </Suspense>
);

export default ChartLineDot18;

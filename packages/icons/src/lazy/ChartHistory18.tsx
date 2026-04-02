import React, { lazy, Suspense } from "react";

const ChartHistory18Icon = lazy(() => import("../react/ChartHistory18"));

const ChartHistory18 = (props: any) => (
  <Suspense fallback={null}>
    <ChartHistory18Icon {...props} />
  </Suspense>
);

export default ChartHistory18;

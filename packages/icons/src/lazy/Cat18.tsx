import React, { lazy, Suspense } from "react";

const Cat18Icon = lazy(() => import("../react/Cat18"));

const Cat18 = (props: any) => (
  <Suspense fallback={null}>
    <Cat18Icon {...props} />
  </Suspense>
);

export default Cat18;

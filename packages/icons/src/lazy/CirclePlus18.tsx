import React, { lazy, Suspense } from "react";

const CirclePlus18Icon = lazy(() => import("../react/CirclePlus18"));

const CirclePlus18 = (props: any) => (
  <Suspense fallback={null}>
    <CirclePlus18Icon {...props} />
  </Suspense>
);

export default CirclePlus18;

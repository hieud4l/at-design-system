import React, { lazy, Suspense } from "react";

const Obj3DFront18Icon = lazy(() => import("../react/Obj3DFront18"));

const Obj3DFront18 = (props: any) => (
  <Suspense fallback={null}>
    <Obj3DFront18Icon {...props} />
  </Suspense>
);

export default Obj3DFront18;

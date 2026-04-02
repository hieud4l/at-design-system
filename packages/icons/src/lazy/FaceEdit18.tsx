import React, { lazy, Suspense } from "react";

const FaceEdit18Icon = lazy(() => import("../react/FaceEdit18"));

const FaceEdit18 = (props: any) => (
  <Suspense fallback={null}>
    <FaceEdit18Icon {...props} />
  </Suspense>
);

export default FaceEdit18;

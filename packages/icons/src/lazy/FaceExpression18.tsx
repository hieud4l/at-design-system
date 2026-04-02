import React, { lazy, Suspense } from "react";

const FaceExpression18Icon = lazy(() => import("../react/FaceExpression18"));

const FaceExpression18 = (props: any) => (
  <Suspense fallback={null}>
    <FaceExpression18Icon {...props} />
  </Suspense>
);

export default FaceExpression18;

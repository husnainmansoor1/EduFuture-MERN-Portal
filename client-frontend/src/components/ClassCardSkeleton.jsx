import React from "react";
import ContentLoader from "react-content-loader";

const ClassCardSkeleton = () => (
  <ContentLoader
    speed={1.5}
    width="100%"
    height={240}
    viewBox="0 0 400 240"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      width: "100%",
      height: "240px",
      borderRadius: "14px",
    }}
  >
    {/* Top banner */}
    <rect x="0" y="0" rx="12" ry="12" width="400" height="100" />

    {/* Title */}
    <rect x="20" y="120" rx="8" ry="8" width="260" height="18" />

    {/* Subtitle */}
    <rect x="20" y="150" rx="8" ry="8" width="180" height="15" />

    {/* Bottom small text */}
    <rect x="20" y="185" rx="8" ry="8" width="140" height="15" />

    {/* 3-dot menu icon */}
    <rect x="350" y="120" rx="10" ry="10" width="30" height="30" />
  </ContentLoader>
);

export default ClassCardSkeleton;

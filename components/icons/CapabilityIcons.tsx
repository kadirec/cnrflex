import type { SVGProps } from "react";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconMoldDesign(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M2.5 21h19" />
      <path d="M4 21V13h5v8M9 21V8h6v13M15 21V11h5v10" />
      <path d="M5.5 15v.5M5.5 18v.5M7.5 15v.5M7.5 18v.5" />
      <path d="M10.5 11v.5M12 11v.5M13.5 11v.5M10.5 14v.5M13.5 14v.5M10.5 17v.5M13.5 17v.5" />
      <path d="M16.5 14v.5M18.5 14v.5M16.5 17v.5M18.5 17v.5" />
      <path d="M17 9c.4.3.4.9 0 1.2" />
    </svg>
  );
}

export function IconExtrusion(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M4 4.5c.5.4.5 1.1 0 1.5M7 4.5c.5.4.5 1.1 0 1.5" />
      <path d="M3 6h2v3H3zM6 6h2v3H6z" />
      <rect x="2.5" y="9.5" width="10" height="6.5" rx="1" />
      <path d="M12.5 11.5h4l3.5 1.5-3.5 1.5h-4z" />
      <path d="M17.5 18.5h3v3h-3z" />
      <path d="M19 14.5v4" />
    </svg>
  );
}

export function IconQualityLab(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M9.5 3h5" />
      <path d="M10.5 3v6.5L5.5 19a1.2 1.2 0 0 0 1 1.8h11a1.2 1.2 0 0 0 1-1.8L13.5 9.5V3" />
      <path d="M7.5 15c1.4-1 2.8 1 4.2 0s2.8 1 4.2 0" />
      <circle cx="10.5" cy="18" r=".5" />
      <circle cx="13.5" cy="17.5" r=".5" />
    </svg>
  );
}

export function IconProjectMgmt(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <rect x="2.5" y="15.5" width="19" height="3" rx="1.5" />
      <circle cx="5.5" cy="20.5" r="1" />
      <circle cx="12" cy="20.5" r="1" />
      <circle cx="18.5" cy="20.5" r="1" />
      <path d="M6 10v5.5M8.5 10v5.5M6 10c0-1.5 2.5-1.5 2.5 0M6.7 7.5h1.1M7.25 7.5V10" />
      <path d="M11.5 10v5.5M14 10v5.5M11.5 10c0-1.5 2.5-1.5 2.5 0M12.2 7.5h1.1M12.75 7.5V10" />
      <path d="M17 10v5.5M19.5 10v5.5M17 10c0-1.5 2.5-1.5 2.5 0M17.7 7.5h1.1M18.25 7.5V10" />
    </svg>
  );
}

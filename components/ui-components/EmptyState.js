import React from "react";

const ART = {
  cart: (
    <>
      <path
        d="M22 34h10l8 40h44l8-30H38"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="48" cy="88" r="6" fill="currentColor" />
      <circle cx="80" cy="88" r="6" fill="currentColor" />
      <path
        d="M52 54h24"
        stroke="var(--second-color)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </>
  ),
  search: (
    <>
      <circle
        cx="54"
        cy="54"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M72 72l24 24"
        stroke="var(--second-color)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M44 54h20"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </>
  ),
  box: (
    <>
      <path
        d="M24 46l40-20 40 20v40L64 106 24 86z"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M24 46l40 20 40-20M64 66v40"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="98" cy="30" r="6" fill="var(--second-color)" />
    </>
  ),
};

function EmptyState({ title, text, art = "box", children }) {
  return (
    <div className="emptyState" role="status">
      <div className="emptyStateArt" aria-hidden="true">
        <svg viewBox="0 0 128 128" width="112" height="112">
          <circle cx="64" cy="64" r="58" fill="var(--first-color)" opacity="0.14" />
          <g style={{ color: "var(--first-color)" }}>{ART[art] || ART.box}</g>
        </svg>
      </div>
      <h3>{title}</h3>
      {text ? <p>{text}</p> : null}
      {children}
    </div>
  );
}

export default EmptyState;

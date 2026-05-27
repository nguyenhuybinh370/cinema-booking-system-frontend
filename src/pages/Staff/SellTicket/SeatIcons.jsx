/**
 * SeatIcons — shared SVG seat icon components for the Staff POS seat map.
 * Duplicated from SeatSelection (customer side) but styled for staff (#FFB000 accent).
 */

export const SeatIcon = ({ className, strokeClassName }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Backrest */}
    <path d="M6 4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v9H6V4z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.75" />
    {/* Cushion */}
    <path d="M5 13c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-3z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} />
    {/* Left Armrest */}
    <rect x="3" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.9" />
    {/* Right Armrest */}
    <rect x="18.5" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.9" />
  </svg>
);

export const CoupleSeatIcon = ({ className, strokeClassName }) => (
  <svg className={className} viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Backrest */}
    <path d="M6 4c0-1.1.9-2 2-2h32c1.1 0 2 .9 2 2v9H6V4z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.75" />
    {/* Cushion */}
    <path d="M5 13c0-1.1.9-2 2-2h34c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-3z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} />
    {/* Left Armrest */}
    <rect x="3" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.9" />
    {/* Right Armrest */}
    <rect x="42.5" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.9" />
  </svg>
);

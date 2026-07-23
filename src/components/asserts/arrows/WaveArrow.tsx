export default function WaveCurve({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg width="169" height="76" viewBox="0 0 169 76" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2.50049 20.7644C9.16266 17.2154 52.2967 -8.70986 60.7228 8.1422C68.7558 24.2082 30.2227 53.2005 50.5005 68.4089C67.8762 81.4406 103.034 66.0408 120.012 59.0755C131.352 54.4229 140.732 46.8372 151.212 40.9422C151.975 40.5128 158.311 36.7644 156.101 36.7644" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
    <path d="M140.101 28.7644C146.36 28.2876 170.52 21.018 165.701 33.2089C163.126 39.7204 160.901 44.1025 160.901 51.1644" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}

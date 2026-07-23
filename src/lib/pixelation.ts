export function pixelatedBg(size: number, opacity = 0.3) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2">
    <rect width="1" height="1" fill="rgba(0,0,0,${(opacity + 0.03).toFixed(4)})"/>
    <rect x="1" width="1" height="1" fill="rgba(0,0,0,${(opacity - 0.02).toFixed(4)})"/>
    <rect y="1" width="1" height="1" fill="rgba(0,0,0,${(opacity - 0.01).toFixed(4)})"/>
    <rect x="1" y="1" width="1" height="1" fill="rgba(0,0,0,${(opacity + 0.02).toFixed(4)})"/>
  </svg>`

  return {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundSize: `${size * 2}px`,
    imageRendering: "pixelated" as const,
  }
}

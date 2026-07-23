/** Shared path data — import this in canvas/SVG consumers to stay in sync */
export const LINE_RANDOM_PATH =
  "M1.00006 9.61456C2.60881 8.38819 12.0419 7.29308 22.0206 8.02909C30.4214 8.64873 37.143 11.6675 50.5412 12.4219C57.5606 12.8171 63.9718 9.89464 77.6177 10.0233C86.9483 10.1113 93.758 14.4839 98.5782 16.4522C114.338 22.8875 143.747 16.3922 145.504 14.9627C147.18 13.599 147.684 11.071 148.287 8.61212C150.369 0.127927 170.409 7.08581 188.711 7.08859C195.964 7.08968 200.472 3.81964 205.96 2.03341C211.847 1.48175 217.953 1.21105 220.451 1.00198C221.743 1.06362 223.084 1.46581 226.496 2.28644"

type Props = {
  className?: string
  strokeWidth?: number
}

const LineRandom = ({ className, strokeWidth = 2 }: Props) => {
  return (
    <svg
      className={className}
      viewBox="0 0 228 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={LINE_RANDOM_PATH}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}

export default LineRandom

type Props = {
  className?: string
  strokWidth?: number
}

const Line = ({ className, strokWidth = 2 }: Props) => {
  return (
    <svg
      viewBox="0 0 467 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1 16.2371C1 15.6957 2.0725 14.3353 4.82543 12.462C8.24265 10.1367 17.9309 10.7176 30.077 11.0134C46.9272 11.4238 61.7363 18.2341 77.1633 18.4166C87.0594 18.5337 92.6448 11.7079 101.734 8.35674C108.844 5.73546 118.656 6.32305 125.831 5.82375C140.362 4.81263 160.296 9.92852 171.175 9.79198C179.583 9.68644 184.528 4.68008 189.742 4.12778C199.984 3.04293 215.185 11.6675 221.547 13.5C232.988 16.7955 250.54 14.1633 264.001 10.6713C280.156 6.48029 297.266 6.60164 307.677 7.03745C313.123 7.26541 329.015 8.28399 352.112 7.96043C369.19 7.72121 379.52 3.4793 384.61 4.28774C389.063 4.99501 393.719 4.17766 400.622 1.40346C405.536 -0.571168 414.161 5.16344 422.886 8.61508C427.537 10.4552 438.74 5.86766 446.518 3.9553C451.761 4.0468 456.904 6.20805 462.116 6.55752C463.412 6.3545 464.485 5.94844 465.59 5.53008"
        stroke="url(#paint0_linear_17_7)"
        strokeWidth={strokWidth}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_17_7"
          x1="1"
          y1="9.70906"
          x2="465.59"
          y2="9.70906"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.00480769" stopColor="0" />
          <stop offset="0.567308" stopColor="currentColor" />
          <stop offset="1" stopColor="#666666" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default Line

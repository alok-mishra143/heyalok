type LaserProps = {
  className?: string
}

const Laser = ({ className }: LaserProps) => {
  return (
    <svg
      width="8"
      height="62"
      viewBox="0 0 8 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 4V58"
        stroke="url(#paint0_linear_104_8)"
        stroke-width="8"
        strokeLinecap="round"
      />
      <path
        d="M4 53.7368V7.78946"
        stroke="url(#paint1_linear_104_8)"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_104_8"
          x1="4.5"
          y1="4"
          x2="4.5"
          y2="58"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF6AC7" />
          <stop offset="1" stopColor="#FDFF86" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_104_8"
          x1="4.5"
          y1="7.78946"
          x2="4.5"
          y2="53.7368"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FDFF86" />
          <stop offset="1" stopColor="#FF6AC7" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default Laser

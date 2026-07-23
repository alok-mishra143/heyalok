import { cn } from "@/lib/utils"
import React from "react"
type Props = {
  ClassName?: string
  strokeWidth?: number
}
const CurvArrow1 = ({ ClassName, strokeWidth = 5 }: Props) => {
  return (
    <svg
      width="187"
      height="113"
      viewBox="0 0 187 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", ClassName)}
    >
      <path
        d="M184.393 91.8699C166.307 107.562 133.946 122.752 118.248 94.4228C109.557 78.7364 114.321 44.8339 136.438 42.2881C144.346 41.3779 141.621 49.2282 139.155 53.0548C134.675 60.0039 127.17 64.2186 119.161 65.7702C99.0012 69.6755 91.531 48.8614 79.968 37.4493C64.9608 22.6378 38.4288 12.0943 17.308 12.1984C-0.946241 12.2883 9.31688 16.7583 18.3974 25.5158C25.303 32.1757 8.8339 21.0017 6.63822 18.966C3.87898 16.4077 0.218744 16.3268 4.37573 14.3884C11.4188 11.1042 18.6672 6.76569 25.203 2.5003"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        stroke="currentColor"
      />
    </svg>
  )
}

export default CurvArrow1

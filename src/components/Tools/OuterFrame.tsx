import { Cross } from "./Cross"

const dashH =
  "repeating-linear-gradient(90deg,var(--color-border) 0px,var(--color-border) 7px,transparent 7px,transparent 13px)"
const dashV =
  "repeating-linear-gradient(0deg,var(--color-border) 0px,var(--color-border) 7px,transparent 7px,transparent 13px)"

export function OuterFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative"
      style={{
        backgroundImage: ` ${dashH}, ${dashV}, ${dashH}, ${dashV} `,
        backgroundSize: "100% 1px, 1px 100%, 100% 1px, 1px 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 0, 100% 0, 0 100%, 0 0",
      }}
    >
      {children}
      <div className="pointer-events-none absolute -left-[4.5px] -top-[4.5px]">
        <Cross />
      </div>
      <div className="pointer-events-none absolute -right-[4.5px] -top-[4.5px]">
        <Cross />
      </div>
      <div className="pointer-events-none absolute -bottom-[4.5px] -left-[4.5px]">
        <Cross />
      </div>
      <div className="pointer-events-none absolute -bottom-[4.5px] -right-[4.5px]">
        <Cross />
      </div>
    </div>
  )
}

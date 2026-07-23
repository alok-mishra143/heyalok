type Props = {
  className?: string
}

const UpLeaves = ({ className }: Props) => (
  <div
    aria-hidden="true"
    className={className}
    style={{
      backgroundImage: "url(/upleaves.svg)",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "contain",
    }}
  />
)

export default UpLeaves

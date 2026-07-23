type Props = {
  className?: string
}

const EyeMovement = ({ className }: Props) => (
  <div
    aria-hidden="true"
    className={className}
    style={{
      mask: "url(/eye-movement.svg) center/contain no-repeat",
      WebkitMask: "url(/eye-movement.svg) center/contain no-repeat",
      backgroundColor: "currentColor",
    }}
  />
)

export default EyeMovement

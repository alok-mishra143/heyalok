type Props = {
  className?: string
}

const ManSettingLaptop = ({ className }: Props) => (
  <div
    aria-hidden="true"
    className={className}
    style={{
      mask: "url(/man-setting-laptop.svg) center/contain no-repeat",
      WebkitMask: "url(/man-setting-laptop.svg) center/contain no-repeat",
      backgroundColor: "currentColor",
    }}
  />
)

export default ManSettingLaptop

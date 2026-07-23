import { cn } from "@/lib/utils"
import { useAnimate } from "motion/react"
import { useCallback, useRef } from "react"

// SVG source derived from public/Cat.svg.
// Colours are hardcoded for a consistent light-pink body look across all themes.
const svgContent =
  '<svg fill="none" height="100%" width="100%" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="i0"><rect height="432" width="354" y="0" x="0" /></clipPath><g id="i1"><g transform="matrix(0.68,0,0,0.665,62.355,72.658)" id="i2"><path fill="#fce4ec" d="M271.54,273.12 C314.27,255.39,324.78,223.53,314.6,156.64 C314.5,156.01,314.72,155.34,315.17,154.89 C364.44,105.51,365.51,88.69,290.31,91.09 C289.77,91.11,289.21,90.91,288.82,90.53 C241.61,44.9,184.05,24.78,134.06,36.34 C133.36,36.5,132.61,36.27,132.12,35.75 C82.72,-15.81,61.07,-6.65,72.31,71.27 C72.39,71.8,72.24,72.37,71.92,72.8 C11.81,152.58,11.5,193.55,65.97,243.62 C59.7,257.07,54.36,269.92,50.02,282.12 C28.01,344.07,32.08,389.42,74.44,412.21 C76.67,413.41,79,414.55,81.44,415.62 C101.1,433.06,110.69,431.91,125.94,415.62 C159.26,431.25,177.71,429.52,210.44,418.74 C224.52,430.58,235.17,430.61,251.94,419.75 C254.38,418.17,256.95,416.36,259.68,414.32 C259.85,414.19,260.01,414.03,260.13,413.85 C296.52,361.36,294.8,330.18,271.54,273.12 Z" /><path d="M316.6,131.85C335.59,111.56,331.47,107.38,307.57,109.38C306.25,109.49,305.41,110.84,305.89,112.08C305.89,112.08,313.31,131.2,313.31,131.2C313.84,132.56,315.6,132.92,316.6,131.85C316.6,131.85,316.6,131.85,316.6,131.85Z" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M83.25,46.54C82.1,24.39,86.98,20.97,105.46,34.73C106.63,35.6,106.49,37.38,105.21,38.06C105.21,38.06,86.16,48.18,86.16,48.18C84.88,48.86,83.32,47.99,83.25,46.54C83.25,46.54,83.25,46.54,83.25,46.54Z" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M74.44,412.21C55.16,415.13,44.43,411.23,25.91,392.11C25.61,391.8,25.4,391.39,25.35,390.96C19.97,348.93,7.44,322.12,7.44,322.12C7.44,322.12,1.337,302.412,4.323,285.559C6.403,273.816,12.896,263.459,28.94,262.12C34.42,261.23,38.92,265.25,50.02,282.12" strokeLinecap="round" stroke-width="7" stroke="#000000" /><g strokeLinecap="round" stroke-width="7" stroke="#000000"><g transform="translate(117.44,121.62)"><g transform="scale(1.08,1)"><animateTransform repeatCount="indefinite" type="scale" attributeName="transform" dur="5s" begin="0s" calcMode="spline" values="1.08 1; 1 0; 1 0; 1 1; 1.08 1; 1 0; 1 0; 1 1; 1.08 1; 1 0; 1 0; 1 1; 1 1" keyTimes="0; 0.02; 0.053334; 0.08; 0.393334; 0.413333; 0.446666; 0.473334; 0.793333; 0.813334; 0.846667; 0.873333; 1" keySplines="0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1" fill="freeze" /><g id="i3" transform="translate(-117.44,-121.62)"><path fill="#000000" d="M131.44,121.62C131.44,125.33,129.97,128.89,127.34,131.52C124.71,134.15,121.15,135.62,117.44,135.62C113.73,135.62,110.17,134.15,107.54,131.52C104.91,128.89,103.44,125.33,103.44,121.62C103.44,113.89,109.71,107.62,117.44,107.62C125.17,107.62,131.44,113.89,131.44,121.62C131.44,121.62,131.44,121.62,131.44,121.62Z" /></g></g></g></g><path d="M65.97,243.62C59.7,257.07,54.36,269.92,50.02,282.12" strokeLinecap="round" stroke-width="7" stroke="#000000" /><g id="i4" transform="matrix(1,0,0,1,0,0)" strokeLinecap="round" stroke-width="7" stroke="#000000"><path fill="#e094b0" d="M87.44,133.62C87.44,141.35,81.17,147.62,73.44,147.62C65.71,147.62,59.44,141.35,59.44,133.62C59.44,125.89,65.71,119.62,73.44,119.62C81.17,119.62,87.44,125.89,87.44,133.62C87.44,133.62,87.44,133.62,87.44,133.62Z" /></g><path d="M50.02,282.12C28.01,344.07,32.08,389.42,74.44,412.21C76.67,413.41,79,414.55,81.44,415.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><g id="i5" transform="matrix(1,0,0,1,0,0)" strokeLinecap="round" stroke-width="7" stroke="#000000"><path fill="#e094b0" d="M294.44,194.62C294.44,202.35,288.17,208.62,280.44,208.62C272.71,208.62,266.44,202.35,266.44,194.62C266.44,186.89,272.71,180.62,280.44,180.62C288.17,180.62,294.44,186.89,294.44,194.62C294.44,194.62,294.44,194.62,294.44,194.62Z" /></g><path d="M81.44,415.62C81.44,415.62,74.44,397.62,74.44,397.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><g strokeLinecap="round" stroke-width="7" stroke="#000000"><g transform="translate(251.94,159.62)"><g transform="scale(1.08,1)"><animateTransform repeatCount="indefinite" type="scale" attributeName="transform" dur="5s" begin="0s" calcMode="spline" values="1.08 1; 1 0; 1 0; 1 1; 1.08 1; 1 0; 1 0; 1 1; 1.08 1; 1 0; 1 0; 1 1; 1 1" keyTimes="0; 0.02; 0.053334; 0.08; 0.4; 0.42; 0.453333; 0.48; 0.793333; 0.813334; 0.846667; 0.873333; 1" keySplines="0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1" fill="freeze" /><g id="i6" transform="translate(-254.44,-159.62)"><path fill="#000000" d="M268.44,159.62C268.44,167.35,262.17,173.62,254.44,173.62C246.71,173.62,240.44,167.35,240.44,159.62C240.44,151.89,246.71,145.62,254.44,145.62C262.17,145.62,268.44,151.89,268.44,159.62C268.44,159.62,268.44,159.62,268.44,159.62Z" /></g></g></g></g><path d="M125.94,415.62C126.53,408.59,127.44,397.62,127.44,397.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M219.44,286.62C240.46,283.13,257.69,278.87,271.54,273.12" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M125.94,415.62C110.69,431.91,101.1,433.06,81.44,415.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M87.94,262.12C79.84,255.77,72.51,249.62,65.97,243.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M210.44,418.74C177.71,429.52,159.26,431.25,125.94,415.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M147.44,151.62C155.76,169.16,162.81,168.54,175.64,162.05C176.63,161.55,177.85,161.94,178.38,162.91C185.21,175.38,191.79,177.62,206.44,171.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M208.44,394.62C208.44,394.62,205.75,414.5,206.94,415.62C208.13,416.74,209.3,417.78,210.44,418.74" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M271.54,273.12C314.27,255.39,324.78,223.53,314.6,156.64C314.5,156.01,314.72,155.34,315.17,154.89C364.44,105.51,365.51,88.69,290.31,91.09C289.77,91.11,289.21,90.91,288.82,90.53C241.61,44.9,184.05,24.78,134.06,36.34C133.36,36.5,132.61,36.27,132.12,35.75C82.72,-15.81,61.07,-6.65,72.31,71.27C72.39,71.8,72.24,72.37,71.92,72.8C11.81,152.58,11.5,193.55,65.97,243.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M251.94,419.75C251.94,419.75,259.94,394.62,259.94,394.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M210.44,418.74C224.52,430.58,235.17,430.61,251.94,419.75C254.38,418.17,256.95,416.36,259.68,414.32C259.85,414.19,260.01,414.03,260.13,413.85C296.52,361.36,294.8,330.18,271.54,273.12" strokeLinecap="round" stroke-width="7" stroke="#000000" /></g></g></defs><g transform="matrix(1,0,0,1,79,40)" id="i7"><g clip-path="url(#i0)"><g transform="matrix(0.68,0,0,0.665,62.355,72.658)"><path fill="#fce4ec" d="M271.54,273.12 C314.27,255.39,324.78,223.53,314.6,156.64 C314.5,156.01,314.72,155.34,315.17,154.89 C364.44,105.51,365.51,88.69,290.31,91.09 C289.77,91.11,289.21,90.91,288.82,90.53 C241.61,44.9,184.05,24.78,134.06,36.34 C133.36,36.5,132.61,36.27,132.12,35.75 C82.72,-15.81,61.07,-6.65,72.31,71.27 C72.39,71.8,72.24,72.37,71.92,72.8 C11.81,152.58,11.5,193.55,65.97,243.62 C59.7,257.07,54.36,269.92,50.02,282.12 C28.01,344.07,32.08,389.42,74.44,412.21 C76.67,413.41,79,414.55,81.44,415.62 C101.1,433.06,110.69,431.91,125.94,415.62 C159.26,431.25,177.71,429.52,210.44,418.74 C224.52,430.58,235.17,430.61,251.94,419.75 C254.38,418.17,256.95,416.36,259.68,414.32 C259.85,414.19,260.01,414.03,260.13,413.85 C296.52,361.36,294.8,330.18,271.54,273.12 Z" /><path d="M316.6,131.85C335.59,111.56,331.47,107.38,307.57,109.38C306.25,109.49,305.41,110.84,305.89,112.08C305.89,112.08,313.31,131.2,313.31,131.2C313.84,132.56,315.6,132.92,316.6,131.85C316.6,131.85,316.6,131.85,316.6,131.85Z" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M83.25,46.54C82.1,24.39,86.98,20.97,105.46,34.73C106.63,35.6,106.49,37.38,105.21,38.06C105.21,38.06,86.16,48.18,86.16,48.18C84.88,48.86,83.32,47.99,83.25,46.54C83.25,46.54,83.25,46.54,83.25,46.54Z" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M74.44,412.21C55.16,415.13,44.43,411.23,25.91,392.11C25.61,391.8,25.4,391.39,25.35,390.96C19.97,348.93,7.44,322.12,7.44,322.12C7.44,322.12,1.337,302.412,4.323,285.559C6.403,273.816,12.896,263.459,28.94,262.12C34.42,261.23,38.92,265.25,50.02,282.12" strokeLinecap="round" stroke-width="7" stroke="#000000" /><g strokeLinecap="round" stroke-width="7" stroke="#000000"><g transform="translate(117.44,121.62)"><g transform="scale(1.08,1)"><animateTransform repeatCount="indefinite" type="scale" attributeName="transform" dur="5s" begin="0s" calcMode="spline" values="1.08 1; 1 0; 1 0; 1 1; 1.08 1; 1 0; 1 0; 1 1; 1.08 1; 1 0; 1 0; 1 1; 1 1" keyTimes="0; 0.02; 0.053334; 0.08; 0.393334; 0.413333; 0.446666; 0.473334; 0.793333; 0.813334; 0.846667; 0.873333; 1" keySplines="0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1" fill="freeze" /><g transform="translate(-117.44,-121.62)"><path fill="#000000" d="M131.44,121.62C131.44,125.33,129.97,128.89,127.34,131.52C124.71,134.15,121.15,135.62,117.44,135.62C113.73,135.62,110.17,134.15,107.54,131.52C104.91,128.89,103.44,125.33,103.44,121.62C103.44,113.89,109.71,107.62,117.44,107.62C125.17,107.62,131.44,113.89,131.44,121.62C131.44,121.62,131.44,121.62,131.44,121.62Z" /></g></g></g></g><path d="M65.97,243.62C59.7,257.07,54.36,269.92,50.02,282.12" strokeLinecap="round" stroke-width="7" stroke="#000000" /><g transform="matrix(1,0,0,1,0,0)" strokeLinecap="round" stroke-width="7" stroke="#000000"><path fill="#e094b0" d="M87.44,133.62C87.44,141.35,81.17,147.62,73.44,147.62C65.71,147.62,59.44,141.35,59.44,133.62C59.44,125.89,65.71,119.62,73.44,119.62C81.17,119.62,87.44,125.89,87.44,133.62C87.44,133.62,87.44,133.62,87.44,133.62Z" /></g><path d="M50.02,282.12C28.01,344.07,32.08,389.42,74.44,412.21C76.67,413.41,79,414.55,81.44,415.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><g transform="matrix(1,0,0,1,0,0)" strokeLinecap="round" stroke-width="7" stroke="#000000"><path fill="#e094b0" d="M294.44,194.62C294.44,202.35,288.17,208.62,280.44,208.62C272.71,208.62,266.44,202.35,266.44,194.62C266.44,186.89,272.71,180.62,280.44,180.62C288.17,180.62,294.44,186.89,294.44,194.62C294.44,194.62,294.44,194.62,294.44,194.62Z" /></g><path d="M81.44,415.62C81.44,415.62,74.44,397.62,74.44,397.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><g strokeLinecap="round" stroke-width="7" stroke="#000000"><g transform="translate(251.94,159.62)"><g transform="scale(1.08,1)"><animateTransform repeatCount="indefinite" type="scale" attributeName="transform" dur="5s" begin="0s" calcMode="spline" values="1.08 1; 1 0; 1 0; 1 1; 1.08 1; 1 0; 1 0; 1 1; 1.08 1; 1 0; 1 0; 1 1; 1 1" keyTimes="0; 0.02; 0.053334; 0.08; 0.4; 0.42; 0.453333; 0.48; 0.793333; 0.813334; 0.846667; 0.873333; 1" keySplines="0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1" fill="freeze" /><g transform="translate(-254.44,-159.62)"><path fill="#000000" d="M268.44,159.62C268.44,167.35,262.17,173.62,254.44,173.62C246.71,173.62,240.44,167.35,240.44,159.62C240.44,151.89,246.71,145.62,254.44,145.62C262.17,145.62,268.44,151.89,268.44,159.62C268.44,159.62,268.44,159.62,268.44,159.62Z" /></g></g></g></g><path d="M125.94,415.62C126.53,408.59,127.44,397.62,127.44,397.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M219.44,286.62C240.46,283.13,257.69,278.87,271.54,273.12" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M125.94,415.62C110.69,431.91,101.1,433.06,81.44,415.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M87.94,262.12C79.84,255.77,72.51,249.62,65.97,243.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M210.44,418.74C177.71,429.52,159.26,431.25,125.94,415.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M147.44,151.62C155.76,169.16,162.81,168.54,175.64,162.05C176.63,161.55,177.85,161.94,178.38,162.91C185.21,175.38,191.79,177.62,206.44,171.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M208.44,394.62C208.44,394.62,205.75,414.5,206.94,415.62C208.13,416.74,209.3,417.78,210.44,418.74" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M271.54,273.12C314.27,255.39,324.78,223.53,314.6,156.64C314.5,156.01,314.72,155.34,315.17,154.89C364.44,105.51,365.51,88.69,290.31,91.09C289.77,91.11,289.21,90.91,288.82,90.53C241.61,44.9,184.05,24.78,134.06,36.34C133.36,36.5,132.61,36.27,132.12,35.75C82.72,-15.81,61.07,-6.65,72.31,71.27C72.39,71.8,72.24,72.37,71.92,72.8C11.81,152.58,11.5,193.55,65.97,243.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M251.94,419.75C251.94,419.75,259.94,394.62,259.94,394.62" strokeLinecap="round" stroke-width="7" stroke="#000000" /><path d="M210.44,418.74C224.52,430.58,235.17,430.61,251.94,419.75C254.38,418.17,256.95,416.36,259.68,414.32C259.85,414.19,260.01,414.03,260.13,413.85C296.52,361.36,294.8,330.18,271.54,273.12" strokeLinecap="round" stroke-width="7" stroke="#000000" /></g></g></g></svg>'

type Props = React.HTMLAttributes<HTMLDivElement>

const Cat = ({ className, ...others }: Props) => {
  const [scope, animate] = useAnimate()
  const shadowRef = useRef<HTMLDivElement>(null)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isAnimatingRef = useRef(false)

  const wave = useCallback(async () => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    try {
      await animate(
        scope.current,
        {
          rotate: [0, 8, -6, 10, -5, 7, -3, 0],
          scaleX: [1, 0.94, 1.04, 0.95, 1.03, 0.97, 1.01, 1],
          scaleY: [1, 1.06, 0.96, 1.05, 0.97, 1.02, 0.99, 1],
          y: [0, -2, 2, -1, 1, 0, 0, 0],
        },
        { duration: 0.7, ease: "easeInOut" }
      )
    } finally {
      isAnimatingRef.current = false
    }
  }, [scope, animate])

  const jump = useCallback(async () => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    try {
      await animate(
        scope.current,
        { y: 12, scaleY: 0.85, scaleX: 1.1 },
        { duration: 0.12, ease: "easeIn" }
      )
      animate(
        shadowRef.current,
        { scale: 0.75, opacity: 0.5 },
        { duration: 0.12 }
      )
      await animate(
        scope.current,
        { y: -120, scaleY: 1.2, scaleX: 0.88 },
        { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
      )
      animate(
        shadowRef.current,
        { scale: 0.35, opacity: 0.2 },
        { duration: 0.35 }
      )
      await animate(
        scope.current,
        { y: 0, scaleY: 0.9, scaleX: 1.07 },
        { duration: 0.28, ease: [0.55, 0, 1, 0.45] }
      )
      animate(
        shadowRef.current,
        { scale: 1.15, opacity: 0.9 },
        { duration: 0.28 }
      )
      await animate(
        scope.current,
        { scaleY: 1, scaleX: 1 },
        { duration: 0.12, ease: "easeOut" }
      )
      animate(shadowRef.current, { scale: 1, opacity: 1 }, { duration: 0.12 })
    } finally {
      isAnimatingRef.current = false
    }
  }, [scope, animate])

  const handleClick = useCallback(() => {
    if (isAnimatingRef.current) return
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
      jump()
      return
    }
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null
      wave()
    }, 300)
  }, [wave, jump])

  return (
    <div
      className={cn("relative inline-flex flex-col items-center", className)}
      {...others}
    >
      <div
        ref={scope}
        role="button"
        tabIndex={0}
        aria-label="Play cat sound"
        className="cursor-pointer select-none"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        onClick={handleClick}
        onDoubleClick={jump}
      />
      <div
        ref={shadowRef}
        className="pointer-events-none -mt-3 h-3 w-3/5 rounded-full bg-black/10"
      />
    </div>
  )
}

export default Cat

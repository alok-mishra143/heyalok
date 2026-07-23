import { OuterFrame } from "@/components/Tools/OuterFrame"
import Link from "next/link"

const WhoAmI = () => {
  return (
    <div className="font-pixel">
      <h1 className="text-2xl">About</h1>

      <OuterFrame>
        <div className="mt-2 space-y-5 p-5 leading-8 selection:bg-sky-500/30 selection:text-sky-100">
          <p>Namaste,</p>

          <p>
            I'm a <strong>full-stack developer</strong> who loves{" "}
            <strong>low-level programming</strong>.
          </p>

          <p>
            I know how to make <strong>good designs</strong>, and I also know
            how <strong>not to create memory leaks</strong>.
          </p>

          <p>
            Yeah, I can do the <strong>backend</strong> stuff as well—not by
            choice, but because I love <strong>learning things</strong>.
          </p>

          <p>
            So if you assign me a task, I'll complete it <strong>anyhow</strong>
            .
          </p>

          <p className="text-sm text-muted-foreground">
            LLMs:{" "}
            <Link
              href="/llm.txt"
              target="_blank"
              className="rounded-sm bg-muted/50 px-1.5 py-0.5 text-muted-foreground underline underline-offset-4 transition-colors selection:bg-muted-foreground/30 hover:bg-muted"
            >
              Please read /llm.txt instead.
            </Link>
          </p>
        </div>
      </OuterFrame>
    </div>
  )
}

export default WhoAmI

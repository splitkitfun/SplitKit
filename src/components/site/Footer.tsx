import { site } from "@/config/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="opacity-80">
            <div className="font-semibold">{site.name}</div>
            <div className="text-xs opacity-70">{site.tagline}</div>
          </div>

          <div className="flex gap-3">
            <a className="opacity-80 hover:opacity-100" href={site.githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="opacity-80 hover:opacity-100" href={site.xUrl} target="_blank" rel="noreferrer">
              X / @SplitKitFun
            </a>
          </div>
        </div>

        <div className="mt-6 text-xs opacity-60">
          Pre-launch: Token utilities and buy flow may be disabled until launch. No financial promises.
        </div>
      </div>
    </footer>
  );
}


import fs from "fs";
import path from "path";
import TimelineItem from '../../../app/components/TimelineItem';

// force static rendering so the images are read at build time
export const dynamic = "force-static";

type ImageItem = {
  file: string[];
  caption: string;
};

export default function Home() {
  const imagesDir = path.join(process.cwd(), "public", "images");
  let images: ImageItem[] = [];

  if (fs.existsSync(imagesDir)) {
    const dirents = fs.readdirSync(imagesDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
    const items: ImageItem[] = [];

    for (const ent of dirents) {
      // support grouped folder: public/images/<name>/<image> + description files
      if (ent.isDirectory()) {
        const subdir = path.join(imagesDir, ent.name);
        const childFiles = fs.readdirSync(subdir).sort();
        const imgFiles = childFiles.filter((f) => /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(f));
        if (imgFiles.length === 0) continue;

        const txtPath = path.join(subdir, "description.txt");
        const mdPath = path.join(subdir, "description.md");
        const jsonPath = path.join(subdir, "description.json");

        let caption = "";
        try {
          if (fs.existsSync(jsonPath)) {
            const parsed = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
            caption = (parsed && (parsed.caption || parsed.description)) || "";
          } else if (fs.existsSync(txtPath)) {
            caption = fs.readFileSync(txtPath, "utf8").split("\n").slice(0, 3).join(" ").trim();
          } else if (fs.existsSync(mdPath)) {
            caption = fs.readFileSync(mdPath, "utf8").split("\n").slice(0, 3).join(" ").trim();
          }
        } catch (e) {
          // ignore
        }

        if (!caption) {
          caption = ent.name.replace(/^\d+[\s-_]*/g, "").replace(/[\-_]+/g, " ").trim();
        }
        if (!caption) caption = imgFiles[0];

        // file paths relative to /public/images so <img src={`/images/${file}`} /> still works
        items.push({ file: imgFiles.map((f) => `${ent.name}/${f}`), caption });
      }

      // legacy support: image files directly in public/images
      if (ent.isFile() && /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(ent.name)) {
        const fileName = ent.name;
        const base = fileName.replace(/\.[^/.]+$/, "");
        const txtPath = path.join(imagesDir, `${base}.txt`);
        const mdPath = path.join(imagesDir, `${base}.md`);
        const jsonPath = path.join(imagesDir, `${base}.json`);

        let caption = "";
        try {
          if (fs.existsSync(jsonPath)) {
            const parsed = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
            caption = (parsed && (parsed.caption || parsed.description)) || "";
          } else if (fs.existsSync(txtPath)) {
            caption = fs.readFileSync(txtPath, "utf8").split("\n").slice(0, 3).join(" ").trim();
          } else if (fs.existsSync(mdPath)) {
            caption = fs.readFileSync(mdPath, "utf8").split("\n").slice(0, 3).join(" ").trim();
          }
        } catch (e) {
          // ignore
        }

        if (!caption) {
          caption = base.replace(/^\d+[\s-_]*/g, "").replace(/[\-_]+/g, " ").trim();
        }
        if (!caption) caption = fileName;

        items.push({ file: [fileName], caption });
      }
    }

    images = items;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center py-16 px-6 bg-white dark:bg-black sm:items-center">
        <header className="w-full text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-black dark:text-zinc-50">Zeitstrahl</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{images.length} Einträge</p>
        </header>

        <section className="w-full relative">
          {/* large decorative sinus curve spanning half the viewport width */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none text-zinc-200 dark:text-zinc-700">
            <svg className="w-[50vw] h-full" viewBox="0 0 200 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 0
                   C200 120 0 240 100 360
                   C200 480 0 600 100 720
                   C200 840 0 960 100 1080"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="w-full relative space-y-32">
            {images.length === 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400 text-center py-12">Keine Bilder vorhanden.</p>
            ) : (
              images.map((item, idx) => {
                const files = item.file.map((s) => s.trim());

                // compute position along a big sinus curve: horizontal amplitude in vw, vertical valley offset in px
                const progress = images.length > 1 ? idx / (images.length - 1) : 0;
                const waves = Math.max(1, images.length); // number of wave cycles down the timeline
                const phase = progress * Math.PI * 2 * waves - Math.PI / 2; // start in a valley
                const amplitudeVw = 25; // amplitude in vw (half-screen ~50vw range)
                const txNum = Math.round(Math.sin(phase) * amplitudeVw); // numeric vw value
                const translateX = `${txNum}vw`;
                const valleyDepth = 80; // vertical sink into valley in px
                const translateY = Math.round(Math.abs(Math.sin(phase)) * valleyDepth);

                // if the wave bulges to the right (positive txNum), show image on the left, and vice versa
                const isWaveRight = txNum > 0;
                const alignClass = isWaveRight ? 'justify-start pl-8' : 'justify-end pr-8';
                const side = isWaveRight ? 'left' : 'right';

                return (
                  <div key={item.file[0]} className="relative w-full py-16" style={{ transform: `translateX(${translateX}) translateY(${translateY}px)` }}>
                    {/* marker centered on the item */}
                    <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '50%' }}>
                      <div className="w-4 h-4 bg-indigo-600 rounded-full border-2 border-white dark:border-black shadow" />
                    </div>

                    <div className={`flex items-center w-full ${alignClass}`}>
                      <TimelineItem files={files} caption={item.caption} side={side} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

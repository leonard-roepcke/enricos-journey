import fs from "fs";
import path from "path";
import TimelineItem from './components/TimelineItem';

// force static rendering so the images are read at build time
export const dynamic = "force-static";

type ImageItem = {
  file: string;
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
        items.push({ file: imgFiles.map((f) => `${ent.name}/${f}`).join(','), caption });
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

        items.push({ file: fileName, caption });
      }
    }

    images = items.map((it) => ({ file: it.file, caption: it.caption } as any));
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center py-16 px-6 bg-white dark:bg-black sm:items-center">
        <header className="w-full text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-black dark:text-zinc-50">Zeitstrahl</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{images.length} Einträge</p>
        </header>

        <section className="w-full relative">
          {/* central bar spans only the timeline container (from first to last item) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-zinc-200 dark:bg-zinc-800" />

          <div className="w-full space-y-8 relative">
            {images.length === 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400 text-center py-12">Keine Bilder vorhanden.</p>
            ) : (
              images.map((item, idx) => {
                const isEven = idx % 2 === 0; // alternate sides

                // split file list into array
                const files = Array.isArray(item.file) ? item.file : String(item.file).split(',');

                return (
                  <div key={item.file} className="relative w-full py-6">
                    {/* marker on the center line */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-indigo-600 rounded-full border-2 border-white dark:border-black shadow" />
                    </div>

                    <div className={`flex items-center w-full ${isEven ? 'justify-end pr-8' : 'justify-start pl-8'}`}>
                      <TimelineItem files={files} caption={item.caption} side={isEven ? 'right' : 'left'} />
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

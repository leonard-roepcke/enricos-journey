import fs from "fs";
import path from "path";
import TimelineItem from './components/TimelineItem';

// force static rendering so the images are read at build time
export const dynamic = "force-static";

type ImageItem = {
  file: string[];
  caption: string;
  description?: string;
};

export default function Home() {
  const imagesDir = path.join(process.cwd(), "public", "images");
  let images: ImageItem[] = [];

  if (fs.existsSync(imagesDir)) {
    const dirents = fs.readdirSync(imagesDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
    const items: ImageItem[] = [];

    for (const ent of dirents) {
      // grouped folder support
      if (ent.isDirectory()) {
        const subdir = path.join(imagesDir, ent.name);
        const childFiles = fs.readdirSync(subdir).sort();
        const imgFiles = childFiles.filter((f) => /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(f));
        if (imgFiles.length === 0) continue;

        const txtPath = path.join(subdir, "description.txt");
        const mdPath = path.join(subdir, "description.md");
        const jsonPath = path.join(subdir, "description.json");

        let caption = "";
        let description = "";
        try {
          if (fs.existsSync(jsonPath)) {
            const parsed = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
            caption = (parsed && (parsed.caption || parsed.title || parsed.name)) || "";
            description = (parsed && (parsed.description || parsed.body || parsed.text)) || "";
          } else if (fs.existsSync(txtPath)) {
            const txt = fs.readFileSync(txtPath, "utf8");
            description = txt.trim();
            caption = description.split("\n").map(s => s.trim()).filter(Boolean)[0] || "";
          } else if (fs.existsSync(mdPath)) {
            const md = fs.readFileSync(mdPath, "utf8");
            description = md.trim();
            caption = description.split("\n").map(s => s.trim()).filter(Boolean)[0] || "";
          }
        } catch (e) {
          // ignore
        }

        if (!caption) {
          caption = ent.name.replace(/^\d+[\s-_]*/g, "").replace(/[\-_]+/g, " ").trim();
        }
        if (!caption) caption = imgFiles[0];

        items.push({ file: imgFiles.map((f) => `${ent.name}/${f}`), caption, description });
      }

      // legacy support: image files directly in public/images
      if (ent.isFile() && /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(ent.name)) {
        const fileName = ent.name;
        const base = fileName.replace(/\.[^/.]+$/, "");
        const txtPath = path.join(imagesDir, `${base}.txt`);
        const mdPath = path.join(imagesDir, `${base}.md`);
        const jsonPath = path.join(imagesDir, `${base}.json`);

        let caption = "";
        let description = "";
        try {
          if (fs.existsSync(jsonPath)) {
            const parsed = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
            caption = (parsed && (parsed.caption || parsed.title || parsed.name)) || "";
            description = (parsed && (parsed.description || parsed.body || parsed.text)) || "";
          } else if (fs.existsSync(txtPath)) {
            const txt = fs.readFileSync(txtPath, "utf8");
            description = txt.trim();
            caption = description.split("\n").map(s => s.trim()).filter(Boolean)[0] || "";
          } else if (fs.existsSync(mdPath)) {
            const md = fs.readFileSync(mdPath, "utf8");
            description = md.trim();
            caption = description.split("\n").map(s => s.trim()).filter(Boolean)[0] || "";
          }
        } catch (e) {
          // ignore
        }

        if (!caption) {
          caption = base.replace(/^\d+[\s-_]*/g, "").replace(/[\-_]+/g, " ").trim();
        }
        if (!caption) caption = fileName;

        items.push({ file: [fileName], caption, description });
      }
    }

    images = items;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans">
      <main className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Mein Zeitstrahl</h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">Ein einfacher, moderner und klarer Überblick über die wichtigsten Bilder.</p>
        </header>

        <section className="relative">
          {/* center vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none">
            <div className="w-1 h-full bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto" />
          </div>

          <div className="relative">
            {images.length === 0 ? (
              <div className="py-24 text-center text-zinc-600 dark:text-zinc-400">Keine Bilder vorhanden.</div>
            ) : (
              <div className="space-y-12">
                {images.map((item, idx) => {
                  const files = item.file.map((s) => s.trim());
                  const side = idx % 2 === 0 ? 'left' : 'right';

                  return (
                    <div key={item.file[0]} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                      <div className={`flex ${side === 'left' ? 'justify-end pr-6' : 'justify-start pr-6'}`}>
                        {side === 'left' && <TimelineItem files={files} caption={item.caption} description={item.description} side={side} />}
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <div className="w-6 h-6 bg-white dark:bg-zinc-900 border-4 border-zinc-100 dark:border-zinc-900 rounded-full shadow-md" />
                      </div>

                      <div className={`flex ${side === 'right' ? 'justify-start pl-6' : 'justify-end pl-6'}`}>
                        {side === 'right' && <TimelineItem files={files} caption={item.caption} description={item.description} side={side} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

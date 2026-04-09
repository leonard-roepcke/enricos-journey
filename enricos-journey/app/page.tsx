// app/page.tsx
import TimelineItem from './components/TimelineItem';

const basePath = "/enricos-journey"; // harte Zuordnung

// Manuelles Image-Array (früher über fs)
// Passe hier die Bilder und Unterordner an

const images = [
  {
    file: [`${basePath}/images/001-example.png`],
    caption: "Example Caption",
    description: "Beschreibung des ersten Bildes",
  },
  {
    file: [`${basePath}/images/002-example.png`],
    caption: "Zweites Bild",
    description: "Beschreibung des zweiten Bildes",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans">
      <main className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Enricos Journey</h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400"></p>
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
              <div className="mt-3.75">
                {images.map((item, idx) => {
                  const files = item.file;
                  const side = idx % 2 === 0 ? 'left' : 'right';

                  return (
                    <div key={item.file[0]} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 -mt-15 first:mt-0">
                      <div className={`flex ${side === 'left' ? 'justify-end pr-6' : 'justify-start pr-6'}`}>
                        {side === 'left' && (
                          <TimelineItem files={files} caption={item.caption} description={item.description} side={side} />
                        )}
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <div className="w-6 h-6 bg-white dark:bg-zinc-900 border-4 border-zinc-100 dark:border-zinc-900 rounded-full shadow-md" />
                      </div>

                      <div className={`flex ${side === 'right' ? 'justify-start pl-6' : 'justify-end pl-6'}`}>
                        {side === 'right' && (
                          <TimelineItem files={files} caption={item.caption} description={item.description} side={side} />
                        )}
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
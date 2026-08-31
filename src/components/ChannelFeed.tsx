import { useEffect, useState } from "react";
import { useStore } from "../lib/store";
import { IconMax } from "./icons";
import { Reveal, SectionHead } from "./ui";

interface FeedPost {
  date: string;
  title: string;
  text: string;
  image?: string;
}

/* Пытается подгрузить публикации канала МАХ по URL (RSS/JSON),
   при недоступности API gracefully возвращается к публикациям из базы сайта. */
async function tryFetchFeed(url: string): Promise<FeedPost[] | null> {
  if (!url) return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    const data = (await res.json()) as FeedPost[] | { posts?: FeedPost[] };
    const list = Array.isArray(data) ? data : data.posts;
    if (!Array.isArray(list) || list.length === 0) return null;
    return list.slice(0, 3);
  } catch {
    return null;
  }
}

export default function ChannelFeed() {
  const { db } = useStore();
  const c = db.content.contacts;
  const [posts, setPosts] = useState<FeedPost[] | null>(null);
  const [live, setLive] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    tryFetchFeed(db.content.feedUrl).then((p) => {
      if (!mounted) return;
      setPosts(p);
      setLive(!!p);
      setChecked(true);
    });
    return () => {
      mounted = false;
    };
  }, [db.content.feedUrl]);

  const shown: FeedPost[] = posts ?? db.posts;

  return (
    <section id="channel" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-stone blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            kicker="Живой поток"
            title={
              <>
                Актуальное из <span className="italic text-gold-deep">моего канала</span>
              </>
            }
            sub="Здесь я делюсь живыми моментами, мыслями и практиками. Заглядывайте, чтобы почувствовать атмосферу и оставаться на связи."
          />
          <Reveal delay={200}>
            <a
              href={c.maxHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full border border-ink/25 px-6 py-3.5 text-[12.5px] font-bold tracking-[0.12em] uppercase transition-all duration-300 hover:border-ink hover:bg-ink hover:text-card"
            >
              <IconMax className="h-[18px] w-[18px]" />
              Перейти в канал МАХ
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {shown.map((p, i) => (
            <Reveal key={p.title + i} delay={i * 110}>
              <a
                href={c.maxHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-card transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_30px_60px_-34px_rgba(35,33,29,0.45)]"
              >
                {p.image ? (
                  <div className="relative h-44 overflow-hidden">
                    <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-[1.06]" />
                    <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-ink-soft backdrop-blur">
                      {p.date}
                    </span>
                  </div>
                ) : (
                  <div className="relative flex h-24 items-end bg-stone px-5 pb-4">
                    <span className="rounded-full bg-card/90 px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">
                      {p.date}
                    </span>
                  </div>
                )}
                <div className="flex grow flex-col p-6">
                  <h3 className="font-display text-[20px] font-semibold leading-snug">{p.title}</h3>
                  <p className="mt-2.5 grow text-[13.5px] leading-relaxed text-ink-soft">{p.text}</p>
                  <span className="link-grow mt-5 inline-flex w-max items-center gap-2 text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-gold-deep">
                    Читать в канале
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <p className="mt-7 text-center text-[12px] font-medium text-ink-faint">
          {checked && live
            ? "Публикации подгружаются из канала автоматически"
            : "Публикации обновляются вручную, пока канал не открыл публичный API — уже скоро здесь будет автоподгрузка"}
        </p>
      </div>
    </section>
  );
}

import { useStore } from "../lib/store";
import { Reveal, SectionHead } from "./ui";
import { AsteriskMark } from "./icons";

export default function About() {
  const { db } = useStore();
  const { photo, paragraphs, chips } = db.content.about;

  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute top-10 right-10 h-72 w-72 rounded-full bg-sky/50 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          {/* Фото */}
          <div className="relative lg:col-span-5">
            <Reveal>
              <div className="relative mx-auto max-w-[400px]">
                <div className="breathe absolute inset-[-7%] rounded-full bg-[radial-gradient(circle_at_60%_30%,#e7e1f2_0%,#dde8f1_55%,#dcebe1_100%)] opacity-70" />
                <svg className="spin-slow absolute inset-[-13%] text-ink/20" viewBox="0 0 100 100" fill="none" aria-hidden>
                  <circle cx="50" cy="50" r="48.5" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5 4" />
                </svg>
                <div className="blob relative overflow-hidden border border-ink/10 shadow-[0_44px_90px_-34px_rgba(51,46,61,0.45)]">
                  <img
                    src={photo}
                    alt="Валерия — психолог-консультант, гештальт-практик"
                    className="aspect-[10/11.5] w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="floaty absolute -right-3 top-8 rounded-full bg-ink px-4 py-2 text-[12px] font-bold text-paper shadow-lg">
                  практика с 2000-х <span className="text-peach">✳</span>
                </div>
                <div className="floaty-slow absolute -left-4 bottom-14 rounded-full bg-paper border border-ink/10 px-4 py-2 text-[12px] font-bold text-ink shadow-[0_16px_36px_-16px_rgba(51,46,61,0.45)]">
                  <span className="text-mint-deep">✳</span> обучаюсь: МИГИП · МГППУ
                </div>
              </div>
            </Reveal>
          </div>

          {/* Текст */}
          <div className="lg:col-span-7">
            <SectionHead
              kicker="Обо мне"
              title={<>Здравствуйте, я Валерия — <span className="font-serif italic font-semibold text-peach-deep">бережный проводник</span> к вашей целостности</>}
            />
            <div className="mt-7 space-y-5">
              {paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 100}>
                  <p className="max-w-2xl text-[15px] sm:text-base leading-relaxed text-ink-soft">{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={280}>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {chips.map((c) => (
                  <span key={c} className="inline-flex items-center gap-2 rounded-full bg-mint/80 border border-mint-deep/30 px-4 py-2 text-[13px] font-bold text-ink">
                    <AsteriskMark className="h-3.5 w-3.5 text-mint-deep" strokeWidth={2.4} />
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={360}>
              <div className="mt-9 flex items-center gap-5 border-l-[3px] border-gold pl-5">
                <p className="font-serif italic text-[22px] sm:text-2xl text-ink">
                  «Каждый человек по своей природе целостен —<br className="hidden sm:block" /> я помогаю об этом вспомнить»
                </p>
              </div>
              <p className="mt-4 pl-5 font-serif italic text-lg text-ink-soft">— Валерия</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

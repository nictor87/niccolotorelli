import Image from "next/image";
import Link from "next/link";
import { Bands } from "./bands";
import { Loop } from "./loop";
import { SplitText } from "./split-text";
import { StoryCard } from "./story-card";
import {
  featureOf,
  hrefOf,
  leadSpread,
  pagesOf,
  work,
  yearSpan,
  type Story,
} from "./work";

type Module = {
  kind: "pair" | "center" | "left" | "right";
  slugs: Story["slug"][];
};

const SIZES: Record<Module["kind"], string> = {
  pair: "(min-width: 768px) 50vw, 100vw",
  center: "(min-width: 768px) 67vw, 100vw",
  left: "(min-width: 768px) 50vw, 84vw",
  right: "(min-width: 768px) 50vw, 84vw",
};

const modules: Module[] = [
  { kind: "pair", slugs: ["dust-28", "dust-16-fire"] },
  { kind: "center", slugs: ["dust-22"] },
  { kind: "left", slugs: ["dust-27"] },
  { kind: "pair", slugs: ["dust-21", "dust-29"] },
  { kind: "right", slugs: ["dust-24"] },
  { kind: "center", slugs: ["dust-16-victory"] },
  { kind: "pair", slugs: ["dust-25", "dust-15"] },
];

function storyFor(slug: Story["slug"]): Story {
  const story = work.find((candidate) => candidate.slug === slug);
  if (!story) throw new Error(`Missing story ${slug}`);
  return story;
}

function Opening({ story, clone = false }: { story: Story; clone?: boolean }) {
  const pageCount = pagesOf(story).length;
  const sheet = (
    <Image
      src={leadSpread.src}
      width={leadSpread.w}
      height={leadSpread.h}
      sizes="(min-width: 768px) 96vw, 100vw"
      alt=""
      loading="eager"
      fetchPriority={clone ? "auto" : "high"}
    />
  );

  return (
    <section
      className={clone ? "opening loop-clone" : "opening"}
      aria-label={clone ? undefined : "Opening spread"}
      aria-hidden={clone || undefined}
      inert={clone || undefined}
    >
      <div className="opening-frame">
        {clone ? (
          <span className="opening-sheet">{sheet}</span>
        ) : (
          <Link
            href={hrefOf(story)}
            className="opening-link"
            aria-label={`${story.title}, ${story.issue}, ${pageCount} images`}
            data-cursor={`Open, ${String(pageCount).padStart(2, "0")} images`}
          >
            <span className="opening-sheet">{sheet}</span>
          </Link>
        )}
        <div className="opening-type">
          <p className="opening-meta">
            <span>
              {story.title}, {story.issue}
            </span>
            <span>
              {work.length} stories, {yearSpan()}
            </span>
          </p>
          {clone ? (
            <p className="wordmark">
              <SplitText text="Nicco Torelli" />
            </p>
          ) : (
            <h1 className="wordmark">
              <SplitText text="Nicco Torelli" delay={900} />
            </h1>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const first = work[0];

  return (
    <main id="content" tabIndex={-1}>
      <Bands />
      <Loop />
      <Opening story={first} />

      <h2 className="sr-only">Stories</h2>
      <div className="modules">
        {modules.map((module, moduleIndex) => (
          <div key={module.slugs[0]} className={`module module-${module.kind}`}>
            {module.slugs.map((slug) => {
              const story = storyFor(slug);
              return (
                <StoryCard
                  key={slug}
                  story={story}
                  href={hrefOf(story)}
                  image={featureOf(story)}
                  pageCount={pagesOf(story).length}
                  sizes={SIZES[module.kind]}
                  eager={moduleIndex === 0}
                />
              );
            })}
          </div>
        ))}
      </div>

      <Opening story={first} clone />
    </main>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bands } from "../../bands";
import { notFound } from "next/navigation";
import { Credits } from "../../credits";
import { SplitText } from "../../split-text";
import {
  describePage,
  featureOf,
  findStory,
  hrefOf,
  storyAfter,
  pagesOf,
  type StoryPage,
  type Story,
  work,
} from "../../work";

export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const story = findStory((await params).slug);
  if (!story) return {};
  return {
    title: `${story.title}, ${story.issue} | Nicco Torelli`,
    description: `${story.title}, styled by Nicco Torelli for ${story.issue}.`,
  };
}

type Placed = { page: StoryPage; position: number };
type Block = { kind: "spread" | "center"; pages: Placed[] };

const SIZES: Record<Block["kind"], string> = {
  spread: "(min-width: 768px) 50vw, 100vw",
  center: "(min-width: 768px) 67vw, 100vw",
};

function toSpreads(pages: Placed[]): Block[] {
  const blocks: Block[] = [];
  let cursor = 0;
  const sameSheet = (a?: Placed, b?: Placed) =>
    !!a && !!b && a.page.sheet === b.page.sheet;
  while (cursor < pages.length) {
    const current = pages[cursor];
    const next = pages[cursor + 1];
    const afterNext = pages[cursor + 2];
    if (sameSheet(current, next)) {
      blocks.push({ kind: "spread", pages: [current, next] });
      cursor += 2;
    } else if (next && !sameSheet(next, afterNext)) {
      blocks.push({ kind: "spread", pages: [current, next] });
      cursor += 2;
    } else {
      blocks.push({ kind: "center", pages: [current] });
      cursor += 1;
    }
  }
  return blocks;
}

function PageImage({
  story,
  placed,
  sizes,
  eager = false,
}: {
  story: Story;
  placed: Placed;
  sizes: string;
  eager?: boolean;
}) {
  return (
    <Image
      src={placed.page.src}
      width={placed.page.w}
      height={placed.page.h}
      sizes={sizes}
      alt={describePage(story, placed.page, placed.position)}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
    />
  );
}

export default async function Project({ params }: PageProps<"/work/[slug]">) {
  const story = findStory((await params).slug);
  if (!story) notFound();

  const ordered: Placed[] = pagesOf(story).map((page, position) => ({
    page,
    position,
  }));
  const next = storyAfter(story);
  const nextImage = featureOf(next);

  return (
    <main id="content" tabIndex={-1} className="project">
      <Bands />
      <section className="project-head" aria-labelledby="project-title">
        <p className="opening-meta">
          <span>
            {story.issue}, {story.year}
          </span>
          <span>{ordered.length} images</span>
        </p>
        <h1 id="project-title" className="project-title">
          <SplitText text={story.title} delay={200} />
        </h1>
        <Credits credits={story.credits} className="project-credits" />
      </section>

      {toSpreads(ordered).map((block) => (
        <div key={block.pages[0].page.src} className={`layout-${block.kind}`}>
          {block.pages.map((placed) => (
            <figure key={placed.page.src} className="leaf">
              <PageImage
                story={story}
                placed={placed}
                sizes={SIZES[block.kind]}
                eager={placed.position < 2}
              />
            </figure>
          ))}
        </div>
      ))}

      <nav aria-label="Next story" className="next">
        <Link
          href={hrefOf(next)}
          prefetch
          className="next-link"
          data-cursor="Next story"
        >
          <span className="next-sheet">
            <Image
              src={nextImage.src}
              width={nextImage.w}
              height={nextImage.h}
              sizes="(min-width: 768px) 25vw, 40vw"
              alt=""
            />
          </span>
          <span className="next-type">
            <span>
              Next story, {next.issue}, {next.year}
            </span>
            <span className="next-title">{next.title}</span>
          </span>
        </Link>
      </nav>
      <footer className="bar closing">
        <p>Nicco Torelli</p>
        <nav aria-label="Footer">
          <Link href="/info">Info</Link>
          <a href="#top">Back to top</a>
        </nav>
      </footer>
    </main>
  );
}

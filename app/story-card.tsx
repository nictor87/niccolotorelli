import Link from "next/link";
import { Credits } from "./credits";
import { ScanSheet } from "./scan-sheet";
import type { Page, Story } from "./work";

type StoryCardProps = {
  story: Story;
  href: string;
  image: Page;
  pageCount: number;
  sizes: string;
  eager: boolean;
};

export function StoryCard({
  story,
  href,
  image,
  pageCount,
  sizes,
  eager,
}: StoryCardProps) {
  return (
    <article className="card">
      <Link
        href={href}
        className="card-link"
        data-cursor={`Open, ${String(pageCount).padStart(2, "0")} images`}
      >
        <ScanSheet image={image} sizes={sizes} eager={eager} />
        <span className="card-caption card-title">
          <h3>{story.title}</h3>
          <span>
            {story.issue}, {story.year}
          </span>
        </span>
      </Link>
      <div className="card-caption">
        <Credits credits={story.credits} />
      </div>
    </article>
  );
}

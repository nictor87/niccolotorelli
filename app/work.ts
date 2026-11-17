import lead from "./lead.json";
import features from "./features.json";
import pages from "./pages.json";

export type Page = { src: string; w: number; h: number };

export type StoryPage = Page & { key: string; sheet: string };

export type Credit = [role: string, names: string];

export type Story = {
  slug: keyof typeof pages;
  title: string;
  issue: string;
  year: number;
  credits: Credit[];
};

export const work: Story[] = [
  {
    slug: "dust-23",
    year: 2023,
    title: "Special Nothing",
    issue: "DUST 23",
    credits: [
      ["Photography", "Ryan McGinley"],
      ["Hair", "Shingo Shibata"],
      ["Make-up", "Tayler Treadwell"],
      ["Casting", "Nicola Kast"],
      ["Set design", "Javier Irigoyen"],
    ],
  },
  {
    slug: "dust-28",
    year: 2025,
    title: "Ricky and Freddie and David and Rimbaud in New York",
    issue: "DUST 28",
    credits: [
      ["Photography", "Collier Schorr"],
      ["Casting", "Collier Schorr"],
      ["Models", "Ricky West Graham, Freddie Eisenman"],
    ],
  },
  {
    slug: "dust-16-fire",
    year: 2020,
    title: "The World Was on Fire",
    issue: "DUST 16",
    credits: [
      ["Photography", "Hugo Comte"],
      ["Hair", "Gary Gill"],
      ["Make-up", "Marla Belt"],
      ["Casting", "Nicolas Bianciotto"],
      ["Models", "Grace Hartzel, Sora Choi"],
    ],
  },
  {
    slug: "dust-22",
    year: 2023,
    title: "La España Vacía",
    issue: "DUST 22",
    credits: [
      ["Photography", "Nico Bustos"],
      ["Talent", "Pedro Almodóvar"],
    ],
  },
  {
    slug: "dust-27",
    year: 2025,
    title: "Dream On",
    issue: "DUST 27",
    credits: [
      ["Photography", "Collier Schorr"],
      ["Talent", "Nettspend"],
    ],
  },
  {
    slug: "dust-21",
    year: 2022,
    title: "Apple and Cigarettes",
    issue: "DUST 21",
    credits: [
      ["Photography", "Roe Ethridge"],
      ["Hair", "Orlando Pita"],
      ["Make-up", "Yumi Lee"],
      ["Casting", "Nicola Kast"],
      ["Talent", "Lara Stone"],
    ],
  },
  {
    slug: "dust-29",
    year: 2026,
    title: "Overload",
    issue: "DUST 29",
    credits: [
      ["Photography", "Pavel Golik"],
      ["Hair", "Olivier Schawalder"],
      ["Make-up", "Josh Bart"],
      ["Casting", "Chouaïb Arif"],
    ],
  },
  {
    slug: "dust-24",
    year: 2024,
    title: "Firestarter",
    issue: "DUST 24",
    credits: [
      ["Photography", "Mark Luckasavage"],
      ["Hair", "Kim Rance"],
      ["Make-up", "Patrick Glatthaar"],
      ["Casting", "Nicola Kast"],
      ["Set design", "Rafael Medeiros"],
      ["Talent", "Bobby Brazier"],
    ],
  },
  {
    slug: "dust-16-victory",
    year: 2020,
    title: "Another Day of Victory",
    issue: "DUST 16",
    credits: [
      ["Photography", "Gareth McConnell"],
      ["Hair", "Soichi Inagaki"],
      ["Make-up", "Satoko Watanabe"],
      ["Casting", "Shelley Durkan"],
    ],
  },
  {
    slug: "dust-25",
    year: 2024,
    title: "Anatomy of a Veiled Smile",
    issue: "DUST 25",
    credits: [
      ["Photography", "Collier Schorr"],
      ["Hair", "Holli Smith"],
      ["Make-up", "Susie Sobol"],
      ["Casting", "Nicola Kast"],
      ["Set design", "Javier Irigoyen"],
      ["Talent", "Angel Haze"],
    ],
  },
  {
    slug: "dust-15",
    year: 2019,
    title: "Mamma Italia",
    issue: "DUST 15",
    credits: [
      ["Photography", "Patrick Welde"],
      ["Creative direction", "Vetements"],
      ["Casting", "Nicco Torelli, Patrick Welde"],
    ],
  },
];

export const leadSpread: Page & { slug: Story["slug"] } = {
  ...lead,
  slug: lead.slug as Story["slug"],
};

export function pagesOf(story: Story): StoryPage[] {
  return pages[story.slug];
}

export function featureOf(story: Story): Page {
  const key = features[story.slug];
  return (
    pages[story.slug].find((page) => page.key === key) ?? pages[story.slug][0]
  );
}

export function describePage(
  story: Story,
  page: StoryPage,
  position: number,
): string {
  if (page.key === "cover") return `Cover of ${story.issue}`;
  return `${story.title}, ${story.issue}, image ${position + 1} of ${pages[story.slug].length}`;
}

export function findStory(slug: string): Story | undefined {
  return work.find((story) => story.slug === slug);
}

export function storyAfter(story: Story): Story {
  return work[(work.indexOf(story) + 1) % work.length];
}

export function hrefOf(story: Story): string {
  return `/work/${story.slug}`;
}

export function yearSpan(): string {
  const years = work.map((story) => story.year);
  return `${Math.min(...years)}–${Math.max(...years)}`;
}

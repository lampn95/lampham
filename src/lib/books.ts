import type { LocalizedText } from "./stories";

export type BookStat = {
  number: string;
  label: LocalizedText;
};

/**
 * A book Lam helped write. The shape is intentionally chunky so each card can
 * render with its own palette + cover art without touching the component.
 */
export type Book = {
  slug: string;
  url: string;
  domainBadge: string; // shown as "site.com/path" pill on the card
  cover: {
    spineLabel: string;
    titleLines: string[]; // 2–4 short lines printed on the front of the cover
    year: string;
    /** Tailwind classes for the cover's front gradient. */
    frontGradient: string;
    /** Tailwind classes for the thin spine on the right edge. */
    spineGradient: string;
    /** Tailwind shadow class (with arbitrary value). */
    shadow: string;
  };
  card: {
    /** Outer wrapper gradient + border tint. */
    wrapperGradient: string;
    wrapperBorder: string;
    /** URL pill badge styling. */
    badgeBorder: string;
    badgeBg: string;
    badgeText: string;
    /** Open the book CTA color (subtle on idle, white on hover). */
    ctaText: string;
  };
  title: LocalizedText;
  copy: {
    lead: LocalizedText;
    highlight: LocalizedText; // emphasized phrase between lead and tail
    tail: LocalizedText;
  };
  stats: BookStat[];
  cta: LocalizedText;
  credit: LocalizedText;
};

export const books: Book[] = [
  {
    slug: "coding-dsa-interview",
    url: "https://engineerpro-team.github.io/coding-book/",
    domainBadge: "engineerpro-team.github.io/coding-book",
    cover: {
      spineLabel: "EngineerPro",
      titleLines: ["Coding DSA", "Interview", "Patterns"],
      year: "2026",
      frontGradient: "from-violet-400 via-fuchsia-400 to-indigo-400",
      spineGradient: "from-violet-500 to-indigo-500",
      shadow: "shadow-[0_12px_40px_rgba(168,85,247,0.35)]",
    },
    card: {
      wrapperGradient:
        "from-violet-500/[0.10] via-indigo-500/[0.06] to-fuchsia-500/[0.08]",
      wrapperBorder: "border-violet-400/15",
      badgeBorder: "border-violet-300/30",
      badgeBg: "bg-violet-300/5",
      badgeText: "text-violet-200",
      ctaText: "text-violet-200",
    },
    title: {
      en: "Coding DSA Interview — with solutions.",
      vi: "Coding DSA Interview — kèm lời giải.",
    },
    copy: {
      lead: {
        en: "A collection of common DSA problems asked in technical interviews, with Python 3 solutions, complexity analysis, and interview pitfalls. Learn by ",
        vi: "Cuốn sách tổng hợp các bài DSA thường gặp trong phỏng vấn kỹ thuật, kèm lời giải Python 3, phân tích độ phức tạp, và các bẫy phỏng vấn. Học theo ",
      },
      highlight: { en: "pattern", vi: "pattern" },
      tail: {
        en: ", not by memorizing every problem. Completely free for the community.",
        vi: ", không phải học vẹt từng bài. Hoàn toàn miễn phí cho cộng đồng.",
      },
    },
    stats: [
      { number: "288", label: { en: "problems", vi: "bài tập" } },
      { number: "44", label: { en: "patterns", vi: "patterns" } },
      { number: "Free", label: { en: "open to everyone", vi: "mở cho cộng đồng" } },
    ],
    cta: { en: "Open the book", vi: "Mở sách" },
    credit: {
      en: "Co-authors: Phạm Ngọc Lâm · Lê Quang Hoà — 2026.",
      vi: "Đồng tác giả: Phạm Ngọc Lâm · Lê Quang Hoà — 2026.",
    },
  },
  {
    slug: "system-design-notes",
    url: "https://engineerprogurus.com/system-design-material/",
    domainBadge: "engineerprogurus.com/system-design-material",
    cover: {
      spineLabel: "EngineerPro",
      titleLines: ["System", "Design", "Notes"],
      year: "2026",
      frontGradient: "from-cyan-400 via-sky-400 to-teal-400",
      spineGradient: "from-cyan-500 to-teal-500",
      shadow: "shadow-[0_12px_40px_rgba(34,211,238,0.35)]",
    },
    card: {
      wrapperGradient:
        "from-cyan-500/[0.10] via-sky-500/[0.06] to-teal-500/[0.08]",
      wrapperBorder: "border-cyan-400/15",
      badgeBorder: "border-cyan-300/30",
      badgeBg: "bg-cyan-300/5",
      badgeText: "text-cyan-200",
      ctaText: "text-cyan-200",
    },
    title: {
      en: "System Design Notes — 21 case studies.",
      vi: "System Design Notes — 21 case studies.",
    },
    copy: {
      lead: {
        en: "Reference notes covering 21 system-design case studies — from Redis and CDN to RAG, agentic AI, Zoom, Uber, and a stock exchange. Every chapter ships in both ",
        vi: "Tài liệu tham khảo gồm 21 case study system design — từ Redis và CDN đến RAG, agentic AI, Zoom, Uber, sàn chứng khoán… Mỗi chương có cả ",
      },
      highlight: {
        en: "English and Vietnamese",
        vi: "bản tiếng Anh và tiếng Việt",
      },
      tail: {
        en: ". Free reading material for interview prep.",
        vi: ". Đọc miễn phí, dùng làm tài liệu ôn phỏng vấn.",
      },
    },
    stats: [
      { number: "21", label: { en: "case studies", vi: "case studies" } },
      { number: "EN · VI", label: { en: "bilingual", vi: "song ngữ" } },
      { number: "Free", label: { en: "open to everyone", vi: "mở cho cộng đồng" } },
    ],
    cta: { en: "Read the notes", vi: "Đọc tài liệu" },
    credit: {
      en: "Co-author: Phạm Ngọc Lâm with the EngineerPro team — 2026.",
      vi: "Đồng tác giả: Phạm Ngọc Lâm cùng team EngineerPro — 2026.",
    },
  },
  {
    slug: "forty-seconds-cvs",
    url: "https://engineerprovn.gumroad.com/l/Forty-Seconds-Ten-Real-CVs-That-Passed-Big-Tech",
    domainBadge: "engineerprovn.gumroad.com",
    cover: {
      spineLabel: "EngineerPro",
      titleLines: ["Forty", "Seconds", "10 Real CVs"],
      year: "2026",
      frontGradient: "from-amber-400 via-orange-400 to-rose-400",
      spineGradient: "from-amber-500 to-orange-500",
      shadow: "shadow-[0_12px_40px_rgba(251,146,60,0.35)]",
    },
    card: {
      wrapperGradient:
        "from-amber-500/[0.10] via-orange-500/[0.06] to-rose-500/[0.08]",
      wrapperBorder: "border-amber-400/15",
      badgeBorder: "border-amber-300/30",
      badgeBg: "bg-amber-300/5",
      badgeText: "text-amber-200",
      ctaText: "text-amber-200",
    },
    title: {
      en: "Forty Seconds — ten real CVs that passed Big Tech.",
      vi: "Forty Seconds — 10 CV thật đã qua vòng loại Big Tech.",
    },
    copy: {
      lead: {
        en: "Recruiters skim a résumé in about forty seconds. This book breaks down ten real CVs that made it past that screen at companies like Google, Meta, Amazon, and NVIDIA — what to keep, what to cut, and how to ",
        vi: "Nhà tuyển dụng lướt một CV trong khoảng bốn mươi giây. Cuốn sách mổ xẻ 10 CV thật đã vượt qua vòng loại ở các công ty như Google, Meta, Amazon, NVIDIA — giữ gì, bỏ gì, và làm sao để ",
      },
      highlight: { en: "stand out in seconds", vi: "nổi bật trong vài giây" },
      tail: {
        en: ", not pages.",
        vi: ", chứ không phải vài trang.",
      },
    },
    stats: [
      { number: "10", label: { en: "real CVs", vi: "CV thật" } },
      { number: "Big Tech", label: { en: "Google · Meta · NVIDIA", vi: "Google · Meta · NVIDIA" } },
      { number: "PDF", label: { en: "e-book", vi: "e-book" } },
    ],
    cta: { en: "Get the book", vi: "Xem sách" },
    credit: {
      en: "Co-author: Phạm Ngọc Lâm with the EngineerPro team — 2026.",
      vi: "Đồng tác giả: Phạm Ngọc Lâm cùng team EngineerPro — 2026.",
    },
  },
  {
    slug: "cafe-talk-playbook",
    url: "https://engineerprovn.gumroad.com/l/cafe-talk-the-interview-and-career-playbook",
    domainBadge: "engineerprovn.gumroad.com",
    cover: {
      spineLabel: "EngineerPro",
      titleLines: ["Cafe Talk", "Interview &", "Career"],
      year: "2026",
      frontGradient: "from-rose-400 via-pink-400 to-fuchsia-400",
      spineGradient: "from-rose-500 to-pink-500",
      shadow: "shadow-[0_12px_40px_rgba(244,114,182,0.35)]",
    },
    card: {
      wrapperGradient:
        "from-rose-500/[0.10] via-pink-500/[0.06] to-fuchsia-500/[0.08]",
      wrapperBorder: "border-rose-400/15",
      badgeBorder: "border-rose-300/30",
      badgeBg: "bg-rose-300/5",
      badgeText: "text-rose-200",
      ctaText: "text-rose-200",
    },
    title: {
      en: "Cafe Talk — the interview & career playbook.",
      vi: "Cafe Talk — cẩm nang phỏng vấn & sự nghiệp.",
    },
    copy: {
      lead: {
        en: "A candid, coffee-chat style playbook for the whole journey — from coding and system design to behavioral rounds and the ",
        vi: "Một cẩm nang giọng trò chuyện cà phê cho cả hành trình — từ coding, system design tới vòng behavioral và những ",
      },
      highlight: {
        en: "career decisions",
        vi: "quyết định sự nghiệp",
      },
      tail: {
        en: " that come after the offer.",
        vi: " sau khi nhận offer.",
      },
    },
    stats: [
      { number: "Interview", label: { en: "coding · system design", vi: "coding · system design" } },
      { number: "Career", label: { en: "behavioral · growth", vi: "behavioral · phát triển" } },
      { number: "PDF", label: { en: "e-book", vi: "e-book" } },
    ],
    cta: { en: "Get the book", vi: "Xem sách" },
    credit: {
      en: "Co-author: Phạm Ngọc Lâm with the EngineerPro team — 2026.",
      vi: "Đồng tác giả: Phạm Ngọc Lâm cùng team EngineerPro — 2026.",
    },
  },
];

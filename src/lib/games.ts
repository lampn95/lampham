import type { LocalizedText } from "./stories";

export type Game = {
  slug: string;             // URL part: /play/<slug>/
  emoji: string;            // for the card thumb
  title: LocalizedText;
  blurb: LocalizedText;     // 1-2 lines on the index card
  controls: LocalizedText;  // hint shown above the canvas
  highScoreKey: string;     // localStorage key
  highScoreLabel: LocalizedText; // "Best score" / "Bugs squashed" / etc.
  accent: string;           // tailwind gradient for the card thumb
};

export const games: Game[] = [
  {
    slug: "snake",
    emoji: "🐛",
    title: { en: "Bug Snake",                       vi: "Bug Snake" },
    blurb: {
      en: "Classic snake — but you're a deploy pipeline eating bugs. Hit a wall and the build fails.",
      vi: "Rắn cổ điển — bạn là một deploy pipeline ăn bug. Đụng tường thì build fail.",
    },
    controls: {
      en: "Arrow keys or WASD · swipe / D-pad on mobile",
      vi: "Phím mũi tên hoặc WASD · vuốt / D-pad trên mobile",
    },
    highScoreKey: "lampham-snake-best",
    highScoreLabel: { en: "Bugs squashed", vi: "Bug đã fix" },
    accent: "from-emerald-400 via-lime-400 to-green-400",
  },
  {
    slug: "coffee-catcher",
    emoji: "☕",
    title: { en: "Coffee Catcher",                  vi: "Coffee Catcher" },
    blurb: {
      en: "Sixty seconds. Catch cà phê sữa đá, dodge bugs. Tap or use arrow keys.",
      vi: "60 giây. Bắt cà phê sữa đá, né bug. Bấm hoặc dùng phím mũi tên.",
    },
    controls: {
      en: "Arrow keys · drag / tap left or right on mobile",
      vi: "Phím mũi tên · kéo / bấm trái phải trên mobile",
    },
    highScoreKey: "lampham-coffee-best",
    highScoreLabel: { en: "Coffees caught",         vi: "Cà phê đã bắt" },
    accent: "from-amber-300 via-orange-300 to-rose-300",
  },
  {
    slug: "memory-match",
    emoji: "🧩",
    title: { en: "Tech Memory Match",               vi: "Tech Memory Match" },
    blurb: {
      en: "Flip cards, find pairs of tech logos. Fewer moves wins.",
      vi: "Lật thẻ, tìm cặp logo công nghệ. Càng ít moves càng tốt.",
    },
    controls: {
      en: "Click / tap to flip cards",
      vi: "Click / chạm để lật thẻ",
    },
    highScoreKey: "lampham-memory-best",
    highScoreLabel: { en: "moves",                  vi: "moves" },
    accent: "from-violet-400 via-fuchsia-400 to-cyan-400",
  },
  {
    slug: "type-the-stack",
    emoji: "⌨️",
    title: { en: "Type the Stack",                  vi: "Type the Stack" },
    blurb: {
      en: "Tech names fall from above. Type them before they hit the floor. 60 seconds, three lives.",
      vi: "Tên công nghệ rơi xuống. Gõ trước khi chạm đáy. 60 giây, ba mạng.",
    },
    controls: {
      en: "Type letters · only words starting with that letter activate",
      vi: "Gõ chữ · chỉ word bắt đầu bằng chữ đó được active",
    },
    highScoreKey: "lampham-type-best",
    highScoreLabel: { en: "stacks typed",           vi: "stacks đã gõ" },
    accent: "from-blue-400 via-indigo-400 to-purple-400",
  },
  {
    slug: "tank-battle",
    emoji: "🚜",
    title: { en: "Tank Battle",                     vi: "Tank Battle" },
    blurb: {
      en: "A small tribute to Battle City. Random map each round. Bust five enemy tanks to win — don't let the brick walls fool you.",
      vi: "Một lời tri ân nhỏ tới Tank 1990. Map random mỗi ván. Hạ 5 xe tăng địch để thắng — coi chừng tường gạch.",
    },
    controls: {
      en: "Arrow keys / WASD to move · Space to fire · D-pad + Fire on mobile",
      vi: "Mũi tên / WASD để chạy · Space để bắn · D-pad + Fire trên mobile",
    },
    highScoreKey: "lampham-tank-best",
    highScoreLabel: { en: "tanks busted",           vi: "tank đã hạ" },
    accent: "from-orange-400 via-red-400 to-rose-400",
  },
  {
    slug: "flappy-bird",
    emoji: "🐤",
    title: { en: "Flappy Bird",                     vi: "Flappy Bird" },
    blurb: {
      en: "A clean-room tribute to the one-button classic. Tap to flap, thread the pipes — physics ported from the open-source JS-Flappy-Bird.",
      vi: "Một bản tri ân clean-room cho huyền thoại một-nút. Chạm để vỗ cánh, luồn qua ống — physics port từ JS-Flappy-Bird mã nguồn mở.",
    },
    controls: {
      en: "Tap / click · Space · ↑ · W to flap",
      vi: "Chạm / click · Space · ↑ · W để vỗ cánh",
    },
    highScoreKey: "lampham-flappy-best",
    highScoreLabel: { en: "pipes cleared",          vi: "ống đã qua" },
    accent: "from-sky-400 via-cyan-300 to-emerald-300",
  },
  {
    slug: "contra",
    emoji: "🎯",
    title: { en: "Jungle Run",                      vi: "Jungle Run" },
    blurb: {
      en: "A clean-room tribute to the 8-bit run-and-gun. Original art & code — sprint, jump, shoot 5 ways, dodge turrets, blow the gate.",
      vi: "Một bản tri ân clean-room cho dòng run-and-gun 8-bit. Sprite & code 100% tự viết — chạy, nhảy, bắn 5 hướng, né pháo, phá cổng.",
    },
    controls: {
      en: "Arrow keys / WASD to move · Z to jump · X to shoot · ↑+X aims up · ↓ crouch",
      vi: "Mũi tên / WASD để di chuyển · Z để nhảy · X để bắn · ↑+X bắn lên · ↓ ngồi xuống",
    },
    highScoreKey: "lampham-contra-best",
    highScoreLabel: { en: "enemies down",           vi: "địch hạ" },
    accent: "from-lime-400 via-emerald-500 to-teal-500",
  },
  {
    slug: "mario",
    emoji: "🍄",
    title: { en: "Super Mario Bros 1-1",            vi: "Super Mario Bros 1-1" },
    blurb: {
      en: "An MIT-licensed JS clone of the NES classic by Garrett Johnson. World 1-1 + the underground tunnel — embedded here as a tribute.",
      vi: "Bản port JS (MIT) game NES huyền thoại của Garrett Johnson. World 1-1 + hầm — nhúng vào đây như một lời tri ân.",
    },
    controls: {
      en: "Arrow keys to move · X to jump · Z to run / shoot fireballs",
      vi: "Phím mũi tên để chạy · X để nhảy · Z để chạy nhanh / bắn fireball",
    },
    highScoreKey: "lampham-mario-best",      // unused — upstream has no score persistence
    highScoreLabel: { en: "score",            vi: "điểm" },
    accent: "from-rose-500 via-amber-400 to-emerald-400",
  },
];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

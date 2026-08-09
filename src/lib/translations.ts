// Flat key → {en, vi} dictionary. Add new strings here; both langs required.
// Story BODIES are intentionally not translated — those are personal voice.

export type Lang = "en" | "vi";

export const LANGS: Lang[] = ["en", "vi"];
export const DEFAULT_LANG: Lang = "en";

export const translations = {
  // ===== Nav =====
  "nav.about":       { en: "About",       vi: "Giới thiệu" },
  "nav.experience":  { en: "Experience",  vi: "Kinh nghiệm" },
  "nav.projects":    { en: "Projects",    vi: "Dự án" },
  "nav.engineerpro": { en: "EngineerPro", vi: "EngineerPro" },
  "nav.book":        { en: "Book",        vi: "Sách" },
  "nav.podcast":     { en: "Podcast",     vi: "Podcast" },
  "nav.stories":     { en: "Stories",     vi: "Stories" },
  "nav.play":        { en: "Play",        vi: "Play" },

  // ===== Hero =====
  "hero.statusPill":  { en: "Open to interesting conversations",
                        vi: "Mở cho những cuộc trò chuyện thú vị" },
  "hero.greeting":    { en: "Hi, I'm",     vi: "Hi, mình là" },
  "hero.subtitle":    { en: "An engineer, still learning every day.",
                        vi: "Một software engineer, đang học mỗi ngày." },
  "hero.cta.stories": { en: "Read stories", vi: "Đọc Stories" },
  "hero.cta.contact": { en: "Contact",      vi: "Liên hệ" },
  "hero.locationBadge": { en: "Hà Nội, Vietnam", vi: "Hà Nội, Việt Nam" },

  // ===== Coffee buttons =====
  "coffee.primary": { en: "Buy me a coffee",     vi: "Mời mình 1 ly cà phê" },
  "coffee.ghost":   { en: "Buy me a coffee",     vi: "Mời mình 1 ly cà phê" },
  "coffee.aria":    { en: "Buy the author a coffee", vi: "Mời tác giả một ly cà phê" },

  // ===== Experience =====
  "experience.eyebrow":     { en: "Work",
                              vi: "Work" },
  "experience.title":       { en: "A few places I've stopped by.",
                              vi: "Một vài nơi mình đã ghé qua." },
  "experience.description": { en: "Each chapter — a chance to learn something. About systems. About people. About myself.",
                              vi: "Mỗi chặng là một dịp để học thêm — về hệ thống, về con người, và về chính mình." },

  // ===== Projects =====
  "projects.eyebrow":     { en: "Selected Projects",
                            vi: "Selected Projects" },
  "projects.title":       { en: "Things I build on the side.",
                            vi: "Những thứ mình build ngoài giờ." },
  "projects.description": { en: "Each project is a chance to try an idea, a new stack, or test a belief about architecture. All paired with Claude (design + impl) and Codex (code review).",
                            vi: "Mỗi project là một dịp để thử một idea, một stack mới, hoặc kiểm chứng một niềm tin về kiến trúc. Tất cả đều paired với Claude (design + impl) và Codex (code review)." },
  "projects.openSource":  { en: "Open source on GitHub",
                            vi: "Mở source trên GitHub" },

  // ===== EngineerPro section =====
  "engineerpro.eyebrow":     { en: "EngineerPro", vi: "EngineerPro" },
  "engineerpro.title":       { en: "EngineerPro — learning the fundamentals with people who walked the path before.",
                               vi: "EngineerPro — học nền tảng cùng những người đã đi trước." },
  "engineerpro.description": { en: "A few of us started EngineerPro as a small mentor group for Vietnamese engineers. We try to pool what we've learned from real work: DSA, backend, system design, and how to prep for interviews in a way that actually lasts.",
                               vi: "Mình cùng anh em xây EngineerPro như một nhóm mentor nhỏ cho kỹ sư Việt Nam. Tụi mình cố gắng gom lại những gì đã học từ công việc thật: DSA, backend, system design, và cách chuẩn bị phỏng vấn một cách bền vững." },
  "engineerpro.cardTitleA":  { en: "Solid fundamentals,", vi: "Học chắc nền tảng," },
  "engineerpro.cardTitleB":  { en: "for the long run",     vi: "đi đường dài hơn" },
  "engineerpro.cardSubtitle":{ en: "Mentors stay close at each stage.",
                               vi: "Cùng mentor theo sát từng giai đoạn." },
  "engineerpro.copyLead":    { en: "We design clear paths through ",
                               vi: "Tụi mình thiết kế lộ trình rõ ràng từ " },
  "engineerpro.copyTail":    { en: ". Everyone starts from a different point, so the path stays flexible and grounded.",
                               vi: ". Mỗi bạn có xuất phát điểm khác nhau, nên lộ trình cũng cần đủ linh hoạt và thực tế." },
  "engineerpro.mini.mentor":     { en: "Mentor",        vi: "Mentor" },
  "engineerpro.mini.mentorSub":  { en: "people who shipped real products", vi: "đã làm sản phẩm thật" },
  "engineerpro.mini.path":       { en: "Roadmap",       vi: "Lộ trình" },
  "engineerpro.mini.pathSub":    { en: "clear, step by step", vi: "rõ từng bước" },
  "engineerpro.mini.community":  { en: "Community",     vi: "Cộng đồng" },
  "engineerpro.mini.communitySub":{ en: "learning together", vi: "học cùng nhau" },
  "engineerpro.mentors":         { en: "A few mentors", vi: "Một vài mentor" },
  "engineerpro.moreMentors":     { en: "… and a few more from Acronis, Microsoft, TikTok…",
                                   vi: "… và vài anh em khác từng làm ở Acronis, Microsoft, TikTok…" },
  "engineerpro.cta":             { en: "Explore EngineerPro", vi: "Khám phá EngineerPro" },

  // ===== Books section =====
  // Per-book copy lives in src/lib/books.ts. Only the section heading is here.
  "book.eyebrow":     { en: "Note · Books",  vi: "Note · Books" },
  "book.title":       { en: "A few books I helped write.",
                        vi: "Vài cuốn sách mình đã đồng tác giả." },
  "book.description": { en: "Books on technical-interview prep — coding patterns, system design, real Big-Tech CVs, and an interview & career playbook — co-written under the EngineerPro umbrella.",
                        vi: "Những cuốn sách về phỏng vấn kỹ thuật — coding patterns, system design, CV thật đậu Big Tech, và cẩm nang phỏng vấn & sự nghiệp — đồng biên soạn dưới sự bảo trợ của EngineerPro." },

  // ===== Podcast section =====
  "podcast.eyebrow":     { en: "Podcast · Notes by voice",
                           vi: "Podcast · Ghi chép bằng giọng nói" },
  "podcast.title":       { en: "Coffee with Lam.",
                           vi: "Coffee with Lam." },
  "podcast.descriptionPrefix": { en: "A podcast I record on the EngineerPro channel — sometimes about technical-interview questions, sometimes about engineering culture, system design, monitoring, e2e encryption. ",
                                 vi: "Series podcast mình ghi lại trên kênh EngineerPro — lúc thì bình luận đề phỏng vấn kỹ thuật, lúc thì bàn về văn hoá engineering, system design, monitoring, e2e encryption. " },
  "podcast.descriptionTail": { en: "episodes, on both Spotify and Substack.",
                               vi: "episode, có trên cả Spotify và Substack." },
  "podcast.totalLabel":  { en: "Currently",  vi: "Hiện có" },
  "podcast.showMore":    { en: "Show {n} more episodes", vi: "Xem thêm {n} episode" },
  "podcast.collapse":    { en: "Collapse",                vi: "Thu gọn" },

  // ===== Skills section =====
  "skills.eyebrow":   { en: "Skills & Education", vi: "Skills & Education" },
  "skills.title":     { en: "Stack & foundations.", vi: "Stack & nền tảng." },

  // ===== Stories preview (on home) =====
  "storiesPreview.eyebrow":     { en: "Stories", vi: "Stories" },
  "storiesPreview.title":       { en: "A few notes.", vi: "Vài ghi chép." },
  "storiesPreview.description": { en: "Not tutorials. Not clickbait. Just things I'm slowly learning from work, from failure, and from a few honest conversations.",
                                  vi: "Không phải tutorial. Không phải clickbait. Chỉ là những điều mình đang học dần từ công việc, thất bại, và vài cuộc trò chuyện tử tế." },
  "storiesPreview.readMore":    { en: "Read more", vi: "Đọc tiếp" },
  "storiesPreview.seeAll":      { en: "See all stories", vi: "Xem tất cả stories" },

  // ===== Stories list page =====
  "storiesList.eyebrow":     { en: "Stories", vi: "Stories" },
  "storiesList.title":       { en: "A few notes.", vi: "Vài ghi chép." },
  "storiesList.description": { en: "No tutorials. No clickbait. Just a few things I'm slowly learning from work, from stumbles, and from people met along the way.",
                               vi: "Không tutorial. Không clickbait. Chỉ vài điều mình đang học dần từ công việc, những lần vấp, và những người đã gặp trên đường." },
  "storiesList.read":        { en: "Read", vi: "Đọc" },
  "storiesList.coffeeNote":  { en: "Liked a piece? Buy me a coffee — every bit keeps me writing.",
                               vi: "Thấy bài nào hay? Mời mình 1 ly cà phê nhé — mọi ủng hộ đều giúp mình viết tiếp." },

  // ===== Story detail page =====
  "storyDetail.allStories":  { en: "All stories", vi: "All stories" },
  "storyDetail.home":        { en: "Home →",      vi: "Home →" },
  "storyDetail.coffeeCard":  { en: "If this piece was useful — buy me a coffee.\nIt's what keeps me writing.",
                               vi: "Nếu bài viết hữu ích với bạn — mời mình một ly cà phê nhé.\nĐây là động lực để mình viết tiếp." },

  // ===== Coffee CTA section (homepage bottom) =====
  "coffeeCta.title":       { en: "Content's free. Coffee isn't.",
                             vi: "Nội dung free, nhưng cà phê thì có giá." },
  "coffeeCta.description": { en: "If a story, a project, or an idea here helped you out — you can buy me a coffee via the Vietnamese banking QR. Every contribution means a lot.",
                             vi: "Nếu một story, một project, hay một ý ở đây giúp được bạn — bạn có thể mời mình một ly cà phê qua QR banking VN. Mọi đóng góp đều rất rất quý." },
  "coffeeCta.closing":     { en: "Thanks for stopping by.",
                             vi: "Cảm ơn bạn đã ghé qua." },

  // ===== Coffee dedicated page =====
  "coffeePage.back":         { en: "Back home",     vi: "Về trang chủ" },
  "coffeePage.title":        { en: "Buy me a coffee.", vi: "Mời mình một ly cà phê." },
  "coffeePage.description":  { en: "Thanks for stopping by. If a post, a podcast, or an idea here helped you out — scan the QR below to buy me a coffee. Every bit means a lot.",
                               vi: "Cảm ơn anh chị em đã ghé qua. Nếu một bài, một podcast, hay một ý ở đây giúp được bạn — bạn có thể quét mã QR bên dưới để mời mình một ly. Mọi đóng góp đều rất quý." },
  "coffeePage.scanHint":     { en: "Scan with any Vietnamese banking app (MoMo, Vietcombank, Techcombank…). If the preview above doesn't load, open the file directly:",
                               vi: "Quét bằng app ngân hàng VN (MoMo, Vietcombank, Techcombank…). Nếu khung trên không load được, mở trực tiếp file:" },
  "coffeePage.openDrive":    { en: "Open on Drive", vi: "Mở trên Drive" },
  "coffeePage.thanks":       { en: "Thank you so much.", vi: "Cảm ơn bạn rất nhiều." },
  "coffeePage.readStories":  { en: "Read stories →", vi: "Đọc stories →" },

  // ===== Footer =====
  "footer.tagline":     { en: "Backend engineer in Vietnam. I write a bit about systems, AI-assisted engineering, and a few lessons from working with teams. Helped start ",
                          vi: "Backend engineer ở Việt Nam. Viết một chút về hệ thống, AI-assisted engineering, và vài bài học khi làm việc với team. Cùng anh em xây " },
  "footer.taglineTail": { en: " with a few friends. Built with Next.js & a fair amount of cà phê sữa đá.",
                          vi: ". Built with Next.js & một lượng kha khá cà phê sữa đá." },
  "footer.copyright":   { en: "All rights reserved.", vi: "All rights reserved." },

  // ===== Language toggle aria =====
  "langToggle.aria":    { en: "Switch language",     vi: "Đổi ngôn ngữ" },

  // ===== Play / Games =====
  "play.eyebrow":         { en: "Play · A few small games",
                            vi: "Play · Vài game nhỏ" },
  "play.title":           { en: "Take a short break.",
                            vi: "Nghỉ giải lao một chút." },
  "play.description":     { en: "Three tiny browser games — pure JS, no leaderboards, no ads. Best scores stay in your browser.",
                            vi: "Ba game nhỏ trên browser — pure JS, không leaderboard, không ads. Best score lưu trong browser của bạn." },
  "play.cta":             { en: "Play",                 vi: "Chơi" },
  "play.bestLocal":       { en: "Your best",            vi: "Best của bạn" },
  "play.notPlayedYet":    { en: "Not played yet",       vi: "Chưa chơi" },

  // ===== Game shell =====
  "game.back":            { en: "All games",            vi: "Tất cả game" },
  "game.score":           { en: "Score",                vi: "Score" },
  "game.best":            { en: "Best",                 vi: "Best" },
  "game.time":            { en: "Time",                 vi: "Time" },
  "game.start":           { en: "Start",                vi: "Bắt đầu" },
  "game.restart":         { en: "Restart",              vi: "Chơi lại" },
  "game.pause":           { en: "Pause",                vi: "Tạm dừng" },
  "game.resume":          { en: "Resume",               vi: "Tiếp tục" },
  "game.over":            { en: "Game over",            vi: "Game over" },
  "game.gameStartHint":   { en: "Press Start (or any arrow / WASD) to begin",
                            vi: "Bấm Bắt đầu (hoặc phím mũi tên / WASD) để chơi" },
  "game.newBest":         { en: "New personal best!",   vi: "Personal best mới!" },

  // Game-specific overlays
  "snake.gameOver":       { en: "Build failed",         vi: "Build failed" },
  "snake.gameOverHint":   { en: "You hit a wall. Restart and try again.",
                            vi: "Bạn đụng tường. Chơi lại nhé." },
  "coffee.timeUp":        { en: "Time's up",            vi: "Hết giờ" },
  "coffee.timeUpHint":    { en: "Sixty seconds, gone.", vi: "Sáu mươi giây, thoáng cái." },
  "memory.win":           { en: "All pairs matched!",   vi: "Đã ghép hết các cặp!" },
  "memory.winHint":       { en: "Moves used: {n}",      vi: "Số moves đã dùng: {n}" },

  "type.lives":           { en: "Lives",                vi: "Mạng" },
  "type.gameOver":        { en: "Stack overflow",       vi: "Stack overflow" },
  "type.gameOverHint":    { en: "Out of lives. Try again.",
                            vi: "Hết mạng. Thử lại nhé." },
  "type.timeUp":          { en: "Time's up",            vi: "Hết giờ" },
  "type.timeUpHint":      { en: "Sixty seconds — see what you typed.",
                            vi: "Sáu mươi giây — xem bạn gõ được bao nhiêu." },
  "type.activeWord":      { en: "Typing",               vi: "Đang gõ" },
  "type.nothingActive":   { en: "Type a letter to lock onto a word",
                            vi: "Gõ một chữ để khoá vào một word" },

  "tank.lives":           { en: "Lives",                vi: "Mạng" },
  "tank.enemies":         { en: "Left",                 vi: "Còn" },
  "tank.win":             { en: "Round clear",          vi: "Hết đợt" },
  "tank.winHint":         { en: "All tanks down. Generate a new map?",
                            vi: "Hạ hết xe tăng. Tạo map mới chứ?" },
  "tank.gameOver":        { en: "Tank down",            vi: "Tank đã rớt" },
  "tank.gameOverHint":    { en: "Out of lives. The next map will be different.",
                            vi: "Hết mạng. Map sau sẽ khác." },
  "tank.fire":            { en: "Fire",                 vi: "Bắn" },
  "tank.newMap":          { en: "New map",              vi: "Map mới" },
} as const;

export type TranslationKey = keyof typeof translations;

export function tr(lang: Lang, key: TranslationKey): string {
  return translations[key][lang];
}

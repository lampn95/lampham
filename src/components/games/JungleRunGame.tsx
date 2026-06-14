"use client";

/**
 * Jungle Run — a clean-room run-and-gun tribute (Phase 2).
 *
 * 100% original code & art. The genre (side-scrolling sprint + jump + shoot)
 * is inspired by classic 8-bit run-and-gun games, but every pixel here is
 * drawn from scratch with canvas primitives — no ripped sprites, no licensed
 * audio, no copied level data.
 *
 * Phase 2 additions over the first skeleton:
 *   - Detailed procedural commando: shaded body, red headband, animated legs
 *     while running, jump / crouch poses, 5-way aim, and a muzzle flash.
 *   - A real level: solid ground at varied heights, a water chasm spanned by
 *     a bridge, floating ledges, and a fortified gate at the far end.
 *   - Three enemy kinds — runners (melee), gunners (stop & shoot), and ground
 *     turrets (stationary, aim at you) — plus enemy bullets.
 *   - A boss gate cannon at the end of each stage with its own HP bar; destroy
 *     the core to clear the stage.
 *   - Layered parallax backdrop: gradient night sky, moon, two mountain bands,
 *     a tree line, and drifting fog.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { games } from "@/lib/games";
import { useT } from "@/lib/i18n";
import { GameShell, ScoreBar, useBestScore } from "./GameShell";

// ---------------------------- Tunables ----------------------------

const VIEW_W = 800;
const VIEW_H = 360;
const GROUND_Y = 296;              // top of the main ground band
const STAGE_W = 3600;              // total horizontal stage length

const PLAYER_W = 16;
const PLAYER_H = 32;
const PLAYER_H_CROUCH = 20;
const PLAYER_SPEED = 3.2;
const PLAYER_JUMP_V = -11;
const GRAVITY = 0.55;
const MAX_FALL = 13;

const BULLET_SPEED = 8;
const BULLET_LIFE_MS = 850;
const FIRE_COOLDOWN_MS = 165;

const ENEMY_W = 16;
const ENEMY_H = 28;
const RUNNER_SPEED = 1.5;
const GUNNER_SPEED = 1.0;

const ENEMY_BULLET_SPEED = 4.2;
const ENEMY_BULLET_LIFE_MS = 2600;

const SPAWN_INTERVAL_MIN_MS = 1100;
const SPAWN_INTERVAL_MAX_MS = 1900;

const START_LIVES = 3;
const INVULN_MS = 1500;

const BOSS_HP = 24;
const BOSS_X = 3460;

// ---------------------------- Types ----------------------------

type Vec = { x: number; y: number };

type Player = {
  pos: Vec;
  vel: Vec;
  onGround: boolean;
  facing: 1 | -1;
  aimUp: boolean;
  crouch: boolean;
  invulnUntil: number;
  runPhase: number;     // accumulates while running → leg swing
  lastShotAt: number;   // for muzzle flash
  h: number;            // current bounding-box height (stand vs crouch)
};

type Bullet = {
  pos: Vec;
  vel: Vec;
  bornAt: number;
};

type EnemyKind = "runner" | "gunner" | "turret";

type Enemy = {
  kind: EnemyKind;
  pos: Vec;
  vel: Vec;
  alive: boolean;
  baseY: number;
  hp: number;
  nextShotAt: number;
  walkPhase: number;
};

type Boss = {
  x: number;
  y: number;           // top of the gate column
  hp: number;
  alive: boolean;
  nextShotAt: number;
  hitFlashUntil: number;
};

type Platform = { x: number; y: number; w: number; h: number };
type WaterZone = { x: number; y: number; w: number; h: number };
type Tree = { x: number; h: number };

type Level = {
  platforms: Platform[];
  water: WaterZone[];
  turrets: Vec[];        // spawn points for ground turrets
  trees: Tree[];
};

// ---------------------------- Level ----------------------------

/**
 * Hand-laid stage. Every required jump is tuned to the jump arc: with
 * v0 = -11, g = 0.55 and 3.2 px/frame the player can clear roughly a 128px
 * gap at the same height (less when landing higher), so all forced gaps are
 * kept to ~100px and landing spots are never higher than the take-off.
 *
 * Layout: Segment A → bridge over the first chasm → Segment B (with a step
 * plateau) → two ~100px water gaps with a solid landing island between →
 * Segment C run-up → boss gate (which is also a solid wall).
 */
function buildLevel(): Level {
  const groundH = VIEW_H - GROUND_Y;

  const platforms: Platform[] = [
    // Segment A
    { x: 0, y: GROUND_Y, w: 1180, h: groundH },
    // Bridge across the first chasm (contiguous with both segments)
    { x: 1180, y: GROUND_Y, w: 360, h: 12 },
    // Segment B (ends at 2080) with a step plateau you climb over
    { x: 1540, y: GROUND_Y, w: 540, h: groundH },
    { x: 1860, y: GROUND_Y - 52, w: 150, h: 52 },   // plateau 1860..2010, leaves a 70px ground run-up before the gap
    // Second chasm: gap1 (2080→2180, 100px) · island (2180..2380) · gap2 (2380→2480, 100px)
    { x: 2180, y: GROUND_Y, w: 200, h: groundH },    // solid landing island
    { x: 2230, y: GROUND_Y - 70, w: 90, h: 14 },     // optional high cover ledge on the island
    // Segment C → run-up to boss
    { x: 2480, y: GROUND_Y, w: 1120, h: groundH },
    // Boss gate is also a solid wall so you can't run past it
    { x: BOSS_X + 40, y: 120, w: 60, h: GROUND_Y - 120 },
    // Scattered crates for cover / jumping
    { x: 420, y: GROUND_Y - 50, w: 96, h: 14 },
    { x: 720, y: GROUND_Y - 80, w: 80, h: 14 },
    { x: 980, y: GROUND_Y - 54, w: 110, h: 14 },
    { x: 2700, y: GROUND_Y - 58, w: 100, h: 14 },
    { x: 3000, y: GROUND_Y - 84, w: 84, h: 14 },
    { x: 3240, y: GROUND_Y - 56, w: 110, h: 14 },
  ];

  const water: WaterZone[] = [
    { x: 1180, y: GROUND_Y + 12, w: 360, h: VIEW_H - GROUND_Y - 12 }, // under the bridge (visual)
    { x: 2080, y: GROUND_Y + 4,  w: 100, h: VIEW_H - GROUND_Y - 4 },  // gap1
    { x: 2380, y: GROUND_Y + 4,  w: 100, h: VIEW_H - GROUND_Y - 4 },  // gap2
  ];

  const turrets: Vec[] = [
    { x: 900,  y: GROUND_Y - 18 },
    { x: 1700, y: GROUND_Y - 18 },
    { x: 2900, y: GROUND_Y - 18 },
    { x: 3180, y: GROUND_Y - 18 },
  ];

  // Deterministic-ish tree line for the mid parallax band.
  const trees: Tree[] = [];
  for (let i = 0; i < 60; i++) {
    trees.push({ x: i * 70, h: 26 + ((i * 37) % 18) });
  }

  return { platforms, water, turrets, trees };
}

// ---------------------------- Component ----------------------------

export function JungleRunGame() {
  const game = games.find((g) => g.slug === "contra")!;
  const t = useT();
  const [best, submitBest] = useBestScore(game.highScoreKey);

  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);

  const playerRef    = useRef<Player>(makePlayer());
  const bulletsRef   = useRef<Bullet[]>([]);
  const eBulletsRef  = useRef<Bullet[]>([]);
  const enemiesRef   = useRef<Enemy[]>([]);
  const bossRef      = useRef<Boss | null>(makeBoss());
  const levelRef     = useRef<Level>(buildLevel());
  const turretsSpawnedRef = useRef<boolean[]>(levelRef.current.turrets.map(() => false));
  const cameraXRef   = useRef(0);
  const keysRef      = useRef<Record<string, boolean>>({});
  const lastFireRef  = useRef(0);
  const nextSpawnRef = useRef(0);
  const lastFrameRef = useRef(0);
  const lastSafeXRef = useRef(30);
  const livesRef     = useRef(START_LIVES);
  const scoreRef     = useRef(0);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; born: number; color: string }[]>([]);

  const [score, setScore]   = useState(0);
  const [lives, setLives]   = useState(START_LIVES);
  const [stage, setStage]   = useState(1);
  const [bossHp, setBossHp] = useState(0);
  const [bossActive, setBossActive] = useState(false);
  const [running, setRunning] = useState(false);
  const [over, setOver]     = useState(false);
  const [cleared, setCleared] = useState(false);

  // ---------------------------- Reset ----------------------------

  const loadStage = useCallback(() => {
    playerRef.current = makePlayer();
    bulletsRef.current = [];
    eBulletsRef.current = [];
    enemiesRef.current = [];
    particlesRef.current = [];
    levelRef.current = buildLevel();
    turretsSpawnedRef.current = levelRef.current.turrets.map(() => false);
    bossRef.current = makeBoss();
    cameraXRef.current = 0;
    lastFireRef.current = 0;
    nextSpawnRef.current = 0;
    lastSafeXRef.current = 30;
    setBossActive(false);
    setBossHp(BOSS_HP);
    setCleared(false);
  }, []);

  const resetForStart = useCallback(() => {
    livesRef.current = START_LIVES;
    scoreRef.current = 0;
    setScore(0);
    setLives(START_LIVES);
    setStage(1);
    setOver(false);
    loadStage();
  }, [loadStage]);

  const resetForNextStage = useCallback(() => {
    setStage((s) => s + 1);
    loadStage();
  }, [loadStage]);

  // ---------------------------- Damage ----------------------------

  const loseLife = useCallback(() => {
    const p = playerRef.current;
    const now = performance.now();
    if (now < p.invulnUntil) return;
    p.invulnUntil = now + INVULN_MS;

    spawnParticles(p.pos.x + PLAYER_W / 2, p.pos.y + PLAYER_H / 2, "#fca5a5");

    const nextLives = Math.max(0, livesRef.current - 1);
    livesRef.current = nextLives;
    setLives(nextLives);

    if (nextLives <= 0) {
      setRunning(false);
      setOver(true);
      submitBest(scoreRef.current);
      return;
    }
    // Respawn at the last safe ground tile, standing, with i-frames.
    p.crouch = false;
    p.h = PLAYER_H;
    p.pos.x = lastSafeXRef.current;
    p.pos.y = GROUND_Y - PLAYER_H - 1;
    p.vel.x = 0;
    p.vel.y = 0;
    p.onGround = true;
  }, [submitBest]);

  function spawnParticles(x: number, y: number, color: string) {
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * 2 * i) / 10 + Math.random();
      const s = 1.5 + Math.random() * 2.5;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 1,
        born: performance.now(),
        color,
      });
    }
  }

  // ---------------------------- Sim step ----------------------------

  const step = useCallback(
    (now: number, dt: number) => {
      const player = playerRef.current;
      const keys = keysRef.current;
      const level = levelRef.current;

      const leftKey  = keys["arrowleft"]  || keys["a"];
      const rightKey = keys["arrowright"] || keys["d"];
      const upKey    = keys["arrowup"]    || keys["w"];
      const downKey  = keys["arrowdown"]  || keys["s"];
      const jumpKey  = keys["z"]          || keys[" "];
      const fireKey  = keys["x"]          || keys["j"];

      player.aimUp = !!upKey;
      player.crouch = !!downKey && player.onGround;

      let vx = 0;
      if (!player.crouch) {
        if (leftKey)  { vx -= PLAYER_SPEED; player.facing = -1; }
        if (rightKey) { vx += PLAYER_SPEED; player.facing = 1;  }
      }
      player.vel.x = vx;
      if (vx !== 0 && player.onGround) player.runPhase += 0.32;

      if (jumpKey && player.onGround && !player.crouch) {
        player.vel.y = PLAYER_JUMP_V;
        player.onGround = false;
      }

      player.vel.y = Math.min(MAX_FALL, player.vel.y + GRAVITY);
      moveAndCollide(player, level.platforms);

      if (player.pos.x < 0) player.pos.x = 0;
      if (player.pos.x > STAGE_W - PLAYER_W) player.pos.x = STAGE_W - PLAYER_W;
      if (player.onGround) lastSafeXRef.current = player.pos.x;
      // Touching the surface of a water gap (or falling off-screen) costs a
      // life. Use the body centre so you don't drown at the very lip of a
      // landing platform.
      if (!player.onGround) {
        const feet = player.pos.y + player.h;
        const cx = player.pos.x + PLAYER_W / 2;
        for (const w of level.water) {
          if (cx > w.x && cx < w.x + w.w && feet > w.y) {
            loseLife();
            break;
          }
        }
      }
      if (player.pos.y > VIEW_H + 120) loseLife();

      // Camera.
      const wantCam = player.pos.x - VIEW_W * 0.38;
      cameraXRef.current = Math.max(0, Math.min(STAGE_W - VIEW_W, wantCam));
      const cam = cameraXRef.current;

      // Fire.
      if (fireKey && now - lastFireRef.current >= FIRE_COOLDOWN_MS) {
        spawnBullet(player, now, bulletsRef.current);
        player.lastShotAt = now;
        lastFireRef.current = now;
      }

      // Player bullets.
      const bullets = bulletsRef.current;
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.pos.x += b.vel.x;
        b.pos.y += b.vel.y;
        if (now - b.bornAt > BULLET_LIFE_MS || b.pos.x < -20 || b.pos.x > STAGE_W + 20) {
          bullets.splice(i, 1);
        }
      }

      // Enemy bullets.
      const eb = eBulletsRef.current;
      for (let i = eb.length - 1; i >= 0; i--) {
        const b = eb[i];
        b.pos.x += b.vel.x;
        b.pos.y += b.vel.y;
        if (now - b.bornAt > ENEMY_BULLET_LIFE_MS || b.pos.x < -40 || b.pos.x > STAGE_W + 40 || b.pos.y > VIEW_H + 40) {
          eb.splice(i, 1);
        }
      }

      // Activate ground turrets as the camera reaches them.
      level.turrets.forEach((tp, idx) => {
        if (turretsSpawnedRef.current[idx]) return;
        if (tp.x < cam + VIEW_W + 40 && tp.x > cam - 40) {
          turretsSpawnedRef.current[idx] = true;
          enemiesRef.current.push({
            kind: "turret",
            pos: { x: tp.x, y: tp.y },
            vel: { x: 0, y: 0 },
            alive: true,
            baseY: tp.y,
            hp: 1,
            nextShotAt: now + 600 + Math.random() * 600,
            walkPhase: 0,
          });
        }
      });

      // Spawn walking enemies from the right (stop once boss is on screen).
      const bossOnScreen = bossRef.current && bossRef.current.x < cam + VIEW_W;
      const walkers = enemiesRef.current.filter((e) => e.kind !== "turret").length;
      if (!bossOnScreen && now >= nextSpawnRef.current && walkers < 5) {
        const kind: EnemyKind = Math.random() < 0.45 ? "gunner" : "runner";
        const x = cam + VIEW_W + 24 + Math.random() * 60;
        if (x < STAGE_W - 40) {
          enemiesRef.current.push({
            kind,
            pos: { x, y: GROUND_Y - ENEMY_H },
            vel: { x: -(kind === "runner" ? RUNNER_SPEED : GUNNER_SPEED), y: 0 },
            alive: true,
            baseY: GROUND_Y - ENEMY_H,
            hp: 1,
            nextShotAt: now + 700 + Math.random() * 800,
            walkPhase: 0,
          });
        }
        const range = SPAWN_INTERVAL_MAX_MS - SPAWN_INTERVAL_MIN_MS;
        const stageScale = Math.max(0.5, 1 - (stage - 1) * 0.09);
        nextSpawnRef.current = now + (SPAWN_INTERVAL_MIN_MS + Math.random() * range) * stageScale;
      }

      // Enemy update.
      const enemies = enemiesRef.current;
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        if (!e.alive) { enemies.splice(i, 1); continue; }

        if (e.kind === "runner") {
          e.pos.x += e.vel.x;
          e.walkPhase += 0.3;
          e.pos.y = e.baseY + Math.abs(Math.sin(e.walkPhase)) * -1.5;
        } else if (e.kind === "gunner") {
          // Walk in, then stop within firing range and shoot.
          const dx = player.pos.x - e.pos.x;
          if (Math.abs(dx) > 220) {
            e.pos.x += e.vel.x;
            e.walkPhase += 0.26;
          } else if (now >= e.nextShotAt && e.pos.x < cam + VIEW_W) {
            const dir = dx >= 0 ? 1 : -1;
            eb.push({
              pos: { x: e.pos.x + ENEMY_W / 2, y: e.pos.y + 10 },
              vel: { x: dir * ENEMY_BULLET_SPEED, y: 0 },
              bornAt: now,
            });
            e.nextShotAt = now + 1200 + Math.random() * 700;
          }
        } else {
          // Turret: stationary, aims at the player on an interval.
          if (now >= e.nextShotAt && e.pos.x < cam + VIEW_W + 20 && e.pos.x > cam - 20) {
            const v = aimVector(
              { x: e.pos.x + 8, y: e.pos.y },
              { x: player.pos.x + PLAYER_W / 2, y: player.pos.y + PLAYER_H / 2 },
              ENEMY_BULLET_SPEED,
            );
            eb.push({ pos: { x: e.pos.x + 8, y: e.pos.y }, vel: v, bornAt: now });
            e.nextShotAt = now + 1500 + Math.random() * 700;
          }
        }

        // Despawn walkers that drift far off the left of the camera.
        if (e.kind !== "turret" && e.pos.x + ENEMY_W < cam - 120) {
          enemies.splice(i, 1);
        }
      }

      // Boss update.
      const boss = bossRef.current;
      if (boss && boss.alive) {
        const onScreen = boss.x < cam + VIEW_W;
        if (onScreen && !bossActive) setBossActive(true);
        if (onScreen && now >= boss.nextShotAt) {
          // Spread of three aimed-ish bullets.
          const origin = { x: boss.x + 6, y: boss.y + 40 };
          const target = { x: player.pos.x + PLAYER_W / 2, y: player.pos.y + 10 };
          const base = aimVector(origin, target, ENEMY_BULLET_SPEED);
          for (const ang of [-0.32, 0, 0.32]) {
            eb.push({ pos: { ...origin }, vel: rotate(base, ang), bornAt: now });
          }
          boss.nextShotAt = now + 1100;
        }
      }

      // Player bullets ↔ enemies.
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        let consumed = false;
        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          if (!e.alive) continue;
          if (b.pos.x >= e.pos.x && b.pos.x <= e.pos.x + ENEMY_W &&
              b.pos.y >= e.pos.y && b.pos.y <= e.pos.y + ENEMY_H) {
            e.alive = false;
            consumed = true;
            spawnParticles(e.pos.x + ENEMY_W / 2, e.pos.y + ENEMY_H / 2, "#fca5a5");
            const gain = e.kind === "turret" ? 3 : e.kind === "gunner" ? 2 : 1;
            scoreRef.current += gain;
            setScore(scoreRef.current);
            break;
          }
        }
        // Boss core hit.
        if (!consumed && boss && boss.alive) {
          const core = { x: boss.x, y: boss.y + 24, w: 44, h: 44 };
          if (b.pos.x >= core.x && b.pos.x <= core.x + core.w &&
              b.pos.y >= core.y && b.pos.y <= core.y + core.h) {
            consumed = true;
            boss.hp -= 1;
            boss.hitFlashUntil = now + 90;
            setBossHp(boss.hp);
            spawnParticles(b.pos.x, b.pos.y, "#fbbf24");
            if (boss.hp <= 0) {
              boss.alive = false;
              scoreRef.current += 15;
              setScore(scoreRef.current);
              for (let k = 0; k < 4; k++) {
                spawnParticles(boss.x + Math.random() * 44, boss.y + 20 + Math.random() * 50, "#f97316");
              }
              setRunning(false);
              setCleared(true);
              submitBest(scoreRef.current);
            }
          }
        }
        if (consumed) bullets.splice(i, 1);
      }

      // Enemy bullets ↔ player. (pos.y is already the box top; crouching
      // shrinks the hitbox so you can duck under horizontal fire.)
      if (now > player.invulnUntil) {
        const pH = player.h;
        const pY = player.pos.y;
        for (let i = eb.length - 1; i >= 0; i--) {
          const b = eb[i];
          if (b.pos.x >= player.pos.x && b.pos.x <= player.pos.x + PLAYER_W &&
              b.pos.y >= pY && b.pos.y <= pY + pH) {
            eb.splice(i, 1);
            loseLife();
            break;
          }
        }
      }

      // Enemy bodies ↔ player.
      if (now > player.invulnUntil) {
        const pH = player.h;
        const pY = player.pos.y;
        for (const e of enemies) {
          if (!e.alive) continue;
          if (player.pos.x < e.pos.x + ENEMY_W && player.pos.x + PLAYER_W > e.pos.x &&
              pY < e.pos.y + ENEMY_H && pY + pH > e.pos.y) {
            loseLife();
            break;
          }
        }
      }

      // Particles.
      const ps = particlesRef.current;
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        if (now - p.born > 600) ps.splice(i, 1);
      }

      void dt;
    },
    [stage, submitBest, loseLife, bossActive],
  );

  // ---------------------------- Draw ----------------------------

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    const cam = cameraXRef.current;
    const now = performance.now();
    const level = levelRef.current;

    // Sky.
    const sky = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    sky.addColorStop(0, "#0d1830");
    sky.addColorStop(0.45, "#16324a");
    sky.addColorStop(0.8, "#1c4a35");
    sky.addColorStop(1, "#0c1b12");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    // Moon (fixed-ish, very slow parallax).
    const moonX = 640 - cam * 0.05;
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.arc(moonX, 70, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#16324a";
    ctx.beginPath();
    ctx.arc(moonX + 10, 64, 22, 0, Math.PI * 2);
    ctx.fill();

    drawParallax(ctx, cam, level.trees, now);

    // Water (behind terrain edges).
    for (const w of level.water) {
      const x = w.x - cam;
      if (x + w.w < 0 || x > VIEW_W) continue;
      const grad = ctx.createLinearGradient(0, w.y, 0, w.y + w.h);
      grad.addColorStop(0, "#1e6f8f");
      grad.addColorStop(1, "#0b2e3e");
      ctx.fillStyle = grad;
      ctx.fillRect(x, w.y, w.w, w.h);
      // Animated highlight lines.
      ctx.fillStyle = "rgba(186, 230, 253, 0.25)";
      for (let yy = 0; yy < w.h; yy += 8) {
        const off = (now / 30 + yy * 4) % w.w;
        ctx.fillRect(x + off, w.y + yy, 18, 2);
        ctx.fillRect(x + ((off + w.w / 2) % w.w), w.y + yy + 4, 12, 2);
      }
    }

    // Platforms / terrain.
    for (const pl of level.platforms) {
      const x = pl.x - cam;
      if (x + pl.w < 0 || x > VIEW_W) continue;
      if (pl.x === BOSS_X + 40) continue; // boss wall is drawn with the boss
      drawTerrain(ctx, x, pl.y, pl.w, pl.h);
    }

    // Enemies.
    for (const e of enemiesRef.current) {
      if (!e.alive) continue;
      if (e.kind === "turret") drawTurret(ctx, e.pos.x - cam, e.pos.y);
      else drawEnemy(ctx, e.pos.x - cam, e.pos.y, e.kind, e.walkPhase, e.vel.x);
    }

    // Boss gate.
    const boss = bossRef.current;
    if (boss && boss.alive) drawBoss(ctx, boss, cam, now);

    // Player.
    drawPlayer(ctx, playerRef.current, cam, now);

    // Player bullets.
    ctx.fillStyle = "#fde047";
    for (const b of bulletsRef.current) {
      const bx = b.pos.x - cam;
      ctx.fillRect(bx - 3, b.pos.y - 2, 6, 4);
      ctx.fillStyle = "rgba(253,224,71,0.4)";
      ctx.fillRect(bx - 6, b.pos.y - 1, 4, 2);
      ctx.fillStyle = "#fde047";
    }

    // Enemy bullets.
    for (const b of eBulletsRef.current) {
      const bx = b.pos.x - cam;
      ctx.fillStyle = "#fb923c";
      ctx.beginPath();
      ctx.arc(bx, b.pos.y, 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(254,215,170,0.6)";
      ctx.beginPath();
      ctx.arc(bx, b.pos.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Particles.
    for (const p of particlesRef.current) {
      const a = 1 - (now - p.born) / 600;
      ctx.globalAlpha = Math.max(0, a);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - cam - 1.5, p.y - 1.5, 3, 3);
    }
    ctx.globalAlpha = 1;

    // Foreground grass band.
    drawForeground(ctx, cam);

    // Progress + boss bar.
    drawStageBar(ctx, playerRef.current.pos.x, stage);
    if (boss && boss.alive && boss.x < cam + VIEW_W) {
      drawBossBar(ctx, boss.hp);
    }
  }, [stage]);

  // ---------------------------- Loop ----------------------------

  useEffect(() => {
    if (!running) { draw(); return; }
    const tick = (now: number) => {
      const last = lastFrameRef.current || now;
      const dt = Math.min(40, now - last);
      lastFrameRef.current = now;
      step(now, dt);
      draw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastFrameRef.current = 0;
    };
  }, [running, step, draw]);

  // ---------------------------- Input ----------------------------

  useEffect(() => {
    const captured = new Set([
      "arrowup", "arrowdown", "arrowleft", "arrowright",
      "w", "a", "s", "d", "z", "x", "j", " ",
    ]);
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (captured.has(k)) e.preventDefault();
      keysRef.current[k] = true;
      if (!running && !over && !cleared &&
          (k === "z" || k === "x" || k === " " || k === "arrowright" || k === "d")) {
        setRunning(true);
      }
      if (k === "enter") {
        if (over) { resetForStart(); setRunning(true); }
        else if (cleared) { resetForNextStage(); setRunning(true); }
      }
    };
    const onUp = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [running, over, cleared, resetForStart, resetForNextStage]);

  // Auto-pause on tab hide / window blur.
  useEffect(() => {
    const onHide = () => { if (document.hidden) { keysRef.current = {}; setRunning((r) => (r ? false : r)); } };
    const onBlur = () => { keysRef.current = {}; setRunning((r) => (r ? false : r)); };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  const press = useCallback((k: string, down: boolean) => {
    keysRef.current[k] = down;
    if (down && !running && !over && !cleared) setRunning(true);
  }, [running, over, cleared]);

  // ---------------------------- UI ----------------------------

  const handleStart = () => { resetForStart(); setRunning(true); };
  const handleNextStage = () => { resetForNextStage(); setRunning(true); };

  // Refs (level, boss, turret flags) are seeded at creation, so the first
  // paint just needs a draw — loadStage() only runs on start / next-stage to
  // avoid calling setState directly inside an effect.
  useEffect(() => { draw(); }, [draw]);

  return (
    <GameShell game={game}>
      <ScoreBar
        score={score}
        best={best}
        scoreLabel={t("game.score")}
        bestLabel={t("game.best")}
        extra={
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5">
              <span className="text-white/45">Lives: </span>
              <span className="text-white font-semibold">
                {"❤".repeat(Math.max(0, lives))}
                <span className="text-white/15">{"❤".repeat(Math.max(0, START_LIVES - lives))}</span>
              </span>
            </span>
            <span className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5">
              <span className="text-white/45">Stage: </span>
              <span className="text-white font-semibold">{stage}</span>
            </span>
          </div>
        }
      />

      <div ref={wrapRef} className="relative mt-4 flex justify-center">
        <canvas
          ref={canvasRef}
          width={VIEW_W}
          height={VIEW_H}
          className="rounded-2xl border border-white/10 bg-black/40 shadow-[0_20px_60px_rgba(0,0,0,0.55)] max-w-full touch-none"
          style={{ touchAction: "none", imageRendering: "pixelated" }}
        />

        {!running && !over && !cleared && (
          <Overlay>
            <p className="text-sm text-white/70">{t("game.gameStartHint")}</p>
            <p className="text-xs text-white/55 max-w-sm">
              ↑↓←→ / WASD = move · Z = jump · X = shoot · ↑+X aim up · ↓ crouch
            </p>
            <button onClick={handleStart} className={primaryBtn}>{t("game.start")}</button>
          </Overlay>
        )}
        {over && (
          <Overlay>
            <div className="text-2xl">💀</div>
            <p className="text-lg font-semibold text-white">Out of lives</p>
            <p className="text-sm font-mono text-white/55">
              {t("game.score")}: <span className="text-white">{score}</span>
              {" · "}
              {t("game.best")}: <span className="text-white">{Math.max(best, score)}</span>
            </p>
            <button onClick={handleStart} className={primaryBtn}>{t("game.restart")}</button>
          </Overlay>
        )}
        {cleared && (
          <Overlay>
            <div className="text-2xl">🏆</div>
            <p className="text-lg font-semibold text-white">Gate destroyed — Stage {stage} clear</p>
            <p className="text-sm text-white/65">Stage {stage + 1} sends more troops your way.</p>
            <button onClick={handleNextStage} className={primaryBtn}>Next stage</button>
          </Overlay>
        )}
      </div>

      {/* Boss health (DOM bar under canvas as a fallback hint) */}
      {bossActive && bossHp > 0 && !cleared && (
        <div className="mt-3 mx-auto max-w-xs">
          <div className="flex items-center gap-2 text-xs font-mono text-white/60">
            <span className="text-rose-300">GATE</span>
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all"
                style={{ width: `${(bossHp / BOSS_HP) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <MobileControls onPress={press} />
    </GameShell>
  );
}

// ---------------------------- Physics helpers ----------------------------

function makePlayer(): Player {
  return {
    pos: { x: 30, y: GROUND_Y - PLAYER_H - 1 },
    vel: { x: 0, y: 0 },
    onGround: true,
    facing: 1,
    aimUp: false,
    crouch: false,
    invulnUntil: 0,
    runPhase: 0,
    lastShotAt: -9999,
    h: PLAYER_H,
  };
}

function makeBoss(): Boss {
  return {
    x: BOSS_X,
    y: 150,
    hp: BOSS_HP,
    alive: true,
    nextShotAt: 0,
    hitFlashUntil: 0,
  };
}

function moveAndCollide(p: Player, platforms: Platform[]) {
  const w = PLAYER_W;
  // pos.y is the TOP of the current bounding box. When the crouch state
  // toggles, the box height changes — keep the FEET anchored by shifting the
  // top by the height delta (otherwise the player sinks into / pops out of
  // the floor, which previously let a crouch on the thin bridge drop you into
  // the river).
  const newH = p.crouch ? PLAYER_H_CROUCH : PLAYER_H;
  if (newH !== p.h) {
    p.pos.y += p.h - newH;
    p.h = newH;
  }
  const h = newH;

  p.pos.x += p.vel.x;
  for (const pl of platforms) {
    if (aabb(p.pos.x, p.pos.y, w, h, pl)) {
      if (p.vel.x > 0)      p.pos.x = pl.x - w;
      else if (p.vel.x < 0) p.pos.x = pl.x + pl.w;
      p.vel.x = 0;
    }
  }

  p.onGround = false;
  p.pos.y += p.vel.y;
  for (const pl of platforms) {
    if (aabb(p.pos.x, p.pos.y, w, h, pl)) {
      if (p.vel.y > 0) { p.pos.y = pl.y - h; p.onGround = true; }
      else if (p.vel.y < 0) { p.pos.y = pl.y + pl.h; }
      p.vel.y = 0;
    }
  }
}

function aabb(x: number, y: number, w: number, h: number, pl: Platform): boolean {
  return x < pl.x + pl.w && x + w > pl.x && y < pl.y + pl.h && y + h > pl.y;
}

function spawnBullet(p: Player, now: number, bullets: Bullet[]) {
  const movingX = p.vel.x !== 0;
  let vx: number, vy: number;
  if (p.aimUp && !movingX && p.onGround) { vx = 0; vy = -BULLET_SPEED; }
  else if (p.aimUp) { vx = p.facing * BULLET_SPEED * 0.707; vy = -BULLET_SPEED * 0.707; }
  else { vx = p.facing * BULLET_SPEED; vy = 0; }

  const muzzle = muzzlePoint(p);
  bullets.push({ pos: { x: muzzle.x, y: muzzle.y }, vel: { x: vx, y: vy }, bornAt: now });
}

function muzzlePoint(p: Player): Vec {
  const cx = p.pos.x + PLAYER_W / 2;
  if (p.aimUp && p.vel.x === 0 && p.onGround) {
    return { x: cx, y: p.pos.y - 4 };
  }
  if (p.aimUp) {
    return { x: cx + p.facing * 10, y: p.pos.y - 2 };
  }
  const gunY = p.pos.y + (p.crouch ? 12 : 14);
  return { x: cx + p.facing * 12, y: gunY };
}

function aimVector(from: Vec, to: Vec, speed: number): Vec {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: (dx / len) * speed, y: (dy / len) * speed };
}

function rotate(v: Vec, ang: number): Vec {
  const c = Math.cos(ang), s = Math.sin(ang);
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
}

// ---------------------------- Render helpers ----------------------------

function drawTerrain(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  // Top grass stripe.
  ctx.fillStyle = "#3f9a4e";
  ctx.fillRect(x, y, w, 4);
  ctx.fillStyle = "#2d6f3a";
  ctx.fillRect(x, y + 4, w, 3);
  // Dirt body.
  ctx.fillStyle = "#5a3b22";
  ctx.fillRect(x, y + 7, w, h - 7);
  // Dirt texture specks.
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  for (let dx = 6; dx < w; dx += 18) {
    for (let dy = 12; dy < h; dy += 16) {
      ctx.fillRect(x + dx + ((dy / 16) % 2 === 0 ? 0 : 8), y + dy, 3, 3);
    }
  }
  // Grass tufts on the lip.
  ctx.fillStyle = "#4cb85e";
  for (let dx = 4; dx < w; dx += 22) {
    ctx.fillRect(x + dx, y - 3, 2, 3);
    ctx.fillRect(x + dx + 3, y - 5, 2, 5);
    ctx.fillRect(x + dx + 6, y - 3, 2, 3);
  }
}

function px(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

function drawPlayer(ctx: CanvasRenderingContext2D, p: Player, cam: number, now: number) {
  const baseX = p.pos.x - cam;
  const h = p.h;            // pos.y is the box top; sprite is drawn from there
  const y = p.pos.y;
  const f = p.facing;

  // Ground shadow sits at the feet (box bottom).
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(baseX + PLAYER_W / 2, p.pos.y + h + 1, PLAYER_W / 2, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // I-frame flicker.
  if (now < p.invulnUntil && Math.floor(now / 70) % 2 === 0) return;

  // Mirror by translating to player center, scaling X by facing.
  ctx.save();
  ctx.translate(baseX + PLAYER_W / 2, y);
  ctx.scale(f, 1);
  ctx.translate(-PLAYER_W / 2, 0);

  const OUT = "#10141c";
  const SKIN = "#f2c48a";
  const SKIN_SH = "#cf9a5e";
  const BAND = "#ef4444";
  const VEST = "#e7e3c8";
  const VEST_SH = "#b3b094";
  const PANTS = "#33507a";
  const PANTS_SH = "#27405f";
  const BOOT = "#161620";
  const GUN = "#aab3bd";

  if (p.crouch) {
    // Compact crouch pose.
    px(ctx, 3, 0, 10, 3, OUT);
    px(ctx, 3, 2, 10, 3, BAND);
    px(ctx, 4, 5, 8, 4, SKIN);
    px(ctx, 9, 6, 2, 2, SKIN_SH);
    px(ctx, 2, 9, 12, 7, VEST);
    px(ctx, 2, 13, 12, 3, VEST_SH);
    px(ctx, 2, 16, 12, 4, PANTS);
    px(ctx, 1, 18, 6, 2, BOOT);
    px(ctx, 9, 18, 6, 2, BOOT);
    // Gun forward.
    const gy = 12;
    px(ctx, 12, gy, 10, 3, GUN);
    px(ctx, 20, gy - 1, 3, 4, GUN);
    if (now - p.lastShotAt < 70) px(ctx, 22, gy - 2, 5, 6, "#fde047");
    ctx.restore();
    return;
  }

  // Legs (animated swing while running, neutral otherwise).
  const swing = p.onGround && p.vel.x !== 0 ? Math.sin(p.runPhase) * 3 : 0;
  const airborne = !p.onGround;
  if (airborne) {
    // Tucked jump legs.
    px(ctx, 4, 22, 4, 7, PANTS);
    px(ctx, 9, 20, 4, 7, PANTS);
    px(ctx, 3, 27, 5, 3, BOOT);
    px(ctx, 9, 25, 5, 3, BOOT);
  } else {
    px(ctx, 5, 22, 4, 8 - Math.max(0, swing), PANTS);
    px(ctx, 8, 22, 4, 8 + Math.min(0, swing), PANTS_SH);
    px(ctx, 4 + swing, 28, 5, 3, BOOT);
    px(ctx, 9 - swing, 28, 5, 3, BOOT);
  }

  // Torso / vest.
  px(ctx, 3, 12, 11, 11, VEST);
  px(ctx, 3, 19, 11, 4, VEST_SH);
  px(ctx, 2, 12, 2, 9, OUT);      // left outline
  px(ctx, 13, 12, 2, 9, OUT);     // right outline
  // Belt.
  px(ctx, 3, 22, 11, 2, "#7a5a2a");

  // Head.
  px(ctx, 4, 1, 9, 4, OUT);       // hair/top
  px(ctx, 4, 3, 9, 3, BAND);      // headband
  px(ctx, 5, 6, 7, 5, SKIN);      // face
  px(ctx, 9, 7, 2, 2, SKIN_SH);   // cheek shade
  px(ctx, 10, 7, 1, 1, OUT);      // eye
  // Headband tail flapping back.
  px(ctx, 1, 4, 3, 2, BAND);
  px(ctx, 0, 5, 2, 2, BAND);

  // Arm + gun by aim.
  if (p.aimUp && p.vel.x === 0) {
    // Straight up.
    px(ctx, 9, 4, 3, 9, VEST);
    px(ctx, 9, 0, 3, 5, GUN);
    px(ctx, 8, -4, 5, 5, GUN);
    if (now - p.lastShotAt < 70) px(ctx, 7, -8, 7, 6, "#fde047");
  } else if (p.aimUp) {
    // Diagonal up-forward.
    px(ctx, 11, 8, 4, 3, VEST);
    px(ctx, 14, 3, 6, 3, GUN);
    px(ctx, 18, 0, 4, 4, GUN);
    if (now - p.lastShotAt < 70) px(ctx, 20, -3, 6, 6, "#fde047");
  } else {
    // Horizontal forward.
    px(ctx, 11, 13, 4, 3, VEST);
    px(ctx, 14, 13, 10, 3, GUN);
    px(ctx, 22, 12, 3, 4, GUN);
    if (now - p.lastShotAt < 70) {
      px(ctx, 24, 11, 6, 5, "#fde047");
      px(ctx, 28, 12, 4, 3, "#fb923c");
    }
  }

  ctx.restore();
}

function drawEnemy(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, kind: EnemyKind, phase: number, vx: number,
) {
  const f = vx > 0 ? 1 : -1;
  ctx.save();
  ctx.translate(x + ENEMY_W / 2, y);
  ctx.scale(f, 1);
  ctx.translate(-ENEMY_W / 2, 0);

  const OUT = "#1a0c0c";
  const HELM = kind === "gunner" ? "#5b6b3a" : "#8a1f1f";
  const BODY = kind === "gunner" ? "#7d8a4f" : "#c2413f";
  const BODY_SH = kind === "gunner" ? "#5f6b3c" : "#8f2e2c";
  const PANTS = "#26303f";
  const SKIN = "#e2b483";
  const GUN = "#9aa3ad";

  const swing = Math.sin(phase) * 2.5;
  // Legs.
  px(ctx, 4 + swing, 22, 4, 6, PANTS);
  px(ctx, 8 - swing, 22, 4, 6, PANTS);
  // Torso.
  px(ctx, 3, 10, 10, 12, BODY);
  px(ctx, 3, 17, 10, 5, BODY_SH);
  px(ctx, 2, 10, 2, 10, OUT);
  px(ctx, 12, 10, 2, 10, OUT);
  // Head + helmet.
  px(ctx, 4, 1, 9, 4, HELM);
  px(ctx, 5, 5, 7, 4, SKIN);
  px(ctx, 9, 6, 1, 1, OUT);
  // Gun (gunners hold it forward; runners have it down).
  if (kind === "gunner") {
    px(ctx, 11, 11, 9, 3, GUN);
    px(ctx, 18, 10, 3, 4, GUN);
  } else {
    px(ctx, 11, 16, 7, 3, GUN);
  }
  ctx.restore();
}

function drawTurret(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Sandbag base.
  px(ctx, x - 2, y + 8, 22, 10, "#6b5a33");
  px(ctx, x - 2, y + 8, 22, 3, "#83703f");
  for (let i = 0; i < 3; i++) px(ctx, x + i * 7, y + 12, 5, 5, "#564726");
  // Dome.
  ctx.fillStyle = "#475569";
  ctx.beginPath();
  ctx.arc(x + 8, y + 9, 9, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = "#64748b";
  ctx.beginPath();
  ctx.arc(x + 8, y + 9, 9, Math.PI, Math.PI * 1.5);
  ctx.fill();
  // Barrel.
  px(ctx, x + 6, y - 4, 5, 8, "#334155");
  px(ctx, x + 6, y - 6, 5, 3, "#1e293b");
}

function drawBoss(ctx: CanvasRenderingContext2D, boss: Boss, cam: number, now: number) {
  const x = boss.x - cam;
  const y = boss.y;
  // Fortress wall above and below the core.
  px(ctx, x - 6, 110, 56, GROUND_Y - 110, "#3a4250");
  px(ctx, x - 6, 110, 56, 6, "#4b5563");
  // Rivets.
  ctx.fillStyle = "#1f2733";
  for (let yy = 120; yy < GROUND_Y; yy += 22) {
    px(ctx, x - 2, yy, 3, 3, "#1f2733");
    px(ctx, x + 44, yy, 3, 3, "#1f2733");
  }
  // Core housing.
  px(ctx, x - 4, y + 18, 52, 56, "#283041");
  // Core (glows / flashes when hit).
  const flash = now < boss.hitFlashUntil;
  const coreCx = x + 22;
  const coreCy = y + 46;
  const grad = ctx.createRadialGradient(coreCx, coreCy, 2, coreCx, coreCy, 22);
  if (flash) {
    grad.addColorStop(0, "#fff");
    grad.addColorStop(1, "#fca5a5");
  } else {
    const pulse = 0.5 + 0.5 * Math.sin(now / 180);
    grad.addColorStop(0, "#fde68a");
    grad.addColorStop(0.6, `rgba(249,115,22,${0.7 + pulse * 0.3})`);
    grad.addColorStop(1, "#7c2d12");
  }
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(coreCx, coreCy, 20, 0, Math.PI * 2);
  ctx.fill();
  // Core iris.
  ctx.fillStyle = flash ? "#ef4444" : "#7c2d12";
  ctx.beginPath();
  ctx.arc(coreCx, coreCy, 7, 0, Math.PI * 2);
  ctx.fill();
  // Muzzle port below core.
  px(ctx, x - 2, y + 36, 6, 10, "#0f1620");
}

function drawParallax(
  ctx: CanvasRenderingContext2D, cam: number, trees: Tree[], now: number,
) {
  // Far mountain band.
  ctx.fillStyle = "rgba(20, 44, 60, 0.9)";
  const m1 = (cam * 0.12) % 320;
  for (let i = -1; i < 5; i++) {
    const cx = i * 320 - m1;
    ctx.beginPath();
    ctx.moveTo(cx, GROUND_Y);
    ctx.lineTo(cx + 160, 150);
    ctx.lineTo(cx + 320, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }
  // Near hills.
  ctx.fillStyle = "rgba(15, 50, 34, 0.95)";
  const m2 = (cam * 0.28) % 240;
  for (let i = -1; i < 6; i++) {
    const cx = i * 240 - m2;
    ctx.beginPath();
    ctx.arc(cx + 120, GROUND_Y + 30, 140, Math.PI, 0);
    ctx.fill();
  }
  // Tree line.
  const treeOff = cam * 0.5;
  ctx.fillStyle = "rgba(10, 30, 18, 0.96)";
  for (const tr of trees) {
    const cx = tr.x - treeOff;
    if (cx < -40 || cx > VIEW_W + 40) continue;
    px(ctx, cx + 9, GROUND_Y - tr.h, 4, tr.h, "rgba(10,24,14,0.96)");
    ctx.beginPath();
    ctx.arc(cx + 11, GROUND_Y - tr.h - 4, 13, 0, Math.PI * 2);
    ctx.fill();
  }
  // Drifting fog.
  ctx.fillStyle = "rgba(120, 170, 140, 0.06)";
  const fog = (now / 60) % (VIEW_W + 200);
  ctx.fillRect(-200 + fog, GROUND_Y - 60, 200, 60);
  ctx.fillRect(-200 + ((fog + 400) % (VIEW_W + 200)), GROUND_Y - 40, 160, 40);
}

function drawForeground(ctx: CanvasRenderingContext2D, cam: number) {
  // Foreground grass blades scrolling slightly faster than the camera.
  ctx.fillStyle = "rgba(8, 22, 12, 0.9)";
  const off = (cam * 1.15) % 24;
  for (let x = -off; x < VIEW_W; x += 24) {
    ctx.fillRect(x, VIEW_H - 8, 3, 8);
    ctx.fillRect(x + 6, VIEW_H - 12, 3, 12);
    ctx.fillRect(x + 12, VIEW_H - 6, 3, 6);
  }
}

function drawStageBar(ctx: CanvasRenderingContext2D, px0: number, stageN: number) {
  const barW = 200, barH = 6, x = VIEW_W - barW - 12, y = 12;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(x, y, barW, barH);
  const t = Math.max(0, Math.min(1, px0 / STAGE_W));
  ctx.fillStyle = "#84cc16";
  ctx.fillRect(x, y, Math.round(barW * t), barH);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "10px monospace";
  ctx.textAlign = "right";
  ctx.fillText(`STAGE ${stageN}`, x + barW, y + 18);
  ctx.textAlign = "left";
}

function drawBossBar(ctx: CanvasRenderingContext2D, hp: number) {
  const barW = 220, barH = 8, x = (VIEW_W - barW) / 2, y = 14;
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(x - 3, y - 3, barW + 6, barH + 6);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(x, y, barW, barH);
  const t = Math.max(0, hp / BOSS_HP);
  const grad = ctx.createLinearGradient(x, 0, x + barW, 0);
  grad.addColorStop(0, "#ef4444");
  grad.addColorStop(1, "#f97316");
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, Math.round(barW * t), barH);
  ctx.fillStyle = "#fecaca";
  ctx.font = "9px monospace";
  ctx.textAlign = "center";
  ctx.fillText("GATE CORE", VIEW_W / 2, y + barH + 10);
  ctx.textAlign = "left";
}

// ---------------------------- UI bits ----------------------------

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 rounded-2xl backdrop-blur-sm bg-black/55 flex flex-col items-center justify-center gap-3 px-6 text-center">
      {children}
    </div>
  );
}

const primaryBtn =
  "mt-2 inline-flex h-10 items-center gap-2 rounded-full bg-white text-black px-5 text-sm font-medium hover:bg-white/90 transition-colors";

function MobileControls({ onPress }: { onPress: (k: string, down: boolean) => void }) {
  const btn =
    "h-12 w-12 inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-white/80 hover:text-white active:scale-95 transition-all text-lg select-none";
  const wide =
    "h-12 w-20 inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-white/80 hover:text-white active:scale-95 transition-all text-sm font-medium select-none";
  const bind = (k: string) => ({
    onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); onPress(k, true); },
    onPointerUp: (e: React.PointerEvent) => { e.preventDefault(); onPress(k, false); },
    onPointerLeave: () => onPress(k, false),
    onPointerCancel: () => onPress(k, false),
  });
  return (
    <div className="mt-6 flex items-center justify-between gap-4 max-w-md mx-auto sm:hidden">
      <div className="grid grid-cols-3 gap-1.5">
        <div />
        <button className={btn} {...bind("arrowup")} aria-label="Up">▲</button>
        <div />
        <button className={btn} {...bind("arrowleft")} aria-label="Left">◀</button>
        <button className={btn} {...bind("arrowdown")} aria-label="Down">▼</button>
        <button className={btn} {...bind("arrowright")} aria-label="Right">▶</button>
      </div>
      <div className="flex flex-col gap-2">
        <button className={wide} {...bind("x")} aria-label="Shoot">FIRE</button>
        <button className={wide} {...bind("z")} aria-label="Jump">JUMP</button>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState, useCallback } from "react";
import Icon from "@/components/ui/icon";

const LANES = [1, 2, 3];
const LANE_X: Record<number, number> = { 1: 160, 2: 320, 3: 480 };
const CANVAS_W = 640;
const CANVAS_H = 480;
const GROUND_Y = 380;
const PLAYER_W = 36;
const PLAYER_H = 52;
const OBS_W = 34;
const OBS_H = 50;
const COIN_R = 12;
const JUMP_VEL = -16;
const GRAVITY = 0.7;

interface Obstacle {
  id: number;
  lane: number;
  y: number;
  type: "barrier" | "train";
}

interface Coin {
  id: number;
  lane: number;
  y: number;
  collected: boolean;
}

let idCounter = 0;

export default function SubwayGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    lane: 2,
    targetLane: 2,
    laneX: LANE_X[2],
    playerY: GROUND_Y,
    velY: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    coins: [] as Coin[],
    score: 0,
    coins_count: 0,
    speed: 4,
    frame: 0,
    running: false,
    dead: false,
    spawnTimer: 0,
    coinTimer: 0,
  });
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "running" | "dead">("idle");
  const animRef = useRef<number>(0);

  const resetState = () => {
    const s = stateRef.current;
    s.lane = 2; s.targetLane = 2; s.laneX = LANE_X[2];
    s.playerY = GROUND_Y; s.velY = 0; s.isJumping = false;
    s.obstacles = []; s.coins = [];
    s.score = 0; s.coins_count = 0; s.speed = 4;
    s.frame = 0; s.running = true; s.dead = false;
    s.spawnTimer = 0; s.coinTimer = 0;
  };

  const drawScene = useCallback((ctx: CanvasRenderingContext2D) => {
    const s = stateRef.current;

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    sky.addColorStop(0, "#1a1a2e");
    sky.addColorStop(1, "#16213e");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Buildings BG
    ctx.fillStyle = "#0f3460";
    for (let i = 0; i < 8; i++) {
      const bx = ((i * 90 + s.frame * 0.5) % (CANVAS_W + 80)) - 40;
      const bh = 80 + (i % 3) * 40;
      ctx.fillRect(bx, GROUND_Y - bh - 20, 60, bh);
      ctx.fillStyle = "#e94560";
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if ((i + r + c) % 2 === 0)
            ctx.fillRect(bx + 8 + c * 17, GROUND_Y - bh - 20 + 10 + r * 22, 12, 14);
        }
      }
      ctx.fillStyle = "#0f3460";
    }

    // Ground
    ctx.fillStyle = "#2d2d2d";
    ctx.fillRect(0, GROUND_Y + PLAYER_H, CANVAS_W, CANVAS_H - GROUND_Y - PLAYER_H);

    // Lane lines
    for (let i = 0; i < 3; i++) {
      const lx = LANE_X[i + 1 as 1];
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 2;
      ctx.setLineDash([30, 20]);
      ctx.lineDashOffset = -(s.frame * s.speed) % 50;
      ctx.beginPath();
      ctx.moveTo(lx, GROUND_Y + PLAYER_H);
      ctx.lineTo(lx, CANVAS_H);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Coins
    s.coins.forEach((coin) => {
      if (coin.collected) return;
      const cx = LANE_X[coin.lane as 1];
      const cy = coin.y;
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#FFD700";
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(cx, cy, COIN_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFA500";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", cx, cy);
      ctx.restore();
    });

    // Obstacles
    s.obstacles.forEach((obs) => {
      const ox = LANE_X[obs.lane as 1] - OBS_W / 2;
      const oy = obs.y;
      if (obs.type === "barrier") {
        ctx.fillStyle = "#e94560";
        ctx.fillRect(ox, oy, OBS_W, OBS_H);
        ctx.fillStyle = "#ff6b6b";
        ctx.fillRect(ox + 4, oy + 4, OBS_W - 8, 8);
        ctx.fillRect(ox + 4, oy + OBS_H - 12, OBS_W - 8, 8);
      } else {
        ctx.fillStyle = "#4a90d9";
        ctx.fillRect(ox - 10, oy, OBS_W + 20, OBS_H);
        ctx.fillStyle = "#357abd";
        for (let w = 0; w < 3; w++) {
          ctx.fillRect(ox - 6 + w * 16, oy + 8, 12, 20);
        }
      }
    });

    // Player
    const px = s.laneX;
    const py = s.playerY;
    // Body
    ctx.fillStyle = "#e94560";
    ctx.fillRect(px - 14, py, 28, 30);
    // Head
    ctx.fillStyle = "#f4c18e";
    ctx.beginPath();
    ctx.arc(px, py - 12, 14, 0, Math.PI * 2);
    ctx.fill();
    // Cap
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(px - 15, py - 22, 30, 8);
    ctx.fillRect(px - 10, py - 30, 20, 10);
    // Legs
    const legAnim = Math.sin(s.frame * 0.3) * 8;
    ctx.fillStyle = "#2d2d2d";
    ctx.fillRect(px - 12, py + 30, 10, 22 + legAnim);
    ctx.fillRect(px + 2, py + 30, 10, 22 - legAnim);

    // Score overlay
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(10, 10, 180, 50);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px 'Golos Text', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Очки: ${s.score}`, 22, 32);
    ctx.fillStyle = "#FFD700";
    ctx.fillText(`Монеты: ${s.coins_count}`, 22, 52);
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    if (!s.running) return;

    s.frame++;
    s.score = Math.floor(s.frame / 6);
    s.speed = 4 + Math.floor(s.frame / 300) * 0.5;

    // Smooth lane change
    const targetX = LANE_X[s.targetLane as 1];
    s.laneX += (targetX - s.laneX) * 0.18;

    // Jump physics
    if (s.isJumping) {
      s.velY += GRAVITY;
      s.playerY += s.velY;
      if (s.playerY >= GROUND_Y) {
        s.playerY = GROUND_Y;
        s.velY = 0;
        s.isJumping = false;
      }
    }

    // Spawn obstacles
    s.spawnTimer++;
    const spawnInterval = Math.max(60, 110 - Math.floor(s.frame / 200) * 5);
    if (s.spawnTimer >= spawnInterval) {
      s.spawnTimer = 0;
      const lane = LANES[Math.floor(Math.random() * 3)];
      const type = Math.random() > 0.4 ? "barrier" : "train";
      s.obstacles.push({ id: idCounter++, lane, y: -OBS_H, type });
    }

    // Spawn coins
    s.coinTimer++;
    if (s.coinTimer >= 45) {
      s.coinTimer = 0;
      const lane = LANES[Math.floor(Math.random() * 3)];
      s.coins.push({ id: idCounter++, lane, y: -COIN_R, collected: false });
    }

    // Move obstacles
    s.obstacles.forEach((obs) => { obs.y += s.speed; });
    s.obstacles = s.obstacles.filter((obs) => obs.y < CANVAS_H + 60);

    // Move coins
    s.coins.forEach((c) => { c.y += s.speed; });
    s.coins = s.coins.filter((c) => c.y < CANVAS_H + 30);

    // Collect coins
    s.coins.forEach((coin) => {
      if (coin.collected) return;
      const dx = Math.abs(s.laneX - LANE_X[coin.lane as 1]);
      const dy = Math.abs((s.playerY + PLAYER_H / 2) - coin.y);
      if (dx < 30 && dy < 40) {
        coin.collected = true;
        s.coins_count++;
      }
    });

    // Collision with obstacles
    for (const obs of s.obstacles) {
      const dx = Math.abs(s.laneX - LANE_X[obs.lane as 1]);
      const playerBottom = s.playerY + PLAYER_H;
      const obsTop = obs.y;
      const obsBottom = obs.y + OBS_H;
      const playerTop = s.playerY;
      if (dx < (PLAYER_W / 2 + OBS_W / 2 - 6) &&
          playerBottom > obsTop + 8 &&
          playerTop < obsBottom) {
        s.running = false;
        s.dead = true;
        setScore(s.score);
        setCoins(s.coins_count);
        setGameState("dead");
        drawScene(ctx);
        return;
      }
    }

    setScore(s.score);
    setCoins(s.coins_count);
    drawScene(ctx);
    animRef.current = requestAnimationFrame(gameLoop);
  }, [drawScene]);

  const startGame = () => {
    resetState();
    setScore(0);
    setCoins(0);
    setGameState("running");
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw idle screen
    const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    sky.addColorStop(0, "#1a1a2e");
    sky.addColorStop(1, "#16213e");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = "#e94560";
    ctx.font = "bold 36px 'Cormorant', serif";
    ctx.textAlign = "center";
    ctx.fillText("SUBWAY RUN", CANVAS_W / 2, CANVAS_H / 2 - 20);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "18px 'Golos Text', sans-serif";
    ctx.fillText("Нажми СТАРТ чтобы играть", CANVAS_W / 2, CANVAS_H / 2 + 20);

    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    if (gameState !== "running") return;

    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (!s.running) return;
      if (e.key === "ArrowLeft" && s.targetLane > 1) s.targetLane--;
      if (e.key === "ArrowRight" && s.targetLane < 3) s.targetLane++;
      if ((e.key === "ArrowUp" || e.key === " ") && !s.isJumping) {
        s.isJumping = true;
        s.velY = JUMP_VEL;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState]);

  const handleSwipe = (() => {
    let startX = 0;
    let startY = 0;
    return {
      onTouchStart: (e: React.TouchEvent) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      onTouchEnd: (e: React.TouchEvent) => {
        const s = stateRef.current;
        if (!s.running) return;
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx < -30 && s.targetLane > 1) s.targetLane--;
          if (dx > 30 && s.targetLane < 3) s.targetLane++;
        } else {
          if (dy < -30 && !s.isJumping) {
            s.isJumping = true;
            s.velY = JUMP_VEL;
          }
        }
      },
    };
  })();

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded border border-border max-w-full"
          style={{ touchAction: "none" }}
          {...handleSwipe}
        />
        {gameState === "dead" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded">
            <h2 className="font-display text-5xl text-white mb-2">Конец!</h2>
            <p className="font-body text-lg text-white/80 mb-1">Очки: <span className="text-yellow-400 font-bold">{score}</span></p>
            <p className="font-body text-lg text-white/80 mb-6">Монеты: <span className="text-yellow-400 font-bold">{coins}</span></p>
            <button
              onClick={startGame}
              className="px-10 py-3 bg-red-500 text-white font-body text-sm tracking-widest uppercase hover:bg-red-600 transition-colors"
            >
              Ещё раз
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 w-full max-w-xs justify-between">
        <button
          onClick={() => { const s = stateRef.current; if (s.running && s.targetLane > 1) s.targetLane--; }}
          className="w-14 h-14 border border-border flex items-center justify-center hover:bg-secondary/50 transition-colors active:bg-secondary"
        >
          <Icon name="ChevronLeft" size={24} />
        </button>

        {gameState !== "running" ? (
          <button
            onClick={startGame}
            className="flex-1 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:opacity-80 transition-opacity"
          >
            {gameState === "dead" ? "Заново" : "Старт"}
          </button>
        ) : (
          <button
            onClick={() => { const s = stateRef.current; if (!s.isJumping) { s.isJumping = true; s.velY = JUMP_VEL; } }}
            className="flex-1 py-3 border border-foreground font-body text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            Прыжок ↑
          </button>
        )}

        <button
          onClick={() => { const s = stateRef.current; if (s.running && s.targetLane < 3) s.targetLane++; }}
          className="w-14 h-14 border border-border flex items-center justify-center hover:bg-secondary/50 transition-colors active:bg-secondary"
        >
          <Icon name="ChevronRight" size={24} />
        </button>
      </div>

      <p className="font-body text-xs text-muted-foreground tracking-wider text-center">
        ← → смена дорожки · ↑ или Пробел — прыжок · на телефоне — свайпы
      </p>
    </div>
  );
}

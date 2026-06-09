import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useGameStore, GhostTier } from "../store/useGameStore";
import { ASSETS } from "../constants/assets";
import { useMutation } from "@tanstack/react-query";
import { startGameSession, submitGameResult } from "../services/api";

const GAME_DURATION = 10;

const GameContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  touch-action: none; // Prevent scrolling
`;

const HUD = styled.div`
  position: absolute;
  top: 24px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  pointer-events: none;
`;

const TimerText = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 9999px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(24px);
  color: #ffffff;
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 900;
`;

const pulseGlow = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const backgroundPulse = keyframes`
  0% { transform: translateX(-50%) scale(1); opacity: 0.3; }
  50% { transform: translateX(-50%) scale(1.2); opacity: 0.6; }
  100% { transform: translateX(-50%) scale(1); opacity: 0.3; }
`;

const BasketLayer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 340px;
  height: 340px;
  pointer-events: none;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    animation: ${pulseGlow} 1.2s ease-in-out infinite;
    position: relative;
    z-index: 2;
  }
`;

const BasketGlow = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  width: 200px;
  height: 50px;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 204, 0, 0.9) 0%,
    rgba(255, 153, 0, 0) 80%
  );
  animation: ${backgroundPulse} 1.2s ease-in-out infinite;
  z-index: 1;
`;

const InstructionArrow = styled.div`
  position: absolute;
  top: 60px;
  color: #facc15;
  font-weight: 900;
  font-size: 1.25rem;
  text-transform: uppercase;
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  z-index: 20;
  animation: bounceInstruction 1s infinite alternate;

  @keyframes bounceInstruction {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-10px);
    }
  }
`;

const GhostEntity = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 80px;
  object-fit: contain;
  will-change: transform;
  cursor: grab;
  z-index: 3;
  user-select: none;
  -webkit-user-drag: none;

  &:active {
    cursor: grabbing;
    transform: scale(1.1);
  }
`;

const CountdownOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  font-size: 8rem;
  font-weight: 900;
  color: #ffcc00;
  text-shadow: 4px 4px 0 #cc3300;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  color: white;
  font-size: 1.5rem;
  flex-direction: column;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  border-radius: 9999px;
  height: 48px;
  width: 48px;
  border-bottom: 2px solid #ffffff;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Types and definitions
// Object pool for ghost image elements
const ghostElementPool: HTMLImageElement[] = [];

function getGhostElement(): HTMLImageElement {
  if (ghostElementPool.length > 0) {
    return ghostElementPool.pop()!;
  }
  const img = document.createElement("img");
  img.className = "ghost-entity";
  img.style.position = "absolute";
  img.style.top = "0";
  img.style.left = "0";
  img.style.width = "100px";
  img.style.height = "100px";
  img.style.objectFit = "contain";
  img.style.zIndex = "3";
  img.style.willChange = "transform";
  img.style.userSelect = "none";
  img.style.touchAction = "none";
  img.style.cursor = "grab";
  img.ondragstart = () => false;
  return img;
}

function releaseGhostElement(img: HTMLImageElement) {
  if (img.parentNode) {
    img.parentNode.removeChild(img);
  }
  // Remove event listeners by replacing the element attributes or setting them to null
  img.onpointerdown = null;
  img.onpointerup = null;
  img.onpointermove = null;
  ghostElementPool.push(img);
}

class Ghost {
  id: string;
  tier: GhostTier;
  x: number;
  y: number;
  vx: number;
  vy: number;
  el: HTMLImageElement | null = null;
  dragged: boolean = false;
  active: boolean = false;
  direction: 1 | -1 = 1;

  constructor(width: number, height: number) {
    this.id = Math.random().toString(36).substring(7);
    const rand = Math.random();
    if (rand < 0.25) this.tier = "legendary";
    else if (rand < 0.5) this.tier = "rare";
    else if (rand < 0.75) this.tier = "uncommon";
    else this.tier = "common";

    this.direction = Math.random() > 0.5 ? 1 : -1;
    this.x = this.direction === 1 ? -100 : width + 20;
    this.y = Math.random() * Math.max(100, height - 440) + 50;

    // Base speed depends on tier
    let baseSpeed = 2; // common
    if (this.tier === "uncommon") baseSpeed = 4;
    if (this.tier === "rare") baseSpeed = 6;
    if (this.tier === "legendary") baseSpeed = 10;

    this.vx = (baseSpeed + Math.random() * 2) * this.direction;
    this.vy = (Math.random() - 0.5) * 4;
    this.active = true;
  }
}

export const GameplayScreen = () => {
  const { setGameState, setUserTurns, setCaughtResult, soundSettings } =
    useGameStore();
  const [countdown, setCountdown] = useState<number | null>(3);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const containerRef = useRef<HTMLDivElement>(null);
  const basketRef = useRef<HTMLDivElement>(null);
  const ghostsRef = useRef<Ghost[]>([]);
  const requestRef = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);
  const startTimeStamp = useRef<number | null>(null);
  const speedMultiplier = useRef<number>(1);
  const isGameOver = useRef(false);

  const dragState = useRef<{
    id: string | null;
    offsetX: number;
    offsetY: number;
  }>({ id: null, offsetX: 0, offsetY: 0 });

  const startSessionMut = useMutation({
    mutationFn: startGameSession,
    onSuccess: (data) => {
      // Session ready, deduct turn
      setUserTurns((prev) => prev - 1);
      // Let countdown run
    },
    onError: () => {
      alert("Lỗi kết nối máy chủ");
      setGameState("intro");
    },
  });

  const submitResultMut = useMutation({
    mutationFn: (data: { token: string; ghostId: string; tier: GhostTier }) =>
      submitGameResult(data.token, data.ghostId, data.tier),
    onSuccess: (data, variables) => {
      setCaughtResult(
        { id: variables.ghostId, tier: variables.tier },
        data.reward,
      );
      setGameState("result");
    },
    onError: () => {
      alert("Có lỗi xảy ra khi xác nhận quà");
      setGameState("intro");
    },
  });

  // On mount
  useEffect(() => {
    startSessionMut.mutate();
    return () => {
      cancelAnimationFrame(requestRef.current!);
      // Cleanup ghost elements
      ghostsRef.current.forEach((g) => {
        if (g.el) {
          releaseGhostElement(g.el as HTMLImageElement);
        }
      });
      ghostsRef.current = [];
    };
  }, []);

  // Countdown logic
  useEffect(() => {
    if (!startSessionMut.isSuccess || countdown === null) return;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCountdown(null);
      // Start game
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  }, [countdown, startSessionMut.isSuccess]);

  const vibrate = () => {
    if (soundSettings.vibration && "vibrate" in navigator) {
      navigator.vibrate(50);
    }
  };

  const checkCollision = (ghost: Ghost) => {
    if (!containerRef.current) return false;
    const { clientWidth, clientHeight } = containerRef.current;

    // Basket is 340x340, centered horizontally, and 20px from bottom.
    // Allow a bit of leeway for collision so it's easier.
    const basketWidth = 260;
    const basketHeight = 240;
    const basketBottomOffset = 20;

    const basketLeft = (clientWidth - basketWidth) / 2;
    const basketRight = basketLeft + basketWidth;
    const basketBottom = clientHeight - basketBottomOffset;
    const basketTop = basketBottom - basketHeight;

    // Ghost center approx (Ghost is 100x100)
    const gx = ghost.x + 50;
    const gy = ghost.y + 50;

    return (
      gx > basketLeft && gx < basketRight && gy > basketTop && gy < basketBottom
    );
  };

  const triggerGameOver = (ghost: Ghost | null) => {
    isGameOver.current = true;
    cancelAnimationFrame(requestRef.current!);

    if (ghost) {
      submitResultMut.mutate({
        token: startSessionMut.data?.sessionToken || "mock_token",
        ghostId: ghost.id,
        tier: ghost.tier,
      });
    } else {
      // Time is up, no ghost caught
      setGameState("intro");
    }
  };

  const gameLoop = (timestamp: number) => {
    if (isGameOver.current || !containerRef.current) return;

    if (!startTimeStamp.current) {
      startTimeStamp.current = timestamp;
      lastSpawnTime.current = timestamp;
    }

    const elapsed = timestamp - startTimeStamp.current!;
    const tl = Math.max(0, GAME_DURATION - Math.floor(elapsed / 1000));
    setTimeLeft(tl);

    if (tl === 0) {
      triggerGameOver(null);
      return;
    }

    // Speed increases over time (accelerates)
    speedMultiplier.current = 1 + (elapsed / (GAME_DURATION * 1000)) * 2; // Up to 3x speed at end

    // Spawn new ghost every ~1-1.5s
    if (timestamp - lastSpawnTime.current > 1000 + Math.random() * 500) {
      if (ghostsRef.current.length < 8) {
        const { clientWidth, clientHeight } = containerRef.current;
        const g = new Ghost(clientWidth, clientHeight);
        ghostsRef.current.push(g);

        // Setup DOM element (using simple object hook since pooling makes little difference for < 10 items but prevents garbage collection hiccups)
        const img = getGhostElement();
        img.src = ASSETS.ghosts[g.tier];

        // Pointer events
        img.onpointerdown = (e) => {
          e.preventDefault();
          img.setPointerCapture(e.pointerId);
          dragState.current = {
            id: g.id,
            offsetX: e.clientX - g.x,
            offsetY: e.clientY - g.y,
          };
          g.dragged = true;
          vibrate();
        };

        img.onpointerup = (e) => {
          e.preventDefault();
          img.releasePointerCapture(e.pointerId);
          if (dragState.current.id === g.id) {
            dragState.current.id = null;
            g.dragged = false;

            // Check collision with cart on release
            if (checkCollision(g)) {
              vibrate();
              triggerGameOver(g);
            }
          }
        };

        img.onpointermove = (e) => {
          if (dragState.current.id === g.id) {
            g.x = e.clientX - dragState.current.offsetX;
            g.y = e.clientY - dragState.current.offsetY;
          }
        };

        g.el = img;
        containerRef.current?.appendChild(img);
        lastSpawnTime.current = timestamp;
      }
    }

    // Update ghosts
    const { clientWidth, clientHeight } = containerRef.current;

    ghostsRef.current.forEach((g) => {
      if (!g.active) return;
      if (!g.dragged) {
        g.x += g.vx * speedMultiplier.current;
        g.y += g.vy;

        // Bounce Y
        if (g.y < 40) g.vy = Math.abs(g.vy);
        const maxY = clientHeight - 380;
        if (g.y > maxY) g.vy = -Math.abs(g.vy);

        // Out of bounds screen
        if (
          (g.direction === 1 && g.x > clientWidth + 50) ||
          (g.direction === -1 && g.x < -150)
        ) {
          g.active = false;
          if (g.el) {
            releaseGhostElement(g.el as HTMLImageElement);
            g.el = undefined;
          }
        }
      }

      if (g.el) {
        g.el.style.transform = `translate3d(${g.x}px, ${g.y}px, 0)`;
      }
    });

    ghostsRef.current = ghostsRef.current.filter((g) => g.active);

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  return (
    <GameContainer ref={containerRef}>
      <HUD>
        <TimerText>{timeLeft}s</TimerText>
      </HUD>

      <BasketLayer ref={basketRef}>
        <InstructionArrow>
          <span>⬇ KÉO VÀO ĐÂY ⬇</span>
        </InstructionArrow>
        <BasketGlow />
        <img src={ASSETS.basket} alt="Basket" />
      </BasketLayer>

      {countdown !== null && startSessionMut.isSuccess && (
        <CountdownOverlay>
          {countdown === 0 ? "DZỰT" : countdown}
        </CountdownOverlay>
      )}

      {(startSessionMut.isPending || submitResultMut.isPending) && (
        <LoadingOverlay>
          <LoadingSpinner />
          <div>Đang xử lý...</div>
        </LoadingOverlay>
      )}
    </GameContainer>
  );
};

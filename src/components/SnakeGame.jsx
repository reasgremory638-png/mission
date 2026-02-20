import { useEffect, useRef, useState, useCallback } from 'react';
import { useChallenge } from '../context/ChallengeContext';

const CELL = 20;
const COLS = 16;
const ROWS = 16;
const W = CELL * COLS;
const H = CELL * ROWS;
const INITIAL_SPEED = 120;

const dirs = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };

function randFood(snake) {
  let pos;
  do {
    pos = [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)];
  } while (snake.some(s => s[0] === pos[0] && s[1] === pos[1]));
  return pos;
}

export default function SnakeGame({ onClose }) {
  const { updateSnakeScore } = useChallenge();
  const canvasRef = useRef();
  const stateRef = useRef({
    snake: [[8, 8], [7, 8], [6, 8]],
    dir: [1, 0],
    nextDir: [1, 0],
    food: [12, 5],
    score: 0,
    running: false,
    over: false,
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;

    ctx.fillStyle = '#f0f7ee';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = '#dcefd8';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke();
    }

    s.snake.forEach(([x, y], i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#388e3c' : '#6aaf3a';
      ctx.beginPath();
      // Basic rect for browsers that don't support roundRect or just to be safe
      ctx.rect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
      ctx.fill();

      if (isHead) {
        ctx.fillStyle = '#fff';
        const eyeY = y * CELL + 6;
        const ex1 = x * CELL + (s.dir[0] === -1 ? 4 : 12);
        ctx.beginPath(); ctx.arc(ex1, eyeY, 2.5, 0, Math.PI * 2); ctx.fill();
      }
    });

    ctx.font = `${CELL - 2}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🍎', s.food[0] * CELL + CELL / 2, s.food[1] * CELL + CELL / 2);
  }, []);

  const step = useCallback(() => {
    const s = stateRef.current;
    if (!s.running || s.over) return;

    s.dir = s.nextDir;
    const head = [s.snake[0][0] + s.dir[0], s.snake[0][1] + s.dir[1]];

    if (head[0] < 0 || head[0] >= COLS || head[1] < 0 || head[1] >= ROWS) {
      s.over = true; s.running = false;
      updateSnakeScore(s.score);
      setGameOver(true);
      return;
    }

    if (s.snake.some(([x, y]) => x === head[0] && y === head[1])) {
      s.over = true; s.running = false;
      updateSnakeScore(s.score);
      setGameOver(true);
      return;
    }

    const ateFood = head[0] === s.food[0] && head[1] === s.food[1];
    const newSnake = [head, ...s.snake];
    if (!ateFood) newSnake.pop();
    else {
      s.food = randFood(newSnake);
      s.score += 10;
      setScore(s.score);
    }
    s.snake = newSnake;
    draw();
  }, [draw, updateSnakeScore]);

  const startGame = useCallback(() => {
    stateRef.current = {
      snake: [[8, 8], [7, 8], [6, 8]],
      dir: [1, 0],
      nextDir: [1, 0],
      food: randFood([[8, 8], [7, 8], [6, 8]]),
      score: 0,
      running: true,
      over: false,
    };
    setScore(0);
    setGameOver(false);
    setStarted(true);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(step, INITIAL_SPEED);
    draw();
  }, [step, draw]);

  useEffect(() => {
    draw();
    return () => clearInterval(intervalRef.current);
  }, [draw]);

  useEffect(() => {
    const handleKey = (e) => {
      const d = dirs[e.key];
      if (!d) return;
      e.preventDefault();
      const s = stateRef.current;
      if (d[0] === -s.dir[0] && d[1] === -s.dir[1]) return;
      s.nextDir = d;
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const touchStart = useRef(null);
  const handleTouchStart = (e) => {
    touchStart.current = [e.touches[0].clientX, e.touches[0].clientY];
  };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current[0];
    const dy = e.changedTouches[0].clientY - touchStart.current[1];
    const s = stateRef.current;
    if (Math.abs(dx) > Math.abs(dy)) {
      const d = dx > 0 ? [1, 0] : [-1, 0];
      if (!(d[0] === -s.dir[0])) s.nextDir = d;
    } else {
      const d = dy > 0 ? [0, 1] : [0, -1];
      if (!(d[1] === -s.dir[1])) s.nextDir = d;
    }
  };

  return (
    <div className="p-5 text-center" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-warm-700">🐍 Snake!</h2>
          <p className="text-warm-400 text-xs">مكافأة إتمام اليوم</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-warm-400">النقاط</p>
          <p className="font-display text-2xl font-bold text-nature-600">{score}</p>
        </div>
      </div>

      <div className="flex justify-center mb-3">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="rounded-2xl border-2 border-nature-200 bg-nature-50 max-w-full"
          style={{ touchAction: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      <div className="grid grid-cols-3 gap-1 max-w-[120px] mx-auto mb-4">
        {[['↑', [0, -1]], ['', null], ['↓', [0, 1]], ['←', [-1, 0]], ['', null], ['→', [1, 0]]].map(([label, d], i) => (
          d ? (
            <button key={i} onMouseDown={() => { if(d) { const s = stateRef.current; if(!(d[0]===-s.dir[0]&&d[1]===-s.dir[1])) s.nextDir=d; }}}
              className="w-10 h-10 bg-nature-100 hover:bg-nature-200 border border-nature-200 rounded-xl text-warm-700 font-bold text-lg flex items-center justify-center transition-colors">
              {label}
            </button>
          ) : <div key={i} />
        ))}
      </div>

      {!started && !gameOver && (
        <button onClick={startGame} className="btn-primary mb-3">
          ابدأ اللعب 🎮
        </button>
      )}

      {gameOver && (
        <div className="mb-3">
          <p className="text-lg font-bold text-warm-700 mb-1">انتهت اللعبة! نقاطك: {score} 🎯</p>
          <div className="flex gap-2 justify-center">
            <button onClick={startGame} className="btn-primary text-sm">
              العب مرة أخرى 🔄
            </button>
          </div>
        </div>
      )}

      <button onClick={onClose} className="btn-ghost text-warm-400 text-sm">
        إغلاق ↩
      </button>
    </div>
  );
}

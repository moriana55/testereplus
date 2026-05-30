let audioCtx: AudioContext | null = null;

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

export function playCashRegister() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Metallic "cha" hit
  const hit = ctx.createOscillator();
  const hitGain = ctx.createGain();
  hit.type = "square";
  hit.frequency.setValueAtTime(1800, now);
  hit.frequency.exponentialRampToValueAtTime(400, now + 0.08);
  hitGain.gain.setValueAtTime(0.3, now);
  hitGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  hit.connect(hitGain).connect(ctx.destination);
  hit.start(now);
  hit.stop(now + 0.1);

  // "Ching" ring
  const ring = ctx.createOscillator();
  const ringGain = ctx.createGain();
  ring.type = "sine";
  ring.frequency.setValueAtTime(2400, now + 0.08);
  ring.frequency.setValueAtTime(3200, now + 0.12);
  ringGain.gain.setValueAtTime(0, now);
  ringGain.gain.linearRampToValueAtTime(0.25, now + 0.1);
  ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  ring.connect(ringGain).connect(ctx.destination);
  ring.start(now + 0.08);
  ring.stop(now + 0.6);

  // Coins jingle
  for (let i = 0; i < 4; i++) {
    const coin = ctx.createOscillator();
    const coinGain = ctx.createGain();
    const t = now + 0.15 + i * 0.07;
    coin.type = "sine";
    coin.frequency.setValueAtTime(4000 + Math.random() * 2000, t);
    coinGain.gain.setValueAtTime(0.08, t);
    coinGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    coin.connect(coinGain).connect(ctx.destination);
    coin.start(t);
    coin.stop(t + 0.12);
  }

  // Final bell
  const bell = ctx.createOscillator();
  const bellGain = ctx.createGain();
  bell.type = "sine";
  bell.frequency.setValueAtTime(2600, now + 0.4);
  bellGain.gain.setValueAtTime(0.15, now + 0.4);
  bellGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
  bell.connect(bellGain).connect(ctx.destination);
  bell.start(now + 0.4);
  bell.stop(now + 1.0);
}

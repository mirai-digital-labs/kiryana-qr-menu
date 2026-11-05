let ctx: AudioContext | null = null;

/** Browser ko awaaz ki ijazat sirf user touch ke baad milti hai. */
export function unlockSound() {
  const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined;
  if (!AC) return false;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume();
  beep(0.05);
  return true;
}

function beep(vol = 0.5, at = 0, freq = 880, dur = 0.25) {
  if (!ctx) return;
  const t = ctx.currentTime + at;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur);
}

export function newOrderAlert() {
  if (!ctx) return;
  for (let i = 0; i < 4; i++) {
    beep(0.6, i * 0.5, 880);
    beep(0.6, i * 0.5 + 0.25, 1175);
  }
  if (navigator.vibrate) navigator.vibrate([300, 150, 300]);
}

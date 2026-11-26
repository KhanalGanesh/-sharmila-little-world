
/* =========================================
   DREAM MAN JOURNEY - SOUND EFFECTS
   Car Engine + Airplane Takeoff
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("dmStart");
  if (!startButton) return;

  let audioContext = null;
  let engineNodes = [];
  let planeNodes = [];
  let soundSequence = 0;

  function getAudio() {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return null;

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    return audioContext;
  }

  function stopNodes(nodes) {
    nodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (error) {}
    });

    nodes.length = 0;
  }

  // CAR ENGINE SOUND
  function startCarSound() {
    const ctx = getAudio();
    if (!ctx) return;

    stopNodes(engineNodes);

    const engine = ctx.createOscillator();
    const engineGain = ctx.createGain();
    const engineFilter = ctx.createBiquadFilter();

    engine.type = "sawtooth";
    engine.frequency.setValueAtTime(65, ctx.currentTime);
    engine.frequency.linearRampToValueAtTime(
      105,
      ctx.currentTime + 2
    );

    engineFilter.type = "lowpass";
    engineFilter.frequency.value = 190;

    engineGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    engineGain.gain.linearRampToValueAtTime(
      0.045,
      ctx.currentTime + 0.5
    );

    engine.connect(engineFilter);
    engineFilter.connect(engineGain);
    engineGain.connect(ctx.destination);

    engine.start();

    engineNodes.push(engine, engineFilter, engineGain);

    const vibration = ctx.createOscillator();
    const vibrationGain = ctx.createGain();

    vibration.type = "sine";
    vibration.frequency.value = 8;
    vibrationGain.gain.value = 8;

    vibration.connect(vibrationGain);
    vibrationGain.connect(engine.frequency);
    vibration.start();

    engineNodes.push(vibration, vibrationGain);
  }

  function stopCarSound() {
    const ctx = audioContext;
    if (!ctx) return;

    engineNodes.forEach(node => {
      if (node.gain) {
        try {
          node.gain.gain.setTargetAtTime(
            0.0001,
            ctx.currentTime,
            0.15
          );
        } catch (error) {}
      }
    });

    setTimeout(() => stopNodes(engineNodes), 500);
  }

  // AIRPLANE ENGINE + TAKEOFF SOUND
  function startPlaneSound() {
    const ctx = getAudio();
    if (!ctx) return;

    stopNodes(planeNodes);

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(85, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(
      170,
      ctx.currentTime + 2
    );
    oscillator.frequency.linearRampToValueAtTime(
      220,
      ctx.currentTime + 4
    );

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(240, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(
      850,
      ctx.currentTime + 3
    );

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(
      0.055,
      ctx.currentTime + 1
    );

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();

    planeNodes.push(oscillator, filter, gain);

    // Air rushing noise
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(
      1,
      bufferSize,
      ctx.sampleRate
    );

    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.35;
    }

    const noise = ctx.createBufferSource();
    const noiseFilter = ctx.createBiquadFilter();
    const noiseGain = ctx.createGain();

    noise.buffer = buffer;
    noise.loop = true;

    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 600;

    noiseGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    noiseGain.gain.linearRampToValueAtTime(
      0.035,
      ctx.currentTime + 1.5
    );

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start();

    planeNodes.push(noise, noiseFilter, noiseGain);
  }

  function stopPlaneSound() {
    const ctx = audioContext;
    if (!ctx) return;

    planeNodes.forEach(node => {
      if (node.gain) {
        try {
          node.gain.gain.setTargetAtTime(
            0.0001,
            ctx.currentTime,
            0.3
          );
        } catch (error) {}
      }
    });

    setTimeout(() => stopNodes(planeNodes), 1000);
  }

  startButton.addEventListener("click", () => {
    const sequence = ++soundSequence;

    // Car starts immediately
    startCarSound();

    // Car reaches airport after approximately 4 seconds
    setTimeout(() => {
      if (sequence !== soundSequence) return;
      stopCarSound();
    }, 3900);

    // Plane takes off after approximately 5.9 seconds
    setTimeout(() => {
      if (sequence !== soundSequence) return;
      startPlaneSound();
    }, 5900);

    // Plane sound fades after the flight animation
    setTimeout(() => {
      if (sequence !== soundSequence) return;
      stopPlaneSound();
    }, 10900);
  });

  // Stop sounds when the page is hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      soundSequence++;
      stopCarSound();
      stopPlaneSound();
    }
  });
});

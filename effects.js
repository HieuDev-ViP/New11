(() => {
  const canvas = document.getElementById("starCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let stars = [];
  let shootingStars = [];
  let raf = 0;
  let lastShot = 0;
  const starCount = reduceMotion ? 18 : (window.innerWidth < 768 ? 40 : 68);

  const rand = (min, max) => Math.random() * (max - min) + min;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars = Array.from({ length: starCount }, () => ({
      x: rand(0, window.innerWidth),
      y: rand(0, window.innerHeight),
      r: rand(0.55, 1.55),
      a: rand(0.22, 0.9),
      tw: rand(0.004, 0.012),
      dx: rand(-0.03, 0.03),
      dy: rand(0.01, 0.05),
    }));
  }

  function addShootingStar() {
    const fromLeft = Math.random() > 0.5;
    const startX = fromLeft ? rand(-120, -20) : rand(window.innerWidth * 0.42, window.innerWidth + 100);
    const startY = rand(10, window.innerHeight * 0.32);
    shootingStars.push({
      x: startX,
      y: startY,
      vx: fromLeft ? rand(8.5, 11.5) : rand(-11.5, -8.5),
      vy: rand(3.2, 5.2),
      life: 0,
      maxLife: rand(44, 62),
      len: rand(80, 135),
      w: rand(1.1, 1.8),
    });
  }

  function drawStar(star) {
    star.x += star.dx;
    star.y += star.dy;
    if (star.x < -10) star.x = window.innerWidth + 10;
    if (star.x > window.innerWidth + 10) star.x = -10;
    if (star.y > window.innerHeight + 10) star.y = -10;

    star.a += star.tw;
    if (star.a > 0.92 || star.a < 0.16) star.tw *= -1;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${star.a})`;
    ctx.fill();

    if (star.r > 1.3) {
      ctx.strokeStyle = `rgba(120,180,255,${star.a * 0.28})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(star.x - 2.1, star.y);
      ctx.lineTo(star.x + 2.1, star.y);
      ctx.moveTo(star.x, star.y - 2.1);
      ctx.lineTo(star.x, star.y + 2.1);
      ctx.stroke();
    }
  }

  function drawShootingStar(item) {
    const progress = item.life / item.maxLife;
    const x = item.x + item.vx * item.life;
    const y = item.y + item.vy * item.life;
    const alpha = progress < 0.16 ? progress / 0.16 : progress > 0.82 ? (1 - progress) / 0.18 : 1;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `rgba(170,210,255,${Math.max(0, alpha)})`;
    ctx.lineWidth = item.w;
    ctx.shadowColor = "rgba(120,170,255,.7)";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - item.vx * item.len * 0.12, y - item.vy * item.len * 0.12);
    ctx.stroke();
    ctx.restore();
  }

  function tick(time) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    for (const star of stars) drawStar(star);

    shootingStars = shootingStars.filter((s) => s.life < s.maxLife);
    for (const item of shootingStars) {
      item.life++;
      drawShootingStar(item);
    }

    ctx.restore();

    if (!reduceMotion && time - lastShot > rand(2200, 4200)) {
      addShootingStar();
      lastShot = time;
    }

    raf = requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  raf = requestAnimationFrame(tick);
})();

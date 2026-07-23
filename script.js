const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const CONFIG = {
  name: "Trần Bá Hiếu",
  role: "Student & Developer",
  tagline: "Yêu thích lập trình và thiết kế website.",
  socials: [
    { href: "https://www.facebook.com/HjeuDepZaiii", label: "Facebook" },
    { href: "https://www.tiktok.com/@hieudepzaii_63", label: "TikTok" },
    { href: "https://t.me/HjeuDepZaii63", label: "Telegram" },
    { href: "https://www.instagram.com/hjeudepzaiii", label: "Instagram" },
  ],
  gallery: [
    { src: "gallery-1.jpg", alt: "Album 1" },
    { src: "gallery-2.jpg", alt: "Album 2" },
    { src: "gallery-3.jpg", alt: "Album 3" },
    { src: "gallery-4.jpg", alt: "Album 4" },
  ],
  musicTracks: [
    {
      title: "China Pipa x Gong Xi Thazh",
      artist: "Trần Bá Hiếu",
      src: "music.mp3",
    },
    {
      title: "Chiều Hôm Ấy x Ngày Em Đẹp Nhất",
      artist: "Trần Bá Hiếu",
      src: "music2.mp3",
    },
  ],
  donate: {
    bank: "MB Bank",
    owner: "Trần Bá Hiếu",
    account: "123456789990",
    qr: "qr-bank.jpg",
  },
};

const state = {
  currentTrack: 0,
  currentIndex: 0,
  loop: false,
  muted: false,
  toastTimer: null,
  wasDrawerOpen: false,
};

const els = {
  menuBtn: $("#menuBtn"),
  closeMenu: $("#closeMenu"),
  drawer: $("#mobileDrawer"),
  backTop: $("#backTop"),
  heroName: $("#heroName"),
  heroRole: $("#heroRole"),
  heroTagline: $("#heroTagline"),
  musicTitle: $("#musicTitle"),
  musicArtist: $("#musicArtist"),
  trackIndex: $("#trackIndex"),
  audio: $("#audio"),
  playBtn: $("#playBtn"),
  prevTrackBtn: $("#prevTrackBtn"),
  nextTrackBtn: $("#nextTrackBtn"),
  loopBtn: $("#loopBtn"),
  muteBtn: $("#muteBtn"),
  progress: $("#progress"),
  currentTime: $("#currentTime"),
  duration: $("#duration"),
  volume: $("#volume"),
  accountNumber: $("#accountNumber"),
  copyBtn: $("#copyBtn"),
  zoomQrBtn: $("#zoomQrBtn"),
  lightbox: $("#lightbox"),
  lightboxImage: $("#lightboxImage"),
  lightboxCaption: $("#lightboxCaption"),
  lightboxClose: $("#lightboxClose"),
  lightboxPrev: $("#lightboxPrev"),
  lightboxNext: $("#lightboxNext"),
  toast: $("#toast"),
};

function setText(el, value) {
  if (el) el.textContent = value;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function showToast(message) {
  if (!els.toast) return;
  clearTimeout(state.toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  state.toastTimer = setTimeout(() => els.toast.classList.remove("show"), 1800);
}

function lockScroll(lock) {
  document.body.style.overflow = lock ? "hidden" : "";
}

function setPlayIcon(playing) {
  els.playBtn.innerHTML = `<svg><use href="${playing ? "#icon-pause" : "#icon-play"}"></use></svg>`;
}

function setMuteIcon(muted) {
  els.muteBtn.innerHTML = `<svg><use href="${muted ? "#icon-volume-x" : "#icon-volume"}"></use></svg>`;
}

function setLoopState(active) {
  els.loopBtn.classList.toggle("is-active", active);
}

function openDrawer() {
  if (!els.drawer) return;
  els.drawer.classList.add("is-open");
  els.drawer.setAttribute("aria-hidden", "false");
  state.wasDrawerOpen = true;
  lockScroll(true);
}

function closeDrawer() {
  if (!els.drawer) return;
  els.drawer.classList.remove("is-open");
  els.drawer.setAttribute("aria-hidden", "true");
  lockScroll(false);
}

function syncTrack() {
  const track = CONFIG.musicTracks[state.currentTrack];
  setText(els.musicTitle, track.title);
  setText(els.musicArtist, track.artist);
  setText(els.trackIndex, `${String(state.currentTrack + 1).padStart(2, "0")} / ${String(CONFIG.musicTracks.length).padStart(2, "0")}`);
  els.audio.src = track.src;
  els.audio.load();
}

async function playCurrentTrack() {
  try {
    await els.audio.play();
    setPlayIcon(true);
  } catch {
    showToast("Nhấn phát nhạc để bắt đầu.");
  }
}

function updateProgress() {
  const current = els.audio.currentTime || 0;
  const duration = els.audio.duration || 0;
  els.currentTime.textContent = formatTime(current);
  els.duration.textContent = formatTime(duration);
  els.progress.value = duration ? ((current / duration) * 100) : 0;
}

function nextTrack(autoplay = true) {
  state.currentTrack = (state.currentTrack + 1) % CONFIG.musicTracks.length;
  syncTrack();
  if (autoplay) playCurrentTrack();
}

function prevTrack(autoplay = true) {
  state.currentTrack = (state.currentTrack - 1 + CONFIG.musicTracks.length) % CONFIG.musicTracks.length;
  syncTrack();
  if (autoplay) playCurrentTrack();
}

function openLightbox(index) {
  state.currentIndex = index;
  const item = CONFIG.gallery[index];
  els.lightboxImage.src = item.src;
  els.lightboxImage.alt = item.alt;
  els.lightboxCaption.textContent = `${String(index + 1).padStart(2, "0")} / ${String(CONFIG.gallery.length).padStart(2, "0")} — ${item.alt}`;
  els.lightbox.classList.add("is-open");
  els.lightbox.setAttribute("aria-hidden", "false");
  lockScroll(true);
}

function closeLightbox() {
  els.lightbox.classList.remove("is-open");
  els.lightbox.setAttribute("aria-hidden", "true");
  lockScroll(false);
}

function stepLightbox(delta) {
  state.currentIndex = (state.currentIndex + delta + CONFIG.gallery.length) % CONFIG.gallery.length;
  openLightbox(state.currentIndex);
}

function bindSocials() {
  $$(".social-card").forEach((card, index) => {
    const href = CONFIG.socials[index]?.href;
    if (href) card.href = href;
  });
}

function bindGallery() {
  $$(".gallery-item").forEach((btn, index) => {
    const data = CONFIG.gallery[index];
    const img = $("img", btn);
    if (img && data) {
      img.src = data.src;
      img.alt = data.alt;
    }
    btn.addEventListener("click", () => openLightbox(index));
  });
}

function syncDonate() {
  setText(els.accountNumber, CONFIG.donate.account);
  const qrImg = $(".donate-qr img");
  if (qrImg) qrImg.src = CONFIG.donate.qr;
  const bankTitle = $(".donate-info h3");
  if (bankTitle) bankTitle.textContent = `Ngân hàng: ${CONFIG.donate.bank}`;
  const owner = $(".account-name");
  if (owner) owner.textContent = `Chủ tài khoản: ${CONFIG.donate.owner}`;
}

function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.14 });
  items.forEach((item) => io.observe(item));
}

function initHeaderNav() {
  els.menuBtn?.addEventListener("click", openDrawer);
  els.closeMenu?.addEventListener("click", closeDrawer);
  els.drawer?.addEventListener("click", (e) => {
    if (e.target === els.drawer) closeDrawer();
  });
  $$(".mobile-drawer a").forEach((a) => a.addEventListener("click", closeDrawer));

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      const target = href && href !== "#" ? $(href) : null;
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeDrawer();
    });
  });
}

function initBackTop() {
  const toggle = () => {
    els.backTop.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
  els.backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function initMusic() {
  els.audio.addEventListener("loadedmetadata", updateProgress);
  els.audio.addEventListener("timeupdate", updateProgress);
  els.audio.addEventListener("ended", () => {
    if (state.loop) {
      els.audio.currentTime = 0;
      playCurrentTrack();
      return;
    }
    if (state.currentTrack < CONFIG.musicTracks.length - 1) {
      nextTrack(true);
      return;
    }
    setPlayIcon(false);
  });

  els.playBtn.addEventListener("click", async () => {
    if (els.audio.paused) {
      await playCurrentTrack();
    } else {
      els.audio.pause();
      setPlayIcon(false);
    }
  });

  els.prevTrackBtn.addEventListener("click", () => prevTrack(true));
  els.nextTrackBtn.addEventListener("click", () => nextTrack(true));

  els.loopBtn.addEventListener("click", () => {
    state.loop = !state.loop;
    setLoopState(state.loop);
    showToast(state.loop ? "Bật lặp lại" : "Tắt lặp lại");
  });

  els.muteBtn.addEventListener("click", () => {
    state.muted = !state.muted;
    els.audio.muted = state.muted;
    setMuteIcon(state.muted);
    showToast(state.muted ? "Tắt âm thanh" : "Bật âm thanh");
  });

  els.progress.addEventListener("input", () => {
    const duration = els.audio.duration || 0;
    if (!duration) return;
    els.audio.currentTime = (els.progress.value / 100) * duration;
  });

  els.volume.addEventListener("input", () => {
    els.audio.volume = Number(els.volume.value);
    if (els.audio.volume > 0 && els.audio.muted) {
      els.audio.muted = false;
      state.muted = false;
      setMuteIcon(false);
    }
  });

  const savedVolume = localStorage.getItem("hieu_v7_volume");
  const savedTrack = Number(localStorage.getItem("hieu_v7_track"));

  if (!Number.isNaN(savedTrack) && savedTrack >= 0 && savedTrack < CONFIG.musicTracks.length) {
    state.currentTrack = savedTrack;
  }

  if (savedVolume !== null) {
    els.volume.value = savedVolume;
  }

  els.audio.volume = Number(els.volume.value);
  els.audio.muted = false;
  setMuteIcon(false);
  setLoopState(false);
  syncTrack();
  setPlayIcon(false);

  window.addEventListener("beforeunload", () => {
    localStorage.setItem("hieu_v7_volume", String(els.volume.value));
    localStorage.setItem("hieu_v7_track", String(state.currentTrack));
  });
}

function initDonate() {
  els.copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.donate.account);
      showToast("Đã sao chép số tài khoản");
    } catch {
      showToast("Không thể sao chép");
    }
  });

  els.zoomQrBtn?.addEventListener("click", () => {
    const src = $(".donate-qr img")?.src;
    if (!src) return;
    els.lightboxImage.src = src;
    els.lightboxImage.alt = "QR MB Bank";
    els.lightboxCaption.textContent = "QR MB Bank";
    els.lightbox.classList.add("is-open");
    els.lightbox.setAttribute("aria-hidden", "false");
    lockScroll(true);
    state.currentIndex = -1;
  });
}

function initLightbox() {
  els.lightboxClose?.addEventListener("click", closeLightbox);
  els.lightboxPrev?.addEventListener("click", () => {
    if (state.currentIndex < 0) return;
    stepLightbox(-1);
  });
  els.lightboxNext?.addEventListener("click", () => {
    if (state.currentIndex < 0) return;
    stepLightbox(1);
  });

  els.lightbox?.addEventListener("click", (e) => {
    if (e.target === els.lightbox) closeLightbox();
  });
}

function bootstrap() {
  setText(els.heroName, CONFIG.name);
  setText(els.heroRole, CONFIG.role);
  setText(els.heroTagline, CONFIG.tagline);

  bindSocials();
  bindGallery();
  syncDonate();

  initHeaderNav();
  initBackTop();
  initReveal();
  initMusic();
  initDonate();
  initLightbox();

  els.drawer?.setAttribute("aria-hidden", "true");

  document.addEventListener("keydown", (e) => {
    if (e.target && e.target.matches("input, textarea")) return;

    if (e.code === "Space") {
      e.preventDefault();
      els.playBtn.click();
      return;
    }

    if (e.key === "ArrowRight") {
      if (els.lightbox.classList.contains("is-open") && state.currentIndex >= 0) {
        stepLightbox(1);
      } else {
        nextTrack(true);
      }
      return;
    }

    if (e.key === "ArrowLeft") {
      if (els.lightbox.classList.contains("is-open") && state.currentIndex >= 0) {
        stepLightbox(-1);
      } else {
        prevTrack(true);
      }
      return;
    }

    if (e.key === "Escape") {
      closeLightbox();
      closeDrawer();
    }
  });
}

bootstrap();

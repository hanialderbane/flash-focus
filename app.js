(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const STORAGE = { progress: "ff_progress", settings: "ff_settings", lang: "ff_lang" };
  const LEVELS = 50;
  const LEVEL_SECONDS = 60;
  const SYMBOLS = ["◆", "●", "▲", "■", "✦", "♥", "⬟", "✚", "★", "☀"];
  const MODES = ["shape", "memory", "numbers", "count", "missing", "math", "order", "color", "pattern", "attention"];
  const COLORS = [
    { key: "red", hex: "#ed5267" }, { key: "blue", hex: "#438be8" },
    { key: "green", hex: "#31b982" }, { key: "yellow", hex: "#e9bd3e" },
    { key: "purple", hex: "#9b70e8" }, { key: "orange", hex: "#e88b3d" },
    { key: "pink", hex: "#e779b5" }, { key: "cyan", hex: "#38c4d2" }
  ];

  const I18N = {
    ar: {
      tagline: "اختبر سرعة تفكيرك وتركيزك", challenge: "تحدّي العقل", heroTitle: "ركّز بسرعة… واربح النجوم!",
      heroDesc: "تحديات متنوعة تتجدد مع كل مستوى، والوقت هو خصمك.", best: "أفضل نتيجة", stars: "النجوم", levels: "المستويات",
      continue: "ابدأ اللعب", chooseLevel: "اختر المستوى", progress: "تقدّمك محفوظ تلقائياً", footer: "لعبة مجانية لتنشيط الذهن",
      level: "المستوى", seconds: "ث", answered: "إجابة", speedPoints: "الأسرع يجمع نقاطاً أكثر", levelComplete: "انتهى المستوى",
      points: "نقطة", nextLevel: "المستوى التالي", replay: "إعادة المحاولة", home: "الرئيسية", settings: "الإعدادات",
      sound: "الصوت", vibration: "الاهتزاز", reset: "إعادة ضبط التقدم", resetNote: "سيتم حذف أفضل نتيجة والنجوم والمستويات المفتوحة.",
      deviceNote: "قد يعتمد الصوت والاهتزاز على إعدادات الجهاز ودعم المتصفح.", testSound: "اختبار الصوت", testVibration: "اختبار الاهتزاز",
      correctAnswers: "صحيحة", wrongAnswers: "خاطئة", accuracy: "الدقة", bestStreak: "أفضل سلسلة", challengeNo: "التحدي",
      mode_shape: "تمييز الأشكال", mode_memory: "اختبار الذاكرة", mode_numbers: "تحدّي الأرقام", mode_count: "العدّ والتركيز",
      mode_missing: "الرقم المفقود", mode_math: "الحساب السريع", mode_order: "ترتيب الأرقام", mode_color: "تمييز الألوان",
      mode_pattern: "إكمال النمط", mode_attention: "قوة الملاحظة",
      q_shape: "اضغط على الشكل المختلف", h_shape: "ابحث عن الرمز الذي يختلف عن بقية الرموز.",
      q_memory: "احفظ الرموز، ثم اختر الرمز المطلوب", h_memory: "ركّز في ترتيب الرموز؛ ستختفي بعد لحظات.",
      q_numbers: "اختر الرقم الأكبر", h_numbers: "كلما أجبت أسرع حصلت على نقاط أكثر.",
      q_count: "كم دائرة مضيئة تراها؟", h_count: "احسب الدوائر الصفراء فقط.",
      q_missing: "ما الرقم المفقود في التسلسل؟", h_missing: "لاحظ مقدار الزيادة بين كل رقم والذي يليه.",
      q_math: "احسب الناتج واختر الإجابة الصحيحة", h_math: "انتبه للعملية الحسابية.",
      q_order: "اختر الرقم الأوسط", h_order: "رتّب الأرقام ذهنياً من الأصغر إلى الأكبر.",
      q_color: "اختر اللون المطلوب", h_color: "طابق اسم اللون مع المربع الصحيح.",
      q_pattern: "أي رمز يكمل النمط؟", h_pattern: "راقب ترتيب الرموز وابحث عن التكرار.",
      q_attention: "كم مرة ظهر الرمز المحدد؟", h_attention: "عدّ الرمز المطلوب فقط.",
      memoryAsk: "أي رمز كان في الموقع رقم {n}؟", targetSymbol: "الرمز المطلوب", colorPrompt: "اختر اللون: {color}",
      correct: "إجابة صحيحة", wrong: "إجابة غير صحيحة", pointsEarned: "+{n} نقطة", pointsLost: "-{n} نقطة",
      resultExcellent: "أداء ممتاز! تركيزك قوي.", resultGood: "أحسنت! استمر في تطوير سرعتك.", resultTry: "بداية جيدة؛ حاول تحسين دقتك وسرعتك.",
      resultEmpty: "انتهى الوقت قبل تسجيل إجابات. جرّب مرة ثانية.", timeout: "انتهى الوقت!", nextUnlocked: "تم فتح المستوى التالي.",
      resetConfirm: "هل أنت متأكد؟ سيتم مسح كل تقدمك المحفوظ.", resetDone: "تمت إعادة ضبط التقدم.", vibrationUnsupported: "هذا المتصفح أو الجهاز لا يدعم الاهتزاز.",
      soundUnsupported: "تعذّر تشغيل الصوت. تأكد من رفع صوت الوسائط في الجهاز.", levelLabel: "المستوى {n}", locked: "مغلق",
      color_red: "الأحمر", color_blue: "الأزرق", color_green: "الأخضر", color_yellow: "الأصفر", color_purple: "البنفسجي",
      color_orange: "البرتقالي", color_pink: "الوردي", color_cyan: "السماوي", starsEarned: "النجوم المكتسبة"
    },
    en: {
      tagline: "Test your speed and focus", challenge: "BRAIN CHALLENGE", heroTitle: "Focus fast… earn stars!",
      heroDesc: "Fresh challenges every level. Beat the clock and keep your focus.", best: "Best score", stars: "Stars", levels: "Levels",
      continue: "Start playing", chooseLevel: "Choose a level", progress: "Your progress is saved automatically", footer: "A free game to refresh your mind",
      level: "Level", seconds: "sec", answered: "answered", speedPoints: "Faster answers earn more points", levelComplete: "LEVEL COMPLETE",
      points: "points", nextLevel: "Next level", replay: "Play again", home: "Home", settings: "Settings", sound: "Sound", vibration: "Vibration",
      reset: "Reset progress", resetNote: "Your best score, stars and unlocked levels will be deleted.", deviceNote: "Sound and vibration depend on your device settings and browser support.",
      testSound: "Test sound", testVibration: "Test vibration", correctAnswers: "Correct", wrongAnswers: "Wrong", accuracy: "Accuracy", bestStreak: "Best streak",
      challengeNo: "Challenge", mode_shape: "Shape Spotter", mode_memory: "Memory Test", mode_numbers: "Number Challenge", mode_count: "Count & Focus",
      mode_missing: "Missing Number", mode_math: "Quick Math", mode_order: "Number Order", mode_color: "Color Match", mode_pattern: "Pattern Logic", mode_attention: "Visual Attention",
      q_shape: "Tap the shape that is different", h_shape: "Find the symbol that differs from the others.",
      q_memory: "Memorize the symbols, then choose the target", h_memory: "Focus on the order; the symbols will disappear shortly.",
      q_numbers: "Choose the largest number", h_numbers: "Faster answers earn more points.", q_count: "How many glowing dots can you see?", h_count: "Count only the yellow dots.",
      q_missing: "Which number is missing from the sequence?", h_missing: "Notice the step between each number.", q_math: "Solve the calculation", h_math: "Pay attention to the operation.",
      q_order: "Choose the middle number", h_order: "Sort the numbers mentally from smallest to largest.", q_color: "Choose the requested color", h_color: "Match the color name to the correct tile.",
      q_pattern: "Which symbol completes the pattern?", h_pattern: "Watch the order and find the repeating sequence.", q_attention: "How many times does the target appear?", h_attention: "Count only the requested symbol.",
      memoryAsk: "Which symbol was in position {n}?", targetSymbol: "Target symbol", colorPrompt: "Choose the color: {color}", correct: "Correct", wrong: "Not quite",
      pointsEarned: "+{n} points", pointsLost: "-{n} points", resultExcellent: "Excellent performance! Strong focus.", resultGood: "Well done! Keep building your speed.",
      resultTry: "Good start. Try to improve your accuracy and speed.", resultEmpty: "Time ran out before you answered. Try again.", timeout: "Time is up!", nextUnlocked: "The next level is unlocked.",
      resetConfirm: "Are you sure? All saved progress will be erased.", resetDone: "Progress has been reset.", vibrationUnsupported: "This browser or device does not support vibration.",
      soundUnsupported: "Sound could not play. Check your device media volume.", levelLabel: "Level {n}", locked: "Locked", color_red: "Red", color_blue: "Blue", color_green: "Green",
      color_yellow: "Yellow", color_purple: "Purple", color_orange: "Orange", color_pink: "Pink", color_cyan: "Cyan", starsEarned: "Stars earned"
    }
  };

  let lang = localStorage.getItem(STORAGE.lang) || "ar";
  if (!I18N[lang]) lang = "ar";
  let progress = loadProgress();
  let settings = loadSettings();
  let audioContext = null;
  let level = 1;
  let score = 0;
  let streak = 0;
  let bestStreakThisLevel = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let answeredCount = 0;
  let questionNo = 0;
  let previousMode = "";
  let currentQuestion = null;
  let accepting = false;
  let running = false;
  let endAt = 0;
  let questionStartedAt = 0;
  let timerId = null;
  let nextQuestionTimer = null;
  let previewTimer = null;

  function loadProgress() {
    try {
      const old = JSON.parse(localStorage.getItem(STORAGE.progress) || "{}");
      return {
        ...old,
        best: Number(old.best) || 0,
        stars: old.stars && typeof old.stars === "object" ? old.stars : {},
        unlocked: Math.max(1, Math.min(LEVELS, Number(old.unlocked) || 1)),
        levelBest: old.levelBest && typeof old.levelBest === "object" ? old.levelBest : {}
      };
    } catch (_) {
      return { best: 0, stars: {}, unlocked: 1, levelBest: {} };
    }
  }

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE.settings) || "{}");
      return { sound: saved.sound !== false, vibration: saved.vibration !== false };
    } catch (_) {
      return { sound: true, vibration: true };
    }
  }

  function saveProgress() { localStorage.setItem(STORAGE.progress, JSON.stringify(progress)); }
  function saveSettings() { localStorage.setItem(STORAGE.settings, JSON.stringify(settings)); }
  function t(key) { return I18N[lang][key] || key; }
  function fmt(key, values = {}) {
    return Object.entries(values).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), t(key));
  }
  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function uniqueOptions(correct, distractors, labelFn = value => String(value)) {
    const values = [correct];
    for (const item of shuffle(distractors)) {
      if (!values.some(value => String(value) === String(item))) values.push(item);
      if (values.length >= 4) break;
    }
    let guard = 0;
    while (values.length < 4 && guard++ < 30) {
      const candidate = Number(correct) + rand(-9, 9);
      if (!values.some(value => String(value) === String(candidate))) values.push(candidate);
    }
    return shuffle(values).map(value => ({ value, label: labelFn(value) }));
  }

  function applyLanguage() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    $("langBtn").textContent = lang === "ar" ? "EN" : "عربي";
    renderHome();
    if (running && currentQuestion) {
      $("modeName").textContent = t(`mode_${currentQuestion.mode}`);
      $("question").textContent = currentQuestion.title;
      $("hint").textContent = currentQuestion.hint;
      $("roundLabel").textContent = `${t("challengeNo")} ${questionNo}`;
    }
  }

  function show(screenId) {
    ["homeScreen", "gameScreen", "resultScreen"].forEach(id => $(id).classList.toggle("hidden", id !== screenId));
  }

  function renderHome() {
    $("bestScore").textContent = progress.best;
    const totalStars = Object.values(progress.stars).reduce((sum, value) => sum + (Number(value) || 0), 0);
    $("starsTotal").textContent = `${totalStars} / ${LEVELS * 3}`;
    $("unlockedCount").textContent = `${progress.unlocked} / ${LEVELS}`;
    renderLevels();
  }

  function renderLevels() {
    const grid = $("levelsGrid");
    if (!grid) return;
    grid.textContent = "";
    for (let number = 1; number <= LEVELS; number++) {
      const button = document.createElement("button");
      const locked = number > progress.unlocked;
      const stars = Math.max(0, Math.min(3, Number(progress.stars[number]) || 0));
      button.type = "button";
      button.className = `level-tile${locked ? " locked" : ""}${number === progress.unlocked ? " current" : ""}`;
      button.disabled = locked;
      button.setAttribute("aria-label", locked ? `${t("levelLabel").replace("{n}", number)} — ${t("locked")}` : t("levelLabel").replace("{n}", number));
      const strong = document.createElement("strong");
      strong.textContent = locked ? "🔒" : String(number);
      const small = document.createElement("small");
      small.textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
      button.append(strong, small);
      if (!locked) button.addEventListener("click", () => startLevel(number));
      grid.appendChild(button);
    }
  }

  async function beep(kind = "good") {
    if (!settings.sound) return false;
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return false;
      if (!audioContext) audioContext = new AudioCtor();
      if (audioContext.state === "suspended") await audioContext.resume();
      const tones = kind === "bad" ? [190] : kind === "finish" ? [520, 680, 820] : [650, 850];
      const start = audioContext.currentTime;
      tones.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const at = start + index * 0.11;
        oscillator.type = kind === "bad" ? "triangle" : "sine";
        oscillator.frequency.setValueAtTime(frequency, at);
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.13, at + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(at);
        oscillator.stop(at + 0.17);
      });
      return true;
    } catch (error) {
      console.warn("Audio unavailable", error);
      return false;
    }
  }

  function vibrate(kind = "good") {
    if (!settings.vibration) return false;
    try {
      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
        return navigator.vibrate(kind === "bad" ? [90, 45, 90] : [45, 35, 65]);
      }
    } catch (error) { console.warn("Vibration unavailable", error); }
    return false;
  }

  function startLevel(number) {
    clearTimers();
    level = Math.max(1, Math.min(LEVELS, number));
    score = 0; streak = 0; bestStreakThisLevel = 0;
    correctCount = 0; wrongCount = 0; answeredCount = 0; questionNo = 0; previousMode = "";
    running = true;
    endAt = Date.now() + LEVEL_SECONDS * 1000;
    $("levelLabel").textContent = `${level} / ${LEVELS}`;
    $("roundScore").textContent = "0";
    $("streakLabel").textContent = "0";
    $("answeredLabel").textContent = "0";
    show("gameScreen");
    updateTimer();
    timerId = setInterval(updateTimer, 100);
    nextQuestion();
    beep("start");
  }

  function clearTimers() {
    if (timerId) clearInterval(timerId);
    if (nextQuestionTimer) clearTimeout(nextQuestionTimer);
    if (previewTimer) clearTimeout(previewTimer);
    timerId = nextQuestionTimer = previewTimer = null;
  }

  function updateTimer() {
    if (!running) return;
    const remaining = Math.max(0, endAt - Date.now());
    const seconds = Math.ceil(remaining / 1000);
    $("timer").textContent = String(seconds);
    $("timerBar").style.width = `${(remaining / (LEVEL_SECONDS * 1000)) * 100}%`;
    $("timerBar").style.background = seconds <= 10 ? "var(--bad)" : "linear-gradient(90deg,var(--good),var(--cyan))";
    if (remaining <= 0) finishLevel();
  }

  function chooseMode() {
    const available = MODES.filter(mode => mode !== previousMode);
    const selected = available[rand(0, available.length - 1)];
    previousMode = selected;
    return selected;
  }

  function nextQuestion() {
    if (!running) return;
    accepting = false;
    questionNo++;
    currentQuestion = makeQuestion(level, chooseMode());
    $("roundLabel").textContent = `${t("challengeNo")} ${questionNo}`;
    $("modeName").textContent = t(`mode_${currentQuestion.mode}`);
    $("question").textContent = currentQuestion.title;
    $("hint").textContent = currentQuestion.hint;
    $("feedback").textContent = "";
    $("feedback").className = "feedback";
    $("visualArea").textContent = "";
    $("playArea").textContent = "";

    if (currentQuestion.preview) {
      renderVisual(currentQuestion.preview);
      previewTimer = setTimeout(() => {
        if (!running || !currentQuestion) return;
        $("visualArea").textContent = "";
        renderOptions(currentQuestion.options);
      }, currentQuestion.previewMs || 1300);
    } else {
      if (currentQuestion.visual) renderVisual(currentQuestion.visual);
      renderOptions(currentQuestion.options);
    }
  }

  function makeQuestion(currentLevel, mode) {
    const difficulty = Math.floor((currentLevel - 1) / 5);
    if (mode === "shape") {
      const count = Math.min(12, 5 + Math.floor(currentLevel / 5));
      const base = SYMBOLS[rand(0, SYMBOLS.length - 1)];
      let odd = base;
      while (odd === base) odd = SYMBOLS[rand(0, SYMBOLS.length - 1)];
      const oddAt = rand(0, count - 1);
      const options = Array.from({ length: count }, (_, index) => ({ value: index, label: index === oddAt ? odd : base }));
      return { mode, title: t("q_shape"), hint: t("h_shape"), options: shuffle(options), answer: oddAt };
    }
    if (mode === "memory") {
      const count = Math.min(7, 3 + Math.floor(currentLevel / 10));
      const sequence = Array.from({ length: count }, () => SYMBOLS[rand(0, SYMBOLS.length - 1)]);
      const position = rand(0, count - 1);
      const target = sequence[position];
      const distractors = shuffle(SYMBOLS.filter(symbol => symbol !== target)).slice(0, 3);
      const options = shuffle([target, ...distractors]).map(symbol => ({ value: symbol, label: symbol }));
      return { mode, title: fmt("memoryAsk", { n: position + 1 }), hint: t("h_memory"), preview: { tokens: sequence }, previewMs: Math.max(850, 1600 - difficulty * 35), options, answer: target };
    }
    if (mode === "numbers") {
      const count = Math.min(8, 4 + Math.floor(currentLevel / 9));
      const uniqueSet = new Set();
      while (uniqueSet.size < count) uniqueSet.add(rand(10, 30 + currentLevel * 5));
      const unique = shuffle([...uniqueSet]);
      const answer = Math.max(...unique);
      return { mode, title: t("q_numbers"), hint: t("h_numbers"), options: shuffle(unique.map(value => ({ value, label: String(value) }))), answer };
    }
    if (mode === "count") {
      const total = Math.min(30, 10 + Math.floor(currentLevel / 2));
      const lit = rand(3, Math.min(total - 2, 5 + difficulty));
      const visual = { dots: shuffle([...Array(lit).fill(true), ...Array(total - lit).fill(false)]) };
      return { mode, title: t("q_count"), hint: t("h_count"), visual, options: uniqueOptions(lit, [lit - 2, lit - 1, lit + 1, lit + 2, lit + 3].filter(value => value > 0)), answer: lit };
    }
    if (mode === "missing") {
      const step = rand(2, 4 + difficulty);
      const start = rand(1, 12 + difficulty * 3);
      const sequence = Array.from({ length: 5 }, (_, index) => start + step * index);
      const missingAt = rand(1, 3);
      const answer = sequence[missingAt];
      const tokens = sequence.map((value, index) => index === missingAt ? "?" : String(value));
      return { mode, title: t("q_missing"), hint: t("h_missing"), visual: { tokens }, options: uniqueOptions(answer, [answer - step, answer + step, answer + 2, answer - 2].filter(value => value > 0)), answer };
    }
    if (mode === "math") {
      const max = 9 + currentLevel * 3;
      const a = rand(2, max);
      const b = rand(2, Math.max(3, Math.floor(max * 0.75)));
      const operation = currentLevel < 4 ? (Math.random() < 0.5 ? "+" : "−") : ["+", "−", "×"][rand(0, 2)];
      const answer = operation === "+" ? a + b : operation === "−" ? Math.abs(a - b) : a * b;
      const expression = `${a} ${operation} ${b} = ؟`;
      return { mode, title: expression, hint: t("h_math"), options: uniqueOptions(answer, [answer + rand(1, 5), answer - rand(1, 5), answer + rand(6, 10), Math.max(0, answer - rand(6, 10))]), answer };
    }
    if (mode === "order") {
      const valueSet = new Set();
      while (valueSet.size < 5) valueSet.add(rand(5, 60 + currentLevel * 4));
      const values = [...valueSet].sort((a, b) => a - b);
      const answer = values[2];
      return { mode, title: t("q_order"), hint: t("h_order"), visual: { tokens: shuffle(values).map(String) }, options: uniqueOptions(answer, values.filter(value => value !== answer)), answer };
    }
    if (mode === "color") {
      const palette = shuffle(COLORS).slice(0, 4 + Math.min(2, Math.floor(currentLevel / 15)));
      const target = palette[rand(0, palette.length - 1)];
      const options = shuffle(palette).map(color => ({ value: color.key, label: t(`color_${color.key}`), color: color.hex }));
      return { mode, title: fmt("colorPrompt", { color: t(`color_${target.key}`) }), hint: t("h_color"), options, answer: target.key };
    }
    if (mode === "pattern") {
      const cycle = shuffle(SYMBOLS).slice(0, 3 + Math.min(1, Math.floor(currentLevel / 15)));
      const sequence = Array.from({ length: 5 + Math.min(3, difficulty) }, (_, index) => cycle[index % cycle.length]);
      const answer = cycle[sequence.length % cycle.length];
      const distractors = shuffle(SYMBOLS.filter(symbol => symbol !== answer)).slice(0, 3);
      return { mode, title: t("q_pattern"), hint: t("h_pattern"), visual: { tokens: [...sequence, "?"] }, options: shuffle([answer, ...distractors]).map(symbol => ({ value: symbol, label: symbol })), answer };
    }
    // Visual attention: count a chosen symbol in a changing symbol field.
    const target = SYMBOLS[rand(0, 5)];
    const total = Math.min(30, 12 + Math.floor(currentLevel / 2));
    const targetCount = rand(2, Math.min(8, 3 + difficulty));
    const otherSymbols = SYMBOLS.filter(symbol => symbol !== target);
    const field = Array.from({ length: targetCount }, () => target);
    while (field.length < total) field.push(otherSymbols[rand(0, otherSymbols.length - 1)]);
    const shuffledField = shuffle(field);
    return { mode: "attention", title: `${t("q_attention")}  ${target}`, hint: t("h_attention"), visual: { tokens: shuffledField }, options: uniqueOptions(targetCount, [targetCount - 2, targetCount - 1, targetCount + 1, targetCount + 2].filter(value => value > 0)), answer: targetCount };
  }

  function renderVisual(visual) {
    const area = $("visualArea");
    area.textContent = "";
    if (visual.dots) {
      const grid = document.createElement("div");
      grid.className = "visual-dots";
      visual.dots.forEach(lit => {
        const dot = document.createElement("span");
        dot.className = `visual-dot${lit ? " lit" : ""}`;
        grid.appendChild(dot);
      });
      area.appendChild(grid);
      return;
    }
    if (visual.tokens) {
      visual.tokens.forEach(token => {
        const item = document.createElement("span");
        item.className = "visual-token";
        item.textContent = token;
        area.appendChild(item);
      });
    }
  }

  function renderOptions(options) {
    const area = $("playArea");
    area.textContent = "";
    options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `game-option${option.color ? " color-option" : ""}${String(option.label).length > 3 ? " text-option" : ""}`;
      button.textContent = option.label;
      if (option.color) {
        button.style.backgroundColor = option.color;
        button.setAttribute("aria-label", option.label);
      }
      button.addEventListener("click", () => submitAnswer(option.value, button));
      area.appendChild(button);
    });
    accepting = true;
    questionStartedAt = Date.now();
  }

  function submitAnswer(value, button) {
    if (!running || !accepting || !currentQuestion) return;
    accepting = false;
    const isCorrect = String(value) === String(currentQuestion.answer);
    const elapsed = Math.max(0, (Date.now() - questionStartedAt) / 1000);
    answeredCount++;
    $("answeredLabel").textContent = String(answeredCount);
    const buttons = [...$("playArea").querySelectorAll("button")];
    buttons.forEach(item => { item.disabled = true; });

    if (isCorrect) {
      correctCount++;
      streak++;
      bestStreakThisLevel = Math.max(bestStreakThisLevel, streak);
      const base = 7 + Math.min(8, Math.floor((level - 1) / 6));
      const speedBonus = Math.max(0, Math.round(12 - elapsed * 2.2));
      const streakBonus = streak >= 3 ? Math.min(8, Math.floor(streak / 3) * 2) : 0;
      const earned = base + speedBonus + streakBonus;
      score += earned;
      button.classList.add("correct");
      $("feedback").textContent = `${t("correct")}  ${fmt("pointsEarned", { n: earned })}`;
      $("feedback").className = "feedback good";
      beep("good");
    } else {
      wrongCount++;
      streak = 0;
      const lost = Math.min(score, 2 + Math.floor(level / 18));
      score -= lost;
      button.classList.add("wrong");
      const correctButton = buttons.find(item => {
        const index = buttons.indexOf(item);
        return String(currentQuestion.options[index]?.value) === String(currentQuestion.answer);
      });
      if (correctButton) correctButton.classList.add("correct");
      $("feedback").textContent = lost ? `${t("wrong")}  ${fmt("pointsLost", { n: lost })}` : t("wrong");
      $("feedback").className = "feedback bad";
      beep("bad");
      vibrate("bad");
    }
    $("roundScore").textContent = String(score);
    $("streakLabel").textContent = String(streak);
    nextQuestionTimer = setTimeout(() => { if (running) nextQuestion(); }, 430);
  }

  function finishLevel() {
    if (!running) return;
    running = false;
    accepting = false;
    clearTimers();
    const accuracy = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0;
    const stars = answeredCount === 0 ? 0 : accuracy >= 90 ? 3 : accuracy >= 75 ? 2 : accuracy >= 55 ? 1 : 0;
    progress.best = Math.max(progress.best, score);
    progress.stars[level] = Math.max(Number(progress.stars[level]) || 0, stars);
    progress.levelBest[level] = Math.max(Number(progress.levelBest[level]) || 0, score);
    if (answeredCount > 0 && level < LEVELS) progress.unlocked = Math.max(progress.unlocked, level + 1);
    saveProgress();
    renderHome();

    $("resultIcon").textContent = stars === 3 ? "🏆" : stars > 0 ? "⭐" : "⏱️";
    $("resultTitle").textContent = stars === 3 ? t("resultExcellent") : stars > 0 ? t("resultGood") : answeredCount ? t("resultTry") : t("resultEmpty");
    $("resultText").textContent = `${t("levelComplete")} · ${t("starsEarned")}: ${stars}/3`;
    $("resultStars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
    $("finalScore").textContent = String(score);
    $("correctCount").textContent = String(correctCount);
    $("wrongCount").textContent = String(wrongCount);
    $("accuracy").textContent = `${accuracy}%`;
    $("bestStreak").textContent = String(bestStreakThisLevel);
    $("nextBtn").style.display = level < LEVELS && progress.unlocked > level ? "flex" : "none";
    show("resultScreen");
    beep("finish");
  }

  $("continueBtn").addEventListener("click", () => startLevel(Math.min(progress.unlocked, LEVELS)));
  $("backBtn").addEventListener("click", () => {
    running = false; accepting = false; clearTimers(); show("homeScreen"); renderHome();
  });
  $("homeBtn").addEventListener("click", () => { show("homeScreen"); renderHome(); });
  $("replayBtn").addEventListener("click", () => startLevel(level));
  $("nextBtn").addEventListener("click", () => startLevel(Math.min(LEVELS, level + 1)));
  $("langBtn").addEventListener("click", () => {
    lang = lang === "ar" ? "en" : "ar";
    localStorage.setItem(STORAGE.lang, lang);
    applyLanguage();
  });
  $("settingsBtn").addEventListener("click", () => $("settingsDialog").showModal());
  $("closeSettings").addEventListener("click", () => $("settingsDialog").close());

  $("soundToggle").checked = settings.sound;
  $("vibrationToggle").checked = settings.vibration;
  $("soundToggle").addEventListener("change", event => {
    settings.sound = event.target.checked; saveSettings();
    if (settings.sound) beep("good");
  });
  $("vibrationToggle").addEventListener("change", event => {
    settings.vibration = event.target.checked; saveSettings();
    if (settings.vibration && !vibrate()) alert(t("vibrationUnsupported"));
  });
  $("testSoundBtn").addEventListener("click", async () => {
    if (!settings.sound) { settings.sound = true; $("soundToggle").checked = true; saveSettings(); }
    if (!(await beep("finish"))) alert(t("soundUnsupported"));
  });
  $("testVibrationBtn").addEventListener("click", () => {
    if (!settings.vibration) { settings.vibration = true; $("vibrationToggle").checked = true; saveSettings(); }
    if (!vibrate()) alert(t("vibrationUnsupported"));
  });
  $("resetBtn").addEventListener("click", () => {
    if (!confirm(t("resetConfirm"))) return;
    progress = { best: 0, stars: {}, unlocked: 1, levelBest: {} };
    saveProgress(); renderHome(); $("settingsDialog").close(); alert(t("resetDone"));
  });

  applyLanguage();
  renderHome();
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(error => console.warn("Service worker unavailable", error)));
  }
})();

(() => {
const $ = id => document.getElementById(id);
const translations = {
ar:{tagline:"اختبر سرعة تفكيرك وتركيزك",challenge:"تحدّي العقل",heroTitle:"ركّز بسرعة… واربح النجوم!",heroDesc:"50 مستوى متدرّج، وأربعة اختبارات تقيس انتباهك وذاكرتك.",best:"أفضل نتيجة",stars:"النجوم",levels:"المستويات",continue:"ابدأ اللعب",chooseLevel:"اختر المستوى",progress:"تقدّمك محفوظ تلقائياً",footer:"لعبة مجانية للتسلية وتنشيط الذهن",level:"المستوى",levelComplete:"انتهى المستوى",points:"نقطة",nextLevel:"المستوى التالي",replay:"إعادة المحاولة",home:"الرئيسية",settings:"الإعدادات",sound:"الصوت",vibration:"الاهتزاز",reset:"إعادة ضبط التقدم",resetNote:"سيتم حذف أفضل نتيجة والنجوم والمستويات المفتوحة.",shape:"تمييز الأشكال",memory:"اختبار الذاكرة",numbers:"تحدّي الأرقام",count:"العدّ والتركيز",shapeQ:"اضغط على الشكل المختلف",memoryQ:"احفظ ترتيب الرموز ثم اختر الرمز المطلوب",numbersQ:"اختر الرقم الأكبر",countQ:"كم دائرة مضيئة تراها؟",shapeHint:"ابحث عن الرمز الذي يختلف عن البقية.",memoryHint:"شاهد الرموز لثوانٍ، ثم أجب.",numbersHint:"اختر الإجابة الصحيحة بسرعة.",countHint:"عدّ الدوائر المضيئة فقط.",round:"الجولة",correct:"إجابة صحيحة! +10",wrong:"ليست صحيحة، حاول في الجولة القادمة.",timeout:"انتهى الوقت!",excellent:"ممتاز! أداء رائع.",goodResult:"أحسنت! واصل التدريب.",tryAgain:"محاولة جيدة، جرّب مرة ثانية.",locked:"مغلق",unlocked:"مفتوح",completed:"مكتمل",memoryPrompt:"أي رمز ظهر في المكان المحدد؟",memoryShow:"احفظ هذه الرموز",memoryChoose:"اختر الرمز الذي شاهدته",resetConfirm:"متأكد؟ سيتم مسح كل تقدمك.",resetDone:"تمت إعادة ضبط التقدم.",testSound:"اختبار الصوت",testVibration:"اختبار الاهتزاز"},
en:{tagline:"Test your speed and focus",challenge:"BRAIN CHALLENGE",heroTitle:"Focus fast… earn stars!",heroDesc:"50 progressive levels and four tests for attention and memory.",best:"Best score",stars:"Stars",levels:"Levels",continue:"Start playing",chooseLevel:"Choose a level",progress:"Your progress is saved automatically",footer:"A free game to refresh your mind",level:"Level",levelComplete:"LEVEL COMPLETE",points:"points",nextLevel:"Next level",replay:"Play again",home:"Home",settings:"Settings",sound:"Sound",vibration:"Vibration",reset:"Reset progress",resetNote:"Your best score, stars and unlocked levels will be deleted.",shape:"Shape Spotter",memory:"Memory Test",numbers:"Number Challenge",count:"Count & Focus",shapeQ:"Tap the shape that is different",memoryQ:"Memorize the symbols, then choose the target",numbersQ:"Choose the largest number",countQ:"How many glowing circles do you see?",shapeHint:"Find the symbol that differs from the others.",memoryHint:"Watch the symbols, then answer.",numbersHint:"Choose the correct answer quickly.",countHint:"Count only the glowing circles.",round:"Round",correct:"Correct! +10",wrong:"Not quite. Try the next round.",timeout:"Time is up!",excellent:"Excellent! Fantastic focus.",goodResult:"Well done! Keep practicing.",tryAgain:"Good try. Give it another go.",locked:"Locked",unlocked:"Unlocked",completed:"Done",memoryPrompt:"Which symbol appeared in the marked spot?",memoryShow:"Memorize these symbols",memoryChoose:"Choose the symbol you saw",resetConfirm:"Are you sure? All progress will be erased.",resetDone:"Progress has been reset.",testSound:"Test sound",testVibration:"Test vibration"}
};
let lang=localStorage.getItem("ff_lang")||"ar", level=1, round=0, score=0, timeLeft=30, timerId=null, target=null, accepting=false, memorySequence=null;
let data=load(), settings=JSON.parse(localStorage.getItem("ff_settings")||'{"sound":true,"vibration":true}');
const modes=["shape","memory","numbers","count"], symbols=["◆","●","▲","■","✦","♥","⬟","✚"];
function load(){try{return JSON.parse(localStorage.getItem("ff_progress"))||{best:0,stars:{},unlocked:1}}catch{return{best:0,stars:{},unlocked:1}}}
function save(){localStorage.setItem("ff_progress",JSON.stringify(data))}
function t(k){return translations[lang][k]||k}
function applyLang(){document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;el.textContent=t(k)});$("langBtn").textContent=lang==="ar"?"EN":"عربي";renderLevels()}
function show(id){["homeScreen","gameScreen","resultScreen"].forEach(x=>$(x).classList.toggle("hidden",x!==id))}
function renderHome(){$("bestScore").textContent=data.best;$("starsTotal").textContent=Object.values(data.stars).reduce((a,b)=>a+b,0)+" / 150";$("unlockedCount").textContent=data.unlocked+" / 50";renderLevels()}
function renderLevels(){const grid=$("levelsGrid");if(!grid)return;grid.innerHTML="";for(let i=1;i<=50;i++){const b=document.createElement("button");b.className="level-tile"+(i>data.unlocked?" locked":"")+(i===data.unlocked?" current":"");b.disabled=i>data.unlocked;b.innerHTML=`<strong>${i>data.unlocked?"🔒":i}</strong><small>${"★".repeat(data.stars[i]||0)}${"☆".repeat(3-(data.stars[i]||0))}</small>`;b.addEventListener("click",()=>startLevel(i));grid.appendChild(b)}}
let audioContext=null;
async function beep(freq=540){
  if(!settings.sound)return;
  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;
    if(!AudioCtx)return;
    if(!audioContext)audioContext=new AudioCtx();
    if(audioContext.state==="suspended")await audioContext.resume();
    const oscillator=audioContext.createOscillator();
    const gain=audioContext.createGain();
    const now=audioContext.currentTime;
    oscillator.type="sine";
    oscillator.frequency.setValueAtTime(freq,now);
    gain.gain.setValueAtTime(0.0001,now);
    gain.gain.exponentialRampToValueAtTime(0.07,now+0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001,now+0.20);
    oscillator.connect(gain);gain.connect(audioContext.destination);
    oscillator.start(now);oscillator.stop(now+0.21);
  }catch(error){console.warn("Audio unavailable",error)}
}
function vibrate(){
  if(!settings.vibration)return;
  try{
    if(typeof navigator!=="undefined"&&typeof navigator.vibrate==="function")navigator.vibrate([70,45,70]);
  }catch(error){console.warn("Vibration unavailable",error)}
}
function startLevel(n){level=n;round=0;score=0;timeLeft=Math.max(18,34-Math.floor((level-1)/8)*2);show("gameScreen");$("levelLabel").textContent=`${level} / 50`;$("roundScore").textContent=score;clearInterval(timerId);timerId=setInterval(()=>{timeLeft--;updateTimer();if(timeLeft<=0)finish(false)},1000);nextRound()}
function updateTimer(){$("timer").textContent=timeLeft;$("timerBar").style.width=(timeLeft/(Math.max(18,34-Math.floor((level-1)/8)*2))*100)+"%";$("timerBar").style.background=timeLeft<=8?"var(--bad)":"linear-gradient(90deg,var(--good),var(--cyan))"}
function nextRound(){if(round>=5){finish(true);return}round++;accepting=true;$("roundLabel").textContent=`${t("round")} ${round} / 5`;$("roundScore").textContent=score;$("feedback").textContent="";$("feedback").className="feedback";$("playArea").innerHTML="";
const mode=modes[(level+round-2)%4];$("modeName").textContent=t(mode);$("question").textContent=t(mode+"Q");$("hint").textContent=t(mode+"Hint");
if(mode==="shape")shapeRound();if(mode==="numbers")numberRound();if(mode==="count")countRound();if(mode==="memory")memoryRound();
}
function option(text,fn,extra=""){const b=document.createElement("button");b.className="game-option "+extra;b.textContent=text;b.addEventListener("click",()=>{if(accepting)fn(b)});$("playArea").appendChild(b);return b}
function answer(ok,b){if(!accepting)return;accepting=false;if(b)b.classList.add(ok?"correct":"wrong");$("feedback").textContent=ok?t("correct"):t("wrong");$("feedback").className="feedback "+(ok?"good":"bad");if(ok){score+=10;beep(700)}else{vibrate();beep(180)}$("roundScore").textContent=score;setTimeout(nextRound,650)}
function shapeRound(){const count=8+Math.min(4,Math.floor(level/12)),base=symbols[Math.floor(Math.random()*symbols.length)];let diff;do{diff=symbols[Math.floor(Math.random()*symbols.length)]}while(diff===base);const at=Math.floor(Math.random()*count);for(let i=0;i<count;i++){const s=i===at?diff:base;option(s,b=>answer(i===at,b))}}
function numberRound(){const count=6+Math.min(4,Math.floor(level/10)),nums=Array.from({length:count},()=>Math.floor(Math.random()*(30+level*4))+1);const max=Math.max(...nums);nums.forEach(v=>option(String(v),b=>answer(v===max,b)))}
function countRound(){const total=12+Math.min(8,Math.floor(level/6)),lit=3+Math.floor(Math.random()*Math.min(7,Math.max(3,Math.floor(level/5)+3)));$("question").textContent=t("countQ");const correct=lit;for(let i=0;i<total;i++){const on=i<lit;const b=option(on?"🟡":"⚫",()=>answer(on?false:false,b));b.onclick=()=>{if(accepting)answer(Number(b.dataset.value)===correct,b)};b.dataset.value=on?"1":"0"}// replace with numeric answer choices
$("playArea").innerHTML="";const choices=[correct,Math.max(1,correct-1),correct+1,correct+2].sort(()=>Math.random()-.5);choices.forEach(v=>option(String(v),b=>answer(v===correct,b)));$("hint").textContent=t("countHint")+"  "+("🟡 ".repeat(lit))+"⚫ ".repeat(total-lit)}
function memoryRound(){const count=4+Math.min(3,Math.floor(level/12)),seq=Array.from({length:count},()=>symbols[Math.floor(Math.random()*symbols.length)]),idx=Math.floor(Math.random()*count),wanted=seq[idx];$("question").textContent=t("memoryShow");$("hint").textContent=seq.join("   ");const area=$("playArea");const note=document.createElement("div");note.style.gridColumn="1/-1";note.style.fontSize="30px";note.style.padding="18px";note.textContent=seq.join("   ");area.appendChild(note);accepting=false;setTimeout(()=>{if($("gameScreen").classList.contains("hidden"))return;$("question").textContent=t("memoryPrompt");$("hint").textContent=t("memoryChoose");area.innerHTML="";const opts=[wanted];while(opts.length<4){const s=symbols[Math.floor(Math.random()*symbols.length)];if(!opts.includes(s))opts.push(s)}opts.sort(()=>Math.random()-.5).forEach(s=>option(s,b=>answer(s===wanted,b)));accepting=true},Math.max(900,1900-Math.floor(level/10)*150))}
function finish(won){clearInterval(timerId);accepting=false;const stars=won?(score>=50?3:score>=30?2:1):(score>=40?2:score>=20?1:0);data.best=Math.max(data.best,score);data.stars[level]=Math.max(data.stars[level]||0,stars);if(won)data.unlocked=Math.max(data.unlocked,Math.min(50,level+1));save();renderHome();$("resultIcon").textContent=won?"🏆":"⏱️";$("resultTitle").textContent=won?t("excellent"):t("tryAgain");$("resultText").textContent=won?t("goodResult"):t("timeout");$("resultStars").textContent="★".repeat(stars)+"☆".repeat(3-stars);$("finalScore").textContent=score;$("nextBtn").style.display=won&&level<50?"block":"none";show("resultScreen")}
$("continueBtn").onclick=()=>startLevel(Math.min(data.unlocked,50));$("backBtn").onclick=()=>{clearInterval(timerId);show("homeScreen");renderHome()};$("homeBtn").onclick=()=>{show("homeScreen");renderHome()};$("replayBtn").onclick=()=>startLevel(level);$("nextBtn").onclick=()=>startLevel(Math.min(50,level+1));$("langBtn").onclick=()=>{lang=lang==="ar"?"en":"ar";localStorage.setItem("ff_lang",lang);applyLang()};$("settingsBtn").onclick=()=>$("settingsDialog").showModal();$("closeSettings").onclick=()=>$("settingsDialog").close();
$("soundToggle").checked=settings.sound;$("vibrationToggle").checked=settings.vibration;
$("soundToggle").onchange=e=>{settings.sound=e.target.checked;localStorage.setItem("ff_settings",JSON.stringify(settings));if(settings.sound)beep(620)};
$("vibrationToggle").onchange=e=>{settings.vibration=e.target.checked;localStorage.setItem("ff_settings",JSON.stringify(settings));if(settings.vibration)vibrate()};
$("testSoundBtn").onclick=()=>{if(!settings.sound){$("soundToggle").checked=true;settings.sound=true;localStorage.setItem("ff_settings",JSON.stringify(settings))}beep(740)};
$("testVibrationBtn").onclick=()=>{if(!settings.vibration){$("vibrationToggle").checked=true;settings.vibration=true;localStorage.setItem("ff_settings",JSON.stringify(settings))}vibrate()};
$("resetBtn").onclick=()=>{if(confirm(t("resetConfirm"))){data={best:0,stars:{},unlocked:1};save();renderHome();$("settingsDialog").close();alert(t("resetDone"))}};
applyLang();renderHome();
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();
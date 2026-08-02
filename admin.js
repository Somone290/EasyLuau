(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   *  Admin identity (client-side gate).                                 *
   *  NOTE: everything here runs in the visitor's browser. The login is  *
   *  a gate, not real security — a determined user can read the source. *
   * ------------------------------------------------------------------ */

  const ADMIN_STORE_KEY = "admin_account";
  const ADMIN_SESSION_KEY = "admin_session";
  const ADMIN_OTP_KEY = "admin_otp";
  const FB_CFG_KEY = "admin_firebase_config";
  const LEVELS_KEY = "admin_levels";
  const VISITOR_KEY = "admin_visitor_id";
  const DEFAULT_EMAIL = "freetrapsbro@outlook.fr";
  const DEFAULT_PASS = "SigmaAdmin123";

  function cyrb53(str, seed) {
    seed = seed || 0;
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0");
  }
  function hash(pw) { return cyrb53("EasyLuau:" + pw); }

  function getAccount() {
    let acc = null;
    try { acc = JSON.parse(localStorage.getItem(ADMIN_STORE_KEY) || "null"); } catch (e) { acc = null; }
    if (!acc || typeof acc.email !== "string") {
      acc = { email: DEFAULT_EMAIL, passHash: hash(DEFAULT_PASS), seeded: false };
      localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(acc));
    }
    return acc;
  }
  function setPassword(pw) {
    const acc = getAccount();
    acc.passHash = hash(pw);
    localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(acc));
  }
  function isAdminSession() { return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1"; }

  /* ------------------------------ Firebase ------------------------------ */

  let fbInitPromise = null;
  let fb = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("Could not load " + src)); };
      document.head.appendChild(s);
    });
  }

  function getFbConfig() {
    try {
      const c = JSON.parse(localStorage.getItem(FB_CFG_KEY) || "null");
      if (c && c.apiKey) return c;
    } catch (e) {}
    if (typeof FIREBASE_CONFIG !== "undefined" && FIREBASE_CONFIG.apiKey) return FIREBASE_CONFIG;
    return null;
  }
  function saveFbConfig(cfg) { localStorage.setItem(FB_CFG_KEY, JSON.stringify(cfg)); }
  function clearFbConfig() { localStorage.removeItem(FB_CFG_KEY); }

  function initFirebase() {
    if (fbInitPromise) return fbInitPromise;
    fbInitPromise = (async function () {
      const cfg = getFbConfig();
      if (!cfg) return null;
      if (typeof firebase === "undefined") {
        const ver = "10.12.0";
        await loadScript("https://www.gstatic.com/firebasejs/" + ver + "/firebase-app-compat.js");
        await loadScript("https://www.gstatic.com/firebasejs/" + ver + "/firebase-auth-compat.js");
        await loadScript("https://www.gstatic.com/firebasejs/" + ver + "/firebase-database-compat.js");
      }
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      fb = { auth: firebase.auth(), db: firebase.database() };
      return fb;
    })().catch(function (e) { fbInitPromise = null; return null; });
    return fbInitPromise;
  }

  /* ----------------------- Activity / presence -------------------------- */

  const localLog = [];

  function visitorId() {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = "v" + Math.random().toString(36).slice(2, 7);
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  }

  function pushLocal(ev) {
    localLog.unshift(ev);
    if (localLog.length > 300) localLog.pop();
  }

  async function report(type, data) {
    data = data || {};
    const id = visitorId();
    const ev = { id: id, t: Date.now(), type: type, lesson: data.lesson || 0, extra: data.extra || null };
    pushLocal(ev);
    try {
      const f = await initFirebase();
      if (f) {
        await f.db.ref("activity").push({ id: id, t: firebase.database.ServerValue.TIMESTAMP, type: type, lesson: ev.lesson, extra: ev.extra });
      }
    } catch (e) {}
  }

  async function presence() {
    const id = visitorId();
    let lesson = 0, status = "browsing";
    try {
      if (typeof current !== "undefined" && typeof LESSONS !== "undefined") {
        lesson = current + 1;
        status = (typeof completed !== "undefined" && completed.indexOf(current) !== -1) ? "completed" : "in-progress";
      }
    } catch (e) {}
    pushLocal({ id: id, t: Date.now(), type: "presence", lesson: lesson });
    try {
      const f = await initFirebase();
      if (f) {
        await f.db.ref("presence/" + id).set({
          lastSeen: firebase.database.ServerValue.TIMESTAMP,
          lesson: lesson,
          status: status
        });
      }
    } catch (e) {}
  }

  let lastStateWrite = 0;
  let trailingTimer = null;
  let localState = null;

  async function syncState(force) {
    const now = Date.now();
    if (!force && now - lastStateWrite < 1500) {
      if (!trailingTimer) {
        trailingTimer = setTimeout(function () { trailingTimer = null; syncState(true); }, 1550);
      }
      return;
    }
    lastStateWrite = now;
    const id = visitorId();
    let lesson = 0, codeText = "", outputText = "", status = "browsing";
    try {
      if (typeof current !== "undefined" && typeof code !== "undefined" && code) {
        lesson = current + 1;
        codeText = code.value || "";
        if (typeof output !== "undefined" && output) outputText = output.textContent || "";
        status = (typeof completed !== "undefined" && completed.indexOf(current) !== -1) ? "completed" : "in-progress";
      }
    } catch (e) {}
    const snap = { id: id, t: now, lesson: lesson, code: codeText, output: outputText, status: status };
    localState = snap;
    pushLocal({ id: id, t: now, type: "code", lesson: lesson, extra: (codeText || "").slice(0, 60) });
    try {
      const f = await initFirebase();
      if (f) {
        await f.db.ref("state/" + id).set({
          id: id,
          t: firebase.database.ServerValue.TIMESTAMP,
          lesson: lesson,
          code: codeText,
          output: outputText,
          status: status
        });
      }
    } catch (e) {}
  }

  /* --------------------------- Public bridge ---------------------------- */

  window.FBApp = {
    report: report,
    presence: presence,
    syncState: syncState,
    visitorId: visitorId,
    getLocalLog: function () { return localLog; },
    initFirebase: initFirebase,
    getConfig: getFbConfig,
    saveConfig: saveFbConfig,
    clearConfig: clearFbConfig,
    hasConfig: function () { return !!getFbConfig(); }
  };

  /* ------------------------------ DOM refs ------------------------------ */

  let el = {};
  function $(id) { return document.getElementById(id); }

  function cacheEls() {
    el.login = $("admin-login");
    el.loginView = $("login-view");
    el.resetView = $("reset-view");
    el.resetStep1 = $("reset-step1");
    el.resetStep2 = $("reset-step2");
    el.adminEmail = $("admin-email");
    el.adminPass = $("admin-pass");
    el.adminLoginMsg = $("admin-login-msg");
    el.adminLoginBtn = $("admin-login-btn");
    el.adminForgotBtn = $("admin-forgot-btn");
    el.resetEmail = $("reset-email");
    el.resetMsg = $("reset-msg");
    el.resetSendBtn = $("reset-send-btn");
    el.resetCode = $("reset-code");
    el.resetNewPass = $("reset-newpass");
    el.resetCodeMsg = $("reset-code-msg");
    el.resetVerifyBtn = $("reset-verify-btn");
    el.resetBackBtn = $("reset-back-btn");
    el.panel = $("admin-panel");
    el.panelClose = $("admin-panel-close");
    el.tabs = $("admin-tabs");
    el.tabLevels = $("tab-levels");
    el.tabLive = $("tab-live");
    el.tabSettings = $("tab-settings");
    el.levelList = $("admin-level-list");
    el.addLevelBtn = $("admin-add-level");
    el.editor = $("admin-editor");
    el.edTitle = $("ed-title");
    el.edTag = $("ed-tag");
    el.edBody = $("ed-body");
    el.edExample = $("ed-example");
    el.edChallenge = $("ed-challenge");
    el.edCheckType = $("ed-check-type");
    el.edExpected = $("ed-expected");
    el.edContains = $("ed-contains");
    el.edSave = $("ed-save");
    el.edCancel = $("ed-cancel");
    el.edDelete = $("ed-delete");
    el.edMsg = $("ed-msg");
    el.edHeader = $("ed-header");
    el.liveSummary = $("live-summary");
    el.liveFeed = $("live-feed");
    el.liveWatch = $("live-watch");
    el.fbInfo = $("fb-setup-info");
    el.fbInput = $("fb-config-input");
    el.fbSaveBtn = $("fb-save-btn");
    el.fbClearBtn = $("fb-clear-btn");
    el.changeCurr = $("change-curr");
    el.changeNew = $("change-new");
    el.changeBtn = $("change-pass-btn");
  }

  /* ------------------------------- Login -------------------------------- */

  function enterAdmin() {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
    el.login.hidden = true;
    document.body.style.overflow = "";
    el.panel.hidden = false;
    renderLevelList();
    refreshLive();
  }

  function logout() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    el.panel.hidden = true;
    el.login.hidden = false;
  }

  async function handleLogin() {
    const email = el.adminEmail.value.trim();
    const pass = el.adminPass.value;
    el.adminLoginMsg.textContent = "";
    if (!email || !pass) { el.adminLoginMsg.textContent = "Enter your email and password."; return; }
    const f = await initFirebase();
    if (f) {
      try {
        await f.auth.signInWithEmailAndPassword(email, pass);
        enterAdmin();
        return;
      } catch (err) {
        el.adminLoginMsg.textContent = fbErrMsg(err);
        return;
      }
    }
    const acc = getAccount();
    if (email.toLowerCase() === acc.email.toLowerCase() && hash(pass) === acc.passHash) {
      enterAdmin();
    } else {
      el.adminLoginMsg.textContent = "Wrong email or password.";
    }
  }

  function fbErrMsg(err) {
    const code = (err && err.code) || "";
    if (code.indexOf("wrong-password") !== -1 || code.indexOf("user-not-found") !== -1 || code.indexOf("invalid-credential") !== -1) return "Wrong email or password.";
    if (code.indexOf("invalid-email") !== -1) return "That email doesn't look right.";
    if (code.indexOf("network") !== -1) return "Network error — check your connection.";
    if (code.indexOf("too-many") !== -1) return "Too many attempts. Try again later.";
    return (err && err.message) ? err.message : "Could not log in.";
  }

  /* --------------------------- Forgot password -------------------------- */

  async function sendReset() {
    const email = el.resetEmail.value.trim();
    el.resetMsg.textContent = "";
    if (!email) { el.resetMsg.textContent = "Enter your email first."; return; }
    const acc = getAccount();
    const f = await initFirebase();
    if (f) {
      try {
        await f.auth.sendPasswordResetEmail(email);
        el.resetMsg.innerHTML = "A one-time reset <strong>link</strong> was sent to <strong>" + escapeHtml(email) + "</strong>. Open it in your email to set a new password.";
      } catch (err) {
        el.resetMsg.textContent = fbErrMsg(err);
      }
      return;
    }
    if (email.toLowerCase() !== acc.email.toLowerCase()) {
      el.resetMsg.textContent = "That email isn't the admin account. (Local mode: " + acc.email + ")";
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    localStorage.setItem(ADMIN_OTP_KEY, JSON.stringify({ code: code, expires: Date.now() + 5 * 60 * 1000 }));
    el.resetMsg.innerHTML = "Firebase isn't configured, so no real email can be sent. Your one-time code for this browser is:<br><strong style=\"font-size:22px;letter-spacing:3px\">" + code + "</strong>";
    el.resetStep1.hidden = true;
    el.resetStep2.hidden = false;
  }

  function verifyReset() {
    const code = el.resetCode.value.trim();
    const newPass = el.resetNewPass.value;
    el.resetCodeMsg.textContent = "";
    let otp = null;
    try { otp = JSON.parse(localStorage.getItem(ADMIN_OTP_KEY) || "null"); } catch (e) {}
    if (!otp || otp.code !== code) { el.resetCodeMsg.textContent = "That code is wrong."; return; }
    if (Date.now() > otp.expires) { el.resetCodeMsg.textContent = "That code has expired. Request a new one."; return; }
    if (newPass.length < 6) { el.resetCodeMsg.textContent = "New password must be at least 6 characters."; return; }
    setPassword(newPass);
    localStorage.removeItem(ADMIN_OTP_KEY);
    el.resetMsg.innerHTML = "Password updated. Go back and log in with your new password.";
    el.resetStep2.hidden = true;
    el.resetStep1.hidden = false;
    el.resetCode.value = "";
    el.resetNewPass.value = "";
  }

  /* --------------------------- Level editor ----------------------------- */

  function loadAdminLevels() {
    let v = null;
    try { v = JSON.parse(localStorage.getItem(LEVELS_KEY) || "null"); } catch (e) { v = null; }
    if (!v || typeof v !== "object") v = { overrides: {}, customs: [] };
    if (!v.overrides || typeof v.overrides !== "object") v.overrides = {};
    if (!Array.isArray(v.customs)) v.customs = [];
    return v;
  }
  function saveAdminLevels(v) { localStorage.setItem(LEVELS_KEY, JSON.stringify(v)); }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function renderLevelList() {
    if (!el.levelList) return;
    el.levelList.innerHTML = "";
    const list = (typeof LESSONS !== "undefined") ? LESSONS : [];
    list.forEach(function (lesson, idx) {
      const base = (typeof BASE_LESSONS !== "undefined" && idx < BASE_LESSONS.length);
      const row = document.createElement("div");
      row.className = "admin-level-row";
      row.innerHTML =
        '<span class="alv-num">' + (idx + 1) + "</span>" +
        '<span class="alv-title">' + escapeHtml(lesson.title) + "</span>" +
        '<span class="alv-tag">' + escapeHtml(lesson.tag || "") + "</span>" +
        '<span class="alv-src">' + (base ? "built-in" : "custom") + "</span>" +
        '<button class="alv-edit" data-i="' + idx + '">Edit</button>' +
        '<button class="alv-del" data-i="' + idx + '">' + (base ? "Reset" : "Delete") + "</button>";
      el.levelList.appendChild(row);
    });
    el.levelList.querySelectorAll(".alv-edit").forEach(function (b) {
      b.addEventListener("click", function () { openEditor(Number(b.getAttribute("data-i"))); });
    });
    el.levelList.querySelectorAll(".alv-del").forEach(function (b) {
      b.addEventListener("click", function () { deleteLevel(Number(b.getAttribute("data-i"))); });
    });
  }

  function editorState() { return JSON.parse(el.editor.getAttribute("data-state") || "{}"); }
  function setEditorState(s) { el.editor.setAttribute("data-state", JSON.stringify(s)); }

  function openEditor(idx) {
    const list = (typeof LESSONS !== "undefined") ? LESSONS : [];
    const base = (typeof BASE_LESSONS !== "undefined" && idx < BASE_LESSONS.length);
    const lesson = list[idx];
    const state = { mode: "edit", idx: idx, base: base };
    setEditorState(state);
    el.edHeader.textContent = (base ? "Edit level " + (idx + 1) : "Edit custom level") + " — " + escapeHtml(lesson.title);
    el.edTitle.value = lesson.title || "";
    el.edTag.value = lesson.tag || "";
    el.edBody.value = lesson.body || "";
    el.edExample.value = lesson.example || "";
    el.edChallenge.value = lesson.challenge || "";
    const hasExpected = Array.isArray(lesson.expected) && lesson.expected.length;
    el.edCheckType.value = hasExpected ? "exact" : "contains";
    el.edExpected.value = hasExpected ? lesson.expected.join("\n") : "";
    el.edContains.value = (!hasExpected && Array.isArray(lesson.contains)) ? lesson.contains.join("\n") : "";
    el.edDelete.textContent = base ? "Reset to original" : "Delete level";
    el.edDelete.hidden = !base;
    el.edMsg.textContent = "";
    el.editor.hidden = false;
  }

  function openAddEditor() {
    const state = { mode: "add" };
    setEditorState(state);
    el.edHeader.textContent = "Add a new level";
    el.edTitle.value = "";
    el.edTag.value = "";
    el.edBody.value = "";
    el.edExample.value = "";
    el.edChallenge.value = "";
    el.edCheckType.value = "exact";
    el.edExpected.value = "";
    el.edContains.value = "";
    el.edDelete.hidden = true;
    el.edMsg.textContent = "";
    el.editor.hidden = false;
  }

  function closeEditor() { el.editor.hidden = true; }

  function saveEditor() {
    const st = editorState();
    const title = el.edTitle.value.trim();
    const tag = el.edTag.value.trim();
    const body = el.edBody.value;
    const example = el.edExample.value;
    const challenge = el.edChallenge.value;
    if (!title) { el.edMsg.textContent = "A title is required."; return; }
    const checkType = el.edCheckType.value;
    const expected = el.edExpected.value.split("\n").map(function (s) { return s.replace(/\r$/, ""); }).filter(function (s) { return s.length; });
    const contains = el.edContains.value.split("\n").map(function (s) { return s.replace(/\r$/, ""); }).filter(function (s) { return s.length; });
    const lesson = { title: title, tag: tag, body: body, example: example, challenge: challenge };
    if (checkType === "exact") { lesson.expected = expected; lesson.contains = undefined; }
    else { lesson.contains = contains; lesson.expected = undefined; }
    const v = loadAdminLevels();
    if (st.mode === "add") {
      lesson.id = "c" + Date.now();
      v.customs.push(lesson);
    } else if (st.base) {
      v.overrides[st.idx] = lesson;
    } else {
      const i = v.customs.findIndex(function (c) { return c.id === editorCustomId(st); });
      if (i !== -1) { v.customs[i] = Object.assign({}, v.customs[i], lesson); }
    }
    saveAdminLevels(v);
    closeEditor();
    window.dispatchEvent(new Event("lessons-changed"));
    renderLevelList();
  }

  function editorCustomId(st) {
    try {
      const list = (typeof LESSONS !== "undefined") ? LESSONS : [];
      const lesson = list[st.idx];
      if (lesson && lesson.id) return lesson.id;
    } catch (e) {}
    return null;
  }

  function deleteLevel(idx) {
    const v = loadAdminLevels();
    const base = (typeof BASE_LESSONS !== "undefined" && idx < BASE_LESSONS.length);
    if (base) {
      delete v.overrides[idx];
      saveAdminLevels(v);
      window.dispatchEvent(new Event("lessons-changed"));
      renderLevelList();
    } else {
      const lesson = (typeof LESSONS !== "undefined") ? LESSONS[idx] : null;
      if (lesson && lesson.id) {
        const i = v.customs.findIndex(function (c) { return c.id === lesson.id; });
        if (i !== -1) v.customs.splice(i, 1);
        saveAdminLevels(v);
        window.dispatchEvent(new Event("lessons-changed"));
        renderLevelList();
      }
    }
  }

  /* ------------------------------ Live tab ------------------------------ */

  let liveTimer = null;
  let fbActivityOff = null;
  let fbPresenceOff = null;
  let fbStateOff = null;

  function fmtTime(t) {
    const d = new Date(t);
    return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
  }
  function ago(t) {
    const s = Math.floor((Date.now() - t) / 1000);
    if (s < 5) return "just now";
    if (s < 60) return s + "s ago";
    if (s < 3600) return Math.floor(s / 60) + "m ago";
    return Math.floor(s / 3600) + "h ago";
  }
  function shortId(id) { return id ? String(id).slice(-5).toUpperCase() : "?"; }
  function typeLabel(t) {
    if (t === "complete") return '<span class="live-ok">COMPLETED</span>';
    if (t === "fail") return '<span class="live-fail">FAILED</span>';
    if (t === "presence") return '<span class="live-dim">ONLINE</span>';
    return '<span class="live-dim">VIEWED</span>';
  }

  async function refreshLive() {
    if (!el.tabLive || el.tabLive.hidden) return;
    if (fbActivityOff || fbPresenceOff) return; // Firebase streaming is authoritative
    renderLocalLive();
  }

  function renderLocalLive() {
    const log = window.FBApp.getLocalLog();
    const now = Date.now();
    const active = log.filter(function (ev) { return ev.type === "presence" && now - ev.t < 15000; }).length;
    el.liveSummary.innerHTML =
      '<div class="live-summary-row"><span class="live-now">' + (active > 0 ? active + " here now" : "0 here now") + "</span></div>" +
      '<div class="live-note">Local-only view (this browser). Connect Firebase in Settings to watch real visitors.</div>';
    el.liveFeed.innerHTML = log.slice(0, 60).map(function (ev) {
      return '<div class="live-row"><span class="live-time">' + fmtTime(ev.t) + "</span>" +
        "<span>" + shortId(ev.id) + "</span>" +
        typeLabel(ev.type) +
        "<span>Level " + (ev.lesson || "?") + "</span></div>";
    }).join("") || '<div class="live-note">No activity yet.</div>';
    renderLocalWatch();
  }

  function renderLocalWatch() {
    if (!el.liveWatch) return;
    if (!localState) { el.liveWatch.innerHTML = '<div class="live-note">Waiting for you to open a lesson or run some code…</div>'; return; }
    const v = localState;
    el.liveWatch.innerHTML = watchCardHtml(v);
  }

  function watchCardHtml(v) {
    const codeTxt = (v.code || "").trim();
    const outTxt = (v.output || "").trim();
    return '<div class="watch-card">' +
      '<div class="watch-head"><strong>#' + shortId(v.id) + "</strong>" +
      '<span class="live-ok">● LIVE</span><span>Level ' + (v.lesson || "?") + " (" + (v.status || "browsing") + ")</span></div>" +
      '<div class="watch-label">Code</div><pre class="watch-code">' + escapeHtml(codeTxt || "(empty)") + "</pre>" +
      '<div class="watch-label">Output</div><pre class="watch-out">' + escapeHtml(outTxt || "(nothing)") + "</pre>" +
      '<div class="watch-meta">updated ' + ago(v.t) + "</div></div>";
  }

  function renderFbWatch(vals) {
    if (!el.liveWatch) return;
    const list = [];
    if (vals) {
      Object.keys(vals).forEach(function (k) {
        const v = vals[k];
        if (!v) return;
        const last = (v.t && typeof v.t === "number") ? v.t : 0;
        if (Date.now() - last < 120000) list.push(v);
      });
    }
    list.sort(function (a, b) { return (b.t || 0) - (a.t || 0); });
    if (!list.length) {
      el.liveWatch.innerHTML = '<div class="live-note">Waiting for a visitor to open the editor…</div>';
      return;
    }
    el.liveWatch.innerHTML = list.slice(0, 3).map(watchCardHtml).join("");
  }

  async function startLiveFirebase() {
    const f = await initFirebase();
    if (!f) return false;
    if (fbActivityOff) return true;
    el.liveSummary.innerHTML = '<div class="live-summary-row"><span class="live-now">Connecting…</span></div>';
    const onErr = function (err) {
      el.liveSummary.innerHTML = '<div class="live-fail">Firebase error: ' +
        escapeHtml((err && err.message) || "permission denied") +
        ' — check your Realtime Database rules.</div>';
    };
    fbActivityOff = f.db.ref("activity").orderByChild("t").limitToLast(60).on("value", function (snap) {
      renderFbFeed(snap.val());
    }, onErr);
    fbPresenceOff = f.db.ref("presence").on("value", function (snap) {
      renderFbPresence(snap.val());
    }, onErr);
    fbStateOff = f.db.ref("state").limitToLast(20).on("value", function (snap) {
      renderFbWatch(snap.val());
    }, onErr);
    return true;
  }

  function renderFbFeed(vals) {
    if (!vals) { el.liveFeed.innerHTML = '<div class="live-note">No activity yet.</div>'; return; }
    const rows = Object.keys(vals).map(function (k) { return vals[k]; })
      .filter(function (v) { return v && v.t; })
      .sort(function (a, b) { return b.t - a.t; })
      .slice(0, 60);
    el.liveFeed.innerHTML = rows.map(function (ev) {
      return '<div class="live-row"><span class="live-time">' + fmtTime(ev.t) + "</span>" +
        "<span>" + shortId(ev.id) + "</span>" +
        typeLabel(ev.type) +
        "<span>Level " + (ev.lesson || "?") + "</span></div>";
    }).join("") || '<div class="live-note">No activity yet.</div>';
  }

  function renderFbPresence(vals) {
    const now = Date.now();
    const list = [];
    if (vals) {
      Object.keys(vals).forEach(function (k) {
        const v = vals[k];
        const last = v && (v.lastSeen && typeof v.lastSeen === "number") ? v.lastSeen : 0;
        if (now - last < 20000) list.push({ id: k, lesson: v.lesson, status: v.status, last: last });
      });
    }
    list.sort(function (a, b) { return b.last - a.last; });
    const liveCount = list.length;
    const rows = list.map(function (p) {
      return '<div class="live-row"><span class="live-time">' + fmtTime(p.last) + "</span>" +
        "<span>" + shortId(p.id) + "</span>" +
        '<span class="live-ok">● LIVE</span>' +
        "<span>Level " + (p.lesson || "?") + " (" + (p.status || "browsing") + ")</span></div>";
    }).join("");
    el.liveSummary.innerHTML =
      '<div class="live-summary-row"><span class="live-now">' + liveCount + " learning right now</span></div>" +
      '<div class="live-note">Live from Firebase Realtime Database.</div>' + rows;
  }

  /* ------------------------------ Settings ------------------------------ */

  function renderSettings() {
    const cfg = getFbConfig();
    el.fbInput.value = cfg ? JSON.stringify(cfg, null, 2) : "";
    el.fbInfo.innerHTML = cfg
      ? '<div class="live-ok">Firebase configured. Live tracking is on.</div>'
      : '<div class="live-note">Firebase is not configured. The live tab only shows this browser. To enable real live viewing:<br><br>' +
        "1. Go to <strong>console.firebase.google.com</strong> and create a project (e.g. EasyLuau).<br>" +
        "2. Click the <strong>&lt;/&gt;</strong> web-app icon and register an app named <strong>EasyLuau</strong>.<br>" +
        "3. Copy the <strong>firebaseConfig</strong> object it shows and paste it below.<br>" +
        "4. In <strong>Authentication</strong> enable <strong>Email/Password</strong>.<br>" +
        "5. In <strong>Realtime Database</strong> create a database (test mode is fine to start).<br>" +
        "6. Add your user in Authentication &gt; Users: <strong>freetrapsbro@outlook.fr</strong>.<br>" +
        "7. Save the config below and reopen the Live tab.</div>";
  }

  /* -------------------------------- Boot -------------------------------- */

  function bindEvents() {
    el.adminLoginBtn.addEventListener("click", handleLogin);
    el.adminPass.addEventListener("keydown", function (e) { if (e.key === "Enter") handleLogin(); });
    el.adminForgotBtn.addEventListener("click", function () {
      el.loginView.hidden = true;
      el.resetView.hidden = false;
      el.resetStep1.hidden = false;
      el.resetStep2.hidden = true;
      el.resetMsg.textContent = "";
    });
    el.resetBackBtn.addEventListener("click", function () {
      el.resetView.hidden = true;
      el.loginView.hidden = false;
    });
    el.resetSendBtn.addEventListener("click", sendReset);
    el.resetVerifyBtn.addEventListener("click", verifyReset);
    el.panelClose.addEventListener("click", logout);

    el.tabs.querySelectorAll("[data-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        el.tabs.querySelectorAll("[data-tab]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        el.tabLevels.hidden = btn.getAttribute("data-tab") !== "levels";
        el.tabLive.hidden = btn.getAttribute("data-tab") !== "live";
        el.tabSettings.hidden = btn.getAttribute("data-tab") !== "settings";
        if (!el.tabLevels.hidden) renderLevelList();
        if (!el.tabLive.hidden) { if (window.FBApp.hasConfig()) startLiveFirebase(); else renderLocalLive(); }
        if (!el.tabSettings.hidden) renderSettings();
      });
    });

    el.addLevelBtn.addEventListener("click", openAddEditor);
    el.edSave.addEventListener("click", saveEditor);
    el.edCancel.addEventListener("click", closeEditor);
    el.edDelete.addEventListener("click", function () {
      const st = editorState();
      if (st.mode === "edit" && st.base) {
        delete loadAdminLevels().overrides[st.idx];
        const v = loadAdminLevels();
        delete v.overrides[st.idx];
        saveAdminLevels(v);
        window.dispatchEvent(new Event("lessons-changed"));
        closeEditor();
        renderLevelList();
      }
    });

    el.fbSaveBtn.addEventListener("click", function () {
      try {
        const cfg = JSON.parse(el.fbInput.value);
        if (!cfg.apiKey) throw new Error("apiKey missing");
        saveFbConfig(cfg);
        renderSettings();
      } catch (err) {
        el.fbInfo.innerHTML = '<div class="live-fail">That is not a valid config object: ' + escapeHtml(err.message) + "</div>";
      }
    });
    el.fbClearBtn.addEventListener("click", function () {
      clearFbConfig();
      renderSettings();
    });
    el.changeBtn.addEventListener("click", function () {
      const acc = getAccount();
      if (hash(el.changeCurr.value) !== acc.passHash) {
        el.fbInfo.innerHTML = '<div class="live-fail">Current password is wrong.</div>';
        return;
      }
      if (el.changeNew.value.length < 6) {
        el.fbInfo.innerHTML = '<div class="live-fail">New password must be at least 6 characters.</div>';
        return;
      }
      setPassword(el.changeNew.value);
      el.changeCurr.value = "";
      el.changeNew.value = "";
      el.fbInfo.innerHTML = '<div class="live-ok">Password updated.</div>';
    });
  }

  function boot() {
    cacheEls();
    bindEvents();
    if (window.location.hash === "#admin") {
      if (isAdminSession()) {
        enterAdmin();
      } else {
        el.login.hidden = false;
      }
    }
    if (window.FBApp.hasConfig()) {
      presence();
      setInterval(presence, 10000);
      window.addEventListener("pagehide", function () {
        if (fb) {
          try { fb.db.ref("presence/" + visitorId()).remove(); } catch (e) {}
        }
      });
    }
    setInterval(function () {
      if (el.tabLive && !el.tabLive.hidden && !(fbActivityOff || fbPresenceOff || fbStateOff)) renderLocalLive();
    }, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

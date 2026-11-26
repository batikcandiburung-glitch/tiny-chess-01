// AngkaBangsa user settings: theme, language, text size, motion.
// Persisted in localStorage (guarded — the app also runs from file:// and in
// sandboxed frames where storage may throw; an in-memory copy always works).

const KEY = 'angkabangsa-settings';
const DEFAULTS = { theme: 'light', lang: 'en', text: 'normal', motion: 'full' };

let current = { ...DEFAULTS };
try {
  const raw = window.localStorage.getItem(KEY);
  if (raw) current = { ...DEFAULTS, ...JSON.parse(raw) };
} catch (e) { /* storage unavailable — defaults apply */ }

export function getSettings() {
  return { ...current };
}

export function applySettings() {
  const el = document.documentElement;
  el.dataset.theme = current.theme;
  el.dataset.text = current.text;
  el.dataset.motion = current.motion;
  el.setAttribute('lang', current.lang === 'id' ? 'id' : 'en');
}

export function setSetting(key, value) {
  current = { ...current, [key]: value };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(current));
  } catch (e) { /* keep in-memory only */ }
  applySettings();
}

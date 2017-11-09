import a from '../actions';

const localStorageKey = 'redux';

const load = () => {
  if (typeof window === 'undefined') return {};
  if (window.localStorage === undefined) return {};
  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem(localStorageKey) || '{}');
  } catch (err) {
    console.error('Failed to load state from localStorate');
    stored = {};
  }
  return stored;
};

let timeout;
const debounceTime = 3000;

const save = store => next => (action) => {
  if (action.type !== a.end.getType()) return next(action);
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    const state = store.getState();
    localStorage.setItem(localStorageKey, JSON.stringify(state));
    timeout = undefined;
  }, debounceTime);
  return next(action);
};

export default {
  save,
  load
};

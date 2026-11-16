import { classifySearchError } from '../utils/errorClassifier.js';
const HISTORY_STORAGE_KEY = 'country_search_history';
const MAX_HISTORY_ITEMS = 5;
export class SearchController {
  fetcher;
  onStateChange;
  activeCleanup = null;
  latestRequestId = 0;
  cache = new Map();
  inFlight = new Map();
  state;
  constructor(fetcher, onStateChange) {
    this.fetcher = fetcher;
    this.onStateChange = onStateChange;
    this.state = {
      status: 'idle',
      query: '',
      results: [],
      errorMessage: '',
      history: this.loadHistory(),
    };
  }
  getState() {
    return this.state;
  }
  getHistory() {
    return [...this.state.history];
  }
  cancelActiveRequest() {
    if (this.activeCleanup) {
      this.activeCleanup();
      this.activeCleanup = null;
    }
    this.latestRequestId++;
  }
  async search(rawQuery, forceRefresh = false) {
    const trimmed = rawQuery.trim();
    const normalizedKey = trimmed.toLowerCase();
    this.cancelActiveRequest();
    const requestId = this.latestRequestId;
    if (!trimmed) {
      this.updateState({
        status: 'idle',
        query: '',
        results: [],
        errorMessage: '',
      });
      return;
    }
    if (!forceRefresh && this.cache.has(normalizedKey)) {
      const cached = this.cache.get(normalizedKey) ?? [];
      this.saveToHistory(trimmed);
      this.updateState({
        status: cached.length > 0 ? 'success' : 'empty',
        query: trimmed,
        results: cached,
        errorMessage: '',
      });
      return;
    }
    this.updateState({
      status: 'loading',
      query: trimmed,
      errorMessage: '',
    });
    let entry = !forceRefresh ? this.inFlight.get(normalizedKey) : undefined;
    if (!entry) {
      const controller = new AbortController();
      const promise = this.fetcher(trimmed, controller.signal);
      entry = {
        promise,
        controller,
        subscribers: 0,
      };
      this.inFlight.set(normalizedKey, entry);
    }
    entry.subscribers += 1;
    let released = false;
    const releaseSubscriber = (shouldAbort) => {
      if (released) return;
      released = true;
      entry.subscribers -= 1;
      if (entry.subscribers <= 0) {
        if (this.inFlight.get(normalizedKey) === entry) {
          this.inFlight.delete(normalizedKey);
        }
        if (shouldAbort) {
          entry.controller.abort();
        }
      }
    };
    const cleanup = () => releaseSubscriber(true);
    this.activeCleanup = cleanup;
    try {
      const countries = await entry.promise;
      releaseSubscriber(false);
      if (requestId !== this.latestRequestId) {
        return;
      }
      this.cache.set(normalizedKey, countries);
      this.saveToHistory(trimmed);
      this.updateState({
        status: countries.length > 0 ? 'success' : 'empty',
        query: trimmed,
        results: countries,
        errorMessage: '',
      });
    } catch (error) {
      releaseSubscriber(false);
      if (requestId !== this.latestRequestId) {
        return;
      }
      const classified = classifySearchError(error);
      if (!classified.isUserError) {
        return;
      }
      this.updateState({
        status: 'error',
        query: trimmed,
        results: [],
        errorMessage: classified.message,
      });
    } finally {
      if (this.activeCleanup === cleanup) {
        this.activeCleanup = null;
      }
    }
  }
  retry() {
    return this.search(this.state.query, true);
  }
  updateState(partial) {
    this.state = {
      ...this.state,
      ...partial,
    };
    this.onStateChange(this.state);
  }
  loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((item) => typeof item === 'string')
        : [];
    } catch {
      return [];
    }
  }
  saveToHistory(query) {
    const normalized = query.toLowerCase();
    const filtered = this.state.history.filter(
      (item) => item.toLowerCase() !== normalized
    );
    const updated = [query, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    this.state.history = updated;
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota errors
    }
  }
}

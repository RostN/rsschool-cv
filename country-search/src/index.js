import { searchCountries } from './api/searchCountries.js';
import { SearchController } from './core/searchController.js';
import { AppView } from './ui/appView.js';
import { debounce } from './utils/debounce.js';
const DEBOUNCE_DELAY_MS = 350;
function bootstrap() {
  const controller = new SearchController(searchCountries, (state) => {
    view.render(state);
  });
  const debouncedSearch = debounce((query) => {
    void controller.search(query);
  }, DEBOUNCE_DELAY_MS);
  const view = new AppView(document.body, {
    onSearchInput: (value) => {
      if (!value.trim()) {
        void controller.search('');
        return;
      }
      debouncedSearch(value);
    },
    onRetry: () => {
      void controller.retry();
    },
    onHistorySelect: (query) => {
      view.setInputValue(query);
      void controller.search(query);
    },
  });
  view.render(controller.getState());
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

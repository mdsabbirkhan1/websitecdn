// Additional JavaScript Enhancements for Tools Website Theme

// Enhanced Search with Autocomplete
class ToolSearch {
  constructor() {
    this.searchInput = document.getElementById('searchInput');
    this.toolsGrid = document.getElementById('toolsGrid');
    this.searchResults = [];
    this.init();
  }

  init() {
    this.createSearchSuggestions();
    this.bindEvents();
    this.loadSearchData();
  }

  createSearchSuggestions() {
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.id = 'searchSuggestions';
    this.searchInput.parentNode.appendChild(suggestionsContainer);
  }

  bindEvents() {
    this.searchInput.addEventListener('input', this.handleSearch.bind(this));
    this.searchInput.addEventListener('focus', this.showSuggestions.bind(this));
    document.addEventListener('click', this.hideSuggestions.bind(this));
  }

  loadSearchData() {
    const toolCards = this.toolsGrid.querySelectorAll('.tool-card');
    this.searchResults = Array.from(toolCards).map(card => ({
      title: card.querySelector('h3').textContent,
      description: card.querySelector('.tool-description').textContent,
      tags: Array.from(card.querySelectorAll('.tool-tag')).map(tag => tag.textContent),
      element: card
    }));
  }

  handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const suggestions = this.getSuggestions(searchTerm);
    this.displaySuggestions(suggestions);
    this.filterTools(searchTerm);
  }

  getSuggestions(searchTerm) {
    if (searchTerm.length < 2) return [];
    
    const suggestions = new Set();
    this.searchResults.forEach(result => {
      if (result.title.toLowerCase().includes(searchTerm)) {
        suggestions.add(result.title);
      }
      result.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchTerm)) {
          suggestions.add(tag);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  }

  displaySuggestions(suggestions) {
    const container = document.getElementById('searchSuggestions');
    container.innerHTML = '';
    
    if (suggestions.length === 0) {
      container.style.display = 'none';
      return;
    }
    
    suggestions.forEach(suggestion => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.textContent = suggestion;
      item.addEventListener('click', () => {
        this.searchInput.value = suggestion;
        this.filterTools(suggestion.toLowerCase());
        this.hideSuggestions();
      });
      container.appendChild(item);
    });
    
    container.style.display = 'block';
  }

  showSuggestions() {
    const container = document.getElementById('searchSuggestions');
    if (container.children.length > 0) {
      container.style.display = 'block';
    }
  }

  hideSuggestions(e) {
    if (e && this.searchInput.contains(e.target)) return;
    const container = document.getElementById('searchSuggestions');
    container.style.display = 'none';
  }

  filterTools(searchTerm) {
    this.searchResults.forEach(result => {
      const matches = result.title.toLowerCase().includes(searchTerm) ||
                     result.description.toLowerCase().includes(searchTerm) ||
                     result.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      result.element.style.display = matches ? 'block' : 'none';
    });
  }
}

// Advanced Filtering System
class ToolFilter {
  constructor() {
    this.categoryFilter = document.getElementById('categoryFilter');
    this.tagsFilter = document.getElementById('tagsFilter');
    this.toolsGrid = document.getElementById('toolsGrid');
    this.init();
  }

  init() {
    this.bindEvents();
    this.populateFilters();
  }

  bindEvents() {
    this.categoryFilter.addEventListener('change', this.applyFilters.bind(this));
    this.tagsFilter.addEventListener('change', this.applyFilters.bind(this));
  }

  populateFilters() {
    const categories = new Set();
    const tags = new Set();
    
    const toolCards = this.toolsGrid.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
      // Extract categories from subtitle
      const subtitle = card.querySelector('.tool-subtitle');
      if (subtitle) {
        subtitle.textContent.split('•').forEach(cat => {
          categories.add(cat.trim());
        });
      }
      
      // Extract tags
      const tagElements = card.querySelectorAll('.tool-tag');
      tagElements.forEach(tag => {
        tags.add(tag.textContent.replace('#', '').trim());
      });
    });
    
    // Populate category filter
    categories.forEach(category => {
      if (category) {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        this.categoryFilter.appendChild(option);
      }
    });
    
    // Populate tags filter
    tags.forEach(tag => {
      if (tag) {
        const option = document.createElement('option');
        option.value = tag.toLowerCase();
        option.textContent = tag;
        this.tagsFilter.appendChild(option);
      }
    });
  }

  applyFilters() {
    const selectedCategory = this.categoryFilter.value.toLowerCase();
    const selectedTag = this.tagsFilter.value.toLowerCase();
    
    const toolCards = this.toolsGrid.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
      let categoryMatch = true;
      let tagMatch = true;
      
      if (selectedCategory) {
        const subtitle = card.querySelector('.tool-subtitle');
        categoryMatch = subtitle && subtitle.textContent.toLowerCase().includes(selectedCategory);
      }
      
      if (selectedTag) {
        const tags = Array.from(card.querySelectorAll('.tool-tag'));
        tagMatch = tags.some(tag => tag.textContent.toLowerCase().includes(selectedTag));
      }
      
      card.style.display = (categoryMatch && tagMatch) ? 'block' : 'none';
    });
    
    this.updateResultsCount();
  }

  updateResultsCount() {
    const visibleCards = this.toolsGrid.querySelectorAll('.tool-card[style*="block"], .tool-card:not([style*="none"])');
    const countElement = document.getElementById('resultsCount');
    
    if (!countElement) {
      const count = document.createElement('div');
      count.id = 'resultsCount';
      count.className = 'results-count';
      this.toolsGrid.parentNode.insertBefore(count, this.toolsGrid);
    }
    
    document.getElementById('resultsCount').textContent = `${visibleCards.length} tools found`;
  }
}

// Analytics and Event Tracking
class ToolAnalytics {
  constructor() {
    this.init();
  }

  init() {
    this.trackToolClicks();
    this.trackSearchQueries();
    this.trackFilterUsage();
    this.trackThemeToggle();
  }

  trackToolClicks() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('visit-btn')) {
        const toolCard = e.target.closest('.tool-card');
        const toolName = toolCard.querySelector('h3').textContent;
        this.sendEvent('tool_click', {
          tool_name: toolName,
          click_type: 'visit_button'
        });
      }
    });
  }

  trackSearchQueries() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        if (e.target.value.length > 2) {
          this.sendEvent('search_query', {
            query: e.target.value,
            results_count: this.getVisibleToolsCount()
          });
        }
      }, 1000);
    });
  }

  trackFilterUsage() {
    const categoryFilter = document.getElementById('categoryFilter');
    const tagsFilter = document.getElementById('tagsFilter');
    
    categoryFilter.addEventListener('change', (e) => {
      this.sendEvent('filter_used', {
        filter_type: 'category',
        filter_value: e.target.value
      });
    });
    
    tagsFilter.addEventListener('change', (e) => {
      this.sendEvent('filter_used', {
        filter_type: 'tags',
        filter_value: e.target.value
      });
    });
  }

  trackThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      this.sendEvent('theme_toggle', {
        new_theme: currentTheme === 'dark' ? 'light' : 'dark'
      });
    });
  }

  getVisibleToolsCount() {
    const toolsGrid = document.getElementById('toolsGrid');
    const visibleCards = toolsGrid.querySelectorAll('.tool-card[style*="block"], .tool-card:not([style*="none"])');
    return visibleCards.length;
  }

  sendEvent(eventName, parameters) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }
    
    // Console logging for development
    console.log('Analytics Event:', eventName, parameters);
  }
}

// Favorites System
class ToolFavorites {
  constructor() {
    this.favorites = JSON.parse(localStorage.getItem('toolFavorites') || '[]');
    this.init();
  }

  init() {
    this.addFavoriteButtons();
    this.updateFavoriteStates();
    this.bindEvents();
  }

  addFavoriteButtons() {
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
      const favoriteBtn = document.createElement('button');
      favoriteBtn.className = 'favorite-btn';
      favoriteBtn.innerHTML = '♡';
      favoriteBtn.title = 'Add to favorites';
      
      const header = card.querySelector('.tool-card-header');
      header.appendChild(favoriteBtn);
    });
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('favorite-btn')) {
        e.preventDefault();
        this.toggleFavorite(e.target);
      }
    });
  }

  toggleFavorite(button) {
    const toolCard = button.closest('.tool-card');
    const toolName = toolCard.querySelector('h3').textContent;
    
    if (this.favorites.includes(toolName)) {
      this.removeFavorite(toolName);
      button.innerHTML = '♡';
      button.title = 'Add to favorites';
      button.classList.remove('favorited');
    } else {
      this.addFavorite(toolName);
      button.innerHTML = '♥';
      button.title = 'Remove from favorites';
      button.classList.add('favorited');
    }
    
    this.saveFavorites();
  }

  addFavorite(toolName) {
    if (!this.favorites.includes(toolName)) {
      this.favorites.push(toolName);
    }
  }

  removeFavorite(toolName) {
    this.favorites = this.favorites.filter(fav => fav !== toolName);
  }

  updateFavoriteStates() {
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
      const toolName = card.querySelector('h3').textContent;
      const favoriteBtn = card.querySelector('.favorite-btn');
      
      if (this.favorites.includes(toolName)) {
        favoriteBtn.innerHTML = '♥';
        favoriteBtn.title = 'Remove from favorites';
        favoriteBtn.classList.add('favorited');
      }
    });
  }

  saveFavorites() {
    localStorage.setItem('toolFavorites', JSON.stringify(this.favorites));
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    this.monitorPageLoad();
    this.monitorImageLoading();
  }

  monitorPageLoad() {
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`Page load time: ${loadTime}ms`);
      
      // Track page load performance
      if (typeof gtag !== 'undefined') {
        gtag('event', 'page_load_time', {
          value: loadTime,
          event_category: 'performance'
        });
      }
    });
  }

  monitorImageLoading() {
    const images = document.querySelectorAll('.tool-card-image');
    let loadedImages = 0;
    const totalImages = images.length;
    
    images.forEach(img => {
      img.addEventListener('load', () => {
        loadedImages++;
        if (loadedImages === totalImages) {
          console.log('All tool images loaded');
        }
      });
      
      img.addEventListener('error', () => {
        console.warn('Failed to load image:', img.src);
      });
    });
  }
}

// Back to Top Button
class BackToTop {
  constructor() {
    this.button = null;
    this.init();
  }

  init() {
    this.createButton();
    this.bindEvents();
  }

  createButton() {
    this.button = document.createElement('button');
    this.button.className = 'back-to-top';
    this.button.innerHTML = '↑';
    this.button.title = 'Back to top';
    document.body.appendChild(this.button);
  }

  bindEvents() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
    this.button.addEventListener('click', this.scrollToTop.bind(this));
  }

  handleScroll() {
    if (window.pageYOffset > 300) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// Initialize all enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all enhancement classes
  new ToolSearch();
  new ToolFilter();
  new ToolAnalytics();
  new ToolFavorites();
  new PerformanceMonitor();
  new BackToTop();
  
  // Add additional CSS for enhancements
  const additionalCSS = `
    .search-suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      box-shadow: var(--shadow);
      z-index: 1000;
      display: none;
      max-height: 200px;
      overflow-y: auto;
    }
    
    .suggestion-item {
      padding: 0.75rem 1rem;
      cursor: pointer;
      border-bottom: 1px solid var(--border-color);
      transition: background-color 0.3s ease;
    }
    
    .suggestion-item:hover {
      background: var(--bg-secondary);
    }
    
    .suggestion-item:last-child {
      border-bottom: none;
    }
    
    .favorite-btn {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: var(--text-secondary);
      transition: color 0.3s ease;
      padding: 0.25rem;
      border-radius: 4px;
      margin-left: auto;
    }
    
    .favorite-btn:hover {
      color: #ef4444;
    }
    
    .favorite-btn.favorited {
      color: #ef4444;
    }
    
    .results-count {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 1rem;
      text-align: center;
    }
    
    .back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease;
      font-size: 1.25rem;
      font-weight: bold;
    }
    
    .back-to-top.visible {
      transform: translateY(0);
      opacity: 1;
    }
    
    .back-to-top:hover {
      background: #5855eb;
      transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
      .back-to-top {
        bottom: 1rem;
        right: 1rem;
        width: 45px;
        height: 45px;
      }
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = additionalCSS;
  document.head.appendChild(style);
});

// Export for use in other scripts
window.ToolEnhancements = {
  ToolSearch,
  ToolFilter,
  ToolAnalytics,
  ToolFavorites,
  PerformanceMonitor,
  BackToTop
};
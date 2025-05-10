// Default settings
let settings = {
  percentageThreshold: 90,
  highestProteinColor: '#4CAF50', // Green
  thresholdProteinColor: '#2196F3' // Blue
};

// Load settings from storage
chrome.storage.sync.get(
  ['percentageThreshold', 'highestProteinColor', 'thresholdProteinColor'],
  (result) => {
    if (result.percentageThreshold !== undefined) settings.percentageThreshold = result.percentageThreshold;
    if (result.highestProteinColor) settings.highestProteinColor = result.highestProteinColor;
    if (result.thresholdProteinColor) settings.thresholdProteinColor = result.thresholdProteinColor;
  }
);

// Function to extract protein value from text
function extractProteinValue(text) {
  // Updated regex to match both "B. 42.6g" and "B: 50.2g" formats
  const match = text.match(/B[\.:]?\s*(\d+(?:\.\d+)?)g/i);
  return match ? parseFloat(match[1]) : 0;
}

// Main function to highlight meals
function highlightProteinMeals() {
  // Check if the drawer is open (fixed class name)
  const drawerIsOpen = document.querySelector('body.drawer-open') || document.querySelector('.drawer.is-open');
  if (!drawerIsOpen) return;

  // Find all meal elements
  const mealElements = document.querySelectorAll(
    '.single-meal.single-meal__active.single-meal__is-check, .single-meal.single-meal--change-meal'
  );

  // If no meals found, return
  if (mealElements.length === 0) return;

  // Find protein content for each meal
  const meals = [];
  let highestProtein = 0;

  mealElements.forEach((mealElement) => {
    const nutritionItems = mealElement.querySelectorAll('.nutrition-summary__item');
    let proteinValue = 0;

    nutritionItems.forEach((item) => {
      const text = item.textContent.trim();
      if (text.includes('B:') || text.includes('B.')) {
        proteinValue = extractProteinValue(text);
        if (proteinValue > highestProtein) {
          highestProtein = proteinValue;
        }
      }
    });

    meals.push({
      element: mealElement,
      protein: proteinValue
    });
  });

  // Calculate threshold value
  const thresholdValue = (highestProtein * settings.percentageThreshold) / 100;

  // Highlight meals
  meals.forEach((meal) => {
    // Reset previous highlights
    meal.element.style.border = '';
    meal.element.style.boxShadow = '';

    if (meal.protein === highestProtein && highestProtein > 0) {
      // Highlight highest protein meal
      meal.element.style.border = `2px solid ${settings.highestProteinColor}`;
      meal.element.style.boxShadow = `0 0 5px ${settings.highestProteinColor}`;
    } else if (meal.protein >= thresholdValue && meal.protein < highestProtein) {
      // Highlight meals above threshold
      meal.element.style.border = `2px solid ${settings.thresholdProteinColor}`;
      meal.element.style.boxShadow = `0 0 5px ${settings.thresholdProteinColor}`;
    }
  });
}

// Run on page load
highlightProteinMeals();

// Set up a MutationObserver to detect when meals are loaded
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList' || mutation.type === 'attributes') {
      highlightProteinMeals();
      break;
    }
  }
});

// Start observing changes in the document
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['class']
});

// Listen for messages from the options page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'settingsUpdated') {
    settings = { ...settings, ...request.settings };
    highlightProteinMeals();
  }
  sendResponse({ status: 'success' });
  return true;
}); 
// --- START OF FILE content.js ---

// Configuration object for DOM selectors
const SELECTORS = {
  drawerOpen: 'body.drawer-open, .drawer.is-open',
  mealElements: '.single-meal.single-meal__active.single-meal__is-check, .single-meal.single-meal--change-meal',
  nutritionItems: '.nutrition-summary__item'
};

// CSS classes and ID for our injected styles
const STYLE_ID = 'protein-highlighter-styles';
const HIGHEST_PROTEIN_CLASS = 'ppb-highest-protein';
const THRESHOLD_PROTEIN_CLASS = 'ppb-threshold-protein';

// Default settings
let settings = {
  percentageThreshold: 90,
  highestProteinColor: '#4CAF50', // Green
  thresholdProteinColor: '#2196F3' // Blue
};

/**
 * Injects or updates a <style> tag in the document's head with the current color settings.
 * @param {object} currentSettings - The settings object with color values.
 */
function injectStyles(currentSettings) {
  const existingStyleElement = document.getElementById(STYLE_ID);
  if (existingStyleElement) {
    existingStyleElement.remove();
  }

  const styleElement = document.createElement('style');
  styleElement.id = STYLE_ID;
  styleElement.textContent = `
    .${HIGHEST_PROTEIN_CLASS} {
      border: 2px solid ${currentSettings.highestProteinColor} !important;
      box-shadow: 0 0 5px ${currentSettings.highestProteinColor} !important;
    }
    .${THRESHOLD_PROTEIN_CLASS} {
      border: 2px solid ${currentSettings.thresholdProteinColor} !important;
      box-shadow: 0 0 5px ${currentSettings.thresholdProteinColor} !important;
    }
  `;
  document.head.appendChild(styleElement);
}

// Load settings from storage and inject initial styles
chrome.storage.sync.get(
  ['percentageThreshold', 'highestProteinColor', 'thresholdProteinColor'],
  (result) => {
    if (result.percentageThreshold !== undefined) settings.percentageThreshold = result.percentageThreshold;
    if (result.highestProteinColor) settings.highestProteinColor = result.highestProteinColor;
    if (result.thresholdProteinColor) settings.thresholdProteinColor = result.thresholdProteinColor;
    injectStyles(settings);
  }
);

// Function to extract protein value from text
function extractProteinValue(text) {
  const match = text.match(/B[\.:]?\s*(\d+(?:\.\d+)?)g/i);
  return match ? parseFloat(match[1]) : 0;
}

// Function to extract kcal value from text
function extractKcalValue(text) {
  const match = text.match(/(\d+(?:\.\d+)?)kcal/i);
  return match ? parseFloat(match[1]) : 0;
}

// Main function to highlight meals
function highlightProteinMeals() {
  // Disconnect the observer to prevent infinite loops while we modify the DOM.
  observer.disconnect();

  try {
    const drawerIsOpen = document.querySelector(SELECTORS.drawerOpen);
    if (!drawerIsOpen) return;

    const mealElements = document.querySelectorAll(SELECTORS.mealElements);
    if (mealElements.length === 0) return;

    const meals = [];
    let highestProtein = 0;

    mealElements.forEach((mealElement) => {
      const nutritionItems = mealElement.querySelectorAll(SELECTORS.nutritionItems);
      let proteinValue = 0;
      let kcalValue = 0;

      nutritionItems.forEach((item) => {
        const text = item.textContent.trim();
        if (text.startsWith('K/B:')) return;
        if (text.includes('B:') || text.includes('B.')) {
          proteinValue = extractProteinValue(text);
        }
        if (text.toLowerCase().includes('kcal')) {
          kcalValue = extractKcalValue(text);
        }
      });

      if (nutritionItems.length >= 4 && kcalValue > 0 && proteinValue > 0) {
        const hasKB = Array.from(nutritionItems).some(item => item.textContent.trim().startsWith('K/B:'));
        if (!hasKB) {
          const kbDiv = document.createElement('div');
          kbDiv.className = 'nutrition-summary__item';
          kbDiv.textContent = `K/B: ${(kcalValue / proteinValue).toFixed(1)}`;
          if (nutritionItems[3].nextSibling) {
            nutritionItems[3].parentNode.insertBefore(kbDiv, nutritionItems[3].nextSibling);
          } else {
            nutritionItems[3].parentNode.appendChild(kbDiv);
          }
        }
      }

      if (proteinValue > highestProtein) {
        highestProtein = proteinValue;
      }

      meals.push({
        element: mealElement,
        protein: proteinValue
      });
    });

    const thresholdValue = (highestProtein * settings.percentageThreshold) / 100;

    meals.forEach((meal) => {
      meal.element.classList.remove(HIGHEST_PROTEIN_CLASS, THRESHOLD_PROTEIN_CLASS);

      if (meal.protein === highestProtein && highestProtein > 0) {
        meal.element.classList.add(HIGHEST_PROTEIN_CLASS);
      } else if (meal.protein >= thresholdValue && meal.protein < highestProtein) {
        meal.element.classList.add(THRESHOLD_PROTEIN_CLASS);
      }
    });
  } catch (error) {
    console.error('Protein Highlighter Error:', error);
  } finally {
    // Reconnect the observer to watch for future changes.
    // This runs even if an error occurs in the try block.
    observer.observe(document.body, observerOptions);
  }
}

// Define observer options and the observer itself
const observerOptions = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['class']
};

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList' || (mutation.type === 'attributes' && mutation.attributeName === 'class')) {
      highlightProteinMeals();
      break;
    }
  }
});

// Initial run and start observing
highlightProteinMeals();
observer.observe(document.body, observerOptions);

// Listen for messages from the options page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'settingsUpdated') {
    settings = { ...settings, ...request.settings };
    injectStyles(settings);
    highlightProteinMeals();
  }
  sendResponse({ status: 'success' });
  return true;
});
// --- END OF FILE content.js ---
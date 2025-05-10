// When the options page loads
document.addEventListener('DOMContentLoaded', () => {
  // Pobierz referencje do elementów DOM
  const percentageInput = document.getElementById('percentageThreshold');
  const highestProteinColorInput = document.getElementById('highestProteinColor');
  const thresholdProteinColorInput = document.getElementById('thresholdProteinColor');
  const saveButton = document.getElementById('save');
  const resetColorsButton = document.getElementById('resetColors');
  const percentageError = document.getElementById('percentageError');
  const statusElement = document.getElementById('status');

  // Domyślne kolory
  const DEFAULT_HIGHEST_COLOR = '#4CAF50'; // Zielony
  const DEFAULT_THRESHOLD_COLOR = '#2196F3'; // Niebieski

  // Sprawdź czy wszystkie wymagane elementy zostały znalezione
  if (!percentageInput || !highestProteinColorInput || !thresholdProteinColorInput || 
      !saveButton || !percentageError || !statusElement || !resetColorsButton) {
    console.error('Nie udało się znaleźć wszystkich wymaganych elementów DOM');
    return; // Przerwij wykonanie skryptu jeśli brakuje elementów
  }

  // Load saved settings
  chrome.storage.sync.get(
    {
      percentageThreshold: 90,
      highestProteinColor: DEFAULT_HIGHEST_COLOR,
      thresholdProteinColor: DEFAULT_THRESHOLD_COLOR
    },
    (items) => {
      // Populate form fields with saved settings
      percentageInput.value = items.percentageThreshold;
      highestProteinColorInput.value = items.highestProteinColor;
      thresholdProteinColorInput.value = items.thresholdProteinColor;
    }
  );

  // Przywracanie domyślnych kolorów
  resetColorsButton.addEventListener('click', () => {
    highestProteinColorInput.value = DEFAULT_HIGHEST_COLOR;
    thresholdProteinColorInput.value = DEFAULT_THRESHOLD_COLOR;
    
    // Pokaż komunikat o przywróceniu domyślnych kolorów
    showStatus('Przywrócono domyślne kolory');
  });

  // Validate percentage input
  function validatePercentage() {
    const value = percentageInput.value.trim();
    
    // Check if empty
    if (!value) {
      showError(true, 'Pole nie może być puste');
      return false;
    }
    
    // Check if it's a number
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) {
      showError(true, 'Wartość musi być liczbą');
      return false;
    }
    
    // Check if in range 0-100
    if (numberValue < 0 || numberValue > 100) {
      showError(true, 'Wartość musi być liczbą od 0 do 100');
      return false;
    }
    
    // Valid
    showError(false);
    return true;
  }
  
  function showError(show, message = '') {
    if (show) {
      percentageError.textContent = message;
      percentageError.style.display = 'block';
      saveButton.disabled = true;
    } else {
      percentageError.style.display = 'none';
      saveButton.disabled = false;
    }
  }
  
  // Add validation on input
  percentageInput.addEventListener('input', validatePercentage);
  percentageInput.addEventListener('blur', validatePercentage);

  // Show status message
  function showStatus(message, isSuccess = true) {
    statusElement.textContent = message;
    statusElement.className = isSuccess ? 'status success visible' : 'status error visible';
    
    setTimeout(() => {
      statusElement.className = isSuccess ? 'status success' : 'status error';
    }, 3000);
  }

  // Save settings
  saveButton.addEventListener('click', () => {
    // Validate before saving
    if (!validatePercentage()) {
      return;
    }
    
    const settings = {
      percentageThreshold: parseFloat(percentageInput.value),
      highestProteinColor: highestProteinColorInput.value,
      thresholdProteinColor: thresholdProteinColorInput.value
    };

    // Save to Chrome storage
    chrome.storage.sync.set(settings, () => {
      // Show success message
      showStatus('Ustawienia zostały zapisane!');

      // Send message to content script
      chrome.tabs.query({ url: '*://panel.kuchniavikinga.pl/*' }, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, { 
            type: 'settingsUpdated', 
            settings: settings 
          });
        });
      });
    });
  });
  
  // Initial validation
  validatePercentage();
});
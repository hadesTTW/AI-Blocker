const RULES_URL = 'https://exordium.breadcraft.me/resources/ai%20blocker/filters.txt';

async function fetchAndCacheRules() {
  try {
    const response = await fetch(`${RULES_URL}?t=${Date.now()}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const textRules = await response.text();
    const rules = textRules.split('\n').map(rule => rule.trim()).filter(rule => rule);
    await chrome.storage.local.set({ rules, updatedAt: Date.now() });
  } catch (error) {
    console.error('Failed fetching rules:', error);
  }
}

// Fetch immediately upon extension startup
fetchAndCacheRules();

// Update rules every 15 minutes
setInterval(fetchAndCacheRules, 15 * 60 * 1000);

// Initialize extension enabled state to true on first install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
});

// Toggle extension state when toolbar icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  const { enabled } = await chrome.storage.local.get('enabled');
  const newState = !enabled;

  await chrome.storage.local.set({ enabled: newState });

  // Set the appropriate icon
  chrome.action.setIcon({
    path: newState ? "icons/icon.png" : "icons/icon-off.png"
  });

  console.log('Extension enabled:', newState);

  chrome.tabs.reload(tab.id);
});

// Set icon correctly on extension startup
async function setInitialIcon() {
  const { enabled } = await chrome.storage.local.get('enabled');
  chrome.action.setIcon({
    path: enabled !== false ? "icons/icon.png" : "icons/icon-off.png"
  });
}

// Run on extension startup
chrome.runtime.onInstalled.addListener(setInitialIcon);
chrome.runtime.onStartup.addListener(setInitialIcon);

// Listen for content script requests for rules
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_RULES') {
    chrome.storage.local.get(['rules'], ({ rules }) => {
      sendResponse(rules || {});
    });
    return true;
  }
});

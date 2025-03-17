const RULES_URL = 'https://exordium.breadcraft.me/resources/ai%20blocker/rules.json';

async function fetchAndCacheRules() {
  try {
    const response = await fetch(`${RULES_URL}?t=${Date.now()}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const rules = await response.json();
    await chrome.storage.local.set({ rules, updatedAt: Date.now() });
  } catch (error) {
    console.error('Failed fetching rules:', error);
  }
}

// Fetch immediately upon extension startup
fetchAndCacheRules();

// Update rules every 15 minutes (optional, but recommended)
setInterval(fetchAndCacheRules, 15 * 60 * 1000);

// Listen for content script requests for rules
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_RULES') {
    chrome.storage.local.get(['rules'], ({ rules }) => {
      sendResponse(rules || {});
    });
    // Necessary to use sendResponse asynchronously
    return true;
  }
});

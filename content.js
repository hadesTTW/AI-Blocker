// Request rules from the background script
function getRulesFromBackground() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'GET_RULES' }, (response) => {
      resolve(response || {});
    });
  });
}

// Apply rules to the current page
function applyRules(rules) {
  const currentHostname = window.location.hostname;

  Object.keys(rules).forEach(site => {
    if (currentHostname.includes(site)) {
      rules[site].forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          if (el.style.display !== 'none') {
            el.style.setProperty('display', 'none', 'important');
          }
        });
      });
    }
  });
}

// Observe dynamic DOM changes
async function observeAndApplyRules() {
  const rules = await getRulesFromBackground();

  // Initial blocking
  applyRules(rules);

  // Set up MutationObserver
  const observer = new MutationObserver(() => applyRules(rules));

  observer.observe(document.body, {
    childList: true,         // Observe direct children added/removed
    subtree: true,           // Observe entire DOM subtree
    attributes: true,        // Observe attribute changes
    attributeFilter: ['class', 'style'] // Observe only relevant attributes
  });
}

// Run the observer
observeAndApplyRules();
console.log('AI Blocker is running on', window.location.hostname);

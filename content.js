// Request rules from the background script
function getRulesFromBackground() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'GET_RULES' }, (response) => {
      resolve(response || {});
    });
  });
}

// Check if the extension is enabled
async function isExtensionEnabled() {
  const { enabled } = await chrome.storage.local.get('enabled');
  return enabled !== false; // Default to true if unset
}

// Apply rules to the current page
function applyRules(rules) {
  const currentHostname = window.location.hostname;

  rules.forEach(rule => {
    const [site, selector] = rule.split('##');
    if (currentHostname.includes(site) && selector) {
      document.querySelectorAll(selector).forEach(el => {
        if (el.style.display !== 'none') {
          el.style.setProperty('display', 'none', 'important');
        }
      });
    }
  });
}


// Observe dynamic DOM changes
async function observeAndApplyRules() {
  if (!await isExtensionEnabled()) {
    console.log('AI Blocker is currently disabled');
    return;
  }

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

  console.log('AI Blocker is running on', window.location.hostname);
}

// Run the observer
observeAndApplyRules();

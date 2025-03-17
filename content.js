// Request rules from the background script
function getRulesFromBackground() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'GET_RULES' }, (response) => {
      resolve(response || {});
    });
  });
}

// Apply rules
async function applyRules() {
  const rules = await getRulesFromBackground();
  const currentHostname = window.location.hostname;

  Object.keys(rules).forEach(site => {
    if (currentHostname.includes(site)) {
      rules[site].forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          el.style.setProperty('display', 'none', 'important');
        });
      });
    }
  });
}

applyRules();
console.log('AI Blocker is running on', window.location.hostname);

// URL to your remotely-hosted rules
const RULES_URL = 'https://exordium.breadcraft.me/resources/ai%20blocker/rules.json';

// Fetch the rules from remote JSON file
async function fetchRules() {
  try {
    const response = await fetch(RULES_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch rules:', error);
    return {};
  }
}

// Apply CSS rules to current page
function applyRules(rules) {
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

// Run it all together
(async () => {
  const rules = await fetchRules();
  applyRules(rules);
})();

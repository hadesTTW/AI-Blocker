// initialize checkbox based on stored setting
document.addEventListener('DOMContentLoaded', async () => {
    const checkbox = document.getElementById('toggleExtension');
    const { enabled } = await chrome.storage.local.get('enabled');
    
    checkbox.checked = enabled !== false; // default to true
    
    checkbox.addEventListener('change', async () => {
      await chrome.storage.local.set({ enabled: checkbox.checked });
  
      // Update toolbar icon immediately
      chrome.action.setIcon({
        path: checkbox.checked ? "icons/icon-on.png" : "icons/icon-off.png"
      });
    });
  });
  
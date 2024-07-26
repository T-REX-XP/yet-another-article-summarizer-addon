chrome.runtime.onInstalled.addListener(({ reason }) => {
  //Onboarding
  if (reason === 'install') {
    chrome.tabs.create({
      url: "src/newtab/index.html"
    });
  }
  //Register menu item handlers
  chrome.contextMenus.create({
    id: "summarizeSelectedText",
    title: "Summarize selected text",
    contexts: ["selection"]
  });
});

chrome.windows.onRemoved.addListener((windowId) => {
  chrome.storage.local.remove(['selectedText'], () => {
    console.log('Selected text cleared from storage.');
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "summarizeSelectedText":
      if (info.selectionText) {
        // Store the selected text
        chrome.storage.local.set({ selectedText: info.selectionText }, () => {
          chrome.sidePanel.open({ windowId: tab.windowId });
        });
      } else
        alert('No text selected. Nothing to summarize.');
      break;
    case "summarizePage":
      break;
  }
});
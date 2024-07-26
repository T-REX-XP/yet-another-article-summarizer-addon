export class TabsHelper {
    async getCurrentTab(): Promise<any> {
        let queryOptions = { active: true, lastFocusedWindow: true };
        // `tab` will either be a `tabs.Tab` instance or `undefined`.
        let [tab] = await chrome.tabs.query(queryOptions);
        return tab;
    }
    
    async getActiveTabContent(): Promise<string> {
        const tab = await this.getCurrentTab();
        if (!tab || !tab.id) {
            throw new Error('No active tab found');
        }

        return new Promise((resolve, reject) => {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tab.id },
                    func: () => {
                        // Extract all visible text content from the body of the document
                        const bodyText = document.body.innerText;
                        return bodyText;
                    },
                },
                (results) => {
                    if (chrome.runtime.lastError) {
                        return reject(chrome.runtime.lastError);
                    }
                    if (results && results[0] && results[0].result) {
                        resolve(results[0].result);
                    } else {
                        reject(new Error('Failed to retrieve tab content'));
                    }
                }
            );
        });
    }
}
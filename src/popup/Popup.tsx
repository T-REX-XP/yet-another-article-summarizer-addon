import { useEffect, useState } from 'react';
import { FluentProvider, teamsLightTheme, teamsDarkTheme, Tab, TabList, Button, Spinner, Textarea, Tag } from '@fluentui/react-components';
import ISummaryProvider from '../interfaces/ISummaryProvider';
import OpenAISummaryProvider from '../providers/OpenAISummaryProvider';

import { makeStyles, typographyStyles } from '@fluentui/react-components';
import { TabsHelper } from '@src/helpers/tabsHelper';
import { ISummaryResponse } from '@src/interfaces/ISummaryResponse';
const useStyles = makeStyles({
  text: typographyStyles.body1Strong,
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',

  },
  dialogBody: {
    padding: '5px',
    minWidth: '500px',
    minHeight: '600px',
    backgroundColor: teamsLightTheme.colorBrandBackground2
  },
  innerWrapper: {
    alignItems: "start",
    columnGap: "10px",
    display: "flex",
  },
  outerWrapper: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
});

const Popup = () => {
  const [articleText, setArticleText] = useState('');
  const [summary, setSummary] = useState<ISummaryResponse>();
  const [apiKey, setApiKey] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('input');
  const [provider, setProvider] = useState<ISummaryProvider | null>(null);

  const styles = useStyles();
  const tabsHelper = new TabsHelper();

  useEffect(() => {
    chrome.storage.sync.get(['apiKey', 'model'], (result) => {
      const apiKey = result.apiKey;
      const model = result.model;

      setApiKey(apiKey);
      if (apiKey) {
        const initializedProvider = new OpenAISummaryProvider({ apiKey, model });
        setProvider(initializedProvider);
      }
    });
  }, []);

  // Handle changing selected text when panel is already opened
  useEffect(() => {
    const handleStorageChange = (changes: any, namespace: string) => {
      for (const key in changes) {
        const storageChange = changes[key];
        if (key === "selectedText") {
          if (storageChange?.newValue) {
            setArticleText(storageChange?.newValue);
            setSelectedTab('input');
            handleSummarize();
          }
          chrome.storage.local.remove(['selectedText'], () => {
            console.log('Selected text cleared from storage.');
          });
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  // Get context on page load
  useEffect(() => {
    (async () => {
      chrome.storage.local.get(['selectedText'], (result) => {
        if (result.selectedText) {
          setArticleText(result.selectedText);
        }
        else {
          tabsHelper.getActiveTabContent().then(text => setArticleText(text));
        }
      });
    })();
  }, []);

  const handleSummarize = async () => {
    if (!provider) {
      alert("API provider didn't initialize. Please populate the API key and try again.");
      return;
    }

    setLoading(true);
    await provider.summarizeArticle(articleText)
      .then(summary => {
        setSummary(summary);
        setLoading(false);
        setSelectedTab('summary');
      })
      .catch(error => {
        setLoading(false);
        alert(error);
      });
  };

  return (
    <FluentProvider theme={teamsLightTheme}>
      <div className={styles.dialogBody}>
        <TabList selectedValue={selectedTab} onTabSelect={(event: any, data: any) => setSelectedTab(data.value)}>
          <Tab value="input">Content</Tab>
          <Tab value="summary">Summary</Tab>
          {/* <Tab value="settings">⚙️</Tab> */}
        </TabList>
        {selectedTab === 'input' && (
          <div style={{ marginTop: '20px' }}>
            <Textarea
              placeholder="Paste your article here..."
              value={articleText}
              // onChange={(e: any, data: any) => setArticleText(data.value)}
              style={{ width: '100%', marginBottom: '10px' }}
              rows={15}
            />
            <Button onClick={handleSummarize} appearance="primary" disabled={loading}>
              {loading ? <Spinner label="Summarizing..." /> : 'Summarize Article'}
            </Button>
          </div>
        )}
        {selectedTab === 'summary' && (
          <div>
            <div style={{ border: '1px solid #ccc', padding: '10px' }}>{loading ? 'Loading...' : summary?.summary}</div>
            <h2 style={{ marginTop: '20px' }}>Sentiment: {summary?.sentiment}</h2>
            <h2 style={{ marginTop: '20px' }}>Topics:</h2>
            {/* extra-small */}
            <div className={styles.innerWrapper}>
              {summary?.topics.split(',').map((topic) => (
                <Tag size="extra-small" shape="circular">{topic}</Tag>
              ))}
            </div>
          </div>
        )}
      </div>
    </FluentProvider>
  );
};

export default Popup;

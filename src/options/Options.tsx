import React, { useState, useEffect, useId } from 'react';
import { FluentProvider, teamsLightTheme, Input, Button, Dropdown, Option, Label } from '@fluentui/react-components';

import { makeStyles, typographyStyles } from '@fluentui/react-components';
const useStyles = makeStyles({
  text: typographyStyles.body1Strong,
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: teamsLightTheme.colorBrandBackground2
  },
  form: {
    padding: '20px',
    maxWidth: '600px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const Options = () => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState<string[] | undefined>();
  const styles = useStyles();

  useEffect(() => {
    chrome.storage.sync.get(['apiKey', 'model'], (result) => {
      setApiKey(result.apiKey || '');
      setModel([result.model] || []);
    });
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set({ apiKey, model: model ? model[0] : "" }, () => {
      alert('Options has been saved!');
    });
  };
  const dropdownId = useId("dropdown-default");
  const options = [
    "gpt-3.5-turbo",
    "gpt-4o-mini",
  ];
  return (
    <FluentProvider theme={teamsLightTheme}>
      <div className={styles.container}>
        <div className={styles.form}>
          <span className={styles.text}>Options</span>
          <div style={{ width: '100%', marginBottom: '10px' }}>
            <Label required id={dropdownId}>OpenAI API key</Label>
            <Input
              placeholder="Enter your OpenAI API Key"
              value={apiKey}
              onChange={(e, data) => setApiKey(data.value)}
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </div>
          <div style={{ width: '100%', marginBottom: '10px' }}>
            <Label required id={dropdownId}>Select Model</Label>
            <Dropdown
              aria-labelledby={dropdownId}
              placeholder="Select model"
              style={{ width: '100%' }}
              // selectedOptions={model}
              defaultSelectedOptions={model}
              onOptionSelect={(event: any, data: any) => setModel([data?.optionText])}
            >
              {options.map((option) => (
                <Option key={option}>
                  {option}
                </Option>
              ))}
            </Dropdown>
          </div>
          <Button onClick={handleSave} appearance="primary">Save</Button>
        </div>
      </div>
    </FluentProvider>
  );
};

export default Options;

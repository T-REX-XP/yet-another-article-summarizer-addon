import packageJson from '../package.json';
import { ManifestType } from '@src/types/manifest-type';

const manifest: ManifestType = {
  manifest_version: 3,
  name: "Yet another article summarization",//packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  options_page: 'src/options/index.html',
  background: { service_worker: 'src/background/index.js' },
  permissions: ["storage", "contextMenus", "scripting", "activeTab", "tabs", "sidePanel"],
  host_permissions: [
    "https://api.openai.com/v1/chat/completions"
  ],
  action: {
    default_popup: 'src/popup/index.html',
    default_icon: 'icon-34.png',
    default_title: "YAML"
  },
  side_panel: {
    "default_path": "src/popup/index.html"
  },
  chrome_url_overrides: {
    newtab: 'src/newtab/index.html',
  },
  icons: {
    '128': 'icon-128.png',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: ['src/content/index.js'],
      run_at: "document_end"
    },
  ],
  devtools_page: 'src/devtools/index.html',
  web_accessible_resources: [
    {
      resources: ['icon-128.png', 'icon-34.png'],
      matches: [],
    },
  ],
};

export default manifest;

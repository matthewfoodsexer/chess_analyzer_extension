import { ManifestV3Export } from '@crxjs/vite-plugin'

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'Chess Analyzer',
  version: '1.0.0',
  description: 'Analyze your chess.com games on Lichess',
  permissions: ['storage', 'activeTab', 'tabs'],
  host_permissions: ['https://www.chess.com/*', 'https://lichess.org/*'],
  background: {
    service_worker: 'src/background/service-worker.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://lichess.org/paste*'],
      js: ['src/content/lichess-paste.ts'],
      run_at: 'document_idle',
    },
    {
      matches: ['https://lichess.org/*'],
      js: ['src/content/lichess-analysis.ts'],
      run_at: 'document_idle',
    },
  ],
  action: {
    default_icon: {
      '16': 'icons/icon-16.png',
      '48': 'icons/icon-48.png',
      '128': 'icons/icon-128.png',
    },
  },
  icons: {
    '16': 'icons/icon-16.png',
    '48': 'icons/icon-48.png',
    '128': 'icons/icon-128.png',
  },
}

export default manifest

import * as React from 'react';
import MarkdownDocs from '@mui/monorepo/docs/src/modules/components/MarkdownDocs';
import * as pageProps from './grid-row-spacing-params.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}

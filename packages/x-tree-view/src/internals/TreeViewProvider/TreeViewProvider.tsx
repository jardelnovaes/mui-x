import * as React from 'react';
import { TreeViewProviderProps } from './TreeViewProvider.types';
import { TreeViewContext } from './TreeViewContext';
import { DescendantProvider } from './DescendantProvider';
import { TreeViewAnyPluginSignature } from '../models';

/**
 * Sets up the contexts for the underlying TreeItem components.
 *
 * @ignore - do not document.
 */
export function TreeViewProvider<TPlugins extends readonly TreeViewAnyPluginSignature[]>(
  props: TreeViewProviderProps<TPlugins>,
) {
  const { value, children } = props;

  return (
    <TreeViewContext.Provider value={value}>
      <DescendantProvider>{children}</DescendantProvider>
    </TreeViewContext.Provider>
  );
}

'use client';

import { useEffect } from 'react';
import { isPreviewMessage, type PreviewMessage } from '@/lib/preview-messages';

/**
 * PreviewListener - Client component that listens for CMS preview messages.
 *
 * When embedded in an iframe by the CMS admin, this component receives
 * postMessage events and triggers page reloads on REFRESH signals.
 *
 * For BLOCKS_UPDATE messages, consumers can provide an onBlocksUpdate callback
 * to handle real-time content updates without a full reload.
 *
 * This component renders nothing and has zero impact on normal page loads
 * (it only activates when inside an iframe).
 */
interface PreviewListenerProps {
  /** Called when blocks are updated via postMessage */
  onBlocksUpdate?: (blocks: unknown[], version?: string) => void;
  /** Called when metadata is updated via postMessage */
  onMetadataUpdate?: (metadata: Record<string, unknown>) => void;
}

export default function PreviewListener({
  onBlocksUpdate,
  onMetadataUpdate,
}: PreviewListenerProps) {
  useEffect(() => {
    // Only activate when inside an iframe
    if (typeof window === 'undefined' || window.parent === window) return;

    function handleMessage(event: MessageEvent) {
      // Security: only accept messages from same origin
      if (event.origin !== window.location.origin) return;
      if (!isPreviewMessage(event)) return;

      const message: PreviewMessage = event.data;

      switch (message.action) {
        case 'REFRESH':
          // Full page reload requested by CMS
          window.location.reload();
          break;

        case 'BLOCKS_UPDATE':
          if (onBlocksUpdate) {
            onBlocksUpdate(
              message.payload.blocks,
              message.payload.version as string | undefined
            );
          }
          break;

        case 'METADATA_UPDATE':
          if (onMetadataUpdate) {
            onMetadataUpdate(message.payload);
          }
          break;
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onBlocksUpdate, onMetadataUpdate]);

  // Render nothing - this is a side-effect-only component
  return null;
}

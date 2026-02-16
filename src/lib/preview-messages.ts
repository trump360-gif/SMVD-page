/**
 * Preview Message Protocol
 *
 * Defines the message types exchanged between the CMS editor (parent)
 * and the public page preview (iframe child) via window.postMessage.
 *
 * This enables instant preview updates without full page reloads.
 */

// ---------------------------------------------------------------------------
// Message types
// ---------------------------------------------------------------------------

export const PREVIEW_MESSAGE_TYPE = 'SMVD_CMS_PREVIEW' as const;

export interface PreviewBlocksUpdateMessage {
  type: typeof PREVIEW_MESSAGE_TYPE;
  action: 'BLOCKS_UPDATE';
  payload: {
    blocks: unknown[];
    version?: string;
    rowConfig?: unknown[];
  };
}

export interface PreviewRefreshMessage {
  type: typeof PREVIEW_MESSAGE_TYPE;
  action: 'REFRESH';
}

export interface PreviewMetadataUpdateMessage {
  type: typeof PREVIEW_MESSAGE_TYPE;
  action: 'METADATA_UPDATE';
  payload: Record<string, unknown>;
}

export type PreviewMessage =
  | PreviewBlocksUpdateMessage
  | PreviewRefreshMessage
  | PreviewMetadataUpdateMessage;

// ---------------------------------------------------------------------------
// Sender helpers (used in admin CMS editors)
// ---------------------------------------------------------------------------

/**
 * Send a blocks update to the preview iframe.
 *
 * @param iframeRef - React ref to the preview iframe element
 * @param blocks - Updated blocks array
 * @param version - Content version string
 * @param rowConfig - Optional row configuration
 */
export function sendBlocksUpdate(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  blocks: unknown[],
  version?: string,
  rowConfig?: unknown[]
): void {
  if (!iframeRef.current?.contentWindow) return;

  const message: PreviewBlocksUpdateMessage = {
    type: PREVIEW_MESSAGE_TYPE,
    action: 'BLOCKS_UPDATE',
    payload: { blocks, version, rowConfig },
  };

  try {
    iframeRef.current.contentWindow.postMessage(message, window.location.origin);
  } catch {
    // Cross-origin or iframe not ready - silently ignore
  }
}

/**
 * Send a refresh signal to the preview iframe.
 * Falls back to src reload if postMessage fails.
 *
 * @param iframeRef - React ref to the preview iframe element
 */
export function sendRefresh(
  iframeRef: React.RefObject<HTMLIFrameElement | null>
): void {
  if (!iframeRef.current) return;

  const message: PreviewRefreshMessage = {
    type: PREVIEW_MESSAGE_TYPE,
    action: 'REFRESH',
  };

  try {
    iframeRef.current.contentWindow?.postMessage(message, window.location.origin);
  } catch {
    // Fallback: reload via src
    const url = iframeRef.current.src;
    if (url) {
      const baseUrl = url.split('?')[0];
      iframeRef.current.src = `${baseUrl}?refresh=${Date.now()}`;
    }
  }
}

/**
 * Send metadata update to the preview iframe.
 *
 * @param iframeRef - React ref to the preview iframe element
 * @param metadata - Key-value pairs to update
 */
export function sendMetadataUpdate(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  metadata: Record<string, unknown>
): void {
  if (!iframeRef.current?.contentWindow) return;

  const message: PreviewMetadataUpdateMessage = {
    type: PREVIEW_MESSAGE_TYPE,
    action: 'METADATA_UPDATE',
    payload: metadata,
  };

  try {
    iframeRef.current.contentWindow.postMessage(message, window.location.origin);
  } catch {
    // Silently ignore
  }
}

// ---------------------------------------------------------------------------
// Receiver helpers (used in public pages when rendered inside iframe)
// ---------------------------------------------------------------------------

/**
 * Check if a MessageEvent is a valid SMVD CMS preview message.
 */
export function isPreviewMessage(event: MessageEvent): event is MessageEvent<PreviewMessage> {
  return (
    event.data &&
    typeof event.data === 'object' &&
    event.data.type === PREVIEW_MESSAGE_TYPE
  );
}

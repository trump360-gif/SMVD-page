'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { deepEqual, deepClone } from '@/lib/diffUtils';

/**
 * Hook for managing dirty state inside modals.
 * Automatically captures a snapshot when the modal opens.
 *
 * Usage:
 *   const { isDirty, revert, showCloseConfirm, setShowCloseConfirm, handleClose } = useModalDirtyState(formState, isOpen);
 */
export function useModalDirtyState<T>(currentState: T, isOpen: boolean) {
  const snapshotRef = useRef<T>(deepClone(currentState));
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Capture snapshot when modal opens
  useEffect(() => {
    if (isOpen) {
      snapshotRef.current = deepClone(currentState);
    }
    // Only capture on open, not on every state change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const isDirty = useMemo(() => {
    if (!isOpen) return false;
    return !deepEqual(snapshotRef.current, currentState);
  }, [currentState, isOpen]);

  const revert = useCallback((): T => {
    return deepClone(snapshotRef.current);
  }, []);

  /**
   * Call this instead of onClose directly.
   * If dirty, shows confirmation dialog. If clean, calls onClose immediately.
   */
  const handleClose = useCallback(
    (onClose: () => void) => {
      if (isDirty) {
        setShowCloseConfirm(true);
      } else {
        onClose();
      }
    },
    [isDirty]
  );

  return {
    isDirty,
    revert,
    showCloseConfirm,
    setShowCloseConfirm,
    handleClose,
  };
}

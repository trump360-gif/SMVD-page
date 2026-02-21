'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { deepEqual, deepClone, countChanges } from '@/lib/diffUtils';

/**
 * Generic hook for managing dirty state with snapshot comparison.
 *
 * Usage:
 *   const { localState, setLocalState, isDirty, changeCount, resetSnapshot, revert } = useDirtyState(initialData);
 *
 * - resetSnapshot(data): Call after fetch or save success to set new baseline.
 * - revert(): Reset localState to the snapshot (discard all local changes).
 * - isDirty: true when localState differs from snapshot.
 * - changeCount: number of top-level differences.
 */
export function useDirtyState<T>(initialData: T) {
  const snapshotRef = useRef<T>(deepClone(initialData));
  const [localState, setLocalState] = useState<T>(deepClone(initialData));
  // Bump version to force isDirty/changeCount recalc after resetSnapshot
  const [version, setVersion] = useState(0);

  const resetSnapshot = useCallback((data: T) => {
    snapshotRef.current = deepClone(data);
    setLocalState(deepClone(data));
    setVersion((v) => v + 1);
  }, []);

  const revert = useCallback(() => {
    setLocalState(deepClone(snapshotRef.current));
  }, []);

  const isDirty = useMemo(() => {
    void version; // dependency trigger
    return !deepEqual(snapshotRef.current, localState);
  }, [localState, version]);

  const changeCount = useMemo(() => {
    void version;
    return countChanges(snapshotRef.current, localState);
  }, [localState, version]);

  return {
    localState,
    setLocalState,
    snapshot: snapshotRef.current,
    isDirty,
    changeCount,
    resetSnapshot,
    revert,
  };
}

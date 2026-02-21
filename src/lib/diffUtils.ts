/**
 * Deep comparison and cloning utilities for dirty state management.
 */

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a === undefined || b === undefined) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object') {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (!Object.prototype.hasOwnProperty.call(bObj, key)) return false;
      if (!deepEqual(aObj[key], bObj[key])) return false;
    }
    return true;
  }

  return false;
}

export function deepClone<T>(obj: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Count top-level changes between two values.
 * For arrays: counts items that differ by index + length difference.
 * For objects: counts keys with different values.
 * For primitives: returns 1 if different, 0 if same.
 */
export function countChanges(snapshot: unknown, current: unknown): number {
  if (deepEqual(snapshot, current)) return 0;

  if (Array.isArray(snapshot) && Array.isArray(current)) {
    let count = 0;
    const maxLen = Math.max(snapshot.length, current.length);
    for (let i = 0; i < maxLen; i++) {
      if (i >= snapshot.length || i >= current.length) {
        count++;
      } else if (!deepEqual(snapshot[i], current[i])) {
        count++;
      }
    }
    return count;
  }

  if (
    typeof snapshot === 'object' && snapshot !== null &&
    typeof current === 'object' && current !== null &&
    !Array.isArray(snapshot) && !Array.isArray(current)
  ) {
    const sObj = snapshot as Record<string, unknown>;
    const cObj = current as Record<string, unknown>;
    const allKeys = new Set([...Object.keys(sObj), ...Object.keys(cObj)]);
    let count = 0;
    for (const key of allKeys) {
      if (!deepEqual(sObj[key], cObj[key])) {
        count++;
      }
    }
    return count;
  }

  return 1;
}

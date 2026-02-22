/**
 * Result type for DAL: success carries data, failure carries error message.
 */

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function err(message: string): Result<never> {
  return { ok: false, error: message };
}

export function isOk<T>(r: Result<T>): r is { ok: true; data: T } {
  return r.ok === true;
}

export function isErr<T>(r: Result<T>): r is { ok: false; error: string } {
  return r.ok === false;
}

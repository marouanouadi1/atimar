/**
 * Mock auth validation (local only — no Supabase).
 * Kept intentionally simple per the brief; the Supabase files under
 * components/Auth.tsx + utils/supabase.ts are left in place for a future swap.
 */

import type { User } from '@atimar/types';

export type AuthField = 'name' | 'email' | 'password';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  ok: boolean;
  errors: Partial<Record<AuthField, string>>;
  user?: User;
}

function isEmail(value: string): boolean {
  const v = value.trim();
  return v.includes('@') && v.indexOf('@') > 0 && v.indexOf('@') < v.length - 1;
}

/** Derive a display name from an email local-part, e.g. "giulia.rossi" → "Giulia". */
function nameFromEmail(email: string): string {
  const local = email.split('@')[0]?.split(/[.\-_]/)[0] ?? 'Atleta';
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export function validateRegister(input: RegisterInput): AuthResult {
  const errors: AuthResult['errors'] = {};
  if (!input.name.trim()) errors.name = 'Inserisci il tuo nome';
  if (!isEmail(input.email)) errors.email = 'Email non valida';
  if (input.password.length < 6) errors.password = 'Minimo 6 caratteri';

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, errors: {}, user: { name: input.name.trim(), email: input.email.trim() } };
}

export function validateLogin(input: LoginInput): AuthResult {
  const errors: AuthResult['errors'] = {};
  if (!isEmail(input.email)) errors.email = 'Email non valida';
  if (input.password.length < 4) errors.password = 'Minimo 4 caratteri';

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, errors: {}, user: { name: nameFromEmail(input.email.trim()), email: input.email.trim() } };
}

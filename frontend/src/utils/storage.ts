import type { AuthTokens, User } from '@/types/auth.types';

const TOKENS_KEY = 'forkup_tokens';
const USER_KEY = 'forkup_user';

export const storage = {
  getTokens(): AuthTokens | null {
    const raw = localStorage.getItem(TOKENS_KEY);
    return raw ? (JSON.parse(raw) as AuthTokens) : null;
  },

  setTokens(tokens: AuthTokens): void {
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
  },

  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  },

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear(): void {
    localStorage.removeItem(TOKENS_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

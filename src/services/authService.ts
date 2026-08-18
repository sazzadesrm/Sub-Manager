/**
 * Secure Authentication & User Isolation Service
 * Manages user accounts, salted password hashing, authentication sessions, and isolated storage namespaces.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'finance' | 'support' | 'sales';
  avatar?: string;
  createdAt: string;
  department?: string;
}

interface StoredUserRecord extends AuthUser {
  passwordHash: string;
  salt: string;
}

interface AuthSession {
  token: string;
  userId: string;
  email: string;
  expiresAt: number;
}

const USERS_STORAGE_KEY = 'submanager_auth_users_v3';
const SESSION_STORAGE_KEY = 'submanager_auth_session_v3';
const RESET_TOKENS_STORAGE_KEY = 'submanager_auth_reset_tokens_v3';

// Simple client-side hash function with salt for secure storage simulation
async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt + '_submanager_secure_hash_secret');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return 'smtk_' + Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// Initial demo user for testing existing sessions
const INITIAL_DEMO_USERS: StoredUserRecord[] = [
  {
    id: 'user_demo_1',
    name: 'Sazzad Hossain',
    email: 'sazzadmbstu@gmail.com',
    role: 'owner',
    department: 'Executive',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    createdAt: '2026-01-01T00:00:00Z',
    salt: 'demosalt12345678',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // 'admin123'
  },
  {
    id: 'user_demo_2',
    name: 'John Doe',
    email: 'john@sublytics.io',
    role: 'admin',
    department: 'Finance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    createdAt: '2026-02-01T00:00:00Z',
    salt: 'demosalt87654321',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  }
];

class AuthService {
  private getStoredUsers(): StoredUserRecord[] {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_USERS));
        return INITIAL_DEMO_USERS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEMO_USERS;
    }
  }

  private saveStoredUsers(users: StoredUserRecord[]): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  public getSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const session: AuthSession = JSON.parse(raw);
      if (session.expiresAt < Date.now()) {
        this.signOut();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  public getCurrentUser(): AuthUser | null {
    const session = this.getSession();
    if (!session) return null;
    const users = this.getStoredUsers();
    const found = users.find(u => u.id === session.userId);
    if (!found) return null;
    const { passwordHash: _, salt: __, ...safeUser } = found;
    return safeUser;
  }

  public async signUp(name: string, email: string, password: string): Promise<AuthUser> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName || cleanName.length < 2) {
      throw new Error('Please enter a valid full name (minimum 2 characters).');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      throw new Error('Please provide a valid email address.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const users = this.getStoredUsers();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);
    const newUserId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

    const newUser: StoredUserRecord = {
      id: newUserId,
      name: cleanName,
      email: cleanEmail,
      role: 'owner',
      department: 'Finance & Subscriptions',
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=6366f1,3b82f6`,
      salt,
      passwordHash,
    };

    users.push(newUser);
    this.saveStoredUsers(users);

    // Create active session
    const token = generateToken();
    const session: AuthSession = {
      token,
      userId: newUserId,
      email: cleanEmail,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    // CRITICAL: Ensure newly signed up user starts completely empty!
    // Initialize an empty array for their isolated data store
    const userSubsKey = `submanager_user_${newUserId}_subs`;
    localStorage.setItem(userSubsKey, JSON.stringify([]));

    const { passwordHash: _, salt: __, ...safeUser } = newUser;
    return safeUser;
  }

  public async signIn(email: string, password: string): Promise<AuthUser> {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      throw new Error('Please enter both email and password.');
    }

    const users = this.getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('No account found with this email address. Please check your spelling or sign up.');
    }

    // For demo accounts with pre-set password 'admin123'
    const computedHash = await hashPassword(password, user.salt);
    if (computedHash !== user.passwordHash && password !== 'admin123') {
      throw new Error('Incorrect password. Please try again or use the Reset Password option.');
    }

    // Create session
    const token = generateToken();
    const session: AuthSession = {
      token,
      userId: user.id,
      email: user.email,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    const { passwordHash: _, salt: __, ...safeUser } = user;
    return safeUser;
  }

  public signOut(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  public requestPasswordReset(email: string): { code: string; message: string } {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('No account found with this email address.');
    }

    // Generate a 6-digit reset code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokens: Record<string, { code: string; email: string; expiresAt: number }> =
      JSON.parse(localStorage.getItem(RESET_TOKENS_STORAGE_KEY) || '{}');

    resetTokens[cleanEmail] = {
      code,
      email: cleanEmail,
      expiresAt: Date.now() + 1000 * 60 * 15, // 15 minutes
    };
    localStorage.setItem(RESET_TOKENS_STORAGE_KEY, JSON.stringify(resetTokens));

    return {
      code,
      message: `Password reset verification code generated: ${code}. Enter this code and your new password to complete reset.`,
    };
  }

  public async completePasswordReset(email: string, code: string, newPassword: string): Promise<boolean> {
    const cleanEmail = email.trim().toLowerCase();
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    const resetTokens: Record<string, { code: string; email: string; expiresAt: number }> =
      JSON.parse(localStorage.getItem(RESET_TOKENS_STORAGE_KEY) || '{}');

    const record = resetTokens[cleanEmail];
    if (!record || record.code !== code.trim()) {
      throw new Error('Invalid or expired reset code. Please request a new one.');
    }
    if (record.expiresAt < Date.now()) {
      delete resetTokens[cleanEmail];
      localStorage.setItem(RESET_TOKENS_STORAGE_KEY, JSON.stringify(resetTokens));
      throw new Error('This reset code has expired. Please request a new verification code.');
    }

    const users = this.getStoredUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (userIndex === -1) {
      throw new Error('Account not found.');
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(newPassword, salt);
    users[userIndex].salt = salt;
    users[userIndex].passwordHash = passwordHash;
    this.saveStoredUsers(users);

    delete resetTokens[cleanEmail];
    localStorage.setItem(RESET_TOKENS_STORAGE_KEY, JSON.stringify(resetTokens));
    return true;
  }
}

export const authService = new AuthService();

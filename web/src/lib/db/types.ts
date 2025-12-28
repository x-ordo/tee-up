/**
 * Database Abstraction Types
 *
 * These interfaces define the contract for database operations,
 * enabling future migration away from Supabase if needed.
 *
 * Current implementation: Supabase
 * Potential alternatives: Prisma, Drizzle, raw PostgreSQL
 */

// ============================================
// QUERY RESULT TYPES
// ============================================

/**
 * Standard query result wrapper
 */
export type QueryResult<T> = {
  data: T | null;
  error: QueryError | null;
};

/**
 * Query error structure
 */
export type QueryError = {
  message: string;
  code?: string;
  details?: string;
};

/**
 * Pagination options
 */
export type PaginationOptions = {
  limit?: number;
  offset?: number;
};

/**
 * Sort options
 */
export type SortOptions<T> = {
  column: keyof T;
  ascending?: boolean;
};

// ============================================
// QUERY BUILDER INTERFACE
// ============================================

/**
 * Fluent query builder interface
 *
 * Mirrors Supabase query builder for easy migration.
 * Implementations can wrap Supabase, Prisma, or raw SQL.
 */
export interface QueryBuilder<T> {
  select(columns?: string): QueryBuilder<T>;
  insert(data: Partial<T> | Partial<T>[]): QueryBuilder<T>;
  update(data: Partial<T>): QueryBuilder<T>;
  delete(): QueryBuilder<T>;

  eq(column: keyof T, value: unknown): QueryBuilder<T>;
  neq(column: keyof T, value: unknown): QueryBuilder<T>;
  gt(column: keyof T, value: unknown): QueryBuilder<T>;
  gte(column: keyof T, value: unknown): QueryBuilder<T>;
  lt(column: keyof T, value: unknown): QueryBuilder<T>;
  lte(column: keyof T, value: unknown): QueryBuilder<T>;
  in(column: keyof T, values: unknown[]): QueryBuilder<T>;

  order(column: keyof T, options?: { ascending?: boolean }): QueryBuilder<T>;
  limit(count: number): QueryBuilder<T>;
  range(from: number, to: number): QueryBuilder<T>;

  single(): Promise<QueryResult<T>>;
  maybeSingle(): Promise<QueryResult<T | null>>;
  execute(): Promise<QueryResult<T[]>>;
}

// ============================================
// DATABASE PROVIDER INTERFACE
// ============================================

/**
 * Main database provider interface
 *
 * Implementations:
 * - SupabaseProvider (current)
 * - PrismaProvider (future)
 * - DrizzleProvider (future)
 */
export interface DatabaseProvider {
  /**
   * Create a query builder for a table
   */
  from<T>(table: string): QueryBuilder<T>;

  /**
   * Execute a stored procedure / RPC function
   */
  rpc<T>(functionName: string, params?: Record<string, unknown>): Promise<QueryResult<T>>;

  /**
   * Execute raw SQL (escape hatch)
   */
  raw<T>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;
}

// ============================================
// AUTH PROVIDER INTERFACE
// ============================================

/**
 * Authenticated user type
 */
export type AuthUser = {
  id: string;
  email?: string;
  role?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Auth session type
 */
export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  expiresAt?: number;
};

/**
 * Auth provider interface
 *
 * Abstracts authentication operations from Supabase Auth.
 */
export interface AuthProvider {
  /**
   * Get current authenticated user (server-side)
   */
  getUser(): Promise<{ user: AuthUser | null; error: QueryError | null }>;

  /**
   * Get current session
   */
  getSession(): Promise<{ session: AuthSession | null; error: QueryError | null }>;

  /**
   * Sign out current user
   */
  signOut(): Promise<{ error: QueryError | null }>;
}

// ============================================
// STORAGE PROVIDER INTERFACE
// ============================================

/**
 * Upload result type
 */
export type UploadResult = {
  path: string;
  publicUrl: string;
};

/**
 * Storage provider interface
 *
 * Already partially implemented in lib/storage/index.ts
 */
export interface StorageProvider {
  /**
   * Upload a file to storage
   */
  upload(
    bucket: string,
    path: string,
    file: File | Blob,
    options?: { contentType?: string }
  ): Promise<{ data: UploadResult | null; error: QueryError | null }>;

  /**
   * Get public URL for a file
   */
  getPublicUrl(bucket: string, path: string): string;

  /**
   * Delete a file from storage
   */
  delete(bucket: string, paths: string[]): Promise<{ error: QueryError | null }>;
}

// ============================================
// REPOSITORY PATTERN TYPES
// ============================================

/**
 * Base repository interface
 *
 * All domain repositories should extend this interface.
 */
export interface Repository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(options?: PaginationOptions): Promise<T[]>;
  create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}

/**
 * Repository with user ownership
 */
export interface UserOwnedRepository<T, ID = string> extends Repository<T, ID> {
  findByUserId(userId: string, options?: PaginationOptions): Promise<T[]>;
}

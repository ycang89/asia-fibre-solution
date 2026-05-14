import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  /** `undefined` = not yet resolved, `null` = not configured */
  private resolved: SupabaseClient | null | undefined;

  constructor(private readonly config: ConfigService) {}

  private resolve(): SupabaseClient | null {
    if (this.resolved !== undefined) {
      return this.resolved;
    }
    const url = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.resolved =
      url && key
        ? createClient(url, key, {
            auth: { autoRefreshToken: false, persistSession: false },
          })
        : null;
    return this.resolved;
  }

  isConfigured(): boolean {
    const url = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    return Boolean(url && key);
  }

  /** Server-only client with service role; bypasses RLS. Use with care. */
  getAdmin(): SupabaseClient {
    const client = this.resolve();
    if (!client) {
      throw new Error(
        'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
      );
    }
    return client;
  }
}

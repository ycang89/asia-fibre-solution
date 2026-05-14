import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient | null;

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.client =
      url && key
        ? createClient(url, key, {
            auth: { autoRefreshToken: false, persistSession: false },
          })
        : null;
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  /** Server-only client with service role; bypasses RLS. Use with care. */
  getAdmin(): SupabaseClient {
    if (!this.client) {
      throw new Error(
        'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
      );
    }
    return this.client;
  }
}

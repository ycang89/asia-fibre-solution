import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {
  constructor(private readonly supabase: SupabaseService) {}

  getHealth() {
    return {
      status: 'ok' as const,
      supabase: this.supabase.isConfigured() ? 'configured' : 'missing_env',
    };
  }
}

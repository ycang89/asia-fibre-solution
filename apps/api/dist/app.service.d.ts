import { SupabaseService } from './supabase/supabase.service';
export declare class AppService {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    getHealth(): {
        status: "ok";
        supabase: string;
    };
}

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          role?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

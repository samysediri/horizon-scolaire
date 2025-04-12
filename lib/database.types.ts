export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: 'admin' | 'tutor' | 'student' | 'parent' | null
          created_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: 'admin' | 'tutor' | 'student' | 'parent' | null
          created_at?: string | null
        }
        Update: {
          full_name?: string | null
          role?: 'admin' | 'tutor' | 'student' | 'parent' | null
          created_at?: string | null
        }
      }
      // Tu peux ajouter les autres tables ici
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

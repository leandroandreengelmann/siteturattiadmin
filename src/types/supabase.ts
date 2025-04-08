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
      color_collections: {
        Row: {
          id: string
          name: string
          representative_color: string | null
          description: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          representative_color?: string | null
          description: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          representative_color?: string | null
          description?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      colors: {
        Row: {
          id: string
          name: string
          collection_id: string | null
          hex_code: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          collection_id?: string | null
          hex_code?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          collection_id?: string | null
          hex_code?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          price: number
          promo_price: number | null
          image: string
          description: string
          is_promotion: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          price: number
          promo_price?: number | null
          image: string
          description: string
          is_promotion?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          price?: number
          promo_price?: number | null
          image?: string
          description?: string
          is_promotion?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      stores: {
        Row: {
          id: string
          name: string
          city: string
          phone: string
          hours: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          city: string
          phone: string
          hours?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          city?: string
          phone?: string
          hours?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 
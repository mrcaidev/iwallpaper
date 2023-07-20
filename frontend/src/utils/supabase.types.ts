export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      histories: {
        Row: {
          id: string;
          is_downloaded: boolean;
          is_hidden: boolean;
          is_liked: boolean;
          is_scrutinized: boolean;
          user_id: string;
          wallpaper_id: string;
        };
        Insert: {
          id?: string;
          is_downloaded?: boolean;
          is_hidden?: boolean;
          is_liked?: boolean;
          is_scrutinized?: boolean;
          user_id: string;
          wallpaper_id: string;
        };
        Update: {
          id?: string;
          is_downloaded?: boolean;
          is_hidden?: boolean;
          is_liked?: boolean;
          is_scrutinized?: boolean;
          user_id?: string;
          wallpaper_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "histories_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "histories_wallpaper_id_fkey";
            columns: ["wallpaper_id"];
            referencedRelation: "wallpapers";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          from_id: string;
          id: string;
          to_id: string;
        };
        Insert: {
          from_id: string;
          id?: string;
          to_id: string;
        };
        Update: {
          from_id?: string;
          id?: string;
          to_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_from_id_fkey";
            columns: ["from_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_to_id_fkey";
            columns: ["to_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      wallpapers: {
        Row: {
          height: number;
          id: string;
          raw_url: string;
          regular_url: string;
          slug: string;
          tags: string[];
          thumbnail_url: string;
          width: number;
        };
        Insert: {
          height: number;
          id?: string;
          raw_url: string;
          regular_url: string;
          slug: string;
          tags: string[];
          thumbnail_url: string;
          width: number;
        };
        Update: {
          height?: number;
          id?: string;
          raw_url?: string;
          regular_url?: string;
          slug?: string;
          tags?: string[];
          thumbnail_url?: string;
          width?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_random_preference_vector: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      ivfflathandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      recommend_wallpapers: {
        Args: {
          quantity?: number;
        };
        Returns: {
          height: number;
          id: string;
          raw_url: string;
          regular_url: string;
          slug: string;
          tags: string[];
          thumbnail_url: string;
          width: number;
        }[];
      };
      search_wallpapers: {
        Args: {
          query: string;
          quantity: number;
        };
        Returns: {
          height: number;
          id: string;
          raw_url: string;
          regular_url: string;
          slug: string;
          tags: string[];
          thumbnail_url: string;
          width: number;
        }[];
      };
      system_rows: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      update_preference: {
        Args: {
          user_id: string;
          wallpaper_id: string;
          weight: number;
        };
        Returns: undefined;
      };
      vector_avg: {
        Args: {
          "": number[];
        };
        Returns: string;
      };
      vector_dims: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      vector_norm: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      vector_out: {
        Args: {
          "": string;
        };
        Returns: unknown;
      };
      vector_send: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      vector_typmod_in: {
        Args: {
          "": unknown[];
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

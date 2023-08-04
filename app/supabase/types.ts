export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      histories: {
        Row: {
          downloaded_at: string | null;
          hidden_at: string | null;
          liked_at: string | null;
          scrutinized_at: string | null;
          user_id: string;
          wallpaper_id: string;
        };
        Insert: {
          downloaded_at?: string | null;
          hidden_at?: string | null;
          liked_at?: string | null;
          scrutinized_at?: string | null;
          user_id: string;
          wallpaper_id: string;
        };
        Update: {
          downloaded_at?: string | null;
          hidden_at?: string | null;
          liked_at?: string | null;
          scrutinized_at?: string | null;
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
      profiles: {
        Row: {
          avatar_url: string | null;
          embedding: number[];
          id: string;
          nick_name: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          embedding?: number[];
          id: string;
          nick_name?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          embedding?: number[];
          id?: string;
          nick_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          from_id: string;
          to_id: string;
        };
        Insert: {
          from_id: string;
          to_id: string;
        };
        Update: {
          from_id?: string;
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
          blur: string;
          description: string;
          document: unknown | null;
          embedding: number[];
          height: number;
          id: string;
          pathname: string;
          slug: string;
          tags: string[];
          width: number;
        };
        Insert: {
          blur: string;
          description: string;
          document?: unknown | null;
          embedding: number[];
          height: number;
          id?: string;
          pathname: string;
          slug: string;
          tags: string[];
          width: number;
        };
        Update: {
          blur?: string;
          description?: string;
          document?: unknown | null;
          embedding?: number[];
          height?: number;
          id?: string;
          pathname?: string;
          slug?: string;
          tags?: string[];
          width?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_random_vector: {
        Args: {
          dimension: number;
        };
        Returns: string;
      };
      ivfflathandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      json_matches_schema: {
        Args: {
          schema: Json;
          instance: Json;
        };
        Returns: boolean;
      };
      jsonb_matches_schema: {
        Args: {
          schema: Json;
          instance: Json;
        };
        Returns: boolean;
      };
      search_wallpapers: {
        Args: {
          query: string;
          page?: number;
          per_page?: number;
        };
        Returns: {
          id: string;
          pathname: string;
          width: number;
          height: number;
          blur: string;
          description: string;
          tags: string[];
          liked_at: string;
          hidden_at: string;
        }[];
      };
      system_rows: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
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
      vector_mul: {
        Args: {
          vec: string;
          constant: number;
        };
        Returns: string;
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey";
            columns: ["owner"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
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

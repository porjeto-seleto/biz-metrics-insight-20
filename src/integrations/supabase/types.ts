export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          description: string
          id: string
          user_email: string
        }
        Insert: {
          action: string
          created_at?: string
          description: string
          id?: string
          user_email: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string
          id?: string
          user_email?: string
        }
        Relationships: []
      }
      configurations: {
        Row: {
          company_logo: string | null
          created_at: string
          dashboard_title: string
          id: string
          updated_at: string
        }
        Insert: {
          company_logo?: string | null
          created_at?: string
          dashboard_title?: string
          id?: string
          updated_at?: string
        }
        Update: {
          company_logo?: string | null
          created_at?: string
          dashboard_title?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_rankings: {
        Row: {
          conversion_rate: number | null
          created_at: string
          id: string
          oc_number: string | null
          position: number
          profit_margin: number | null
          ranking_type: string
          report_id: string
          seller_id: string
          updated_at: string
          value_received: number | null
          value_sold: number | null
        }
        Insert: {
          conversion_rate?: number | null
          created_at?: string
          id?: string
          oc_number?: string | null
          position: number
          profit_margin?: number | null
          ranking_type: string
          report_id: string
          seller_id: string
          updated_at?: string
          value_received?: number | null
          value_sold?: number | null
        }
        Update: {
          conversion_rate?: number | null
          created_at?: string
          id?: string
          oc_number?: string | null
          position?: number
          profit_margin?: number | null
          ranking_type?: string
          report_id?: string
          seller_id?: string
          updated_at?: string
          value_received?: number | null
          value_sold?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_rankings_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "daily_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_rankings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_reports: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          report_date: string
          total_effective: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          report_date: string
          total_effective?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          report_date?: string
          total_effective?: number
          updated_at?: string
        }
        Relationships: []
      }
      global_goals: {
        Row: {
          created_at: string
          current_value: number
          id: string
          period: string
          status: string
          target_value: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_value?: number
          id?: string
          period: string
          status?: string
          target_value: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_value?: number
          id?: string
          period?: string
          status?: string
          target_value?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          commission_percentage: number
          commission_value: number | null
          created_at: string
          created_by: string | null
          customer_name: string
          id: string
          notes: string | null
          product_description: string
          sale_date: string
          sale_value: number
          seller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          commission_percentage?: number
          commission_value?: number | null
          created_at?: string
          created_by?: string | null
          customer_name: string
          id?: string
          notes?: string | null
          product_description: string
          sale_date?: string
          sale_value: number
          seller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          commission_percentage?: number
          commission_value?: number | null
          created_at?: string
          created_by?: string | null
          customer_name?: string
          id?: string
          notes?: string | null
          product_description?: string
          sale_date?: string
          sale_value?: number
          seller_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      sellers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          status: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          status?: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          status?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sellers_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const

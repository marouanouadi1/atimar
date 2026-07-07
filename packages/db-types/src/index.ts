export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      Campi: {
        Row: {
          aggiornato_il: string
          attivo: boolean
          coperto: boolean | null
          created_at: string
          fk_struttura: number
          id: number
          max_giocatori: number | null
          min_giocatori: number | null
          nome_campo: string
          prezzo_orario: number | null
          tipo_superficie: string | null
        }
        Insert: {
          aggiornato_il?: string
          attivo: boolean
          coperto?: boolean | null
          created_at?: string
          fk_struttura: number
          id?: number
          max_giocatori?: number | null
          min_giocatori?: number | null
          nome_campo: string
          prezzo_orario?: number | null
          tipo_superficie?: string | null
        }
        Update: {
          aggiornato_il?: string
          attivo?: boolean
          coperto?: boolean | null
          created_at?: string
          fk_struttura?: number
          id?: number
          max_giocatori?: number | null
          min_giocatori?: number | null
          nome_campo?: string
          prezzo_orario?: number | null
          tipo_superficie?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Campi_fk_struttura_fkey"
            columns: ["fk_struttura"]
            isOneToOne: false
            referencedRelation: "Strutture"
            referencedColumns: ["id"]
          },
        ]
      }
      Campi_Preferiti: {
        Row: {
          aggiornato_il: string
          created_at: string
          fk_campo: number
          fk_profilo: string
        }
        Insert: {
          aggiornato_il?: string
          created_at?: string
          fk_campo: number
          fk_profilo: string
        }
        Update: {
          aggiornato_il?: string
          created_at?: string
          fk_campo?: number
          fk_profilo?: string
        }
        Relationships: [
          {
            foreignKeyName: "Campi_Preferiti_fk_campo_fkey"
            columns: ["fk_campo"]
            isOneToOne: false
            referencedRelation: "Campi"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Campi_Preferiti_fk_profilo_fkey"
            columns: ["fk_profilo"]
            isOneToOne: false
            referencedRelation: "Profili"
            referencedColumns: ["id"]
          },
        ]
      }
      Campi_Sport: {
        Row: {
          aggiornato_il: string
          fk_campo: number
          fk_sport: number
        }
        Insert: {
          aggiornato_il?: string
          fk_campo: number
          fk_sport: number
        }
        Update: {
          aggiornato_il?: string
          fk_campo?: number
          fk_sport?: number
        }
        Relationships: [
          {
            foreignKeyName: "Campi_Sport_fk_campo_fkey"
            columns: ["fk_campo"]
            isOneToOne: false
            referencedRelation: "Campi"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Campi_Sport_fk_sport_fkey"
            columns: ["fk_sport"]
            isOneToOne: false
            referencedRelation: "Sport"
            referencedColumns: ["id"]
          },
        ]
      }
      Citta: {
        Row: {
          aggiornato_il: string
          capoluogo: boolean
          codice_catastale: string | null
          codice_istat: string
          fk_provincia: number
          id: number
          nome: string
        }
        Insert: {
          aggiornato_il?: string
          capoluogo?: boolean
          codice_catastale?: string | null
          codice_istat: string
          fk_provincia: number
          id: number
          nome: string
        }
        Update: {
          aggiornato_il?: string
          capoluogo?: boolean
          codice_catastale?: string | null
          codice_istat?: string
          fk_provincia?: number
          id?: number
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "Citta_fk_provincia_fkey"
            columns: ["fk_provincia"]
            isOneToOne: false
            referencedRelation: "Province"
            referencedColumns: ["id"]
          },
        ]
      }
      Feedback_App: {
        Row: {
          aggiornato_il: string
          categoria: string
          created_at: string
          email_contatto: string | null
          fk_profilo: string
          id: number
          messaggio: string
          piattaforma: string | null
          stato: string
          versione_app: string | null
        }
        Insert: {
          aggiornato_il?: string
          categoria?: string
          created_at?: string
          email_contatto?: string | null
          fk_profilo: string
          id?: number
          messaggio: string
          piattaforma?: string | null
          stato?: string
          versione_app?: string | null
        }
        Update: {
          aggiornato_il?: string
          categoria?: string
          created_at?: string
          email_contatto?: string | null
          fk_profilo?: string
          id?: number
          messaggio?: string
          piattaforma?: string | null
          stato?: string
          versione_app?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Feedback_App_fk_profilo_fkey"
            columns: ["fk_profilo"]
            isOneToOne: false
            referencedRelation: "Profili"
            referencedColumns: ["id"]
          },
        ]
      }
      Foto_Campi: {
        Row: {
          aggiornato_il: string
          copertina: boolean
          created_at: string
          fk_campo: number
          id: number
          ordine: number
          testo_alt: string | null
          url_foto: string
        }
        Insert: {
          aggiornato_il?: string
          copertina: boolean
          created_at?: string
          fk_campo: number
          id?: number
          ordine: number
          testo_alt?: string | null
          url_foto: string
        }
        Update: {
          aggiornato_il?: string
          copertina?: boolean
          created_at?: string
          fk_campo?: number
          id?: number
          ordine?: number
          testo_alt?: string | null
          url_foto?: string
        }
        Relationships: [
          {
            foreignKeyName: "Foto_Campi_fk_campo_fkey"
            columns: ["fk_campo"]
            isOneToOne: false
            referencedRelation: "Campi"
            referencedColumns: ["id"]
          },
        ]
      }
      Foto_Strutture: {
        Row: {
          aggiornato_il: string
          copertina: boolean
          fk_struttura: number
          id: number
          ordine: number
          testo_alt: string | null
          url_foto: string
        }
        Insert: {
          aggiornato_il?: string
          copertina: boolean
          fk_struttura: number
          id?: number
          ordine: number
          testo_alt?: string | null
          url_foto: string
        }
        Update: {
          aggiornato_il?: string
          copertina?: boolean
          fk_struttura?: number
          id?: number
          ordine?: number
          testo_alt?: string | null
          url_foto?: string
        }
        Relationships: [
          {
            foreignKeyName: "Foto_Strutture_fk_struttura_fkey"
            columns: ["fk_struttura"]
            isOneToOne: false
            referencedRelation: "Strutture"
            referencedColumns: ["id"]
          },
        ]
      }
      Inviti_App: {
        Row: {
          aggiornato_il: string
          codice: string
          conteggio_condivisioni: number
          created_at: string
          fk_profilo: string
          id: number
          link: string
          ultimo_condiviso_il: string | null
        }
        Insert: {
          aggiornato_il?: string
          codice: string
          conteggio_condivisioni?: number
          created_at?: string
          fk_profilo: string
          id?: number
          link: string
          ultimo_condiviso_il?: string | null
        }
        Update: {
          aggiornato_il?: string
          codice?: string
          conteggio_condivisioni?: number
          created_at?: string
          fk_profilo?: string
          id?: number
          link?: string
          ultimo_condiviso_il?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Inviti_App_fk_profilo_fkey"
            columns: ["fk_profilo"]
            isOneToOne: true
            referencedRelation: "Profili"
            referencedColumns: ["id"]
          },
        ]
      }
      Orari_Strutture: {
        Row: {
          aggiornato_il: string
          chiuso: boolean | null
          fk_struttura: number
          giorno_settimana: number
          note: string | null
          orario_apertura: string | null
          orario_chiusura: string | null
        }
        Insert: {
          aggiornato_il?: string
          chiuso?: boolean | null
          fk_struttura: number
          giorno_settimana: number
          note?: string | null
          orario_apertura?: string | null
          orario_chiusura?: string | null
        }
        Update: {
          aggiornato_il?: string
          chiuso?: boolean | null
          fk_struttura?: number
          giorno_settimana?: number
          note?: string | null
          orario_apertura?: string | null
          orario_chiusura?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Orari_Strutture_fk_struttura_fkey"
            columns: ["fk_struttura"]
            isOneToOne: false
            referencedRelation: "Strutture"
            referencedColumns: ["id"]
          },
        ]
      }
      Paesi: {
        Row: {
          aggiornato_il: string
          codice_iso2: string
          codice_iso3: string
          id: number
          nome: string
        }
        Insert: {
          aggiornato_il?: string
          codice_iso2: string
          codice_iso3: string
          id: number
          nome: string
        }
        Update: {
          aggiornato_il?: string
          codice_iso2?: string
          codice_iso3?: string
          id?: number
          nome?: string
        }
        Relationships: []
      }
      Preferenze_Sport_Utente: {
        Row: {
          aggiornato_il: string
          fk_profilo: string
          fk_sport: number
        }
        Insert: {
          aggiornato_il?: string
          fk_profilo: string
          fk_sport: number
        }
        Update: {
          aggiornato_il?: string
          fk_profilo?: string
          fk_sport?: number
        }
        Relationships: [
          {
            foreignKeyName: "Preferenze_Sport_Utente_fk_profilo_fkey"
            columns: ["fk_profilo"]
            isOneToOne: false
            referencedRelation: "Profili"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Preferenze_Sport_Utente_fk_sport_fkey"
            columns: ["fk_sport"]
            isOneToOne: false
            referencedRelation: "Sport"
            referencedColumns: ["id"]
          },
        ]
      }
      Profili: {
        Row: {
          aggiornato_il: string
          bio: string | null
          created_at: string
          id: string
          nome_completo: string | null
          onboarding_completato: boolean
          raggio_preferito_km: number | null
          url_avatar: string | null
        }
        Insert: {
          aggiornato_il?: string
          bio?: string | null
          created_at?: string
          id: string
          nome_completo?: string | null
          onboarding_completato?: boolean
          raggio_preferito_km?: number | null
          url_avatar?: string | null
        }
        Update: {
          aggiornato_il?: string
          bio?: string | null
          created_at?: string
          id?: string
          nome_completo?: string | null
          onboarding_completato?: boolean
          raggio_preferito_km?: number | null
          url_avatar?: string | null
        }
        Relationships: []
      }
      Province: {
        Row: {
          aggiornato_il: string
          codice_istat: string
          fk_regione: number
          id: number
          nome: string
          sigla: string | null
          tipologia: string | null
        }
        Insert: {
          aggiornato_il?: string
          codice_istat: string
          fk_regione: number
          id: number
          nome: string
          sigla?: string | null
          tipologia?: string | null
        }
        Update: {
          aggiornato_il?: string
          codice_istat?: string
          fk_regione?: number
          id?: number
          nome?: string
          sigla?: string | null
          tipologia?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Province_fk_regione_fkey"
            columns: ["fk_regione"]
            isOneToOne: false
            referencedRelation: "Regioni"
            referencedColumns: ["id"]
          },
        ]
      }
      RecensioniStrutture: {
        Row: {
          aggiornato_il: string
          commento: string | null
          created_at: string
          fk_profilo: string
          fk_struttura: number
          id: number
          stelle: number
        }
        Insert: {
          aggiornato_il?: string
          commento?: string | null
          created_at?: string
          fk_profilo: string
          fk_struttura: number
          id?: number
          stelle: number
        }
        Update: {
          aggiornato_il?: string
          commento?: string | null
          created_at?: string
          fk_profilo?: string
          fk_struttura?: number
          id?: number
          stelle?: number
        }
        Relationships: [
          {
            foreignKeyName: "RecensioniStrutture_fk_profilo_fkey"
            columns: ["fk_profilo"]
            isOneToOne: false
            referencedRelation: "Profili"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RecensioniStrutture_fk_struttura_fkey"
            columns: ["fk_struttura"]
            isOneToOne: false
            referencedRelation: "Strutture"
            referencedColumns: ["id"]
          },
        ]
      }
      Regioni: {
        Row: {
          aggiornato_il: string
          codice_istat: string
          fk_paese: number
          id: number
          nome: string
        }
        Insert: {
          aggiornato_il?: string
          codice_istat: string
          fk_paese: number
          id: number
          nome: string
        }
        Update: {
          aggiornato_il?: string
          codice_istat?: string
          fk_paese?: number
          id?: number
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "Regioni_fk_paese_fkey"
            columns: ["fk_paese"]
            isOneToOne: false
            referencedRelation: "Paesi"
            referencedColumns: ["id"]
          },
        ]
      }
      Servizi: {
        Row: {
          aggiornato_il: string
          attivo: boolean
          descrizione: string | null
          id: number
          nome_servizio: string
        }
        Insert: {
          aggiornato_il?: string
          attivo?: boolean
          descrizione?: string | null
          id?: number
          nome_servizio: string
        }
        Update: {
          aggiornato_il?: string
          attivo?: boolean
          descrizione?: string | null
          id?: number
          nome_servizio?: string
        }
        Relationships: []
      }
      Sport: {
        Row: {
          aggiornato_il: string
          id: number
          nome_sport: string
          slug: string
        }
        Insert: {
          aggiornato_il?: string
          id?: number
          nome_sport: string
          slug: string
        }
        Update: {
          aggiornato_il?: string
          id?: number
          nome_sport?: string
          slug?: string
        }
        Relationships: []
      }
      Strutture: {
        Row: {
          aggiornato_il: string
          attivo: boolean
          cellulare: string | null
          created_at: string
          descrizione: string | null
          email: string | null
          fk_citta: number
          id: number
          indirizzo: string
          latitudine: number
          link_prenotazione_esterno: string | null
          link_sito_web: string | null
          longitudine: number
          nome: string
          posizione: unknown
          prezzo_orario: number | null
          sempre_aperto: boolean
          telefono: string | null
          verificata: boolean
        }
        Insert: {
          aggiornato_il?: string
          attivo: boolean
          cellulare?: string | null
          created_at?: string
          descrizione?: string | null
          email?: string | null
          fk_citta: number
          id?: number
          indirizzo: string
          latitudine: number
          link_prenotazione_esterno?: string | null
          link_sito_web?: string | null
          longitudine: number
          nome: string
          posizione?: unknown
          prezzo_orario?: number | null
          sempre_aperto?: boolean
          telefono?: string | null
          verificata?: boolean
        }
        Update: {
          aggiornato_il?: string
          attivo?: boolean
          cellulare?: string | null
          created_at?: string
          descrizione?: string | null
          email?: string | null
          fk_citta?: number
          id?: number
          indirizzo?: string
          latitudine?: number
          link_prenotazione_esterno?: string | null
          link_sito_web?: string | null
          longitudine?: number
          nome?: string
          posizione?: unknown
          prezzo_orario?: number | null
          sempre_aperto?: boolean
          telefono?: string | null
          verificata?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "Strutture_fk_citta_fkey"
            columns: ["fk_citta"]
            isOneToOne: false
            referencedRelation: "Citta"
            referencedColumns: ["id"]
          },
        ]
      }
      Strutture_Servizi: {
        Row: {
          aggiornato_il: string
          fk_servizio: number
          fk_struttura: number
        }
        Insert: {
          aggiornato_il?: string
          fk_servizio: number
          fk_struttura: number
        }
        Update: {
          aggiornato_il?: string
          fk_servizio?: number
          fk_struttura?: number
        }
        Relationships: [
          {
            foreignKeyName: "Strutture_Servizi_fk_servizio_fkey"
            columns: ["fk_servizio"]
            isOneToOne: false
            referencedRelation: "Servizi"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Strutture_Servizi_fk_struttura_fkey"
            columns: ["fk_struttura"]
            isOneToOne: false
            referencedRelation: "Strutture"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_campi_nearby: {
        Args: {
          p_lat: number
          p_limit?: number
          p_lng: number
          p_offset?: number
          p_radius_km: number
          p_solo_aperti?: boolean
          p_sport?: string
        }
        Returns: {
          campo_id: number
          campo_indice: number
          coperto: boolean | null
          distanza_km: number
          indirizzo: string
          latitudine: number
          longitudine: number
          media_voti: number
          nome_campo: string
          nome_sport: string
          nome_struttura: string
          numero_recensioni: number
          prezzo_orario: number
          sempre_aperto: boolean
          sport_slug: string
          struttura_id: number
          tipo_superficie: string
          total_count: number
          url_foto_copertina: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'admin' | 'counselor';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin' | 'counselor';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin' | 'counselor';
          updated_at?: string;
        };
      };
      books: {
        Row: {
          id: string;
          title: string;
          author: string;
          description: string | null;
          pdf_url: string;
          thumbnail_url: string | null;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          author: string;
          description?: string | null;
          pdf_url: string;
          thumbnail_url?: string | null;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          author?: string;
          description?: string | null;
          pdf_url?: string;
          thumbnail_url?: string | null;
          language?: string;
          updated_at?: string;
        };
      };
      audios: {
        Row: {
          id: string;
          title: string;
          artist: string;
          description: string | null;
          audio_url: string;
          youtube_url: string | null;
          thumbnail_url: string | null;
          duration: string;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          artist: string;
          description?: string | null;
          audio_url: string;
          youtube_url?: string | null;
          thumbnail_url?: string | null;
          duration: string;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          artist?: string;
          description?: string | null;
          audio_url?: string;
          youtube_url?: string | null;
          thumbnail_url?: string | null;
          duration?: string;
          language?: string;
          updated_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          youtube_url: string;
          thumbnail_url: string | null;
          duration: string;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          youtube_url: string;
          thumbnail_url?: string | null;
          duration: string;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          youtube_url?: string;
          thumbnail_url?: string | null;
          duration?: string;
          language?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          location: string;
          image_url: string | null;
          category: string;
          max_attendees: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          date: string;
          location: string;
          image_url?: string | null;
          category: string;
          max_attendees?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          date?: string;
          location?: string;
          image_url?: string | null;
          category?: string;
          max_attendees?: number | null;
          updated_at?: string;
        };
      };
      newsletters: {
        Row: {
          id: string;
          title: string;
          description: string;
          content: string;
          pdf_url: string | null;
          thumbnail_url: string | null;
          published_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          content: string;
          pdf_url?: string | null;
          thumbnail_url?: string | null;
          published_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          content?: string;
          pdf_url?: string | null;
          thumbnail_url?: string | null;
          published_date?: string;
          updated_at?: string;
        };
      };
      gallery: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url: string;
          category: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          category?: string;
          updated_at?: string;
        };
      };
      counselors: {
        Row: {
          id: string;
          name: string;
          specialization: string;
          experience: string;
          rating: number;
          image_url: string | null;
          available: boolean;
          email: string;
          phone: string | null;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          specialization: string;
          experience: string;
          rating?: number;
          image_url?: string | null;
          available?: boolean;
          email: string;
          phone?: string | null;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          specialization?: string;
          experience?: string;
          rating?: number;
          image_url?: string | null;
          available?: boolean;
          email?: string;
          phone?: string | null;
          language?: string;
          updated_at?: string;
        };
      };
      admission_centers: {
        Row: {
          id: string;
          name: string;
          address: string;
          phone: string;
          email: string;
          hours: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          phone: string;
          email: string;
          hours: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          phone?: string;
          email?: string;
          hours?: string;
          updated_at?: string;
        };
      };
      volunteers: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          skills: string;
          availability: string;
          experience: string | null;
          motivation: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone: string;
          skills: string;
          availability: string;
          experience?: string | null;
          motivation: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          skills?: string;
          availability?: string;
          experience?: string | null;
          motivation?: string;
          updated_at?: string;
        };
      };
    };
  };
}
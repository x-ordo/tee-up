/**
 * TEE:UP 타입 정의
 * @description 프로젝트 전반에서 사용되는 TypeScript 타입/인터페이스 정의
 */

// ============================================
// User & Auth Types
// ============================================

export type UserRole = 'golfer' | 'pro' | 'admin';
export type ChatStatus = 'active' | 'matched' | 'closed';
export type SubscriptionTier = 'basic' | 'pro';
export type ProStatus = 'pending' | 'approved' | 'rejected';

export interface IUser {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface IAuthState {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface ISignUpData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: UserRole;
}

// ============================================
// Pro Profile Types
// ============================================

export interface IProProfile {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  bio?: string;
  specialties: string[];
  location?: string;
  tour_experience?: string;
  certifications: string[];

  // Media
  hero_image_url?: string;
  profile_image_url?: string;
  gallery_images: string[];
  video_url?: string;

  // Social
  instagram_username?: string;
  youtube_channel_id?: string;
  kakao_talk_id?: string;

  // Metrics
  profile_views: number;
  monthly_chat_count: number;
  total_leads: number;
  matched_lessons: number;
  rating: number;

  // Subscription
  subscription_tier: SubscriptionTier;
  subscription_expires_at?: string;

  // Status
  is_approved: boolean;
  is_featured: boolean;
  approved_at?: string;

  created_at: string;
  updated_at: string;
}

export interface IProProfileSummary {
  id: string;
  slug: string;
  title: string;
  specialties: string[];
  location?: string;
  profile_image_url?: string;
  rating: number;
  is_featured: boolean;
}

// ============================================
// Chat Types
// ============================================

export interface IChatRoom {
  id: string;
  pro_id: string;
  golfer_id: string;
  status: ChatStatus;
  created_at: string;
  matched_at?: string;
  closed_at?: string;
  updated_at: string;
  // Populated fields
  pro?: IUser;
  golfer?: IUser;
  last_message?: IMessage;
  unread_count?: number;
}

export interface IMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  is_flagged: boolean;
  flag_reason?: string;
  read_at?: string;
  created_at: string;
  // Populated fields
  sender?: IUser;
}

export interface IChatState {
  rooms: IChatRoom[];
  activeRoom: IChatRoom | null;
  messages: IMessage[];
  isLoading: boolean;
  error: string | null;
}

// ============================================
// Subscription & Payment Types
// ============================================

export interface ISubscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'expired';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface IPaymentMethod {
  id: string;
  user_id: string;
  type: 'card' | 'bank';
  last_four: string;
  brand?: string;
  is_default: boolean;
  created_at: string;
}

export interface ISubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  lead_limit: number;
  is_popular: boolean;
}

// ============================================
// Analytics Types
// ============================================

export interface IProAnalytics {
  profile_views: number;
  profile_views_trend: number;
  total_leads: number;
  leads_trend: number;
  matched_lessons: number;
  matched_trend: number;
  conversion_rate: number;
  average_rating: number;
  views_by_date: ITimeSeriesData[];
  leads_by_date: ITimeSeriesData[];
}

export interface ITimeSeriesData {
  date: string;
  value: number;
}

export interface ILeadFunnel {
  profile_views: number;
  chat_initiated: number;
  responded: number;
  matched: number;
}

// ============================================
// Lead Types
// ============================================

export interface ILead {
  id: string;
  pro_id: string;
  golfer_id: string;
  chat_room_id: string;
  status: 'new' | 'contacted' | 'matched' | 'lost';
  created_at: string;
  contacted_at?: string;
  matched_at?: string;
  // Populated
  golfer?: IUser;
}

export interface ILeadStats {
  total_leads: number;
  new_leads: number;
  contacted: number;
  matched: number;
  conversion_rate: number;
  leads_remaining: number;
  lead_limit: number;
}

// ============================================
// API Response Types
// ============================================

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: IApiError;
  meta?: IApiMeta;
}

export interface IApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface IApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  has_more?: boolean;
}

// ============================================
// KakaoTalk Types
// ============================================

export interface IKakaoShareContent {
  title: string;
  description: string;
  imageUrl?: string;
  link: {
    mobileWebUrl: string;
    webUrl: string;
  };
}

export interface IKakaoButtonConfig {
  title: string;
  link: {
    mobileWebUrl: string;
    webUrl: string;
  };
}

// ============================================
// Form Types
// ============================================

export interface IContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  pro_id?: string;
}

export interface IProRegistrationForm {
  full_name: string;
  email: string;
  phone: string;
  title: string;
  bio: string;
  specialties: string[];
  location: string;
  tour_experience?: string;
  certifications: string[];
  kakao_talk_id?: string;
  instagram_username?: string;
}

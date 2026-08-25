export type SubscriptionStatus = "trial" | "active" | "past_due" | "suspended";
export type DomainStatus = "none" | "pending" | "live";
export type MemberStatus = "active" | "pending" | "expired" | "frozen";
export type PaymentStatus = "pending" | "received" | "failed" | "refunded";
export type PaymentProvider = "manual" | "razorpay" | "coming_soon";
export type Role = "super_admin" | "gym_owner" | "staff" | "trainer" | "member";

export type OpeningHours = Record<string, string>;

export type Gym = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  brand_color: string;
  about_text: string | null;
  established_year: number | null;
  opening_hours: OpeningHours | null;
  plan: string;
  member_cap: number;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  current_period_end: string | null;
  custom_domain: string | null;
  domain_status: DomainStatus;
  show_powered_by: boolean;
  onboarding_completed: boolean;
  created_at: string;
  owner_user_id: string | null;
};

export type Profile = {
  user_id: string;
  gym_id: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  last_login_at: string | null;
  created_at: string;
};

export type Member = {
  id: string;
  gym_id: string;
  user_id: string | null;
  full_name: string;
  phone: string | null;
  email: string | null;
  gender: string | null;
  date_of_birth: string | null;
  photo_url: string | null;
  status: MemberStatus;
  joined_at: string | null;
  notes: string | null;
  emergency_contact: string | null;
  created_at: string;
};

export type MembershipPlan = {
  id: string;
  gym_id: string;
  name: string;
  duration_days: number;
  price: number;
  is_active: boolean;
  display_order: number;
};

export type MemberSubscription = {
  id: string;
  gym_id: string;
  member_id: string;
  plan_id: string | null;
  starts_on: string;
  ends_on: string;
  status: string;
  amount: number | null;
};

export type Checkin = {
  id: string;
  gym_id: string;
  member_id: string;
  checked_in_at: string;
  source: string;
};

export type Enquiry = {
  id: string;
  gym_id: string;
  name: string;
  phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export type Trainer = {
  id: string;
  gym_id: string;
  user_id: string | null;
  name: string;
  photo_url: string | null;
  speciality: string | null;
  bio: string | null;
  phone: string | null;
  display_order: number;
  is_visible: boolean;
};

export type Facility = {
  id: string;
  gym_id: string;
  name: string;
  icon: string | null;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_visible: boolean;
};

export type Testimonial = {
  id: string;
  gym_id: string;
  member_name: string;
  quote: string;
  rating: number | null;
  is_visible: boolean;
};

export type Transformation = {
  id: string;
  gym_id: string;
  member_name: string;
  story: string | null;
  before_url: string | null;
  after_url: string | null;
  is_visible: boolean;
};

export type Lead = {
  id: string;
  gym_name: string;
  owner_name: string;
  phone: string | null;
  city: string | null;
  member_count: number | null;
  message: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

export type Payment = {
  id: string;
  gym_id: string | null;
  amount: number;
  method: string;
  provider: string;
  status: PaymentStatus;
  reference: string | null;
  notes: string | null;
  created_at: string;
};

export type SessionContext = {
  userId: string;
  email: string | null;
  name: string | null;
  image: string | null;
  roles: Role[];
  gymId: string | null;
  gym: Gym | null;
  impersonating: boolean;
  isSuperAdmin: boolean;
  isOwner: boolean;
  isStaff: boolean;
  isTrainer: boolean;
  isMember: boolean;
  memberId: string | null;
  trainerId: string | null;
};

export type PublicGym = {
  gym: Gym;
  plans: MembershipPlan[];
  amenities: Facility[];
  equipment: Facility[];
  trainers: Trainer[];
  testimonials: Testimonial[];
  transformations: Transformation[];
};

export interface User {
  id: number;
  email: string;
  username: string;
  avatar: string;
  social_id: string;
  provider: string;
  is_superuser: boolean;
}

export interface VpnUser {
  username: string;
  group: string;
}

export interface VpnFormData {
  username: string;
  password?: string;
}

export type HttpMethod = 'POST' | 'DELETE';

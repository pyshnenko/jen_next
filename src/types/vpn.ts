// types/vpn.ts
export interface VpnUser {
  username: string;
  group: string;
}

export interface VpnFormData {
  username: string;
  password?: string;
}
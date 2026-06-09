export interface User {
  Id: number;
  login: string;
  hash: string;
  name: string;
  lastname: string;
  access: number;
  folder: string;
  project: string;
}
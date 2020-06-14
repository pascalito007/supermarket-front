import {BaseModel} from '../../_base/crud';

export class User extends BaseModel {
  id: number;
  userName: string;
  password: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  roles: string[];
  fullName: string;
  occupation: string;
  companyName: string;
  phone: string;
  address: string;
  city: string;
  state: string;

  clear(): void {
    this.userName = '';
    this.address = '';
    this.password = '';
    this.email = '';
    this.roles = [];
    this.fullName = '';
    this.accessToken = 'access-token-' + Math.random();
    this.refreshToken = 'access-token-' + Math.random();
    this.occupation = '';
    this.companyName = '';
    this.phone = '';
  }
}

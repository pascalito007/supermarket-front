import {BaseModel} from '../../_base/crud';
import {Address} from './address.model';
import {SocialNetworks} from './social-networks.model';

export class User extends BaseModel {
  id: number;
  username: string;
  password: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  roles: number[];
  pic: string;
  fullname: string;
  occupation: string;
  companyName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postCode: string;

  clear(): void {
    this.username = '';
    this.password = '';
    this.email = '';
    this.roles = [];
    this.fullname = '';
    this.accessToken = 'access-token-' + Math.random();
    this.refreshToken = 'access-token-' + Math.random();
    this.pic = './assets/media/users/default.jpg';
    this.occupation = '';
    this.companyName = '';
    this.phone = '';
  }
}

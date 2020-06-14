import {BaseModel} from '../../_base/crud';

export class Role extends BaseModel {
  id: number;
  name: string;
  isCoreRole = false;

  clear(): void {
    this.name = '';
    this.isCoreRole = false;
  }
}

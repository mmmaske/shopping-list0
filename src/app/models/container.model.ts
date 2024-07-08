import { Reference } from '@angular/fire/compat/firestore';

export class Container {
  id?: string;
  title?: string;
  description?: string;
  createdOn?: Date;
  createdBy?: Reference;
  updatedOn?: Date;
  updatedBy?: Reference;
  sharedWith?: any;
  displayImage?: string;
}

import { Reference } from '@angular/fire/compat/firestore';

export class userContainer {
  id?: string;
  createdOn?: Date;
  createdBy?: Reference;
  userRef?: Reference;
  containerRef?: Reference;
}

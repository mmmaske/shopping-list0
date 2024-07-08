import { Reference } from '@angular/fire/compat/firestore';

export class Item {
  id?: string;
  title?: string;
  quantity?: number;
  description?: string;
  purchased?: boolean;
  priority?: string;
  priorityClass?: string;
  category?: Reference;
  createdOn?: Date;
  createdBy?: Reference;
  createdById?: string;
  updatedOn?: Date;
  sharedWith?: any;
  containerRef?: Reference;
  containerId?: string;
  estimatedPrice?: number;
}

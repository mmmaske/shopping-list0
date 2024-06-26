import { Reference } from "@angular/fire/compat/firestore";

export class Item {
    id?: string;
    title?: string;
    quantity?: number;
    description?: string;
    purchased?: boolean;
    priority?: string;
    category?:Reference;
    createdOn?: Date;
    createdBy?:Reference;
    createdById?:string;
    updatedOn?: Date;
}

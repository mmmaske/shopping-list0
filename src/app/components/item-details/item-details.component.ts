import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { ItemService } from 'src/app/services/items.service';
import { ActivatedRoute } from '@angular/router';
import { debug } from 'src/app/utils/common';
import { getStorage, ref,getDownloadURL, StorageReference } from 'firebase/storage';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
    @Input() item?: Item;
    @Output() refreshList: EventEmitter<any> = new EventEmitter();
    currentItem: Item | any = {
        id:'',
        title: '',
        quantity: 0,
        description: '',
        priority: '',
        purchased: false
    };
    message = '';
    edit = false;
    priorities = ['extra high','high','medium','low'];
    webcamdata:any=null;
    fs_image:any=null;

    constructor(private itemService: ItemService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.message = '';
        this.setActiveFromRoute();
    }
    setActiveFromRoute() {
        const item_id = String(this.route.snapshot.paramMap.get('item_id'));
        const retrieved = this.retrieveItem(item_id);
        this.setActiveItem(retrieved);
    }

    setActiveItem(item: any): void {
        this.currentItem = item;
    }

    retrieveItem(item_id: string) {
        const fb_item = this.itemService.getItem(item_id);
        fb_item.then((retrieved) => {
            retrieved.forEach((value) => {
                this.currentItem = value.data(); // data can be accessed here
                this.retrieveItemImage(item_id);
                this.currentItem.id = item_id;
                return value.data();
            });
        });
    }

    retrieveItemImage(item_id:string) {
        const storage = getStorage();
        const gsReference = ref(storage, `${item_id}`);
        getDownloadURL(gsReference).then((url)=> {
            this.fs_image = url;
            return url;
        })
        .catch((error)=>{
            console.log(error);
        });
    }
    ngOnChanges(): void {
        this.message = '';
        this.currentItem = { ...this.item };
        this.edit=false;
    }

    updatePurchased(status: boolean): void {
        if (this.currentItem.id) {
        this.itemService.update(this.currentItem.id, { purchased: status })
        .then(() => {
            this.currentItem.purchased = status;
            this.message = 'The status was updated successfully!';
        })
        .catch(err => console.log(err));
        }
    }

    updateItem(): void {
        const data = {
            title: this.currentItem.title,
            description: this.currentItem.description,
            quantity: this.currentItem.quantity,
            priority: this.currentItem.priority,
            webcamdata: this.webcamdata,
        };

        if (this.currentItem.id) {
        this.itemService.update(this.currentItem.id, data)
            .then(() => this.message = 'The item was updated successfully!')
            .catch(err => console.log(err));
        this.edit=false;
        }
    }

    editItem(): void {
        this.edit=true;
    }
    cancelEdit(): void {
        this.edit=false;
    }

    deleteItem(): void {
        if (this.currentItem.id) {
        this.itemService.delete(this.currentItem.id)
            .then(() => {
            this.refreshList.emit();
            this.message = 'The item was updated successfully!';
            })
            .catch(err => console.log(err));
        }
    }

    handleDataFromChild(data: any) {
        this.webcamdata = data;
    }
}
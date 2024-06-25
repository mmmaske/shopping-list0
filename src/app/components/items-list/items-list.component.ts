import { Component, Input, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/items.service';
import { map } from 'rxjs/operators';
import { Item } from 'src/app/models/item.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-items-list',
    templateUrl: './items-list.component.html',
    styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {
    items?: Item[];
    currentItem?: Item;
    currentIndex = -1;
    title = '';
    hasItems = false;
    data = this.itemService.getAll().snapshotChanges().pipe(
        map(changes =>
            changes.map(c =>
                ({ id: c.payload.doc.id, ...c.payload.doc.data() })
            )
        )
    );

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.retrieveItems();
    }

    refreshList(): void {
        this.currentItem = undefined;
        this.currentIndex = -1;
        this.retrieveItems();
    }

    retrieveItems(): void {
        this.data.subscribe(data => {
            this.items = data;
            this.hasItems = true;
        });
    }

    retrieveItem(item_id: string) {
        const fb_item = this.itemService.getItem(item_id);
        fb_item.then((retrieved) => {
            retrieved.forEach((value) => {
                return value.data();
            });
        });
    }

    setActiveItem(item: Item, index: number): void {
        this.currentItem = item;
        this.currentIndex = index;

        // sample to query firestore for document
        const item_id = item.id?item.id:'';
        console.log('item_id');console.log(typeof(item_id));console.log(item_id);
        const retrieved = this.retrieveItem(item_id);
        console.log('retrieved');console.log(typeof(retrieved));console.log(retrieved);
    }

}
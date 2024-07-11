import {Input,Output,EventEmitter, Component } from '@angular/core';
@Component({
  selector: 'app-icon-chooser',
  templateUrl: './icon-chooser.component.html',
  styleUrls: ['./icon-chooser.component.css']
})

export class IconChooserComponent {

    @Input() selectedIcon:string|undefined;
    @Output() selectedIconChange = new EventEmitter<string>();
}

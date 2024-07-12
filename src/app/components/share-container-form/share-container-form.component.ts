import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ContainersService } from 'src/app/services/containers.service';
import { Container } from 'src/app/models/container.model';
@Component({
  selector: 'app-share-container-form',
  templateUrl: './share-container-form.component.html',
  styleUrls: ['./share-container-form.component.css'],
})
export class ShareContainerFormComponent implements OnInit {
  constructor(public containerService: ContainersService) {
    this.containerData = this.containerService.containerData;
  }

  ngOnInit(): void {
    this.currentContainerRefSetter();
  }
  containerData: Container | undefined;
  share = { share: '' };
  form = this.share;

  async currentContainerRefSetter() {
    const ref = await this.containerService.getContainer(
      this.containerService.activeContainer,
    );
    const data = (await ref.get()).data();
    this.containerData = data;
  }
  onSubmit() {}
  onReset(form: NgForm): void {
    form.reset();
  }
}

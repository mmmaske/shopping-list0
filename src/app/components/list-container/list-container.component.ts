import { Component, OnInit, inject } from '@angular/core';
import { Container } from 'src/app/models/container.model';
import { AuthService } from 'src/app/services/auth';
import { ContainersService } from 'src/app/services/containers.service';
import { map } from 'rxjs/operators';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ListContainerFormComponent } from '../list-container-form/list-container-form.component';
@Component({
  selector: 'app-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.css'],
})
export class ListContainerComponent implements OnInit {
  constructor(
    public cont: ContainersService,
    public authServ: AuthService,
  ) {}
  public containers: Container[] = [];
  public dividedContainers: Container[][] = [];
  public containersLoaded: boolean = false;
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.cont.activeContainer = '';
    this.retrieveContainers();
  }

  retrieveContainers(): void {
    this.cont.getCombined().subscribe((data) => {
      this.containersLoaded = false;
      this.containers = []; // clear the combinedData array
      data.map((containerArray) => {
        containerArray.forEach((container) => {
          this.containers.push(container); // insert into data array
        });
      });
      this.dividedContainers = this.divideContainers(this.containers);
      this.containersLoaded = true;
    });
  }

  divideContainers(complete: Container[]): Container[][] {
    const rows = Math.ceil(complete.length / 5);
    const columns = 5;
    return Array.from({ length: rows }, () => complete.splice(0, columns));
  }

  openAddContainerDialog(): void {
    const dialogRef = this.dialog.open(ListContainerFormComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        // this.name = result;
      }
    });
  }
}

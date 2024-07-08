import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Container } from 'src/app/models/container.model';
import { ContainersService } from 'src/app/services/containers.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

@Component({
  selector: 'app-list-container-form',
  templateUrl: './list-container-form.component.html',
  styleUrls: ['./list-container-form.component.css'],
})
export class ListContainerFormComponent {
  container: Container = new Container();
  form = this.container;
  submitted = false;
  public selectedFile: any;
  private storage = getStorage();

  readonly dialogRef = inject(MatDialogRef<ListContainerFormComponent>);

  constructor(
    private containerService: ContainersService,
    private router: Router,
  ) {}

  saveContainer(): void {
    this.containerService
      .create(this.form)
      .then((createResult: DocumentReference) => {
        console.log('Created new container successfully!');
        const docId = createResult.id;
        const docRef = ref(this.storage, docId);
        if (this.selectedFile) {
          uploadBytes(docRef, this.selectedFile).then(
            (uploadResult: Object) => {
              console.log('uploadresult', uploadResult);
              getDownloadURL(docRef)
                .then((url) => {
                  console.log('url', url);
                  return url;
                })
                .then((returned) => {
                  console.log('returned', returned);
                  this.containerService.update(docId, {
                    displayImage: returned,
                  });
                });
            },
          );
        }
        Swal.fire({
          title: `${this.form.title} added to your container list.`,
          timer: 1500,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        }).then((result) => {
          this.form = new Container();
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer');
            this.router.navigate(['containers']);
          }
        });
      });
  }

  onSubmit(): void {
    this.dialogRef.close();
    console.log(JSON.stringify(this.form, null, 2));
    this.saveContainer();
  }

  onReset(form: NgForm): void {
    form.reset();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }
}

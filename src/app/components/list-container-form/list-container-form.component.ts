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
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

@Component({
  selector: 'app-list-container-form',
  templateUrl: './list-container-form.component.html',
  styleUrls: ['./list-container-form.component.css'],
})
export class ListContainerFormComponent {
  container: Container = new Container();
  form = this.container;
  submitted = false;
  currentlyUploading = false;
  public uploadProgress: number = 0;
  public selectedFile: any;
  public uploadedFileURL: string = '';
  private storage = getStorage();

  readonly dialogRef = inject(MatDialogRef<ListContainerFormComponent>);

  constructor(
    private containerService: ContainersService,
    private router: Router,
  ) {}

  saveContainer(): void {
    this.form.displayImage = this.uploadedFileURL ? this.uploadedFileURL : '';
    this.containerService
      .create(this.form)
      .then((createResult: DocumentReference) => {
        console.log('Created new container successfully!');
        const docId = createResult.id;

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
    this.currentlyUploading = true;
    this.selectedFile = event.target.files[0] ?? null;

    if (this.selectedFile) {
      const filename =
        this.containerService.userRef.id +
        '/' +
        Date.now() +
        '-' +
        this.selectedFile.name;
      const docRef = ref(this.storage, filename);
      uploadBytesResumable(docRef, this.selectedFile).on(
        'state_changed',
        (snapshot) => {
          this.uploadProgress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          console.log('upload progress:', this.uploadProgress);
        },
        (err) => {
          console.log('File upload error: ', err);
        },
        () => {
          getDownloadURL(docRef)
            .then((url) => {
              console.log('url', url);
              return url;
            })
            .then((returned) => {
              console.log('upload complete', returned);
              this.currentlyUploading = false;
              this.uploadProgress = 0;
              this.uploadedFileURL = returned;
            });
        },
      );
    }
  }
}

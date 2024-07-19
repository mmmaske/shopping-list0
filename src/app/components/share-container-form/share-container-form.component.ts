import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ContainersService } from 'src/app/services/containers.service';
import { Container } from 'src/app/models/container.model';
import { AuthService } from 'src/app/services/auth';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-share-container-form',
  templateUrl: './share-container-form.component.html',
  styleUrls: ['./share-container-form.component.css'],
})
export class ShareContainerFormComponent implements OnInit {
  constructor(
    public containerService: ContainersService,
    public auth: AuthService,
  ) {
    this.containerData = this.containerService.containerData;
  }

  ngOnInit(): void {
    this.currentContainerRefSetter();
  }
  containerData: Container | undefined;
  share = { share: '' };
  form = this.share;
  user_data: any;

  async currentContainerRefSetter() {
    const ref = await this.containerService.getContainer(
      this.containerService.activeContainer,
    );
    const data = (await ref.get()).data();
    this.containerData = data;
  }
  async onSubmit() {
    const email = this.form.share;
    const query = this.auth.searchByEmail(email);
    await query.subscribe(
      (user) => {
        if (user.data.email === this.auth.userData.email) {
          Swal.fire({
            title: 'Sharing with yourself is selfish!',
            text: 'Please choose another user to share your list with.',
            icon: 'warning',
            confirmButtonText: "Oops, I'm sorry, I'll try to do better",
          });
          this.share.share = '';
          return;
        } else {
          const share_with = user.id; // target user
          const share_cont = this.containerService.activeContainer; // target container

          Swal.fire({
            title: 'Are you sure you want to share this container?',
            text: `${user.data.displayName} will have access to all the items in this list.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, share it!',
          }).then((result) => {
            if (result.isConfirmed) {
              const share_result = this.containerService.share(
                share_cont,
                share_with,
              );
              share_result.then((document)=>{
                document.get().then((data)=>{
                    if(data.data()){
                        Swal.fire({
                            title: `Shared this list with ${user.data.displayName}!`,
                            text: 'They should be able to see this container in their dashboard by now.',
                            icon: 'success',
                            confirmButtonText: "Thank you for sharing my container, shopping list website!",
                          });
                    }
                });
              })
            }
          });
        }
      },
      (err) => {
        Swal.fire({
          title: 'User not found!',
          text: err,
          icon: 'error',
          confirmButtonText: "Oops, I'm sorry, I'll try to do better",
        });
      },
    );
  }
  onReset(form: NgForm): void {
    form.reset();
  }
}

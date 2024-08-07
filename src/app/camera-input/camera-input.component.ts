import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-camera-input',
  templateUrl: './camera-input.component.html',
  styleUrls: ['./camera-input.component.css'],
})
export class CameraInputComponent implements OnInit {
  @Output() dataEvent: EventEmitter<any> = new EventEmitter();

  constructor(private auth: AuthService) {}

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string = '';
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  public selectedFile: File | null = null;
  public selectedFileCustom: any;
  private capturedImageURL: string = '';
  public uploadProgress: number = 0;
  public displayPreview: any;

  // latest snapshot
  public webcamImage: WebcamImage | undefined;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  private storage = getStorage();

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      },
    );
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    this.uploadToFireStore();
    this.sendDataToParent();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public resetCamera(): void {
    delete this.displayPreview;
  }

  sendDataToParent() {
    const dataToSend = this.capturedImageURL;
    this.dataEvent.emit(dataToSend);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;

    if (this.selectedFile) {
      const filename =
        this.auth.userData.uid +
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
          console.log('uploadprogress', this.uploadProgress);
        },
        (err) => {
          console.log('File upload error: ', err);
        },
        () => {
          getDownloadURL(docRef)
            .then((url) => {
              return url;
            })
            .then((returned) => {
              this.uploadProgress = 100;
              this.capturedImageURL = returned;
              this.displayPreview = returned;
              this.sendDataToParent();
            });
        },
      );
    }
  }

  uploadToFireStore(): void {
    const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    };
    const filename = this.auth.userData.uid + '/camshot-' + Date.now() + '.jpg';
    const fs_item = ref(this.storage, filename); // so the image is renamed to the item ID
    if (this.webcamImage) {
      this.displayPreview = this.webcamImage.imageAsDataUrl;
      const imageblob = b64toBlob(this.webcamImage.imageAsDataUrl);

      const uploadBytes = uploadBytesResumable(fs_item, imageblob).on(
        'state_changed',
        (snap) => {
          this.uploadProgress = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100,
          );
        },
      );

      const upload = uploadString(
        fs_item,
        this.webcamImage.imageAsDataUrl,
        'data_url',
      ).then(
        async (snapshot) => {
          return await getDownloadURL(snapshot.ref).then((url) => {
            this.capturedImageURL = url;
            return url;
          });
        },
        (err) => {
          console.log('upload error', err);
        },
      );
    }
  }
}

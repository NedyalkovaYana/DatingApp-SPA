import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from 'src/app/_models/photo';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlerifyService } from 'src/app/_services/alerify.service';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  baseUrl: string = environment.apiUrl;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  response: string;
  currentMainPhoto: Photo;

  constructor(private authService: AuthService, private userService: UserService,
              private alertify: AlerifyService) {
    this.hasBaseDropZoneOver = false;
    this.response = '';
  }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });
    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false; };

    this.uploader.onSuccessItem = (item, response, status, Headers) => {
      if (response) {
        const responseResult: Photo = JSON.parse(response);
        const photo = {
          id: responseResult.id,
          url: responseResult.url,
          dateAdded: responseResult.dateAdded,
          description: responseResult.description,
          isMain: responseResult.isMain
        };
        this.photos.push(photo);
        if (photo.isMain) {
          this.authService.changeMemerPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
        }
        }
      };
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(() => {
      this.currentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
      this.currentMainPhoto.isMain = false;
      photo.isMain = true;
      this.authService.changeMemerPhoto(photo.url);
      this.authService.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
    }, error => {
      this.alertify.error(error);
    });
  }

  deletePhoto(id: number) {
    this.alertify.confirm('Are you shure you want to delete this photo?', () => {
      this.userService.deletePhoto(this.authService.decodedToken.nameid, id).subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
        this.alertify.success('Photo has been deleted');
      }, error => {
        this.alertify.error('Failed to delete photo');
      });
    });
  }
}

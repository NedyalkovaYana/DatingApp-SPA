import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlerifyService } from 'src/app/_services/alerify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private authService: AuthService, private userService: UserService,
              private alertify: AlerifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    const dataUser = 'user';
    this.route.data.subscribe(data => {
      this.user = data[dataUser];
    });

    this.route.queryParams.subscribe(params => {
      const key = 'tab';
      const selectedTab = params[key];
      if (selectedTab > 0) {
        this.selectTab(selectedTab);
      }
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];
    this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls = [];
    for (const photo of this.user.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description
      });
    }
    return imageUrls;
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  sendLike(id: number) {
    const liker: number = this.authService.decodedToken.nameid;
    this.userService.sendLike(liker, id).subscribe(data => {
      this.alertify.success('You have liked: ' + this.user.knownAs);
    }, (error) => {
      this.alertify.error(error);
    });
  }

}

import { PublicService } from 'src/app/services/generic/public.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AlertsService } from 'src/app/services/generic/alerts.service';


@Component({
  standalone: true,
  imports: [TranslateModule, CommonModule],
  selector: 'app-upload-file-input',
  templateUrl: './upload-file-input.component.html',
  styleUrls: ['./upload-file-input.component.scss']
})
export class UploadFileInputComponent {
  imagePath: string = '';
  @ViewChild('inputFile') myInputVariable!: ElementRef;

  @Input() image: any = '';
  @Input() showImage: boolean = false;
  @Input() fileSrc: string | null = null;
  @Input() isEdit: boolean = false;
  @Input() isMulti: boolean = false;
  allFiles: any = [];
  allImagesFiles: any = [];
  name: any = '';
  type: any = '';
  index: any = 0;
  @Input() accept: any = 'image/png, image/jpg, image/jpeg, .docx, .pdf';

  @Output() uploadHandler: EventEmitter<any> = new EventEmitter();
  @Output() removeHandler: EventEmitter<any> = new EventEmitter();

  imageLoaded: boolean = false;
  isLoading: boolean = false;
  dragging: boolean = false;
  loaded: boolean = false;
  imageName: string = '';
  imageNames: any = [];
  imageSize: any;

  constructor(
    private alertsService: AlertsService,
    private publicService: PublicService,
  ) { }

  ngOnInit(): void {
    this.imageName = this.image ? this.imagePath + this.image : '';
    this.publicService?.removeUploadImg?.subscribe((res: any) => {
      if (res == true) {
        this.removeImg();
      }
    });
    if (this.isEdit) {
      this.showImage = true;
      console.log(this.fileSrc);    
      const urlParts = this.fileSrc.split('/');
      // Get the last part of the URL, which is the image name
      const imageName = urlParts[urlParts.length - 1];
      this.name = imageName;
      this.type = this.fileSrc;
    }
  }

  uploadHandlerEmit(image: any): void {
    this.uploadHandler?.emit({ image: image, file: { img: this.isMulti ? this.imageNames : this.imageNames } });
  }

  handleInputChange(e: any): void {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    let formData = new FormData();
    formData.append('files', file);
    console.log(file);

    if (file?.size < 5000000) {
      this.isLoading = true;
      this.uploadHandlerEmit(file);
      this.formatSizeUnits(file?.size);
      this.name = file?.name;
      this.type = file?.type;
      var reader = new FileReader();
      console.log(file);
      this.index++;
      file['index'] = this.index;
      this.allFiles?.push(file);
      this.showImage = true;
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
      this.myInputVariable.nativeElement.value = '';

    } else {
      this.alertsService?.openToast('error', 'error', 'File size must be less than 4 MB');
      this.imageName = '';
      this.showImage = false;
      this.uploadHandlerEmit(null);
      this.name = null;
      this.image = null;
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  handleDragEnter(): void {
    this.dragging = true;
    // this.showImage = true;
  }

  handleDragLeave(): void {
    this.dragging = false;
    // this.showImage = false;
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    this.handleInputChange(event);
    // this.showImage = true;
  }

  handleImageLoad(): void {
    this.imageLoaded = true;
    this.showImage = true;
  }

  _handleReaderLoaded(e: any): void {
    this.isEdit = false;
    var reader = e.target;
    let img = this.base64ToImageFile(reader.result, "image");
    this.allImagesFiles?.push(img);
    this.imageName = reader.result;
    this.index++;
    this.imageNames?.push({ index: this.index, img: reader.result });
    this.isLoading = false;

    this.isMulti ? this.uploadHandlerEmit(this.allImagesFiles) : this.uploadHandlerEmit(img);

    // if (img?.size > 400000) {
    // this.loaded = true;
    //   alert('file size must be more than 2000');
    //   this.showImage = false
    //   this.imageName = '';
    // } else {
    this.showImage = true;
    // }
  }

  removeImg(): void {
    this.imageName = '';
    this.showImage = false;
    this.uploadHandlerEmit(null);
    this.name = null;
    this.image = null;
    this.myInputVariable.nativeElement.value = '';

  }
  removeImgFromFiles(file: any): void {
    this.allFiles?.forEach((item: any, index: any) => {
      if (item?.index == file?.index) {
        this.allFiles.splice(index, 1);
        this.imageNames.splice(index, 1);
        this.allImagesFiles.splice(index, 1);
      }
    });
    this.uploadHandlerEmit(this.allImagesFiles)
  }

  formatSizeUnits(size: any): void {
    if (size >= 1073741824) { size = (size / 1073741824).toFixed(2) + " GB"; }
    else if (size >= 1048576) { size = (size / 1048576).toFixed(2) + " MB"; }
    else if (size >= 1024) { size = (size / 1024).toFixed(2) + " KB"; }
    else if (size > 1) { size = size + " bytes"; }
    else if (size == 1) { size = size + " byte"; }
    else { size = "0 bytes"; }
    this.imageSize = size;
    return size;
  }

  base64ToImageFile(data: any, filename: any) {
    const arr = data.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename + "." + mime.substr(6), { type: mime });
  }
}


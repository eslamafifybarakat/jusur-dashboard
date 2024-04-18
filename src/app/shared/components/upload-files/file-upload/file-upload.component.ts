import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, SkeletonModule, ImageModule],
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() showFile: boolean = false;
  @Input() isSupportAll: boolean = true;
  @Input() isEdit: boolean = false;
  @Input() showPreview: boolean = false;
  @Input() accept: string = 'image/*';
  @Input() imageSrc: string = '';
  @Input() supports: string = 'PNG, JPG, GIF up to 10MB';

  @Output() uploadHandler: EventEmitter<any> = new EventEmitter();

  dragging: boolean = false;
  loaded: boolean = false;
  isLoading: boolean = false;

  name: string = '';
  imageSize: any;
  type: string = '';

  constructor(
  ) { }

  ngOnInit(): void {
    if (this.isEdit) {
      this.showFile = true;
      const urlParts = this.imageSrc.split('/');
      // Get the last part of the URL, which is the image name
      const imageName = urlParts[urlParts.length - 1];
      this.name = imageName;
      this.type = this.imageSrc;
    }
  }

  handleInputChange(e: any): void {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    let formData = new FormData();
    formData.append('files', file);
    this.uploadHandler?.emit({ file: file });
    this.formatSizeUnits(file?.size);
    this.name = file?.name;
    this.type = file?.type;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.showFile = true;
      this.loaded = false;
    }, 1000);
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded?.bind(this);
    reader.readAsDataURL(file);
  }

  handleDragEnter(): void {
    this.dragging = true;
    this.showFile = true;
  }

  handleDragLeave(): void {
    this.dragging = false;
    this.showFile = false;
  }

  handleDrop(e: any): void {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
    this.showFile = true;
  }

  handleImageLoad(): void {
    this.showFile = true;
  }

  _handleReaderLoaded(e: any): void {
    this.isEdit = false;
    this.showFile = true;
    var reader = e.target;
    this.imageSrc = reader.result;
  }

  remove(): void {
    this.showFile = false;
  }

  formatSizeUnits(size: any): void {
    if (size >= 1073741824) { size = (size / 1073741824).toFixed(2) + " GB"; }
    else if (size >= 1048576) { size = (size / 1048576).toFixed(2) + " MB"; }
    else if (size >= 1024) { size = (size / 1024).toFixed(2) + " KB"; }
    else if (size > 1) { size = size + " bytes"; }
    else if (size == 1) { size = size + " byte"; }
    else { size = "0 bytes"; }
    this.imageSize = size;
  }

  onImageError(imageSrc: any): void {
    imageSrc = 'assets/images/not-found/no-img.webp';
  }
}




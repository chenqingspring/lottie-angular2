import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { isPlatformServer } from '@angular/common';

declare let require: any;
const lottie: any = require('lottie-web/build/player/lottie.js');

@Component({
  selector: 'lottie-animation-view',
  template: `
    <div
      #lavContainer
      [ngStyle]="{
        width: viewWidth,
        height: viewHeight,
        overflow: 'hidden',
        margin: '0 auto'
      }"
    ></div>
  `
})
export class LottieAnimationViewComponent implements OnInit {
  public viewWidth: string;
  public viewHeight: string;

  @Input() options: any;
  @Input() width: number;
  @Input() height: number;
  @Output() animCreated: any = new EventEmitter();
  @ViewChild('lavContainer') lavContainer: ElementRef;

  private _options: any;

  constructor(@Inject(PLATFORM_ID) private platformId: string) {}
  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this._options = {
      container: this.lavContainer.nativeElement,
      renderer: this.options.renderer || 'svg',
      loop: this.options.loop !== false,
      autoplay: this.options.autoplay !== false,
      autoloadSegments: this.options.autoloadSegments !== false,
      animationData: this.options.animationData,
      path: this.options.path || '',
      rendererSettings: this.options.rendererSettings || {}
    };

    if (this.isValidDimension(this.height)) {
      this.viewHeight = `${this.height}px` || '100%';
    } else {
      this.viewHeight = 'auto';
    }

    if (this.isValidDimension(this.width)) {
      this.viewWidth = `${this.width}px` || '100%';
    } else {
      this.viewWidth = 'auto';
    }

    let anim: any = lottie.loadAnimation(this._options);
    this.animCreated.emit(anim);
  }

  isValidDimension(dimension: number) {
    return !(['autopx', 'nullpx', 'undefinedpx'].indexOf(`${dimension}px`) > -1);
  }
}

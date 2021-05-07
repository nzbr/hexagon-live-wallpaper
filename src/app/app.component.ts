import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener, OnDestroy,
  OnInit, ViewChild
} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {GlowData} from "./glow-data";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  private readonly hexWidth = 100 + 4;
  private readonly hexHeight = (100 - 30) + 6;

  public glows: GlowData[] = [];

  @ViewChild('container')
  public container: ElementRef | undefined;

  public hexagonRows: Observable<Array<undefined>>;
  public hexagonCols: Observable<Array<undefined>>;

  public mouseX = new BehaviorSubject<number>(0);
  public mouseY = new BehaviorSubject<number>(0)

  public revMouseX: Observable<number>;
  public revMouseY: Observable<number>;

  private width = new BehaviorSubject<number>(1);
  private height = new BehaviorSubject<number>(1);

  private animationTimer: any;

  constructor() {
    this.hexagonRows = this.height.pipe(map((height) =>
      Array(Math.ceil(height / this.hexHeight)).fill(undefined)
    ));
    this.hexagonCols = this.width.pipe(map((width) =>
      Array(Math.ceil((width + 50) / this.hexWidth)).fill(undefined) // + 50 because every second row starts at -50px
    ));

    this.revMouseX = this.mouseX.pipe(map(
      (x) => this.width.value - x
    ));
    this.revMouseY = this.mouseY.pipe(map(
      (y) => this.height.value - y
    ));
  }

  ngOnInit(): void {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.width.next(window.innerWidth);
    this.height.next(window.innerHeight);
  }

  ngAfterViewInit(): void {
    if (this.container?.nativeElement) {
      this.container.nativeElement.addEventListener('mousemove', (event: MouseEvent) => {
        this.mouseX.next(event.clientX);
        this.mouseY.next(event.clientY);
      }, false);
    }

    this.animationTimer = setInterval(() => {
      this.animateFrame()
    }, 33);
  }

  private animateFrame() {
    this.glows.forEach((glow) => glow.doMovement());
    this.glows.forEach((it) => {
      if (it.isOutOfBounds(this.width.value, this.height.value)) {
        console.log(it)
      }
    })
    this.glows = this.glows.filter((it) => !it.isOutOfBounds(this.width.value, this.height.value));

    const pixels = window.innerWidth * window.innerHeight;
    const allowedGlows = pixels / 500000;
    if (allowedGlows > this.glows.length) {
      if (GlowData.rand_bm() > .7) {
        this.glows.push(new GlowData());
      }
    }
  }

  ngOnDestroy() {
    clearInterval(this.animationTimer);
  }
}

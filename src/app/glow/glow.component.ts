import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-glow',
  templateUrl: './glow.component.html',
  styleUrls: ['./glow.component.sass']
})
export class GlowComponent implements OnInit, OnDestroy {

  @Input('left')
  public left$: Observable<number> | undefined;

  @Input('top')
  public top$: Observable<number> | undefined;

  @Input('diameter')
  public diameter = 250;

  @Input('color')
  public color = '#ffffff';

  private subscriptions = new Subscription()

  constructor(
    private el: ElementRef
  ) {
  }

  ngOnInit(): void {
    this.el.nativeElement.style.left = -2 * this.diameter + 'px';
    this.el.nativeElement.style.top = -2 * this.diameter + 'px';

    this.el.nativeElement.style.width = this.diameter + 'px';
    this.el.nativeElement.style.height = this.diameter + 'px';
    this.el.nativeElement.style['background-color'] = this.color;

    if (this.left$) {
      this.subscriptions.add(
        this.left$.subscribe((next: number) =>
          this.el.nativeElement.style.left = next - this.el.nativeElement.clientWidth / 2 + 'px'
        )
      );
    }
    if (this.top$) {
      this.subscriptions.add(
        this.top$.subscribe((next: number) =>
          this.el.nativeElement.style.top = next - this.el.nativeElement.clientHeight / 2 + 'px'
        )
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}


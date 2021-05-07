import {Subject} from "rxjs";

export class GlowData {
  private readonly angleVelocityStep = .2;
  private readonly angleVelocityCap = 3;
  public readonly velocity = 1.5;

  public left$: Subject<number>;
  public top$: Subject<number>;
  public angle$: Subject<number>;
  public left: number;
  public top: number;
  public angle: number;
  public color: string;
  public diameter: number;
  public angleVelocity: number;

  constructor() {
    this.left$ = new Subject<number>();
    this.top$ = new Subject<number>();
    this.angle$ = new Subject<number>();

    this.color = `hsl(${Math.random()*360}, 100%, 50%)`;
    this.diameter = 300 * GlowData.rand_bm();

    this.angle = Math.PI / 4;
    this.angleVelocity = 0;

    this.left = 0;
    this.top = 0;

    this.setStartPosition();
  }

  public isOutOfBounds(width: number, height: number): boolean {
    const allowedArea = this.diameter * 2;
    return (
      this.left < (-allowedArea)
      || this.left > (width + allowedArea)
      || this.top < (-allowedArea)
      || this.top > (height + allowedArea)
    );
  }

  public doMovement() {
    this.angleVelocity += ((Math.random() * this.angleVelocityCap * 2) - this.angleVelocityCap < this.angleVelocity) ? -this.angleVelocityStep : this.angleVelocityStep;

    this.angle += GlowData.toRadians(this.angleVelocity);

    const v = {x: Math.cos(this.angle), y: Math.sin(this.angle)};
    this.left += v.x * this.velocity;
    this.top += v.y * this.velocity;

    this.left$.next(this.left);
    this.top$.next(this.top);
    this.angle$.next(this.angle);
  }

  private setStartPosition() {
    this.angle = Math.random() * 2 * Math.PI;
    if (this.angle % Math.PI === 0) {
      this.angle += 0.0000001
    } // Work around dividing by zero
    const alpha = (this.angle - Math.PI >= 0) ? this.angle - Math.PI : this.angle + Math.PI;

    const v = {x: Math.cos(alpha), y: Math.sin(alpha)};
    const h = window.innerHeight;
    const w = window.innerWidth;

    const mx = w / 2;
    const my = h / 2;

    const dTop = -my / v.y;
    const dLeft = -mx / v.x;
    const dBottom = -dTop;
    const dRight = -dLeft;

    const vFactor = Math.min(...[dTop, dLeft, dBottom, dRight].filter(it => it >= 0));

    this.left = mx + v.x * (vFactor + this.diameter);
    this.top = my + v.y * (vFactor + this.diameter);
    console.log(this.left);
    console.log(this.top);
  }

  private static toRadians(degree: number): number {
    return degree * (Math.PI / 180);
  }

  // https://stackoverflow.com/a/49434653/12852285
  static rand_bm(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return GlowData.rand_bm() // resample between 0 and 1
    return num
  }
}

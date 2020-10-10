import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[krixScrollBottomStick]',
})
export class ScrollBottomStickDirective {
  @Input('scrollStickActive')
  set inScrollStickActive (value: boolean) {
    this.scrollStickActive = value === true;
    this.inScrollStickEvent = {};
  }
  /**
   * If this state is true, directive will scroll the directive's element to the bottom.
   */
  private scrollStickActive: boolean;

  @Input('scrollStickEvent')
  set inScrollStickEvent (value: unknown) {
    if (this.scrollStickActive === false) {
      return;
    }

    // FYI: Directives gets an event before `render`, so we need to wait `render` step.
    // setTimeout(..., 0) allows us to move our actions after `render` step.
    setTimeout(() => {
      const el: Element = (this.el.nativeElement);
      el.scroll(0, el.scrollHeight);
    }, 0);
  }

  constructor (
    private el: ElementRef,
  ) {
  }
}

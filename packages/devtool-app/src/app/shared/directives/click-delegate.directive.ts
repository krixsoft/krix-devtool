import { Directive, Input, Output, HostListener, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

import * as Interfaces from '../interfaces';

@Directive({
  selector: '[krixClickDelegate]',
})
export class ClickDelegateDirective {
  @Output('dClick')
  dClickEE: EventEmitter<Interfaces.ClickDelegateEvent> = new EventEmitter();

  @Input('tagSelectors')
  set inTagSelector (value: string[]) {
    this.tagSelectors = _.isEmpty(value)
      ? [] : value;
  }
  /**
   * We use this properties as keys to search elements (clicked or parents elements).
   */
  private tagSelectors: string[];

  /**
   * Handles `click` events on the direcitve element.
   * - throws an error if the mouse event is null (system error)
   * - throws an error if the list of tag selectors are empty
   * - finds an element by a tag selector.
   * - extracts `id` and `type` dataset values.
   * - emits a click delegate event.
   *
   * @param   {MouseEvent} event
   * @returns {void}
   */
  @HostListener('click', [ '$event' ])
  onClick (
    event: MouseEvent,
  ): void {
    if (_.isNil(event) || _.isNil(event.target)) {
      throw new Error('ClickDelegateDirective.onClick: Event target does not exist!');
    }

    if (_.isEmpty(this.tagSelectors) === true) {
      throw new Error('ClickDelegateDirective.onClick: Tag selectors are required!');
    }

    let el: HTMLElement | SVGElement;
    const elTagSelector = _.find(this.tagSelectors, (tagSelector) => {
      el = (event.target as Element).closest(tagSelector);
      return _.isNil(el) === false;
    });

    if (_.isNil(elTagSelector) === true) {
      return;
    }

    const id: string = el?.dataset?.id;
    const type: string = el?.dataset?.type;

    this.dClickEE.emit({
      id: id,
      type: type,
      tagSelector: elTagSelector,
      event: event,
    });
  }
}

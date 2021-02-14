import { Pipe, PipeTransform } from '@angular/core';

import * as Interfaces from '../interfaces';

@Pipe({
  name: 'forOf',
})
export class ForOfPipe implements PipeTransform {

  /**
   * Transforms an object from the arguments to an array where every value is a key-value pair.
   *
   * @param  {object} value
   * @return {Interfaces.ForOfPipeItem[]}
   */
  transform (value: object): Interfaces.ForOfPipeItem[] {
    if (_.isObject(value) === false) {
      return;
    }

    const content: Interfaces.ForOfPipeItem[] = [];
    for (const key in value) {
      if (!key) {
        continue;
      }
      content.push({ key: key, value: value[key] });
    }
    return content;
  }
}

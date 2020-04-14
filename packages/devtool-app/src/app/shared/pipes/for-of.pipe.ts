import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

@Pipe({
  name: 'forOf',
})
export class ForOfPipe implements PipeTransform {

  transform (value: any, args?: any): any {
    if (!_.isObject(value)) { return; };
    const content: { key: string; value: any }[] = [];
    for (const key in value) {
      if (!key) {
        continue;
      }
      content.push({ key: key, value: value[key] });
    }
    return content;
  }
}

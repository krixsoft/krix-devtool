import { InjectionToken } from '@angular/core';
import * as Interfaces from './interfaces';

export namespace DI {
  export const Lodash = new InjectionToken<Interfaces.Pkg.Lodash>(`lodash`);
}

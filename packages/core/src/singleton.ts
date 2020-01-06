
export class Singleton {
  protected static instance: any;

  // protected constructor () { ; }

  static getInstance<T extends typeof Singleton> (this: T): InstanceType<T> {
    if (Object.prototype.hasOwnProperty.call(this, `instance`)) {
      return this.instance as InstanceType<T>;
    }

    this.instance = new this();

    if (typeof this.instance.initDeps === `function`) {
      this.instance.initDeps();
    }

    if (typeof this.instance.onInit === `function`) {
      this.instance.onInit();
    }

    return this.instance as InstanceType<T>;
  }
}

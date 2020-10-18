import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import * as Interfaces from '../../interfaces';
import * as Enums from '../../enums';

@Component({
  selector: 'krix-object-value-preview',
  templateUrl: './object-value-preview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectValuePreviewComponent implements OnInit {
  public valueType: Enums.ValueTypes;

  get valueTypes (): typeof Enums.ValueTypes {
    return Enums.ValueTypes;
  }

  @Input('objectValueDescriptor')
  set inObjectValueDescriptor (value: Interfaces.ObjectValueDescriptor) {
    this.objectValueDescriptor = value;
    this.updateView();
    this.changeDetection.detectChanges();
  }
  private objectValueDescriptor: Interfaces.ObjectValueDescriptor;

  constructor (
    private changeDetection: ChangeDetectorRef,
  ) {
    this.changeDetection.detach();
  }

  ngOnInit (): void { }

  /**
   * Calculates a value type.
   */
  updateView (): void {
    this.valueType = this.getValueType(this.objectValueDescriptor.value);
  }

  /**
   * Returns a string representation of the value.
   *
   * @param  {any} value
   * @return {string}
   */
  getStringRepresentationOfPrimitiveValue (
    value: unknown,
  ): string {
    const valueType = this.getValueType(value);
    if (valueType === Enums.ValueTypes.Array) {
      return '[ ... ]';
    }

    if (valueType === Enums.ValueTypes.Object) {
      return '{ ... }';
    }

    if (valueType === Enums.ValueTypes.String) {
      return `"${value}"`;
    }

    if (valueType === Enums.ValueTypes.Null) {
      return 'null';
    }

    if (valueType === Enums.ValueTypes.Undefined) {
      return 'undefined';
    }

    if (valueType === Enums.ValueTypes.NaN) {
      return 'NaN';
    }

    return `${value}`;
  }

  /**
   * Returns the CSS color class by the value (its type).
   *
   * @param  {unknown} value
   * @return {string}
   */
  getColorClassName (
    value: unknown,
  ): string {
    const valueType = this.getValueType(value);

    switch (valueType) {
      case Enums.ValueTypes.Null:
      case Enums.ValueTypes.NaN:
      case Enums.ValueTypes.Undefined:
        return 'null-or-undefined';
      case Enums.ValueTypes.Number:
        return 'number';
      case Enums.ValueTypes.Array:
      case Enums.ValueTypes.Object:
        return 'object';
      case Enums.ValueTypes.String:
        return 'string';
      case Enums.ValueTypes.Boolean:
        return 'boolean';
    }
  }

  /**
   * Returns a type of the value.
   *
   * @param  {unknown} value
   * @return {Enums.ValueTypes}
   */
  getValueType (
    value: unknown,
  ): Enums.ValueTypes {
    if (_.isNull(value) === true) {
      return Enums.ValueTypes.Null;
    }
    if (_.isUndefined(value) === true) {
      return Enums.ValueTypes.Undefined;
    }
    if (_.isNaN(value) === true) {
      return Enums.ValueTypes.NaN;
    }

    if (_.isArray(value) === true) {
      return Enums.ValueTypes.Array;
    }

    if (_.isObject(value) === true) {
      return Enums.ValueTypes.Object;
    }

    if (_.isNumber(value) === true) {
      return Enums.ValueTypes.Number;
    }

    if (_.isString(value) === true) {
      return Enums.ValueTypes.String;
    }

    if (_.isBoolean(value) === true) {
      return Enums.ValueTypes.Boolean;
    }
  }
}

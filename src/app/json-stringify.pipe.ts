import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonStringify'
})
export class JsonStringifyPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return JSON.stringify(value);
  }

}

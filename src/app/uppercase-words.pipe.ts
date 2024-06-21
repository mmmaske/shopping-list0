import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercaseWords'
})
export class UppercaseWordsPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value.split(' ').map(function(word,index){
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }).join(' ');
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercaseWords'
})
export class UppercaseWordsPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {
    return value.split(' ').map(function(word:string,index:number){
        console.log(word);
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getPriorityColor'
})
export class GetPriorityColorPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    let color = 'badge-secondary';
    console.log(value);
    if(value=='extra high') {
        color = 'badge-danger';
    }
    else if(value=='high') {
        color = 'badge-warning';
    }
    else if(value=='medium') {
        color = 'badge-success';
    }
    else if(value=='low') {
        color = 'badge-info';
    }
    return color;
  }

}

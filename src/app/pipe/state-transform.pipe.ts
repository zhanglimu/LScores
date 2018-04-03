/**
 * Created by gaofeng on 2017/12/6.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'stateTransform'})
export class StateTransformPipe implements PipeTransform {
  transform(value: string | number): string {
    if (value === '1' || value === 1) {
      return '开';
    } else if (value === '2' || value === 2) {
      return '停';
    } else if (value === '3' || value === 3) {
      return '关';
    } else if (value === '4' || value === 4) {
      return '完';
    } else if (value === '5' || value === 5) {
      return '取';
    } else {
      return '-';
    }
  }
}

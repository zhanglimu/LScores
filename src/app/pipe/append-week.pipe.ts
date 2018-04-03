/**
 * Created by gaofeng on 2017/12/6.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'dateAppendWeek'})
export class DateAppendWeekPipe implements PipeTransform {
  transform(value: string): string {
    let week: string[] = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    return value + ' ' + week[new Date(value).getDay()]
  }
}

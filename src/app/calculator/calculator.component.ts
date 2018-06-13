import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import { ElMessageService } from 'element-angular';
import {CalcuService} from "../service/calculator.service";
import {GetMatchesArgs} from "../service/interfaces";
// import {Match, Event} from "../modules/match";
// import {MatchGroup} from "../modules/match-group";
// import {LeagueService} from "../service/league.service";
import {State} from "../modules/state";
import {LiveEvent} from "../modules/event";
import { Http } from '@angular/http'; // (1)
import 'rxjs/add/operator/map'; // (2)

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  // datashuju:string[];
  prematch:string[];
  prematchA:string[];
  prematchD:string[];
  inplay:string[];
  inplayA:string[];
  inplayD:string[];
  close:string[];
  closeA:string[];
  closeD:string[];
  exception:string[];
  exceptionA:string[];
  exceptionD:string[];
    constructor(private QUERY: CalcuService, private router: Router,private message: ElMessageService) {
      
      this.QUERY.getMatch().subscribe(data => {
        console.log(data,"111")
        // var dest: any = this.zuhe(data);
        // this.datashuju=data;

        this.prematch =data[0].prematch;
        console.log(this.prematch,"369")
        // this.prematchA =data[0].prematch.pool[0];
        // console.log(this.prematchA)
        // this.prematchD =data[0].prematch.pool[1].HHAD;
        this.inplay=data[1].inplay;
        // this.inplayA =data[1].inplay.pool[0].HAD;
        // this.inplayD =data[1].inplay.pool[1].HHAD;
        this.close=data[2].close;
        // this.closeA =data[2].close.pool[0].HAD;
        // this.closeD =data[2].close.pool[1].HHAD;
        this.exception=data[3].exception;
        // this.exceptionA =data[3].exception.pool[0].HAD;
        // this.exceptionD =data[3].exception.pool[1].HHAD;

        // var aa = [];
        // var bb = [];
        // var cc = [];
        // var dd = [];
        for (var i = 0; i < data[0].prematch.length; i++) {
          this.prematchA =  data[0].prematch[i].pool.HAD;
          this.prematchD =data[0].prematch[i].pool.HHAD;
        }
        for (var k = 0; k < data[1].inplay.length; k++) {
          // this.inplay =data[i].inplay;
          this.inplayA =  data[1].inplay[k].pool.HAD;
          this.inplayD =data[1].inplay[k].pool.HHAD;
          // for (var k = 0; k < data[i].inplay.length; k++) {
            // this.prematchB =data[i].prematch[k].pool;
            // for (var m = 0; m < a.length; m++) {
            //    var b=a[m].HAD;
            //   this.prematchA =data[0].prematch[i].pool[m].HAD;
              console.log(this.inplayA,"256")
            // }
          // }
          // aa.push(data[i].prematch);
          // bb.push(data[i].inplay);
          // cc.push(data[i].close);
          // dd.push(data[i].exception);
        }
        for (var m = 0; m < data[2].close.length; m++) {
          this.closeA =  data[2].close[m].pool.HAD;
          this.closeD =data[2].close[m].pool.HHAD;
        }
        for (var u = 0; u < data[3].exception.length; u++) {
          this.exceptionA =  data[3].exception[u].pool.HAD;
          this.exceptionD =data[3].exception[u].pool.HHAD;
        }
        // console.log(aa,"未开始")
        // console.log( bb,"进行中")
        // console.log(cc,"已结束")

      })
    }

    // getMyDay(date) {
		// 	var week;
		// 	if (date.getDay() == 0) week = "周日"
		// 	if (date.getDay() == 1) week = "周一"
		// 	if (date.getDay() == 2) week = "周二"
		// 	if (date.getDay() == 3) week = "周三"
		// 	if (date.getDay() == 4) week = "周四"
		// 	if (date.getDay() == 5) week = "周五"
		// 	if (date.getDay() == 6) week = "周六"
		// 	return week;
    // }
    
    ngOnInit() {

    }

//     zuhe(data) {
//       console.log(data)
// 			var map = {}, dest = [];
// 			for (var i = 0; i < data.length; i++) {
//         var ai = data[i].close;
//         for (var k = 0; k < ai.length; k++) {
//         // console.log(ai.matchDate)
// 					var id = ai[k].matchDate.toString().substring(0, 10);
// console.log(id,"4")
// 					var day = id.substring(0, 4) + "-" + id.substring(4, 6) + "-" + id.substring(6, 8)
// 					if (!map[id]) {
// 						dest.push({
// 							id: id,
// 							day: day,
// 							riqi: this.getMyDay(new Date(day)),
// 							data: [ai]
// 						});
// 						map[id] = ai;
// 					} else {
// 						for (var j = 0; j < dest.length; j++) {
// 							var dj = dest[j];
// 							if (dj.id == id) {
// 								dj.data.push(ai);
// 								break;
// 							}
// 						}
// 					}
// 				}
// 			}
// 			return dest;
// 		}
}
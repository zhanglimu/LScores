import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import { ElMessageService } from 'element-angular';
import {CalcuService} from "../service/calculator.service";
import {GetMatchesArgs} from "../service/interfaces";
// import {Match, Event} from "../modules/match";
// import {MatchGroup} from "../modules/match-group";
// import {LeagueService} from "../service/league.service";
// import * as $ from "jquery";
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

  info1:any;
  info2:any;
  info3:any;
  info4:any;
  info5:any;
  info6:any;
  info7:any;
  info8:any;
  info9:any;
  info10:any;
  info11:any;
  shuju:string[];
  //颜色的判断
  switchIndex :string;
  switchI:string;
  switchIn:string;
  switchInd:string;
    constructor(private QUERY: CalcuService, private router: Router,private message: ElMessageService) {
      //uniCode,state
      this.QUERY.getMatch().subscribe(data => {
        console.log(data,"111")
        // var dest: any = this.zuhe(data);
        // this.datashuju=data;

        this.close=data[2].close;
        // this.closeA =data[2].close.pool[0].HAD;
        // this.closeD =data[2].close.pool[1].HHAD;
        this.prematch =data[0].prematch;
        console.log(this.prematch,"369")
        // this.prematchA =data[0].prematch.pool[0];
        // console.log(this.prematchA)
        // this.prematchD =data[0].prematch.pool[1].HHAD;
        this.inplay=data[1].inplay;
        // this.inplayA =data[1].inplay.pool[0].HAD;
        // this.inplayD =data[1].inplay.pool[1].HHAD;
        this.exception=data[3].exception;
        // this.exceptionA =data[3].exception.pool[0].HAD;
        // this.exceptionD =data[3].exception.pool[1].HHAD;

        // for (var m = 0; m < data[2].close.length; m++) {
        //   this.closeA =  data[2].close[m].pool.HAD;
        //   this.closeD =data[2].close[m].pool.HHAD;
        //   console.log(this.closeA,"HAD")
        //   console.log(this.closeD,"让球")
        // }
        // for (var i = 0; i < data[0].prematch.length; i++) {
        //   this.prematchA =  data[0].prematch[i].pool.HAD;
        //   this.prematchD =data[0].prematch[i].pool.HHAD;
        // }
        // for (var k = 0; k < data[1].inplay.length; k++) {
        //   this.inplayA =  data[1].inplay[k].pool.HAD;
        //   this.inplayD =data[1].inplay[k].pool.HHAD;
        // }
        // for (var u = 0; u < data[3].exception.length; u++) {
        //   this.exceptionA =  data[3].exception[u].pool.HAD;
        //   this.exceptionD =data[3].exception[u].pool.HHAD;
        // }

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

//点击赔率
  cl(name,pool,i,matchCode,homeTeam,awayTeam,H,A,X,rang,F,G,T,M){
    console.log(i,name)
    if(name=="已结束" ){   
        this.switchIndex = pool=="HAD"? 'HAD'+M+i:'HHAD'+M+i;
        
    }else if(name=="进行中"){
      this.switchI = pool=="HAD"? 'HAD'+M+i:'HHAD'+M+i;
    }else if(name=="未开始"){
      this.switchIn = pool=="HAD"? 'HAD'+M+i:'HHAD'+M+i;
    }else{
      this.switchInd = pool=="HAD"? 'HAD'+M+i:'HHAD'+M+i;
    }
    console.log(matchCode,homeTeam,awayTeam,H,A,X,rang,F,G,T,M)
    localStorage.setItem("info1", matchCode);
    localStorage.setItem("info2", homeTeam);
    localStorage.setItem("info3", awayTeam);
    localStorage.setItem("info4", H);
    localStorage.setItem("info5", A);
    localStorage.setItem("info6", X);
    localStorage.setItem("info7", rang);
    localStorage.setItem("info8", F);
    localStorage.setItem("info9", G);
    localStorage.setItem("info10", T);
    localStorage.setItem("info11", M);
  }
  //计算跳转
  calcu(){
    this.info1 = localStorage.getItem("info1")
    this.info2 = localStorage.getItem("info2")
    this.info3 = localStorage.getItem("info3")
    this.info4 = localStorage.getItem("info4")
    this.info5 = localStorage.getItem("info5")
    this.info6 = localStorage.getItem("info6")
    this.info7 = localStorage.getItem("info7")
    this.info8 = localStorage.getItem("info8")
    this.info9 = localStorage.getItem("info9")
    this.info10 = localStorage.getItem("info10")
    this.info11 = localStorage.getItem("info11")
    // var url = "http://" + document.location.host + "/";

    window.location.href = './assets/reckoner/ticket.html?matchCode='+this.info1+'&homeTeam='+this.info2+'&awayTeam='+this.info3+'&H='+this.info4+'&A='+this.info5+'&X='+this.info6+'&rang='+this.info7+'&F='+this.info8+'&G='+this.info9+'&T='+this.info10+'&M='+this.info11;
console.log('reckon/ticket.html?matchCode='+this.info1+'&homeTeam='+this.info2+'&awayTeam='+this.info3+'&H='+this.info4+'&A='+this.info5+'&X='+this.info6+'&rang='+this.info7+'&F='+this.info8+'&G='+this.info9+'&T='+this.info10)

    console.log(this.info1,this.info2,this.info3,this.info4,this.info5,this.info6,this.info7,this.info8,this.info9,this.info10,this.info11,"000")
  }
}
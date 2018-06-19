import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import { ElMessageService } from 'element-angular';
import {CalcuService} from "../service/calculator.service";
import {GetMatchesArgs} from "../service/interfaces";
// import {Match, Event} from "../modules/match";
// import {MatchGroup} from "../modules/match-group";
// import {LeagueService} from "../service/league.service";
import * as $ from "jquery";
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
  public switchIndex: string = '0';
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

  yichang:boolean;

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
  info12:any;
  info13:any;
  shuju:string[];
  //颜色的判断
  switcha :string;
  switchb:string;
  switchc:string;
  switchg:string;
  private interval;
    constructor(private QUERY: CalcuService, private router: Router,private message: ElMessageService) {
      
      this.yichang=false;
      //uniCode,state
      var uniCode="";
      var state="";
      this.QUERY.getMatch().subscribe(data => {
        console.log(data,"111")
        this.close=data.close;
        this.prematch =data.prematch;
        this.inplay=data.inplay;
        if(data.exception.length>0){
          this.yichang=true;
          this.exception=data.exception;
        }else{
          this.yichang=false;
        }
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

  /**
   * 切换TAB
   * @param index
   */
  switch(index: string): void {
    this.switchIndex = index;
    localStorage.setItem('SWITCH_INDEX', this.switchIndex);
  }
    ngOnInit() {
      this.yichang=false;
      // this.interval = setInterval(() => {
      //   this.QUERY.getMatch().subscribe(data => {
      //     this.close=data.close;
      //     this.prematch =data.prematch;
      //     this.inplay=data.inplay;
      //     if(data.exception.length>0){
      //       this.yichang=true;
      //       this.exception=data.exception;
      //     }else{
      //       this.yichang=false;
      //     }
      //   })
      // }, 30000)
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
  cl(name,pool,i,matchCode,homeTeam,awayTeam,H,A,X,rang,F,G,T,M,uniCode){
    console.log(i,name)
    if(name=="已结束"){   
        this.switcha = pool=="HAD"? 'HAD'+M+i:'HHAD'+M+i;
        this.switchb ="0";
        this.switchc="0";
        this.switchg="0";
    }else if(name=="进行中"){
      this.switcha="0";
      this.switchb = pool=="HAD"? 'HAD'+M+i:'HHAD'+M+i;
      this.switchc="0";
      this.switchg="0";
    }else if(name=="未开始"){
      this.switcha="0";
      this.switchb ="0";
      this.switchc = pool=="HAD"? 'HAD'+M+i:'HHAD'+M+i;
      this.switchg="0";
    }else{
      this.switcha="0";
      this.switchb ="0";
      this.switchc="0";
      this.switchg = pool=="HAD"? 'HAD'+M+i:'HHAD'+M+i;
    }
    console.log(name,pool,i,matchCode,homeTeam,awayTeam,H,A,X,rang,F,G,T,M,uniCode,"888")
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
    localStorage.setItem("info12", uniCode);
    localStorage.setItem("info13", pool);
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
    this.info12 = localStorage.getItem("info12")
    this.info13 = localStorage.getItem("info13")
    // var url = "http://" + document.location.host + "/";

    window.location.href = './assets/reckoner/ticket.html?matchCode='+this.info1+'&homeTeam='+this.info2+'&awayTeam='+this.info3+'&H='+this.info4+'&A='+this.info5+'&X='+this.info6+'&rang='+this.info7+'&F='+this.info8+'&G='+this.info9+'&T='+this.info10+'&M='+this.info11+'&uniCode='+this.info12+'&pool='+this.info13;

    console.log(this.info1,this.info2,this.info3,this.info4,this.info5,this.info6,this.info7,this.info8,this.info9,this.info10,this.info11,this.info12,this.info13,"000")
  }
}
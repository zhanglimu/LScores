import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MatchService} from "../service/match.service";
import {GetMatchesArgs} from "../service/interfaces";
import {Match, Event} from "../modules/match";
import {MatchGroup} from "../modules/match-group";
import {LeagueService} from "../service/league.service";
import {State} from "../modules/state";
import {LiveEvent} from "../modules/event";

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit, OnDestroy {

  public isShowDialog: boolean = false;
  public isShowLoading: boolean = false;
  public isShowToast: boolean = false;
  public toastContent: string = '';
  public switchIndex: string = '0';
  public matchGroupInPlay: MatchGroup[] = [];
  public matchGroupOver: MatchGroup[] = [];
  public matchGroupNotBegin: MatchGroup[] = [];
  public matchInPlayTotal: number = 0;
  public matchOverTotal: number = 0;
  public matchNotBeginTotal: number = 0;
  // 无分组
  public matchesFollow: Match[] = [];
  // 提醒事件
  public events: LiveEvent[] = [];

  private followMatchIds: string[];
  private selectedLeagues: string[] | null;
  private queryParam: GetMatchesArgs;
  private leaguesLength: 0;
  private interval;

  constructor(private leagueService: LeagueService, private matchService: MatchService, private router: Router) {
  }

  ngOnInit(): void {
    this.initData();
    // 开启定时任务,30s刷新一次
    this.interval = setInterval(() => {
      this.getMatches();
    }, 30000);
  }

  ngOnDestroy() {
    // 关闭定时任务
    clearInterval(this.interval);
  }

  /**
   * 初始化数据
   */
  initData(): void {
    this.leaguesLength = 0;
    // 加载默认选中TAB
    if (localStorage.getItem('SWITCH_INDEX')) {
      this.switchIndex = localStorage.getItem('SWITCH_INDEX');
    }
    // 加载关注比赛列表
    this.followMatchIds = JSON.parse(localStorage.getItem('FOLLOW_MATCH_IDS')) ? JSON.parse(localStorage.getItem('FOLLOW_MATCH_IDS')) : [];
    // 加载缓存中的比赛列表
    this.matchGroupInPlay = JSON.parse(localStorage.getItem('MATCHES_INPLAY_DATA')) ? JSON.parse(localStorage.getItem('MATCHES_INPLAY_DATA')) : [];
    this.matchGroupOver = JSON.parse(localStorage.getItem('MATCHES_OVER_DATA')) ? JSON.parse(localStorage.getItem('MATCHES_OVER_DATA')) : [];
    this.matchGroupNotBegin = JSON.parse(localStorage.getItem('MATCHES_NOTBEGIN_DATA')) ? JSON.parse(localStorage.getItem('MATCHES_NOTBEGIN_DATA')) : [];
    this.matchesFollow = JSON.parse(localStorage.getItem('MATCHES_FOLLOW_DATA')) ? JSON.parse(localStorage.getItem('MATCHES_FOLLOW_DATA')) : [];
    // 加载缓存中比赛数量
    this.matchInPlayTotal = JSON.parse(localStorage.getItem('MATCHES_INPLAY_TOTAL'));
    this.matchOverTotal = JSON.parse(localStorage.getItem('MATCHES_OVER_TOTAL'));
    this.matchNotBeginTotal = JSON.parse(localStorage.getItem('MATCHES_NOTBEGIN_TOTAL'));
    // 清空上一次比赛状态缓存
    localStorage.removeItem('MATCH_LIVE_STATE');
    // 初始化关注状态
    this.initFollowStatus(this.matchGroupInPlay);
    this.initFollowStatus(this.matchGroupOver);
    this.initFollowStatus(this.matchGroupNotBegin);
    // 清空上一次比赛状态缓存
    localStorage.removeItem('MATCH_LIVE_STATE');
    // 加载查询联赛列表
    this.selectedLeagues = JSON.parse(localStorage.getItem('SELECTED_LEAGUES')) ? JSON.parse(localStorage.getItem('SELECTED_LEAGUES')) : [];
    if (this.selectedLeagues.length === 0) {
      this.leagueService
        .getLeagueList()
        .then(data => {
          data.map(group => {
            group.leagues.map(item => {
              this.selectedLeagues.push(item.name);
              item.selected = true;
              this.leaguesLength++;
            })
          });
          localStorage.setItem('SELECTED_LEAGUES', JSON.stringify(this.selectedLeagues));
          this.initMatches();
        });
    } else {
      this.leaguesLength = 0;
      JSON.parse(localStorage.getItem('LEAGUES')).map(group => {
        group.leagues.map(() => {
          this.leaguesLength++;
        })
      });
    }
    this.initMatches();
  }

  initMatches(): void {
    // 无缓存视为第一次加载
    if (this.matchGroupInPlay.length === 0 &&
      this.matchGroupOver.length === 0 &&
      this.matchGroupNotBegin.length === 0 &&
      this.matchesFollow.length === 0) {
      // 初始化请求数据
      this.getMatches(true);
    } else {
      // 联赛列表发生改变时刷新
      if (localStorage.getItem('LEAGUES_CHANGED') === '1') {
        localStorage.setItem('APP_INIT', '0');
        this.getMatches(true);
      } else {
        this.getMatches();
      }
      localStorage.removeItem('LEAGUES_CHANGED');
    }
  }

  /**
   * 从服务器获取比赛列表
   * @param mask
   */
  getMatches(mask?: boolean): void {
    if (mask) {
      this.isShowLoading = true;
    }
    // 时间范围
    let startTime = new Date();
    let endTime = new Date();
    startTime.setDate(startTime.getDate() - 3);
    endTime.setDate(endTime.getDate() + 4);
    // 组装查询条件
    this.queryParam = {
      startTime: this.formatDate(startTime),
      endTime: this.formatDate(endTime),
      leagues: (this.selectedLeagues && this.selectedLeagues.length !== this.leaguesLength) ? this.selectedLeagues.join(',') : ''
    }
    this.matchService.getMatchList(this.queryParam).then(data => {
      // 获取上次的展开状态
      let lastInPlayExpandStateMap = this.getExpandStateMap(this.matchGroupInPlay);
      let lastOverExpandStateMap = this.getExpandStateMap(this.matchGroupOver);
      let lastNotBeginExpandStateMap = this.getExpandStateMap(this.matchGroupNotBegin);
      // 清空历史比赛数据缓存
      this.matchGroupInPlay = [];
      this.matchGroupOver = [];
      this.matchGroupNotBegin = [];
      // this.matchesFollow = [];
      this.matchInPlayTotal = 0;
      this.matchOverTotal = 0;
      this.matchNotBeginTotal = 0;
      // 处理数据
      data.map(item => {
        // 过滤掉不在查询范围的数据
        if (this.queryParam.startTime > this.getDateFromId(item.matchId)) {
          return;
        }
        item.follow = false;
        if (this.followMatchIds && this.followMatchIds.indexOf(item.matchId) !== -1) {
          item.follow = true;
          this.matchesFollow = this.matchesFollow.filter(f => {
            return f.matchId !== item.matchId;
          })
          this.matchesFollow.push(item);
        }
        /*
         比赛状态描述
         TAB-0：进行中，中断（处于比赛时间内）
         TAB-1：未开赛，推迟（时间超过原定比赛时间【移至列表低端高亮显示】），中断（超出计划比赛完赛时间，如确定新开赛时间【状态变更】，如未确认开赛时间【移至列表低端高亮显示】）
         TAB-2：已完赛，取消，腰斩
         TAB-3：比赛按照进行中，未开始，已结束，偶发排序
         */
        switch (item.matchState) {
          case '进行中':
            this.pushMatch(this.matchGroupInPlay, item);
            this.matchInPlayTotal++;
            break;
          case '已完赛':
            this.pushMatch(this.matchGroupOver, item);
            this.matchOverTotal++;
            break;
          case '未开赛':
            this.pushMatch(this.matchGroupNotBegin, item);
            this.matchNotBeginTotal++;
            break;
          case '中断':
            // 比赛发生两小时后，移至最底端，高亮背景
            if (this.timeFn(item.matchDate.replace(/-/g, '/')) <= 2 * 60) {
              this.pushMatch(this.matchGroupInPlay, item);
              this.matchInPlayTotal++;
            } else {
              item.contingency = true;
              this.pushMatch(this.matchGroupNotBegin, item, true);
              this.matchNotBeginTotal++;
            }
            break;
          case '腰斩':
            this.pushMatch(this.matchGroupOver, item);
            this.matchOverTotal++;
            break;
          case '推迟':
            // 时间超过原定比赛时间，该比赛排列在未开始比赛的底部，并用颜色区分其他比赛
            if (new Date().getTime() > new Date(item.matchDate.replace(/-/g, '/')).getTime()) {
              if (this.timeFn(item.matchDate.replace(/-/g, '/')) > 38 * 60) {
                item.contingency = true;
                this.pushMatch(this.matchGroupOver, item, true);
                this.matchOverTotal++;
                break;
              }
              item.contingency = true;
              this.pushMatch(this.matchGroupNotBegin, item, true);
            } else {
              this.pushMatch(this.matchGroupNotBegin, item);
            }
            this.matchNotBeginTotal++;
            break;
          case '待定':
            // 时间超过原定比赛时间，该比赛排列在未开始比赛的底部，并用颜色区分其他比赛
            if (new Date().getTime() > new Date(item.matchDate.replace(/-/g, '/')).getTime()) {
              item.contingency = true;
              this.pushMatch(this.matchGroupNotBegin, item, true);
            } else {
              this.pushMatch(this.matchGroupNotBegin, item);
            }
            this.matchNotBeginTotal++;
            break;
          case '取消':
            this.pushMatch(this.matchGroupOver, item);
            this.matchOverTotal++;
            break;
        }
      });
      // 判断是否需要后台加载
      if (!localStorage.getItem('SWITCH_INDEX') && this.matchGroupInPlay.length === 0) {
        if (this.matchGroupNotBegin.length === 0) {
          this.switchIndex = '2';
        } else {
          this.switchIndex = '1';
        }
        localStorage.setItem('SWITCH_INDEX', this.switchIndex);
      }
      // 数据排序
      this.sortGroup(this.matchGroupInPlay);
      this.sortGroup(this.matchGroupOver);
      this.sortGroup(this.matchGroupNotBegin, 'ASC');
      this.sortFollows(this.matchesFollow);
      // 设置展开状态
      this.setMatchGroupExpandState(this.matchGroupInPlay, lastInPlayExpandStateMap);
      this.setMatchGroupExpandState(this.matchGroupOver, lastOverExpandStateMap);
      this.setMatchGroupExpandState(this.matchGroupNotBegin, lastNotBeginExpandStateMap);
      // 缓存比赛数据
      localStorage.setItem('MATCHES_INPLAY_DATA', JSON.stringify(this.matchGroupInPlay));
      localStorage.setItem('MATCHES_OVER_DATA', JSON.stringify(this.matchGroupOver));
      localStorage.setItem('MATCHES_NOTBEGIN_DATA', JSON.stringify(this.matchGroupNotBegin));
      localStorage.setItem('MATCHES_FOLLOW_DATA', JSON.stringify(this.matchesFollow));
      // 缓存比赛条目数据
      localStorage.setItem('MATCHES_INPLAY_TOTAL', JSON.stringify(this.matchInPlayTotal));
      localStorage.setItem('MATCHES_OVER_TOTAL', JSON.stringify(this.matchOverTotal));
      localStorage.setItem('MATCHES_NOTBEGIN_TOTAL', JSON.stringify(this.matchNotBeginTotal));
      // 加载彩Ex系统比赛状态
      this.getGroupLiveState(this.matchGroupOver);
      this.getGroupLiveState(this.matchGroupNotBegin);
      this.getGroupLiveState(this.matchGroupInPlay);
      this.getMatchLiveState(this.matchesFollow, true);
      // 隐藏Loading
      if (mask) {
        this.isShowLoading = false;
      }
    }).catch(() => {
      if (mask) {
        this.isShowLoading = false;
      }
    });
  }

  /**
   * 获取上次的展开状态
   * @param matchGroups
   * @returns {{}}
   */
  getExpandStateMap(matchGroups: MatchGroup[]): any {
    let map = {};
    matchGroups.map(group => {
      map[group.matchDate] = group.isExpanded;
    });
    return map;
  }

  /**
   * 比赛分组设置展开状态
   * @param matchGroups
   * @param expandStateMap
   */
  setMatchGroupExpandState(matchGroups: MatchGroup[], expandStateMap: any): void {
    matchGroups.map(group => {
      group.isExpanded = typeof (expandStateMap[group.matchDate]) === 'undefined' ? true : expandStateMap[group.matchDate];
    })
  }

  /**
   * 获取彩Ex系统中比赛状态
   */
  getGroupLiveState(matchGroups: MatchGroup[]): void {
    matchGroups.map(group => {
      this.getMatchLiveState(group.matches);
    })
  }

  getMatchLiveState(matches: Match[], isFollow?: boolean): void {
    let CACHE_KEY = 'MATCH_LIVE_STATE';
    if (isFollow) {
      CACHE_KEY = 'FOLLOW_MATCH_LIVE_STATE'
    }
    if (matches.length !== 0) {
      let codes = [];
      matches.map(item => codes.push(item.matchCode));
      this.matchService.getMatchInPlayState(codes).then(res => {
        // 加载上次的比赛状态缓存
        let cacheLiveState = JSON.parse(localStorage.getItem(CACHE_KEY)) ? JSON.parse(localStorage.getItem(CACHE_KEY)) : {};
        let tempEvents: LiveEvent[] = [];
        for (let i = 0; i < matches.length; i++) {
          // 更新数据
          let liveState: State = new State(res[i]);
          if (liveState.liveMatchTime) {
            matches[i].liveMatchTime = liveState.liveMatchTime;
          } else {
            switch (matches[i].matchState) {
              case '已完赛':
                matches[i].liveMatchTime = '完';
                break;
              case '未开赛':
                matches[i].liveMatchTime = '未';
                break;
              case '中断':
                matches[i].liveMatchTime = '中断';
                break;
              case '腰斩':
                matches[i].liveMatchTime = '腰斩';
                break;
              case '推迟':
                matches[i].liveMatchTime = '推迟';
                break;
              case '待定':
                matches[i].liveMatchTime = '待定';
                break;
              case '取消':
                matches[i].liveMatchTime = '取消';
                break;
              default:
                matches[i].liveMatchTime = matches[i].matchState;
                break;
            }
          }
          matches[i].homeScore = liveState.homeScore;
          matches[i].awayScore = liveState.awayScore;
          matches[i].awayYellowCard = liveState.awayYellowCard;
          matches[i].awayRedCard = liveState.awayRedCard;
          matches[i].homeYellowCard = liveState.homeYellowCard;
          matches[i].homeRedCard = liveState.homeRedCard;
          matches[i].homeScoreHalf = liveState.homeScoreHafu;
          matches[i].awayScoreHalf = liveState.awayScoreHafu;
          matches[i].hadstate = liveState.hadstate;
          matches[i].hhadstate = liveState.hhadstate;
          matches[i].crsstate = liveState.crsstate;
          matches[i].hafustate = liveState.hafustate;
          matches[i].ttgstate = liveState.ttgstate;
          // 比赛事件
          let lastState = cacheLiveState[liveState.matchCode];
          matches[i].events = [];
          // 只添加进行中比赛的事件
          if (lastState && Number(liveState.liveMatchTime) > 0) {
            let eventLv = 0;
            if (liveState.homeScore > lastState.homeScore) {
              matches[i].events.push(Event.HomeGoal);
              eventLv = 1;
            }
            if (liveState.homeScore < lastState.homeScore) {
              matches[i].events.push(Event.HomeDisallowedGoal);
            }
            if (liveState.awayScore > lastState.awayScore) {
              matches[i].events.push(Event.AwayGoal);
              eventLv = 1;
            }
            if (liveState.awayScore < lastState.awayScore) {
              matches[i].events.push(Event.AwayDisallowedGoal);
            }
            if (liveState.homeRedCard > lastState.homeRedCard) {
              matches[i].events.push(Event.HomeRedCard);
              if (eventLv === 0) eventLv = 2;
              if (eventLv === 1) eventLv = 3;
            }
            if (liveState.awayRedCard > lastState.awayRedCard) {
              matches[i].events.push(Event.AwayRedCard);
              if (eventLv === 0) eventLv = 2;
              if (eventLv === 1) eventLv = 3;
            }
            if (eventLv > 0) {
              let event: LiveEvent = new LiveEvent({
                homeScore: matches[i].homeScore,
                awayScore: matches[i].awayScore,
                liveMatchTime: liveState.liveMatchTime,
                homeRedCard: matches[i].events.indexOf(Event.HomeRedCard) !== -1,
                homeGoal: matches[i].events.indexOf(Event.HomeGoal) !== -1,
                awayRedCard: matches[i].events.indexOf(Event.AwayRedCard) !== -1,
                awayGoal: matches[i].events.indexOf(Event.AwayGoal) !== -1,
                homeName: matches[i].homeName,
                awayName: matches[i].awayName,
                eventLv: eventLv
              });
              tempEvents.push(event);
            }
            // 判断认证图标显示(0:不显示，1左侧显示，2右侧显示, 3同时显示)
            // liveState(0:caiex,1:default)
            if (liveState.scoreState === 0) {
              if (liveState.homeScore !== lastState.homeScore && liveState.awayScore === lastState.awayScore) {
                matches[i].scoreState = 1;
              } else if (liveState.homeScore === lastState.homeScore && liveState.awayScore !== lastState.awayScore) {
                matches[i].scoreState = 2;
              } else if (liveState.homeScore !== lastState.homeScore && liveState.awayScore !== lastState.awayScore) {
                matches[i].scoreState = 3;
              } else {
                if (lastState.scoreState === 0) {
                  matches[i].scoreState = 1;
                } else {
                  matches[i].scoreState = lastState.scoreState;
                }
              }
            } else {
              matches[i].scoreState = 0;
            }
          } else {
            matches[i].scoreState = 0;
          }
          // 保存此次比赛状态
          cacheLiveState[liveState.matchCode] = liveState;
        }
        // 缓存此次的比赛状态
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheLiveState));
        // 显示提示
        if (this.switchIndex === '0' && tempEvents.length > 0) {
          tempEvents.sort((a, b) => {
            return a.eventLv - b.eventLv;
          });
          this.events = tempEvents;
          setTimeout(() => {
            this.events = [];
          }, 5000);
        }
      });
    }
  }

  /**
   * 关注
   * @param match
   */
  onFollow(match: Match): void {
    if (match.follow) {
      this.followMatchIds.push(match.matchId);
      this.matchesFollow.push(match);
      this.sortFollows(this.matchesFollow);
      this.toastContent = '关注成功';
      this.isShowToast = true;
      setTimeout(() => {
        this.isShowToast = false;
      }, 1000);
    } else {
      this.cancelRawFollow(this.matchGroupInPlay, match.matchId);
      this.cancelRawFollow(this.matchGroupNotBegin, match.matchId);
      this.cancelRawFollow(this.matchGroupOver, match.matchId);
      this.sortFollows(this.matchesFollow);
      this.matchesFollow = this.matchesFollow.filter(item => item.matchId !== match.matchId);
      this.followMatchIds.splice(this.followMatchIds.indexOf(match.matchId), 1);
      this.toastContent = '取消成功';
      this.isShowToast = true;
      setTimeout(() => {
        this.isShowToast = false;
      }, 1000);
    }
    localStorage.setItem('FOLLOW_MATCH_IDS', JSON.stringify(this.followMatchIds));
    localStorage.setItem('MATCHES_FOLLOW_DATA', JSON.stringify(this.matchesFollow));
  }

  /**
   * 取消源数据中的关注
   * @param matchGroup
   */
  cancelRawFollow(matchGroup: MatchGroup[], matchId: string): void {
    matchGroup.map(group => {
      group.matches.map(match => {
        if (match.matchId === matchId) {
          match.follow = false;
        }
      })
    })
  }

  /**
   * 跳转选择联赛页面
   */
  gotoLeague(): void {
    this.router.navigate(['/leagues']);
  }

  /**
   * 跳转比赛详情页面
   * @param match
   */
  gotoDetail(match: Match): void {
    localStorage.setItem('ACTIVE_MATCH', JSON.stringify(match));
    this.router.navigate(['/match-detail']);
  }

  /**
   * 切换TAB
   * @param index
   */
  switch(index: string): void {
    this.switchIndex = index;
    localStorage.setItem('SWITCH_INDEX', this.switchIndex);
  }

  /**
   * 判断比赛列表显示高度是否能撑满除footer之外的区域
   * @param contentRef
   * @param listSize
   * @returns {boolean}
   */
  applyMinHeight(contentRef: any, adRef: any, listSize: number): boolean {
    return listSize === 0;
    // return contentRef.offsetHeight > 100 * listSize + 146 + adRef.offsetHeight;
  }

  // /**
  //  * 点击分组标题置顶
  //  * @param listRef
  //  * @param titleRef
  //  */
  // scrollTop(listRef: any, titleRef: any): void {
  //   listRef.scrollBy(0, titleRef.offsetTop - listRef.scrollTop)
  // }

  /**
   * 展开|收起分组
   * @param matchGroup
   */
  expandGroup(matchGroup: MatchGroup): void {
    matchGroup.isExpanded = !matchGroup.isExpanded;
  }

  /**
   * 向比赛分组中插入新数据，比赛日期不存在时创建新分组
   * @param matchGroup
   * @param match
   */
  private pushMatch(matchGroup: MatchGroup[], match: Match, event?: boolean): void {
    let newKey = true;
    let groupKey = event ? '' : this.getDateFromId(match.matchId);
    matchGroup.map(item => {
      if (item.matchDate === groupKey) {
        item.matches.push(match);
        newKey = false;
      }
    })
    if (newKey) {
      matchGroup.push(new MatchGroup(groupKey, []));
      matchGroup.map(item => {
        if (item.matchDate === groupKey) {
          item.matches.push(match);
        }
      })
    }
  }

  /**
   * 分组排序
   * @param matchGroup
   * @param sort
   */
  private sortGroup(matchGroup: MatchGroup[], sort?: string): void {
    matchGroup.sort((a, b) => {
      if (a.matchDate === '') {
        return 1;
      } else if (b.matchDate === '') {
        return -1;
      } else {
        if (sort === 'ASC') {
          if (a.matchDate < b.matchDate) {
            return -1;
          } else if (a.matchDate > b.matchDate) {
            return 1;
          } else {
            return 0;
          }
        } else {
          if (a.matchDate < b.matchDate) {
            return 1;
          } else if (a.matchDate > b.matchDate) {
            return -1;
          } else {
            return 0;
          }
        }
      }
    });
    matchGroup.map(group => {
      this.sortMatches(group.matches);
    })
  }

  /**
   * 排序比赛
   * @param matches
   */
  private sortMatches(matches: Match[]): void {
    matches.sort((a, b) => {
      if (a.matchDate < b.matchDate) {
        return -1;
      } else if (a.matchDate > b.matchDate) {
        return 1;
      } else {
        if (a.matchCode < b.matchCode) {
          return -1;
        } else if (a.matchCode > b.matchCode) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  }

  /**
   * 单独对关注比赛排序
   * @param matches
   */
  private sortFollows(matches: Match[]): void {
    matches.sort((a, b) => {
      let aLv: number = this.getSortLevel(a);
      let bLv: number = this.getSortLevel(b);
      if (aLv === bLv) {
        if (a.matchDate < b.matchDate) {
          return -1;
        } else if (a.matchDate > b.matchDate) {
          return 1;
        } else {
          if (a.matchCode < b.matchCode) {
            return -1;
          } else if (a.matchCode > b.matchCode) {
            return 1;
          } else {
            return 0;
          }
        }
      } else {
        if (aLv < bLv) {
          return -1;
        } else if (aLv > bLv) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  }

  /**
   * 计算比赛排序权重（大的在后）
   * @param match
   * @returns {number}
   */
  private getSortLevel(match: Match): number {
    let level = 1;
    if (match.contingency) level = 4;
    if (match.matchState === '进行中') level = 1 > level ? 1 : level;
    if (match.matchState === '未开赛') level = 2 > level ? 2 : level;
    if (match.matchState === '已完赛') level = 3 > level ? 3 : level;
    return level;
  }

  /**
   * 初始化比赛关注状态
   * @param matchGroup
   */
  private initFollowStatus(matchGroup: MatchGroup[]): void {
    matchGroup.map(group => {
      group.matches.map(item => {
        item.follow = false;
        if (this.followMatchIds && this.followMatchIds.indexOf(item.matchId) !== -1) {
          item.follow = true;
        }
      })
    });
  }

  /**
   * 格式化日期
   * @param date
   * @returns {string}
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day);
  }

  /**
   * 从比赛ID中获取分组日期
   * @param matchId
   * @returns {string}
   */
  private getDateFromId(matchId: string): string {
    return matchId.toString().substring(0, 4) + '-' + matchId.toString().substring(4, 6) + '-' + matchId.toString().substring(6, 8);
  }

  /**
   * 计算时间差多少分钟
   * @param dateStr
   */
  private timeFn(dateStr: string): number {
    return (new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60);
  }
}

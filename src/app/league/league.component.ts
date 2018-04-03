import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {LeagueGroup} from "../modules/league-group";
import {LeagueService} from "../service/league.service";
import {League} from "../modules/league";

@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss']
})
export class LeagueComponent implements OnInit {

  public lgList: LeagueGroup[];
  public lgListLength: number = 0;
  public selectedAll: boolean = false;
  public leagues: string[] = [];

  constructor(private leagueService: LeagueService,
              private location: Location) {
  }

  ngOnInit(): void {
    this.leagues = JSON.parse(localStorage.getItem('SELECTED_LEAGUES')) ? JSON.parse(localStorage.getItem('SELECTED_LEAGUES')) : [];
    this.leagueService
      .getLeagueList()
      .then(data => {
        this.lgList = data;
        this.lgList.forEach(leagues => {
          this.lgListLength += leagues.leagues.length;
        })
        this.selectedAll = this.leagues.length === this.lgListLength;
      });
  }

  onSwitch(): void {
    this.selectedAll = !this.selectedAll;
    this.leagues = [];
    this.lgList.forEach(leagues => {
      leagues.leagues.map(item => {
        item.selected = this.selectedAll
        if (this.selectedAll) {
          this.leagues.push(item.name);
        }
      })
    });
    localStorage.setItem('SELECTED_LEAGUES', JSON.stringify(this.leagues))
  }

  onSelect(league: League): void {
    league.selected = !league.selected;
    if (league.selected) {
      if (this.leagues.indexOf(league.name) === -1) {
        this.leagues.push(league.name);
      }
    } else {
      this.leagues.splice(this.leagues.indexOf(league.name), 1);
    }
    console.log(this.leagues.length)
    this.selectedAll = this.leagues.length === this.lgListLength;
  }

  cancel(): void {
    this.location.back();
  }

  confirm(): void {
    if (this.leagues.length > 0) {
      let changed = localStorage.getItem('SELECTED_LEAGUES') !== JSON.stringify(this.leagues) ? '1' : '0';
      localStorage.setItem('SELECTED_LEAGUES', JSON.stringify(this.leagues));
      localStorage.setItem('LEAGUES_CHANGED', changed);
      this.location.back();
    }
  }
}

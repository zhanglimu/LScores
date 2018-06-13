import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule}    from '@angular/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {LeagueComponent} from './league/league.component';
import {LeagueService} from './service/league.service';
import {WeUIModule} from 'angular4-weui';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatchesComponent} from './matches/matches.component';
import {MatchDetailComponent} from './match-detail/match-detail.component';
import {MatchItemComponent} from './match-item/match-item.component';
import {MatchService} from './service/match.service';

import {DateAppendWeekPipe} from './pipe/append-week.pipe'
import {StateTransformPipe} from './pipe/state-transform.pipe';
import {ToastComponent} from './toast/toast.component';

import { ElModule } from 'element-angular';
import {CalculatorComponent} from './calculator/calculator.component';
import {CalcuService} from './service/calculator.service';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    WeUIModule,
    ElModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    LeagueComponent,
    MatchesComponent,
    MatchDetailComponent,
    MatchItemComponent,
    DateAppendWeekPipe,
    StateTransformPipe,
    ToastComponent,
    CalculatorComponent
  ],
  providers: [LeagueService, MatchService,CalcuService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

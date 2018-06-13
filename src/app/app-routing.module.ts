import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {LeagueComponent} from "./league/league.component";
import {MatchesComponent} from "./matches/matches.component";
import {MatchDetailComponent} from "./match-detail/match-detail.component";
import {CalculatorComponent} from './calculator/calculator.component';

const appRoutes: Routes = [
  {path: 'leagues', component: LeagueComponent},
  {path: 'matches', component: MatchesComponent},
  {path: 'match-detail', component: MatchDetailComponent},
  {path: 'calculator', component: CalculatorComponent},
  {path: '', redirectTo: '/calculator', pathMatch: 'full'},
  {path: '**', component: CalculatorComponent}
];

@NgModule({
  imports: [
    // RouterModule.forRoot(appRoutes)
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false,
        useHash: true
      } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}

// bootstrap the demo
var demo = new Vue({
  el: '#information',
  data: {
    gridColumns: ['api_id', 'home_team', 'away_team', 'league', 'match_time', 'odds_type', 'update_time', 'home_odds', 'line', 'away_odds'],
    matchCode: '',
    homeTeam: '',
    awayTeam: '',
    homeOdds: '',
    drawOdds: '',
    awayOdds: '',
    hhadLine: '',
    fOdds: '',
    gOdds: '',
    tOdds: '',
    mOpt: '',
    betOpts: []
  },
  mounted () {
    this.matchCode = this.getUrlKey('matchCode')
    this.homeTeam = this.getUrlKey('homeTeam')
    this.awayTeam = this.getUrlKey('awayTeam')
    this.homeOdds = this.getUrlKey('H')
    this.drawOdds = this.getUrlKey('X')
    this.awayOdds = this.getUrlKey('A')
    this.hhadLine = this.getUrlKey('rang')
    this.fOdds = this.getUrlKey('F')
    this.gOdds = this.getUrlKey('G')
    this.tOdds = this.getUrlKey('T')
    this.mOpt = this.getUrlKey('M')
    this.uniCode = this.getUrlKey('uniCode')
    this.pool = this.getUrlKey('pool')

    this.initOptionState(this.mOpt)
  },
  methods: {
    getUrlKey:function(name){
      return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
    },
    // init: option style change
    initOptionState:function(ii) {
      betOpts = document.getElementById('information').getElementsByTagName('button');
    	// let ii = 2
      for(var i = 0;i<betOpts.length;i++){
    		if(betOpts[i].id == ii){
    			betOpts[i].className = 'btn btn-danger'
    		} else {
    			betOpts[i].className = 'btn btn-default'
    		}
    	}
    }
  }
})

import Player from 'boccia-types/lib/Player'
import {Match} from 'boccia-types/lib/match'
import {GClass, gclass} from 'boccia-types/lib/GClass'
import Vue from 'vue'
import Vuex from 'vuex'
import { ipcRenderer, systemPreferences } from "electron";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    players: <[Player | null, Player | null]>[null, null],
    gclass: <gclass> <unknown>GClass.classes[0],
    times: <[number[], number[]]>[[0, 0, 0, 0], [0, 0, 0, 0]],
    score: <[number[], number[]]>[[0, 0, 0, 0], [0, 0, 0, 0]],
    referee: '',
    refereeTimer: '',

    cortId: 1,
  },
  getters: {
    players: state => {
      return state.players
    },
    gclass: state => {
      return state.gclass
    },
    totalScore: state => {
      return state.score
        .map(numbers => {
          let i = 0
          numbers.forEach(element => {
            i += element
          });
          return i
        })
    },
    match: state => {
      const match : Match = {
        cortId: state.cortId,
        players: [state.players[0]!.id, state.players[1]!.id],
        gclass: state.gclass,
        score: state.score,
        referee: state.referee,
        refereeTimer: state.refereeTimer
      };
      return match
    }
  },
  mutations: {
    setPlayers(state, players: [Player, Player]) {
      state.players[0] = players[0];
      state.players[1] = players[1];
    },
    setGClass(state, gclass: gclass) {
      state.gclass = gclass
    },
    resetScore(state) {
      state.score = [[], []]
      for (let i = 0; i < 4; i++) {
        state.score[0][i] = 0;
        state.score[1][i] = 0;
      }
    },
    incScore(state, data: { end: number, score: [number, number] }) {

      state.score[0][data.end] += data.score[0]
      state.score[1][data.end] += data.score[1]
    },
    setReferee(state, referee: string) {
      state.referee = referee;
    },
    setRefereeTimer(state, referee: string) {
      state.refereeTimer = referee;
    },
    setCort(state, cortId:number)
    {
      console.log(cortId);
      
      state.cortId=cortId
    }
  },
  actions: {
    setPlayers({ commit, state }, players: [Player, Player]) {

      commit('setPlayers', players)
      if (players[0]) commit('setGClass', players[0].gclass)
      ipcRenderer.send('asynchronous-message', 'players', players)
    },

    resetScore({ commit, getters }) {
      commit('resetScore');
      ipcRenderer.send('asynchronous-message', 'score', getters.totalScore)
    },
    incScore({ commit, getters }, data: { end: number, score: [number, number] }) {
      commit('incScore', data)
      ipcRenderer.send('asynchronous-message', 'score', getters.totalScore)

    },

    reset({ commit, state }) {
      this.dispatch('setPlayers', [null, null])
      commit('setGClass', null)
      commit('setRefereee', '')
      commit('setRefereeeTimer', '')
      this.dispatch('resetScore')
    }
  },
  modules: {
  }
})

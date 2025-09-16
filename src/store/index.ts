import Player from "boccia-types/lib/Player";
import { Match } from "boccia-types/lib/Match";
import { GClass, gclass } from "boccia-types/lib/GClass";
import Vue from "vue";
import Vuex from "vuex";
import { ipcRenderer } from "electron";
import { TimerTypes } from "./TimerTypes";
import { TIMECOOFS } from "./TIMECOOFS";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    players: <[Player | null, Player | null]>[null, null],
    gclass: <gclass>GClass.classes[0],
    times: <[number[], number[]]>[
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    tieTimes: [0, 0],
    tieScore: [false, false],
    score: <[number[], number[]]>[
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    referee: "",
    refereeTimer: "",
    cortId: 1,
    end: <number | "tie">0,
    oneMinuteTimer: 0,
    tenMinutesTimer: 0,
    group: "A",
    groupStep: true,
    semi: 8,
  },
  getters: {
    players: (state) => {
      return state.players;
    },
    gclass: (state) => {
      return state.gclass;
    },
    totalScore: (state) => {
      return state.score.map((numbers) => {
        let i = 0;
        numbers.forEach((element) => {
          i += element;
        });
        return i;
      });
    },
    match: (state) => {
      const score = state.score.map((arr, index) => ({
        playyerIndex: <0 | 1>index,
        score: arr,
      }));
      const time = state.times.map((arr, index) => ({
        playyerIndex: <0 | 1>index,
        time: arr,
      }));

      const match: Match = {
        cortId: state.cortId,
        players: [state.players[0]!.id, state.players[1]!.id],
        gclass: state.gclass,
        score: [score[0], score[1]],
        referee: state.referee,
        refereeTimer: state.refereeTimer,
        end: state.end,
        time: [time[0], time[1]],
        group: state.group,
        tieScore: [state.tieScore[0], state.tieScore[1]],
        groupStep: state.groupStep,
        semi: state.semi.toString(),
      };
      return match;
    },
    timers: ({ times, tenMinutesTimer, oneMinuteTimer, gclass }) => {
      return {
        times: times.map((playerTimes) => {
          return playerTimes.map((num) => {
            return TIMECOOFS[gclass] - num;
          });
        }),
        oneMinuteTimer: 60 - oneMinuteTimer,
        tenMinutesTimer: 600 - tenMinutesTimer,
      };
    },
    endTime: ({ gclass }) => {
      return TIMECOOFS[gclass];
    },
    endTimes: ({ times, end, tieTimes }) => {
      if (end != "tie") return [times[0][end], times[1][end]];
      else return [tieTimes[0], tieTimes[1]];
    },
    endScores: ({ end, score, tieScore }) => {
      if (end != "tie") return [score[0][end], score[1][end]];
      else return [tieScore[0], tieScore[1]];
    },
  },
  mutations: {
    setPlayers(state, players: [Player, Player]) {
      state.players[0] = players[0];
      state.players[1] = players[1];
    },
    setGClass(state, gclass: gclass) {
      if (gclass === "ТBC1/BC2") {
        if (state.score[0].length === 4) {
          state.score[0].push(0);
          state.score[1].push(0);
          state.times[0].push(0);
          state.times[1].push(0);
          state.score[0].push(0);
          state.score[1].push(0);
          state.times[0].push(0);
          state.times[1].push(0);
        }
      }
      state.gclass = gclass;
    },
    resetScore(state) {
      // state.score = [[], []]
      for (let i = 0; i < (state.gclass === "ТBC1/BC2" ? 6 : 4); i++) {
        Vue.set(state.score[0], i, 0);
        Vue.set(state.score[1], i, 0);
      }
      state.tieScore = [false, false];
    },
    resetTimer(state) {
      // state.score = [[], []]
      for (let i = 0; i < (state.gclass === "ТBC1/BC2" ? 6 : 4); i++) {
        Vue.set(state.times[0], i, 0);
        Vue.set(state.times[1], i, 0);
      }
      state.oneMinuteTimer = 0;
      state.tenMinutesTimer = 0;
      state.tieTimes = [0, 0];
    },
    setScore(
      state,
      data: { end: number | "tie"; playerId: 0 | 1; value: number }
    ) {
      if (data.end != "tie")
        Vue.set(state.score[data.playerId], state.end, data.value);
      else Vue.set(state.tieScore, data.playerId, !!data.value);
      console.log(data.value, data.end, state.tieScore[data.playerId]);
    },
    setReferee(state, referee: string) {
      state.referee = referee;
    },
    setRefereeTimer(state, referee: string) {
      state.refereeTimer = referee;
    },
    setCort(state, cortId: number) {
      state.cortId = cortId;
    },
    setTimerValue(
      state,
      { value, typeTimer }: { value: number; typeTimer: TimerTypes }
    ) {
      switch (typeTimer) {
        case "warmup":
          state.oneMinuteTimer = value;
          break;
        case "technical":
          state.tenMinutesTimer = value;
          break;
        case "red":
          if (state.end != "tie") Vue.set(state.times[0], state.end, value);
          else Vue.set(state.tieTimes, 0, value);
          break;
        case "blue":
          if (state.end != "tie") {
            Vue.set(state.times[1], state.end, value);
          } else {
            Vue.set(state.tieTimes, 1, value);
          }
          break;
        case "takingBalls":
          state.oneMinuteTimer = value;
      }
    },
    setEnd(state, end: number | "tie") {
      state.end = end;
    },
    setGroup(state, group: string) {
      state.group = group;
    },
    setGroupStep(state, groupStep: boolean) {
      state.groupStep = groupStep;
    },
    setSemi(state, semi: number) {
      state.semi = semi;
    },
  },
  actions: {
    setPlayers({ commit, state }, players: [Player, Player]) {
      commit("setPlayers", players);
      if (players[0]) commit("setGClass", players[0].gclass);
      ipcRenderer.send("asynchronous-message", "players", players);
    },

    resetScore({ commit, getters }) {
      commit("resetScore");
      ipcRenderer.send("asynchronous-message", "score", getters.totalScore);
    },

    resetTimer({ commit, getters }) {
      commit("resetTimer");
      ipcRenderer.send("asynchronous-message", "timer", {
        timers: getters.timers,
        typeTimer: "warmup",
      });
    },
    setScore(
      { commit, getters },
      data: { end: number; score: [number, number] }
    ) {
      commit("setScore", data);
      ipcRenderer.send("asynchronous-message", "score", getters.totalScore);
    },
    setTimerValue(
      { commit, getters },
      { value, typeTimer }: { value: number; typeTimer: TimerTypes }
    ) {
      commit("setTimerValue", { value, typeTimer });
      ipcRenderer.send("asynchronous-message", "timer", {
        timers: getters.timers,
        typeTimer,
      });
    },
    setEnd({ commit, state }, end: number | "tie") {
      commit("setEnd", end);
      ipcRenderer.send("asynchronous-message", "end", state.end);
    },
    reset({ commit, state, dispatch }) {
      dispatch("setPlayers", [null, null]);
      commit("setGClass", null);
      commit("setReferee", "");
      commit("setRefereeTimer", "");
      dispatch("resetScore");
      dispatch("resetTimer");
      dispatch("setEnd", 0);
      commit("setGroup", "A");
      commit("setGroupStep", true);
      commit("setSemi", 8);
      ipcRenderer.send("asynchronous-message", "reset");
    },
    openFinish({ getters }) {
      ipcRenderer.send("asynchronous-message", "protocol", getters.match);
    },
  },
  modules: {},
});

<template>
  <main>
    <div v-if="protocol" class="protocol">
      <protocol :match="protocol"></protocol>
    </div>
    <div v-else class="main">
      <div v-if="solo">
        <section class="solo">
          <h1 class="time">{{ $utils.secondsToString(soloTime) }}</h1>
        </section>
      </div>
      <div v-else>
        <section>
          <h6>{{ rname }}</h6>
          <h1>{{ rscore }}</h1>
          <h1 class="time">{{ $utils.secondsToString(rtime) }}</h1>
        </section>
        <div class="ends">
          <ul>
            <li v-if="tiebreak" class="tiebreak">T</li>
            <li
              v-else
              v-for="n in maxEnds"
              :class="{ pasted: end > n - 1, current: end == n - 1 }"
              :key="n"
            ></li>
          </ul>
        </div>
        <section class="blue">
          <h6>{{ bname }}</h6>

          <h1>{{ bscore }}</h1>
          <h1 class="time">{{ $utils.secondsToString(btime) }}</h1>
        </section>
      </div>
    </div>
  </main>
</template>


<script lang="ts">
import { Match } from "boccia-types/lib/Match";
import { ipcRenderer } from "electron";
import { Component, Vue } from "vue-property-decorator";
import { TimerTypes } from "./store/TimerTypes";
import Protocol from "./components/Protocol.vue";

@Component({
  components: {
    Protocol,
  },
})
export default class SideDisplay extends Vue {
  rscore = 0;
  bscore = 0;
  rtime = 0;
  btime = 0;
  soloTime = 0;
  solo = true;
  end = 0;
  maxEnds = 4;
  tiebreak = false;
  rname = "";
  bname = "";
  protocol: Match | null = null;
  mounted() {
    ipcRenderer.on("asynchronous-message", (event, type, data) => {
      if (type === "players") {
        this.rname = data[0] != null ? data[0].fullName : "";
        this.bname = data[1] != null ? data[1].fullName : "";
      }
      if (type === "score") {
        this.rscore = data[0];
        this.bscore = data[1];
      }

      if (type === "end") {
        if (data === "tie") this.tiebreak = true;
        else this.end = data;
      }
      if (type === "timer") {
        const typeTimer = <TimerTypes>data.typeTimer;
        const timers = data.timers;
        if (typeTimer === "red" || typeTimer === "blue") {
          this.solo = false;
          this.rtime = timers.times[0][this.end];
          this.btime = timers.times[1][this.end];
        } else {
          this.solo = true;
          this.soloTime =
            typeTimer === "warmup" || typeTimer === "takingBalls"
              ? data.timers.oneMinuteTimer
              : data.timers.tenMinutesTimer;
        }
      }
      if (type === "protocol") {
        console.log(data);

        this.protocol = <Match>data;
      }
      if (type === "reset") {
        this.protocol = null;
      }
    });
  }
}
</script>

<style scoped>
.main {
  color: #fff;
}
.protocol {
  font-size: 4vh;
}

section {
  height: 100vh;
  width: 50vw;
  position: absolute;
  background: #600;
}

.blue {
  background: #006 !important;
  right: 0;
}

.solo {
  background-color: #000;
  width: 100vw;
}

h1 {
  --font: 30vh;
  display: block;
  position: absolute;
  text-align: center;
  width: 100%;
  font-size: var(--font);
}
.time {
  top: calc(50% - var(--font) / 2);
}
.ends {
  position: fixed;
  bottom: 0vh;
  left: 0;
  width: 100vw;
  height: 16vh;
  background: #000;

  z-index: 1;
}
ul {
  padding: 0;
  list-style: none;
  text-align: center;
}
li {
  display: inline-block;
  margin: 0 2vw 0 2vw;

  width: 16vh;
  height: 16vh;
  border-radius: 8vh;
  border: 1vh solid white;
  background-color: white;
}
.pasted {
  background-color: #2f2b2b;
}
.current {
  background-color: red;
}
.tiebreak {
  font-size: 5vw;
  color: red;
}
</style>

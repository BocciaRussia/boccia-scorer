<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-flex xs10 class="mt-3">
      <v-card v-if="$store.state.players.includes(null)">
        <v-card-title primary-title> Игроки не указаны </v-card-title>
      </v-card>
      <v-card v-else>
        <v-card-text>
          <v-select :items="ends" v-model="end" label="Энд"></v-select>
        </v-card-text>
        <v-card-actions class="justify-center" v-if="end != 1">
          <timer v-model="takingBalls" :maxValue="takingBallsTime" :title="'Сбор мячей'" />
        </v-card-actions>
        <v-card-actions class="justify-center" v-if="end != 1">
          <v-btn color="success" outlined @click="switchToTimers"
            >Мячи собраны</v-btn
          >
        </v-card-actions>

        <v-card-text>
          <v-layout>
            <v-flex align-center xs6>
              <v-container>
                <h1 class="player-label">
                  {{
                    $utils.shortName($store.state.players[1].fullName) ||
                    "Синие"
                  }}
                </h1>
                <timer
                  @start="$refs.redTimer.pause()"
                  ref="blueTimer"
                  v-model="blueTime"
                  :maxValue="endTime"
                  :color="'blue'"
                ></timer>
                <v-flex align-center v-if="!tiebreak">
                  <v-btn @click="bscore--">-</v-btn>
                  <v-btn disabled>{{ bscore }}</v-btn>
                  <v-btn @click="bscore++">+</v-btn>
                </v-flex>

                <v-flex v-else>
                  <h3>Победа</h3>
                  <input type="checkbox" v-model="bscore" />
                </v-flex>
                <v-text-field placeholder="Нарушения синих" />
              </v-container>
            </v-flex>
            <v-flex align-center xs6>
              <v-container>
                <h1 class="player-label">
                  {{
                    $utils.shortName($store.state.players[0].fullName) ||
                    "Красные"
                  }}
                </h1>
                <timer
                  @start="$refs.blueTimer.pause()"
                  ref="redTimer"
                  v-model="redTime"
                  :maxValue="endTime"
                  :color="'red'"
                ></timer>
                <v-flex align-center justify-center v-if="!tiebreak">
                  <v-btn @click="rscore--">-</v-btn>
                  <v-btn disabled>{{ rscore }}</v-btn>
                  <v-btn @click="rscore++">+</v-btn>
                </v-flex>

                <v-flex v-else>
                  <h3>Победа</h3>
                  <input type="checkbox" v-model="rscore" />
                </v-flex>
                <v-text-field placeholder="Нарушения синих" />
              </v-container>
            </v-flex>
          </v-layout>
          <p id="ZMbut">
            Z - запуск/пауза красного таймера, M - запуск/пауза синего таймера
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="end < ends.length"
            @click="sendEnd"
            :disabled="!isEnteredScore"
            >Отправить энд.</v-btn
          >
          <v-btn v-else to="/finish" :disabled="!isEnteredScore"
            >Завершить игру.</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Timer from "../components/Timer.vue";
import { ConfigManager } from "../utils/ConfigManager";

// Локальное определение для оффлайн версии
const GClass = {
  classes: ["BC1F", "BC1M", "BC2F", "BC2M", "BC3F", "BC3M", "BC4F", "BC4M", "ПВС3", "ПВС4", "ТВС1/ВС2"]
};

@Component({
  components: {
    Timer,
  },
})
export default class Ends extends Vue {
  get tiebreak() {
    return this.end === "tie";
  }
  get takingBalls() {
    return this.$store.state.oneMinuteTimer;
  }
  set takingBalls(value: number) {
    this.$store.dispatch("setTimerValue", { value, typeTimer: "takingBalls" });
  }
  get redTime() {
    return this.$store.getters.endTimes[0];
  }
  set redTime(value: number) {
    this.$store.dispatch("setTimerValue", { value, typeTimer: "red" });
  }
  get blueTime() {
    return this.$store.getters.endTimes[1];
  }
  set blueTime(value: number) {
    this.$store.dispatch("setTimerValue", { value, typeTimer: "blue" });
  }
  get endTime() {
    return this.$store.getters.endTime;
  }

  get rscore() {
    return this.$store.getters.endScores[0];
  }
  set rscore(value: number) {
    this.$store.dispatch("setScore", { end: this.end, playerId: 0, value });
  }
  get bscore() {
    return this.$store.getters.endScores[1];
  }
  set bscore(value: number) {
    this.$store.dispatch("setScore", { end: this.end, playerId: 1, value });
  }
  get end(): number | "tie" {
    return this.$store.state.end === "tie" ? "tie" : this.$store.state.end + 1;
  }
  set end(value: number | "tie") {
    this.takingBalls = 0;

    this.$store.dispatch("setEnd", value == "tie" ? value : value - 1);
  }
  get ends() {
    const ends: (number | "tie")[] =
      this.$store.state.gclass === "ТВС1/ВС2"
        ? [1, 2, 3, 4, 5, 6]
        : [1, 2, 3, 4];
    if (
      this.$store.getters.totalScore[0] === this.$store.getters.totalScore[1]
    ) {
      ends[ends.length] = ("tie");
    } 
    return ends;
  }
  get isEnteredScore() {
    console.log(this.rscore, this.bscore);

    return this.rscore > 0 || this.bscore > 0;
  }
  
  get takingBallsTime(): number {
    const configManager = ConfigManager.getInstance();
    return configManager.getTakingBallsTime();
  }
  switchToTimers() {
    this.$store.dispatch("setTimerValue", {
      value: this.redTime,
      typeTimer: "red",
    });
  }

  async sendEnd() {
    const confirm = await this.$dialog.confirm({
      title: "Отправить энд?",
      text: `Вы уверены в том, что счет энда: 🔴 ${this.rscore} - ${this.bscore} 🔵?`,
    });
    if (confirm) {
      // Убрано: отправка данных энда на сервер
      if (
        typeof this.end === "number" && this.end < (this.$store.state.gclass === "ТBC1/BC2" ? 6 : 4)
      )
        this.end++;
      if (typeof this.end === "number" && this.ends[this.end] === "tie")
        this.end = "tie";
    }
  }
}
</script>
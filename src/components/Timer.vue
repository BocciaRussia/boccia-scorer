<template>
  <v-container align="center">
    <v-row>
      <v-col>
        <h1 align="center">{{ $utils.secondsToString(time) }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-progress-linear
        :value="(time / maxValue) * 100"
        height="25"
      ></v-progress-linear>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-btn rounded @click="inc">-</v-btn>
        <v-btn color="success" @click="start" v-if="!timerId">Запустить</v-btn>
        <v-btn color="warning" @click="pause" v-else>Остановить</v-btn>
        <v-btn color="error" @click="reset">Сбросить</v-btn>
        <v-btn rounded @click="dec">+</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({})
export default class Timer extends Vue {
  @Prop({ required: true }) value = 0;
  @Prop({ required: true }) maxValue = 60;
  timerId: number | null = null;
  get time(): number {
    return this.maxValue - this.value;
  }

  start() {
    if (this.timerId != null) return;
    this.timerId = window.setTimeout(() => {
      this.timerId = null;
      this.start();
      this.tick();
    }, 1000);
  }
  pause() {
    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = null;
  }
  reset() {
    this.pause();
    this.$emit("input", 0);
  }
  tick() {
    this.$emit("input", this.value + 1);
    if (this.value + 1 >= this.maxValue) {
      this.pause();
    }
  }
  inc() {
    if (this.value + 1 < this.maxValue) this.$emit("input", this.value + 1);
  }
  dec() {
    if (this.value > 0) this.$emit("input", this.value - 1);
  }
}
</script>
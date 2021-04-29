<template>
  <v-container align="center">
    <v-row v-if="title">
      <v-col>
        <h2 align="center">{{ title }}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h1 align="center">{{ $utils.secondsToString(time) }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-progress-linear
        :value="(time / maxValue) * 100"
        height="12"
        :color="color"
      ></v-progress-linear>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-btn rounded outlined @click="inc">-</v-btn>
        <v-btn color="success" outlined @click="start" v-if="!timerId"
          >Запустить</v-btn
        >
        <v-btn color="warning" outlined @click="pause" v-else>Остановить</v-btn>
        <v-btn color="error" outlined @click="reset">Сбросить</v-btn>
        <v-btn rounded outlined @click="dec">+</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({})
export default class Timer extends Vue {
  @Prop({ required: true }) value!: number;
  @Prop({ required: true }) maxValue!: number;
  @Prop() title: string | undefined;
  @Prop({ default: "black" }) color: string | undefined;
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
    this.$emit("start");
  }
  pause() {
    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = null;
  }
  async reset() {
    this.pause();
    if (
      await this.$dialog.confirm({
        title: "Сбросить?",
        text: "Вы хотите сбросить?",
      })
    )
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
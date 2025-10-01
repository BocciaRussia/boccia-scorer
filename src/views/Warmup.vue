<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-flex xs10 class="mt-3">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col>
              <timer v-model="time" :maxValue="warmupTime" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn primary router to="/">Поправить информацию об игроках</v-btn>
          <v-spacer></v-spacer>
          <v-btn primary router to="/ends">К эндам</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Timer from "../components/Timer.vue";
import { ConfigManager } from "../utils/ConfigManager";

@Component({
  components: {
    Timer,
  },
})
export default class Warmup extends Vue {
  get time(): number {
    return this.$store.state.warmupTimer;
  }
  set time(value: number) {
    this.$store.dispatch("setTimerValue", { value, typeTimer: "warmup" });
  }
  
  get warmupTime(): number {
    const configManager = ConfigManager.getInstance();
    return configManager.getWarmupTime();
  }
}
</script>

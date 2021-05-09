<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-flex>
      <v-card>
        <v-card-title><h1>Протокол игры</h1></v-card-title>
        <v-card-text align="center">
          <protocol :match="match" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="send()">Завершить матч</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { ServerAPI } from "@/ServerAPI";
import { Component, Vue } from "vue-property-decorator";
import Protocol from "../components/Protocol.vue";

@Component({
  components: {
    Protocol,
  },
})
export default class Finish extends Vue {
  get match() {
    return this.$store.getters.match;
  }
  mounted() {
    this.$store.dispatch("openFinish");
  }
  async send() {
    const confirm = await this.$dialog.confirm({
      title: "Завершить матч?",
      text: `Вы уверены, что хотите завершить матч?`,
    });
    if (!confirm) return;
    const code = await this.$dialog.prompt({
      title: "Введите код",
    });
    if (code === "2007") {
      await ServerAPI.instance.sendMatch();
    }
  }
}
</script>
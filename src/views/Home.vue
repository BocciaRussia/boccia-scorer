<template>
  <div class="home">
    <v-layout row wrap justify-center id="wrapper">
      <v-flex xs10 class="mt-3">
        <v-card>
          <v-card-text>
            <v-subheader>
              Добро пожаловать на корт, пожалуйста, введите нужную информацию.
            </v-subheader>
            <v-form>
              <v-select
                :items="itemClasses"
                v-model="gameclass"
                label="Класс игры"
              ></v-select>
              <div v-if="!offlineMode">
                <v-select
                  label="Имя игрока, который играет красными 🔴"
                  v-model="players[0]"
                  :items="itemPlayers"
                  :rules="[checkClasses]"
                  @change="playerChanged"
                />
                <v-select
                  label="Имя игрока, который играет синими 🔵"
                  v-model="players[1]"
                  :items="itemPlayers"
                  :rules="[checkClasses]"
                  @change="playerChanged"
                />
              </div>
              <div v-else>
                <v-text-field
                  label="Имя игрока, который играет красными 🔴"
                  v-model="players[0].fullName"
                  @change="nameChanged"
                />
                <v-text-field
                  label="Имя игрока, который играет синими 🔵"
                  v-model="players[1].fullName"
                  @change="nameChanged"
                />
              </div>
              <v-select
                :items="[1, 2, 3, 4, 5, 6, 7, 8]"
                v-model="cort"
                label="Корт"
              ></v-select>
              <v-select
                :items="stepItems"
                v-model="groupStep"
                label="Этап"
              ></v-select>
              <v-text-field
                label="Группа"
                v-model="group"
                v-if="groupStep"
              ></v-text-field>
              <v-text-field
                v-else
                label="1/... финала"
                type="number"
                v-model="semi"
              ></v-text-field>
              <v-text-field label="Имя судьи на корте 🏓" v-model="referee">
              </v-text-field>
              <v-text-field
                label="Имя судьи на счетчике 🖥"
                v-model="refereeTimer"
              >
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn primary @click="resetMatch()">Обнулить счетчик</v-btn>
            <v-spacer></v-spacer>
            <v-btn primary router @click="go()">К разминке</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { ServerAPI } from "../ServerAPI";
import { Component, Vue } from "vue-property-decorator";
import Player from "boccia-types/lib/Player";
import { ipcRenderer } from "electron";
import { GClass, gclass } from "boccia-types/lib/GClass";

@Component({
  components: {},
})
export default class Home extends Vue {
  allPlayers: Player[] = [];
  players: [Player | null, Player | null] = this.$store.state.players;
  get gameclass(): gclass | null {
    return this.$store.state.gclass;
  }
  set gameclass(value: gclass | null) {
    this.$store.commit("setGClass", value);
  }
  get referee() {
    return this.$store.state.referee;
  }
  set referee(value: string) {
    this.$store.commit("setReferee", value);
  }
  get refereeTimer() {
    return this.$store.state.refereeTimer;
  }
  set refereeTimer(value: string) {
    this.$store.commit("setRefereeTimer", value);
  }

  get cort() {
    return this.$store.state.cortId;
  }
  set cort(value: number) {
    console.log(value);

    this.$store.commit("setCort", value);
  }

  get group() {
    return this.$store.state.group;
  }
  set group(value: string) {
    this.$store.commit("setGroup", value);
  }
  get groupStep() {
    return this.$store.state.groupStep;
  }
  set groupStep(value: boolean) {
    this.$store.commit("setGroupStep", value);
  }
  get semi() {
    return this.$store.state.semi;
  }
  set semi(value: string) {
    this.$store.commit("setSemi", value);
  }

  offlineMode = false;
  get itemPlayers() {
    return this.allPlayers
      .filter((player) => player.gclass === this.gameclass)
      .map((player) => {
        return {
          text: player.fullName,
          value: player,
        };
      })
      .sort((a, b) => a.text.localeCompare(b.text));
  }

  get itemClasses() {
    return GClass.classes;
  }
  mounted() {
    ServerAPI.instance
      .getPlayers()
      .then((players) => {
        this.allPlayers = players;
        this.offlineMode = false;
      })
      .catch((err) => {
        this.offlineMode = true;
        this.players = [new Player(), new Player()];
      });
  }
  nameChanged(name: string) {
    this.$store;
  }
  playerChanged(player: Player) {
    // this.gameclass = player.gclass;
    if (!this.players.includes(null)) {
      this.$store.dispatch("setPlayers", this.players);
    }
  }
  resetMatch() {
    this.$store.dispatch("reset");
  }
  async go() {
    try {
      if (this.players[0] == null) throw new Error("Красный игрок не указан");
      if (this.players[1] == null) throw new Error("Синий игрок не указан");
      if (this.cort == null) throw new Error("Корт не указан");
      if (this.referee == null) throw new Error("Судья не указан");
      if (this.refereeTimer == null)
        throw new Error("Судья на счетчике не указан");
    } catch (error) {
      this.$dialog.error({
        title: "Не всё заполнил",
        text: error.message,
      });
      return;
    }
    const confirm = await this.$dialog.confirm({
      title: "Начать матч?",
      text: `Вы уверены, что хотите начать матч между ${this.players[0].fullName} и ${this.players[1].fullName}? `,
    });
    if (!confirm) return;
    const code = await this.$dialog.prompt({
      title: "Введите код",
    });
    if (code === "2007") {
      if (!this.offlineMode) {
        ServerAPI.instance.startMatch();
      }
      this.$router.push("/warmup");
    } else {
      this.$dialog.error({
        title: "Неверный код",
      });
    }
  }
  checkClasses() {
    if (!this.players[0] || !this.players[1]) return true;

    return (
      this.players[0].gclass === this.gameclass &&
      this.players[1].gclass === this.gameclass
    );
  }
  stepItems = [
    { text: "Групповой", value: true },
    { text: "Плей-офф", value: false },
  ];
}
</script>

<template>
  <div>
    <table>
      <tbody>
        <tr>
          <td
            v-for="(player, index) in match.players"
            :key="player"
            style="width: 50%"
          >
            <h1 v-if="$store.state.players[0]">
              {{ $utils.shortName($store.state.players[index].fullName) }}
            </h1>

            <table>
              <thead>
                <tr>
                  <th
                    v-for="graph in index === 0 ? graphs : regraphs"
                    :key="graph.key"
                  >
                    {{ graph.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(score, ind) in match.score[index].score" :key="ind">
                  <td
                    v-for="graph in index == 0 ? graphs : regraphs"
                    :key="graph.key"
                  >
                    {{
                      (graph.handler || ((v) => v))(
                        graph.key === "index"
                          ? ind
                          : array[graph.key][index][ind]
                      )
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
        <tr v-if="isTiebreak">
          <td>{{ match.tieScore[0] ? "✅" : "❌" }}</td>
          <td>Тай-брейк</td>
          <td>{{ match.tieScore[1] ? "✅" : "❌" }}</td>
        </tr>
        <tr v-else>
          <td>
            <h2>
              {{ totalScore[0] }}
            </h2>
          </td>
          <td>
            <h2>
              {{ totalScore[1] }}
            </h2>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
 
 <script lang="ts">
import utils from "@/utils";
import { Match } from "../types/Match";
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({})
export default class Protocol extends Vue {
  @Prop() match: Match | undefined;
  get graphs() {
    return [
      { name: "Энд", key: "index", handler: (i: number) => i + 1 },
      { name: "Счет", key: "score" },
      { name: "Время", key: "time", handler: utils.secondsToString },
    ];
  }

  get array() {
    if (!this.match) return undefined;
    return {
      score: this.match.score.map((holder) => holder.score),
      time: this.match.time.map((holder) => holder.time),
    };
  }

  get regraphs() {
    return this.graphs.slice().reverse();
  }
  get isTiebreak() {
    if (!this.match) return false;
    return this.match.tieScore.includes(true);
  }
  get totalScore() {
    return this.match!.score.map((score) =>
      score.score.reduce((a, b) => a + b)
    );
  }
}
</script>
 <style scoped>
table {
  width: 100%;
}
table,
th,
td {
  border: 1px solid black;
}
td {
  text-align: center;
}
</style>

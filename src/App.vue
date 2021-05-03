<template>
  <v-app>
    <v-navigation-drawer permanent app >
      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to?item.to:'/'">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

        <v-footer>
                <h1 class="player-label blue">{{$store.getters.totalScore[1]+($store.state.tieScore[1]?'T':'')}}</h1>
                <h1 class="player-label red">{{$store.getters.totalScore[0]+($store.state.tieScore[0]?'T':'')}}</h1>
        </v-footer>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title>Счетчик бочча</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import router from "./router";

@Component({})
export default class App extends Vue {
  drawer = false
  items = router.getRoutes()
  .map(route=>{
    return {
      title: route.name,
      to: route.path,
      icon:''
    }
  })
}
</script>
<style>
/* Global CSS */
.player-label {
  width: 50%;
  text-align: center;
}
</style>

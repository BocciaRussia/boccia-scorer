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

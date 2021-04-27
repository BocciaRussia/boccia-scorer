<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-flex xs10 class="mt-3">
      <v-card>
        <v-card-text>
            
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Timer from "../components/Timer.vue";

@Component({
  components: {
    Timer,
  },
})
export default class Ends extends Vue {
}
</script>
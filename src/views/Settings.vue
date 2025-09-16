<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-flex xs10 class="mt-3">
      <v-card>
        <v-card-title>
          <h2>Настройки времени</h2>
        </v-card-title>
        
        <v-card-text>
          <v-tabs v-model="activeTab" centered>
            <v-tab>Общие настройки</v-tab>
            <v-tab>Время по классам</v-tab>
          </v-tabs>
          
          <v-tabs-items v-model="activeTab">
            <!-- Общие настройки -->
            <v-tab-item>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="warmupTime"
                      label="Время разминки (секунды)"
                      type="number"
                      :rules="[rules.positive]"
                      @change="updateWarmupTime"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="takingBallsTime"
                      label="Время сбора мячей (секунды)"
                      type="number"
                      :rules="[rules.positive]"
                      @change="updateTakingBallsTime"
                    />
                  </v-col>
                </v-row>
                
                <v-row>
                  <v-col cols="12">
                    <v-btn 
                      color="primary" 
                      @click="saveGeneralSettings"
                      :loading="saving"
                    >
                      Сохранить общие настройки
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
            
            <!-- Время по классам -->
            <v-tab-item>
              <v-container>
                <v-row v-for="(time, gclass) in classTimes" :key="gclass">
                  <v-col cols="12" md="8">
                    <v-text-field
                      :label="`${gclass} (секунды)`"
                      :value="time"
                      type="number"
                      :rules="[rules.positive]"
                      @input="updateClassTime(gclass, $event)"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-chip color="info" text-color="white">
                      {{ formatTime(time) }}
                    </v-chip>
                  </v-col>
                </v-row>
                
                <v-row>
                  <v-col cols="12">
                    <v-btn 
                      color="primary" 
                      @click="saveClassTimes"
                      :loading="saving"
                    >
                      Сохранить настройки классов
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="resetToDefaults">
            Сбросить к умолчаниям
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ConfigManager } from "../utils/ConfigManager";
import { gclass } from "boccia-types/lib/GClass";

@Component({})
export default class Settings extends Vue {
  activeTab = 0;
  saving = false;
  
  warmupTime = 120;
  takingBallsTime = 60;
  classTimes: { [key in gclass]: number } = {} as any;
  
  rules = {
    positive: (value: number) => value > 0 || "Значение должно быть больше 0"
  };

  async mounted() {
    await this.loadSettings();
  }

  async loadSettings() {
    try {
      const configManager = ConfigManager.getInstance();
      const config = configManager.getConfig();
      
      this.warmupTime = config.warmupTime;
      this.takingBallsTime = config.takingBallsTime;
      this.classTimes = { ...config.classTimes };
    } catch (error) {
      console.error("Ошибка загрузки настроек:", error);
      this.$dialog.notify.error("Не удалось загрузить настройки");
    }
  }

  async saveGeneralSettings() {
    this.saving = true;
    try {
      const configManager = ConfigManager.getInstance();
      await configManager.setWarmupTime(this.warmupTime);
      await configManager.setTakingBallsTime(this.takingBallsTime);
      
      this.$dialog.notify.success("Общие настройки сохранены");
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      this.$dialog.notify.error("Не удалось сохранить настройки");
    } finally {
      this.saving = false;
    }
  }

  async saveClassTimes() {
    this.saving = true;
    try {
      const configManager = ConfigManager.getInstance();
      
      for (const [gclass, time] of Object.entries(this.classTimes)) {
        await configManager.setClassTime(gclass as gclass, time);
      }
      
      this.$dialog.notify.success("Настройки классов сохранены");
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      this.$dialog.notify.error("Не удалось сохранить настройки");
    } finally {
      this.saving = false;
    }
  }

  updateClassTime(gclass: gclass, value: string) {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      this.classTimes[gclass] = numValue;
    }
  }

  updateWarmupTime() {
    if (this.warmupTime <= 0) {
      this.warmupTime = 120;
    }
  }

  updateTakingBallsTime() {
    if (this.takingBallsTime <= 0) {
      this.takingBallsTime = 60;
    }
  }

  async resetToDefaults() {
    const confirmed = await this.$dialog.confirm({
      title: "Сбросить настройки?",
      text: "Все настройки времени будут сброшены к значениям по умолчанию. Продолжить?"
    });
    
    if (confirmed) {
      try {
        const configManager = ConfigManager.getInstance();
        await configManager.createDefaultConfig();
        await this.loadSettings();
        this.$dialog.notify.success("Настройки сброшены к умолчаниям");
      } catch (error) {
        console.error("Ошибка сброса:", error);
        this.$dialog.notify.error("Не удалось сбросить настройки");
      }
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
</script>

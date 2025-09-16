import { ipcRenderer } from "electron";
import { gclass } from "boccia-types/lib/GClass";

export interface TimerConfig {
  warmupTime: number; // время разминки в секундах
  takingBallsTime: number; // время сбора мячей в секундах
  classTimes: {
    [key in gclass]: number;
  };
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: TimerConfig | null = null;
  private configPath = "";

  private constructor() {
    // Singleton constructor
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public async initialize(): Promise<void> {
    try {
      // Получаем путь к папке Документы
      const documentsPath = await ipcRenderer.invoke("get-documents-path");
      this.configPath = `${documentsPath}/timer.json`;
      
      // Пытаемся загрузить конфиг
      await this.loadConfig();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Ошибка инициализации конфига:", error);
      // Создаем дефолтный конфиг
      await this.createDefaultConfig();
    }
  }

  private async loadConfig(): Promise<void> {
    try {
      const configData = await ipcRenderer.invoke("read-config", this.configPath);
      this.config = JSON.parse(configData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Конфиг не найден, создаем дефолтный");
      await this.createDefaultConfig();
    }
  }

  public async createDefaultConfig(): Promise<void> {
    this.config = {
      warmupTime: 120, // 2 минуты
      takingBallsTime: 60, // 1 минута
      classTimes: {
        BCM1: 270, // 4.5 минуты
        BCW1: 270,
        BCM2: 210, // 3.5 минуты
        BCW2: 210,
        BCM3: 360, // 6 минут
        BCW3: 360,
        BCM4: 210, // 3.5 минуты
        BCW4: 210,
        BCM5: 240, // 4 минуты
        BCW5: 240,
        "ПBC3": 420, // 7 минут
        "ПBC4": 240, // 4 минуты
        "ПBC5": 300, // 5 минут
        "ТBC1/BC2": 300 // 5 минут
      }
    };
    
    await this.saveConfig();
  }

  public async saveConfig(): Promise<void> {
    if (!this.config) return;
    
    try {
      await ipcRenderer.invoke("write-config", this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Ошибка сохранения конфига:", error);
      throw error;
    }
  }

  public getConfig(): TimerConfig {
    if (!this.config) {
      throw new Error("Конфиг не инициализирован");
    }
    return this.config;
  }

  public async updateConfig(updates: Partial<TimerConfig>): Promise<void> {
    if (!this.config) {
      throw new Error("Конфиг не инициализирован");
    }
    
    this.config = { ...this.config, ...updates };
    await this.saveConfig();
  }

  public getWarmupTime(): number {
    return this.getConfig().warmupTime;
  }

  public getTakingBallsTime(): number {
    return this.getConfig().takingBallsTime;
  }

  public getClassTime(gclass: gclass): number {
    return this.getConfig().classTimes[gclass];
  }

  public async setWarmupTime(time: number): Promise<void> {
    await this.updateConfig({ warmupTime: time });
  }

  public async setTakingBallsTime(time: number): Promise<void> {
    await this.updateConfig({ takingBallsTime: time });
  }

  public async setClassTime(gclass: gclass, time: number): Promise<void> {
    const config = this.getConfig();
    await this.updateConfig({
      classTimes: {
        ...config.classTimes,
        [gclass]: time
      }
    });
  }
}

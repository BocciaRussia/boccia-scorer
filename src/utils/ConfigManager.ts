import { ipcRenderer } from "electron";

// Реальные классы из API
export type ApiGClass = 
  | "BC1F" | "BC1M" 
  | "BC2F" | "BC2M" 
  | "BC3F" | "BC3M" 
  | "BC4F" | "BC4M"
  | "ПВС3" | "ПВС4" 
  | "ТВС1/ВС2";


export interface TimerConfig {
  warmupTime: number; // время разминки в секундах
  takingBallsTime: number; // время сбора мячей в секундах
  classTimes: {
    [key in ApiGClass]: number;
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
        BC1F: 300, // 5 минут
        BC1M: 300, // 5 минут
        BC2F: 300, // 5 минут
        BC2M: 300, // 5 минут
        BC3F: 360, // 6 минут
        BC3M: 360, // 6 минут
        BC4F: 300, // 5 минут
        BC4M: 300, // 5 минут
        "ПВС3": 420, // 7 минут
        "ПВС4": 300, // 5 минут
        "ТВС1/ВС2": 300 // 5 минут
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

  public getClassTime(gclass: ApiGClass): number {
    return this.getConfig().classTimes[gclass];
  }

  public async setWarmupTime(time: number): Promise<void> {
    await this.updateConfig({ warmupTime: time });
  }

  public async setTakingBallsTime(time: number): Promise<void> {
    await this.updateConfig({ takingBallsTime: time });
  }

  public async setClassTime(gclass: ApiGClass, time: number): Promise<void> {
    const config = this.getConfig();
    await this.updateConfig({
      classTimes: {
        ...config.classTimes,
        [gclass]: time
      }
    });
  }
}

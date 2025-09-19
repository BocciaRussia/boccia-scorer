// Типы игроков на основе данных из API
export interface Player {
  id: number;
  name: string;
  gender: 'male' | 'female';
  birthday: string;
  gclass: string;
  team_gclass: string;
  region: string;
}

// Дополнительные поля для отображения
export interface PlayerDisplay extends Player {
  fullName: string;
}

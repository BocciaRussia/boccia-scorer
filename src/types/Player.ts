// Типы игроков для оффлайн версии
export interface Player {
  id: number;
  name: string;
  gender: 'male' | 'female';
  birthday: string;
  gclass: string;
  team_gclass: string;
  region: string;
  fullName: string;
}

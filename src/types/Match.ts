import { ApiGClass } from '../utils/ConfigManager';

// Типы для матча
export interface Match {
  cortId: number;
  players: [number, number];
  gclass: ApiGClass;
  score: [Score, Score];
  referee: string;
  refereeTimer: string;
  end: number | "tie";
  time: [Time, Time];
  group: string;
  tieScore: [boolean, boolean];
  groupStep: boolean;
  semi: string;
}

export interface Score {
  playyerIndex: 0 | 1;
  score: number[];
}

export interface Time {
  playyerIndex: 0 | 1;
  time: number[];
}

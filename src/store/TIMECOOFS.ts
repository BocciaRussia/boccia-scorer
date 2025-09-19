import { ApiGClass } from "../utils/ConfigManager";

export const TIMECOOFS: {
    [key in ApiGClass]: number
} = {
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
} as const;

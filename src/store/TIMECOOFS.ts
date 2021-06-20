import { GClass, gclass } from "boccia-types/lib/GClass";

export const TIMECOOFS:{
    [key in gclass]: number
} = {
    BC1: 300,
    BC2: 240,
    BC3: 360,
    BC4: 240,
    BC5: 240,
    "ПBC3":420,
    "ПBC4": 300,
    "ПBC5": 300,
    "ТBC1/BC2": 360    
} as const;

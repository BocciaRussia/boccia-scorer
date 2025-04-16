import { GClass, gclass } from "boccia-types/lib/GClass";

export const TIMECOOFS: {
    [key in gclass]: number
} = {
    BCM1: (4.5)*60,
    BCW1: (4.5)*60,
    BCM2: (3.5)*60,
    BCW2: (3.5)*60,
    BCM3: 360,
    BCW3: 360,
    BCM4: (3.5)*60,
    BCW4: (3.5)*60,
    BCM5: 240,
    BCW5: 240,
    "ПBC3": (7)*60,
    "ПBC4": (4)*60,
    "ПBC5": 300,
    "ТBC1/BC2": 300
} as const;

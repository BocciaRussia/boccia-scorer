import { GClass, gclass } from "boccia-types/lib/GClass";

export const TIMECOOFS: {
    [key in gclass]: number
} = {
    BCM1: 300,
    BCW1: 300,
    BCM2: 240,
    BCW2: 240,
    BCM3: 360,
    BCW3: 360,
    BCM4: 240,
    BCW4: 240,
    BCM5: 240,
    BCW5: 240,
    "ПBC3": 420,
    "ПBC4": 300,
    "ПBC5": 300,
    "ТBC1/BC2": 360
} as const;

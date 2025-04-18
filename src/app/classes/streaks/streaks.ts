import { Goals } from "../../models/goals";

export class Streaks {
    name: string;
    value: number;
    desc: string;
    status: string;
    icon?: string;
    target: number;
    fragment?: string;
    url?: string;
    constructor(streak: Goals, streakInfo: any) {
        this.name = streak.name,
        this.value = streak.value ?? 0,
        this.target = streak.target ?? 0,
        this.status = streak.status ?? '';
        this.desc = streakInfo.desc;
        this.icon = streakInfo.icon ?? '';
        this.fragment = streakInfo.fragment;
        this.url = streakInfo.url;
    }
}
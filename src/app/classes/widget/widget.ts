import { TierAggregates } from "../../models/tier-aggregates";

export class Widget {
    tierInfo: any;
    totalSpends: number;
    nextTier: string;
    currentTier:string;
    nextMilestone: number;
    aggregates: TierAggregates[] = [];
    hemmingAvailable: number;
    streakBonus: number;
    pointBalance: number;
    tierBenefits: any;

    constructor(widget: any) {
        this.tierInfo = widget?.data?.lineItems;
        this.totalSpends = widget?.data?.tierProgress ? widget?.data?.tierProgress.nonLinkedBal : 0;
        this.nextTier = widget?.data?.tierProgress ? widget.data?.tierProgress.nextTier : '';
        this.currentTier = widget?.data?.tierProgress ? widget.data?.tierProgress.currentTier : '';
        this.nextMilestone = widget?.data?.tierProgress ? widget.data?.tierProgress.nextMilestone : 0;
        this.pointBalance = (widget?.data?.pointBalance || widget?.data?.pointsBalance) ?? 0;
        this.hemmingAvailable = widget.data?.hemmingAvailable ?? 0;
        this.streakBonus = widget?.data?.streakBonus ?? '';
        this.tierBenefits = widget?.data?.tierBenefits ?? [];

        if (widget?.data?.aggregates) {
            this.aggregates = widget?.data?.aggregates;
        }
    }
}
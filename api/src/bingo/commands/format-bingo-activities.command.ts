import { ActivityDto } from "@/activity/dto/activity.dto";
import { BingoDto } from "../dto/bingo.dto";
import { Command } from "@nestjs/cqrs";
import { Activity } from "@/activity/activity.entity";

export type FormatBingoActivitiesResult = ActivityDto<BingoDto>[];

export class FormatBingoActivitiesCommand extends Command<FormatBingoActivitiesResult> {
    constructor(public readonly activities: Activity[]) {
        super();
    }
}
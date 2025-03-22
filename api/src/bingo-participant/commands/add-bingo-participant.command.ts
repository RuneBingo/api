import { Bingo } from "@/bingo/bingo.entity";
import { BingoParticipant } from "../bingo-participant.entity";
import { User } from "@/user/user.entity";
import { Command } from "@nestjs/cqrs";

export type AddBingoParticipantParams = {
    bingo: Bingo;
    user: User;
    role: string;
};

export type AddBingoParticipantResult = BingoParticipant;

export class AddBingoParticipantCommand extends Command<BingoParticipant> {
    constructor(public readonly params: AddBingoParticipantParams) {
        super();
    }
}
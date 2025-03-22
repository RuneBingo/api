import { User } from "@/user/user.entity";
import { UpdateBingoDto } from "../dto/update-bingo.dto";
import { Bingo } from "../bingo.entity";
import { Command } from "@nestjs/cqrs";

export type UpdateBingoParams = {
    requester: User;
    bingoId: number;
    updateBingoDto: UpdateBingoDto;
}

export type UpdateBingoResult = Bingo;

export class UpdateBingoCommand extends Command<Bingo> {
    constructor(public readonly params: UpdateBingoParams) {
        super();
    }
}
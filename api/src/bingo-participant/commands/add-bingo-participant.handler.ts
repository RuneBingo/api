import { CommandHandler } from "@nestjs/cqrs";
import { AddBingoParticipantCommand, AddBingoParticipantResult } from "./add-bingo-participant.command";
import { InjectRepository } from "@nestjs/typeorm";
import { BingoParticipant } from "../bingo-participant.entity";
import { Repository } from "typeorm";

@CommandHandler(AddBingoParticipantCommand)
export class AddBingoParticipantHandler {
    constructor(
        @InjectRepository(BingoParticipant)
        private readonly bingoParticipantRepository: Repository<BingoParticipant>,

    ) { }

    async execute(command: AddBingoParticipantCommand): Promise<AddBingoParticipantResult> {
        const {bingo, user, role} = command.params;

        const bingoParticipant: BingoParticipant = new BingoParticipant()
        bingoParticipant.userId = user.id;
        bingoParticipant.bingoId = bingo.id;
        bingoParticipant.role = role;

        this.bingoParticipantRepository.save(bingoParticipant);

        return bingoParticipant;
    }
}
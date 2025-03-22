import { CreateBingoDto } from "../dto/create-bingo.dto";

export type BingoCreatedParams = {
    bingoId: number;
    requesterId: number;
    dto: CreateBingoDto;
}

export class BingoCreatedEvent {
    constructor(public readonly params: BingoCreatedParams) {

    }
}
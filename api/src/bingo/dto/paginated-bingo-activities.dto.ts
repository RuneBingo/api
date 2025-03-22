import { ActivityDto } from "@/activity/dto/activity.dto";
import { PaginatedDtoWithoutTotal } from "@/db/dto/paginated.dto";
import { BingoDto } from "./bingo.dto";
import { ApiProperty } from "@nestjs/swagger";

export class BingoActivityDto extends ActivityDto<BingoDto> {
    @ApiProperty({ type: BingoDto })
    declare trackable: BingoDto;
}

export class PaginatedBingoActivitiesDto extends PaginatedDtoWithoutTotal<BingoActivityDto> {
    @ApiProperty({type: [BingoActivityDto]})
    declare items: BingoActivityDto[];
}
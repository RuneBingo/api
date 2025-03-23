import { PaginatedDtoWithoutTotal } from "@/db/dto/paginated.dto";
import { ActivityDto } from "./activity.dto";
import { ApiProperty } from "@nestjs/swagger";

export class PaginatedActivitiesDto extends PaginatedDtoWithoutTotal<ActivityDto> {
  @ApiProperty({ type: [ActivityDto] })
  declare items: ActivityDto[];
}

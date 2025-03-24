import { SetMetadata } from "@nestjs/common";
import { BingoRoles } from "./bingo-roles.constants";

export const BingoRole = (bingoRole: BingoRoles) => SetMetadata('bingoRole', bingoRole);
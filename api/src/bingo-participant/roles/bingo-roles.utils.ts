import { BingoParticipant } from "@/bingo-participant/bingo-participant.entity";
import { bingoRoleHierarchy, BingoRoles } from "./bingo-roles.constants";

export function userHasBingoRole(bingoParticipant: BingoParticipant, bingoRole: BingoRoles) {
    return bingoRoleHierarchy.indexOf(bingoParticipant.role) >= bingoRoleHierarchy.indexOf(bingoRole);
}
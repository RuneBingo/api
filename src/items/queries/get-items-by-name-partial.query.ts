import { Query } from "@nestjs/cqrs";
import { Item } from "../entities/item.entity"

export type GetItemsByNamePartialResult = {
    items: Item[];
}

export class GetItemsByNamePartialQuery extends Query<GetItemsByNamePartialResult> {
    constructor (
        public readonly searchTerm: string,
    ) {
        super();
    }
}


import { MotoFilters } from "../Filter/MotoFilter";
import { MotoWithRules } from "../Entity/MotoEntity";
import { BaseMotoDecorator } from "./BaseMotoDecorator";
import {ScoreCalculator} from "../Utils/ScoreCalculator";

export class ScoreDecorator extends BaseMotoDecorator {

    constructor(
        private readonly filters: MotoFilters
    ){
        super();
    }

    decorate(
        moto: MotoWithRules
    ): MotoWithRules {

        let score = ScoreCalculator.compute(moto);
        if(
            this.filters.marque &&
            moto.marque.toLowerCase() ===
            this.filters.marque.toLowerCase()
        ){
            score += 5;
        }

        if(
            this.filters.type &&
            moto.type === this.filters.type
        ){
            score += 4;
        }

        if(
            this.filters.permisA2 &&
            moto.compatibleA2
        ){
            score += 2;
        }

        return{
            ...super.decorate(moto), score
        };
    }
}
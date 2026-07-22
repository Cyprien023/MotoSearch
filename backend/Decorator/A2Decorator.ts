import { MotoWithRules } from "../Entity/MotoEntity";
import { BaseMotoDecorator } from "./BaseMotoDecorator";

const PERMIS_A2_MAX_PUISSANCE_KW = 35;

export class A2Decorator extends BaseMotoDecorator {

    decorate(
        moto: MotoWithRules
    ): MotoWithRules {

        return {
            ...super.decorate(moto), compatibleA2: moto.puissance <= PERMIS_A2_MAX_PUISSANCE_KW
        };

    }

}
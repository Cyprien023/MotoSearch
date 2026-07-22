import { MotoWithRules } from "../Entity/MotoEntity";
import { IMotoDecorator } from "./IMotoDecorator";

export class BaseMotoDecorator implements IMotoDecorator {

    decorate(moto: MotoWithRules): MotoWithRules {
        return moto;

    }

}
import { MotoWithRules } from "../Entity/MotoEntity";

export interface IMotoDecorator {

    decorate(moto: MotoWithRules): MotoWithRules;

}
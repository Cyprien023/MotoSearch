import { MotoWithRules } from "../Entity/MotoEntity";

export class ScoreCalculator {

    static compute(
        moto: MotoWithRules
    ): number {

        const prix = Math.max(0, 100 - moto.prix / 150);

        const kilometrage = Math.max(0, 100 - moto.kilometrage / 500);

        const annee = Math.min(100, (moto.annee - 2000) * 4);

        const distance = Math.max(0, 100 - moto.distanceKm);

        const a2 = moto.compatibleA2 ? 100 : 0;

        return Math.round(prix * 0.40 + kilometrage * 0.25 + annee * 0.20 + distance * 0.10 + a2 * 0.05
        );

    }

}
import { registerExercise } from "./registry";

// Counting exercises
import { kittenBasketExercise } from "./counting/basket";
import { subitizeExercise } from "./counting/subitize";
import { recognizeNumbersExercise } from "./counting/recognize";
import { countObjectsExercise } from "./counting/objects";
import { compareQuantitiesExercise } from "./counting/compare";

// Basic operations exercises
import { addWithin10Exercise } from "./basic-operations/add-within-10";
import { subtractWithin10Exercise } from "./basic-operations/subtract-within-10";
import { numberBondsExercise } from "./basic-operations/number-bonds";
import { doublesExercise } from "./basic-operations/doubles";

// Regrouping exercises
import { complementsExercise } from "./regrouping/complements";
import { ltrAdditionExercise } from "./regrouping/ltr-addition";
import { ltrSubtractionExercise } from "./regrouping/ltr-subtraction";

// Multiplication exercises
import { arraysExercise } from "./multiplication/arrays";
import { timesTablesExercise } from "./multiplication/times-tables";
import { boxMethodExercise } from "./multiplication/box-method";

// Division exercises
import { sharingExercise } from "./division/sharing";
import { divisionFactsExercise } from "./division/facts";

// Fractions exercises
import { partsWholeExercise } from "./fractions/parts-whole";
import { fractionCompareExercise } from "./fractions/compare";

// Decimals exercises
import { tenthsExercise } from "./decimals/tenths";
import { decimalPlaceValueExercise } from "./decimals/place-value";

// Time exercises
import { hourHalfExercise } from "./time/hour-half";

// Money exercises
import { moneyCountingExercise } from "./money/counting";

// Patterns exercises
import { skipCountExercise } from "./patterns/skip-count";

// Algebra exercises
import { missingNumberExercise } from "./algebra/missing-number";

// Geometry exercises
import { shapesExercise } from "./geometry/shapes";

// Data exercises
import { barGraphExercise } from "./data/bar-graph";

// Probability exercises
import { coinFlipExercise } from "./probability/coin-flip";

// Measurement exercises
import { lengthExercise } from "./measurement/length";

// Register all exercises
// Counting
registerExercise(kittenBasketExercise);
registerExercise(subitizeExercise);
registerExercise(recognizeNumbersExercise);
registerExercise(countObjectsExercise);
registerExercise(compareQuantitiesExercise);

// Basic operations
registerExercise(addWithin10Exercise);
registerExercise(subtractWithin10Exercise);
registerExercise(numberBondsExercise);
registerExercise(doublesExercise);

// Regrouping
registerExercise(complementsExercise);
registerExercise(ltrAdditionExercise);
registerExercise(ltrSubtractionExercise);

// Multiplication
registerExercise(arraysExercise);
registerExercise(timesTablesExercise);
registerExercise(boxMethodExercise);

// Division
registerExercise(sharingExercise);
registerExercise(divisionFactsExercise);

// Fractions
registerExercise(partsWholeExercise);
registerExercise(fractionCompareExercise);

// Decimals
registerExercise(tenthsExercise);
registerExercise(decimalPlaceValueExercise);

// Time
registerExercise(hourHalfExercise);

// Money
registerExercise(moneyCountingExercise);

// Patterns
registerExercise(skipCountExercise);

// Algebra
registerExercise(missingNumberExercise);

// Geometry
registerExercise(shapesExercise);

// Data
registerExercise(barGraphExercise);

// Probability
registerExercise(coinFlipExercise);

// Measurement
registerExercise(lengthExercise);

export * from "./types";
export * from "./registry";

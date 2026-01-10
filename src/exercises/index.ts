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
import { addSubWordProblemExercise } from "./basic-operations/word-problems";

// Regrouping exercises
import { complementsExercise } from "./regrouping/complements";
import { ltrAdditionExercise } from "./regrouping/ltr-addition";
import { ltrSubtractionExercise } from "./regrouping/ltr-subtraction";

// Multiplication exercises
import { arraysExercise } from "./multiplication/arrays";
import { timesTablesExercise } from "./multiplication/times-tables";
import { boxMethodExercise } from "./multiplication/box-method";
import { multWordProblemExercise } from "./multiplication/word-problems";

// Division exercises
import { sharingExercise } from "./division/sharing";
import { divisionFactsExercise } from "./division/facts";

// Fractions exercises
import { partsWholeExercise } from "./fractions/parts-whole";
import { fractionCompareExercise } from "./fractions/compare";
import { equivalentFractionExercise } from "./fractions/equivalent";

// Decimals exercises
import { tenthsExercise } from "./decimals/tenths";
import { decimalPlaceValueExercise } from "./decimals/place-value";

// Time exercises
import { hourHalfExercise } from "./time/hour-half";
import { elapsedTimeExercise } from "./time/elapsed";

// Money exercises
import { moneyCountingExercise } from "./money/counting";

// Patterns exercises
import { skipCountExercise } from "./patterns/skip-count";
import { shapePatternExercise } from "./patterns/shape-patterns";

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

// Place value exercises
import { expandedFormExercise } from "./place-value/expanded-form";

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
registerExercise(addSubWordProblemExercise);

// Regrouping
registerExercise(complementsExercise);
registerExercise(ltrAdditionExercise);
registerExercise(ltrSubtractionExercise);

// Multiplication
registerExercise(arraysExercise);
registerExercise(timesTablesExercise);
registerExercise(boxMethodExercise);
registerExercise(multWordProblemExercise);

// Division
registerExercise(sharingExercise);
registerExercise(divisionFactsExercise);

// Fractions
registerExercise(partsWholeExercise);
registerExercise(fractionCompareExercise);
registerExercise(equivalentFractionExercise);

// Decimals
registerExercise(tenthsExercise);
registerExercise(decimalPlaceValueExercise);

// Time
registerExercise(hourHalfExercise);
registerExercise(elapsedTimeExercise);

// Money
registerExercise(moneyCountingExercise);

// Patterns
registerExercise(skipCountExercise);
registerExercise(shapePatternExercise);

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

// Place value
registerExercise(expandedFormExercise);

export * from "./types";
export * from "./registry";

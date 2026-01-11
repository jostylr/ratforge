import { registerExercise } from "./registry";

// Counting exercises
import { kittenBasketExercise } from "./counting/basket";
import { subitizeExercise } from "./counting/subitize";
import { recognizeNumbersExercise } from "./counting/recognize";
import { countObjectsExercise } from "./counting/objects";
import { compareQuantitiesExercise } from "./counting/compare";
import { oddEvenExercise } from "./counting/odd-even";
import { greaterLessExercise } from "./counting/greater-less";

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
import { remainderExercise } from "./division/remainders";

// Fractions exercises
import { partsWholeExercise } from "./fractions/parts-whole";
import { fractionCompareExercise } from "./fractions/compare";
import { equivalentFractionExercise } from "./fractions/equivalent";
import { addFractionsExercise } from "./fractions/add-same-denom";

// Decimals exercises
import { tenthsExercise } from "./decimals/tenths";
import { decimalPlaceValueExercise } from "./decimals/place-value";
import { addDecimalsExercise } from "./decimals/add-decimals";

// Time exercises
import { hourHalfExercise } from "./time/hour-half";
import { elapsedTimeExercise } from "./time/elapsed";

// Money exercises
import { moneyCountingExercise } from "./money/counting";
import { makingChangeExercise } from "./money/making-change";

// Patterns exercises
import { skipCountExercise } from "./patterns/skip-count";
import { shapePatternExercise } from "./patterns/shape-patterns";

// Algebra exercises
import { missingNumberExercise } from "./algebra/missing-number";

// Geometry exercises
import { shapesExercise } from "./geometry/shapes";
import { perimeterExercise } from "./geometry/perimeter";
import { areaExercise } from "./geometry/area";

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
registerExercise(oddEvenExercise);
registerExercise(greaterLessExercise);

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
registerExercise(remainderExercise);

// Fractions
registerExercise(partsWholeExercise);
registerExercise(fractionCompareExercise);
registerExercise(equivalentFractionExercise);
registerExercise(addFractionsExercise);

// Decimals
registerExercise(tenthsExercise);
registerExercise(decimalPlaceValueExercise);
registerExercise(addDecimalsExercise);

// Time
registerExercise(hourHalfExercise);
registerExercise(elapsedTimeExercise);

// Money
registerExercise(moneyCountingExercise);
registerExercise(makingChangeExercise);

// Patterns
registerExercise(skipCountExercise);
registerExercise(shapePatternExercise);

// Algebra
registerExercise(missingNumberExercise);

// Geometry
registerExercise(shapesExercise);
registerExercise(perimeterExercise);
registerExercise(areaExercise);

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

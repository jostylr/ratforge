import { registerExercise } from "./registry";

// Counting exercises
import { kittenBasketExercise } from "./counting/basket";
import { subitizeExercise } from "./counting/subitize";
import { recognizeNumbersExercise } from "./counting/recognize";
import { countObjectsExercise } from "./counting/objects";
import { compareQuantitiesExercise } from "./counting/compare";
import { oddEvenExercise } from "./counting/odd-even";
import { greaterLessExercise } from "./counting/greater-less";
import { orderingExercise } from "./counting/ordering";
import { numberNamesExercise } from "./counting/number-names";

// Basic operations exercises
import { addWithin10Exercise } from "./basic-operations/add-within-10";
import { subtractWithin10Exercise } from "./basic-operations/subtract-within-10";
import { numberBondsExercise } from "./basic-operations/number-bonds";
import { doublesExercise } from "./basic-operations/doubles";
import { addSubWordProblemExercise } from "./basic-operations/word-problems";
import { factFamilyExercise } from "./basic-operations/fact-families";
import { tensOnesExercise } from "./basic-operations/tens-ones";

// Regrouping exercises
import { complementsExercise } from "./regrouping/complements";
import { ltrAdditionExercise } from "./regrouping/ltr-addition";
import { ltrSubtractionExercise } from "./regrouping/ltr-subtraction";

// Multiplication exercises
import { arraysExercise } from "./multiplication/arrays";
import { timesTablesExercise } from "./multiplication/times-tables";
import { boxMethodExercise } from "./multiplication/box-method";
import { multWordProblemExercise } from "./multiplication/word-problems";
import { multPropertiesExercise } from "./multiplication/properties";
import { squareNumbersExercise } from "./multiplication/square-numbers";

// Division exercises
import { sharingExercise } from "./division/sharing";
import { divisionFactsExercise } from "./division/facts";
import { remainderExercise } from "./division/remainders";
import { divWordProblemExercise } from "./division/word-problems";

// Fractions exercises
import { partsWholeExercise } from "./fractions/parts-whole";
import { fractionCompareExercise } from "./fractions/compare";
import { equivalentFractionExercise } from "./fractions/equivalent";
import { addFractionsExercise } from "./fractions/add-same-denom";
import { subtractFractionsExercise } from "./fractions/subtract-same-denom";
import { mixedNumberExercise } from "./fractions/mixed-numbers";
import { fractionNumberLineExercise } from "./fractions/number-line";

// Decimals exercises
import { tenthsExercise } from "./decimals/tenths";
import { decimalPlaceValueExercise } from "./decimals/place-value";
import { addDecimalsExercise } from "./decimals/add-decimals";
import { compareDecimalsExercise } from "./decimals/compare-decimals";
import { subtractDecimalsExercise } from "./decimals/subtract-decimals";

// Time exercises
import { hourHalfExercise } from "./time/hour-half";
import { elapsedTimeExercise } from "./time/elapsed";
import { quarterHourExercise } from "./time/quarter-hour";
import { timeWordProblemExercise } from "./time/word-problems";

// Money exercises
import { moneyCountingExercise } from "./money/counting";
import { makingChangeExercise } from "./money/making-change";
import { moneyWordProblemExercise } from "./money/word-problems";

// Patterns exercises
import { skipCountExercise } from "./patterns/skip-count";
import { shapePatternExercise } from "./patterns/shape-patterns";
import { numberPatternExercise } from "./patterns/number-patterns";

// Algebra exercises
import { missingNumberExercise } from "./algebra/missing-number";
import { solveEquationExercise } from "./algebra/solve-equation";

// Geometry exercises
import { shapesExercise } from "./geometry/shapes";
import { perimeterExercise } from "./geometry/perimeter";
import { areaExercise } from "./geometry/area";
import { symmetryExercise } from "./geometry/symmetry";
import { anglesExercise } from "./geometry/angles";

// Data exercises
import { barGraphExercise } from "./data/bar-graph";
import { pictographExercise } from "./data/pictograph";
import { tallyChartExercise } from "./data/tally-chart";

// Probability exercises
import { coinFlipExercise } from "./probability/coin-flip";
import { spinnerExercise } from "./probability/spinner";

// Measurement exercises
import { lengthExercise } from "./measurement/length";
import { weightExercise } from "./measurement/weight";

// Place value exercises
import { expandedFormExercise } from "./place-value/expanded-form";
import { roundingExercise } from "./place-value/rounding";
import { compareNumbersExercise } from "./place-value/compare-numbers";

// Register all exercises
// Counting
registerExercise(kittenBasketExercise);
registerExercise(subitizeExercise);
registerExercise(recognizeNumbersExercise);
registerExercise(countObjectsExercise);
registerExercise(compareQuantitiesExercise);
registerExercise(oddEvenExercise);
registerExercise(greaterLessExercise);
registerExercise(orderingExercise);
registerExercise(numberNamesExercise);

// Basic operations
registerExercise(addWithin10Exercise);
registerExercise(subtractWithin10Exercise);
registerExercise(numberBondsExercise);
registerExercise(doublesExercise);
registerExercise(addSubWordProblemExercise);
registerExercise(factFamilyExercise);
registerExercise(tensOnesExercise);

// Regrouping
registerExercise(complementsExercise);
registerExercise(ltrAdditionExercise);
registerExercise(ltrSubtractionExercise);

// Multiplication
registerExercise(arraysExercise);
registerExercise(timesTablesExercise);
registerExercise(boxMethodExercise);
registerExercise(multWordProblemExercise);
registerExercise(multPropertiesExercise);
registerExercise(squareNumbersExercise);

// Division
registerExercise(sharingExercise);
registerExercise(divisionFactsExercise);
registerExercise(remainderExercise);
registerExercise(divWordProblemExercise);

// Fractions
registerExercise(partsWholeExercise);
registerExercise(fractionCompareExercise);
registerExercise(equivalentFractionExercise);
registerExercise(addFractionsExercise);
registerExercise(subtractFractionsExercise);
registerExercise(mixedNumberExercise);
registerExercise(fractionNumberLineExercise);

// Decimals
registerExercise(tenthsExercise);
registerExercise(decimalPlaceValueExercise);
registerExercise(addDecimalsExercise);
registerExercise(compareDecimalsExercise);
registerExercise(subtractDecimalsExercise);

// Time
registerExercise(hourHalfExercise);
registerExercise(elapsedTimeExercise);
registerExercise(quarterHourExercise);
registerExercise(timeWordProblemExercise);

// Money
registerExercise(moneyCountingExercise);
registerExercise(makingChangeExercise);
registerExercise(moneyWordProblemExercise);

// Patterns
registerExercise(skipCountExercise);
registerExercise(shapePatternExercise);
registerExercise(numberPatternExercise);

// Algebra
registerExercise(missingNumberExercise);
registerExercise(solveEquationExercise);

// Geometry
registerExercise(shapesExercise);
registerExercise(perimeterExercise);
registerExercise(areaExercise);
registerExercise(symmetryExercise);
registerExercise(anglesExercise);

// Data
registerExercise(barGraphExercise);
registerExercise(pictographExercise);
registerExercise(tallyChartExercise);

// Probability
registerExercise(coinFlipExercise);
registerExercise(spinnerExercise);

// Measurement
registerExercise(lengthExercise);
registerExercise(weightExercise);

// Place value
registerExercise(expandedFormExercise);
registerExercise(roundingExercise);
registerExercise(compareNumbersExercise);

export * from "./types";
export * from "./registry";

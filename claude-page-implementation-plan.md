# RatForge Page Implementation Plan

> Historical component design, classified 2026-09-19. This is not the active
> RiX execution queue, and unchecked items are not verified missing features.
> The umbrella `ratmath/WORK_PLAN.md` records legacy/support work under later
> product-scope decisions. Maintain compatibility; do not start a second parser,
> evaluator, or publishing architecture from this older plan.

This document provides a detailed implementation plan for creating all pages based on math-plan.md. Each main heading becomes a **Table of Contents (TOC) page**, and each subitem becomes an **individual practice page**.

---

## URL Structure Convention

- TOC pages: `/[category-slug]`
- Practice pages: `/[category-slug]/[exercise-slug]`

---

## 1. Basic Counting and Number Recognition

### TOC Page

- **Name:** Counting & Numbers
- **URL:** `/counting`
- **Functional Description:** A table of contents page displaying cards/links to all counting and number recognition exercises. Shows progress indicators for each subpage. Includes a brief intro explaining the learning goals for this section.

### Practice Pages

#### 1.1 Recognize Numbers 1-20
- **Name:** Number Recognition
- **URL:** `/counting/recognize-numbers`
- **Functional Description:** Display numbers 1-20 in random order. Student clicks/taps the correct number when shown a visual representation (dots, objects). Tracks accuracy and time. Includes audio pronunciation option.

#### 1.2 Count Objects Accurately
- **Name:** Object Counting
- **URL:** `/counting/count-objects`
- **Functional Description:** Shows groups of objects (animals, shapes, items) in quantities 1-20. Student enters the count using number pad. Randomizes object types and arrangements. Provides immediate feedback with visual highlight of each counted object.

#### 1.3 Match Numbers to Quantities
- **Name:** Number Matching
- **URL:** `/counting/match-quantities`
- **Functional Description:** Drag-and-drop interface matching number cards to groups of objects. Multiple difficulty levels (1-5, 1-10, 1-20). Shuffle mode for replay value. Shows score and streaks.

#### 1.4 One-to-One Correspondence
- **Name:** One-to-One Matching
- **URL:** `/counting/one-to-one`
- **Functional Description:** Interactive exercise where student draws lines connecting individual objects to numbers, or taps objects in sequence while counting aloud. Visual feedback shows connection lines. Validates correct sequencing.

#### 1.5 Compare Quantities
- **Name:** More, Less, Same
- **URL:** `/counting/compare-quantities`
- **Functional Description:** Two groups displayed side by side. Student selects "more," "less," or "same" buttons. Progressive difficulty with closer quantity differences. Visual animations show comparison.

#### 1.6 Container Placement
- **Name:** Containers & Objects
- **URL:** `/counting/containers`
- **Functional Description:** Drag objects into containers. Explore nested containers (containers within containers). Count items in containers, add/remove items. Foundation for place value understanding.

#### 1.7 Estimate Pile Sizes
- **Name:** Estimation Station
- **URL:** `/counting/estimation`
- **Functional Description:** Shows piles of objects. Student selects from bucket ranges (1-5, 5-10, 10-20, etc.) to estimate quantity. Reveals actual count with celebration for close estimates. Builds number sense.

---

## 2. Basic Geometry

### TOC Page

- **Name:** Shapes & Geometry
- **URL:** `/geometry`
- **Functional Description:** Table of contents for geometry exercises. Visual cards showing shape previews for each subpage. Progress tracking per exercise. Brief intro on why shapes matter.

### Practice Pages

#### 2.1 Identify Basic Shapes
- **Name:** Shape Identification
- **URL:** `/geometry/identify-shapes`
- **Functional Description:** Shows shapes (circle, square, triangle, rectangle) one at a time. Student selects the correct name from options. Includes shape outlines, filled shapes, and rotated variations.

#### 2.2 Sort Shapes by Attributes
- **Name:** Shape Sorting
- **URL:** `/geometry/sort-shapes`
- **Functional Description:** Sorting interface with bins labeled by attribute (number of sides, curved/straight, color, size). Drag shapes into correct bins. Multiple sorting criteria modes.

#### 2.3 Compare Sizes
- **Name:** Size Comparison
- **URL:** `/geometry/compare-sizes`
- **Functional Description:** Two shapes displayed. Student selects "bigger" or "smaller." Progressive mode with "biggest/smallest of three." Includes same-shape different-size and different-shape comparisons.

#### 2.4 Shapes in Everyday Objects
- **Name:** Shape Hunt
- **URL:** `/geometry/real-world-shapes`
- **Functional Description:** Shows photos of real objects (clock = circle, door = rectangle). Student identifies the shape. Interactive overlay to highlight the shape within the object.

---

## 3. Measurement Concepts

### TOC Page

- **Name:** Measurement & Comparison
- **URL:** `/measurement`
- **Functional Description:** TOC page for measurement exercises. Visual preview cards showing comparison scenarios. Progress indicators and section introduction.

### Practice Pages

#### 3.1 Compare Quantities (More/Less)
- **Name:** More or Less
- **URL:** `/measurement/more-less`
- **Functional Description:** Visual comparison of two groups. Student identifies which has more/less. Uses various representations (dots, bars, objects). Difficulty scales with quantity closeness.

#### 3.2 Order by Size
- **Name:** Size Ordering
- **URL:** `/measurement/order-by-size`
- **Functional Description:** Drag-and-drop interface to arrange 3-5 objects from smallest to largest (or reverse). Objects include animals, shapes, everyday items. Validates correct ordering with animation.

#### 3.3 Comparative Language
- **Name:** Comparison Words
- **URL:** `/measurement/comparison-words`
- **Functional Description:** Given two items, student selects the correct comparative statement ("The elephant is bigger than the mouse"). Fill-in-the-blank and multiple choice modes.

#### 3.4 Match Quantities to Terms
- **Name:** Quantity Terms Matching
- **URL:** `/measurement/match-terms`
- **Functional Description:** Match descriptive terms (many, few, none, all, some) to visual representations. Drag term cards to matching images.

#### 3.5 Visual Comparisons Practice
- **Name:** Visual Comparison Lab
- **URL:** `/measurement/visual-practice`
- **Functional Description:** Interactive sandbox with objects that can be resized, stacked, and compared. Free exploration mode plus guided challenges. Ruler and balance scale tools.

---

## 4. Simple Addition and Subtraction

### TOC Page

- **Name:** Basic Addition & Subtraction
- **URL:** `/basic-operations`
- **Functional Description:** TOC for foundational addition/subtraction. Cards organized by operation type. Shows mastery level for each exercise. Includes overview of learning progression.

### Practice Pages

#### 4.1 Add Within 10
- **Name:** Adding to 10
- **URL:** `/basic-operations/add-within-10`
- **Functional Description:** Visual addition with objects/dots. Shows two groups combining. Student enters sum using number pad. Animated objects moving together. Immediate feedback.

#### 4.2 Subtract Within 10
- **Name:** Subtracting to 10
- **URL:** `/basic-operations/subtract-within-10`
- **Functional Description:** Visual subtraction with objects disappearing/crossing out. Shows starting group, items leaving. Student enters difference. Animation of "taking away."

#### 4.3 Addition as Putting Together
- **Name:** Putting Together
- **URL:** `/basic-operations/putting-together`
- **Functional Description:** Story-based addition scenarios. "3 apples + 2 apples = ?" with draggable objects. Student physically combines groups before answering. Conceptual focus.

#### 4.4 Subtraction as Taking Apart
- **Name:** Taking Apart
- **URL:** `/basic-operations/taking-apart`
- **Functional Description:** Story-based subtraction. "5 cookies, eat 2, how many left?" Student removes objects from group. Animated scenarios with real-world contexts.

#### 4.5 Number Bonds to 10
- **Name:** Number Bonds
- **URL:** `/basic-operations/number-bonds`
- **Functional Description:** Interactive number bond diagrams. Fill in missing parts (whole or parts). Covers all combinations to 10. Visual bond connections animate when correct.

#### 4.6 Addition/Subtraction Word Problems
- **Name:** Word Problems (Basic)
- **URL:** `/basic-operations/word-problems`
- **Functional Description:** Simple word problems with visual support. Read-aloud option. Student identifies operation and solves. Hints available showing visual representation.

#### 4.7 Commutative Property
- **Name:** Order Doesn't Matter
- **URL:** `/basic-operations/commutative`
- **Functional Description:** Demonstrates 3+5 = 5+3 with visual proof. Student verifies pairs that equal the same sum. Drag to rearrange addends and see result unchanged.

#### 4.8 Mental Math Strategies
- **Name:** Mental Math Basics
- **URL:** `/basic-operations/mental-math`
- **Functional Description:** Timed practice for quick addition/subtraction. Strategy hints (counting on, doubles, near doubles). Progress from 2-second to instant recall targets.

#### 4.9 Fact Fluency
- **Name:** Fact Fluency Drill
- **URL:** `/basic-operations/fluency`
- **Functional Description:** Rapid-fire fact practice. Customizable fact families. Tracks speed and accuracy over time. Leaderboard/personal best tracking. Celebration animations for streaks.

---

## 5. Addition and Subtraction with Regrouping

### TOC Page

- **Name:** Regrouping Operations
- **URL:** `/regrouping`
- **Functional Description:** TOC for regrouping/carrying/borrowing exercises. Highlights the abacus-inspired left-to-right method. Links to complement practice as prerequisite. Progress tracking.

### Practice Pages

#### 5.1 Single Digit Addition Facts
- **Name:** Addition Facts Memorization
- **URL:** `/regrouping/addition-facts`
- **Functional Description:** Flashcard-style drill for single digit sums to 18. Spaced repetition algorithm. Tracks mastery per fact. Focus on facts that produce carries.

#### 5.2 Complement Practice
- **Name:** Complements to 10
- **URL:** `/regrouping/complements`
- **Functional Description:** **Critical prerequisite page.** Given a digit, student instantly provides complement to 10 (e.g., 7 → 3, 4 → 6). Timed drills. Visual ten-frame support initially.

#### 5.3 Left-to-Right Addition with Carrying
- **Name:** Left-to-Right Addition
- **URL:** `/regrouping/left-right-addition`
- **Functional Description:** **Core method page.** Implements abacus-style addition. Example: 17+29 → type "3" (tens), see 7+9>10, press spacebar for carry, type "6" (ones), result shows "46". Step-by-step guided mode and free practice mode.

#### 5.4 Left-to-Right Subtraction with Borrowing
- **Name:** Left-to-Right Subtraction
- **URL:** `/regrouping/left-right-subtraction`
- **Functional Description:** **Core method page.** Implements abacus-style subtraction. Example: 23-16 → type "1" (tens), see 3<6, press "x" for borrow, use complement (6→4), type "7" (ones). Guided and free modes.

#### 5.5 Multi-Digit Regrouping Problems
- **Name:** Multi-Digit Practice
- **URL:** `/regrouping/multi-digit`
- **Functional Description:** Extended practice with 3+ digit numbers using left-to-right method. Scaffolded difficulty. Shows intermediate steps on request.

#### 5.6 Regrouping Word Problems
- **Name:** Regrouping Word Problems
- **URL:** `/regrouping/word-problems`
- **Functional Description:** Real-world scenarios requiring regrouping (shopping totals, sharing items). Extract numbers, identify operation, solve with method.

#### 5.7 Visual Models for Regrouping
- **Name:** Regrouping Visualizer
- **URL:** `/regrouping/visual-models`
- **Functional Description:** Interactive base-10 blocks showing regrouping process. Drag unit cubes into tens rod, or break tens rod into units. Connects visual to numerical.

#### 5.8 Speed and Accuracy Training
- **Name:** Regrouping Speed Drill
- **URL:** `/regrouping/speed-drill`
- **Functional Description:** Timed regrouping practice. Accuracy and speed metrics. Personal best tracking. Adaptive difficulty based on performance.

---

## 6. Number Patterns and Sequences

### TOC Page

- **Name:** Patterns & Sequences
- **URL:** `/patterns`
- **Functional Description:** TOC for pattern recognition exercises. Visual pattern previews on cards. Links to skip counting as multiplication foundation. Progress indicators.

### Practice Pages

#### 6.1 Identify Simple Patterns
- **Name:** Pattern Finder
- **URL:** `/patterns/identify-patterns`
- **Functional Description:** Shows number sequence with blank. Student identifies pattern rule and fills next number. Patterns: +1, +2, +5, +10, doubles.

#### 6.2 Extend Patterns
- **Name:** Pattern Extender
- **URL:** `/patterns/extend-patterns`
- **Functional Description:** Given starting sequence, student provides next 3-5 numbers. Increasing complexity from simple to compound patterns.

#### 6.3 Repeating Patterns
- **Name:** Repeating Patterns
- **URL:** `/patterns/repeating`
- **Functional Description:** Color/shape repeating patterns (ABAB, ABCABC). Student continues pattern by selecting correct next element. Create-your-own mode.

#### 6.4 Ordinal Numbers
- **Name:** First, Second, Third
- **URL:** `/patterns/ordinal-numbers`
- **Functional Description:** Line of objects. "Click the 3rd item." "What position is the red ball?" Connects ordinal words to positions.

#### 6.5 Skip Counting by 2s
- **Name:** Count by 2s
- **URL:** `/patterns/skip-count-2`
- **Functional Description:** Interactive number line hopping by 2s. Fill-in-the-sequence practice. Visual of pairing objects. Foundation for 2× table.

#### 6.6 Skip Counting by 5s
- **Name:** Count by 5s
- **URL:** `/patterns/skip-count-5`
- **Functional Description:** Skip counting with hand/tally visuals. Clock minute hand connection. Fill sequences. Foundation for 5× table.

#### 6.7 Skip Counting by 10s
- **Name:** Count by 10s
- **URL:** `/patterns/skip-count-10`
- **Functional Description:** Ten-frames and hundred chart skip counting. Fastest pattern. Foundation for 10× table and place value.

#### 6.8 Multiplication Connection
- **Name:** Patterns to Multiplication
- **URL:** `/patterns/mult-connection`
- **Functional Description:** Bridge page showing how 5+5+5 = 3×5. Visual transformation from repeated addition to multiplication expression.

---

## 7. Multiplication Strategies

### TOC Page

- **Name:** Multiplication Methods
- **URL:** `/multiplication`
- **Functional Description:** TOC for multiplication exercises. Highlights box method as primary strategy. Cards for each approach. Progress tracking with fluency metrics.

### Practice Pages

#### 7.1 Multiplication as Repeated Addition
- **Name:** Repeated Addition
- **URL:** `/multiplication/repeated-addition`
- **Functional Description:** Visual groups being added. "3 groups of 4" shown as 4+4+4. Student writes both forms. Animation of groups combining.

#### 7.2 Arrays and Grouping
- **Name:** Array Builder
- **URL:** `/multiplication/arrays`
- **Functional Description:** Interactive array creation. Given 3×4, student builds 3 rows of 4. Click to count total. Rotate array to show commutative property.

#### 7.3 Multiplication with Manipulatives
- **Name:** Multiplication Objects
- **URL:** `/multiplication/manipulatives`
- **Functional Description:** Virtual manipulatives (counters, blocks) for grouping. Create groups to solve problems. Free exploration and guided challenges.

#### 7.4 Multiplication Tables
- **Name:** Times Tables
- **URL:** `/multiplication/times-tables`
- **Functional Description:** Interactive multiplication table (1-12). Click cell to practice that fact. Highlight patterns. Fill-in-the-blank table completion mode.

#### 7.5 Systematic Fact Practice
- **Name:** Fact Families
- **URL:** `/multiplication/fact-families`
- **Functional Description:** Practice facts by family (2×, 3×, etc.). Mastery tracking per family. Spaced repetition for struggling facts.

#### 7.6 Box Method Introduction
- **Name:** Box Method Basics
- **URL:** `/multiplication/box-method-intro`
- **Functional Description:** **Core method page.** Introduces 2×2 box for two-digit multiplication. Example: 83×52 breaks into 80×50, 80×2, 3×50, 3×2. Step-by-step guided construction.

#### 7.7 Box Method Practice
- **Name:** Box Method Practice
- **URL:** `/multiplication/box-method-practice`
- **Functional Description:** Practice problems using box method. Draw grid, fill sections, sum for answer. Scaffolded hints available. Variety of two-digit problems.

#### 7.8 Box Method with Subscripts
- **Name:** Advanced Box Method
- **URL:** `/multiplication/box-method-advanced`
- **Functional Description:** Extended box method with zero-subscript notation (8_1 = 80, 7_-1 = 0.7). For 3+ digit and decimal multiplication. Diagonal summing technique.

#### 7.9 Decimal Multiplication with Box
- **Name:** Decimal Box Method
- **URL:** `/multiplication/decimal-box`
- **Functional Description:** Apply subscript box method to decimals. Example: 123.4 × 67 with proper decimal tracking. Visual grid with subscript addition along diagonals.

#### 7.10 Real-World Multiplication
- **Name:** Multiplication Word Problems
- **URL:** `/multiplication/word-problems`
- **Functional Description:** Story problems requiring multiplication. Area, grouping, rate contexts. Extract numbers, apply appropriate strategy, verify answer.

---

## 8. Division

### TOC Page

- **Name:** Division Basics
- **URL:** `/division`
- **Functional Description:** TOC for foundational division concepts. Cards for sharing vs. grouping approaches. Progress tracking. Links to multiplication as inverse.

### Practice Pages

#### 8.1 Division as Sharing
- **Name:** Fair Sharing
- **URL:** `/division/sharing`
- **Functional Description:** Distribute items equally among groups. "12 cookies for 3 friends." Drag items one-by-one into groups. See division as result.

#### 8.2 Division as Grouping
- **Name:** Making Groups
- **URL:** `/division/grouping`
- **Functional Description:** "How many groups of 4 can you make from 12?" Circle groups of specified size. Count total groups as quotient.

#### 8.3 Visual Division Models
- **Name:** Division Visualizer
- **URL:** `/division/visual-models`
- **Functional Description:** Array and area models for division. Given total and one dimension, find other dimension. Connect to multiplication arrays.

#### 8.4 Basic Division Facts
- **Name:** Division Facts
- **URL:** `/division/basic-facts`
- **Functional Description:** Flashcard practice for division facts within 100. Organized by divisor. Tracks mastery. Links each to related multiplication fact.

#### 8.5 Division Word Problems
- **Name:** Division Word Problems
- **URL:** `/division/word-problems`
- **Functional Description:** Simple division scenarios (equal sharing, grouping). Identify dividend, divisor, solve. Visual support available.

#### 8.6 Division Fluency
- **Name:** Division Fluency Drill
- **URL:** `/division/fluency`
- **Functional Description:** Timed division fact practice. Speed and accuracy tracking. Adaptive difficulty. Personal best records.

---

## 9. Division Strategies

### TOC Page

- **Name:** Division Methods
- **URL:** `/division-strategies`
- **Functional Description:** TOC for division strategy exercises. Highlights inverse relationship with multiplication. Progress tracking for each method.

### Practice Pages

#### 9.1 Division as Inverse of Multiplication
- **Name:** Multiplication Reversal
- **URL:** `/division-strategies/inverse`
- **Functional Description:** Shows multiplication fact, student provides related division facts. 4×5=20 → 20÷4=? and 20÷5=?. Fact family triangles.

#### 9.2 Repeated Subtraction
- **Name:** Subtract to Divide
- **URL:** `/division-strategies/repeated-subtraction`
- **Functional Description:** Visual of repeatedly subtracting divisor from dividend. Count subtractions as quotient. Step-by-step animation.

#### 9.3 Division with Manipulatives
- **Name:** Division Objects
- **URL:** `/division-strategies/manipulatives`
- **Functional Description:** Virtual manipulatives for division exploration. Group counters, distribute equally. Free play and guided problems.

#### 9.4 Area Model Division
- **Name:** Area Division
- **URL:** `/division-strategies/area-model`
- **Functional Description:** Rectangle with area given. One side known, find other side. Visual connection to multiplication area model.

---

## 10. Fractions

### TOC Page

- **Name:** Fractions
- **URL:** `/fractions`
- **Functional Description:** TOC for fraction concepts. Visual fraction bar previews. Progress through part-whole to operations. Conceptual progression emphasized.

### Practice Pages

#### 10.1 Parts of a Whole
- **Name:** Understanding Fractions
- **URL:** `/fractions/parts-whole`
- **Functional Description:** Shapes divided into equal parts. Shade requested fraction. Identify fraction from shaded region. Circle, rectangle, and other shapes.

#### 10.2 Compare Fractions
- **Name:** Fraction Comparison
- **URL:** `/fractions/compare`
- **Functional Description:** Two fractions displayed with visual models. Student selects greater/lesser/equal. Side-by-side fraction bars for comparison.

#### 10.3 Halves and Quarters
- **Name:** Halves and Quarters
- **URL:** `/fractions/halves-quarters`
- **Functional Description:** Focused practice on 1/2, 1/4, 2/4, 3/4. Real-world contexts (pizza slices, pie pieces). Identify and create these common fractions.

#### 10.4 Real-World Fractions
- **Name:** Fractions Around Us
- **URL:** `/fractions/real-world`
- **Functional Description:** Photos and scenarios with fractions (recipe measurements, sharing food). Identify fraction in context. Practical applications.

#### 10.5 Equivalent Fractions
- **Name:** Equivalent Fractions
- **URL:** `/fractions/equivalent`
- **Functional Description:** Visual proof that 1/2 = 2/4 = 4/8. Fraction wall interactive. Find equivalent fractions by shading. Multiplying/dividing numerator and denominator.

#### 10.6 Add Fractions (Like Denominators)
- **Name:** Adding Fractions
- **URL:** `/fractions/add-like`
- **Functional Description:** Add fractions with same denominator. Visual fraction bar shows parts combining. 1/4 + 2/4 = 3/4 with animation.

#### 10.7 Subtract Fractions (Like Denominators)
- **Name:** Subtracting Fractions
- **URL:** `/fractions/subtract-like`
- **Functional Description:** Subtract fractions with same denominator. Visual shows parts being removed. 3/4 - 1/4 = 2/4 with animation.

#### 10.8 Fraction Word Problems
- **Name:** Fraction Word Problems
- **URL:** `/fractions/word-problems`
- **Functional Description:** Story problems involving fractions. Sharing scenarios, measurements, portions. Visual model support available.

---

## 11. Decimals

### TOC Page

- **Name:** Decimals
- **URL:** `/decimals`
- **Functional Description:** TOC for decimal concepts. Shows connection to fractions and place value. Visual decimal grid previews. Progress tracking.

### Practice Pages

#### 11.1 Decimals as Parts
- **Name:** Understanding Decimals
- **URL:** `/decimals/parts`
- **Functional Description:** 10×10 grid shading for decimals. 0.1 = one column, 0.01 = one square. Connect visual to decimal notation.

#### 11.2 Decimals and Fractions
- **Name:** Decimals to Fractions
- **URL:** `/decimals/fraction-connection`
- **Functional Description:** Convert between 0.5 and 1/2, 0.25 and 1/4. Side-by-side visual representations. Two-way conversion practice.

#### 11.3 Tenths Practice
- **Name:** Tenths
- **URL:** `/decimals/tenths`
- **Functional Description:** Number line with tenths marked. Identify decimal from position. Place decimal on number line. 0.1 through 0.9 focus.

#### 11.4 Hundredths Practice
- **Name:** Hundredths
- **URL:** `/decimals/hundredths`
- **Functional Description:** Extended to two decimal places. 100-grid visualization. Money connection (pennies to dollars).

#### 11.5 Compare Decimals
- **Name:** Comparing Decimals
- **URL:** `/decimals/compare`
- **Functional Description:** Two decimals displayed. Student identifies greater/lesser/equal. Visual grid comparison. Common misconception handling (0.5 vs 0.50).

#### 11.6 Order Decimals
- **Name:** Ordering Decimals
- **URL:** `/decimals/order`
- **Functional Description:** Arrange 3-5 decimals from least to greatest (or reverse). Drag-and-drop interface. Number line verification.

---

## 12. Division Strategies (Continued)

### TOC Page

- **Name:** Advanced Division
- **URL:** `/division-advanced`
- **Functional Description:** TOC for advanced division techniques. Long division focus. Remainder and estimation skills. Progress tracking.

### Practice Pages

#### 12.1 Long Division (Single Divisor)
- **Name:** Long Division Basics
- **URL:** `/division-advanced/long-division`
- **Functional Description:** Step-by-step long division with single-digit divisor. Guided mode shows divide-multiply-subtract-bring down. Practice mode for independence.

#### 12.2 Division with Remainders
- **Name:** Remainders
- **URL:** `/division-advanced/remainders`
- **Functional Description:** Problems that don't divide evenly. Understand remainder concept. Visual of "leftover" items. Write answer with remainder (R).

#### 12.3 Estimation for Division
- **Name:** Division Estimation
- **URL:** `/division-advanced/estimation`
- **Functional Description:** Round dividend and divisor to estimate quotient. Compare estimate to exact answer. Build number sense for checking reasonableness.

#### 12.4 Multi-Step Division Problems
- **Name:** Multi-Step Division
- **URL:** `/division-advanced/multi-step`
- **Functional Description:** Word problems requiring multiple operations including division. Plan solution steps. Show work interface.

#### 12.5 Mental Division Strategies
- **Name:** Mental Division
- **URL:** `/division-advanced/mental-math`
- **Functional Description:** Quick division tricks (halving, dividing by 10, 100). Timed practice. Strategy hints. Build automaticity.

#### 12.6 Decimal Quotients
- **Name:** Decimal Answers
- **URL:** `/division-advanced/decimal-quotients`
- **Functional Description:** Division resulting in decimal answers. Continue long division past decimal point. Connect to remainders as decimals.

---

## 13. Full Fractions and Decimals

### TOC Page

- **Name:** Advanced Fractions & Decimals
- **URL:** `/fractions-decimals-advanced`
- **Functional Description:** TOC for advanced fraction/decimal operations. Mixed numbers, unlike denominators, operations. Progress tracking by skill.

### Practice Pages

#### 13.1 Mixed Numbers
- **Name:** Mixed Numbers
- **URL:** `/fractions-decimals-advanced/mixed-numbers`
- **Functional Description:** Understand 2 1/2 as two wholes and one half. Visual with whole shapes plus partial. Identify and create mixed numbers.

#### 13.2 Improper Fractions
- **Name:** Improper Fractions
- **URL:** `/fractions-decimals-advanced/improper`
- **Functional Description:** Fractions greater than 1 (5/4, 7/3). Visual representation spanning multiple wholes. Convert to/from mixed numbers.

#### 13.3 Compare Unlike Denominators
- **Name:** Compare Unlike Fractions
- **URL:** `/fractions-decimals-advanced/compare-unlike`
- **Functional Description:** Compare fractions with different denominators (2/3 vs 3/4). Find common denominator or use visual comparison. Multiple strategies.

#### 13.4 Add Unlike Denominators
- **Name:** Add Unlike Fractions
- **URL:** `/fractions-decimals-advanced/add-unlike`
- **Functional Description:** Find common denominator, convert fractions, add. Step-by-step process with visual support. Practice finding LCD.

#### 13.5 Subtract Unlike Denominators
- **Name:** Subtract Unlike Fractions
- **URL:** `/fractions-decimals-advanced/subtract-unlike`
- **Functional Description:** Same process as addition with subtraction. Common denominator then subtract. Visual fraction bar animation.

#### 13.6 Multiply Fractions by Whole Numbers
- **Name:** Fraction × Whole Number
- **URL:** `/fractions-decimals-advanced/multiply-whole`
- **Functional Description:** 3 × 1/4 = 3/4 shown visually as three quarter pieces. Repeated addition connection. Multiply numerator by whole number.

#### 13.7 Divide Fractions by Whole Numbers
- **Name:** Fraction ÷ Whole Number
- **URL:** `/fractions-decimals-advanced/divide-whole`
- **Functional Description:** 1/2 ÷ 3 = 1/6 shown as splitting half into three parts. Visual model with guided process.

#### 13.8 Decimal-Fraction Equivalents
- **Name:** Decimal-Fraction Convert
- **URL:** `/fractions-decimals-advanced/convert`
- **Functional Description:** Convert between common fractions and decimals. Quick recall for 1/2, 1/4, 1/5, 1/10, etc. Two-way conversion drill.

#### 13.9 Real-World Fraction/Decimal Problems
- **Name:** Applied Fractions & Decimals
- **URL:** `/fractions-decimals-advanced/applications`
- **Functional Description:** Word problems combining fractions and decimals. Recipes, measurements, money. Choose appropriate form for context.

---

## 14. Basic Probability

### TOC Page

- **Name:** Probability
- **URL:** `/probability`
- **Functional Description:** TOC for probability concepts. Visual dice/spinner previews. Likelihood language focus. Progress tracking.

### Practice Pages

#### 14.1 Likelihood Concepts
- **Name:** Likely or Not
- **URL:** `/probability/likelihood`
- **Functional Description:** Scenarios with likely/unlikely/certain/impossible outcomes. "Sun will rise tomorrow" = certain. Categorize events on likelihood scale.

#### 14.2 Probability Language
- **Name:** Probability Words
- **URL:** `/probability/language`
- **Functional Description:** Match probability terms to scenarios. Fill in blanks with correct probability vocabulary. Context-based practice.

#### 14.3 Predict Outcomes
- **Name:** Prediction Practice
- **URL:** `/probability/predict`
- **Functional Description:** Given spinner/bag contents, predict most/least likely outcome. Explain reasoning. Visual probability representations.

#### 14.4 Probability Experiments
- **Name:** Experiment Lab
- **URL:** `/probability/experiments`
- **Functional Description:** Virtual coin flips, dice rolls, spinner spins. Record outcomes. Compare predicted vs actual. Introduction to experimental probability.

#### 14.5 Probability Scenarios
- **Name:** Probability Scenarios
- **URL:** `/probability/scenarios`
- **Functional Description:** Real-world probability questions. Weather, games, selections. Apply probability reasoning to make predictions.

#### 14.6 Probability Word Problems
- **Name:** Probability Word Problems
- **URL:** `/probability/word-problems`
- **Functional Description:** Story problems involving probability concepts. Identify relevant information. Calculate or reason about likelihood.

---

## 15. Data Representation

### TOC Page

- **Name:** Data & Graphs
- **URL:** `/data`
- **Functional Description:** TOC for data analysis exercises. Sample graph previews on cards. Reading and creating graphs. Progress tracking.

### Practice Pages

#### 15.1 Read Bar Graphs
- **Name:** Reading Bar Graphs
- **URL:** `/data/read-bar-graphs`
- **Functional Description:** Given bar graph, answer questions about data. "How many students chose pizza?" Extract numerical information from visual.

#### 15.2 Create Bar Graphs
- **Name:** Create Bar Graphs
- **URL:** `/data/create-bar-graphs`
- **Functional Description:** Given data table, build bar graph. Drag bars to correct heights. Label axes. Choose appropriate scale.

#### 15.3 Read Charts and Tables
- **Name:** Tables & Charts
- **URL:** `/data/tables-charts`
- **Functional Description:** Interpret data from organized tables. Answer questions. Find totals, differences, patterns in tabular data.

#### 15.4 Compare Data
- **Name:** Data Comparison
- **URL:** `/data/compare`
- **Functional Description:** Multiple data sets displayed. Compare using graphs. "Which class read more books?" Comparative analysis practice.

#### 15.5 Solve Graph Problems
- **Name:** Graph Problem Solving
- **URL:** `/data/graph-problems`
- **Functional Description:** Word problems requiring data from graphs. Multi-step problems. Combine graph reading with arithmetic.

#### 15.6 Data Analysis Skills
- **Name:** Data Analysis
- **URL:** `/data/analysis`
- **Functional Description:** Find mean, mode, range for simple data sets. Identify trends. Draw conclusions from data. Summary statistics introduction.

---

## 16. Time Concepts

### TOC Page

- **Name:** Time
- **URL:** `/time`
- **Functional Description:** TOC for time-telling exercises. Analog and digital clock previews. Calendar concepts. Historical timekeeping. Progress tracking.

### Practice Pages

#### 16.1 Tell Time (Hour/Half-Hour)
- **Name:** Hour & Half-Hour
- **URL:** `/time/hour-half`
- **Functional Description:** Analog clock shows time. Student selects/types time in digital format. Focus on o'clock and :30 times. Interactive clock hands.

#### 16.2 Days and Months
- **Name:** Calendar Basics
- **URL:** `/time/calendar`
- **Functional Description:** Identify days of week in order. Months of year. Navigate calendar grid. "What day comes after Tuesday?"

#### 16.3 Time Word Problems
- **Name:** Time Word Problems
- **URL:** `/time/word-problems`
- **Functional Description:** "Class starts at 9:00 and ends at 10:30. How long?" Elapsed time calculations. Schedule-based problems.

#### 16.4 Analog Clock Reading
- **Name:** Analog Clock Mastery
- **URL:** `/time/analog`
- **Functional Description:** Extended analog practice including quarter hours, 5-minute increments, exact minutes. Hour and minute hand recognition.

#### 16.5 Digital Clock Reading
- **Name:** Digital Time
- **URL:** `/time/digital`
- **Functional Description:** Match digital displays to analog clocks. Read digital time aloud (practice format). AM/PM introduction.

#### 16.6 Analog-Digital Conversion
- **Name:** Clock Conversion
- **URL:** `/time/conversion`
- **Functional Description:** Given analog, write digital. Given digital, set analog clock hands. Two-way conversion practice.

#### 16.7 Real-World Time
- **Name:** Time Applications
- **URL:** `/time/applications`
- **Functional Description:** Schedules, timetables, planning activities. "Movie starts at 3:15, it's 2:45 now. How long until it starts?"

#### 16.8 Historical Timekeeping
- **Name:** Sundials & History
- **URL:** `/time/history`
- **Functional Description:** Explore sundials, water clocks, historical timekeeping. Interactive sundial simulation. Cultural time concepts. Educational/exploratory focus.

---

## 17. Money Concepts

### TOC Page

- **Name:** Money
- **URL:** `/money`
- **Functional Description:** TOC for money skills. Coin/bill identification through financial literacy progression. Real-world shopping simulations. Progress tracking.

### Practice Pages

#### 17.1 Identify Coins and Bills
- **Name:** Coin & Bill ID
- **URL:** `/money/identify`
- **Functional Description:** Visual identification of US currency. Name and value of each coin/bill. Front and back recognition. Sorting by value.

#### 17.2 Count Money
- **Name:** Counting Money
- **URL:** `/money/counting`
- **Functional Description:** Given collection of coins/bills, calculate total. Drag to count. Multiple counting strategies. Progressive difficulty.

#### 17.3 Make Change
- **Name:** Making Change
- **URL:** `/money/change`
- **Functional Description:** Item costs $X, customer pays $Y. Calculate change. Count up method. Visual coin/bill selection for change.

#### 17.4 Money Word Problems
- **Name:** Money Word Problems
- **URL:** `/money/word-problems`
- **Functional Description:** Shopping scenarios, saving, comparing prices. Multi-step money calculations. Real-world contexts.

#### 17.5 Shopping Scenarios
- **Name:** Shopping Practice
- **URL:** `/money/shopping`
- **Functional Description:** Virtual store simulation. Select items, calculate total, pay with cash, receive change. Budget constraints option.

#### 17.6 Budgeting Basics
- **Name:** Simple Budgeting
- **URL:** `/money/budgeting`
- **Functional Description:** Given allowance/income, plan spending across categories. Track spending vs budget. Introduction to financial planning.

#### 17.7 Financial Decisions
- **Name:** Money Choices
- **URL:** `/money/decisions`
- **Functional Description:** Scenario-based decision making. "Save for big item or buy small item now?" Needs vs wants. Consequence exploration.

#### 17.8 Real-World Finance
- **Name:** Financial Literacy
- **URL:** `/money/financial-literacy`
- **Functional Description:** Comprehensive financial scenarios. Comparing prices, sales tax awareness, saving goals. Practical money management skills.

---

## 18. Basic Algebraic Thinking

### TOC Page

- **Name:** Algebraic Thinking
- **URL:** `/algebra`
- **Functional Description:** TOC for algebraic reasoning exercises. Pattern recognition to variable introduction. Problem-solving progression. Progress tracking.

### Practice Pages

#### 18.1 Number Pattern Recognition
- **Name:** Advanced Patterns
- **URL:** `/algebra/patterns`
- **Functional Description:** More complex number patterns. Two-step rules. Growing patterns. Identify and extend with rule explanation.

#### 18.2 Number Relationships
- **Name:** Number Relationships
- **URL:** `/algebra/relationships`
- **Functional Description:** "If A is 3 more than B, and B is 5, what is A?" Relationship statements to equations. Visual balance models.

#### 18.3 Missing Number Problems
- **Name:** Find the Missing Number
- **URL:** `/algebra/missing-number`
- **Functional Description:** ☐ + 5 = 12, 3 × ☐ = 15. Solve for unknown using inverse operations. Box/blank as variable precursor.

#### 18.4 Pattern Building
- **Name:** Create Patterns
- **URL:** `/algebra/build-patterns`
- **Functional Description:** Create patterns given rules. Design growing patterns. Describe pattern in words and numbers.

#### 18.5 Input-Output Tables
- **Name:** Function Tables
- **URL:** `/algebra/input-output`
- **Functional Description:** Given input-output pairs, find rule. Apply rule to new inputs. Introduction to function concept.

#### 18.6 Balance Problems
- **Name:** Balance Equations
- **URL:** `/algebra/balance`
- **Functional Description:** Visual balance scale with shapes/numbers. Keep balance while solving for unknown. Equality concept reinforcement.

#### 18.7 Simple Equation Solving
- **Name:** Solve Simple Equations
- **URL:** `/algebra/equations`
- **Functional Description:** x + 4 = 10 style problems. Use inverse operations. Check solutions by substitution. Bridge to formal algebra.

---

## Implementation Notes

### Shared Components Needed

1. **Number Pad Component** - Reusable input for entering numbers
2. **Progress Tracker** - Tracks completion and accuracy per page
3. **Visual Manipulatives** - Draggable objects, counters, blocks
4. **Fraction Bars** - Reusable fraction visualization
5. **Number Line** - Interactive zoomable number line
6. **Timer Component** - For timed drills with speed tracking
7. **Feedback System** - Immediate correct/incorrect with explanations

### Special Implementation: Abacus Method

The regrouping pages (`/regrouping/left-right-addition` and `/regrouping/left-right-subtraction`) require special input handling:
- Sequential digit entry (left-to-right)
- Spacebar or button for "carry" indication
- "x" key or button for "borrow" indication
- Real-time feedback on each digit
- Step-by-step guided mode showing complement calculations

### Special Implementation: Box Method

The multiplication box method pages require:
- Dynamic grid generation (2×2, 3×3, etc.)
- Subscript notation for place values
- Diagonal highlighting for partial product sums
- Step-by-step fill mode
- Auto-calculation verification

---

## Page Count Summary

| Category | TOC Page | Practice Pages | Total |
|----------|----------|----------------|-------|
| Counting | 1 | 7 | 8 |
| Geometry | 1 | 4 | 5 |
| Measurement | 1 | 5 | 6 |
| Basic Operations | 1 | 9 | 10 |
| Regrouping | 1 | 8 | 9 |
| Patterns | 1 | 8 | 9 |
| Multiplication | 1 | 10 | 11 |
| Division | 1 | 6 | 7 |
| Division Strategies | 1 | 4 | 5 |
| Fractions | 1 | 8 | 9 |
| Decimals | 1 | 6 | 7 |
| Advanced Division | 1 | 6 | 7 |
| Advanced Fractions/Decimals | 1 | 9 | 10 |
| Probability | 1 | 6 | 7 |
| Data | 1 | 6 | 7 |
| Time | 1 | 8 | 9 |
| Money | 1 | 8 | 9 |
| Algebra | 1 | 7 | 8 |
| **TOTAL** | **18** | **125** | **143** |

---

## Priority Order for Implementation

1. **Phase 1 - Core Arithmetic**
   - Basic Operations (counting, simple add/subtract)
   - Regrouping (with abacus method - key differentiator)
   
2. **Phase 2 - Multiplication & Division**
   - Multiplication (with box method - key differentiator)
   - Division basics
   
3. **Phase 3 - Fractions & Decimals**
   - Fractions
   - Decimals
   - Advanced Fractions/Decimals
   
4. **Phase 4 - Supporting Skills**
   - Patterns & Sequences
   - Geometry
   - Measurement
   
5. **Phase 5 - Applied Math**
   - Time
   - Money
   - Data & Probability
   - Algebraic Thinking

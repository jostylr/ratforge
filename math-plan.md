# Math Plan

> Historical component design, classified 2026-09-19. This is not the active
> RiX execution queue, and unchecked items are not verified missing features.
> The umbrella `ratmath/WORK_PLAN.md` records legacy/support work under later
> product-scope decisions. Maintain compatibility; do not start a second parser,
> evaluator, or publishing architecture from this older plan.

This document outlines the mathematical framework and exercise design for RatForge.

## Core Mathematical Concepts

###  Basic counting and number recognition

- Recognize numbers 1-20
- Count objects accurately
- Match numbers to quantities
- Understand one-to-one correspondence
- Compare quantities (more, less, same)

- Explore placement using containers to put objects in and out and containers of containers. 
- Look at estimates of piles and roughly what buckets they might fit in

### Basic geometry (shapes, sizes)

- Identify basic shapes (circle, square, triangle, rectangle)
- Sort shapes by attributes
- Compare sizes (big, small, bigger, smaller)
- Recognize shapes in everyday objects


### Measurement concepts (more/less, bigger/smaller)
- Compare quantities using more/less
- Order objects by size (big, small, bigger, smaller)
- Use comparative language in context
- Match quantities to descriptive terms
- Practice with real objects and visual comparisons



### Simple addition and subtraction

- Add within 10 using objects or drawings
- Subtract within 10 using objects or drawings
- Understand addition as putting together, subtraction as taking apart
- Use number bonds to 10
- Solve simple word problems involving addition and subtraction
- Understand commutative property of addition
- Practice mental math strategies for basic addition and subtraction
- Build fluency with basic addition and subtraction facts

### Addition and subtraction with regrouping

- Memorize addition of single digits up to 10
- Learn addition from left to right with carrying
- Practice subtraction with borrowing
- Build fluency with regrouping problems
- Solve word problems involving regrouping
- Develop automaticity with regrouping facts
- Build confidence with multi-digit problems
- Apply regrouping skills to real-world scenarios
- Connect regrouping to everyday situations like shopping or sharing
- Practice with visual models and manipulatives
- Review and reinforce regrouping concepts through varied practice
- Build problem-solving stamina with multi-step regrouping problems
- Develop accuracy and speed with regrouping calculations
- Build confidence with increasingly complex regrouping problems

The addition and subtraction concepts should be based on abacus thinking as outlines in Speed Mathematics Simplified. Specifically, something like 
17 +29 should first be explained as 30 (10+20) then 7+9=16, then combine to get 30+16=46 and then implemented mechanically by doing 3 for the tens, then seeing 7+9 as being more than 10, the complement of 9 is 1 and that is subtracted from the 7 to get 6 with a 1 being carried over to the tens leading it to be 4. For numerical entry, the student would type 3 for the left first, then when they see the carry, they hit the space bar (or button on entrypad for it) and then type 6 for the singles digit. So a main page doing this sequential. 

The subtraction works similarly also going from left to right. 23 - 16: first do 20 - 10 = 10, then seeing 3 is less than 6, we see the need to borrow and we do the complement of 6 (which is 4) so 3+4 = 7 and we need to take one from the tens. Mechanically, the students first types 1 for the tens place, then sees the need to borrow, typing x (or button for x) and types 7 for the ones place.

So need a practice for complements and then practice borrowing strategies for multi-digit numbers. 

### Number patterns and sequences

- Identify and extend simple number patterns
- Recognize repeating patterns
- Create simple patterns using objects or drawings
- Understand ordinal numbers (first, second, third, etc.)
- Practice skip counting by 2s, 5s, and 10s
- Build fluency with basic multiplication facts (2s, 5s, 10s)
- Understand the relationship between addition and multiplication
- Solve simple multiplication word problems
- Practice multiplication with visual models and arrays

### Multiplication strategies

- Learn multiplication as repeated addition
- Use arrays and grouping to visualize multiplication
- Practice multiplication with manipulatives
- Build fluency with multiplication tables
- Practice multiplication facts systematically
- Develop automaticity with multiplication facts
- Apply multiplication to solve real-world problems
- Connect multiplication to area and grouping concepts
- Build confidence with multiplication problem-solving
- Review and reinforce multiplication concepts through varied practice

For the basic multiplication strategy, use the box method for visual representation and step-by-step breakdown.

In particular, 83*52 would have four sections in the box: 80*50, 80*2, 3*50, and 3*2.
Visually, it would be a 2x2 grid with the top row showing 80 and 3, and the left column showing 50 and 2.

This then gets amped up to more digits with a 3x3 grid for three-digit numbers like 123*456, but the number of zeroes gets denoted with subscripts, so 8_1 represents 80 while 7_-1 would be 0.7.  Then the grid allows for quick addition of the number of zeros and leads to a diagonal to sum up the partial products.

For examples 123.4 * 67, the grid would have 9 sections with appropriate zero subscripts, and the diagonal sum would account for decimal placement.

|       | 1_2  | 2_1  | 3  | 4_-1 |
|-------|------|------|------|------|
|6_1    |  6_3 |  12_2 |  18_1 |  24_0 |
| 7     |  7_2 |  14_1 |  21_0 |  28_-1 |
This shows how the decimal places are tracked with subscripts and how they sum along the diagonals.
Then the partial sums are 6_3, 19_2, 32_1, 45_0, 28_-1.

Adding these up with proper decimal placement gives us the final result: 6000 + 1900 + 320 + 45 + 0.28 = 8265.28.



- Learn to break numbers into tens and ones
- Use area models to visualize multiplication
- Practice multiplying two-digit numbers using the box method
- Connect the box method to traditional multiplication algorithms
- Build fluency with the box method for various multiplication problems
- Develop accuracy and speed with box method calculations
- Build confidence with the box method approach

### Division

- Understand division as sharing and grouping
- Use visual models to represent division problems
- Practice basic division facts with small numbers
- Connect division to multiplication concepts
- Solve simple division word problems
- Build fluency with division algorithms

### Division strategies

- Learn division as the inverse of multiplication
- Use repeated subtraction to understand division
- Practice division with manipulatives and visual models
- Build fluency with basic division facts
- Apply division to solve real-world problems
- Connect division to area and grouping concepts
- Build confidence with division problem-solving
- Review and reinforce division concepts through varied practice


### Fractions

- Understand fractions as parts of a whole
- Identify and compare fractions using visual models
- Practice with halves, quarters, and simple fractions
- Connect fractions to real-world examples
- Build fluency with basic fraction concepts
- Understand equivalent fractions
- Add and subtract simple fractions with like denominators
- Solve word problems involving fractions
- Build confidence with fraction operations
- Review and reinforce fraction concepts through varied practice

### Decimals

- Understand decimals as parts of a whole
- Connect decimals to fractions and place value
- Practice with tenths and hundredths
- Compare and order decimal numbers
- Build fluency with basic decimal concepts
- Build confidence with decimal operations
- Review and reinforce decimal concepts through varied practice

### Division strategies (continued)

- Master long division with single-digit divisors
- Practice division with remainders
- Use estimation to check division answers
- Apply division to multi-step word problems
- Build automaticity with division facts
- Develop mental math strategies for division
- Solve division problems with decimal answers
- Work with division in real-world contexts

### Full Fractions and Decimals

- Extend fraction understanding to mixed numbers
- Convert between improper fractions and mixed numbers
- Compare and order fractions with different denominators
- Add and subtract fractions with unlike denominators
- Multiply fractions by whole numbers
- Divide fractions by whole numbers
- Connect fractions to decimal equivalents
- Solve real-world problems involving fractions and decimals    


### Basic probability (likely, unlikely, certain)

- Understand likelihood concepts
- Use probability language in context
- Predict outcomes of simple events
- Practice with probability experiments
- Interpret simple probability scenarios
- Solve basic probability word problems
- Build confidence with probability concepts
- Apply probability to real-world situations

### Data representation (simple charts, graphs)

- Read and create simple bar graphs
- Interpret data from charts and tables
- Compare data using graphs
- Solve problems based on graphical information
- Build data analysis skills
- Review and reinforce data representation concepts
- Build confidence with data analysis skills

### Time concepts (hours, days, weeks)

- Tell time to the hour and half-hour
- Identify days of the week and months
- Solve time-related word problems
- Build confidence with time concepts
- Review and reinforce time concepts through varied practice
- Analog time concepts
- Digital time concepts
- Build confidence with both analog and digital time concepts
- Review and reinforce both analog and digital time concepts through varied practice
- Apply time concepts to real-world scenarios
- Build confidence with time applications
- Sun Dials and other historical timekeeping

### Money concepts (coins, bills, basic value)

- Identify different coins and bills
- Count money amounts
- Make change
- Solve money word problems
- Review and reinforce money concepts through varied practice
- Build confidence with money calculations
- Review and reinforce money concepts through varied practice
- Connect money concepts to real-world shopping scenarios
- Build confidence with real-world money applications
- Apply money concepts to budgeting and planning activities
- Build confidence with financial decision-making skills
- Practice making simple financial decisions
- Build confidence with basic financial literacy skills
- Review and reinforce financial literacy concepts through varied practice
- Connect financial literacy to everyday life situations
- Build confidence with practical financial literacy applications
- Apply financial literacy to real-world budgeting and planning
- Build confidence with comprehensive financial literacy skills
- Review and reinforce comprehensive financial literacy skills through varied practice
- Build confidence with real-world financial literacy applications
- Apply financial literacy to real-world financial management scenarios
- Build confidence with real-world financial planning and management
- Review and reinforce real-world financial planning and management skills through varied practice

### Basic algebraic thinking (patterns, relationships)

- Identify and extend simple number patterns
- Recognize relationships between numbers
- Solve simple missing number problems
- Build pattern recognition skills
- Review and reinforce algebraic thinking concepts through varied practice
- Build confidence with basic algebraic concepts
- Apply algebraic thinking to simple real-world problems
- Build confidence with algebraic problem-solving skills
- Review and reinforce algebraic problem-solving skills through varied practice
- Build confidence with comprehensive algebraic thinking skills

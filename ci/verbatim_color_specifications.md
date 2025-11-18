# Verbatim Color Palette - Technical Specifications

## Recommended Palette: "Modern Depth"

### Primary Colors

**Forest Ink** - `#1E3A32`
- RGB: 30, 58, 50
- Usage: Primary text, headings, dark backgrounds, footer
- Conveys: Depth, authority, trust
- Pairs with: Cream for high contrast

**Slate** - `#4A5859`
- RGB: 74, 88, 89
- Usage: Secondary text, borders, dividers, captions
- Conveys: Sophistication, restraint
- Contrast ratio with Cream: 7.2:1 (AA compliant)

**Cream** - `#FAF8F5`
- RGB: 250, 248, 245
- Usage: Primary backgrounds, cards, light sections
- Conveys: Warmth, approachability
- Note: Slightly warmer than pure white

### Accent Colors

**Coral** - `#FF6B58`
- RGB: 255, 107, 88
- Usage: CTAs, links, highlights, emphasis
- Conveys: Energy, warmth, action
- Use sparingly for maximum impact
- Hover state: `#E5604E` (darker by 10%)

**Sage** - `#8BA888`
- RGB: 139, 168, 136
- Usage: Success states, secondary accents, data viz
- Conveys: Growth, calm, trustworthy
- Complements Coral without competing

### Semantic Colors

**Success** - `#8BA888` (Sage)
**Warning** - `#E89F3C` 
**Error** - `#D64545`
**Info** - `#4A7C8C`

### Grays (Extended Palette)

**Near Black** - `#1A1D20`
- For deepest text, highest contrast needs

**Medium Gray** - `#6B7280`  
- Placeholder text, disabled states

**Light Gray** - `#E5E7EB`
- Subtle borders, dividers

**Off White** - `#F9FAFB`
- Alternative background, cards on cream

---

## Alternative Palettes for Comparison

### Option 1: "Grounded Authority"

**Base:**
- Deep Navy: `#1B2B3A`
- Charcoal: `#3A4550`
- Warm Stone: `#F5F3EF`

**Accent:**
- Terracotta: `#D96846`

**Character:** Most conservative. Banking/finance-appropriate. Very trustworthy.

---

### Option 3: "Sharp Clarity"

**Base:**
- Ink Black: `#1A1D23`
- Cool Grey: `#6B7280`
- Off-White: `#F9FAFB`

**Accent:**
- Electric Blue: `#3B82F6`

**Character:** Most modern/tech. Slightly colder but very clean.

---

## Color Usage Guidelines

### Do's:
✓ Use Coral for primary CTAs only
✓ Keep Forest Ink for all body text
✓ Use Cream as primary background
✓ Use Slate for secondary UI elements
✓ Let the accent color breathe (don't overuse)

### Don'ts:
✗ Don't use Coral for large areas
✗ Don't use multiple accent colors in same view
✗ Don't use pure black (#000000)
✗ Don't use Coral text on Cream (contrast too low)
✗ Don't create gradients with brand colors

---

## Accessibility Compliance

### Text Contrast Ratios (WCAG 2.1)

**Forest Ink on Cream:**
- Ratio: 11.8:1 ✓ AAA (excellent)

**Slate on Cream:**
- Ratio: 7.2:1 ✓ AA Large (good)

**Coral on Cream:**
- Ratio: 3.1:1 ✗ Fails AA (use for accents only, not body text)

**Coral on Forest Ink:**
- Ratio: 4.8:1 ✓ AA (acceptable for CTAs)

**Sage on Cream:**
- Ratio: 4.2:1 ✓ AA Large (good for secondary elements)

### Recommendations:
- Never use Coral for text unless on dark background
- Use Forest Ink for all readable text
- Coral buttons must have sufficient size (44x44px minimum)
- Include focus indicators with 3px outline in accent color

---

## Print Specifications

### CMYK Conversions (Approximate)

**Forest Ink** `#1E3A32`
- C: 70, M: 40, Y: 50, K: 60

**Coral** `#FF6B58`  
- C: 0, M: 60, Y: 45, K: 0

**Cream** `#FAF8F5`
- C: 2, M: 2, Y: 4, K: 0

### Pantone Alternatives (closest matches)
- Forest Ink: Pantone 5535 C
- Coral: Pantone 2027 C  
- Cream: Pantone 9224 C

---

## Dark Mode Adaptation (Optional Future)

If implementing dark mode:

**Background:** `#1A1D20` (Near Black)
**Text:** `#F5F3EF` (Warm Stone)  
**Accent:** Keep Coral `#FF6B58` (adjust brightness if needed)
**Borders:** `#3A4550` (Charcoal)

Maintain same semantic relationships, just inverted.

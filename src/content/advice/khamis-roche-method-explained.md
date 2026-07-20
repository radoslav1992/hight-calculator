---
title: "The Khamis–Roche Method, Explained Without the Jargon"
description: "See how the Khamis–Roche adult-height formula uses age, height, weight, and parent height—and why its limitations matter."
summary: "A plain-language tour of the non-invasive prediction equation, its inputs, coefficient table, expected error, and appropriate use."
category: "Genetics & science"
readTime: "7 min read"
updated: 2026-07-20
featured: true
faq:
  - question: "Does Khamis–Roche require a bone-age X-ray?"
    answer: "No. The method was designed to estimate adult stature without skeletal age. It uses chronological age, sex, current height, current weight, and mid-parent stature."
  - question: "Why does the formula use different coefficients at each age?"
    answer: "The predictive value of current height, weight, and parent height changes as a child progresses toward adult stature, so the regression weights vary by age and sex."
  - question: "Is Khamis–Roche accurate for every child?"
    answer: "No. It was developed in a specific historical sample of white American children without growth-altering conditions. It is an estimate and is not validated equally across every population or clinical situation."
---

The Khamis–Roche method is popular because it estimates adult stature without a skeletal-age X-ray. It needs information a family can usually measure or look up: the child's age, biological sex, height, weight, and the heights of both biological parents.

Its apparent simplicity hides an important detail. It is not one fixed formula. It is a **set of age- and sex-specific regression equations**.

## The equation in one line

In the original imperial units, the structure is:

`predicted adult height = intercept + (height coefficient × current height) + (weight coefficient × current weight) + (parent coefficient × average parent height)`

Height and average parent height are measured in inches. Weight is measured in pounds. Tallwise accepts metric or US inputs and converts internally before applying the published coefficients.

## Why the coefficients change with age

At age four, much of a child's future growth is still ahead. Parent height and present stature contribute differently to the estimate than they do at age sixteen, when current stature is much closer to adult stature.

The published table changes every six months from age 4 through 17.5. Tallwise linearly interpolates between the two surrounding rows for an age such as 10.3 instead of snapping the child to a whole-year group.

That interpolation makes the display smoother. It does not create new clinical evidence between the original table points.

## What mid-parent stature means here

For Khamis–Roche, mid-parent stature is simply the average of the biological parents' measured heights. This differs from the sex-adjusted Tanner target used as a separate model.

Keeping those ideas separate matters:

- **Khamis–Roche input:** average of mother and father height
- **Tanner target for boys:** parent total plus 13 cm, then divided by two
- **Tanner target for girls:** parent total minus 13 cm, then divided by two

Tallwise calculates each method independently before combining them.

## Where the method came from

H. J. Khamis and A. F. Roche developed the method using longitudinal measurements from the Fels Longitudinal Study. Their paper, [“Predicting adult stature without using skeletal age”](https://pubmed.ncbi.nlm.nih.gov/7936860/), was published in *Pediatrics* in 1994, followed by a coefficient erratum in 1995.

The paper's own limitation is essential: the model was developed for white American children without pathological conditions that alter growth. A responsible implementation should display that scope rather than market the formula as universal.

## Why weight appears in a height equation

Weight can carry information about maturity and body development at a given age, but its coefficient is not a recommendation to gain or lose weight. Changing a child's weight to manipulate the calculator would not make the predicted outcome more valid.

Use a recent, ordinary measurement. Health or nutrition decisions should be based on professional guidance, not on how they move a prediction result.

## What Tallwise adds

Tallwise gives Khamis–Roche the largest share of its composite estimate, then checks it against two different perspectives:

1. A sex-adjusted mid-parent target for a broad genetic anchor.
2. A CDC stature-for-age trajectory based on the child's current standardized position.
3. A deliberately small contextual modifier for broad growth stage, sleep consistency, and nutrition.

The displayed range expands when the methods disagree. That is more honest than hiding disagreement behind a highly precise decimal.

## What the formula cannot see

The equation does not include bone age, diagnosed endocrine or genetic conditions, chronic illness, medication, detailed growth velocity, or the clinician's assessment of puberty. It also cannot correct an inaccurate parent or child measurement.

Even in the population used to develop it, prediction error exists. Final height can fall outside the displayed range. Decimal output reflects calculation precision, not certainty about the future.

## A good way to use it

Measure carefully, save the result, and return after a meaningful interval such as six to twelve months. The comparison may be interesting, but repeated home estimates still do not replace a professionally maintained growth chart.

If a child's growth pattern concerns you, ask a qualified clinician. They can decide whether the pattern fits family history and normal variation or deserves closer evaluation.

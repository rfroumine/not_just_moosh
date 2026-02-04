# 📱 Not Just Moosh — Build Plan & Spec (v1)

## App Overview

**Name:** Not Just Moosh  
**Tagline:** Track and plan your little moosh’s starting solids journey  
**Platform:** Mobile-optimised web app (PWA-style)  
**Icon:** Smiling carrot, fun, cheeky style  

**Core goals**
- Extremely simple, fast, low-friction
- Mobile-first, touch-first
- Parents should be able to use it one-handed
- Ship fast, keep infra cheap, avoid regressions

---

## Core App Structure

Two main views:
1. Checklist
2. Calendar

Navigation:
- Toggle button between views
- Swipe left/right between views
- Persist scroll position per view

---

## Canonical Default Food List

This list is the starting point for all users.

### Allergens
Peanut, Egg, Milk, Wheat, Soy, Fish, Shellfish, Sesame, Tree nuts

### Vegetables
Carrot, Sweet potato, Broccoli, Zucchini, Pumpkin, Spinach, Peas, Green beans, Cauliflower, Beetroot

### Fruit
Banana, Avocado, Apple, Pear, Mango, Blueberries, Strawberries, Peach, Plum, Orange

### Dairy
Yogurt, Cheese, Cottage cheese, Ricotta

### Grains
Rice, Oats, Quinoa, Pasta, Bread

### Protein
Chicken, Beef, Lamb, Turkey, Lentils, Chickpeas, Beans, Tofu

### Other
Olive oil, Herbs, Spices

- Category icons are fixed
- Users can add custom foods (name + category)
- Custom foods immediately appear everywhere

---

## Data Models

### Food
id
name
category
isAllergen
isUserAdded
createdAt
deletedAt (soft delete)

### CalendarEntry
id
foodId
date
texture (enum)
notes?
reaction?
createdAt


### ManualFoodMark
foodId
count = 1
createdAt


---

## Texture Enum

Allowed values:
- puree
- paste
- mashed
- soft chunks
- finger food
- mixed

Texture is selected via dropdown only.

---

## Derived Checklist Logic (CRITICAL)

Checklist state is derived, never stored.

For each food compute:

### timesGiven
- Count of past & present calendar entries
- Plus manual ticks
- Planned (future) entries do NOT count

### lastGivenDate
- Most recent past/present calendar entry
- Display as: **“Last given on 12 Jan”**
- Manual-only ticks leave this blank

### status
- nothing
- started
- done

Rules:
- Non-allergen: done if timesGiven ≥ 1
- Allergen:
  - started if timesGiven = 1–2
  - done if timesGiven ≥ 3

### icons (right side)
- Planned icon: future entry exists
- Reminder icon:
  - Allergens only
  - If not given in >14 days
  - Manual ticks do not satisfy reminder

Food can have multiple icons simultaneously.

---

## Checklist UI

- Checklist grouped by Category Cards
- Each category is a large rounded card
- Inside are stacked Food Cards

Food Card layout:
- Left: status
- Middle: food name
- Right: planned / reminder icons
- Below: “Last given on [date]” if present

Manual tick:
- Adds count = 1
- Does not set lastGivenDate

Users can:
- Add, edit, delete foods
- Manually mark foods as done

---

## Top Summary (Gamified)

At top of app:
- Per category: **X done / Y total**
- Includes user-added foods
- Updates dynamically

---

## Calendar

### Calendar View
- Monthly calendar
- Each day shows colored dots per category present

### Tap a Date
- Shows inline popup under calendar
- Calendar remains visible
- No navigation or scrolling required

Popup shows:
- Food name
- Category
- Texture
- Notes
- Reactions
- Edit / delete actions

Popup is dismissible by clicking outside.

---

## Adding Calendar Entries (Manual)

Flow:
1. Tap date
2. Add Entry popup opens
3. Fields:
   - Food (dropdown + search)
     - Includes all checklist foods
     - If not found, user can add food + category
   - Texture (dropdown)
   - Notes (optional)
   - Reaction (optional)
4. Save

Planned entries:
- Future-dated
- Show planned icon
- Do NOT affect counts or lastGivenDate

---

## Editing & Deleting

- Foods: edit or soft delete
- Calendar entries: edit or delete
- Deletions trigger full recompute of checklist state
- Orphaned historical entries allowed

---

## Baby Profile

- Single baby only
- Store baby name
- Display name in UI
- No DOB

---

## Voice Input (LAST STEP – OPTIONAL)

Voice applies only to calendar entries.

Flow:
1. Date (default today)
2. Food
3. Optional texture / notes / reaction
4. Confirm

Graceful fallback to manual entry.

---

## Design Language

- Pastel colors
- Rounded cards
- Subtle shadows
- Friendly, calm, playful
- Inspired by Tiny Tummies interaction patterns
- Not constrained by Tiny Tummies implementation

---

## Build Order (MANDATED)

1. Canonical data + models
2. Derived checklist logic
3. Checklist UI
4. Calendar UI + inline popup
5. Add / edit / delete flows
6. Summary + gamification
7. Gestures & polish
8. Voice input (optional)

---

## Definition of Success

A parent can:
- Add a food in under 5 seconds
- See daily entries instantly
- Understand progress at a glance
- Feel calm, not overwhelmed

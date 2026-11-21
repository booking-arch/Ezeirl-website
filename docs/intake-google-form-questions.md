# New client intake — Google Form questions

Recreate this as a Google Form owned by **booking@ezeirl.com**.

The wording below is copied from the personal-training questionnaire already in this repo (`config/intake.ts`, plus the existing consent line `INTAKE_CONSENT_LABEL`). Question order matches that file. Do not add medical, injury, or diet questions that are not listed here.

After the form is published:

1. In Google Forms, choose **Send → embed HTML** and copy the iframe `src`.
2. Paste that URL into `INTAKE_GOOGLE_FORM_EMBED_URL` in `config/intake-form.ts`.
3. It must look like `https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true`.

Responses stay in Google Forms. The website does not save them. Leave `INTAKE_ENABLED` unset.

## Form settings

- Form title: New Client Intake & Fitness Questionnaire
- Form description (not a question): the intro and the disclaimer in the next section
- Confirmation message: thank the client and say their coach will review the answers before training
- Do not add a second email field. Question 2 is the email address. Optional Google Forms setting on that question: response validation → Text → Email
- On question 17, set checkbox validation to select at most 3

## Text on the form (not questions)

**Description**

Welcome! Please fill this out as honestly and thoroughly as you can. Your answers help me understand your starting point, health history and goals so I can build a training plan that works for you.

**Disclaimer, under the description**

This questionnaire is not medical advice. If you answered “Yes” to any health question, or you are unsure whether exercise is safe for you, talk to your doctor before starting a program.

## 1. Basic Information

### 1. Full name

- Site id: `fullName`
- Type: short answer
- Required: yes

### 2. Email address

- Site id: `email`
- Type: short answer
- Required: yes
- Response validation: Email

### 3. Phone number

- Site id: `phone`
- Type: short answer
- Required: yes

### 4. Age / Date of birth

- Site id: `ageDob`
- Type: short answer
- Required: yes

### 5. Occupation

- Site id: `occupation`
- Type: short answer
- Required: no

## 2. Health & Medical History

Section description: Safety first. This section is a basic Physical Activity Readiness Questionnaire (PAR-Q).

### 6. Has a doctor ever said that you have a heart condition or recommended only medically supervised physical activity?

- Site id: `parqHeart`
- Type: multiple choice
- Required: yes
- Options:
  - Yes
  - No

### 7. Do you experience chest pain when you engage in physical activity?

- Site id: `parqChestPain`
- Type: multiple choice
- Required: yes
- Options:
  - Yes
  - No

### 8. Do you lose your balance because of dizziness, or do you ever lose consciousness?

- Site id: `parqDizzy`
- Type: multiple choice
- Required: yes
- Options:
  - Yes
  - No

### 9. Do you have any current or past injuries, joint issues (e.g., knees, back, shoulders), or surgeries I should know about?

- Site id: `injuries`
- Type: paragraph
- Required: yes
- Help text: Write “None” if not applicable.

### 10. Are you currently taking any medications that might affect your ability to exercise safely?

- Site id: `medications`
- Type: paragraph
- Required: yes
- Help text: Write “None” if not applicable.

### 11. Are you currently pregnant or have you given birth in the last 6 months?

- Site id: `pregnancy`
- Type: multiple choice
- Required: yes
- Options:
  - Yes
  - No
  - Not applicable

## 3. Current Lifestyle & Fitness Level

### 12. On average, how many days a week do you currently engage in intentional exercise?

- Site id: `exerciseDays`
- Type: multiple choice
- Required: yes
- Options:
  - 0 days (Sedentary)
  - 1 - 2 days (Light activity)
  - 3 - 4 days (Moderate activity)
  - 5+ days (Highly active)

### 13. What type of physical activity do you currently do, or have you done in the past?

- Site id: `pastActivity`
- Type: paragraph
- Required: yes

### 14. On a scale of 1 to 5, how would you rate your daily stress levels?

- Site id: `stress`
- Type: multiple choice
- Required: yes
- Options (1 = Very low, 5 = Extremely high). Google Forms linear scale is this same 1–5 question:
  - 1 (Very low)
  - 2
  - 3
  - 4
  - 5 (Extremely high)

### 15. On average, how many hours of sleep do you get per night?

- Site id: `sleep`
- Type: multiple choice
- Required: yes
- Options:
  - Less than 5 hours
  - 5 - 6 hours
  - 7 - 8 hours
  - More than 8 hours

### 16. How would you describe your current nutrition and eating habits?

- Site id: `nutrition`
- Type: paragraph
- Required: yes

## 4. Goals & Expectations

### 17. What are your primary fitness goals? (Select up to 3)

- Site id: `goals`
- Type: checkboxes
- Required: yes
- Validation: select at most 3
- Options:
  - Fat loss / Weight management
  - Build muscle / Hypertrophy
  - Increase overall strength
  - Improve cardiovascular endurance
  - Improve flexibility / mobility
  - Injury rehab / prevention
  - Sports performance
  - Overall health and energy

### 18. In your own words, what is the single biggest goal you want to achieve in the next 3 to 6 months?

- Site id: `biggestGoal`
- Type: paragraph
- Required: yes

### 19. What has been your biggest hurdle or roadblock to achieving your fitness goals in the past?

- Site id: `hurdle`
- Type: paragraph
- Required: yes

### 20. How will you know when you've reached your goal? (What does success look like to you?)

- Site id: `success`
- Type: paragraph
- Required: yes

## 5. Training Preferences & Logistics

### 21. What days of the week are you available to train?

- Site id: `availableDays`
- Type: checkboxes
- Required: yes
- Options:
  - Mon
  - Tue
  - Wed
  - Thu
  - Fri
  - Sat
  - Sun

### 22. What time of day works best for your sessions?

- Site id: `timeOfDay`
- Type: checkboxes
- Required: yes
- Options:
  - Early Morning (5 AM - 8 AM)
  - Mid-Morning (8 AM - 12 PM)
  - Afternoon (12 PM - 4 PM)
  - Evening (4 PM - 8 PM)

### 23. What coaching style motivates you the most?

- Site id: `coachingStyle`
- Type: multiple choice
- Required: yes
- Options:
  - Drill Sergeant (Push me hard, strict accountability)
  - Educator (Explain the “why” behind the movements)
  - Cheerleader (Positive reinforcement and gentle encouragement)

### 24. Is there any specific exercise or equipment you absolutely hate doing?

- Site id: `dislikes`
- Type: paragraph
- Required: no

### 25. Is there anything else you want me to know before we design your program?

- Site id: `anythingElse`
- Type: paragraph
- Required: no

## 6. Consent

This is the existing consent checkbox (`INTAKE_CONSENT_LABEL`). It is not a new health question.

### 26. I understand this form collects health information, that it is used only to design my training program, and that it is not a substitute for medical advice. I confirm my answers are accurate.

- Site id: `consent`
- Type: checkboxes
- Required: yes
- Options:
  - I understand this form collects health information, that it is used only to design my training program, and that it is not a substitute for medical advice. I confirm my answers are accurate.

## What was not added

- The owner-authored file named in `config/intake.ts` (`New Client Intake & Fitness Questionnaire.docx`) is not in the repo. This list is the schema the site already uses. Nothing from outside that schema was invented.
- `config/coaching.ts` has a separate nutrition-coaching draft. It is not this form. `/intake` is the personal-training questionnaire.
- The site schema also stores a max length on text questions (100, 254, 30, 40, or 2000 characters). Google Forms has no matching field, so those limits are not questions.
- There is no emergency contact, physician name, clearance upload, or signature question in the schema.

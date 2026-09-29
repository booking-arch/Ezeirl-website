/**
 * New-client intake questionnaire (personal training). Single source of truth: the form renders from
 * this schema and the API validates against it, so a question can never exist on one side only.
 * Source document: "New Client Intake & Fitness Questionnaire.docx" (owner-authored).
 * Changing wording or options here requires no component change.
 */

export type IntakeQuestion =
  | { id: string; type: "text" | "email" | "tel"; label: string; required: boolean; max: number; autoComplete?: string }
  | { id: string; type: "textarea"; label: string; required: boolean; max: number; hint?: string }
  | { id: string; type: "yesno"; label: string; required: true }
  | { id: string; type: "radio"; label: string; required: true; options: readonly IntakeOption[] }
  | { id: string; type: "multi"; label: string; required: true; options: readonly IntakeOption[]; maxSelect?: number }
  | { id: string; type: "scale"; label: string; required: true; min: 1; max: 5; lowLabel: string; highLabel: string };

export interface IntakeOption {
  value: string;
  label: string;
}

export interface IntakeSection {
  id: string;
  title: string;
  intro?: string;
  questions: readonly IntakeQuestion[];
}

const YES_NO_NA = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "na", label: "Not applicable" },
] as const;

export const INTAKE_INTRO =
  "Welcome! Please fill this out as honestly and thoroughly as you can. Your answers help me understand your starting point, health history and goals so I can build a training plan that works for you.";

export const INTAKE_SECTIONS: readonly IntakeSection[] = [
  {
    id: "basic",
    title: "Basic Information",
    questions: [
      { id: "fullName", type: "text", label: "Full name", required: true, max: 100, autoComplete: "name" },
      { id: "email", type: "email", label: "Email address", required: true, max: 254, autoComplete: "email" },
      { id: "phone", type: "tel", label: "Phone number", required: true, max: 30, autoComplete: "tel" },
      { id: "ageDob", type: "text", label: "Age / Date of birth", required: true, max: 40, autoComplete: "bday" },
      { id: "occupation", type: "text", label: "Occupation", required: false, max: 100, autoComplete: "organization-title" },
    ],
  },
  {
    id: "health",
    title: "Health & Medical History",
    intro: "Safety first. This section is a basic Physical Activity Readiness Questionnaire (PAR-Q).",
    questions: [
      { id: "parqHeart", type: "yesno", label: "Has a doctor ever said that you have a heart condition or recommended only medically supervised physical activity?", required: true },
      { id: "parqChestPain", type: "yesno", label: "Do you experience chest pain when you engage in physical activity?", required: true },
      { id: "parqDizzy", type: "yesno", label: "Do you lose your balance because of dizziness, or do you ever lose consciousness?", required: true },
      { id: "injuries", type: "textarea", label: "Do you have any current or past injuries, joint issues (e.g., knees, back, shoulders), or surgeries I should know about?", required: true, max: 2000, hint: "Write “None” if not applicable." },
      { id: "medications", type: "textarea", label: "Are you currently taking any medications that might affect your ability to exercise safely?", required: true, max: 2000, hint: "Write “None” if not applicable." },
      { id: "pregnancy", type: "radio", label: "Are you currently pregnant or have you given birth in the last 6 months?", required: true, options: YES_NO_NA },
    ],
  },
  {
    id: "lifestyle",
    title: "Current Lifestyle & Fitness Level",
    questions: [
      {
        id: "exerciseDays",
        type: "radio",
        label: "On average, how many days a week do you currently engage in intentional exercise?",
        required: true,
        options: [
          { value: "0", label: "0 days (Sedentary)" },
          { value: "1-2", label: "1 - 2 days (Light activity)" },
          { value: "3-4", label: "3 - 4 days (Moderate activity)" },
          { value: "5+", label: "5+ days (Highly active)" },
        ],
      },
      { id: "pastActivity", type: "textarea", label: "What type of physical activity do you currently do, or have you done in the past?", required: true, max: 2000 },
      { id: "stress", type: "scale", label: "On a scale of 1 to 5, how would you rate your daily stress levels?", required: true, min: 1, max: 5, lowLabel: "Very low", highLabel: "Extremely high" },
      {
        id: "sleep",
        type: "radio",
        label: "On average, how many hours of sleep do you get per night?",
        required: true,
        options: [
          { value: "<5", label: "Less than 5 hours" },
          { value: "5-6", label: "5 - 6 hours" },
          { value: "7-8", label: "7 - 8 hours" },
          { value: ">8", label: "More than 8 hours" },
        ],
      },
      { id: "nutrition", type: "textarea", label: "How would you describe your current nutrition and eating habits?", required: true, max: 2000 },
    ],
  },
  {
    id: "goals",
    title: "Goals & Expectations",
    questions: [
      {
        id: "goals",
        type: "multi",
        label: "What are your primary fitness goals? (Select up to 3)",
        required: true,
        maxSelect: 3,
        options: [
          { value: "fat-loss", label: "Fat loss / Weight management" },
          { value: "muscle", label: "Build muscle / Hypertrophy" },
          { value: "strength", label: "Increase overall strength" },
          { value: "cardio", label: "Improve cardiovascular endurance" },
          { value: "mobility", label: "Improve flexibility / mobility" },
          { value: "rehab", label: "Injury rehab / prevention" },
          { value: "sports", label: "Sports performance" },
          { value: "health", label: "Overall health and energy" },
        ],
      },
      { id: "biggestGoal", type: "textarea", label: "In your own words, what is the single biggest goal you want to achieve in the next 3 to 6 months?", required: true, max: 2000 },
      { id: "hurdle", type: "textarea", label: "What has been your biggest hurdle or roadblock to achieving your fitness goals in the past?", required: true, max: 2000 },
      { id: "success", type: "textarea", label: "How will you know when you've reached your goal? (What does success look like to you?)", required: true, max: 2000 },
    ],
  },
  {
    id: "logistics",
    title: "Training Preferences & Logistics",
    questions: [
      {
        id: "availableDays",
        type: "multi",
        label: "What days of the week are you available to train?",
        required: true,
        options: [
          { value: "mon", label: "Mon" },
          { value: "tue", label: "Tue" },
          { value: "wed", label: "Wed" },
          { value: "thu", label: "Thu" },
          { value: "fri", label: "Fri" },
          { value: "sat", label: "Sat" },
          { value: "sun", label: "Sun" },
        ],
      },
      {
        id: "timeOfDay",
        type: "multi",
        label: "What time of day works best for your sessions?",
        required: true,
        options: [
          { value: "early-morning", label: "Early Morning (5 AM - 8 AM)" },
          { value: "mid-morning", label: "Mid-Morning (8 AM - 12 PM)" },
          { value: "afternoon", label: "Afternoon (12 PM - 4 PM)" },
          { value: "evening", label: "Evening (4 PM - 8 PM)" },
        ],
      },
      {
        id: "coachingStyle",
        type: "radio",
        label: "What coaching style motivates you the most?",
        required: true,
        options: [
          { value: "drill-sergeant", label: "Drill Sergeant (Push me hard, strict accountability)" },
          { value: "educator", label: "Educator (Explain the “why” behind the movements)" },
          { value: "cheerleader", label: "Cheerleader (Positive reinforcement and gentle encouragement)" },
        ],
      },
      { id: "dislikes", type: "textarea", label: "Is there any specific exercise or equipment you absolutely hate doing?", required: false, max: 2000 },
      { id: "anythingElse", type: "textarea", label: "Is there anything else you want me to know before we design your program?", required: false, max: 2000 },
    ],
  },
];

/** Bump whenever the consent wording below changes; stored with every submission. */
export const INTAKE_CONSENT_VERSION = "2026-09-draft-1";

/** DRAFT wording — attorney review required before INTAKE_ENABLED is turned on (AGENTS.md). */
export const INTAKE_CONSENT_LABEL =
  "I understand this form collects health information, that it is used only to design my training program, and that it is not a substitute for medical advice. I confirm my answers are accurate.";

export const INTAKE_DISCLAIMER =
  "This questionnaire is not medical advice. If you answered “Yes” to any health question, or you are unsure whether exercise is safe for you, talk to your doctor before starting a program.";

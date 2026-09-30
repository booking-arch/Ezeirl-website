import type { CoachingService } from "./coaching";

export type AgreementForm = {
  id: string;
  title: string;
  description: string;
  services: CoachingService[];
  kind: "coaching" | "optional";
  status: "owner-draft" | "outline-only";
};

/**
 * This is a preparation catalog, not legal advice or an active DocuSign catalog.
 * Only the personal-training agreement has owner-supplied full text. The other
 * entries capture requested topics and must be drafted/reviewed before use.
 */
export const AGREEMENT_FORMS: AgreementForm[] = [
  {
    id: "personal-training-agreement",
    title: "Personal Training Agreement & Informed Consent",
    description: "Owner-supplied draft covering participation, health disclosure, exercise risks, consent, client responsibilities, and signature fields. Attorney review required.",
    services: ["personal-training"],
    kind: "coaching",
    status: "owner-draft",
  },
  {
    id: "health-exercise-readiness",
    title: "Health & Exercise Readiness Questionnaire (PAR-Q style)",
    description: "Medical conditions, injuries, surgeries, medications affecting exercise, dizziness/fainting, chest symptoms, joint problems, pregnancy where applicable, physician restrictions, and emergency considerations. Concerning answers route to medical clearance; the trainer does not decide medical safety.",
    services: ["personal-training", "nutrition-coaching"],
    kind: "coaching",
    status: "outline-only",
  },
  {
    id: "emergency-contact-procedures",
    title: "Emergency Contact & Emergency Procedures Authorization",
    description: "Emergency contact, relationship and phone; voluntary allergy/emergency information; authorization to contact emergency services when reasonably necessary; client responsibility for medical expenses.",
    services: ["personal-training", "nutrition-coaching"],
    kind: "coaching",
    status: "outline-only",
  },
  {
    id: "goals-fitness-assessment",
    title: "Client Goals & Fitness Assessment Consent",
    description: "Goals, training experience, limitations, baseline measurements and permission for agreed assessments. Assessments are not medical examinations or diagnoses.",
    services: ["personal-training", "nutrition-coaching"],
    kind: "coaching",
    status: "outline-only",
  },
  {
    id: "nutrition-scope",
    title: "Nutrition & Supplement Scope Acknowledgment",
    description: "Separates general nutrition education/coaching from medical nutrition therapy, diagnosis or treatment, and directs medical/nutrition issues to qualified professionals.",
    services: ["personal-training", "nutrition-coaching"],
    kind: "coaching",
    status: "outline-only",
  },
  {
    id: "cancellation-rescheduling",
    title: "Cancellation, Rescheduling, Late Arrival & No-Show Policy",
    description: "Session duration, cancellation window, late arrivals, no-shows, package expiration, refunds, trainer cancellations and emergencies. Requires specific client acknowledgment; owner terms are not supplied yet.",
    services: ["personal-training", "nutrition-coaching"],
    kind: "coaching",
    status: "outline-only",
  },
  {
    id: "payment-package",
    title: "Payment & Package Agreement",
    description: "Exact price, session count, package expiration, payment schedule, recurring billing (if applicable), refunds, disputes and unused sessions. Owner terms are required; no amounts are assumed.",
    services: ["personal-training", "nutrition-coaching"],
    kind: "coaching",
    status: "outline-only",
  },
  {
    id: "media-release",
    title: "Photo/Video/Testimonial Release (Optional)",
    description: "Separate, granular Yes/No choices for progress photos, social media, website/advertising, testimonials and before/after transformations. Declining must not affect ordinary coaching.",
    services: ["personal-training", "nutrition-coaching"],
    kind: "optional",
    status: "outline-only",
  },
  {
    id: "privacy-client-information",
    title: "Privacy & Client Information Notice",
    description: "What is collected, purpose, storage, access, retention/security and permitted disclosures. Do not label this HIPAA authorization unless legally applicable; attorney review required.",
    services: ["personal-training", "nutrition-coaching"],
    kind: "coaching",
    status: "outline-only",
  },
  {
    id: "communications-electronic-records",
    title: "Communication & Electronic Records Consent",
    description: "Client-selected text/email/app methods, ordinary electronic communication privacy limits, and electronic document/signature consent.",
    services: ["personal-training", "nutrition-coaching"],
    kind: "coaching",
    status: "outline-only",
  },
  {
    id: "location-equipment",
    title: "Training Location / Gym & Equipment Acknowledgment",
    description: "Location and equipment risks, facility rules, and that third-party facilities/equipment are outside the trainer's control.",
    services: ["personal-training"],
    kind: "coaching",
    status: "outline-only",
  },
  {
    id: "online-remote-training",
    title: "Online/Remote Training Waiver",
    description: "Remote exercise without the trainer physically present, safe space, equipment inspection, symptom stop instructions, and limits on emergency intervention.",
    services: ["personal-training"],
    kind: "coaching",
    status: "outline-only",
  },
  {
    id: "program-modification",
    title: "Progress & Program Modification Acknowledgment",
    description: "Programs may change with performance, feedback, adherence, injuries/limitations, equipment and other circumstances; no particular outcome is guaranteed.",
    services: ["personal-training", "nutrition-coaching"],
    kind: "coaching",
    status: "outline-only",
  },
];

export const EZE_FIT_APP_DOCUMENTS = [
  "EZE-FIT Terms of Use",
  "EZE-FIT Privacy Policy",
  "Health and fitness disclaimer",
  "Electronic consent",
  "Account and data policy",
  "Specific permissions for progress photos, body scans, blood-work information or connected health data, if those features are offered",
] as const;

export const ONBOARDING_PACKET_ORDER = [
  "Client Information",
  "Health Screening",
  "Emergency Information",
  "Training Agreement / Risk Consent",
  "Nutrition Scope",
  "Policies & Payments",
  "Privacy / Electronic Communications",
  "Optional Media Release",
  "Final Acknowledgment",
  "Digital Signature & Timestamp",
] as const;

export const PERSONAL_TRAINING_AGREEMENT_DRAFT = `# PERSONAL TRAINING AGREEMENT & INFORMED CONSENT

Trainer: Ezequiel Cruz
Client: ____________________________________________
Effective Date: ____________________________________

## AGREEMENT TO PARTICIPATE

I voluntarily agree to participate in personal training and fitness activities provided by Ezequiel Cruz (“Trainer”).

Training may include strength training, cardiovascular exercise, resistance training, flexibility and mobility exercises, conditioning, fitness assessments, and general fitness, nutrition, and lifestyle education.

I understand that the Trainer is providing fitness and educational services and is not acting as my physician or other licensed healthcare provider. Personal training is not a substitute for professional medical diagnosis or treatment.

## HEALTH DISCLOSURE

I confirm that I have disclosed to the Trainer any known injuries, physical limitations, medical conditions, medications, surgeries, pregnancy, or other circumstances that could reasonably affect my ability to exercise safely.

I understand that it is my responsibility to obtain medical clearance from a qualified healthcare professional when appropriate.

I agree to immediately notify the Trainer and stop exercising if I experience chest pain, dizziness, unusual shortness of breath, faintness, significant pain, weakness, or any other concerning symptoms.

## ASSUMPTION OF RISK

I understand that exercise and physical training involve inherent risks, including muscle soreness, strains, sprains, falls, equipment-related injuries, aggravation of existing conditions, cardiovascular complications, serious bodily injury, disability, and, in rare circumstances, death.

I knowingly and voluntarily choose to participate despite these risks and assume the risks inherent in physical exercise and personal training.

## RELEASE OF LIABILITY

To the fullest extent permitted by applicable law, I voluntarily assume the inherent risks associated with participating in the training program.

I agree not to hold the Trainer responsible for injuries or damages arising from the ordinary and inherent risks of exercise or from my failure to disclose relevant health information, follow safety instructions, or exercise within communicated limitations.

Nothing in this Agreement is intended to release or waive liability that cannot legally be released or waived under applicable law.

## NO GUARANTEE OF RESULTS

I understand that no specific results are promised or guaranteed.

Weight loss, muscle development, body-fat reduction, strength, endurance, physical appearance, athletic performance, and other results differ between individuals.

Results can be affected by consistency, nutrition, sleep, recovery, genetics, medical conditions, medications, stress, lifestyle, and adherence to the training program.

I understand that paying for personal training purchases professional training services and does not purchase or guarantee a particular physical result.

## NUTRITION & SUPPLEMENT INFORMATION

Any nutrition, calorie, macronutrient, meal-planning, supplement, or lifestyle information provided by the Trainer is general fitness and educational information within the Trainer's professional scope.

It is not intended to diagnose, treat, cure, or prevent a medical condition and does not replace advice from a physician, registered dietitian, or other qualified healthcare professional.

## PRIVACY & HEALTH INFORMATION

I understand that the Trainer may maintain information I voluntarily provide, including fitness assessments, measurements, progress information, exercise history, injuries, physical limitations, and other information reasonably necessary to provide training services.

The Trainer will make reasonable efforts to safeguard this information and will not intentionally disclose personally identifiable health or fitness information to unrelated third parties without my authorization except when disclosure is required or permitted by law.

I understand that HIPAA applies to organizations and individuals that fall within HIPAA's legal definitions of covered entities and business associates. This Agreement does not represent that the Trainer is a HIPAA-covered healthcare provider.

## PHOTOS, VIDEOS & TESTIMONIALS

Signing this Personal Training Agreement does not give the Trainer permission to publicly use my photographs, videos, progress photographs, transformation photographs, testimonials, measurements, or other identifying information for advertising or social media.

Any such use requires separate authorization from me.

## CLIENT RESPONSIBILITIES

I agree to provide truthful information regarding my health and physical limitations, follow reasonable safety instructions, communicate injuries or discomfort promptly, use equipment appropriately, and ask questions whenever I do not understand an exercise or instruction.

I understand that I remain responsible for my decisions and activities outside supervised personal-training sessions.

## CLIENT ACKNOWLEDGMENT & SIGNATURE

PLEASE READ BEFORE SIGNING.

By signing below, I acknowledge that:

I HAVE READ THIS AGREEMENT IN FULL.

I UNDERSTAND THE NATURE OF THE PERSONAL TRAINING SERVICES AND THE INHERENT RISKS ASSOCIATED WITH PHYSICAL EXERCISE.

I UNDERSTAND THAT RESULTS ARE NOT GUARANTEED.

I HAVE HAD THE OPPORTUNITY TO ASK QUESTIONS BEFORE SIGNING.

I VOLUNTARILY ACCEPT THESE TERMS AND CONSENT TO PARTICIPATE IN PERSONAL TRAINING.

### CLIENT

Full Legal Name: ______________________________________
Signature: ____________________________________________
Date: ______________________
Phone: _______________________________________________
Email: ________________________________________________

### TRAINER

Trainer: Ezequiel Cruz
Signature: ____________________________________________
Date: ______________________

### EMERGENCY CONTACT

Name: ________________________________________________
Relationship: _________________________________________
Phone: _______________________________________________`;

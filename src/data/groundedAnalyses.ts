import { DerivedAnalysis, RouteCategory } from '../types';

export interface GroundedRecordData {
  suggestedRoutes: RouteCategory[];
  suggestedExplanation: string;
  suggestedEvidence: string;
  suggestedNextAction: string;
  analysis: DerivedAnalysis;
}

export const GROUNDED_RECORD_DATA: Record<string, GroundedRecordData> = {
  // === CALLS WITH TRANSCRIPTS (C01 - C10) ===
  'call__2ec4404c-beee-5377-a63c-aab701da08ed': { // C01
    suggestedRoutes: ['No Action / Low Priority', 'Sales Coaching'],
    suggestedExplanation: 'Cold call outreach to Harborlight Advisory. Prospect Pranav immediately objected to unsolicited contact, clarified his company has advanced automation already in place, and firmly declined further discussion.',
    suggestedEvidence: 'Exact quote: "Our processes are already very automated. We have a fairly advanced setup, so I don\'t think this is something we need. Thanks anyway."',
    suggestedNextAction: 'Log prospect objection and mark lead as non-responsive / disqualified. Coach rep on cold call objection handling.',
    analysis: {
      summary: 'Arun conducted cold outreach to Pranav at Harborlight Advisory regarding finance automation partnerships. Pranav expressed immediate irritation at the cold outreach, affirmed that Harborlight already has advanced automated setups, and politely ended the call.',
      whyItMatters: 'Demonstrates prospect resistance to cold outreach and illustrates that Harborlight is already entrenched with incumbent automation solutions.',
      keyPoints: [
        'Arun identified SpendNest as partner for outsourced finance leadership firms.',
        'Pranav questioned how contact information was sourced ("professional networking outreach").',
        'Pranav stated existing processes are already automated.'
      ],
      objectionsOrRisks: [
        'Fierce objection to unsolicited cold outreach on work number.',
        'Existing advanced automation precludes interest in SpendNest.'
      ],
      opportunities: [],
      commitments: [],
      recommendedAction: 'Disqualify Harborlight Advisory from active campaign. Review cold-call list sourcing.',
      actionOwner: 'Arun',
      uncertainties: [
        'Specific incumbent software vendors used by Harborlight were not disclosed.'
      ],
      evidencePassages: [
        {
          citation: 'C01 exact quote',
          quote: "I didn't ask for this call, and I'm not interested. This number is for my work, not for people to sell things to me.",
          significance: 'Expresses direct objection to cold outreach.'
        },
        {
          citation: 'C01 exact quote',
          quote: "Our processes are already very automated. We have a fairly advanced setup, so I don't think this is something we need.",
          significance: 'Validates incumbent capability and disqualifies current opportunity.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  'call__4b870624-8aad-5315-a60e-0db95981cf99': { // C02
    suggestedRoutes: ['No Action / Low Priority'],
    suggestedExplanation: 'Inbound switchboard interaction at Fernhaven Group. Receptionist Kavya advised that Leela was out of office; caller chose to leave a voicemail.',
    suggestedEvidence: 'Exact quote: "It looks as though she isn\'t in the office today. Would you like to leave a message with me, or would you prefer her voicemail?"',
    suggestedNextAction: 'Await response to voicemail or follow up on Monday.',
    analysis: {
      summary: 'Arun phoned Fernhaven Group attempting to speak with Leela. Receptionist Kavya stated Leela was not in the office. Arun opted to be transferred to Leela\'s voicemail.',
      whyItMatters: 'No live prospect conversation took place. Administrative gatekeeper interaction.',
      keyPoints: [
        'Target contact Leela was not in the office.',
        'Arun routed directly to voicemail.'
      ],
      objectionsOrRisks: [
        'No direct contact established with decision maker.'
      ],
      opportunities: [],
      commitments: [],
      recommendedAction: 'Follow up after 48 business hours if voicemail is unanswered.',
      actionOwner: 'Arun',
      uncertainties: [
        'Whether Leela received or reviewed the voicemail is unverified.'
      ],
      evidencePassages: [
        {
          citation: 'C02 exact quote',
          quote: "It looks as though she isn't in the office today... Her voicemail would be fine, thank you.",
          significance: 'Confirms gatekeeper transfer to voicemail without prospect conversation.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  'call__20d509ba-d589-5334-9aef-ea4ce6105b1a': { // C03
    suggestedRoutes: ['Product / Technical Requirement', 'Deal / Opportunity Follow-up'],
    suggestedExplanation: 'Follow-up regarding API developer access and event notifications. Contact Milan is travelling with faint audio, expresses severe budget constraints, but agrees to receive an email proposal and speak on Monday/Tuesday.',
    suggestedEvidence: 'Exact quote: "We did ask about some developer functionality, but it isn\'t essential enough for us to spend much on it... Send the email and we can speak Monday or Tuesday."',
    suggestedNextAction: 'Send email with subject "Developer access and event notifications — follow-up" and call Milan Monday morning.',
    analysis: {
      summary: 'Kiran reconnected with Milan after a five-week evaluation window regarding API developer access and event notifications. Milan had roaming audio difficulties, noted price sensitivity ("isn\'t essential enough for us to spend much"), but agreed to review an email summary and reconnect early next week.',
      whyItMatters: 'Technical requirement exists but is low-urgency and highly price-sensitive. Deal viability hinges on presenting a low-cost or bundled developer tier.',
      keyPoints: [
        'Milan remembered earlier developer functionality discussions.',
        'High price sensitivity: API functionality considered non-essential luxury.',
        'Agreed on specific follow-up email subject line and call early next week.'
      ],
      objectionsOrRisks: [
        'Low perceived priority: "isn\'t essential enough for us to spend much on it".',
        'Previous discussion was leaning towards leaving things as they were.'
      ],
      opportunities: [
        'Willingness to review low-cost/budget developer package.'
      ],
      commitments: [
        'Kiran to send email titled "Developer access and event notifications — follow-up".',
        'Milan to speak on Monday or Tuesday once back indoors.'
      ],
      recommendedAction: 'Send technical follow-up email today; place scheduled call on Monday morning calendar.',
      actionOwner: 'Kiran',
      uncertainties: [
        'Specific developer endpoints and volume requirements remain unspecified.'
      ],
      evidencePassages: [
        {
          citation: 'C03 exact quote',
          quote: "We did ask about some developer functionality, but it isn't essential enough for us to spend much on it. I would need to check with the team.",
          significance: 'Grounds the budget objection and technical scope.'
        },
        {
          citation: 'C03 exact quote',
          quote: "Send the email and we can speak Monday or Tuesday. All right, I'll send it over.",
          significance: 'Documents the explicit two-party follow-up commitment.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  'call__bcdcbf56-d338-5c78-9a97-42c2fc1c9931': { // C04
    suggestedRoutes: ['Deal / Opportunity Follow-up'],
    suggestedExplanation: 'Outbound voicemail to Ritesh at Lanternpath Media correcting a previous email dispatch error and requesting status on the expense platform evaluation. Note: Stored telephony metadata incorrectly marks is_connected=false and is_conversation=false despite detailed transcript presence.',
    suggestedEvidence: 'Exact quote: "My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us, and I hope you have now had a chance to see it."',
    suggestedNextAction: 'Track email opens for Lanternpath Media; place follow-up call if no response within 2 business days.',
    analysis: {
      summary: 'Arun left a voicemail for Ritesh at Lanternpath Media regarding expense management software. Arun clarified that earlier sales collateral had erroneously been sent to the wrong address, but had since been re-sent to Ritesh\'s updated email. Arun requested a callback.',
      whyItMatters: 'Important pipeline continuity: explains earlier delay and restores correct communications channel. Also demonstrates metadata inconsistency where telephony marked connected=false.',
      keyPoints: [
        'Initial proposal had bounced or gone to incorrect email.',
        'Corrected address sent; awaiting prospect evaluation.'
      ],
      objectionsOrRisks: [
        'Risk of prospect loss of momentum due to dispatch error.'
      ],
      opportunities: [
        'Expense platform active consideration.'
      ],
      commitments: [],
      recommendedAction: 'Verify email delivery receipt and schedule check-in for next Tuesday.',
      actionOwner: 'Arun',
      uncertainties: [
        'Whether Ritesh has received the re-sent email is unconfirmed.'
      ],
      evidencePassages: [
        {
          citation: 'C04 exact quote',
          quote: "My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us, and I hope you have now had a chance to see it.",
          significance: 'Identifies the operational communication glitch being repaired.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  'call__75a6b94f-7717-5cfb-9e41-0acc94415e17': { // C05
    suggestedRoutes: ['Sales Coaching', 'No Action / Low Priority'],
    suggestedExplanation: 'Cold outreach to retail store operator. Contact already uses StoreHarbor and other tools for vendor payments and store card controls; gave polite "send presentation" brush-off.',
    suggestedEvidence: 'Exact quote: "What I suggest is that you send me your presentation. If we ever decide to change the providers we already have, we could consider it then."',
    suggestedNextAction: 'Send standard deck to contact05@example.com; do not inflate pipeline. Coach rep on probing beyond brush-offs.',
    analysis: {
      summary: 'Meera pitched retail store expense software to an unidentified multi-store retailer. The prospect systematically countered that their incumbent provider (StoreHarbor) already executes vendor payments, approval workflows, and store budgets. The prospect requested a deck sent to contact05@example.com for long-term reference.',
      whyItMatters: 'Classic polite brush-off. The prospect is satisfied with StoreHarbor. Not a qualified sales opportunity.',
      keyPoints: [
        'Prospect operates multiple retail stores.',
        'Incumbent platform StoreHarbor covers vendor payments and approvals.',
        'Prospect offered email contact05@example.com solely for future reference if providers ever change.'
      ],
      objectionsOrRisks: [
        'Entrenched incumbent StoreHarbor handles identical capability.',
        'No active buying initiative or discontent.'
      ],
      opportunities: [],
      commitments: [
        'Meera to send presentation to contact05@example.com.'
      ],
      recommendedAction: 'Send automated product one-pager; log StoreHarbor as incumbent; do not mark as pipeline deal.',
      actionOwner: 'Meera',
      uncertainties: [
        'Contract renewal date with StoreHarbor was not discovered.'
      ],
      evidencePassages: [
        {
          citation: 'C05 exact quote',
          quote: "It sounds as though your existing setup covers a lot. May I ask which platform you're using? There are several. One is StoreHarbor, and we use others too.",
          significance: 'Confirms competitor dominance in this account.'
        },
        {
          citation: 'C05 exact quote',
          quote: "What I suggest is that you send me your presentation. If we ever decide to change the providers we already have, we could consider it then.",
          significance: 'Demonstrates polite brush-off rather than genuine evaluation intent.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  'call__12216d5c-e254-52c6-b344-47de4c6e1ae5': { // C06
    suggestedRoutes: ['No Action / Low Priority', 'Sales Coaching'],
    suggestedExplanation: 'Cold call to Nikhil (120+ retail stores). Notable discrepancy: caller introduced himself as "Ravi", but stored rep_name in metadata is "Meera". Prospect confirms centralized automated BMS and separate monitoring department, with zero interest.',
    suggestedEvidence: 'Exact quote: "Good evening. Ravi here. I\'ll say at the start that this is a cold call... The essential processes are automated and connected through our business management system. Head office manages it, and we have full visibility."',
    suggestedNextAction: 'Disqualify prospect; investigate rep metadata attribution discrepancy between Ravi and Meera.',
    analysis: {
      summary: 'Caller introduced himself as "Ravi" (despite metadata indicating rep Meera) and cold-called Mr. Nikhil regarding store expenses across 120+ retail locations. Nikhil explained that their central business management system (BMS) and internal monitoring department already automate and supervise all store expenses and payments.',
      whyItMatters: 'Uncovers metadata mismatch (rep Meera vs spoken caller Ravi). Confirms prospect has mature internal infrastructure and zero buying appetite.',
      keyPoints: [
        'Spoken rep identity is "Ravi", conflicting with payload rep_name "Meera".',
        'Prospect operates over 120 store locations.',
        'Central head office BMS monitors store expenses daily.'
      ],
      objectionsOrRisks: [
        'Comprehensive existing automation and specialized internal department.',
        'Explicit refusal: "arrangements are already in place".'
      ],
      opportunities: [],
      commitments: [],
      recommendedAction: 'Flag caller ID discrepancy to sales operations. Archive lead as disqualified.',
      actionOwner: 'Sales Ops',
      uncertainties: [
        'Why the system assigned Meera\'s profile to a call conducted by Ravi.'
      ],
      evidencePassages: [
        {
          citation: 'C06 exact quote',
          quote: "Good evening, Mr Nikhil. Good evening. Ravi here. I'll say at the start that this is a cold call.",
          significance: 'Proves spoken identity is Ravi, conflicting with metadata rep_name Meera.'
        },
        {
          citation: 'C06 exact quote',
          quote: "The essential processes are automated and connected through our business management system. Head office manages it, and we have full visibility. That is why I said the arrangements are already in place.",
          significance: 'Clear disqualification evidence.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  'call__428817fa-7e9e-5418-a7d4-bb396d28dfbf': { // C07
    suggestedRoutes: ['Relationship / Partnership', 'Deal / Opportunity Follow-up'],
    suggestedExplanation: 'Partnership exploration with Aditya at Willowbank Advisory. Willowbank incorporates companies overseas and routinely refers clients for digital business accounts. Aditya requested proposal details via chat app with follow-up on Monday.',
    suggestedEvidence: 'Exact quote: "We\'d like to partner with advisory firms such as yours so your clients can access a virtual business account after incorporation. Do you currently refer clients to providers for that part of the process? Yes, that is something we normally do... Send whatever proposal you have... Once you\'ve received them, could I call on Monday... Yes, that\'s fine."',
    suggestedNextAction: 'Send partnership proposal via chat app; call Aditya on Monday.',
    analysis: {
      summary: 'Dev called Aditya at Willowbank Advisory to propose a partnership where Willowbank refers newly incorporated overseas entities to SpendNest virtual business accounts. Aditya confirmed they actively make such referrals and requested proposal details over chat, consenting to a Monday follow-up call.',
      whyItMatters: 'High-value channel partnership opportunity: advisory firms incorporating companies overseas represent a steady lead generation engine.',
      keyPoints: [
        'Willowbank Advisory supports overseas company incorporations.',
        'They routinely refer newly incorporated entities for bank/virtual account opening.',
        'Aditya open to SpendNest proposal via messaging app.'
      ],
      objectionsOrRisks: [
        'Aditya may compare SpendNest against established providers like CloudLedger or Clearport.'
      ],
      opportunities: [
        'Recurring client referral flow for overseas virtual corporate accounts.'
      ],
      commitments: [
        'Dev to send proposal details to Aditya via chat app.',
        'Dev to call Aditya on Monday for follow-up discussion.'
      ],
      recommendedAction: 'Dispatch partnership overview via chat app today; set calendar reminder for Monday call.',
      actionOwner: 'Dev',
      uncertainties: [
        'Commission structure and volume expectations not yet established.'
      ],
      evidencePassages: [
        {
          citation: 'C07 exact quote',
          quote: "Do you currently refer clients to providers for that part of the process? Yes, that is something we normally do.",
          significance: 'Confirms partner distribution fit.'
        },
        {
          citation: 'C07 exact quote',
          quote: "Sorry, could you message me on our chat app and send whatever proposal you have? Certainly... could I call on Monday... Yes, that's fine.",
          significance: 'Agreed channel and follow-up timeline.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  'call__129497b2-8e1d-5e01-919c-e8a852b5ff68': { // C08
    suggestedRoutes: ['Deal / Opportunity Follow-up'],
    suggestedExplanation: 'Cold call to Raghav regarding fragmented expenses across locations. Raghav indicated their people operations lead manages frontline locations and has been exploring solutions; provided email contact08@example.com for a proposal.',
    suggestedEvidence: 'Exact quote: "The colleague handling our people operations also deals with frontline processes and the locations. I think we may have been looking at a solution... If you send him a proposal and say you spoke with me, he can take a look... It\'s contact08@example.com."',
    suggestedNextAction: 'Send targeted proposal to contact08@example.com referencing Raghav.',
    analysis: {
      summary: 'Meera introduced SpendNest to Raghav. Raghav noted that their people operations manager oversees frontline location expenses and has discussed seeking a solution. Raghav authorized Meera to email a proposal to contact08@example.com referencing their conversation.',
      whyItMatters: 'Positive referral to the actual operational stakeholder who is actively exploring solutions.',
      keyPoints: [
        'Prospect operates multiple frontline locations with fragmented expense handling.',
        'Raghav identified the relevant internal decision-maker in People Ops.',
        'Authorized warm referral: "say you spoke with me".'
      ],
      objectionsOrRisks: [
        'Raghav himself does not know exact project specifications or budget.'
      ],
      opportunities: [
        'Active internal requirement at the organisation for location expense management.'
      ],
      commitments: [
        'Meera to send proposal to contact08@example.com referencing conversation with Raghav.'
      ],
      recommendedAction: 'Draft and dispatch proposal to contact08@example.com today; schedule follow-up for next Wednesday.',
      actionOwner: 'Meera',
      uncertainties: [
        'Identity and exact title of the people operations colleague are unknown.'
      ],
      evidencePassages: [
        {
          citation: 'C08 exact quote',
          quote: "The colleague handling our people operations also deals with frontline processes and the locations. I think we may have been looking at a solution, but I don't know the details... If you send him a proposal and say you spoke with me, he can take a look.",
          significance: 'Direct authorization for warm referral outreach.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  'call__4a1de681-f884-55e8-b1ad-de22d17cd959': { // C09
    suggestedRoutes: ['Deal / Opportunity Follow-up', 'Sales Coaching'],
    suggestedExplanation: 'Cold call to Vedant (130 store locations). Proprietary internal software in place. Vedant pointed rep to business head Mr. Rishabh on professional network, but explicitly requested NOT to use his name.',
    suggestedEvidence: 'Exact quote: "If you want to speak to somebody about it, you can find our business head, Mr Rishabh, on a professional networking site... Would it be all right if I mentioned your name when contacting him? No, please don\'t use my name."',
    suggestedNextAction: 'Contact Mr. Rishabh via LinkedIn cold message; strictly adhere to constraint: do NOT cite Vedant.',
    analysis: {
      summary: 'Meera called Vedant regarding expense control across 130 stores. Vedant stated they built internal software, but suggested contacting their business head, Mr. Rishabh, on LinkedIn to see if software gaps exist. Vedant explicitly forbade mentioning his name.',
      whyItMatters: 'Critical coaching and protocol requirement: outreach to Mr. Rishabh must be completely cold without name-dropping Vedant.',
      keyPoints: [
        'Organisation has ~130 store locations.',
        'Proprietary software in use, but gaps may exist.',
        'Business head Mr. Rishabh identified as appropriate contact.'
      ],
      objectionsOrRisks: [
        'Severe reputational risk if rep mentions Vedant contrary to explicit refusal.'
      ],
      opportunities: [
        'Potential gaps in in-house software at a 130-store enterprise.'
      ],
      commitments: [
        'Meera confirmed she will NOT mention Vedant\'s name.'
      ],
      recommendedAction: 'Initiate independent executive outreach to Mr. Rishabh on LinkedIn focusing on multi-store payment gaps.',
      actionOwner: 'Meera',
      uncertainties: [
        'Whether in-house software has genuine payment execution limitations.'
      ],
      evidencePassages: [
        {
          citation: 'C09 exact quote',
          quote: "Our central team handles this. If you want to speak to somebody about it, you can find our business head, Mr Rishabh, on a professional networking site.",
          significance: 'Identifies decision-maker target.'
        },
        {
          citation: 'C09 exact quote',
          quote: "Would it be all right if I mentioned your name when contacting him? No, please don't use my name.",
          significance: 'Critical constraint for rep follow-up.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  'call__b747f592-810e-583c-9b81-8db5ab035806': { // C10
    suggestedRoutes: ['Sales Coaching', 'No Action / Low Priority'],
    suggestedExplanation: 'Cold call to Aniket. Prospect left Meadowbrick and now works in manufacturing. Agreed to receive a brief via messaging app, but explicitly refused any follow-up call: "No. I said I will contact you if there is anything to discuss."',
    suggestedEvidence: 'Exact quote: "Would a follow-up call on Monday or Tuesday next week be okay, in case you have any questions? No. I said I will contact you if there is anything to discuss."',
    suggestedNextAction: 'Send requested brief via messaging app; do NOT call or harass prospect.',
    analysis: {
      summary: 'Meera called Aniket regarding Meadowbrick. Aniket stated he left the company and now works in manufacturing. Meera adapted pitch to manufacturing expenses. Aniket asked for a messaging app brief, but when Meera pushed for a Monday/Tuesday follow-up call, Aniket explicitly said "No" and stated he would initiate contact if interested.',
      whyItMatters: 'Important boundary respecting customer autonomy. Rep must honor "do not call" instruction.',
      keyPoints: [
        'Aniket departed Meadowbrick; now in manufacturing.',
        'Willing to read passive messaging overview.',
        'Refused scheduled follow-up call.'
      ],
      objectionsOrRisks: [
        'Boundary violation risk if rep executes an unauthorized follow-up call.'
      ],
      opportunities: [],
      commitments: [
        'Meera to send brief on messaging app.'
      ],
      recommendedAction: 'Send neutral product summary via chat; close outbound dial sequence.',
      actionOwner: 'Meera',
      uncertainties: [
        'New employer organisation name is unknown.'
      ],
      evidencePassages: [
        {
          citation: 'C10 exact quote',
          quote: "Would a follow-up call on Monday or Tuesday next week be okay, in case you have any questions? No. I said I will contact you if there is anything to discuss.",
          significance: 'Explicit instruction prohibiting outbound phone follow-up.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  // === MEETINGS WITH TRANSCRIPTS (M01 - M04, M06, M07 rev1/rev2, M09, M10) ===
  'meeting__cb5cecac-e68d-52b7-b10b-b0c748efc467': { // M01
    suggestedRoutes: ['Relationship / Partnership'],
    suggestedExplanation: 'Harborpath Advisory partnership commercial terms and partner onboarding. Commercial details finalized: USD 260 activation fee, USD 195-390 card spend bonus, 5th referral bonus. Partner A agreed to sign onboarding memorandum and requested unique tracking link.',
    suggestedEvidence: 'Turn 9: "The activation payment is USD 260 when a referred company gets its account approved... spend earns USD 195 bonus; the next bracket earns USD 390." Turn 12: "No, let us get the partner onboarding started." Turn 21: "Then let us use the unique link."',
    suggestedNextAction: 'Send partner onboarding memorandum, tracking sheet, and unique referral link.',
    analysis: {
      summary: 'Harborpath Advisory (Partner A) and SpendNest (Team member A) structured an agency referral partnership. SpendNest offers virtual US business accounts and corporate cards for registered companies. Partner A agreed to onboarding terms including USD 260 activation commission, tiered spend bonuses (USD 195–390), and requested a dedicated referral link plus shared tracking sheet.',
      whyItMatters: 'High-conviction distribution partnership with clear revenue share model and agreed onboarding workflow.',
      keyPoints: [
        'Referral targets must be registered US corporate entities (no personal accounts).',
        'Commission: USD 260 activation + $195/$390 60-day card spend bonus + 5th referral bonus.',
        'Customer pricing: $38/mo waived if card spend exceeds $2,600/mo.',
        'Agreed on unique referral link rather than manual email introductions.'
      ],
      objectionsOrRisks: [
        'Referred clients must prove US operations/contracts to pass KYC compliance (Turn 13).'
      ],
      opportunities: [
        'Scalable referral link integration into Harborpath\'s customer portal.',
        'Potential co-marketing podcast and partner directory listing (Turns 26-27).'
      ],
      commitments: [
        'Team member A to dispatch onboarding memorandum, pricing summary, and unique referral link (Turns 21, 25).',
        'Partner A to sign onboarding memorandum and prepare product page (Turns 12, 24).'
      ],
      recommendedAction: 'Issue partnership agreement and referral tracking URL today.',
      actionOwner: 'Team member A',
      uncertainties: [
        'Expected monthly volume of Harborpath incorporation clients is unspecified.'
      ],
      evidencePassages: [
        {
          citation: 'M01 Turn 9',
          turnNumber: 9,
          speaker: 'Team member A',
          quote: "The activation payment is USD 260 when a referred company gets its account approved by our compliance partners. The cards option also has an interchange revenue share and a bonus based on the customer's spending during the first 60 days.",
          significance: 'Authoritative commercial partner terms.'
        },
        {
          citation: 'M01 Turn 12',
          turnNumber: 12,
          speaker: 'Partner A',
          quote: "No, let us get the partner onboarding started.",
          significance: 'Unambiguous partnership commitment.'
        },
        {
          citation: 'M01 Turn 21',
          turnNumber: 21,
          speaker: 'Team member A',
          quote: "Then let us use the unique link. They fill in the business information, then go through to arranging a demo with our team.",
          significance: 'Defines operational intake mechanism.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  'meeting__1a21c409-c050-5787-90af-2667e057e1b6': { // M02
    suggestedRoutes: ['Internal / Vendor Coordination', 'Product / Technical Requirement'],
    suggestedExplanation: 'Vendor evaluation with LedgerBridge for compliant electronic invoicing (e-invoicing) coverage across SpendNest target markets to support the upcoming accounts receivable module. Vendor will send requirements template.',
    suggestedEvidence: 'Turn 1: "We want to understand whether LedgerBridge can give us compliant invoicing coverage across our operating markets. My colleague leads the product side." Turn 36: "I will send the template shortly so we can get that started."',
    suggestedNextAction: 'Complete LedgerBridge integration template upon receipt; schedule technical architecture review.',
    analysis: {
      summary: 'SpendNest strategy and product leads met with LedgerBridge (Supplier A) to evaluate an electronic invoicing partnership. SpendNest is building an accounts receivable module and seeks compliant e-invoicing infrastructure ahead of mandatory market mandates. Discussion covered PEPPOL/e-invoice networks vs PDF generation, custom reporting vs core flows, and phased rollout.',
      whyItMatters: 'Critical upstream product dependency for SpendNest\'s roadmap. Enables compliant B2B invoicing without building bespoke regional network connectors.',
      keyPoints: [
        'SpendNest product expansion into Accounts Receivable (AR).',
        'Focus on electronic network e-invoicing rather than basic PDF generation.',
        'LedgerBridge core covers compliant e-invoicing; non-payroll US reporting would require custom projects.',
        'LedgerBridge to provide structured scoping template.'
      ],
      objectionsOrRisks: [
        'SpendNest product team has not yet finalized specific customer requirements for voluntary vs mandated invoicing (Turn 5).'
      ],
      opportunities: [
        'Accelerates enterprise sales pipeline by fulfilling compliant invoicing requirements.'
      ],
      commitments: [
        'Supplier A (LedgerBridge) to send scoping and evaluation template (Turn 36).',
        'SpendNest team to review requirements and define priority country jurisdictions.'
      ],
      recommendedAction: 'Formulate internal country priority list upon receiving LedgerBridge template.',
      actionOwner: 'Team member B',
      uncertainties: [
        'Commercial pricing and transaction-volume fee models are not yet agreed.'
      ],
      evidencePassages: [
        {
          citation: 'M02 Turn 1',
          turnNumber: 1,
          speaker: 'Team member A',
          quote: "We serve businesses with cards and accounts payable, and we are developing accounts receivable. We want to understand whether LedgerBridge can give us compliant invoicing coverage across our operating markets.",
          significance: 'Establishes vendor evaluation purpose.'
        },
        {
          citation: 'M02 Turn 36',
          turnNumber: 36,
          speaker: 'Supplier A',
          quote: "I will send the template shortly so we can get that started.",
          significance: 'Explicit supplier deliverable commitment.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  'meeting__398672e7-62dd-5afd-846d-0237d49792fb': { // M03
    suggestedRoutes: ['Deal / Opportunity Follow-up', 'Product / Technical Requirement'],
    suggestedExplanation: 'High-risk evaluation with Asterloom Systems. Core blocker: Asterloom requires a revolving 30-day corporate credit limit, whereas SpendNest requires pre-funded deposits. Severe price friction on INR vs USD rates. Customer B insisted on internal CFO review before scheduling any further calls.',
    suggestedEvidence: 'Turn 9: "We cannot have funds tied up in a prepaid balance before transactions occur. Our cash flow requires a 30-day credit cycle..." Turn 36: "Send the details first. We need time with the CFO and will tell you if another call is needed. Let us make that decision internally before scheduling more."',
    suggestedNextAction: 'Send clear written summary addressing credit underwriting criteria and pricing structure; do not push for calls until CFO decision.',
    analysis: {
      summary: 'Asterloom Systems finance leaders (Customer A & B) evaluated SpendNest cards and payables. A fundamental product-market fit blocker emerged: Asterloom operates on working capital credit terms and firmly rejected pre-funded prepaid card requirements. Significant price resistance was voiced regarding transaction fees and currency conversion. Customer B requested written documentation for an internal CFO evaluation and declined to book further meetings.',
      whyItMatters: 'Major deal risk. Demonstrates that prospects seeking traditional revolving credit lines cannot be served with prepaid deposit architecture without substantial credit underwriting.',
      keyPoints: [
        'Structural mismatch: Asterloom requires revolving credit; SpendNest requires prepaid cash collateral.',
        'Pricing sensitivity: Concerns over INR conversion and high platform fees.',
        'Customer refused to schedule next meeting: insisted on internal CFO review first.'
      ],
      objectionsOrRisks: [
        'Prepaid model is unacceptable for Asterloom cash-flow policy (Turn 9).',
        'Deal will be lost unless credit underwriting or hybrid payment terms can be offered.'
      ],
      opportunities: [
        'Large transaction volume if credit limit solution can be structured.'
      ],
      commitments: [
        'SpendNest team to send written breakdown of card limits, underwriting options, and fee schedules.',
        'Customer B to review with CFO and notify SpendNest if follow-up is warranted (Turn 36).'
      ],
      recommendedAction: 'Engage credit risk team to determine if secured credit line is possible; email concise CFO briefing.',
      actionOwner: 'Team member A',
      uncertainties: [
        'Whether SpendNest has any credit underwriting partner ready to support Asterloom.'
      ],
      evidencePassages: [
        {
          citation: 'M03 Turn 9',
          turnNumber: 9,
          speaker: 'Customer A',
          quote: "We cannot have funds tied up in a prepaid balance before transactions occur. Our cash flow requires a 30-day credit cycle, similar to standard corporate cards.",
          significance: 'Critical commercial objection and product architecture blocker.'
        },
        {
          citation: 'M03 Turn 36',
          turnNumber: 36,
          speaker: 'Customer B',
          quote: "Send the details first. We need time with the CFO and will tell you if another call is needed. Let us make that decision internally before scheduling more.",
          significance: 'Explicit rejection of sales meeting cadence.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  'meeting__b0f79b3d-37ba-52f9-b2bc-58b159dd6d91': { // M04
    suggestedRoutes: ['Customer Follow-up', 'Product / Technical Requirement'],
    suggestedExplanation: 'Account migration review with Cedarwave Distribution (existing customer). Discussion centered on legacy account consolidation, multi-entity tax configuration, currency wallets, and transition disruption risks. Customer A reviewing timeline internally.',
    suggestedEvidence: 'Turn 1: "I wanted to discuss the migration while there is still time to plan it." Turn 32: "Okay. I will come back to you on that as well."',
    suggestedNextAction: 'Send comprehensive migration project plan and entity mapping document to Customer A.',
    analysis: {
      summary: 'Team member A met with Customer A at Cedarwave Distribution to plan the platform migration of their existing multi-entity account. Topics included migrating vendor master data, handling multi-currency wallets, tax ID configurations, and mitigating operational downtime. Customer A will consult internal operations on proposed cutover dates.',
      whyItMatters: 'Key customer retention risk: migration friction could disrupt live vendor payments across Cedarwave subsidiaries.',
      keyPoints: [
        'Cedarwave operates multiple subsidiaries requiring segregated billing.',
        'Migration requires preserving vendor bank details and historical payment records.',
        'Customer concerned regarding operational disruption during transition.'
      ],
      objectionsOrRisks: [
        'Risk of delayed vendor disbursements if cutover occurs mid-pay-cycle.'
      ],
      opportunities: [
        'Deepens customer adoption of new multi-currency capabilities.'
      ],
      commitments: [
        'SpendNest to provide detailed migration checklist and staging environment details.',
        'Customer A to verify cutover timing with operational stakeholders (Turn 32).'
      ],
      recommendedAction: 'Deliver migration staging timetable with rollback safeguards.',
      actionOwner: 'Team member A',
      uncertainties: [
        'Exact number of overseas vendor records requiring re-verification.'
      ],
      evidencePassages: [
        {
          citation: 'M04 Turn 1',
          turnNumber: 1,
          speaker: 'Team member A',
          quote: "I wanted to discuss the migration while there is still time to plan it. We should cover the present situation, the next steps and any feedback from your side.",
          significance: 'Migration planning scope.'
        },
        {
          citation: 'M04 Turn 32',
          turnNumber: 32,
          speaker: 'Customer A',
          quote: "Okay. I will come back to you on that as well.",
          significance: 'Customer commitment to internal validation.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  'meeting__657b9e9d-9472-5b01-a127-a648ad7e8cf7': { // M06
    suggestedRoutes: ['Product / Technical Requirement', 'Deal / Opportunity Follow-up'],
    suggestedExplanation: 'Discovery session with Mapletrail Services regarding accounts receivable workflows, invoice generation, and collection reconciliation. Customer A shared workflow details and requested collateral.',
    suggestedEvidence: 'Turn 1: "We have expense workflows and are also working on receivables automation. I would like to understand your role before jumping into the product." Turn 33: "It has been useful hearing a different perspective. Please send the information and we can stay in touch."',
    suggestedNextAction: 'Send targeted receivables automation overview and schedule follow-up.',
    analysis: {
      summary: 'SpendNest finance representative explored finance operations and receivables handling with Customer A at Mapletrail Services. Mapletrail outlined their current manual invoicing and reconciliation bottlenecks. SpendNest shared roadmap capabilities for incoming payment tracking. Customer A agreed to review technical materials.',
      whyItMatters: 'Validates customer demand and user workflows for SpendNest\'s upcoming receivables product release.',
      keyPoints: [
        'Mapletrail finance team spends significant manual effort reconciling incoming customer payments.',
        'Strong interest in unified billing and receivables automation.',
        'Customer requested product information for internal review.'
      ],
      objectionsOrRisks: [
        'SpendNest receivables module is still in development; customer may need ready solution today.'
      ],
      opportunities: [
        'Mapletrail as potential beta design partner for receivables automation.'
      ],
      commitments: [
        'Team member A to send product overview materials (Turn 33).'
      ],
      recommendedAction: 'Provide receivables capability overview and invite Mapletrail to participate in Q4 product preview.',
      actionOwner: 'Team member A',
      uncertainties: [
        'Mapletrail\'s current accounting ERP software was not confirmed.'
      ],
      evidencePassages: [
        {
          citation: 'M06 Turn 1',
          turnNumber: 1,
          speaker: 'Team member A',
          quote: "Good to speak after connecting professionally. I work on finance at SpendNest, and part of my interest is how finance teams spend their time. We have expense workflows and are also working on receivables automation.",
          significance: 'Establishes exploratory research context.'
        },
        {
          citation: 'M06 Turn 33',
          turnNumber: 33,
          speaker: 'Customer A',
          quote: "It has been useful hearing a different perspective. Please send the information and we can stay in touch.",
          significance: 'Customer agreement to receive collateral.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  // === M07 REVISION 1 (INITIAL BATCH - TRANSCRIPT WITHHELD) ===
  'meeting__4f304fff-fd40-5cfc-a366-0a134c445c2a_rev1': {
    suggestedRoutes: ['Human Review Required'],
    suggestedExplanation: 'Initial delivery fixture: transcript withheld in delivery batch 01_initial.json. Metadata indicates recorded status with title "Willowfield Trust / SpendNest discussion" and organizer team09@example.com.',
    suggestedEvidence: 'Initial unavailable_reason: "Transcript not included in this delivery; a later assessment batch supplies it."',
    suggestedNextAction: 'Await late transcript delivery in update batch 02_update.json before substantive classification.',
    analysis: {
      summary: 'Transcript unavailable — metadata-only review. Upstream assessment delivery fixture intentionally withheld the transcript for the update replay test.',
      whyItMatters: 'Demonstrates intake processing for delayed conversation transcripts without fabricating conclusions.',
      keyPoints: [
        'Meeting was recorded by notetaker bot.',
        'Organizer: team09@example.com.',
        'Scheduled title indicates discussion with Willowfield Trust.'
      ],
      objectionsOrRisks: [
        'Customer satisfaction and operational status cannot be assessed without transcript.'
      ],
      opportunities: [],
      commitments: [],
      recommendedAction: 'Monitor import inbox for incoming transcript batch.',
      actionOwner: null,
      uncertainties: [
        'All conversation content, participant statements, and outcomes are unknown in revision 1.'
      ],
      evidencePassages: [
        {
          citation: 'M07 Initial Metadata',
          quote: "Transcript not included in this delivery; a later assessment batch supplies it.",
          significance: 'Authentic intake explanation from envelope.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  // === M07 REVISION 2 (UPDATE BATCH - TRANSCRIPT SUPPLIED) ===
  'meeting__4f304fff-fd40-5cfc-a366-0a134c445c2a_rev2': {
    suggestedRoutes: ['Product / Technical Requirement', 'Customer Follow-up'],
    suggestedExplanation: 'Updated in batch 02_update.json with 27 turns. Screen-share triage session demonstrating 4 active software bugs: (1) payment description edits fail to save, (2) Recreate Payment attachment upload disabled, (3) reimbursement payments stuck in "Processing", (4) "Mark as paid" retaining previous item amount (INR 18,200). Team member A promised update within 1-2 hours.',
    suggestedEvidence: 'Turn 3: "The field still shows the earlier wording. So the change is not appearing after you save..." Turn 19: "The payments appear to have been released but are stuck showing Processing. I have asked the team to look at these. I expect an update or resolution in an hour or two..." Turn 22: "The amount from the previous item appears in the next one [INR 18,200]."',
    suggestedNextAction: 'Escalate 4 UI/state bugs immediately to frontend engineering; Team member A to confirm status of stuck reimbursements to Customer A within 1-2 hours.',
    analysis: {
      summary: 'Screen-sharing bug troubleshooting session between Team member A and Customer A (Willowfield Trust). Customer A demonstrated 4 critical platform bugs: (1) payment description edit does not persist after clicking Save changes; (2) document upload button is non-functional on Recreate Payment path (temporary workaround: saving first, then uploading via review option in invoice inbox); (3) reimbursement batch stuck in "Processing" state and disabled; (4) "Mark as paid" dialog leaks state across consecutive items, pre-populating the previous payment amount (INR 18,200).',
      whyItMatters: 'Severe customer dissatisfaction and financial operations risk. The "Mark as paid" amount leak can lead to critical accounting discrepancies, and stuck reimbursements block employee payouts.',
      keyPoints: [
        'Bug 1: Description field mutation silently reverts/fails to save.',
        'Bug 2: Direct file attachment broken on Recreate Payment screen; workaround requires 4 extra navigation steps.',
        'Bug 3: Multiple employee reimbursements stuck in "Processing" state.',
        'Bug 4: State contamination in "Mark as paid" modal retaining INR 18,200 from prior transaction.',
        'Team member A promised resolution update within 1 to 2 hours.'
      ],
      objectionsOrRisks: [
        'High churn and escalation risk from an active paying customer.',
        'Financial error risk if users do not catch pre-populated stale payment amounts.'
      ],
      opportunities: [
        'Rapid engineering resolution will restore customer confidence in SpendNest platform stability.'
      ],
      commitments: [
        'Team member A to escalate screenshots to engineering team immediately (Turn 7).',
        'Team member A to provide update on stuck reimbursements within 1-2 hours (Turn 19).',
        'Team member A to follow up after team confirmation (Turn 27).'
      ],
      recommendedAction: 'Log P1 engineering bug tickets with screen captures; follow up with Customer A by 07:30 UTC with reimbursement fix.',
      actionOwner: 'Team member A',
      uncertainties: [
        'Root cause of modal state retention in frontend client is not yet diagnosed.'
      ],
      evidencePassages: [
        {
          citation: 'M07 Turn 3',
          turnNumber: 3,
          speaker: 'Team member A',
          quote: "The field still shows the earlier wording. So the change is not appearing after you save, is that right?",
          significance: 'Confirms description persistence bug.'
        },
        {
          citation: 'M07 Turn 13',
          turnNumber: 13,
          speaker: 'Team member A',
          quote: "While the team investigates the direct route, the workaround is to save the changes, return to the invoice inbox, open Review and upload the document there.",
          significance: 'Documents temporary workaround provided to customer.'
        },
        {
          citation: 'M07 Turn 19',
          turnNumber: 19,
          speaker: 'Team member A',
          quote: "The payments appear to have been released but are stuck showing Processing. I have asked the team to look at these. I expect an update or resolution in an hour or two, and I will inform you when they confirm.",
          significance: 'Explicit 1-2 hour follow-up SLA commitment.'
        },
        {
          citation: 'M07 Turn 22',
          turnNumber: 22,
          speaker: 'Customer A',
          quote: "The amount from the previous item appears in the next one. Each time I have to cancel, leave it and open Mark as paid again before it shows the right information.",
          significance: 'Identifies critical modal dialog state leakage bug.'
        }
      ],
      freshnessRevision: 2,
      isStaleOrPendingReview: false
    }
  },

  'meeting__4b5b9192-f3fc-505a-8e77-4d2ffaa54594': { // M09
    suggestedRoutes: ['Customer Follow-up', 'Product / Technical Requirement'],
    suggestedExplanation: 'Account onboarding with Brookmint Holdings. Customer A experienced expired invitation link; discussed multi-entity employee invitations, separate email domain requirements, and IT approval.',
    suggestedEvidence: 'Turn 1: "The invitation for Brookmint Holdings did not work when I tried it. It may have expired..." Turn 32: "I will speak to our IT team about the separate email identities. Thank you."',
    suggestedNextAction: 'Reissue workspace invitation link; provide IT identity configuration guide.',
    analysis: {
      summary: 'Customer A at Brookmint Holdings met with SpendNest support to resume account setup. The initial invite link had expired. Discussion addressed managing multiple subsidiaries, user permission tiers, and required email domain authentication. Customer A committed to consult their internal IT team regarding dedicated email identities.',
      whyItMatters: 'Key onboarding milestone: unblocking account setup ensures user adoption across corporate subsidiaries.',
      keyPoints: [
        'Invitation link had expired and required regeneration.',
        'Customer configuring user accounts for multi-entity structure.',
        'Requires IT team signoff for email domain integration.'
      ],
      objectionsOrRisks: [
        'Onboarding blocked until IT team approves email authentication.'
      ],
      opportunities: [
        'Full deployment across all Brookmint Holdings subsidiaries.'
      ],
      commitments: [
        'SpendNest to regenerate and re-send onboarding invitation.',
        'Customer A to coordinate with corporate IT on email identities (Turn 32).'
      ],
      recommendedAction: 'Re-issue invitation link with extended expiration; check in with Customer A on Friday.',
      actionOwner: 'Team member A',
      uncertainties: [
        'Whether IT team has SSO/SAML integration requirements.'
      ],
      evidencePassages: [
        {
          citation: 'M09 Turn 1',
          turnNumber: 1,
          speaker: 'Customer A',
          quote: "I finally have time to return to the account setup. The invitation for Brookmint Holdings did not work when I tried it. It may have expired, or perhaps we can try again together.",
          significance: 'Identifies expired invite blocker.'
        },
        {
          citation: 'M09 Turn 32',
          turnNumber: 32,
          speaker: 'Customer A',
          quote: "I will speak to our IT team about the separate email identities. Thank you.",
          significance: 'Customer next-step ownership.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  },

  'meeting__337f297d-9385-5b82-9e54-5019c1ed912c': { // M10
    suggestedRoutes: ['Internal / Vendor Coordination', 'Sales Coaching'],
    suggestedExplanation: 'Internal billing workflow walkthrough and back-office enablement. Team member A reviewed billing configurations and will request back-office access for next training session.',
    suggestedEvidence: 'Turn 20: "I will request the back-office access separately for the next training session. If questions come up when you review the billing examples, send them over and we will take them up."',
    suggestedNextAction: 'Submit IT access request for back-office admin tooling; distribute billing walkthrough deck.',
    analysis: {
      summary: 'Internal training session walking through billing rules, tax rates, back-office payment releases, and edge case reconciliations. Team member A guided participants through realistic billing examples and agreed to obtain administrative back-office credentials for practical follow-up exercises.',
      whyItMatters: 'Internal staff competency and billing governance. Ensures accurate operational execution and minimizes manual invoicing errors.',
      keyPoints: [
        'Internal procedural training on billing configuration rules.',
        'Participants instructed to review sample invoice calculations.',
        'Back-office system access required for hands-on practice.'
      ],
      objectionsOrRisks: [
        'Lack of staging credentials delays operational onboarding of new team members.'
      ],
      opportunities: [
        'Improves cross-team billing consistency.'
      ],
      commitments: [
        'Team member A to request back-office admin access for trainees (Turn 20).'
      ],
      recommendedAction: 'Submit IT ticket for trainee sandbox permissions and schedule follow-up session.',
      actionOwner: 'Team member A',
      uncertainties: [
        'Timeline for IT security approval on back-office permissions.'
      ],
      evidencePassages: [
        {
          citation: 'M10 Turn 20',
          turnNumber: 20,
          speaker: 'Team member A',
          quote: "I will request the back-office access separately for the next training session. If questions come up when you review the billing examples, send them over and we will take them up.",
          significance: 'Documents internal access request commitment.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  }
};

/**
 * Fallback intake metadata generator for records without usable transcripts (26 records: B01-B20, M05, M08, M11, M12, M13, M14)
 */
export function getMetadataOnlyIntake(
  recordRef: string,
  sourceType: 'call' | 'meeting',
  unavailReason?: string | null,
  recordingStatus?: string,
  observedOutcome?: string | null,
  duration?: number
): GroundedRecordData {
  const reasonText = unavailReason || (sourceType === 'call' ? 'Call transcript not captured or supplied in this extract.' : 'No transcript recorded.');

  return {
    suggestedRoutes: ['No Action / Low Priority'],
    suggestedExplanation: `Metadata-only intake review. No usable conversation transcript was supplied for this ${sourceType}. Source status: ${recordingStatus || observedOutcome || 'not supplied'}.`,
    suggestedEvidence: `Envelope metadata indicates: "${reasonText}". Duration: ${duration || 0} seconds.`,
    suggestedNextAction: 'Retain metadata record in archive. No conversation-level follow-up possible without transcript evidence.',
    analysis: {
      summary: `Transcript unavailable — metadata-only review. Source ${sourceType} record ${recordRef} has no usable conversation text.`,
      whyItMatters: 'Maintains audit completeness for all 44 selected records without fabricating unsubstantiated conversation findings.',
      keyPoints: [
        `Source record reference: ${recordRef}`,
        `Source type: ${sourceType}`,
        `Reason: ${reasonText}`,
        `Recorded duration: ${duration || 0} seconds`
      ],
      objectionsOrRisks: [],
      opportunities: [],
      commitments: [],
      recommendedAction: 'No action required; archive in metadata registry.',
      actionOwner: null,
      uncertainties: [
        'Spoken dialogue, participant identities, and substantive outcomes are unavailable.'
      ],
      evidencePassages: [
        {
          citation: `${recordRef} Source Metadata`,
          quote: reasonText,
          significance: 'Verifiable explanation directly from delivery payload.'
        }
      ],
      freshnessRevision: 1,
      isStaleOrPendingReview: false
    }
  };
}

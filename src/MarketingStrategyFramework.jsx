import { useState, useEffect, Fragment } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080c14; --surface: #0d1525; --surface2: #131e30;
    --border: rgba(99,179,237,0.15); --teal: #38bdf8; --gold: #f59e0b;
    --green: #34d399; --red: #f87171; --purple: #a78bfa; --pink: #f472b6;
    --text: #e2e8f0; --muted: #64748b;
    --font-display: 'Bebas Neue', sans-serif;
    --font-body: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }
  @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  .fade-in { animation: fadeIn 0.35s ease forwards; }
`;

// ── PRODUCT / SERVICE TYPES ─────────────────────────────────────────────────

const PRODUCT_TYPES = [
  {
    id: "high_ticket_service",
    label: "HIGH-TICKET SERVICE",
    subtitle: "Done-for-you, consulting, implementation",
    icon: "🏆",
    hex: "#a78bfa",
    price_range: "$3,000+",
    decision_length: "Weeks to months",
    buyer_psychology: "Risk-averse. Needs significant trust before committing. Multiple touchpoints required. Rarely impulse buys. Often involves stakeholder sign-off beyond the person you're talking to.",
    examples: ["Agency retainers", "Business consulting", "Software implementation", "Legal or accounting services", "Executive coaching"],
    audience_fit: {
      interruption: { score: "weak",    label: "WEAK FIT",     reason: "Cold interruption ads rarely close high-ticket services directly. They can warm audiences but require a long nurture bridge before any purchase signal appears. Use interruption only to build the top of funnel." },
      intent:       { score: "strong",  label: "STRONG FIT",   reason: "High-intent search queries ('hire zoho consultant', 'done-for-you CRM setup') signal buyers already in decision mode. Google Search is your most efficient paid channel once you have proof and budget." },
      community:    { score: "strong",  label: "STRONG FIT",   reason: "Trust is the primary purchase driver for high-ticket. Organic community content builds the authority and familiarity that makes a $5K+ purchase feel safe. This is your best zero-budget channel." },
      owned:        { score: "strong",  label: "STRONG FIT",   reason: "Email and WhatsApp nurture sequences are essential for compressing long sales cycles. A warm lead who's been in your list for 30 days is far more likely to book a call than a cold one." },
    },
    budget_notes: { zero: "Community + Owned are your entire strategy. No paid. Focus on LinkedIn/Instagram authority content → DM → call.", small: "Add Google Search for branded + high-intent terms. Retargeting on Meta for warm website visitors.", medium: "Full Google Search + Meta retargeting + prospecting. Consider webinar funnel to compress trust timeline." },
    engagement_path: {
      interruption: { action: "Soft CTA to lead magnet or free resource", next: "Email nurture sequence (5–7 emails) → call booking CTA at email 5", zoho: "AWR_Welcome_Series → Lead_Score tracking → SOL trigger at 50+ points" },
      intent:       { action: "Direct CTA to book a free discovery call or strategy session", next: "Confirm email → pre-call sequence (2 emails) → call → close or nurture", zoho: "SOL_Conversion_Push → CRM deal created → Sales rep notification" },
      community:    { action: "Post valuable content → comment engagers get a soft reply CTA → DM those who engage 2+ times", next: "DM conversation → qualify → invite to call → close", zoho: "Manual CRM entry after DM → AWR tag → nurture if not ready" },
      owned:        { action: "Personalised email/WhatsApp → single CTA to book a call", next: "Call booked → pre-call nurture (2 emails) → call → proposal → close", zoho: "SOL_Conversion_Push triggered by Lead_Score → Bookings integration" },
    },
    dm_script: "Hey [name] — noticed you [liked/commented on] my post about [topic]. Quick question — is [pain point] something you're currently dealing with in your business? Happy to share what's been working for our clients if useful.",
    funnels_ranked: ["application", "surfboard", "webinar", "nurture"],
  },
  {
    id: "mid_ticket_service",
    label: "MID-TICKET SERVICE",
    subtitle: "Coaching, workshops, productized service",
    icon: "🎯",
    hex: "#38bdf8",
    price_range: "$500 – $3,000",
    decision_length: "Days to weeks",
    buyer_psychology: "Motivated but cautious. Needs social proof and a clear outcome. Can be moved faster than high-ticket but still needs more than one touchpoint. Price is within reach but not trivial — needs justification.",
    examples: ["Group coaching programs", "Done-with-you services", "Workshops or intensives", "Productized service packages", "Online courses above $500"],
    audience_fit: {
      interruption: { score: "moderate", label: "MODERATE FIT", reason: "Works for retargeting warm audiences but cold interruption rarely converts directly at this price point. Use interruption for list-building then convert via the offer page or follow-up sequence." },
      intent:       { score: "strong",   label: "STRONG FIT",   reason: "Search intent for specific outcomes ('how to set up Zoho CRM', 'best workflow automation for small business') aligns well with mid-ticket productized services. Keyword targeting can be highly efficient." },
      community:    { score: "strong",   label: "STRONG FIT",   reason: "Mid-ticket buyers often need to see 5–10 pieces of valuable content before converting. Community content builds the social proof and familiarity to make the $500–$3K ask feel justified." },
      owned:        { score: "strong",   label: "STRONG FIT",   reason: "A 5–10 email nurture sequence with a clear product offer at the end converts well at this price range. The buyer can make the decision alone without stakeholder sign-off." },
    },
    budget_notes: { zero: "Community content → email list building → product offer via nurture sequence. Surfboard funnel with organic traffic.", small: "Meta ads to opt-in page. Google Search for specific outcome keywords. Email sequence does the conversion.", medium: "Meta prospecting + Google Search + retargeting stack. Webinar funnel or challenge funnel to compress timeline." },
    engagement_path: {
      interruption: { action: "CTA to free lead magnet or low-cost tripwire offer", next: "Opt-in → offer page redirect → email sequence → core offer", zoho: "AWR_Welcome_Series → Lead_Score → CON_Nurturing_Sequence → SOL_Conversion_Push" },
      intent:       { action: "CTA directly to offer/sales page or call booking", next: "Sales page → buy or book → onboarding sequence", zoho: "SOL_Conversion_Push → purchase confirmation → RET_Welcome sequence" },
      community:    { action: "Valuable post → engage commenters → soft CTA in reply → DM those who DM you", next: "DM conversation → link to sales page or call scheduler → close", zoho: "UTM link in DM → form fill → MA contact → nurture if no immediate purchase" },
      owned:        { action: "Email with clear offer, outcome, and single CTA to sales page or checkout", next: "Sales page → purchase → onboarding email sequence", zoho: "SOL_Conversion_Push → purchase → RET_Upsell_Series" },
    },
    dm_script: "Hey [name] — glad the post on [topic] was useful! If you ever want to go deeper on [outcome], I put together a [workshop/package/program] specifically for [type of person]. Happy to send you the details — want me to drop the link?",
    funnels_ranked: ["surfboard", "tripwire", "webinar", "nurture"],
  },
  {
    id: "low_ticket_digital",
    label: "LOW-TICKET DIGITAL PRODUCT",
    subtitle: "Templates, ebooks, mini-courses, toolkits",
    icon: "📦",
    hex: "#34d399",
    price_range: "$7 – $497",
    decision_length: "Minutes to hours",
    buyer_psychology: "Low risk tolerance needed — can impulse buy if the value is immediately obvious. Price is low enough that one emotional hit is enough to trigger purchase. Speed and clarity of value proposition matters more than deep trust-building.",
    examples: ["Template packs", "Digital toolkits", "Mini-courses under $500", "Ebooks and guides", "Swipe files and frameworks"],
    audience_fit: {
      interruption: { score: "strong",  label: "STRONG FIT",   reason: "Low-ticket digital products can convert directly from cold interruption ads. The low price reduces friction enough that a well-crafted 30-second video ad can drive purchase without extensive nurture. This is your primary paid channel." },
      intent:       { score: "moderate", label: "MODERATE FIT", reason: "Search intent works if people are searching for the specific type of product. Less efficient than interruption for cold audiences at this price point — CPCs can exceed product margin if not managed carefully." },
      community:    { score: "strong",  label: "STRONG FIT",   reason: "Organic posts that showcase the product in use (results, before/after, inside look) convert well at low price points. Comment CTAs and story links work effectively here." },
      owned:        { score: "strong",  label: "STRONG FIT",   reason: "Email promotions with a simple 'here's the product, here's what it does, here's the link' structure convert well. Low consideration means a short 1–2 email sequence is sufficient." },
    },
    budget_notes: { zero: "Community content showcasing product results → bio link or story link → direct purchase. Email list for flash promotions.", small: "Meta conversion ads directly to product page. TikTok organic + link in bio. Email list nurture with product offers.", medium: "Meta conversion campaigns + retargeting stack. TikTok paid. Consider tripwire funnel to acquire buyers cheaply then upsell." },
    engagement_path: {
      interruption: { action: "Direct CTA to product sales page or checkout — no opt-in required at this price point", next: "Purchase → thank you page → order bump or upsell offer → post-purchase email sequence", zoho: "Purchase confirmation → RET_Upsell_Series → tag: Digital_Product_Buyer" },
      intent:       { action: "CTA to product page with clear outcome headline", next: "Product page → purchase → upsell or related product", zoho: "Purchase → CRM contact → RET sequence → repeat buyer nurture" },
      community:    { action: "Post showing the product in action → comment 'TEMPLATE' to get the link (comment keyword trigger)", next: "DM with link → direct purchase → post-purchase follow-up", zoho: "UTM-tagged link → MA contact on purchase → RET_Upsell_Series" },
      owned:        { action: "Short email: what it is, who it's for, what result it gives, price, buy link", next: "Purchase → order bump → upsell email 24hrs later", zoho: "Click on email CTA tracked in Campaigns → purchase → Lead_Score +20 → Buyer tag" },
    },
    dm_script: "Hey! You asked about [topic] — I actually built a [template/toolkit] that covers exactly this. It's [price] and saves most people about [time/outcome]. Want me to send you the link?",
    funnels_ranked: ["tripwire", "surfboard", "nurture", "challenge"],
  },
  {
    id: "ecommerce",
    label: "PHYSICAL PRODUCT / ECOMMERCE",
    subtitle: "Products shipped or sold via online store",
    icon: "🛒",
    hex: "#f59e0b",
    price_range: "Any — typically $20–$500 per unit",
    decision_length: "Minutes to days",
    buyer_psychology: "Visual and tactile — needs to see the product clearly. Social proof (reviews, UGC) is the dominant trust signal. Repeat purchase behaviour is the revenue engine, not the first sale. Abandon cart recovery is critical.",
    examples: ["Consumer goods", "Fashion and apparel", "Health and wellness products", "Home goods", "Specialty or niche products"],
    audience_fit: {
      interruption: { score: "strong",  label: "STRONG FIT",   reason: "Physical products are the native use case for Meta and TikTok interruption ads. UGC-style product demos, unboxings, and before/after content perform exceptionally well. This is the dominant channel for ecommerce customer acquisition." },
      intent:       { score: "strong",  label: "STRONG FIT",   reason: "Google Shopping ads and brand/product keyword search are highly efficient for ecommerce once the product has demand. Best used for retargeting and converting searchers already familiar with the product type." },
      community:    { score: "moderate", label: "MODERATE FIT", reason: "Community content works for building brand affinity and UGC generation, but organic reach alone rarely sustains ecommerce volume. Use community to generate UGC assets that then fuel your paid interruption campaigns." },
      owned:        { score: "strong",  label: "STRONG FIT",   reason: "Email and SMS are the highest-ROI channels for ecommerce — abandon cart sequences, post-purchase flows, and repeat purchase campaigns. Build the list aggressively from day one." },
    },
    budget_notes: { zero: "TikTok organic product demos — the algorithm still rewards organic product content. Build email list from day one. Leverage free PR and community seeding.", small: "Meta catalogue ads or single product video ads. Google Shopping if product has search demand. Email capture popup on site.", medium: "Full Meta/TikTok prospecting + Google Shopping + retargeting stack. Influencer seeding for UGC. Email/SMS flows fully built out." },
    engagement_path: {
      interruption: { action: "Direct CTA to product page or collection page", next: "Product page → add to cart → checkout → post-purchase email → repeat purchase sequence", zoho: "Commerce integration → purchase → RET_Post_Purchase_Flow → abandon cart trigger if no purchase" },
      intent:       { action: "Google Shopping ad or brand search → product page", next: "Product page → purchase → upsell/cross-sell → review request → repeat", zoho: "UTM tracking → purchase → tag: Search_Buyer → RET sequence" },
      community:    { action: "Product demo post → tag in comments for link → story link or bio link", next: "Product page → purchase → post-purchase sequence", zoho: "UTM-tagged bio link → Commerce purchase → RET flow" },
      owned:        { action: "Abandon cart SMS/email within 1 hour, repeat purchase email at predicted reorder date", next: "Click → return to cart → purchase → loyalty program invitation", zoho: "Zoho Commerce → abandon cart webhook → Campaigns trigger → SMS follow-up" },
    },
    dm_script: "Hey [name] — saw you were looking at [product]. Just wanted to let you know we have [offer/stock info/personalised note]. Happy to answer any questions before you decide!",
    funnels_ranked: ["tripwire", "surfboard", "nurture", "challenge"],
  },
  {
    id: "saas",
    label: "SAAS / SOFTWARE / APP",
    subtitle: "Subscription software, tools, platforms",
    icon: "💻",
    hex: "#f472b6",
    price_range: "Freemium to $1K+/month",
    decision_length: "Hours (self-serve) to months (enterprise)",
    buyer_psychology: "Needs to experience the product before committing. Free trial or freemium is the primary conversion mechanism. Churns if value isn't realised quickly — onboarding experience is as important as acquisition. Expansion revenue (upselling seats/features) is the real margin.",
    examples: ["CRM or marketing tools", "Project management software", "Analytics platforms", "Productivity apps", "AI tools or automation software"],
    audience_fit: {
      interruption: { score: "moderate", label: "MODERATE FIT", reason: "Interruption works for free trial sign-ups or freemium conversions — low friction ask. Less effective for paid plans without a trial phase. Use interruption to drive free trial volume, not direct paid subscription." },
      intent:       { score: "strong",  label: "STRONG FIT",   reason: "SaaS buyers search for specific solutions ('best CRM for small business', 'Zoho alternative', 'workflow automation software'). Google Search captures active buyers in evaluation mode — the most efficient paid channel for SaaS." },
      community:    { score: "strong",  label: "STRONG FIT",   reason: "Product-led content (tutorials, use cases, feature demos, tips and tricks) builds massive organic traffic and trust for SaaS. Developers and tech buyers research heavily via community channels." },
      owned:        { score: "strong",  label: "STRONG FIT",   reason: "Onboarding email sequences are the difference between a churned trial and a converted paying customer. In-app triggers + email nurture during the trial period is mission-critical for SaaS conversion." },
    },
    budget_notes: { zero: "SEO-focused content + community tutorials + product demo posts. Build email list via free tool or free trial. Product Hunt launch.", small: "Google Search for high-intent comparison/alternative keywords. Retargeting trial users who didn't convert.", medium: "Google Search + Meta retargeting + LinkedIn for B2B SaaS. Content marketing + paid amplification of top-performing organic posts." },
    engagement_path: {
      interruption: { action: "CTA to free trial or freemium sign-up — remove all friction", next: "Sign-up → onboarding email sequence → activation milestone → upgrade prompt", zoho: "Trial signup → MA onboarding sequence → usage tracking → upgrade CTA at day 7 and 14" },
      intent:       { action: "CTA to free trial, demo booking, or pricing page", next: "Trial → onboarding → activation → sales outreach for high-usage trial users", zoho: "UTM tracking → trial signup → Lead_Score based on in-app actions → SDR notification at 50+" },
      community:    { action: "Tutorial/use-case post → comment for access → link to free trial or freemium", next: "Free trial → onboarding → convert or nurture", zoho: "UTM link → trial signup → MA onboarding sequence" },
      owned:        { action: "Onboarding email series: Day 0 welcome, Day 1 first action, Day 3 key feature, Day 7 check-in, Day 14 upgrade prompt", next: "Active user → upgrade → expansion → referral", zoho: "Automated Campaigns sequence tied to trial start date → upgrade trigger → RET expansion sequence" },
    },
    dm_script: "Hey [name] — looks like you signed up for the trial but haven't [completed X step] yet. That's usually the moment things click for people. Want me to walk you through it quickly — 10 minutes would get you there?",
    funnels_ranked: ["webinar", "surfboard", "tripwire", "nurture"],
  },
  {
    id: "local_service",
    label: "LOCAL SERVICE BUSINESS",
    subtitle: "Location-based service, trade, or clinic",
    icon: "📍",
    hex: "#fb923c",
    price_range: "$50 – $5,000 per job",
    decision_length: "Hours to days",
    buyer_psychology: "Proximity and trust are the two dominant purchase signals. Wants evidence the business is real, nearby, and has done this before for someone like them. Reviews and before/after results matter more than brand aesthetics. Urgency is often high — they need this done.",
    examples: ["Trades (plumber, electrician, builder)", "Health and beauty clinics", "Gyms and fitness studios", "Restaurants and hospitality", "Professional services (accountant, solicitor)"],
    audience_fit: {
      interruption: { score: "strong",  label: "STRONG FIT",   reason: "Geo-targeted Meta and TikTok ads with local before/after content, testimonials, and offer-led CTAs work extremely well for local services. The geographic constraint actually reduces CPMs — you're not competing with the whole internet for impressions." },
      intent:       { score: "strong",  label: "STRONG FIT",   reason: "Local search intent ('electrician near me', 'best physio Gold Coast') is the highest purchase-intent signal in local marketing. Google Search + Google Business Profile optimisation is non-negotiable for local service businesses." },
      community:    { score: "moderate", label: "MODERATE FIT", reason: "Local community groups (Facebook community groups, Nextdoor, local Instagram) can be excellent for referral-based awareness. Works best as a supplementary channel rather than primary — volume is limited by local audience size." },
      owned:        { score: "moderate", label: "MODERATE FIT", reason: "Email and SMS work well for rebooking, review requests, and seasonal promotions. Powerful for retention but not the primary acquisition channel for most local businesses." },
    },
    budget_notes: { zero: "Google Business Profile optimisation (free and critical). Local Facebook group presence. Ask every customer for a Google review. Instagram before/after posts.", small: "Google Search ads for local intent keywords. Meta geo-targeted ads with offer or lead magnet. Review generation campaign.", medium: "Google Search + Meta geo-targeted prospecting + retargeting. Local influencer partnerships. Review management system." },
    engagement_path: {
      interruption: { action: "Geo-targeted ad with local offer → CTA to call, book, or claim offer", next: "Call or form submission → confirmation → service delivery → review request → rebooking prompt", zoho: "Form → MA contact → booking confirmation → post-service review email → RET rebooking sequence" },
      intent:       { action: "Google Search ad → local landing page with phone number, reviews, and CTA to book", next: "Click → call or form → booking → service → review request", zoho: "UTM tracking → form submission → CRM lead → booking → review request automation" },
      community:    { action: "Local group post offering genuine value or answering a question → soft mention of service", next: "Comment or DM → call or booking link → service delivery", zoho: "Manual entry → CRM → booking → review request" },
      owned:        { action: "SMS or email at optimal rebook window (e.g. 6 weeks after last visit) with personalised CTA", next: "Click → booking → service → review → loyalty offer", zoho: "Zoho CRM date-based trigger → Campaigns rebooking email + SMS → booking confirmation" },
    },
    dm_script: "Hey [name]! Thanks for [engaging/asking about our service]. We're local to [area] — if you ever need [service], happy to give you a quick no-obligation quote. Just let me know!",
    funnels_ranked: ["surfboard", "nurture", "tripwire", "application"],
  },
  {
    id: "community_membership",
    label: "COMMUNITY / MEMBERSHIP / CONTENT",
    subtitle: "Paid community, subscription content, newsletter",
    icon: "🌐",
    hex: "#94a3b8",
    price_range: "$10 – $500/month",
    decision_length: "Hours to days",
    buyer_psychology: "Motivated by belonging and consistent access to value. Needs to see what the community looks like and who else is in it. Identity-driven purchase — they want to be the type of person who is a member of this community. Churn prevention matters as much as acquisition.",
    examples: ["Paid newsletter or Substack", "Online membership community", "Mastermind groups", "Content subscription", "Coaching group programs"],
    audience_fit: {
      interruption: { score: "moderate", label: "MODERATE FIT", reason: "Can work for low-cost memberships but community products are harder to sell cold via interruption. Works better for free community entry points that then convert to paid. Use to build free tier, not directly sell paid membership." },
      intent:       { score: "weak",    label: "WEAK FIT",     reason: "People rarely search specifically for a community to join. Search intent is usually problem-based, not community-based. Use search to attract people to your content then convert them to members via owned channels." },
      community:    { score: "strong",  label: "STRONG FIT",   reason: "Giving away a taste of the community experience through organic content is your most powerful acquisition mechanism. Show the transformation members are experiencing. Let community attract community — it's self-reinforcing." },
      owned:        { score: "strong",  label: "STRONG FIT",   reason: "Email nurture from free content to paid membership is the dominant conversion path. A newsletter-to-paid-community funnel is one of the highest-converting models in this category." },
    },
    budget_notes: { zero: "Organic content showing community results → free trial or free tier entry → email nurture → paid upgrade. This is the native model.", small: "Retargeting ads for content consumers who haven't joined yet. Meta ads to free community entry point.", medium: "Paid ads to free tier → email nurture to paid. Facebook/LinkedIn ads for community type targeting." },
    engagement_path: {
      interruption: { action: "CTA to free community tier or free content piece — not direct paid membership", next: "Free member → onboarding → value experience → upgrade prompt at day 7 and 30", zoho: "Free signup → MA onboarding sequence → Lead_Score → paid upgrade prompt trigger" },
      intent:       { action: "Content piece or free resource as CTA — not direct membership pitch", next: "Content consumer → email opt-in → nurture → membership offer", zoho: "Blog/content UTM → MA opt-in → CON_Nurturing_Sequence → membership offer" },
      community:    { action: "Show community transformation in posts → invite to join free tier or waitlist in comments", next: "Join free → experience value → email upgrade sequence", zoho: "Free signup → AWR_Welcome_Series → Lead_Score → SOL_Conversion_Push at threshold" },
      owned:        { action: "Email showcasing member win or transformation → CTA to join or upgrade", next: "Click → membership checkout → onboarding → engagement loop → retention", zoho: "Campaigns → TrainerCentral integration → member onboarding → churn prediction at 30-day silence" },
    },
    dm_script: "Hey [name] — love that you [engaged with / asked about] [topic]. We actually have a community of [type of people] working on exactly this. I can get you a free [trial/access/look] if you want to check it out before committing to anything?",
    funnels_ranked: ["nurture", "challenge", "surfboard", "webinar"],
  },
];

// Fit score colours
const FIT_COLORS = {
  strong:   { bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.25)",  text: "#34d399", label: "★★★ STRONG FIT" },
  moderate: { bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)",  text: "#f59e0b", label: "★★☆ MODERATE FIT" },
  weak:     { bg: "rgba(248,113,113,0.06)", border: "rgba(248,113,113,0.2)",  text: "#f87171", label: "★☆☆ WEAK FIT" },
  conflict: { bg: "rgba(51,51,51,0.3)",     border: "rgba(99,99,99,0.3)",     text: "#94a3b8", label: "✗ NOT COMPATIBLE" },
};

// Derive compatibility override: if budget=zero and mode requires paid platform
function getAudienceFit(productType, audienceModeId, budget) {
  if (!productType) return null;
  const pt = PRODUCT_TYPES.find(p => p.id === productType);
  if (!pt) return null;
  const fit = pt.audience_fit[audienceModeId];
  if (!fit) return null;
  // Budget conflict overrides
  if (budget === "zero" && audienceModeId === "intent") {
    return { score: "conflict", label: "NO BUDGET — CONFLICT", reason: "Google Search Ads require paid budget. You cannot run intent-based search campaigns with zero budget. Consider Community or Owned audience modes, then migrate to Google Search once revenue supports a $500+/month ad budget." };
  }
  if (budget === "zero" && audienceModeId === "interruption") {
    return { score: "conflict", label: "NO BUDGET — CONFLICT", reason: "Paid interruption ads (Meta, TikTok, YouTube pre-roll) require budget to run. With zero budget, your interruption channel is limited to organic video content on TikTok/Instagram Reels, which is unpaid but functions similarly. Select Community audience mode if you're going organic." };
  }
  return fit;
}

// ── CHANNEL STRATEGIES ──────────────────────────────────────────────────────
// Each channel has a fundamentally different conversation architecture.
// These are not variations of the same thing — they are different psychological modes.

const CHANNEL_STRATEGIES = [
  {
    id: "email",
    label: "EMAIL",
    icon: "📧",
    hex: "#38bdf8",
    tagline: "Broadcast you read alone — asynchronous trust building",
    open_rate: "20–35%",
    ctr: "2–5%",
    response_time: "~90 minutes avg",
    ideal_for: ["Nurture sequences", "Long-form value content", "Product launches", "Re-engagement", "Complex B2B sales"],
    conversation_type: "BROADCAST → PASSIVE READ → DELAYED ACTION",
    conversation_truth: "The reader is alone when they read your email. There is no social pressure, no urgency from your presence, and no conversation happening. They can ignore it, read it slowly, or come back to it tomorrow. This means your email must stand completely on its own — it cannot rely on timing or back-and-forth momentum to close anything. Email builds trust over time through repeated exposure to valuable content.",
    structure: [
      { step: "SUBJECT LINE", role: "Get opened — not to sell. 2–4 words, lowercase, internal-looking. E.g. 'the workflow fix'", timing: "—" },
      { step: "OPENING LINE", role: "Mirror their world immediately. Lead with their situation, not your offer. 'You/Your' dominates 'I/We'.", timing: "First 2 sentences" },
      { step: "BODY", role: "One idea per email. Teach, tell a story, or share a case study. Earn the CTA before placing it.", timing: "3–8 sentences" },
      { step: "SINGLE CTA", role: "One action only. Low-friction ask: 'Reply with X', 'Click to see Y', not 'Buy now' unless hot audience.", timing: "Bottom of body" },
      { step: "P.S. LINE", role: "Optional second hook or human moment. Often the most-read part after the subject line.", timing: "After sign-off" },
    ],
    frameworks: ["PAS (Problem → Agitate → Solution)", "BAB (Before → After → Bridge)", "PASTOR (Problem → Amplify → Story → Testimony → Offer → Response)"],
    frequency: "B2B: 1–2x/week max. B2C: 2–4x/week. Welcome series: daily for 5 days then taper. Broadcast: 1–2x/month for cold lists.",
    metrics: { good: "Open >30%, CTR >3%, Unsub <0.5%", warning: "Open <20% → subject line problem. CTR <1% → weak CTA or wrong audience. Unsub >1% → too frequent or low value" },
    rules: ["4 value emails for every 1 pitch email — never violate this ratio", "Every email must stand alone — they may not have read the previous ones", "Plain text outperforms HTML templates for B2B service businesses", "Reply-bait builds deliverability — 'Hit reply and tell me X' is not fluff, it's infrastructure"],
    platforms_zoho: "Zoho Campaigns (broadcast) + Zoho Marketing Automation (sequences + Lead_Score tracking)",
    audience_modes: ["interruption", "intent", "community", "owned"],
  },
  {
    id: "sms",
    label: "SMS",
    icon: "💬",
    hex: "#34d399",
    tagline: "Immediate personal nudge — highest open rate of any channel",
    open_rate: "98%",
    ctr: "10–36%",
    response_time: "~90 seconds avg",
    ideal_for: ["Time-sensitive offers", "Appointment reminders", "Abandon cart recovery", "Flash sales", "Post-purchase follow-ups", "Re-engagement after email silence"],
    conversation_type: "PUSH BROADCAST → IMMEDIATE READ → IMMEDIATE ACTION",
    conversation_truth: "SMS lands in the same inbox as messages from friends and family. It carries the psychological weight of a personal message even when it's from a business. This means trust and relevance are non-negotiable — spam destroys the relationship permanently. The 98% open rate is not permission to use SMS frequently. It's evidence of how much trust is required to deserve that open. Use sparingly, make every send count.",
    structure: [
      { step: "SENDER NAME", role: "Business name or personal name — personalise where possible. Recognised senders get opened; unknown numbers get ignored.", timing: "—" },
      { step: "CONTEXT HOOK", role: "3–5 words that make this feel relevant and personal. Reference a trigger event where possible.", timing: "First line" },
      { step: "VALUE OR OFFER", role: "Single specific outcome. No ambiguity. What will they get or save?", timing: "1–2 sentences" },
      { step: "SINGLE CTA", role: "One link or one reply keyword. Never two. 'Click here' or 'Reply YES' — never both.", timing: "Final line" },
      { step: "OPT-OUT", role: "Required by law in most jurisdictions. 'Reply STOP to unsubscribe'. Keep it clean and honoured.", timing: "Last line" },
    ],
    frameworks: ["Trigger → Value → CTA (160 chars total — this is the entire framework)", "Event-Based: [trigger event] → [specific value] → [single action]"],
    frequency: "B2B: 2–4x/month absolute maximum. B2C: 1x/week for engaged buyers. Over-messaging causes 23% of consumers to stop supporting a brand entirely.",
    metrics: { good: "Open ~98%, CTR >10%, Opt-out <2%", warning: "Opt-out rising → sending too frequently or low relevance. CTR dropping → weak CTA or wrong timing. Delivery failures → list hygiene issue" },
    rules: ["Explicit opt-in is mandatory — non-compliance carries heavy fines (TCPA/SPAM Act)", "Never send between 8pm–8am local time", "Never send to a cold list — SMS is for warm/hot audiences only", "Never use SMS to pitch cold — only to re-engage or trigger action from existing contacts", "Max 160 characters for standard SMS — emojis and links count against this"],
    platforms_zoho: "Zoho Marketing Automation SMS + Zoho CRM SMS (trigger-based) | External: Twilio, MessageBird for higher volume",
    audience_modes: ["owned"],
  },
  {
    id: "whatsapp",
    label: "WHATSAPP",
    icon: "💚",
    hex: "#25d366",
    tagline: "Personal broadcast that can become a real conversation",
    open_rate: "98%",
    ctr: "15–40%",
    response_time: "Minutes",
    ideal_for: ["High-consideration B2B follow-up", "Post-call nurture", "Personalised check-ins", "Document sharing during sales process", "Onboarding communication"],
    conversation_type: "PERSONAL BROADCAST → 2-WAY CONVERSATION POSSIBLE → RELATIONSHIP BUILDING",
    conversation_truth: "WhatsApp sits between SMS and a DM conversation. It has SMS-level open rates but supports media, documents, voice notes, and natural back-and-forth. For B2B, a WhatsApp message feels more personal than email and less intrusive than a call. The critical difference from SMS: WhatsApp recipients expect you might be starting a real conversation, so your message should sound like it came from a person, not a system.",
    structure: [
      { step: "GREETING + NAME", role: "First name, warm but professional. 'Hey [Name]' not 'Dear Customer'.", timing: "Opening" },
      { step: "CONTEXT BRIDGE", role: "Why you're reaching out right now — connected to something specific. Recent call, content they saw, time since last contact.", timing: "1 sentence" },
      { step: "VALUE OR CHECK-IN", role: "A genuine question or a piece of value. Not a pitch. 'Wanted to share...' or 'Quick question...'", timing: "2–3 sentences" },
      { step: "SOFT CTA", role: "Low friction ask. 'Worth a 15-min chat?' or 'Happy to send more detail if useful?'", timing: "Final line" },
    ],
    frameworks: ["Relationship Check-In: Name → Context → Value/Question → Soft ask", "Post-Call Follow-Up: Reference call → Summary of key point → Next step confirmation → Document/link"],
    frequency: "B2B: 1–2x/week when actively in sales process. Post-purchase: Day 1, Day 7, Day 30. General nurture: 2–4x/month max.",
    metrics: { good: "Open ~98%, Reply rate >15%, Block rate <1%", warning: "Block rate rising → too frequent or low relevance. No replies → message sounds too automated, not personal enough" },
    rules: ["WhatsApp Business API required for business sending at scale — personal numbers get blocked", "Message must feel personal — copy-paste broadcast messages are obvious and destroy trust", "Always include a way to opt out, even if informal: 'Let me know if you'd prefer I reach out another way'", "Never pitch in first WhatsApp message — build the bridge first"],
    platforms_zoho: "Zoho Marketing Automation WhatsApp integration + Zoho CRM WhatsApp (for in-deal communication)",
    audience_modes: ["owned", "community"],
  },
  {
    id: "social_dm",
    label: "SOCIAL DM",
    icon: "💬",
    hex: "#f472b6",
    tagline: "Sales conversation — qualify first, offer second, close third",
    open_rate: "85–95%",
    ctr: "N/A — measured as reply rate, 20–40% from warm triggers",
    response_time: "Minutes to hours",
    ideal_for: ["Community audience conversion", "Post-engagement follow-up", "High-ticket qualification", "Referral conversations", "Lead generation without a landing page"],
    conversation_type: "TRIGGERED CONVERSATION → QUALIFY → BRIDGE → INVITE",
    conversation_truth: "A DM is a live sales conversation, not a broadcast. The person is present and responsive. The conversation can close a deal in a single exchange or need 3–5 messages over several days. The critical mistake is treating it like an email — writing paragraphs and pitching immediately. DMs should be short, warm, and curiosity-driven. Your job in the first DM is not to sell — it's to earn the next message.",
    structure: [
      { step: "TRIGGER", role: "The engagement action that makes the DM appropriate. Comment, story reply, profile visit, keyword trigger, connection request. Without a trigger, the DM is cold outreach and will feel invasive.", timing: "Before you DM" },
      { step: "ACKNOWLEDGE + PERSONALISE", role: "1 sentence referencing the specific trigger. Shows you're a human, not a bot. Creates psychological safety.", timing: "Opening DM" },
      { step: "QUALIFY WITH CURIOSITY", role: "1 question that identifies whether they're a fit. Not 'Do you want to buy?' — 'Is [problem] something you're dealing with right now?'", timing: "Message 1 CTA" },
      { step: "BRIDGE ON REPLY", role: "If they confirm the problem: share a specific insight, result, or resource. Do not pitch yet. Earn one more exchange.", timing: "Message 2" },
      { step: "SOFT INVITE", role: "If they're engaged after the bridge: low-friction next step. 'Happy to share how we approach this — want me to drop the details?' or 'Worth a quick call to see if it fits?'", timing: "Message 3+" },
      { step: "FOLLOW-UP IF SILENT", role: "1 follow-up after 48 hours if no reply. After that, move on. Never send 3+ follow-ups to an unresponsive DM.", timing: "+48hrs" },
    ],
    frameworks: [
      "Acknowledge → Qualify → Bridge → Invite (4-message framework for cold-to-warm community DMs)",
      "Comment keyword trigger → Automated DM → Human takeover at qualification (hybrid automation)",
      "SCQ (Situation → Complication → Question) adapted for DM brevity",
    ],
    frequency: "As many as engagement warrants — DMs are pulled by behaviour, not pushed on a schedule. Set automation triggers for volume; manual for high-ticket.",
    metrics: { good: "Reply rate >30% from warm triggers, Conversion to next step >15% of replies, Blocked rate <1%", warning: "Low reply rate → DM feels like spam or arrives without a natural trigger. Blocked → pitching too early, not qualifying first" },
    rules: ["Never pitch in the first DM — earn the conversation before you earn the sale", "Automated DM tools (ManyChat, Inrō) can handle volume at AWR stage — humans handle close at SOL stage", "Comment keyword triggers (e.g. 'Comment AUDIT to receive...') are legitimate Meta API functionality — not grey area bots", "Instagram DMs and LinkedIn DMs have different psychology — IG is casual and fast, LinkedIn is professional and slower"],
    platforms_zoho: "Manual DMs → manually log contact in Zoho CRM | Automated triggers → ManyChat or Inrō → webhook to Zoho MA on opt-in",
    audience_modes: ["community", "interruption"],
  },
  {
    id: "social_content",
    label: "SOCIAL CONTENT",
    icon: "📱",
    hex: "#f59e0b",
    tagline: "Platform-native content that earns attention before earning the right to sell",
    open_rate: "Algorithm-dependent — Reels avg 5–15% reach, carousels 3–8%",
    ctr: "0.5–3% link-in-bio CTR from organic posts",
    response_time: "Hours to days (non-linear)",
    ideal_for: ["Cold audience awareness", "Authority building", "Community audience warming", "UGC generation", "Social proof accumulation"],
    conversation_type: "PUBLIC BROADCAST → PASSIVE CONSUMPTION → SELF-DIRECTED NEXT STEP",
    conversation_truth: "Social content is not a conversation — it's a stage performance. Your audience is watching, and most of them will never interact at all. The 1% rule of content: 1% will buy, 9% will engage, 90% will watch silently. Design content for the 90% who consume without engaging. Your silent audience is your largest and most valuable — they are warming up without you knowing it, and they'll show up when they're ready. Never optimise purely for comments and likes at the expense of strategic content that builds real authority.",
    structure: [
      { step: "HOOK (0–3 SEC / FIRST LINE)", role: "Stop the scroll or earn the open. Pattern interrupt, provocative statement, or problem-identification. This is everything.", timing: "Non-negotiable first" },
      { step: "PROBLEM AGITATION", role: "Dwell on the pain they recognise. Not your solution yet. The ratio is 60% problem / 40% solution in the body.", timing: "Core body" },
      { step: "INSIGHT OR FRAMEWORK", role: "The piece of genuine value — a framework, a counterintuitive truth, a specific result. This is what gets saved and shared.", timing: "Middle third" },
      { step: "SOCIAL PROOF SIGNAL", role: "Woven in naturally — a client result, a before/after, a specific number. Not a testimonial wall.", timing: "After insight" },
      { step: "SOFT CTA", role: "One action. 'Comment X for the guide', 'Link in bio', 'Follow for more'. Never two CTAs. Organic posts with links in body get suppressed by algorithms.", timing: "Final line" },
    ],
    frameworks: [
      "Hook → Problem Agitation → Insight → Social Proof → Soft CTA (universal organic structure)",
      "Reels: Pattern interrupt (0–3s) → Pain recognition (3–10s) → Solution tease (10–20s) → CTA (20–30s)",
      "Carousels: Bold hook slide → 5–7 value slides → Summary slide → CTA slide",
      "LinkedIn posts: Provocative first line (no line break shown until click) → Story or framework → 3–5 key points → Question or CTA",
    ],
    platform_notes: {
      instagram: "Reels = discovery. Carousels = education. Stories = relationship + link CTA. DMs = conversion. Highlights = permanent social proof.",
      linkedin: "Long-form posts for B2B authority. Comment on target accounts before posting. DM warm connections after they engage with your content.",
      tiktok: "Algorithm-first platform — content quality beats follower count. Native-feel UGC outperforms polished production. Link in bio is your only conversion path.",
      facebook_groups: "Community-first — provide value in groups before mentioning your business. Question posts and polls outperform broadcast posts. Event hosting builds the fastest warm audiences.",
      youtube: "Long-form for deep authority. Shorts for discovery. End screens and pinned comments for CTA. SEO-driven — titles and descriptions matter as much as the video.",
    },
    frequency: "3–5x/week minimum for algorithm favourability. Consistency over intensity — 3 posts/week for 6 months beats 30 posts in one week.",
    metrics: { good: "Engagement rate >3% (likes+comments÷reach), Save rate >1%, Profile visits from posts >5%", warning: "Engagement <1% → hook problem. Reach declining → link in post body, reduce posting frequency, or audience mismatch" },
    rules: ["Never put links in the post body on Instagram or Facebook — algorithm suppresses reach", "Reply to every comment within 1 hour of posting — early engagement velocity signals the algorithm", "Repurpose: one LinkedIn post → IG carousel → 3 Twitter insights → 1 email section", "Consistency beats virality as a business strategy — one viral post means nothing without a place to send the audience"],
    platforms_zoho: "Bio link with UTM → Zoho form or landing page → MA contact created | Comment triggers → ManyChat → opt-in → MA nurture sequence",
    audience_modes: ["interruption", "community"],
  },
  {
    id: "sales_call",
    label: "SALES CALL / DISCOVERY CALL",
    icon: "📞",
    hex: "#a78bfa",
    tagline: "Guided discovery — diagnose first, prescribe second, close third",
    open_rate: "N/A — measured as show rate (50–70% from booked calls)",
    ctr: "N/A — measured as close rate (20–40% for qualified calls)",
    response_time: "Real-time — synchronous",
    ideal_for: ["High-ticket services $3K+", "Complex solutions requiring diagnosis", "Enterprise sales", "Situations where trust cannot be built asynchronously", "Application funnel close step"],
    conversation_type: "GUIDED DISCOVERY → DIAGNOSIS → PRESCRIPTION → CLOSE",
    conversation_truth: "A sales call is not a presentation — it's a consultation. The biggest mistake is talking more than you listen. The ratio should be 30% talking, 70% listening in the first 20 minutes. Your job is to make the prospect feel deeply understood before you ever mention your offer. If you've done discovery correctly, the prospect often closes themselves — they've articulated their own problem clearly enough that your solution is the obvious answer.",
    structure: [
      { step: "PRE-CALL SEQUENCE", role: "2 emails before the call: confirmation + what to expect. Reduces no-show rate by 30–40%. Sets professional tone.", timing: "Day before + morning of" },
      { step: "RAPPORT (2–3 MIN)", role: "Genuine, brief. One specific question about them. Not generic small talk.", timing: "Opening" },
      { step: "AGENDA SETTING", role: "Tell them what will happen in the call and get agreement. Creates structure and reduces uncertainty.", timing: "First 2 minutes" },
      { step: "DISCOVERY (15–20 MIN)", role: "SPIN questions: Situation (where are they now?) → Problem (what's the pain?) → Implication (what does it cost them?) → Need-payoff (what would solving it mean?)", timing: "Core of call" },
      { step: "DIAGNOSE + REFLECT", role: "Summarise what you heard before proposing anything. 'So what I'm hearing is...' This confirms understanding and makes them feel heard.", timing: "After discovery" },
      { step: "PRESCRIBE", role: "Present your solution as a direct response to what they told you. Reference their specific answers. Never feature dump.", timing: "After diagnosis" },
      { step: "HANDLE OBJECTIONS", role: "Price, timing, stakeholders, trust. Each objection has a specific response structure — acknowledge, reframe, evidence, ask.", timing: "After prescription" },
      { step: "CLOSE OR NEXT STEP", role: "Ask for the decision. 'Based on what you've shared, does this feel like a fit?' Direct but not pushy.", timing: "Final 5 minutes" },
    ],
    frameworks: [
      "SPIN Selling: Situation → Problem → Implication → Need-payoff (most effective for complex B2B)",
      "Challenger Sale: Teach → Tailor → Take control (for enterprise, consultative sales)",
      "Discovery → Diagnose → Prescribe → Close (service business standard)",
    ],
    frequency: "Not frequency-based — triggered by lead score threshold in Zoho MA (typically Lead_Score 50+)",
    metrics: { good: "Show rate >65%, Call-to-close >25%, Average deal size growing", warning: "Show rate <50% → pre-call sequence not running or lead quality low. Close rate <15% → discovery too shallow or offer-market mismatch" },
    rules: ["Never skip discovery to get to the pitch faster — you will close less", "Pre-qualify before the call with an application form for high-ticket offers", "Record calls (with consent) — reviewing recordings is the fastest way to improve close rate", "Follow up within 24 hours with a written summary of what was discussed and agreed"],
    platforms_zoho: "Zoho Bookings for scheduling → CRM deal created on booking → Pre-call email sequence via Campaigns → Post-call follow-up via CRM task",
    audience_modes: ["owned", "intent", "community"],
  },
  {
    id: "paid_social",
    label: "PAID SOCIAL ADS",
    icon: "📢",
    hex: "#fb923c",
    tagline: "Rented attention at scale — interruption that must earn its place in 3 seconds",
    open_rate: "CTR: 0.5–2% (Meta), 0.3–1.5% (TikTok)",
    ctr: "0.5–3% average; 3%+ = strong creative",
    response_time: "N/A — measured as CTR and conversion rate",
    ideal_for: ["Cold audience prospecting at scale", "Retargeting warm audiences", "Amplifying organic content", "Product launches", "Lead generation with budget"],
    conversation_type: "PAID INTERRUPTION → FORCED ATTENTION → EARN CLICK → LANDING PAGE CONVERTS",
    conversation_truth: "A paid ad is not a conversation — it's an uninvited guest. You interrupted someone who was doing something else. You have 3 seconds to justify that interruption or they're gone. The first 3 seconds of video or the first line of a static ad is the entire game. Everything else is wasted if you don't earn that stop. The ad itself does not sell — it earns a click. The landing page sells.",
    structure: [
      { step: "PATTERN INTERRUPT (0–3S)", role: "Visual or auditory hook that stops the scroll. Unexpected, native-feeling, emotionally triggering.", timing: "Non-negotiable" },
      { step: "PAIN RECOGNITION (3–10S)", role: "Name the problem they feel. Not your solution yet. They must feel seen.", timing: "First 7 seconds after hook" },
      { step: "SOLUTION TEASE (10–20S)", role: "What outcome is possible — not how, just what. Create curiosity.", timing: "Middle third" },
      { step: "SOCIAL PROOF SIGNAL", role: "One specific credibility point. Number, client result, authority signal.", timing: "After solution tease" },
      { step: "SINGLE CTA", role: "One job. Click to opt-in, click to see offer, click to book. Never two asks.", timing: "Final 5 seconds / last line" },
    ],
    frameworks: [
      "Hook → Pain → Solution tease → Proof → CTA (universal paid social structure)",
      "UGC style: Problem storytelling → Product as solution → Result + CTA (native feed format)",
      "Testimonial: Real person → Specific problem → Specific result → Your brand CTA",
    ],
    frequency: "Managed by budget and frequency caps. Monitor Meta frequency — refresh creative when frequency >3.0 or CTR drops 20%+ from baseline.",
    metrics: { good: "CTR >1% (cold), >2% (warm). CPL improving over 30 days. ROAS >3x for product offers.", warning: "CTR <0.5% → hook failure. High CTR, low conversion → landing page problem not ad problem. Frequency >4.0 → creative fatigue" },
    rules: ["The ad earns the click — the landing page earns the conversion. Blaming the ad for low conversion often misdiagnoses the problem.", "Creative refresh every 4–6 weeks on cold audiences. Warm retargeting can run longer.", "UGC-style creative consistently outperforms polished brand video on Meta and TikTok for most product categories", "Never change more than one variable at a time when A/B testing — otherwise you cannot attribute the result"],
    platforms_zoho: "UTM parameters → Zoho MA opt-in form → AWR_Welcome_Series or direct SOL_Conversion_Push → Lead_Score tracking",
    audience_modes: ["interruption"],
  },
];

// Which channels are primary for each audience mode
const MODE_CHANNELS = {
  interruption: ["paid_social", "social_content", "email"],
  intent:       ["sales_call", "email", "social_content"],
  community:    ["social_content", "social_dm", "email", "whatsapp"],
  owned:        ["email", "sms", "whatsapp", "sales_call"],
};

// Maps each channel to funnels that naturally fit that delivery mechanism
const CHANNEL_FUNNEL_AFFINITY = {
  paid_social:    ["surfboard", "tripwire", "squeeze_page", "lead_magnet", "quiz_funnel", "free_plus_shipping", "vsl_direct", "slo_funnel", "flash_sale", "two_step_order", "sales_letter", "challenge", "limited_time_offer"],
  social_content: ["surfboard", "reverse_squeeze", "challenge", "quiz_funnel", "lead_magnet", "bridge_funnel", "video_series", "product_launch", "summit_funnel", "squeeze_page", "nurture"],
  email:          ["nurture", "webinar", "evergreen_webinar", "product_launch", "limited_time_offer", "upsell_funnel", "downsell_funnel", "cross_sell_funnel", "reengagement_funnel", "membership_continuity", "flash_sale", "tripwire", "video_series"],
  sms:            ["flash_sale", "limited_time_offer", "reengagement_funnel", "upsell_funnel", "free_plus_shipping"],
  whatsapp:       ["nurture", "application", "book_a_call", "strategy_session", "client_referral", "vsl_prequalification"],
  social_dm:      ["application", "book_a_call", "strategy_session", "surfboard", "referral_partnership", "client_referral", "challenge"],
  sales_call:     ["application", "vsl_prequalification", "book_a_call", "strategy_session", "webinar"],
};

const MAX_FUNNELS_PER_CHANNEL = 3;

const MARKET_CONDITIONS = [
  {
    id: "cold", label: "COLD MARKET", analogy: "Iron Condor — Sideways Market",
    short: "No one knows you exist yet", hex: "#38bdf8", icon: "❄️",
    stage: "AWR", funnelPage: "Page 1 ONLY — build the list first",
    property: "Land Banking — you own the land, nothing built yet",
    signals: {
      title: "How to diagnose a COLD market",
      positive: [
        "Zero brand search volume — no one Googles your name",
        "No MA or CRM contacts — database is completely empty",
        "Target audience uses different words to describe their own problem",
        "Audience may not know the problem has a name or a solution",
        "No social followers, no email list, zero prior touchpoints",
        "You're targeting lookalike audiences or broad interest groups",
      ],
      negative: [
        "Don't run conversion ads — you haven't earned enough trust yet",
        "Don't use insider jargon they haven't heard (e.g. 'workflow automation')",
        "Don't confuse 'new to you' with 'cold' — they may know the problem well",
      ],
      zoho: "Zoho MA: zero contacts. CRM: empty pipeline. Google Search Console: brand search impressions near zero. Meta Ads: no pixel audience yet — lookalike targeting only.",
    },
  },
  {
    id: "warm", label: "WARM MARKET", analogy: "Bull Call Spread — Upward Trend",
    short: "They know the problem, not necessarily you", hex: "#f59e0b", icon: "🌤️",
    stage: "CON → SOL", funnelPage: "Page 1 → Page 2 — capture then convert",
    property: "Buy & Hold — asset is appreciating, nurture it toward full value",
    signals: {
      title: "How to diagnose a WARM market",
      positive: [
        "Website visitors who didn't convert — traffic without opt-ins",
        "Social engagers: 25%+ video views, saves, comments — saw you but didn't act",
        "Email openers who never clicked — reading but not ready",
        "Pixel retargetable audiences in Meta or Google (500+ visitors)",
        "MA contacts tagged AWR but not CON — opted in then gone quiet",
        "People who follow you but have never messaged or booked",
      ],
      negative: [
        "Don't send them to Page 1 again — they've already been there",
        "Don't pitch too fast — interest exists but trust isn't complete",
        "Don't use cold-market problem-agitation hooks — they know the problem",
      ],
      zoho: "Zoho MA: contacts with Lead_Score 10–40, tagged Stage_Awareness, emails opened but call link not clicked. Meta pixel pool: 500+ warm site visitors available for retargeting.",
    },
  },
  {
    id: "hot", label: "HOT MARKET", analogy: "Long Call / Covered Call — Breakout",
    short: "They know you and have raised their hand", hex: "#34d399", icon: "🔥",
    stage: "SOL → RET", funnelPage: "Page 2 → Page 3 — skip opt-in, go direct to offer",
    property: "Flip / Development — building value for a fast, decisive outcome",
    signals: {
      title: "How to diagnose a HOT market",
      positive: [
        "Downloaded your lead magnet — opted in voluntarily",
        "Visited your pricing page — cost is already on their mind",
        "Booked and attended a discovery call — serious declared intent",
        "Abandoned checkout — wanted to buy, something stopped them",
        "Existing past customers — proven willingness to pay",
        "Direct DMs or email enquiries — explicitly raised their hand",
        "MA Lead Score 50+ — high engagement across multiple touchpoints",
      ],
      negative: [
        "Don't send hot leads to awareness content — it's a step backward",
        "Don't be vague about price or process — they're ready for specifics",
        "Don't over-nurture with long sequences — excessive emails kill urgency",
      ],
      zoho: "Zoho MA: Lead_Score 50+, tagged SOL_Call_Booked or SOL_Pricing_Viewed. CRM: deal created, stage = Qualified. Retargeting: pricing page visitors, abandoned checkout audience in Meta.",
    },
  },
];

const CONSTRAINTS = [
  {
    id: "reach", label: "REACH PROBLEM", icon: "📡", hex: "#38bdf8",
    subtitle: "Not Enough People Know You Exist",
    desc: "Your pipeline is empty because your world is too small. You don't have a conversion problem or an offer problem — you simply haven't been seen by enough of the right people yet.",
    diagnostic: [
      "Email list under 500 contacts",
      "Website receiving under 1,000 visits per month",
      "Brand search volume near zero in Google Search Console",
      "Fewer than 5 inbound enquiries arriving per month",
      "CRM pipeline is empty or entirely self-sourced (you chased them)",
      "Social following under 500 — no organic distribution yet",
    ],
    wrong_fix: "Spending money on conversion or retargeting ads before the audience exists is like paying for a grand opening party with no one on the invitation list. The algorithm has no one to optimise toward.",
    right_fix: "AWR campaigns exclusively. Page 1 of the Surfboard Funnel only. Fill the top of the funnel before anything else. Validate with organic before spending on paid.",
    stage: "AWR",
  },
  {
    id: "conversion", label: "CONVERSION PROBLEM", icon: "🔄", hex: "#f59e0b",
    subtitle: "People Know You But Don't Buy",
    desc: "You have traffic, opt-ins, or enquiries but they're stalling before becoming clients. This is a trust gap, an offer clarity issue, a messaging mismatch, or a nurture sequence that isn't doing its job.",
    diagnostic: [
      "Email list is healthy (500+) but call-booking rate is under 3%",
      "High website traffic but opt-in conversion rate is under 2%",
      "Sales calls are happening but your close rate is under 20%",
      "Leads going quiet after initial contact — ghosting pattern",
      "People asking 'how much does it cost?' then disappearing",
      "MA contacts are accumulating but not progressing to CRM",
    ],
    wrong_fix: "Driving more traffic into a leaky bucket doesn't help — you'll spend more money to achieve the same poor results. More leads is not the solution when leads already exist and aren't converting.",
    right_fix: "CON and SOL campaigns. Improve your Page 2 VSL. Strengthen the email nurture sequence. Address objections explicitly in content. Improve the call-booking flow.",
    stage: "CON → SOL",
  },
  {
    id: "value", label: "VALUE PROBLEM", icon: "📈", hex: "#a78bfa",
    subtitle: "Customers Buy Once Then Disappear",
    desc: "You can acquire customers but your Lifetime Value (LTV) is too low to make the economics work. Every new customer costs you money to acquire — retention and upsell is where you recover it and build real margin.",
    diagnostic: [
      "Good sales numbers but thin net profit margins per project",
      "No repeat business — customers complete once and leave",
      "Zero referrals coming in from existing clients",
      "No upsell or continuity product exists after the first purchase",
      "Client relationships end abruptly the moment delivery finishes",
      "Customer acquisition cost (CAC) is approaching or exceeding LTV",
    ],
    wrong_fix: "Acquiring more new customers at a loss and hoping volume solves the margin problem. It doesn't — it compounds it. A leaking bucket doesn't get better when you pour more water in faster.",
    right_fix: "RET campaigns. Page 3 upsell. Post-purchase email sequences. WhatsApp and SMS check-ins at Day 7 and Day 30. Referral program. Retainer or membership continuity offer.",
    stage: "SOL → RET",
  },
];

const BUDGET_LEVELS = [
  {
    id: "zero", label: "ZERO BUDGET", icon: "🌱", desc: "Organic only — no ad spend",
    note: "Validate your offer before spending a dollar. Use organic to prove demand first. If organic doesn't move, paid won't save it.",
  },
  {
    id: "small", label: "$500–$2K / MO", icon: "🚀", desc: "Paid social — single platform focus",
    note: "Pick one paid channel and master it before expanding. Meta is usually the right first choice for B2B services.",
  },
  {
    id: "medium", label: "$2K–$10K / MO", icon: "⚡", desc: "Multi-channel paid campaigns",
    note: "Layered strategy: prospecting + retargeting + search intent running simultaneously.",
  },
];

const AUDIENCE_MODES = [
  {
    id: "interruption", label: "INTERRUPTION AUDIENCE", icon: "📱", hex: "#f472b6",
    subtitle: "They weren't looking for you — you interrupted them",
    platforms: ["Meta (FB/IG)", "TikTok", "YouTube Pre-roll", "Google Display"],
    utm_sources: ["meta", "tiktok", "organic_ig", "organic_tt"],
    why_matters: "This audience was mid-scroll, mid-video, or mid-feed when your content appeared. They had zero intention of finding marketing when you interrupted them. This single fact changes everything about how your creative must behave. You have not earned their attention — you must steal it in the first 3 seconds or they are gone. Every creative decision flows from this reality: the hook, the copy structure, the visual, the CTA. You are a stranger who tapped them on the shoulder. Act accordingly.",
    tactics: [
      { name: "HOOK FIRST — always", detail: "Open with a pattern interrupt that earns the scroll-stop before anything else. A bold claim, a surprising statistic, a counter-intuitive statement, or a visually unexpected opening frame. 'Are you still manually copying data between your CRM and spreadsheets every week?' is a hook. 'We offer Zoho workflow automation services' is not. The hook has one job: buy the next 5 seconds." },
      { name: "PROBLEM-AGITATION before solution (60/40 rule)", detail: "Spend 60% of your ad time or copy dwelling on the pain they already feel — before you offer your answer. They need to feel recognised and understood before they trust your solution. This feels counterintuitive but it builds the emotional resonance that makes people act. Name the specific frustration, then amplify it, then offer the escape." },
      { name: "ZERO assumed context", detail: "Write as if they have never heard of you, your industry category, or your solution. Never use jargon, acronyms, or product names without immediate plain-English explanation. 'Zoho workflow automation' means nothing to a cold audience. 'Automatically sending invoices, follow-ups, and reports without touching your keyboard' means everything. Translate every industry term." },
      { name: "ONE message, ONE CTA, ONE job", detail: "15–30 second videos. One promised outcome. One call to action. Do not explain multiple features. Do not list five benefits. Pick the single most viscerally compelling thing about your offer and go all in on it. Interruption audiences have short attention spans and zero existing goodwill — every extra message dilutes the primary one." },
      { name: "NATIVE FEEL beats polished production", detail: "Content that looks and sounds organic to the platform consistently outperforms studio-quality brand advertising. On TikTok, authentic talking-head footage outperforms polished commercials. On Instagram Reels, UGC-style content beats designed graphics. Match the aesthetic and pacing of the organic feed — if it looks like an ad immediately, people scroll past it immediately." },
      { name: "CAPTIONS always on — 85% rule", detail: "85% of social video is watched with the sound off. If your entire message lives in the audio track, you have already lost 85% of your potential audience before a single word registers. Every video requires either burned-in captions or text overlays that carry the full message visually. Test your ad with the sound muted — if the message still lands, you're in good shape." },
    ],
    creative_formula: "Pattern Interrupt (0–3s) → Pain Recognition (3–10s) → Solution Tease (10–20s) → Single CTA (20–30s)",
    copy_example: "\"Still manually entering leads into your CRM after every enquiry? [show frustrated person at desk] Here's what happens when Zoho does it for you automatically... [30-second demo] → Grab the free automation audit — link in bio\"",
    zoho_tag: "utm_source: meta or tiktok | utm_medium: awareness | Audience type: broad interest, lookalike, or cold prospecting",
    fatigue: "HIGH — creative must be refreshed every 4–6 weeks. Monitor Meta Frequency score: if Frequency exceeds 3.0 on the same audience, creative fatigue is setting in and CTR will begin dropping.",
  },
  {
    id: "intent", label: "INTENT AUDIENCE", icon: "🔍", hex: "#34d399",
    subtitle: "They are actively searching right now — meet them at the moment of decision",
    platforms: ["Google Search", "YouTube Search", "Bing Ads", "Google Shopping"],
    utm_sources: ["google", "bing"],
    why_matters: "This audience typed something into a search bar. That single act is the most powerful buying signal that exists in digital marketing — they have a problem, they know they have it, and they are actively seeking a solution right now. You are not creating demand; you are capturing it at the exact moment it is expressed. The intent signal is explicit, real-time, and self-qualifying. There is no warmer traffic available through paid channels than someone who just searched for the exact thing you provide.",
    tactics: [
      { name: "KEYWORD ALIGNMENT is the entire game", detail: "Your ad headline must mirror the exact language they used to search. If they searched 'Zoho CRM setup help', your headline must say 'Zoho CRM Setup — Done For You'. If they searched 'workflow automation consultant', your headline must contain those words. Google's Quality Score and ad rank both depend on relevance between keyword, ad copy, and landing page. Poor alignment = higher CPC and lower position, regardless of your bid." },
      { name: "ANSWER FIRST — no hooks needed", detail: "Unlike interruption audiences, intent audiences want to know immediately whether your result is the right answer to their search. Lead with your offer and outcome, not a curiosity-gap hook. 'Zoho Workflow Automation — Implemented and Running in 30 Days' is correct for search. 'Are you wasting time on admin?' is wrong — they already know the answer or they wouldn't have searched." },
      { name: "TRUST SIGNALS in the ad copy itself", detail: "Include concrete social proof, credentials, or specificity directly in your headlines and descriptions — before they even click. 'Zoho Certified Partner — 50+ SMB Implementations' or 'Rated 4.9 Stars — Book Free Assessment Today' builds instant credibility in the 2-second window before they decide to click or scroll past. Numbers and certifications outperform vague claims every time." },
      { name: "MATCH TYPES control your intent precision", detail: "Exact match [zoho crm automation] = highest intent, lowest volume, most expensive CPC. Phrase match 'zoho workflow help' = moderate precision. Broad match with smart bidding = lets the algorithm detect intent signals you haven't explicitly listed. Start with exact and phrase match only. Add broad match with Target CPA bidding only after accumulating 30+ conversions of historical data." },
      { name: "LANDING PAGE must continue the exact conversation", detail: "The page they land on after clicking must reflect precisely what your ad promised — not your general homepage or a generic services page. If your ad says 'Free Workflow Audit', your landing page headline must say 'Get Your Free Workflow Audit' in the first 5 words visible above the fold. Any mismatch between ad promise and landing page causes an immediate bounce — it feels like a bait-and-switch even when it isn't intentional." },
      { name: "NEGATIVE KEYWORDS protect every dollar", detail: "Exclude irrelevant searches aggressively and continuously. Add negatives for: 'free' (if you're not free), 'DIY' and 'tutorial' (self-service intent), 'jobs' and 'careers' (job seekers), competitor brand names (unless running competitor campaigns), and geographic exclusions if you don't serve certain areas. Every wasted click to an unqualified searcher is budget that didn't reach a qualified buyer. Review your Search Terms Report weekly." },
    ],
    creative_formula: "Keyword-Matched Headline → Specific Outcome Benefit → Trust Signal or Proof Point → Direct CTA with clear next step",
    copy_example: "Headline: 'Zoho Workflow Automation — Built & Running in 30 Days' | Description: 'Zoho Certified Partner. 50+ SMB clients automated. Free strategy assessment. No hourly billing — fixed-price systems.' | CTA: 'Book Free Assessment'",
    zoho_tag: "utm_source: google | utm_medium: consideration or solution | Audience: keyword-targeted plus RLSA bid adjustments for warm past visitors",
    fatigue: "LOW — search ads don't fatigue the same way social ads do because the search query refreshes context with every impression. Monitor CTR decline over 90-day periods as a signal to refresh headlines.",
  },
  {
    id: "community", label: "COMMUNITY AUDIENCE", icon: "🤝", hex: "#f59e0b",
    subtitle: "They follow you or were referred — pre-existing trust already exists",
    platforms: ["LinkedIn Organic", "Instagram Organic", "Facebook Groups", "Referral Networks"],
    utm_sources: ["organic_ig", "organic_tt", "linkedin"],
    why_matters: "This audience already chose to follow you, was referred by someone they trust, or encounters you through a community they belong to. Pre-existing relationship compresses the trust-building timeline dramatically — they already believe you have something worth listening to before you've said a word. The cost to reach them is your time, not your ad budget, and the relationship compounds over time in a way that paid reach cannot. This is also the only channel that generates referrals naturally as a byproduct of good content.",
    tactics: [
      { name: "AUTHORITY CONTENT — teach, don't sell", detail: "This audience responds to deep expertise demonstrated through genuinely valuable content. Detailed case studies, original frameworks, step-by-step breakdowns, behind-the-scenes systems, and counter-intuitive insights build authority. The formula that works: give away enough to be genuinely useful on its own, and the sale becomes a natural next step for those who want you to do it for them rather than figuring it out themselves." },
      { name: "PERSONAL BRAND over corporate voice — always", detail: "Community audiences follow people, not companies. A founder or face-of-brand generates more engagement and trust than a faceless company name. First-person storytelling, stated opinions, documented failures and lessons learned, and real-time behind-the-scenes content consistently outperform feature-benefit company marketing in organic community contexts. Be a person, not a logo." },
      { name: "CONSISTENCY beats intensity — every time", detail: "Posting 3 times per week for 6 consecutive months outperforms posting 30 times in one week followed by two months of silence. Platform algorithms reward consistent posting behaviour with compounding organic reach. Community trust is built through repeated touchpoints over extended time — not volume bursts. Build a content calendar you can actually maintain sustainably, then treat it as a non-negotiable commitment." },
      { name: "ENGAGEMENT is the actual product", detail: "On community platforms, comments and conversations are more valuable than passive impressions or clicks. Replying to every comment within the first hour of posting sends a positive signal to the algorithm that amplifies distribution. Ask genuine questions that invite responses. The goal is relationship density — people who feel known and heard — not passive consumption. A hundred engaged followers outperform ten thousand passive ones." },
      { name: "SOFT CTA embedded in every piece of content", detail: "Every post should have a natural, low-friction next step — not a hard sales pitch. 'If this resonates and you want me to map this out for your specific business, comment the word AUDIT below and I'll send you the details' is a soft CTA that converts curious followers into warm leads without feeling like a sales push. The ask is small, the commitment is low, and the intent signal is explicit when they respond." },
      { name: "REPURPOSE everything — one idea, many formats", detail: "One detailed LinkedIn case study post → 5 Instagram carousel slides → 3 standalone Twitter/X insights → 1 short-form video script → 1 email newsletter section → 1 blog post. The thinking and research happens once. The distribution multiplies across every platform your audience uses. Build a repurposing workflow into your content system from the beginning — it reduces content creation time by 60% while increasing reach exponentially." },
    ],
    creative_formula: "Insight or Story Hook → Teach the Framework or System → Show the Specific Result → Soft CTA (comment, DM, or link)",
    copy_example: "\"I mapped out exactly how we cut a client's admin time by 60% using just 3 Zoho automations. Here's the complete system [5-slide carousel with specific workflow steps]. If you want me to map something similar for your business, comment 'AUDIT' below and I'll reach out.\"",
    zoho_tag: "utm_source: organic_ig or linkedin | utm_medium: awareness or consideration | Track all organic post links via UTM parameters in bio link or post link fields",
    fatigue: "N/A for organic — no frequency cap exists. Monitor engagement rate decline (likes + comments ÷ reach) as the signal to refresh your content angles and topics. If ER drops below 2%, try a new content format or topic pillar.",
  },
  {
    id: "owned", label: "OWNED AUDIENCE", icon: "📧", hex: "#a78bfa",
    subtitle: "They opted in — your highest-trust non-customer segment and your most durable asset",
    platforms: ["Email (Zoho Campaigns)", "SMS (Zoho)", "WhatsApp (Zoho)", "Push Notifications"],
    utm_sources: ["email", "sms", "whatsapp"],
    why_matters: "This is the single most valuable audience you will ever build — and the majority of businesses dramatically underutilise it. These people voluntarily gave you their contact details and said 'yes, I want to hear from you.' That is an explicit consent signal that no paid advertising audience can replicate. You own this relationship outright. Meta, Google, and TikTok cannot take it away through algorithm changes, account bans, or CPM increases. Every platform disruption becomes irrelevant when your owned list is large and engaged. Build it from day one. Guard it carefully. Nurture it relentlessly.",
    tactics: [
      { name: "DIRECT and PERSONAL tone — write to one person", detail: "Write every email as though you're composing a personal message to a single individual, not broadcasting to a list. 'Hi [First Name]' is table stakes — but the entire body of the email should feel like a private note, not a marketing newsletter. Avoid HTML templates with images and headers for conversion-focused emails. Plain text emails written in a personal voice from a named person consistently outperform designed HTML marketing emails on click-through and reply rates in B2B contexts." },
      { name: "SEQUENCE BEFORE PITCH — earn the right to sell", detail: "A brand new opt-in must receive demonstrated value before they receive an offer. The AWR Welcome Series should deliver 3–5 genuinely useful emails — a practical framework, a detailed case study, a tool recommendation with explanation, a counter-intuitive insight — before any direct commercial pitch appears. Each value email builds a credit in the trust account. The sales pitch is a withdrawal. If you overdraw too early, they unsubscribe and you've lost them permanently." },
      { name: "SEGMENTATION multiplies relevance and results", detail: "In Zoho MA, use UTM source tags and lead score thresholds to segment your list before sending. An email about Meta advertising automation should go to contacts tagged Paid_Social_Meta — not your entire database. A retail client case study should go to contacts tagged with retail industry markers. Segmented emails achieve 3–5x higher click-through rates than broadcast emails sent to unsegmented lists. Relevance is the single most powerful variable in email performance." },
      { name: "REPLY-BAIT builds two-way relationship and improves deliverability", detail: "Ask your list genuine questions that invite real replies. 'What's the one workflow in your business that consumes the most manual time each week? Hit reply and tell me — I read every single response.' Replies dramatically improve email deliverability — Gmail and Outlook treat reply activity as evidence of a genuine two-way conversation, which improves inbox placement over time. Replies also give you direct, unfiltered market research from your most engaged prospects." },
      { name: "FREQUENCY and TIMING matter more than most people realise", detail: "For a B2B automation service selling to SMB owners, 1–2 emails per week is the sustainable sweet spot. Daily emails are almost always too many. Monthly emails result in list members forgetting who you are between sends. For WhatsApp and SMS, 2–4 messages per month is the maximum before opt-outs accelerate. Over-messaging is the fastest way to destroy a hard-earned relationship. Track your unsubscribe rate per email — if it consistently exceeds 0.5%, you are either sending too frequently or the content quality isn't justifying the frequency." },
      { name: "RE-ENGAGEMENT campaigns recover your silent contacts", detail: "In Zoho MA, build a workflow that automatically triggers when a contact hasn't opened any email in 60+ days. Deploy a 3-email re-engagement sequence: Email 1 — 'Have we lost you? Honest question.' Email 2 — Your single best-performing piece of content ever sent. Email 3 — 'This is our last email to you unless you click here to stay on the list.' Remove all non-responders after Email 3. A clean, actively engaged list of 500 contacts outperforms a bloated, disengaged list of 5,000 in every measurable metric — deliverability, click rate, and eventual revenue." },
    ],
    creative_formula: "Personal subject line → Single-focus body copy → One CTA only → P.S. line with human touch, secondary hook, or conversation starter",
    copy_example: "Subject: 'The workflow that saved our client 10 hours every week' → Story-led email walking through the specific automation that was built → Single CTA: 'If you want to see whether this works for your business, book a 20-minute call here' → P.S. 'Reply and tell me what your biggest manual time-waster is right now — genuinely curious.'",
    zoho_tag: "utm_source: email, sms, or whatsapp | utm_medium: consideration, solution, or retention | Segment sends by: Lead_Score threshold, Campaign_Source tag, Industry_Tag, or funnel stage",
    fatigue: "Monitor: Open rate (target >30%), Click rate (target >3%), Unsubscribe rate (keep <0.5% per send). If open rate declines over 30 days, test subject line formats first before changing content. If unsubscribe rate climbs, reduce sending frequency before changing content.",
  },
];

// ── FUNNEL CATEGORIES ───────────────────────────────────────────────────────

const FUNNEL_CATEGORIES = [
  { id: "lead-gen",      label: "LEAD GENERATION",     icon: "🎯", hex: "#f59e0b", desc: "Build your list — capture contact details in exchange for value. The entry point of every funnel." },
  { id: "direct-sales",  label: "DIRECT SALES",         icon: "💳", hex: "#34d399", desc: "Convert traffic directly to revenue. Designed for offers where purchase can happen without a call." },
  { id: "trust-building",label: "TRUST-BUILDING",       icon: "🏗️", hex: "#38bdf8", desc: "Warm cold or lukewarm audiences through genuine education, challenges, and nurture before pitching." },
  { id: "high-ticket",   label: "HIGH-TICKET / CALL",   icon: "📞", hex: "#a78bfa", desc: "Qualify prospects for offers $2K+ that require a conversation before purchase. Call is the conversion mechanism." },
  { id: "retention",     label: "RETENTION & ASCENSION",icon: "🔄", hex: "#f472b6", desc: "Maximise revenue from existing buyers through upsells, continuity, cross-sells, and re-engagement." },
  { id: "relationship",  label: "RELATIONSHIP / NETWORK",icon: "🤝", hex: "#fb923c", desc: "Build systematic referral and affiliate pipelines that generate warm leads without ad spend." },
];

// ── FUNNEL TYPES ────────────────────────────────────────────────────────────

const FUNNELS = [
  {
    id: "surfboard",
    name: "SURFBOARD FUNNEL",
    subtitle: "3-Page Lead → Sale → Profit System",
    icon: "🏄",
    hex: "#38bdf8",
    origin: "Mike Killen methodology — the core system this business is built on",
    best_for: "Any market temperature. The default starting point before testing anything else.",
    complexity: "LOW",
    time_to_build: "1–2 weeks",
    min_budget: "Zero (organic) to any paid budget",
    stages: [
      { label: "TRAFFIC", desc: "Organic posts, paid ads, or search", color: "#94a3b8", icon: "📡" },
      { label: "PAGE 1: OPT-IN", desc: "Lead magnet offer. Name + Email captured. Generates LEADS.", color: "#38bdf8", icon: "📥", cr: "20–40% of visitors opt in", zoho: "Zoho Form → MA contact created → AWR_Welcome_Series triggered" },
      { label: "PAGE 2: OFFER", desc: "VSL or free training. Book a call OR low-ticket purchase. Generates SALES.", color: "#f59e0b", icon: "🎬", cr: "5% book a call / 1–2% buy", zoho: "Lead_Score +50 → SOL_Conversion_Push triggered → Sales team notified" },
      { label: "PAGE 3: UPSELL", desc: "One-click higher offer immediately post-purchase. Generates PROFIT.", color: "#34d399", icon: "📈", cr: "10–20% of buyers take upsell", zoho: "RET_Upsell_Series_1.0 triggered → Deal value updated in CRM" },
    ],
    critical_rule: "NEVER leave someone on the opt-in page after submitting. ALWAYS redirect immediately to the offer page. The opt-in page's only job is to capture the contact — the offer page is where revenue begins.",
    bayside_implementation: "This is your primary funnel. Page 1 offers your lead magnet (e.g. a free audit, checklist, or template). Page 2 VSL presents your core service or product. Page 3 upsells to a recurring retainer or higher-tier package.",
    category: "direct-sales",
    product_fit: ["mid_ticket","digital","community"],
    fits: ["cold-reach", "warm-conversion", "hot-value"],
    campaign_codes: ["AWR-1.0A", "SOL-1.0A", "RET-1.0A"],
    when_to_use: "Use this as your default. Validate every new offer here before building more complex funnels.",
    when_not_to_use: "Not ideal as your sole strategy for high-ticket ($10K+) services where a call is mandatory before purchase.",
  },
  {
    id: "application",
    name: "APPLICATION FUNNEL",
    subtitle: "High-Ticket Qualify-First System",
    icon: "📋",
    hex: "#a78bfa",
    origin: "Standard high-ticket service sales methodology — used by coaches, consultants, and premium service providers globally",
    best_for: "Hot markets and warm audiences already familiar with your work. Selling services $3K and above.",
    complexity: "LOW-MEDIUM",
    time_to_build: "1 week",
    min_budget: "Zero (referrals/organic) — paid works once you have proof",
    stages: [
      { label: "TRAFFIC", desc: "Warm retargeting, referrals, organic posts", color: "#94a3b8", icon: "📡" },
      { label: "LANDING PAGE", desc: "Short VSL explaining who you work with and the outcome. No price shown.", color: "#a78bfa", icon: "🎬", cr: "30–50% of warm visitors click Apply", zoho: "UTM captured → MA contact tagged SOL_Application_Started" },
      { label: "APPLICATION FORM", desc: "Qualify the prospect. Ask about business size, current challenges, budget range, urgency.", color: "#f59e0b", icon: "📝", cr: "50–70% complete the form", zoho: "Form submitted → Lead_Score +50 → Sales rep notified → Application review tag applied" },
      { label: "STRATEGY CALL", desc: "30–45 min discovery call. Diagnose, prescribe, close. No feature dumping.", color: "#34d399", icon: "📞", cr: "20–40% close on first call", zoho: "Call booked in Zoho Bookings → CRM deal created → SOL stage = Discovery Call Booked" },
      { label: "CLOSE + ONBOARD", desc: "Invoice sent, deposit collected, onboarding begins.", color: "#f472b6", icon: "🎯", cr: "20–40% of calls close to paid", zoho: "Deal stage = Won → RET_Welcome_Client sequence triggered → Project created" },
    ],
    critical_rule: "NEVER show your price on the landing page. The application's job is to qualify intent and budget — price only enters the conversation on the call, after you've established value. Revealing price too early filters out budget-qualified prospects who needed to hear your value first.",
    bayside_implementation: "Use for your premium service or high-ticket offer ($5K+). Landing page headline: 'We Build Your Entire System in 30 Days — Application Required'. Application asks: team size, current setup, biggest pain point, hours wasted on manual processes, budget range.",
    category: "high-ticket",
    product_fit: ["high_ticket","mid_ticket"],
    fits: ["hot-value", "warm-conversion"],
    campaign_codes: ["SOL-1.0A", "RET-1.0A"],
    when_to_use: "Once you have 10+ testimonials and are selling implementations above $3K. Also ideal for upselling existing clients to enterprise packages.",
    when_not_to_use: "Do not use for cold traffic — they don't know you well enough to invest time in an application. Cold audiences need the Surfboard Funnel first.",
  },
  {
    id: "webinar",
    name: "WEBINAR FUNNEL",
    subtitle: "Education-First Trust Compression System",
    icon: "🎙️",
    hex: "#f59e0b",
    origin: "Pioneered by Brendan Burchard and Russell Brunson — the dominant B2B conversion mechanism for complex, higher-priced services",
    best_for: "Warm audiences who need more education before they'll commit. Services that require understanding before buying.",
    complexity: "HIGH",
    time_to_build: "3–4 weeks (script, slides, tech setup, email sequences)",
    min_budget: "$500/mo minimum to drive consistent registrations via paid",
    stages: [
      { label: "TRAFFIC", desc: "Paid ads or organic promoting the webinar event", color: "#94a3b8", icon: "📡" },
      { label: "REGISTRATION PAGE", desc: "Single opt-in for the free training. Headline promises a specific outcome.", color: "#f59e0b", icon: "📥", cr: "25–40% of clicks register", zoho: "Registration → MA contact → CON_Webinar_Series email reminders triggered" },
      { label: "EMAIL REMINDERS", desc: "3–4 emails building anticipation. Day before, morning of, 1hr before.", color: "#38bdf8", icon: "📧", cr: "30–40% of registrants attend live", zoho: "Automated Zoho Campaigns sequence with countdown timers and personalisation" },
      { label: "LIVE / AUTO WEBINAR", desc: "60–90 min. Teach 3 big ideas → reveal the gap → present your offer. Q&A closes objections.", color: "#34d399", icon: "📺", cr: "5–15% of attendees buy or book", zoho: "Attendance tagged in MA → Pitch CTA → SOL_Post_Webinar_Sequence triggered" },
      { label: "POST-WEBINAR SEQUENCE", desc: "Replay email → fast-action bonus → last chance. 5–7 emails over 5 days.", color: "#a78bfa", icon: "📨", cr: "2–5% of total registrants convert", zoho: "Non-buyers → CON nurture | Buyers → RET_Upsell triggered" },
    ],
    critical_rule: "The webinar must deliver GENUINE value — not be a 60-minute pitch disguised as training. The ratio is 75% teaching, 25% offer. If attendees feel tricked, trust is destroyed permanently. Your teach content should be so good that people would pay for the slides alone.",
    bayside_implementation: "Webinar title: 'The 3 Automations Every Business Should Have Running This Week'. Teaches 3 high-impact workflows (lead follow-up, invoice sending, report generation). Pitch: 'We'll build all 3 — plus your entire custom system — in 30 days.' Runs monthly. Drives both immediate sales and long-tail email nurture.",
    category: "trust-building",
    product_fit: ["high_ticket","mid_ticket","digital","community"],
    fits: ["warm-conversion"],
    campaign_codes: ["CON-1.0A", "SOL-1.0A"],
    when_to_use: "When you have a warm list of 500+ contacts but conversion rate is below 3%. Webinars compress 6 weeks of email nurture into 90 minutes.",
    when_not_to_use: "Not for cold audiences with zero brand awareness — attendance rates collapse. Not for simple, low-price offers where a webinar is overkill.",
  },
  {
    id: "challenge",
    name: "CHALLENGE FUNNEL",
    subtitle: "5-Day Engagement & Warm-Up System",
    icon: "🔥",
    hex: "#f472b6",
    origin: "Popularised by Tony Robbins, Dean Graziosi, and Russell Brunson — now standard for rapidly building warm audiences from cold traffic",
    best_for: "Cold-to-warm conversion. Building community and engagement before a pitch. Works exceptionally well on Meta and TikTok.",
    complexity: "MEDIUM-HIGH",
    time_to_build: "2–3 weeks (content creation is the main investment)",
    min_budget: "$1K+ to drive sufficient cold registrations for the numbers to work",
    stages: [
      { label: "TRAFFIC", desc: "Cold paid ads promoting a free 5-day challenge", color: "#94a3b8", icon: "📡" },
      { label: "CHALLENGE REGISTRATION", desc: "Free sign-up for the 5-day live challenge. No payment. Community element.", color: "#f472b6", icon: "📥", cr: "20–35% of ad clicks register", zoho: "Registration → MA → AWR_Challenge_Series email sequence starts | Facebook Group or Zoho Backstage community" },
      { label: "DAY 1–4: DAILY CONTENT", desc: "Short daily training (15–20 min video or live). Each day builds on the last. Homework tasks create investment.", color: "#38bdf8", icon: "📅", cr: "40–60% complete all 5 days", zoho: "Daily email reminders → attendance tracking → Lead_Score +5 per day completed" },
      { label: "DAY 5: THE PITCH", desc: "Final training delivers the biggest transformation. Closes with a time-limited offer. Stakes are highest — attendees are most invested.", color: "#34d399", icon: "🎯", cr: "5–15% of Day 5 attendees purchase or book", zoho: "Pitch CTA → SOL_Conversion_Push | Non-buyers → CON_Post_Challenge_Nurture" },
      { label: "REPLAY + FOLLOW-UP", desc: "4–5 day email sequence. Replay access, testimonials, last-chance offer.", color: "#a78bfa", icon: "📨", cr: "2–5% of total registrants convert from follow-up", zoho: "RET sequence for buyers | Extended CON nurture for non-buyers" },
    ],
    critical_rule: "The daily content must be genuinely transformational — not drip-fed teasers. People who complete your challenge and get real results are far more likely to buy. Treat each daily training like a mini product. The pitch works because they've already experienced your methodology and seen it works.",
    bayside_implementation: "Challenge: '5-Day Automation Sprint'. Day 1: Map your top 3 manual workflows. Day 2: Build your first Zoho automation (lead follow-up). Day 3: Add your CRM pipeline stages. Day 4: Connect your forms to automation. Day 5: Reveal the full system architecture → pitch your done-for-you service.",
    category: "trust-building",
    product_fit: ["digital","community","mid_ticket"],
    fits: ["cold-reach"],
    campaign_codes: ["AWR-1.0A", "CON-1.0A"],
    when_to_use: "When you want to rapidly warm a cold audience at scale. Particularly effective when launching into a new market segment or geography.",
    when_not_to_use: "Resource-intensive — don't run a challenge until you can sustain daily content delivery for 5 consecutive days. Not suitable for zero-budget situations.",
  },
  {
    id: "tripwire",
    name: "TRIPWIRE FUNNEL",
    subtitle: "Self-Liquidating Paid Ads System",
    icon: "💡",
    hex: "#34d399",
    origin: "Coined by Perry Belcher — the mechanism that allows paid advertising to become cost-neutral or profitable before the main offer is purchased",
    best_for: "Converting warm leads who are interested but not yet ready for a high-ticket commitment. Building a buyer list. Funding paid ads from the tripwire revenue.",
    complexity: "MEDIUM",
    time_to_build: "1–2 weeks",
    min_budget: "$500/mo to meaningfully test and optimise the front-end offer",
    stages: [
      { label: "TRAFFIC", desc: "Paid ads or warm audience retargeting", color: "#94a3b8", icon: "📡" },
      { label: "OPT-IN PAGE", desc: "Free lead magnet opt-in. Same as Surfboard Page 1.", color: "#38bdf8", icon: "📥", cr: "20–40% opt-in rate", zoho: "Contact created → AWR_Welcome_Series_1.0 + immediate redirect to tripwire offer" },
      { label: "TRIPWIRE OFFER", desc: "Low-cost, high-value product ($7–$97). Immediately after opt-in. Converts a lead into a buyer.", color: "#34d399", icon: "💰", cr: "3–8% of opt-ins buy the tripwire", zoho: "Purchase → Lead_Score +30 | Tag: Tripwire_Buyer | Trigger: SOL_Buyer_Sequence" },
      { label: "ORDER BUMP", desc: "One checkbox upsell on the checkout page. Complementary product or template pack.", color: "#f59e0b", icon: "☑️", cr: "20–30% of buyers add the bump", zoho: "Order bump purchase → update deal value → RET_Upsell triggered" },
      { label: "UPSELL / CORE OFFER", desc: "Main service or implementation offer presented immediately after purchase. This is where real revenue lives.", color: "#a78bfa", icon: "🎯", cr: "10–20% of buyers upgrade to core offer", zoho: "Upsell accepted → CRM deal created → SOL_Conversion_Push + Sales team notification" },
      { label: "EMAIL FOLLOW-UP", desc: "For non-upgraders: SOL nurture sequence presenting the core offer over 7–14 days.", color: "#f472b6", icon: "📧", cr: "3–7% of non-upgraders convert over 30 days", zoho: "Non-buyers → CON_Nurturing_Sequence | Buyers → RET_Upsell_Series" },
    ],
    critical_rule: "The tripwire must be genuinely worth 10x what you charge for it — so good it would feel dishonest not to buy it. Its purpose is not to generate revenue (that's a bonus) — it's to convert a lead into a buyer. A buyer is psychologically different from a lead. They've already said yes with their wallet, which makes every future offer far easier to accept.",
    bayside_implementation: "Tripwire: A low-cost starter product — e.g. 5 pre-built templates + video walkthroughs for $27. Order bump: An advanced add-on bundle for $17. Core upsell: Your main service or implementation package from $2,497. The low-cost tripwire funds the ad spend; the core service is where the real business happens.",
    category: "direct-sales",
    product_fit: ["digital","ecommerce","mid_ticket","saas"],
    fits: ["warm-conversion", "hot-value"],
    campaign_codes: ["CON-1.0A", "SOL-1.0A", "RET-1.0A"],
    when_to_use: "When you want to make paid ads self-funding. When you want to productise part of your knowledge at a low price point to build a large buyer list. Ideal once you have a validated offer and need to scale volume.",
    when_not_to_use: "Do not use as your first funnel — validate your core offer with the Surfboard Funnel first. The tripwire requires a tested, compelling front-end product.",
  },
  {
    id: "nurture",
    name: "EMAIL NURTURE FUNNEL",
    subtitle: "Zero-Budget Trust-to-Revenue Sequence",
    icon: "📧",
    hex: "#94a3b8",
    origin: "The original digital marketing funnel — predates social media. Still the highest-ROI channel in B2B marketing when executed correctly.",
    best_for: "Warm audiences already on your list. Zero-budget situations. Long B2B sales cycles where trust must be built over time.",
    complexity: "LOW",
    time_to_build: "1 week (writing) + ongoing content creation",
    min_budget: "Zero — Zoho Campaigns included in Zoho One subscription",
    stages: [
      { label: "OPT-IN", desc: "Lead magnet or organic content drives someone to subscribe", color: "#94a3b8", icon: "📥", cr: "Varies by traffic source", zoho: "Contact created in MA → AWR_Welcome_Series_1.0 starts immediately" },
      { label: "WELCOME SEQUENCE", desc: "5–7 emails. Set expectations, deliver quick win, establish credibility. Sent over first 14 days.", color: "#38bdf8", icon: "👋", cr: "Open rate 40–60% on welcome series", zoho: "AWR_Welcome_Series_1.0 in Zoho Campaigns | Track opens + clicks for Lead_Score" },
      { label: "VALUE SEQUENCE", desc: "8–12 emails over 30–60 days. Case studies, frameworks, tools, insights. Each email earns the right to the next.", color: "#f59e0b", icon: "🎁", cr: "Open rate target: 30%+ | Click rate: 3%+", zoho: "CON_Nurturing_Sequence_1.0 | Lead_Score +5 per open, +10 per click" },
      { label: "SOFT PITCH", desc: "Natural transition: 'You've been learning X — here's how we do it for you'. Single CTA to book a call or see offer.", color: "#34d399", icon: "🤝", cr: "1–3% of sequence recipients book a call", zoho: "SOL_Conversion_Push triggered when Lead_Score > 50 | Sales rep notification" },
      { label: "ONGOING BROADCAST", desc: "Weekly or fortnightly emails to the full list. Mix of value and soft CTAs. Compounds over time.", color: "#a78bfa", icon: "📡", cr: "0.5–2% CTA click rate per broadcast", zoho: "Zoho Campaigns broadcast | Segment by engagement | Re-engagement workflow at 60-day silence" },
    ],
    critical_rule: "The ratio must be 4:1 — four value emails for every one pitch email. Violating this ratio trains your list to expect sales pitches and they begin ignoring you. Each value email must be genuinely useful on its own terms — not a thin wrapper around a pitch. Build the habit of giving before you take.",
    bayside_implementation: "Welcome Series (5 emails): Email 1 — deliver your lead magnet + introduce yourself. Email 2 — 'The 3 biggest time-wasting workflows in your industry'. Email 3 — Case study with specific numbers. Email 4 — Common mistakes and how to avoid them. Email 5 — Soft CTA: 'If you'd like us to map this for your business, here's how we work.' Then monthly broadcast with one value tip + one client story.",
    category: "trust-building",
    product_fit: ["high_ticket","mid_ticket","digital","saas","local","community"],
    fits: ["cold-reach", "warm-conversion"],
    campaign_codes: ["AWR-1.0A", "CON-1.0A", "SOL-1.0A"],
    when_to_use: "Always — this should be running in the background regardless of which other funnel you're using. Every opt-in enters a nurture sequence. This is the floor, not the ceiling.",
    when_not_to_use: "Cannot replace a direct offer mechanism. The nurture funnel warms leads — but it still needs a Surfboard, Application, or Webinar funnel to convert them. Do not treat email-only as a complete system.",
    sequence_detail: {
      welcome: [
        { email: 1, subject_style: "Your [lead magnet] is here", purpose: "Deliver lead magnet. Introduce yourself briefly — one sentence. Set expectations for what's coming.", note: "Don't pitch anything. Just deliver and connect." },
        { email: 2, subject_style: "the thing I see breaking most [type of business]", purpose: "Name the #1 problem your audience has. Story-driven. No solution yet — just agitate the problem.", note: "Open rate target: 45%+ on email 2. If lower, email 1 set wrong expectations." },
        { email: 3, subject_style: "how [client] fixed this", purpose: "A real case study. Specific numbers. Before/after. Make the transformation tangible.", note: "Social proof built passively — not a testimonial wall, a story." },
        { email: 4, subject_style: "the mistake that costs [time/money]", purpose: "Common mistake your audience makes. Educational and useful on its own.", note: "4:1 ratio — still in value phase. Do not pitch." },
        { email: 5, subject_style: "if you want help with this...", purpose: "Soft CTA. 'If you'd like us to handle this for you, here's how we work.' Link to calendar or sales page.", note: "This is the first time you mention your offer. It should feel natural, not abrupt." },
      ],
      value_sequence: [
        { email: "6–8", purpose: "Framework or toolkit emails. Give them one practical thing they can implement immediately.", note: "Each email earns the right to the next. Never reference the sequence itself." },
        { email: "9–10", purpose: "Authority and credibility emails. Awards, media, partnerships, or deeper case studies.", note: "Builds trust passively without it feeling like bragging." },
        { email: "11–12", purpose: "Objection-handling emails. Address the top 2–3 reasons people don't buy before you pitch again.", note: "Answer 'Is this for me?', 'Does this actually work?', 'Is now the right time?'" },
      ],
      conversion: [
        { email: "13–15", purpose: "Conversion sequence. 3 emails over 5 days with a clear offer and soft deadline or bonus.", note: "Email 1: The opportunity. Email 2: The transformation story. Email 3: Last chance / remove the obstacle." },
      ],
    },
  },
  {
    id: "vsl_prequalification",
    name: "VSL PRE-QUALIFICATION FUNNEL",
    subtitle: "Watch Before You Book — Appointment Funnel for High-Ticket Offers",
    icon: "🎥",
    hex: "#f59e0b",
    origin: "High-ticket coaching and consulting methodology — popularised by online course creators and consultants selling $3,000–$25,000 programs. The VSL does the selling; the call does the closing.",
    best_for: "High-ticket services ($2,000+) where a sales call is required, but you want only pre-sold, pre-qualified prospects on your calendar. Not for lower-priced offers where the friction exceeds the benefit.",
    complexity: "MEDIUM",
    time_to_build: "2–3 weeks (VSL script + recording + application form + show-up sequence)",
    min_budget: "Zero (organic warm traffic) — $500+/mo recommended for cold paid traffic",
    stages: [
      { label: "TRAFFIC", desc: "Warm organic content, referrals, or paid ads driving to landing page. Cold traffic needs warming first — don't send cold paid traffic directly to a high-ticket VSL.", color: "#94a3b8", icon: "📡" },
      { label: "LANDING PAGE / OPT-IN", desc: "Minimal page. Headline states the transformation and who it's for. Optional: collect name + email before VSL access (increases commitment). Some funnels go directly to the VSL page.", color: "#f59e0b", icon: "📥", cr: "40–60% of warm clicks opt in / visit VSL page", zoho: "MA contact created → AWR tag → VSL_Watch_Sequence triggered (follow-up for non-bookers)" },
      { label: "VSL PAGE (VIDEO SALES LETTER)", desc: "The pre-sell engine. 15–45 min video. Tells your story, explains the problem and outcome, presents your program/service, introduces the application process. The VSL's job: have them sold before the call so the call is qualification + confirmation, not education.", color: "#f59e0b", icon: "🎬", cr: "20–35% of VSL viewers click Apply", zoho: "VSL view tracked via UTM + page event → Lead_Score +30 on page load | +50 if they click Apply" },
      { label: "APPLICATION FORM", desc: "Self-qualification gate. Asks: current situation, specific pain, desired outcome, budget range, urgency, what's held them back. 6–10 questions max. A setter (or you) reviews each application before confirming the call.", color: "#a78bfa", icon: "📝", cr: "60–75% of form-starters complete it", zoho: "Application submitted → CRM lead created → Application_Review tag → Setter notified | Disqualified → polite email, offer lower-tier option" },
      { label: "CALL BOOKING PAGE", desc: "Only shown after application is approved (or auto-approved for automated funnels). Calendly or Zoho Bookings. Show a short 'what to expect on the call' video (1–2 min) to reduce no-shows.", color: "#34d399", icon: "📅", cr: "70–85% of approved applicants book a call", zoho: "Booking confirmed → CRM deal stage = Discovery Call Booked → Show-Up Sequence triggered" },
      { label: "SHOW-UP SEQUENCE (PRE-CALL NURTURE)", desc: "3–5 messages between booking and the call. SMS + email. Reduces no-show rate from 50% to 20–30%. Includes: confirmation email, reminder SMS 24hrs before, reminder email morning of, 1-hr SMS reminder. Optional: 'homework' email asking them to prepare 3 answers about their business.", color: "#38bdf8", icon: "📧", cr: "Show-up rate target: 65–80%", zoho: "Automated Zoho Campaigns + Zoho CRM SMS | Sequence name: SOL_Show_Up_Sequence_1.0" },
      { label: "DISCOVERY / SALES CALL", desc: "30–60 min. Structure: Rapport (2 min) → Agenda set (1 min) → Discovery SPIN questions (15–20 min) → Diagnose + reflect (5 min) → Prescribe your solution directly tied to their answers (5–10 min) → Objection handling (5 min) → Close or next step. Goal: they close themselves because your discovery made them articulate their own problem clearly.", color: "#f472b6", icon: "📞", cr: "20–40% close rate on well-qualified calls", zoho: "Call outcome logged in CRM → Won: RET_Welcome_Client | Lost: Long-term nurture tag | Needs time: SOL_Follow_Up_Sequence_1.0" },
      { label: "POST-CALL FOLLOW-UP SEQUENCE", desc: "If they didn't close on the call: 3–5 email/SMS follow-up sequence. Email 1 (same day): summary of what was discussed + next step. Email 2 (Day 3): case study directly relevant to their specific pain. Email 3 (Day 7): address the most common objection you heard. Email 4 (Day 14): 'still relevant?' check-in. Email 5 (Day 30): requalify or move to long-term nurture.", color: "#94a3b8", icon: "🔄", cr: "10–20% of 'not yet' calls close within 30 days via follow-up", zoho: "SOL_Follow_Up_Sequence_1.0 in Zoho Campaigns | Lead_Score decay if no engagement → Long_Term_Nurture tag at Day 45" },
    ],
    critical_rule: "The VSL MUST do the selling before the call. If you skip the VSL or use a weak one, your call becomes an education session — which is why most high-ticket salespeople feel exhausted and close poorly. The call's only jobs are: (1) confirm they're the right fit, (2) confirm they understood the offer, (3) handle the final objection, and (4) collect payment. Never skip the show-up sequence — industry data shows calls without pre-call nurture have a no-show rate of 40–60%.",
    category: "high-ticket",
    product_fit: ["high_ticket"],
    when_to_use: "When your offer is $2,000+ and a call is required before purchase. When you're generating enough warm leads to fill a calendar. When your existing Application Funnel is working but you want to increase show rate and call quality.",
    when_not_to_use: "Do not use for cold traffic unless you have a warm-up funnel preceding it. Do not use for offers under $2,000 — the friction of a 30-min VSL + application + booked call is disproportionate to the purchase decision at lower price points. A Surfboard or Webinar funnel converts better for mid-ticket.",
    vsl_structure: {
      title: "VSL SCRIPT STRUCTURE (15–45 minutes)",
      sections: [
        { time: "0–2 min", label: "PATTERN INTERRUPT HOOK", content: "Open with a provocative question, a bold claim, or a story that immediately identifies the viewer's problem. 'If you're a [type of person] struggling with [specific problem], watch this entire video because what I'm about to share will [transformation].'" },
        { time: "2–5 min", label: "CREDIBILITY STORY", content: "Your origin story — who you were before you had this solution, what the turning point was, and the specific moment things changed. Not a credentials dump — a transformation story the viewer can see themselves in." },
        { time: "5–15 min", label: "PROBLEM EDUCATION", content: "Break down why the problem exists. The 3 myths or mistakes that keep people stuck. Each myth they agree with increases their belief that you understand their world deeply. This section builds the gap between where they are and where they want to be." },
        { time: "15–25 min", label: "SOLUTION REVEAL", content: "Introduce your framework, system, or service. Name it. Show the components. Walk through the transformation it delivers using client stories. Do not list features — describe outcomes and the path to them." },
        { time: "25–35 min", label: "SOCIAL PROOF STACK", content: "3–5 specific client results. Include context (who they were before), the transformation (what changed), and the outcome (measurable result). Testimonial video clips if available — they massively outperform text." },
        { time: "35–40 min", label: "OFFER REVEAL", content: "Present what's included. Frame each component around the outcome it delivers, not the feature itself. State the investment (or indicate it's discussed on the call for highest-ticket offers)." },
        { time: "40–45 min", label: "APPLICATION CTA", content: "Explain the application process. What happens after they apply. What the call looks like. What they'll leave with. Make the next step feel low-risk and high-value. 'You're not committing to anything — we're just seeing if this is a fit.'" },
      ],
    },
    fits: ["hot-value", "warm-conversion"],
    campaign_codes: ["SOL-1.0A", "CON-1.0A"],
    bayside_implementation: "Use for your flagship service or product. VSL script: 'If you're a business owner drowning in manual processes — watch this video. I'm going to show you exactly how we transform your systems into an operation that runs itself.' Present 3 client results → reveal your full service → application CTA.",
  },
  {
    id: "referral_partnership",
    name: "REFERRAL PARTNERSHIP FUNNEL",
    subtitle: "Strategic Alliance and Warm Referral Acquisition System",
    icon: "🤝",
    hex: "#34d399",
    origin: "B2B growth methodology — referral partnerships generate the highest-quality leads in professional services. Research confirms 82% of B2B sales leaders rank referrals as their best lead source. Unlike client referrals, partner referrals create a systematic, repeatable flow rather than occasional introductions.",
    best_for: "Service businesses, SaaS, and consultants targeting SMBs. Most effective once you have at least 3–5 completed client cases to reference. Zero budget required — this is a relationship acquisition strategy, not a paid channel.",
    complexity: "MEDIUM",
    time_to_build: "Ongoing — first partnership typically closes within 2–4 weeks of starting outreach. First referral lead arrives within 30–90 days.",
    min_budget: "Zero — relationship-based. Budget accelerates nothing here except your own time.",
    stages: [
      { label: "PARTNER IDENTIFICATION", desc: "Research and build a list of 20–50 potential referral partners. The right partner: (1) serves your exact target client but isn't a competitor, (2) their clients frequently have the problem you solve, (3) they have an existing trusted relationship with their clients. Ideal partners for a marketing automation business: business coaches, accountants, web developers, digital marketing agencies, CRM consultants from other platforms.", color: "#34d399", icon: "🔍", cr: "N/A — research phase", zoho: "Create a Referral_Partner pipeline in Zoho CRM | Custom stage: Identified → Contacted → Conversation → Agreement → Active | Tag all contacts as Partner_Prospect" },
      { label: "INITIAL OUTREACH", desc: "First contact via email or LinkedIn DM. The goal is NOT to pitch your referral program — it's to start a genuine conversation. Reference something specific about their work. Ask a question that positions you as curious about them, not selling to them. Outreach template: Observe something genuine about their work → acknowledge their expertise → identify the client overlap → suggest a brief conversation to explore whether there's potential for both parties. Keep it to 3–4 sentences.", color: "#38bdf8", icon: "✉️", cr: "20–35% reply rate from warm, relevant outreach", zoho: "Outreach logged in CRM | Follow-up task set for +5 days if no reply | 3-touch sequence max: Email → LinkedIn DM → Final email" },
      { label: "PARTNERSHIP CONVERSATION", desc: "15–20 min exploratory call. Structure: (1) Learn about their business and who they serve — listen actively and specifically. (2) Share who your ideal client is and what you solve — be specific, not generic. (3) Identify the natural overlap: 'I'd guess maybe 20–30% of your clients are dealing with [specific pain] — does that sound right?' (4) Propose the concept mutually: 'When you come across someone like that, would you be open to a warm introduction? We'd do the same for clients of ours who need [their service].' (5) Confirm next steps.", color: "#f59e0b", icon: "🗣️", cr: "60–75% of calls result in agreement to try a referral exchange", zoho: "Call logged in CRM | Partnership stage updated | Agreement_Draft tag if verbal yes | Referral_Partner field populated" },
      { label: "PARTNERSHIP AGREEMENT", desc: "Formalise the arrangement. For most small business referrals, a simple email confirmation or one-page document is sufficient. Address: (1) How referrals will be made — warm email introduction vs. passing a contact detail. (2) Whether there's a financial incentive — revenue share (10–20% of first invoice is standard), gift card, or reciprocal referral only. (3) How referred leads will be handled — response time, communication, feedback on outcomes. (4) Exclusivity, if any. Note: financial incentives increase referral frequency but require clear documentation for tax purposes.", color: "#a78bfa", icon: "📄", cr: "80–90% of verbal agreements convert to written confirmations within 1 week", zoho: "Agreement document linked in CRM | Partner status updated: Active | Monthly_Partner_Newsletter list added | Revenue_Share percentage logged in custom field" },
      { label: "PARTNER ONBOARDING", desc: "Give your partner the tools to refer you confidently. Provide: (1) A one-page profile of your ideal client — who they are, what they're struggling with, the specific trigger phrases that indicate they need you. (2) A simple introduction script or email template they can use verbatim. (3) A case study of a result relevant to their clients. (4) A clear next step for the referred client — usually a free audit, discovery call, or resource. Make it effortless to refer. The harder it is, the less it happens.", color: "#f472b6", icon: "🎯", cr: "Partners who receive an onboarding kit refer 3x more frequently than those who don't", zoho: "Partner_Onboarding_Kit email sent via Campaigns | Kit link and template logged in CRM | Intro_Script field in partner record" },
      { label: "PARTNER NURTURE (ONGOING)", desc: "Most partnerships go silent because nothing happens to keep them alive. Run a monthly or quarterly partner nurture program: (1) Monthly short email (5 min read) with a client win, a relevant industry insight, and a reminder of who to refer. (2) Quarterly check-in call — ask how their business is going, share new capability or offer, review any referrals sent or received. (3) Recognition — acknowledge partners publicly (with permission) or send a personal thank-you when a referral closes. (4) Joint content — occasional co-authored post, webinar, or case study that benefits both audiences.", color: "#94a3b8", icon: "🔄", cr: "Partners receiving monthly nurture refer 60–80% more often than dormant partners", zoho: "Partner_Monthly_Newsletter in Zoho Campaigns | Quarterly_Checkin task automation in CRM | Referral_Count field updated on each introduction | Top Partner flag for highest-producing partners" },
      { label: "REFERRAL LEAD HANDLING", desc: "A referred lead requires different handling than a cold inbound lead. They arrive with pre-existing trust from the person who referred them. Rules: (1) Respond within 24 hours — the referring partner's reputation is on the line. (2) Acknowledge the referral source in your first message: 'I understand [partner name] thought we might be a good fit.' (3) Treat the referral conversation as warm, not cold — skip the standard cold outreach scripts. (4) Close the loop with the referring partner after first contact and again after the outcome is determined.", color: "#34d399", icon: "📞", cr: "Referred leads close at 3–5x the rate of cold leads and have higher average deal values", zoho: "Referred lead tagged: Referral_Source=[Partner_Name] | Lead_Score starts at +50 (already warm) | Partner notified on first contact and on deal close | Revenue_Shared_Amount calculated on deal close" },
    ],
    critical_rule: "The single biggest mistake in referral partnership development is treating the first outreach as a pitch. Partners are not prospects — they are potential collaborators. They need to trust you as a peer before they'll risk their own client relationships by referring to you. The first conversation's only goal is to learn about them and identify whether there's a genuine mutual benefit. Every partner who refers you is putting their own reputation on the line. Make that feel safe.",
    outreach_templates: {
      email_first_touch: {
        subject: "quick question about your clients",
        body: "Hi [Name], I came across your [content/profile/website] and noticed you work with [type of client]. I specialise in [your service] and my clients are almost always [type of business] — so there's a natural overlap. I'm not pitching anything — I'm just wondering if a 15-min call to see whether there might be a mutual benefit for our respective clients would be worth your time? No agenda beyond that.",
        notes: "Subject line looks internal. Body is 3 sentences. No credentials dump. No pitch. Ends with a low-friction question.",
      },
      linkedin_dm: {
        body: "Hey [Name] — noticed we both work with [type of client]. Do you find they often have [specific problem your service solves]? Asking because I do [service] and I'm wondering if there's a referral conversation worth having.",
        notes: "2–3 sentences. No paragraph blocks on LinkedIn. Ends with a question, not a statement.",
      },
      follow_up_day5: {
        subject: "re: quick question about your clients",
        body: "Sending a quick follow-up in case this got buried. Happy to keep it very short — even 10 minutes by phone or a brief back-and-forth here would work. If timing isn't right, completely fine to say so.",
        notes: "One follow-up only after email. If no reply, try LinkedIn. If still no reply, move on.",
      },
      post_call_confirm: {
        subject: "great to chat — here's the intro kit",
        body: "Really enjoyed our conversation, [Name]. As promised, I've attached a one-page profile of the clients I work with best — including the exact phrases they use when they're ready to talk to me. Happy to send the same for your clients if useful. Looking forward to seeing how we can help each other's people.",
        notes: "Confirm the agreement. Send the onboarding kit. Offer reciprocal value immediately.",
      },
      monthly_partner_email: {
        subject: "what we solved this month + who to refer",
        sections: [
          "A specific client win from this month (3 sentences with a real number)",
          "The type of business that's a perfect referral right now (1 sentence, very specific)",
          "A useful industry insight they can use in their own client conversations (2–3 sentences)",
          "A soft ask: 'If you know anyone dealing with [specific problem], I'd love an introduction.'",
        ],
        notes: "Keep it under 200 words. This is a relationship touch, not a newsletter. It should read like it was written to them personally.",
      },
    },
    partner_types_by_product: {
      high_ticket_service:    ["Business coaches", "Accountants/CFOs", "Web developers", "Marketing agencies (non-competing)", "Executive assistants", "Operations consultants"],
      mid_ticket_service:     ["Virtual assistants", "Bookkeepers", "Graphic designers", "Business coaches", "LinkedIn consultants"],
      saas:                   ["Implementation consultants", "Competing platform migration specialists", "Digital marketing agencies", "IT service providers"],
      local_service:          ["Real estate agents", "Other trades", "Business coaches", "Local chambers of commerce", "Property managers"],
      ecommerce:              ["Social media managers", "Influencers", "Complementary product brands", "Packaging and fulfilment companies"],
      community_membership:   ["Adjacent community owners (different audience, similar values)", "Content creators in complementary niches", "Podcast hosts"],
    },
    category: "relationship",
    product_fit: ["high_ticket","mid_ticket","saas","local"],
    fits: ["cold-reach", "warm-conversion", "hot-value"],
    campaign_codes: ["AWR-1.0A", "CON-1.0A", "SOL-1.0A"],
    when_to_use: "As soon as you have your first 3 client results you can reference. Referral partnerships compound over time — start building this channel in parallel with paid and organic. A single strong referral partner can be worth more than $10,000/month in qualified leads.",
    when_not_to_use: "Do not use referral partnership outreach before you have a clear offer and at least a few case studies. Potential partners will ask 'who have you helped?' If you can't answer with a specific example, the conversation dies. Build your proof first, then pursue partnerships.",
    bayside_implementation: "Ideal partners for your business: (1) Coaches or consultants whose clients need your type of service. (2) Accountants or bookkeepers with SMB clients who'd benefit from your offering. (3) Web developers who build sites for businesses that need what you do next. (4) LinkedIn consultants whose clients generate leads that need your solution. Monthly partner newsletter: one tip their clients can use, one case study, one 'who to refer to us' reminder.",
  },

  // ─── LEAD GENERATION FUNNELS ────────────────────────────────────────────
  {
    id: "squeeze_page",
    name: "SQUEEZE PAGE FUNNEL",
    subtitle: "Single-Purpose Email Capture System",
    icon: "📩",
    hex: "#f59e0b",
    category: "lead-gen",
    product_fit: ["high_ticket","mid_ticket","digital","saas","local","community"],
    origin: "The foundational digital marketing mechanism — every funnel starts here. A single page with one job: get the email address.",
    best_for: "Any market temperature as a list-building entry point. Works for any offer type — the captured email is what powers all downstream funnels.",
    complexity: "LOW",
    time_to_build: "1–3 days",
    min_budget: "Zero (organic) — scales with paid ads",
    stages: [
      { label: "TRAFFIC", desc: "Paid or organic — any source", color: "#94a3b8", icon: "📡" },
      { label: "SQUEEZE PAGE", desc: "One headline. One benefit. One field (email). One CTA. Nothing else — no nav, no links, no distractions.", color: "#f59e0b", icon: "📩", cr: "25–45% opt-in rate for warm traffic", zoho: "Form submit → MA contact created → Welcome_Series triggered" },
      { label: "THANK YOU / REDIRECT", desc: "Immediately redirect to an offer page or lead magnet delivery. Never leave them on a dead thank-you page.", color: "#34d399", icon: "🎁", cr: "N/A — transition page", zoho: "Redirect UTM tracked → Lead_Score set → Surfboard Page 2 or offer presented" },
      { label: "EMAIL SEQUENCE", desc: "Nurture the new subscriber immediately. First email within 60 seconds.", color: "#38bdf8", icon: "📧", cr: "Open rate 40–60% on email 1", zoho: "AWR_Welcome_Series_1.0 automated in Zoho Campaigns" },
    ],
    critical_rule: "Remove every distraction. No navigation. No 'about us'. No social links. The squeeze page has ONE job. The conversion rate drops 20–40% every time you add a second option.",
    fits: ["cold-reach", "warm-conversion", "hot-value"],
    when_to_use: "As the front-end of any other funnel. Always running. The Surfboard funnel's Page 1 is essentially a squeeze page.",
    when_not_to_use: "Never use as a standalone final destination — it feeds into other funnels, it is not itself a conversion mechanism.",
  },
  {
    id: "reverse_squeeze",
    name: "REVERSE SQUEEZE PAGE FUNNEL",
    subtitle: "Free Value First, Then Ask for Email",
    icon: "🔄",
    hex: "#f59e0b",
    category: "lead-gen",
    product_fit: ["digital","community","saas","mid_ticket","high_ticket"],
    origin: "A variant of the classic squeeze page that leads with free value before requesting the opt-in — higher trust, higher quality leads.",
    best_for: "Cold audiences who aren't ready to give their email without experiencing your value first. Particularly effective for audiences that are ad-fatigued.",
    complexity: "LOW",
    time_to_build: "2–5 days",
    min_budget: "Zero (organic content) — works with any budget",
    stages: [
      { label: "TRAFFIC", desc: "Cold or warm paid/organic traffic", color: "#94a3b8", icon: "📡" },
      { label: "FREE VALUE ON PAGE", desc: "A free video, mini-lesson, or tool available immediately — no opt-in required. Prospect gets value before being asked for anything.", color: "#f59e0b", icon: "🎬", cr: "60–80% of page visitors watch some of the free content", zoho: "Page load UTM tagged → anonymous session tracked" },
      { label: "OPT-IN ASK", desc: "After the free content, ask for email to access part 2, a deeper resource, or a complementary tool. The exchange feels fair because you've already given.", color: "#34d399", icon: "📩", cr: "15–30% of free content viewers opt in — lower volume but significantly higher quality", zoho: "Form submit → MA contact created → CON_Nurture sequence (they're already warm)" },
      { label: "EMAIL SEQUENCE", desc: "Treat them as warm from email 1 — they've already engaged with your content.", color: "#38bdf8", icon: "📧", cr: "Open rates 45–65% — highest quality segment", zoho: "CON_Nurturing_Sequence_1.0 (skip standard welcome, go straight to value)" },
    ],
    critical_rule: "The free content on the page must be genuinely valuable — not a teaser. If people feel the free content was hollow, the opt-in rate collapses and they lose trust before they're even on your list.",
    fits: ["cold-reach", "warm-conversion"],
    when_to_use: "When standard opt-in funnels have below-average conversion rates. When building an audience of sophisticated buyers who are skeptical of free offers.",
    when_not_to_use: "Not for hot audiences who are ready to buy — excess friction. Not when you need high volume list growth quickly.",
  },
  {
    id: "lead_magnet",
    name: "LEAD MAGNET FUNNEL",
    subtitle: "Specific Resource in Exchange for Email",
    icon: "🧲",
    hex: "#f59e0b",
    category: "lead-gen",
    product_fit: ["high_ticket","mid_ticket","digital","community"],
    origin: "The workhorse of B2B list-building — a specific, high-perceived-value resource delivered instantly in exchange for contact details.",
    best_for: "B2B audiences with specific, well-defined problems. Particularly powerful when the lead magnet directly relates to the paid offer, making it a 'gateway' to the product.",
    complexity: "LOW",
    time_to_build: "3–7 days (to create a quality asset)",
    min_budget: "Zero — the asset cost is the investment",
    stages: [
      { label: "TRAFFIC", desc: "Promoted via ads, organic, or as a content upgrade within blog/video content", color: "#94a3b8", icon: "📡" },
      { label: "LANDING PAGE", desc: "Benefit-focused. What will they know/be able to do after getting this? Specific outcome, not vague value.", color: "#f59e0b", icon: "📄", cr: "30–50% for warm, 15–25% for cold paid", zoho: "Form submit → MA contact + tag with lead magnet name → segmented sequences" },
      { label: "DELIVERY + REDIRECT", desc: "Instant delivery via email. Redirect to offer page immediately after opt-in (do not waste this moment).", color: "#34d399", icon: "📬", cr: "Open rate on delivery email: 60–80%", zoho: "Automated delivery email + redirect to Surfboard Page 2" },
      { label: "NURTURE SEQUENCE", desc: "Position the lead magnet as chapter 1 of their education journey. The nurture sequence is chapter 2–10.", color: "#38bdf8", icon: "📧", cr: "30–40% open rate across sequence", zoho: "AWR_Welcome_Series triggered. Lead magnet topic tags used to personalise" },
    ],
    critical_rule: "The lead magnet must solve ONE specific problem completely — not give a broad overview. 'The 5-Step Checklist to Fix X' outperforms 'The Ultimate Guide to Everything About Y' every time. Specificity is the conversion mechanism.",
    fits: ["cold-reach", "warm-conversion"],
    when_to_use: "As the front-end of any B2B funnel. Best when the lead magnet is a condensed version of your paid service methodology.",
    when_not_to_use: "Not effective when your audience is already very sophisticated — they've seen too many lead magnets and discount them. Use webinar or reverse squeeze instead.",
  },
  {
    id: "quiz_funnel",
    name: "QUIZ / SURVEY FUNNEL",
    subtitle: "Personalised Segmentation + Lead Capture",
    icon: "🧩",
    hex: "#f59e0b",
    category: "lead-gen",
    product_fit: ["digital","saas","community","mid_ticket","local"],
    origin: "Popularised by Ryan Levesque's 'Ask Method' — quiz funnels qualify and segment leads while delivering a personalised experience that dramatically increases opt-in rates.",
    best_for: "Businesses with multiple audience segments or product tiers. The quiz qualifies which offer is right for which lead, allowing hyper-personalised follow-up.",
    complexity: "MEDIUM",
    time_to_build: "1–2 weeks (quiz logic + results pages + segmented sequences)",
    min_budget: "Zero — but paid ads can drive significant volume",
    stages: [
      { label: "TRAFFIC", desc: "Paid or organic — curiosity-driven hook ('Take the quiz', 'Find out your X score')", color: "#94a3b8", icon: "📡" },
      { label: "QUIZ PAGE", desc: "5–8 questions. Each answer reveals something about their situation. Progress bar shown. Never ask for email mid-quiz — finish the questions first.", color: "#f59e0b", icon: "🧩", cr: "60–75% of starters complete the quiz", zoho: "Quiz platform (Typeform/Interact) → Zoho MA via webhook → answers stored as contact tags" },
      { label: "RESULTS OPT-IN", desc: "Ask for email to receive personalised results. At this point they've invested time, so opt-in rates are very high.", color: "#a78bfa", icon: "📩", cr: "60–75% of completers opt in — highest opt-in rate of any lead gen method", zoho: "MA contact created with full answer tags → segment automatically into appropriate nurture sequence" },
      { label: "PERSONALISED RESULTS PAGE", desc: "Their results + what it means for them + a personalised recommendation for your offer. Highly specific = high trust.", color: "#34d399", icon: "📊", cr: "Segmented sequences deliver 2–3x better conversion than generic nurture", zoho: "Segment tags drive personalised email sequences. Multiple SOL paths based on quiz segment." },
    ],
    critical_rule: "The quiz must feel like a diagnostic, not a trick to get an email. Every question should feel relevant to the result. If people feel the questions don't connect to a meaningful outcome, they abandon. The result page must deliver genuine insight, not just a reframed sales pitch.",
    fits: ["cold-reach", "warm-conversion"],
    when_to_use: "When you serve multiple audience segments with different needs. When your offer comes in tiers. When a personalised approach would significantly increase conversion.",
    when_not_to_use: "Not for single-segment audiences with a single offer — the quiz complexity adds friction without adding value.",
  },
  {
    id: "free_plus_shipping",
    name: "FREE + SHIPPING FUNNEL",
    subtitle: "Physical Product as Buyer-Acquisition Engine",
    icon: "📦",
    hex: "#f59e0b",
    category: "lead-gen",
    product_fit: ["ecommerce","local"],
    origin: "Popularised by Russell Brunson with 'DotCom Secrets' — a physical book offered free, customer pays only shipping. Builds a massive buyer list at near-zero cost.",
    best_for: "Ecommerce and physical products. The goal is not the shipping revenue — it's the buyer list. A customer who has paid $7.95 shipping is a buyer, which is psychologically very different from a free lead.",
    complexity: "MEDIUM",
    time_to_build: "2–3 weeks (product + fulfilment setup + checkout funnel)",
    min_budget: "$1K+ initial (product inventory, fulfilment) — ongoing covered by shipping revenue",
    stages: [
      { label: "TRAFFIC", desc: "Cold paid traffic — free offer is the hook", color: "#94a3b8", icon: "📡" },
      { label: "LANDING PAGE", desc: "Free book / product page. 'We pay for the product, you just cover shipping.' Strong value proposition front and centre.", color: "#f59e0b", icon: "📦", cr: "8–15% of cold traffic converts (higher than most cold paid funnels)", zoho: "Ecommerce order → Zoho Commerce → buyer tagged in CRM | UTM source tracked" },
      { label: "CHECKOUT + ORDER BUMP", desc: "Shipping checkout with one checkbox upsell on the order form.", color: "#34d399", icon: "🛒", cr: "25–35% take the order bump", zoho: "Order completed → tag Buyer_FPS → RET_Upsell_Sequence triggered" },
      { label: "UPSELL STACK", desc: "2–3 upsells immediately post-purchase. Main product, bundle, or service upgrade.", color: "#a78bfa", icon: "⬆️", cr: "10–25% per upsell offer", zoho: "Upsell accepted → deal value updated → segment into premium buyer nurture" },
    ],
    critical_rule: "You will usually lose money on the front end — that is intentional. The profitability lives in the upsell stack and lifetime customer value. If you don't have backend offers planned before you launch, do not use this funnel.",
    fits: ["cold-reach"],
    when_to_use: "For physical product businesses wanting to build a buyer list rapidly. Also works for digital products (free chapter of a book, free toolkit) as a lead-gen mechanism.",
    when_not_to_use: "Not viable for service businesses. Not suitable without a planned backend revenue sequence.",
  },

  // ─── DIRECT SALES FUNNELS ────────────────────────────────────────────────
  {
    id: "sales_letter",
    name: "LONG-FORM SALES LETTER FUNNEL",
    subtitle: "Written Copy as the Conversion Mechanism",
    icon: "📜",
    hex: "#34d399",
    category: "direct-sales",
    product_fit: ["digital","mid_ticket","community"],
    origin: "The oldest direct-response selling mechanism — pioneered by Gary Halbert, Dan Kennedy, and Eugene Schwartz. A single long-form written page that does all the selling without images, video, or navigation.",
    best_for: "Markets where sophisticated, detailed buyers want to read the full case before committing. Mid-ticket digital products ($97–$997). Supplements, info products, and written-format communities.",
    complexity: "MEDIUM",
    time_to_build: "1–2 weeks (copywriting is the core investment)",
    min_budget: "Zero — organic or paid, any budget",
    stages: [
      { label: "TRAFFIC", desc: "Warm or cold — works for both", color: "#94a3b8", icon: "📡" },
      { label: "HEADLINE + HOOK", desc: "One powerful, curiosity or fear-based headline. No images. No nav bar. Just the headline and the copy begins.", color: "#34d399", icon: "📰", cr: "Scroll depth > 60% = good headline", zoho: "UTM landing → MA contact created on opt-in or purchase" },
      { label: "LONG-FORM BODY COPY", desc: "Story → Problem agitation → Credibility → Solution reveal → Proof stack → Offer reveal → Guarantee → Price → CTA. No sidebar, no images, pure text.", color: "#f59e0b", icon: "📝", cr: "1–5% of page readers purchase directly", zoho: "Purchase event → CRM deal → RET sequence triggered" },
      { label: "ORDER PAGE + UPSELL", desc: "Single CTA throughout — no links, no social, no nav. One job: click the order button.", color: "#a78bfa", icon: "💳", cr: "20–30% order bump take rate", zoho: "Zoho Commerce checkout → Buyer tagged → Upsell page redirect" },
    ],
    critical_rule: "There are no shortcuts in long-form copy. Every paragraph earns the next paragraph. Every section answers the objection that arose in the previous section. If you skip the copy fundamentals (PAS, BAB, PASTOR), the length alone will not convert.",
    fits: ["warm-conversion", "hot-value"],
    when_to_use: "For sophisticated audiences that read. B2B buyers evaluating solutions. Supplement/health/info products. Markets where trust and proof drive the decision.",
    when_not_to_use: "Not for cold social traffic where attention spans are short — use VSL or short-form first. Not for high-ticket ($3K+) offers where a call is needed.",
  },
  {
    id: "vsl_direct",
    name: "VIDEO SALES LETTER (DIRECT) FUNNEL",
    subtitle: "Video Does the Selling → Direct Purchase",
    icon: "📹",
    hex: "#34d399",
    category: "direct-sales",
    product_fit: ["digital","mid_ticket"],
    origin: "The video evolution of the sales letter — VSLs outperform written copy for most audiences on cold traffic because video communicates tone, energy, and emotion that text cannot.",
    best_for: "Mid-ticket digital products ($197–$2,997) where purchase can happen without a call. Warm retargeting audiences. Any offer where watching the video pre-sells the outcome.",
    complexity: "MEDIUM",
    time_to_build: "1–2 weeks (script + video recording + page build)",
    min_budget: "$300/mo for paid traffic testing",
    stages: [
      { label: "TRAFFIC", desc: "Paid retargeting or warm organic traffic", color: "#94a3b8", icon: "📡" },
      { label: "VSL PAGE", desc: "Autoplay or click-to-play video. No pause, no skip, no progress bar (controls reduce conversion). Video is 10–30 min depending on price point. CTA button appears partway through or at end.", color: "#34d399", icon: "📹", cr: "3–10% of page visitors purchase directly", zoho: "VSL view → UTM tagged → Lead_Score +25 | CTA click → checkout flow" },
      { label: "ORDER PAGE", desc: "Simple checkout. Minimal copy — the VSL did the selling. One-time offer or order bump.", color: "#f59e0b", icon: "💳", cr: "20–30% order bump take rate", zoho: "Purchase → Buyer tag → RET_Upsell sequence → CRM deal created" },
      { label: "POST-PURCHASE UPSELL STACK", desc: "1–2 one-click upsells immediately after purchase.", color: "#a78bfa", icon: "⬆️", cr: "15–25% per upsell", zoho: "Upsell events tracked → deal value updated → premium buyer sequence" },
    ],
    critical_rule: "Control is the enemy of conversion. Remove video controls (pause, scrub, skip). The prospect must watch the full selling sequence in order. Giving control lets them skip the key persuasion moments.",
    fits: ["warm-conversion", "hot-value"],
    when_to_use: "When your offer is $200–$3,000 and can be sold without a call. When you have video production capability. Best for retargeted warm audiences.",
    when_not_to_use: "Not for cold traffic — they don't know you enough to watch 15+ minutes. Not for offers requiring trust earned over months (use nurture first).",
  },
  {
    id: "two_step_order",
    name: "TWO-STEP ORDER FORM FUNNEL",
    subtitle: "Capture Contact First, Payment Second",
    icon: "2️⃣",
    hex: "#34d399",
    category: "direct-sales",
    product_fit: ["digital","ecommerce","mid_ticket"],
    origin: "Developed for ecommerce abandoned cart recovery — by collecting email on Step 1, you can follow up with everyone who abandons on Step 2, dramatically reducing lost revenue.",
    best_for: "Any funnel where cart abandonment is a significant problem. Ecommerce. Digital product checkouts. Any offer where you want to follow up on non-buyers without separate opt-in sequences.",
    complexity: "LOW-MEDIUM",
    time_to_build: "1 week",
    min_budget: "Zero — reduces waste from existing traffic",
    stages: [
      { label: "TRAFFIC", desc: "Any source — works best as overlay on existing paid traffic", color: "#94a3b8", icon: "📡" },
      { label: "STEP 1 — CONTACT INFO", desc: "Name and email only. Fast, low friction. No payment details yet. People complete Step 1 at very high rates because the commitment feels small.", color: "#34d399", icon: "📝", cr: "70–85% of page visitors complete Step 1", zoho: "MA contact created at Step 1 — even if they never reach Step 2 | Abandoned_Cart_Sequence triggers if no purchase within 1hr" },
      { label: "STEP 2 — PAYMENT DETAILS", desc: "Payment information + order summary. Order bump on this page.", color: "#f59e0b", icon: "💳", cr: "30–50% of Step 1 completers pay", zoho: "Purchase event → deal created → buyer tagged | Non-buyers automatically in Abandoned_Cart_Sequence" },
      { label: "ABANDONED CART FOLLOW-UP", desc: "3–5 email sequence to people who completed Step 1 but not Step 2. One of the highest-ROI sequences possible.", color: "#f472b6", icon: "🛒", cr: "15–25% of abandoners recovered via email sequence", zoho: "Zoho Campaigns automated sequence: email at 1hr, 24hr, 3 days, 7 days post-Step-1" },
    ],
    critical_rule: "Without this funnel, every visitor who abandons checkout is permanently lost. With it, you've captured their email on Step 1, and the abandoned cart sequence can recover 15–25% of those lost sales. This can double your effective conversion rate on existing traffic with no additional ad spend.",
    fits: ["warm-conversion", "hot-value"],
    when_to_use: "As the checkout mechanism for any direct-sale funnel. Especially valuable when you're spending on paid traffic — every dollar of ad spend that almost converted can be recovered.",
    when_not_to_use: "Not a standalone funnel — it's a conversion layer added to existing offer pages.",
  },
  {
    id: "slo_funnel",
    name: "SELF-LIQUIDATING OFFER (SLO) FUNNEL",
    subtitle: "Paid Front-End That Covers Its Own Ad Spend",
    icon: "💰",
    hex: "#34d399",
    category: "direct-sales",
    product_fit: ["digital","ecommerce","mid_ticket"],
    origin: "The mechanism that makes paid advertising cost-neutral — a low-to-mid ticket front-end offer ($27–$197) that covers ad spend, allowing the backend to be pure profit.",
    best_for: "Businesses that want to build a paid buyer list at zero net cost. The front-end SLO funds the advertising; backend offers (upsells, continuity) generate the profit.",
    complexity: "MEDIUM",
    time_to_build: "2–3 weeks (front-end offer + upsell stack + ad creative)",
    min_budget: "$500/mo to test and optimise the ad-to-SLO conversion rate",
    stages: [
      { label: "PAID AD", desc: "Cold traffic ad. The hook is the offer itself — low price + clear high value.", color: "#94a3b8", icon: "📡" },
      { label: "OFFER PAGE", desc: "Short landing page. Strong headline. Clear value proposition. Price visible — the low price is part of the persuasion.", color: "#34d399", icon: "📄", cr: "3–8% of cold traffic converts (break-even or slight profit on ad spend)", zoho: "Purchase → Buyer tag | UTM tracked to specific ad creative | CPL vs CPA dashboard" },
      { label: "ORDER BUMP", desc: "One checkbox on checkout page. Complementary product. Adds 25–35% to average order value.", color: "#f59e0b", icon: "☑️", cr: "25–35% order bump rate", zoho: "Bump purchase → order value updated → segment into higher-value buyer sequence" },
      { label: "UPSELL STACK (BACKEND)", desc: "1–3 sequential upsells. Each is a natural extension of what they just bought. This is where profit lives.", color: "#a78bfa", icon: "⬆️", cr: "10–20% per upsell offer", zoho: "Each upsell tracked → deal value compounded → backend nurture sequence personalised by purchase history" },
    ],
    critical_rule: "The SLO must be genuinely valuable at face value — not a stripped-down teaser. If buyers feel they bought a 'hook' rather than a real product, refund rates spike and trust is destroyed before the upsell sequence begins. The SLO is a product that happens to also generate leads, not a lead magnet with a price tag.",
    fits: ["cold-reach", "warm-conversion"],
    when_to_use: "When you want to scale paid advertising without a growing ad budget. When your funnel economics support a $27–$197 front end that covers acquisition cost.",
    when_not_to_use: "Not viable without a backend upsell stack. Do not launch without having at least 2 backend offers ready.",
  },
  {
    id: "flash_sale",
    name: "DAILY DEAL / FLASH SALE FUNNEL",
    subtitle: "Time-Limited Irresistible Offer to Acquire Buyers Fast",
    icon: "⚡",
    hex: "#34d399",
    category: "direct-sales",
    product_fit: ["ecommerce","digital","local"],
    origin: "Made famous by Groupon and LivingSocial — a dramatically discounted offer available for 24–72 hours. The urgency is real and the scarcity is structural.",
    best_for: "Rapidly acquiring new customers at scale. Clearing inventory. Introducing a new offer to a warm list. Re-engaging dormant customers with an irresistible reason to buy now.",
    complexity: "LOW-MEDIUM",
    time_to_build: "3–5 days (offer setup + email campaign + landing page)",
    min_budget: "Zero — works best as an email campaign to existing list",
    stages: [
      { label: "ANNOUNCEMENT", desc: "Email + social announcing the deal. State the deadline clearly. Build anticipation 24hrs before the cart opens.", color: "#94a3b8", icon: "📣" },
      { label: "DEAL PAGE", desc: "Full price shown + discounted price. Countdown timer. Reason for the deal (launch, anniversary, stock clearance). Single CTA.", color: "#34d399", icon: "⚡", cr: "5–15% of email list during a 48hr flash sale", zoho: "Purchase → Buyer tag | Countdown enforced — offer literally removed at deadline | CON sequence for non-buyers" },
      { label: "DEADLINE EMAILS", desc: "Email at: deal announcement, 24hrs remaining, 6hrs remaining, 1hr remaining, closed. Each email increases urgency progressively.", color: "#f59e0b", icon: "⏰", cr: "30–40% of sales come in the final 6 hours", zoho: "Automated Zoho Campaigns sequence with real deadline enforcement — not fake countdown" },
      { label: "POST-DEAL ASCENSION", desc: "After the deal closes, buyers enter your standard upsell / ascension sequence.", color: "#a78bfa", icon: "📈", cr: "10–20% ascend to full-price offer within 30 days", zoho: "Post-purchase: RET_Flash_Buyers sequence → upsell to core offer at full price" },
    ],
    critical_rule: "The deadline must be real. If you extend a 'closed' offer because you feel guilty, you train your list that your deadlines are fake. Future urgency campaigns will fail. Remove the offer when you said you would — the slightly lower immediate revenue is worth the maintained trust and future campaign effectiveness.",
    fits: ["warm-conversion", "hot-value"],
    when_to_use: "To re-engage a list that's gone quiet. To rapidly test a new offer. To clear old inventory or course cohorts with open seats. 2–4 times per year maximum.",
    when_not_to_use: "Do not run flash sales more than 4x per year or your list will wait for the next sale instead of buying at full price. Do not use for high-ticket offers — dramatically discounting $5K services destroys perceived value.",
  },
  {
    id: "limited_time_offer",
    name: "LIMITED TIME OFFER (LTO) FUNNEL",
    subtitle: "Deadline-Driven Conversion for Fence-Sitters",
    icon: "⏳",
    hex: "#34d399",
    category: "direct-sales",
    product_fit: ["digital","mid_ticket","ecommerce","community"],
    origin: "The principle of scarcity and urgency baked into a systematic funnel structure — most effective when the offer is strong and the deadline is structurally enforced.",
    best_for: "Converting warm audiences who are interested but haven't pulled the trigger. Particularly effective at the end of a launch sequence, webinar, or challenge funnel.",
    complexity: "LOW",
    time_to_build: "1–3 days (can be bolted onto existing offers)",
    min_budget: "Zero — adds urgency to existing traffic without additional spend",
    stages: [
      { label: "ENTRY EVENT", desc: "The trigger: watched a webinar, completed a challenge, clicked a link, received an email. The LTO launches from this event.", color: "#94a3b8", icon: "🚀" },
      { label: "OFFER PAGE WITH COUNTDOWN", desc: "Full offer presented with a prominent countdown timer (hours:minutes:seconds). Bonus stack that expires at the deadline. Price or access clearly time-limited.", color: "#34d399", icon: "⏳", cr: "Typically 2–4x the conversion rate of the same offer without urgency", zoho: "Personalized deadline per contact (not site-wide timer) — Zoho tracks individual event timestamps" },
      { label: "DEADLINE EMAIL SEQUENCE", desc: "3–5 emails: offer intro → value stack reminder → FAQ/objections → 24hr warning → last call. Each email progressively more urgent.", color: "#f59e0b", icon: "📧", cr: "60–70% of LTO conversions come from the email sequence, not the page itself", zoho: "SOL_LTO_Sequence in Zoho Campaigns | Real-time deadline tracking per subscriber" },
      { label: "EXPIRY + REDIRECT", desc: "Offer truly expires. Page redirects to 'offer closed' or full-price alternative.", color: "#94a3b8", icon: "🔒", cr: "15–30% of 'expired' visitors check if they can still access", zoho: "Expired contacts → CON_Long_Term_Nurture | Option: waitlist for next cohort" },
    ],
    critical_rule: "Evergreen (fake) countdown timers that reset when you clear cookies are detectable and destroy trust. Use individual contact-level deadlines (set at the moment they triggered the funnel) rather than a universal site timer. Personally-timed urgency is both more ethical and more effective.",
    fits: ["warm-conversion", "hot-value"],
    when_to_use: "At the end of any launch, webinar, or challenge sequence. As an email-based promotional mechanism to warm lists. When your offer has been available indefinitely and conversion is stagnant.",
    when_not_to_use: "Do not use fake countdown timers. Do not run LTOs more than monthly or the urgency mechanism becomes invisible to your list.",
  },

  // ─── TRUST-BUILDING FUNNELS ───────────────────────────────────────────────
  {
    id: "video_series",
    name: "VIDEO SERIES / FREE TRAINING FUNNEL",
    subtitle: "Multi-Video Education Sequence → Offer",
    icon: "🎞️",
    hex: "#38bdf8",
    category: "trust-building",
    product_fit: ["digital","mid_ticket","high_ticket","community"],
    origin: "The 'mini-course' funnel — delivers genuine educational value across 3–5 videos before presenting an offer. Bridges the gap between a single webinar and a full challenge.",
    best_for: "Complex offers where prospects need to understand a framework before they can evaluate the solution. Particularly effective for software, methodology-based services, and communities.",
    complexity: "MEDIUM",
    time_to_build: "2 weeks (script + record + set up automated sequences)",
    min_budget: "Zero — organic opt-in + email delivery",
    stages: [
      { label: "OPT-IN", desc: "Register for the free video training series. Email required.", color: "#94a3b8", icon: "📥" },
      { label: "VIDEO 1 — PROBLEM", desc: "Establish the problem and why conventional approaches fail. Hook them into Video 2.", color: "#38bdf8", icon: "🎬", cr: "70–80% of registrants watch Video 1", zoho: "Video 1 delivered via email D1 | View tracking via link clicks + Lead_Score +10" },
      { label: "VIDEO 2 — SOLUTION FRAMEWORK", desc: "Your unique framework or methodology. Teach the approach, not the full implementation.", color: "#f59e0b", icon: "🎬", cr: "50–60% of V1 viewers watch V2", zoho: "Video 2 email Day 3 | Lead_Score +15 for V2 view" },
      { label: "VIDEO 3 — PROOF + OFFER", desc: "Case study + social proof + offer reveal. Natural transition from education to invitation.", color: "#34d399", icon: "🎬", cr: "3–8% of V3 viewers purchase or book", zoho: "SOL_Post_Video_Series_Sequence | Non-buyers → CON_Nurture | Buyers → RET sequence" },
    ],
    critical_rule: "Each video must end with a pattern-interrupt hook for the next ('In the next video I'm going to show you X that almost nobody does...'). If you don't give them a reason to come back, each successive video loses 40–60% of the prior audience.",
    fits: ["cold-reach", "warm-conversion"],
    when_to_use: "As a higher-depth alternative to a standard lead magnet. When your methodology requires more than one session to explain. When a webinar feels too formal for your brand.",
    when_not_to_use: "Not for simple offers that can be explained in 5 minutes. Not for hot audiences who already want to buy — excess friction.",
  },
  {
    id: "product_launch",
    name: "PRODUCT LAUNCH FUNNEL (PLF)",
    subtitle: "Jeff Walker's Pre-Launch Anticipation System",
    icon: "🚀",
    hex: "#38bdf8",
    category: "trust-building",
    product_fit: ["digital","community","mid_ticket","high_ticket"],
    origin: "Developed by Jeff Walker and documented in 'Launch' — used by thousands of online entrepreneurs to launch new offers with built-in anticipation, scarcity, and social proof.",
    best_for: "Launching new offers, courses, or products to a warm list. Creating an event around a new product rather than just releasing it. Generating significant revenue in a short window.",
    complexity: "HIGH",
    time_to_build: "3–4 weeks minimum (pre-launch content + email sequences + cart mechanics)",
    min_budget: "$500+ for list building before launch if list is small",
    stages: [
      { label: "PRE-LAUNCH (3–4 WEEKS)", desc: "Seed pre-launch content (blog posts, social, emails). Build anticipation. Never reveal the full offer — only tease the outcome.", color: "#94a3b8", icon: "🌱" },
      { label: "LAUNCH VIDEO 1 — THE OPPORTUNITY", desc: "What has changed in the market that makes this the right moment? Future-pace the opportunity. No offer yet.", color: "#38bdf8", icon: "🎬", cr: "50–70% of warm list watches LV1", zoho: "LV1 email sequence → Lead_Score tracking | Comments and replies logged as engagement" },
      { label: "LAUNCH VIDEO 2 — THE TRANSFORMATION", desc: "Case study and proof. Who has already achieved the outcome? How specifically did they do it?", color: "#f59e0b", icon: "🎬", cr: "40–60% of LV1 viewers watch LV2", zoho: "LV2 email Day 3 | Re-send to non-openers with different subject at Day 5" },
      { label: "LAUNCH VIDEO 3 — THE EXPERIENCE", desc: "A deeper look at what the program/product is. Experience the methodology. Answer objections organically through the narrative.", color: "#a78bfa", icon: "🎬", cr: "35–50% of LV2 viewers watch LV3", zoho: "LV3 email + Q&A invitation | Cart pre-open announcement embedded" },
      { label: "CART OPEN — LIMITED WINDOW", desc: "Cart opens for 4–7 days only, then closes. Early-bird bonus for first 24–48 hrs. Price may increase at cart close.", color: "#34d399", icon: "🛒", cr: "2–6% of entire warm list purchases during cart open", zoho: "SOL_PLF_Cart_Sequence in Zoho Campaigns | Real deadline | Post-cart: RET buyers / CON non-buyers" },
    ],
    critical_rule: "The launch sequence is a conversation with your audience, not a broadcast. Reply to comments. Acknowledge responses. Use the pre-launch content to identify and address real objections that appear before cart open. A launch without engagement in the pre-launch phase underperforms by 40–60%.",
    fits: ["cold-reach", "warm-conversion"],
    when_to_use: "For new offer launches to an existing audience. Annually or semi-annually — not more than 2x per year for the same offer. When you want to create an event around your product release.",
    when_not_to_use: "Not for evergreen sales — build a separate evergreen funnel after launch. Not for brand new businesses with no list — you need an audience to launch to.",
  },
  {
    id: "summit_funnel",
    name: "VIRTUAL SUMMIT FUNNEL",
    subtitle: "Multi-Speaker Event as List-Building & Authority Engine",
    icon: "🏔️",
    hex: "#38bdf8",
    category: "trust-building",
    product_fit: ["community","digital","mid_ticket","high_ticket"],
    origin: "Online summits became mainstream circa 2015 — the host benefits from speakers' audiences who promote to their own lists, creating explosive list growth while building authority.",
    best_for: "Rapidly building an audience in a new niche. Establishing authority by association with respected experts. Building a community around a shared topic.",
    complexity: "HIGH",
    time_to_build: "6–8 weeks (speaker recruitment, interviews, platform setup, promotion)",
    min_budget: "Zero — speakers promote to their own lists at no cost to you",
    stages: [
      { label: "SPEAKER RECRUITMENT", desc: "Identify and pitch 10–30 speakers in your niche. Their promotional reach is your acquisition engine. Target speakers with 5K–50K email subscribers.", color: "#94a3b8", icon: "🎤" },
      { label: "SUMMIT REGISTRATION", desc: "Free registration for all sessions. Speakers promote to their lists. Registrant data is yours.", color: "#38bdf8", icon: "📥", cr: "5–15% of each speaker's list registers", zoho: "Registration → MA contact | Summit_Attendee tag | AWR sequence begins | Speaker referral tracked" },
      { label: "FREE ACCESS PERIOD", desc: "Sessions are free for 24–48 hours only. Creates urgency to consume content in real time.", color: "#f59e0b", icon: "🎬", cr: "30–50% of registrants watch at least one session", zoho: "Session view tracking via UTM | Lead_Score +5 per session | Engaged segment identified" },
      { label: "ALL-ACCESS PASS UPSELL", desc: "Permanent recordings + bonuses sold during and after the summit. This is the primary revenue mechanism.", color: "#34d399", icon: "💳", cr: "5–15% of registrants buy the all-access pass ($97–$297)", zoho: "AAP purchase → RET sequence | Non-buyers → Post_Summit_Nurture | SOL offer revealed post-summit" },
    ],
    critical_rule: "Your ability to recruit quality speakers is the entire summit's success. Cold-pitching unknown experts rarely works. Start by approaching people you have a genuine relationship with or mutual connections to. A summit with 15 deeply engaged speakers outperforms one with 50 lukewarm participants.",
    fits: ["cold-reach", "warm-conversion"],
    when_to_use: "When you need to rapidly build a list in a new niche or market. When you want to establish yourself as a curator and connector of expertise. Best as a major annual or bi-annual list-building event.",
    when_not_to_use: "Not for small lists or new businesses without speaker relationships. The logistical investment is substantial — not a 'quick win' funnel.",
  },
  {
    id: "bridge_funnel",
    name: "BRIDGE FUNNEL",
    subtitle: "Pre-Frame Page That Connects Traffic to Any Offer",
    icon: "🌉",
    hex: "#38bdf8",
    category: "trust-building",
    product_fit: ["digital","mid_ticket","community"],
    origin: "Developed within the affiliate and network marketing space — a bridge page sits between your ad or content and the offer page, pre-framing the offer in a way that dramatically increases conversion.",
    best_for: "Affiliate marketers who don't control the final offer page. Anyone sending traffic to a third-party sales page. Any scenario where the traffic source and offer page have a trust or context mismatch.",
    complexity: "LOW",
    time_to_build: "1–2 days",
    min_budget: "Zero — a page and a redirect",
    stages: [
      { label: "TRAFFIC", desc: "Ad or content — any source", color: "#94a3b8", icon: "📡" },
      { label: "BRIDGE PAGE", desc: "Short personal video (2–5 min) or brief written page. Who you are, why you're recommending this, what problem it solves for them specifically. Pre-sells before they see the offer.", color: "#38bdf8", icon: "🌉", cr: "Bridge page lifts downstream conversion by 30–80% vs direct link", zoho: "UTM source captured | Opt-in optional but recommended to tag the pre-framed contact" },
      { label: "REDIRECT TO OFFER", desc: "CTA sends them to the final offer page (yours or an affiliate). They arrive warm and pre-framed.", color: "#34d399", icon: "➡️", cr: "3–8% of bridge page visitors purchase the downstream offer", zoho: "Affiliate link tracking → purchase event → RET sequence (if your offer) or affiliate commission record" },
    ],
    critical_rule: "The bridge video must be authentic and specific to your audience's context. Generic bridge pages don't work. 'I use this product and here's exactly why someone like you would benefit' is the structure. It must feel like a personal recommendation, not a pre-roll ad.",
    fits: ["cold-reach", "warm-conversion"],
    when_to_use: "Whenever you're driving traffic to an offer page you don't control. Whenever there's a context gap between where people are coming from and where you're sending them.",
    when_not_to_use: "Not needed when you control both the traffic source and the offer page and they're already well-aligned.",
  },
  {
    id: "evergreen_webinar",
    name: "EVERGREEN / AUTO WEBINAR FUNNEL",
    subtitle: "Automated 24/7 Webinar Running Without You",
    icon: "🌿",
    hex: "#38bdf8",
    category: "trust-building",
    product_fit: ["digital","mid_ticket","community"],
    origin: "The automation evolution of the live webinar — a recorded webinar presentation that runs on autopilot, available at any hour, at any scale, without the host being present.",
    best_for: "Scaling a proven live webinar without the ongoing time commitment. Generating leads and sales 24/7 from paid or organic traffic. Any market where the live webinar has been validated first.",
    complexity: "MEDIUM",
    time_to_build: "1–2 weeks (requires a proven live webinar recording first)",
    min_budget: "$500/mo paid traffic to generate sufficient volume to make automation worthwhile",
    stages: [
      { label: "REGISTRATION PAGE", desc: "Simulated live urgency: 'Starting soon', 'Join today's session'. Pick your preferred time.", color: "#94a3b8", icon: "📥" },
      { label: "AUTOMATED WEBINAR", desc: "Pre-recorded but presented as near-live. Simulated comments, progress restriction, and real-time CTAs. Chat engagement is pre-scripted.", color: "#38bdf8", icon: "📺", cr: "30–50% of registrants attend the 'live' session", zoho: "Attendance tracking → Lead_Score | CTA click → SOL sequence | No-show → replay email 24hr after" },
      { label: "CTA + ORDER PAGE", desc: "Offer appears during and after the webinar as in a live session. Urgency timer is personal (48 hrs from registration).", color: "#34d399", icon: "💳", cr: "2–6% of attendees convert — similar to live with good simulation", zoho: "Purchase → RET sequence | Non-buyers → 5-email follow-up sequence | CON for long-term non-buyers" },
      { label: "REPLAY SEQUENCE", desc: "Automated replay email for non-attendees with 48-hour replay access window.", color: "#f59e0b", icon: "📧", cr: "20–30% of non-attendees watch the replay", zoho: "Replay access link tracked | Replay viewer behavior segmented → SOL push if high engagement" },
    ],
    critical_rule: "Only automate a webinar that has been proven live. Automating a webinar that doesn't convert live is just running a poor-converting funnel at scale. The live version is the test — the evergreen version is the scale vehicle. Also: disclose that it's a recording if directly asked — claiming a 2-year-old recording is 'live' is deceptive.",
    fits: ["warm-conversion"],
    when_to_use: "After you've run a live webinar 3+ times and it consistently converts. When you want to scale webinar-driven revenue without ongoing personal time investment.",
    when_not_to_use: "Never before validating the live version. Not for industries with strict regulations about event advertising.",
  },

  // ─── HIGH-TICKET FUNNELS ──────────────────────────────────────────────────
  {
    id: "book_a_call",
    name: "BOOK A CALL FUNNEL",
    subtitle: "Direct Calendar Link — Minimum Friction",
    icon: "📅",
    hex: "#a78bfa",
    category: "high-ticket",
    product_fit: ["high_ticket","mid_ticket","local"],
    origin: "The simplest high-ticket conversion mechanism — eliminate every step between interest and calendar. Works when your brand is already well-known to the prospect.",
    best_for: "Warm audiences who already know, like, and trust you. Referrals. Organic social followers. Retargeted paid traffic. Anyone who has already consumed significant content from you.",
    complexity: "LOW",
    time_to_build: "1 day (a landing page + Zoho Bookings integration)",
    min_budget: "Zero — relies on warm organic traffic",
    stages: [
      { label: "TRAFFIC", desc: "Warm: referrals, organic social, email list, retargeting", color: "#94a3b8", icon: "📡" },
      { label: "SHORT LANDING PAGE", desc: "Who this is for. What happens on the call. What they'll leave with. What the call is NOT (not a pitch, a strategy session). Direct calendar embed.", color: "#a78bfa", icon: "📄", cr: "20–40% of warm visitors book", zoho: "Booking via Zoho Bookings → CRM lead created → Show_Up_Sequence triggered (3 reminder emails/SMS)" },
      { label: "CONFIRMATION + REMINDERS", desc: "Instant confirmation email. 24-hour reminder. 1-hour SMS. Pre-call 'homework' email optional.", color: "#38bdf8", icon: "📧", cr: "Show-up rate 60–75% with proper reminders", zoho: "SOL_ShowUp_Sequence automated | Zoho CRM deal stage = Call Booked" },
      { label: "SALES CALL", desc: "20–45 min. Discovery → diagnosis → prescription → close.", color: "#34d399", icon: "📞", cr: "20–40% close rate for well-qualified warm calls", zoho: "Outcome logged in CRM | Won → RET_Onboarding | Lost → CON_Long_Term_Nurture | Follow-up sequence if undecided" },
    ],
    critical_rule: "The 'Book a Call' page must clearly set expectations for what the call is. 'Free strategy session' language is so overused that it's now ignored. Be specific: 'We'll spend 30 minutes mapping your current workflow gaps and you'll leave with a prioritised action plan — whether you work with us or not.'",
    fits: ["hot-value", "warm-conversion"],
    when_to_use: "For warm audiences. As the CTA in email nurture sequences. On your website for people already researching you. In sales DMs after initial qualification.",
    when_not_to_use: "Do not send cold traffic to a bare booking page — show rate will be 15–25%. Cold traffic needs an Application or VSL funnel first.",
  },
  {
    id: "strategy_session",
    name: "STRATEGY SESSION FUNNEL",
    subtitle: "Position the Call Itself as the Deliverable",
    icon: "🎯",
    hex: "#a78bfa",
    category: "high-ticket",
    product_fit: ["high_ticket","mid_ticket","local"],
    origin: "A positioning evolution of the consultation call — instead of 'free sales call', the strategy session is positioned as a paid-value deliverable that just happens to be free. The call itself becomes the product.",
    best_for: "Service businesses where the consultation genuinely delivers value. Consultants, coaches, and implementation businesses where the diagnosis IS the differentiating service.",
    complexity: "LOW-MEDIUM",
    time_to_build: "1 week (session page + prep framework + call script + post-call follow-up)",
    min_budget: "Zero — works on organic warm traffic",
    stages: [
      { label: "TRAFFIC", desc: "Warm organic content, LinkedIn, email, referrals", color: "#94a3b8", icon: "📡" },
      { label: "SESSION PAGE", desc: "Positioned not as a call but as a 45-minute strategy session with a tangible deliverable. 'You will leave with X' — something concrete, e.g. a workflow map, a funnel audit, a 90-day growth plan.", color: "#a78bfa", icon: "📄", cr: "25–45% of warm visitors book", zoho: "Booking → CRM lead → Pre-Session_Homework email sent | Session tagged as SOL_Strategy_Session" },
      { label: "PRE-SESSION PREP", desc: "Send a brief questionnaire or 'homework' 24 hours before. This serves two purposes: pre-frames the conversation and filters out low-commitment leads who won't complete it.", color: "#38bdf8", icon: "📝", cr: "50–70% of bookers complete pre-session prep (quality signal)", zoho: "Homework completion → CRM note | Non-completers get a reminder + option to reschedule" },
      { label: "THE SESSION", desc: "Deliver genuine value — do the diagnosis. Don't pitch until you've delivered the strategic insight you promised. The pitch emerges naturally: 'This is what we'd do. If you'd like us to do it for you, here's how we work.'", color: "#34d399", icon: "📞", cr: "30–50% convert for well-run sessions with pre-qualified attendees", zoho: "Post-call: deal created | Won → RET_Onboarding | Not yet → SOL_Follow_Up_Sequence_1.0" },
    ],
    critical_rule: "The session must deliver the strategic insight you promised — even if they don't hire you. If the call is nothing but a pitch disguised as a strategy session, word gets around and your booking rate collapses. Deliver genuine value. The conversion is a natural result, not the manufactured goal.",
    fits: ["hot-value", "warm-conversion"],
    when_to_use: "For service businesses where the consultation itself demonstrates your expertise. When you want to differentiate from competitors who offer 'free calls'.",
    when_not_to_use: "Not for low-ticket offers where a 45-minute session is disproportionate to the sale. Not for high-volume lead generation where you can't personally deliver quality sessions.",
  },

  // ─── RETENTION & ASCENSION FUNNELS ───────────────────────────────────────
  {
    id: "upsell_funnel",
    name: "UPSELL FUNNEL",
    subtitle: "One-Click Next-Level Offer Immediately Post-Purchase",
    icon: "⬆️",
    hex: "#f472b6",
    category: "retention",
    product_fit: ["digital","ecommerce","mid_ticket","high_ticket","saas"],
    origin: "The post-purchase upsell is the highest-ROI moment in any funnel — a customer who just said yes is in maximum trust and purchase momentum. Presenting a complementary upgrade at this moment costs zero to acquire.",
    best_for: "Any business with multiple products or service tiers. The upsell stack should be planned before the front-end offer launches. The front-end exists to create upsell opportunities.",
    complexity: "LOW",
    time_to_build: "2–3 days (upsell page + one-click order integration)",
    min_budget: "Zero — adds revenue to existing purchases",
    stages: [
      { label: "INITIAL PURCHASE", desc: "Front-end offer is purchased. This triggers the upsell sequence.", color: "#94a3b8", icon: "💳" },
      { label: "UPSELL PAGE", desc: "Immediately after purchase. 'Wait — before you go, this one-time offer is available only right now.' Natural extension of what they just bought. One-click purchase (no re-entering payment details).", color: "#f472b6", icon: "⬆️", cr: "15–30% of buyers accept the upsell", zoho: "Upsell accepted → deal value updated | Tag: Upsell_1_Accepted | RET_Premium_Buyer sequence" },
      { label: "DOWNSELL (IF DECLINED)", desc: "If they decline the upsell, present a stripped-down version at a lower price before they leave.", color: "#f59e0b", icon: "↘️", cr: "10–15% of upsell-decliners accept the downsell", zoho: "Downsell accepted → deal value updated | Both paths tagged separately for analytics" },
      { label: "POST-PURCHASE SEQUENCE", desc: "Deliver on the purchase. Begin onboarding. Introduce the next tier at the right moment (after first success).", color: "#34d399", icon: "🎯", cr: "Ongoing LTV building", zoho: "RET_Welcome_Client sequence | Next-tier introduction built into onboarding sequence" },
    ],
    critical_rule: "The upsell must be a natural next step — not a random add-on. It should make the thing they just bought MORE valuable or MORE complete. The question to ask: 'If they just bought X, what would make X work better or faster?' That's your upsell.",
    fits: ["hot-value", "warm-conversion"],
    when_to_use: "Always — every purchase should be followed by an upsell. This is not optional. A funnel without an upsell stack is leaving 25–50% of available revenue on the table.",
    when_not_to_use: "Do not present upsells that are unrelated to the initial purchase — this feels predatory and increases refund rates.",
  },
  {
    id: "downsell_funnel",
    name: "DOWNSELL FUNNEL",
    subtitle: "Save the Sale When They Decline the Primary Offer",
    icon: "↘️",
    hex: "#f472b6",
    category: "retention",
    product_fit: ["digital","ecommerce","mid_ticket"],
    origin: "A conversion recovery mechanism — when someone says no to an offer, present a smaller or stripped-down version rather than losing them entirely.",
    best_for: "Recovering revenue from price-sensitive prospects. Testing which elements of your offer drive the buying decision. Understanding where price resistance lives in your funnel.",
    complexity: "LOW",
    time_to_build: "1–2 days",
    min_budget: "Zero — conversion layer on existing funnel",
    stages: [
      { label: "DECLINED OFFER", desc: "Prospect said no to primary offer or upsell.", color: "#94a3b8", icon: "✗" },
      { label: "DOWNSELL PAGE", desc: "Appear immediately on click of 'No thanks'. Acknowledge the decline. Offer a stripped-down version: smaller scope, shorter duration, or a core module of the full program.", color: "#f472b6", icon: "↘️", cr: "10–20% of decliners accept the downsell", zoho: "Downsell accepted → deal created at lower value | Downsell_Buyer tag | Ascension sequence begins" },
      { label: "ASCENSION SEQUENCE", desc: "From the downsell, systematically present the full offer over 30–60 days once they've experienced partial value.", color: "#34d399", icon: "📈", cr: "20–35% of downsell buyers ascend to full offer within 90 days", zoho: "RET_Downsell_Ascension_Sequence | Milestone-triggered upsell to full offer" },
    ],
    critical_rule: "Never present a downsell before a clear 'no' — presenting it too early (before they've declined) creates cognitive dissonance and can reduce primary offer conversion. The downsell is a recovery mechanism, not a first option.",
    fits: ["warm-conversion", "hot-value"],
    when_to_use: "After every upsell that has a price-sensitivity problem. As a floor offer for people who respond to your content but aren't ready for your primary offer.",
    when_not_to_use: "Do not use for high-ticket service offerings — a downsell on a $5K offer to a $500 alternative confuses positioning. Use a waitlist or 'not yet' nurture sequence instead.",
  },
  {
    id: "cross_sell_funnel",
    name: "CROSS-SELL FUNNEL",
    subtitle: "Offer Complementary Products to Existing Buyers",
    icon: "↔️",
    hex: "#f472b6",
    category: "retention",
    product_fit: ["ecommerce","digital","mid_ticket","saas"],
    origin: "Amazon pioneered 'customers who bought this also bought' — applied to funnels, cross-selling suggests a different (not upgraded) product that solves an adjacent problem the buyer has.",
    best_for: "Businesses with a product catalogue. Ecommerce. Digital product suites. SaaS with multiple modules. Any business where buyers have multiple, adjacent needs.",
    complexity: "LOW-MEDIUM",
    time_to_build: "3–5 days per cross-sell sequence",
    min_budget: "Zero — email-based to existing buyer list",
    stages: [
      { label: "PURCHASE TRIGGER", desc: "Initial product is purchased — this identifies which adjacent problem to address next.", color: "#94a3b8", icon: "💳" },
      { label: "CROSS-SELL IDENTIFICATION", desc: "Map your product matrix: if they bought X, what adjacent Y would logically serve them next? Not an upgrade — a complement.", color: "#38bdf8", icon: "🗺️", cr: "Planning stage — defines the sequence", zoho: "Purchase tags drive segment routing → correct cross-sell sequence triggered automatically" },
      { label: "CROSS-SELL EMAIL SEQUENCE", desc: "3–5 emails. Don't pitch immediately — first establish value from their initial purchase, then introduce the complementary offer naturally.", color: "#f472b6", icon: "📧", cr: "5–15% of buyers purchase the cross-sell within 30 days", zoho: "RET_Cross_Sell_[product]_Sequence in Zoho Campaigns | Personalized by initial purchase tag" },
      { label: "POST-CROSS-SELL", desc: "Buyers now have two products — identify the next logical cross-sell or introduce continuity.", color: "#34d399", icon: "🔄", cr: "Compounding LTV — each cross-sell multiplies future revenue potential", zoho: "Multi-purchase buyers tagged separately | Higher LTV score → premium treatment flag" },
    ],
    critical_rule: "Cross-sells must be genuinely complementary — not just 'we also sell this'. The recommendation must feel like 'given that you're using X, Y would make X better/faster/easier'. Without this logical connection, cross-sell rates collapse and you risk unsubscribes from buyers who feel spammed.",
    fits: ["hot-value", "warm-conversion"],
    when_to_use: "As an automated sequence triggered by every purchase. Particularly valuable for ecommerce and digital product catalogues where buyers frequently return.",
    when_not_to_use: "Not relevant for single-product businesses. Do not cross-sell unrelated products to buyers — irrelevant recommendations destroy trust faster than any other error.",
  },
  {
    id: "membership_continuity",
    name: "MEMBERSHIP / CONTINUITY FUNNEL",
    subtitle: "Recurring Revenue Through Ongoing Value Delivery",
    icon: "♾️",
    hex: "#f472b6",
    category: "retention",
    product_fit: ["digital","community","saas","mid_ticket"],
    origin: "The most stable revenue model in digital business — monthly recurring revenue (MRR) from a membership or subscription that delivers ongoing value justifying the recurring charge.",
    best_for: "Businesses where ongoing access, community, or content has clear ongoing value. Any business wanting predictable recurring revenue rather than feast-and-famine launch cycles.",
    complexity: "HIGH",
    time_to_build: "4–6 weeks (platform setup + content library + onboarding + ongoing delivery)",
    min_budget: "$500/mo to build and maintain the platform and content production",
    stages: [
      { label: "ENTRY MECHANISM", desc: "A membership is sold through a Surfboard, Webinar, or Challenge funnel. The front-end funnel generates the member.", color: "#94a3b8", icon: "🚪" },
      { label: "ONBOARDING SEQUENCE", desc: "Critical: first 14 days determine whether they stay or cancel. Clear 'quick win' in Day 1. Community engagement in Week 1. Progress milestone in Week 2.", color: "#f472b6", icon: "🎯", cr: "Members who achieve a meaningful outcome in Week 1 have 3–4x longer retention", zoho: "RET_Member_Onboarding_Sequence | Milestone-triggered emails | Community activity monitored for churn signals" },
      { label: "ONGOING VALUE DELIVERY", desc: "Monthly content, live calls, Q&A, resources. Consistent delivery rhythm that members can predict and rely on.", color: "#38bdf8", icon: "📦", cr: "Average membership churn: 5–10%/month. Target: below 5%.", zoho: "Monthly content delivery sequence | Engagement scoring | At-risk members (low engagement 30+ days) → retention intervention" },
      { label: "CHURN PREVENTION SYSTEM", desc: "Automated: identify low-engagement members before they cancel. Trigger re-engagement at 30-day silence. Personal outreach for long-term members considering cancel.", color: "#34d399", icon: "🛡️", cr: "Proactive churn prevention reduces cancellations by 20–40%", zoho: "Lead_Score decay signal → Retention_Intervention sequence | Pause option before cancel" },
    ],
    critical_rule: "Retention is the entire business model. Acquisition brings them in, but the product and ongoing delivery is what makes the revenue real. Most membership failures stem from excellent acquisition and poor delivery. Calculate your LTV at current churn rates before spending on acquisition — if average retention is 3 months, a $97/month member is only worth $291, which limits acquisition cost severely.",
    fits: ["warm-conversion", "hot-value"],
    when_to_use: "When you have content or community that genuinely delivers ongoing value. When your revenue predictability is your biggest business constraint.",
    when_not_to_use: "Do not start a membership before you have a proven one-time offer. You need to know your audience's problems deeply before promising ongoing monthly value.",
  },
  {
    id: "reengagement_funnel",
    name: "RE-ENGAGEMENT FUNNEL",
    subtitle: "Win Back Inactive Subscribers and Lapsed Customers",
    icon: "🔁",
    hex: "#f472b6",
    category: "retention",
    product_fit: ["digital","saas","community","mid_ticket","high_ticket","local"],
    origin: "Email deliverability and list health is the invisible constraint of all email-based funnels. A re-engagement sequence simultaneously reactivates buyers AND removes dead weight that harms deliverability.",
    best_for: "Any business with a list that has been quiet for 60+ days. Critical for maintaining email deliverability scores. Often the highest-ROI campaign in a mature business because the list is already paid for.",
    complexity: "LOW",
    time_to_build: "3–5 days",
    min_budget: "Zero — email-based campaign",
    stages: [
      { label: "IDENTIFY DORMANT CONTACTS", desc: "Segment: no email open in 60 days (warm list) or no purchase in 90–180 days (buyer list).", color: "#94a3b8", icon: "🔍", cr: "Typically 30–50% of any mature list is dormant", zoho: "Zoho Campaigns segmentation → contacts with Lead_Score decay + no open in 60 days | Tagged: Re_Engagement_Needed" },
      { label: "RE-ENGAGEMENT EMAIL 1 — CURIOSITY", desc: "Subject line designed purely for opens: 'Are you still there?', 'I've been meaning to ask you something', 'Quick question'. No pitch. One line: a genuine question about where they are.", color: "#f472b6", icon: "❓", cr: "5–15% open rate on a cold dormant segment (this is expected — you're fishing for the re-engageable minority)", zoho: "Open → Lead_Score reset | CON_Reengagement_Active sequence | No open → Email 2 triggered Day 5" },
      { label: "RE-ENGAGEMENT EMAIL 2 — VALUE", desc: "For non-openers after email 1: deliver a piece of genuine value with a different subject line. No ask. Just give.", color: "#38bdf8", icon: "🎁", cr: "10–20% of email 1 non-openers open email 2", zoho: "Open = re-engaged, resume CON nurture | No open → Email 3 (breakup email)" },
      { label: "BREAKUP EMAIL", desc: "'I'm going to stop emailing you unless you want me to continue.' This is the highest-open email of any sequence — the fear of being removed drives clicks.", color: "#34d399", icon: "💔", cr: "15–30% click to stay; remove everyone who doesn't", zoho: "Non-clickers after breakup → Unsubscribe or Suppressed tag | Removed from all future sends | List health improves immediately" },
    ],
    critical_rule: "Remove the truly unengaged. It feels painful to remove 20–40% of your list, but keeping them destroys your deliverability scores, lowers open rates across your whole list, and means your campaigns reach fewer of your engaged contacts. A clean list of 2,000 engaged subscribers delivers more revenue than a bloated list of 10,000 with 8,000 dead contacts.",
    fits: ["cold-reach", "warm-conversion", "hot-value"],
    when_to_use: "Every 6 months as list hygiene maintenance. Immediately when email open rates drop below 15%. Before any major launch campaign to maximise deliverability.",
    when_not_to_use: "Not needed for brand new lists. Do not re-engage people who explicitly unsubscribed — this violates GDPR/CAN-SPAM regulations.",
  },

  // ─── RELATIONSHIP / NETWORK FUNNELS ──────────────────────────────────────
  {
    id: "client_referral",
    name: "CLIENT REFERRAL FUNNEL",
    subtitle: "Systematic System to Turn Happy Clients into Active Referrers",
    icon: "🌟",
    hex: "#fb923c",
    category: "relationship",
    product_fit: ["high_ticket","mid_ticket","local","saas"],
    origin: "The oldest lead generation mechanism — word of mouth. Made systematic: rather than waiting for referrals to happen organically, a client referral funnel creates the right conditions and moments for referrals to naturally occur.",
    best_for: "Service businesses where client satisfaction is high. High-ticket offers where a personal recommendation from a peer dramatically shortens the sales cycle. Local businesses built on community trust.",
    complexity: "LOW",
    time_to_build: "1 week (referral process + templates + incentive structure)",
    min_budget: "Zero — powered by relationships",
    stages: [
      { label: "IDENTIFY IDEAL REFERRERS", desc: "Your best referral sources are clients who: (1) achieved a clear, measurable outcome, (2) are happy to talk about it, and (3) are embedded in a community of similar prospects.", color: "#94a3b8", icon: "🔍" },
      { label: "REFERRAL MOMENT", desc: "The optimal time to ask for a referral: immediately after a client achieves their first major win. Not at contract signing. Not at project end. At the moment of delight.", color: "#fb923c", icon: "✨", cr: "60–80% say yes to a referral request when asked at the right moment", zoho: "Milestone trigger in CRM → Referral_Request sequence triggered | Zoho CRM milestone tracking" },
      { label: "REFERRAL TOOLKIT", desc: "Give them a template to make the introduction easy. A pre-written email/DM they can customise. A one-page summary of who you help and what outcome you deliver. Remove every friction point.", color: "#38bdf8", icon: "🧰", cr: "Clients with a toolkit refer 3–4x more frequently than those given a verbal ask", zoho: "Toolkit delivery automated | Referral tracking link assigned per client | Source attribution in CRM" },
      { label: "FOLLOW-UP + GRATITUDE", desc: "Close the loop: tell them what happened with their referral. Thank them regardless of outcome. Small genuine token of appreciation (not a commission — a gesture) for successful referrals.", color: "#34d399", icon: "🙏", cr: "Clients who receive follow-up on their referrals refer again 2–3x more often", zoho: "Referral outcome logged | Gratitude sequence automated | Referring client tagged: Champion | Future referral cadence set at 90-day intervals" },
    ],
    critical_rule: "Never ask for a referral before the client has achieved a meaningful result. Asking for a referral from an unhappy or neutral client is the surest way to make them quieter. The referral ask is a confidence indicator — asking it implicitly says 'we're proud of what we've done for you'. Make sure you are.",
    fits: ["hot-value", "warm-conversion"],
    when_to_use: "As soon as you have 3+ happy clients with measurable outcomes. Should run permanently as a background system in your CRM.",
    when_not_to_use: "Do not launch a referral program before you have clear client results. Do not use financial incentives with clients who may be in professional services with referral-fee restrictions (accountants, lawyers, financial advisors).",
  },
  {
    id: "affiliate_funnel",
    name: "AFFILIATE PROGRAM FUNNEL",
    subtitle: "Recruit External Promoters on Commission",
    icon: "🤝",
    hex: "#fb923c",
    category: "relationship",
    product_fit: ["digital","mid_ticket","saas","community","ecommerce"],
    origin: "Performance-based marketing at its purest — affiliates promote your offer to their audience in exchange for a percentage of revenue. Your acquisition cost is paid only on success.",
    best_for: "Digital products and SaaS where referral tracking is clean and margins support commission (typically 20–50% for digital, 5–15% for physical). Scaling distribution without scaling team size.",
    complexity: "MEDIUM",
    time_to_build: "2–3 weeks (affiliate portal + tracking + recruitment + onboarding)",
    min_budget: "Zero net cost — commissions paid from revenue generated",
    stages: [
      { label: "AFFILIATE RECRUITMENT", desc: "Identify potential affiliates: existing customers who love your product, content creators in your niche, complementary service providers. Warm outreach only — cold affiliate pitches rarely convert.", color: "#94a3b8", icon: "🔍" },
      { label: "AFFILIATE APPLICATION + APPROVAL", desc: "Application page. Review for audience fit and quality. Approve selectively — a small number of high-quality affiliates outperforms a large number of low-quality ones.", color: "#fb923c", icon: "📋", cr: "10–20% of approached prospects become active affiliates", zoho: "Affiliate portal (Zoho Commerce affiliate module or 3rd party) | Unique tracking links per affiliate" },
      { label: "AFFILIATE ONBOARDING KIT", desc: "Swipe files (email templates, social captions, ad copy). Tracking links. Commission structure. Payout schedule. FAQ. The more complete the kit, the more they promote.", color: "#38bdf8", icon: "🧰", cr: "Affiliates with onboarding kits generate 4–6x more revenue than those without", zoho: "Onboarding automated | Promotional calendar shared | Monthly affiliate newsletter" },
      { label: "ONGOING ACTIVATION", desc: "Most affiliates promote once and stop. Active management, monthly promotion windows, and new creative assets keep them producing consistently.", color: "#34d399", icon: "📈", cr: "Top 20% of affiliates generate 80% of revenue — focus activation energy on these", zoho: "Affiliate performance dashboard | Automated commission payout tracking | Top-affiliate recognition program" },
    ],
    critical_rule: "Affiliate quality matters more than affiliate quantity. 1 affiliate with a list of 10,000 engaged buyers outperforms 100 affiliates with 100 unengaged followers. Vet for audience quality and genuine alignment with your offer before approving. A poor-fit affiliate promoting your product to the wrong audience can damage your brand.",
    fits: ["cold-reach", "warm-conversion"],
    when_to_use: "After you have a proven, converting funnel. After you have a clear affiliate commission structure that is financially viable. After you have promotional materials ready.",
    when_not_to_use: "Do not launch an affiliate program before your own funnel converts consistently — affiliates will send traffic and see poor results, then never promote again. Your funnel must be proven first.",
  },
];

// Which funnels to recommend given (market + constraint)
const FUNNEL_RECOMMENDATIONS = {
  "cold-reach":     { primary: "surfboard", secondary: ["challenge", "nurture", "referral_partnership", "squeeze_page", "lead_magnet"], note: "Your cold audience needs the simplest path first. Start with Surfboard to validate your offer organically, run the Email Nurture Funnel in parallel to every opt-in, and start building Referral Partnerships simultaneously — they compound over time and cost nothing but effort.",
    product_override: {
      saas: { primary: "reverse_squeeze", note: "For SaaS, let prospects experience value before asking for anything. A reverse squeeze page with a free tool or demo video builds trust faster than a traditional opt-in gate." },
      ecommerce: { primary: "free_plus_shipping", note: "For ecommerce, get a physical product into their hands. A free + shipping offer or low-cost tripwire builds a buyer list — a buyer is psychologically different from a lead." },
      local: { primary: "squeeze_page", note: "For local services, the shortest path to a call or booking wins. A simple squeeze page with a strong local offer and prominent phone number/form converts best." },
      high_ticket: { primary: "lead_magnet", note: "For high-ticket services, build authority first. A high-value lead magnet that demonstrates your methodology starts the trust-building process that eventually leads to a sales call." },
    }
  },
  "warm-conversion":{ primary: "webinar", secondary: ["surfboard", "tripwire", "nurture", "vsl_prequalification", "evergreen_webinar"], note: "A warm audience that isn't converting needs trust compression. The Webinar Funnel works for mid-ticket. If your offer is $2K+, the VSL Pre-Qualification Funnel pre-sells before the call. Email Nurture runs in the background always.",
    product_override: {
      saas: { primary: "tripwire", note: "For SaaS, a low-cost entry tier or extended trial converts warm audiences who haven't committed yet. The tripwire funds acquisition while the product experience drives upgrades." },
      ecommerce: { primary: "slo_funnel", note: "For ecommerce, a self-liquidating offer on the front end covers ad spend while building a buyer list. Backend upsells and repeat purchase sequences generate the real profit." },
      local: { primary: "strategy_session", note: "For local services, position the consultation as the deliverable. A strategy session where the prospect leaves with genuine value converts warm local audiences at 30-50%." },
      high_ticket: { primary: "vsl_prequalification", note: "For high-ticket, the VSL does the selling before the call. Pre-qualified prospects close at 2-3x the rate of unqualified calls, and your calendar isn't filled with tire-kickers." },
    }
  },
  "hot-value":      { primary: "application", secondary: ["vsl_prequalification", "tripwire", "referral_partnership", "book_a_call"], note: "A hot audience needs a qualification mechanism before your high-ticket offer — the Application Funnel or VSL Pre-Qualification Funnel depending on whether you want to pre-sell before the call.",
    product_override: {
      saas: { primary: "book_a_call", note: "For SaaS with hot leads, get them on a demo call immediately. They've already evaluated the product — now they need a human to close the enterprise deal or answer final questions." },
      ecommerce: { primary: "flash_sale", note: "For ecommerce with hot audiences, a time-limited offer with real urgency converts fence-sitters. Flash sales to engaged buyer lists generate 5-15% conversion in 48 hours." },
      local: { primary: "book_a_call", note: "For hot local leads, remove all friction. A direct booking page with strong social proof and a clear CTA gets them on your calendar before they call a competitor." },
      digital: { primary: "limited_time_offer", note: "For digital products with hot audiences, deadline-driven urgency converts. A limited-time offer with genuine scarcity typically generates 2-4x the conversion rate of the same offer without urgency." },
    }
  },
};

const COMPLEXITY_COLOR = { "LOW": "#34d399", "LOW-MEDIUM": "#38bdf8", "MEDIUM": "#f59e0b", "MEDIUM-HIGH": "#f472b6", "HIGH": "#f87171" };

// Relevance scoring: given user's selections, score every funnel
// Returns: "primary" | "recommended" | "relevant" | "low"
const RELEVANCE_CONFIG = {
  primary:     { label: "⭐ MOST RELEVANT",      color: "#34d399", border: "#34d399", bg: "rgba(52,211,153,0.07)",  dimmed: false },
  recommended: { label: "✓ RELEVANT",             color: "#38bdf8", border: "#38bdf8", bg: "rgba(56,189,248,0.05)",  dimmed: false },
  relevant:    { label: "◈ WORTH CONSIDERING",    color: "#f59e0b", border: "#f59e0b", bg: "rgba(245,158,11,0.04)",  dimmed: false },
  low:         { label: "— NOT RELEVANT",         color: "#94a3b8", border: "#1e2a38", bg: "rgba(255,255,255,0.01)", dimmed: true  },
};

function getFunnelRelevance(funnel, { productType, constraint, audience }) {
  let score = 0;

  // Map full product type IDs to the short names used in funnel product_fit arrays
  const PRODUCT_SHORT = {
    high_ticket_service: "high_ticket",
    mid_ticket_service: "mid_ticket",
    low_ticket_digital: "digital",
    ecommerce: "ecommerce",
    saas: "saas",
    local_service: "local",
    community_membership: "community",
  };
  const shortProduct = PRODUCT_SHORT[productType] || productType;
  if (funnel.product_fit?.includes(shortProduct)) score += 3;

  // Map constraint IDs to the keys used in funnel fits arrays and FUNNEL_RECOMMENDATIONS
  const CONSTRAINT_MAP = {
    reach: "cold-reach",
    conversion: "warm-conversion",
    value: "hot-value",
  };
  const mappedConstraint = CONSTRAINT_MAP[constraint] || constraint;
  if (funnel.fits?.includes(mappedConstraint)) score += 2;

  // Check for product-specific override in FUNNEL_RECOMMENDATIONS
  const rec = FUNNEL_RECOMMENDATIONS[mappedConstraint];
  if (rec) {
    const override = rec.product_override?.[shortProduct];
    if (override && override.primary === funnel.id) {
      score += 4; // Product-specific primary gets highest boost
    } else if (rec.primary === funnel.id) {
      score += 3; // Generic primary
    } else if (rec.secondary?.includes(funnel.id)) {
      score += 1;
    }
  }

  if (score >= 7) return "primary";
  if (score >= 4) return "recommended";
  if (score >= 2) return "relevant";
  return "low";
}

// Channel-aware relevance: combines base relevance with channel affinity
function getChannelFunnelRelevance(funnel, channelId, { productType, constraint, audience }) {
  const baseRelevance = getFunnelRelevance(funnel, { productType, constraint, audience });
  const affinity = CHANNEL_FUNNEL_AFFINITY[channelId] || [];
  if (!affinity.includes(funnel.id)) {
    if (baseRelevance === "primary" || baseRelevance === "recommended") return "relevant";
    return "low";
  }
  return baseRelevance;
}

// Get all available funnels for an audience mode, scored and sorted
function getFunnelsForAudienceMode(audienceModeId, { productType, constraint }) {
  const channelIds = MODE_CHANNELS[audienceModeId] || [];
  // Collect unique funnel IDs across all channels for this mode
  const funnelIdSet = new Set();
  const funnelChannelMap = {}; // funnelId → preferred channelId
  channelIds.forEach(chId => {
    const affinity = CHANNEL_FUNNEL_AFFINITY[chId] || [];
    affinity.forEach(fId => {
      if (!funnelIdSet.has(fId)) {
        funnelIdSet.add(fId);
        funnelChannelMap[fId] = chId; // first channel = preferred
      }
    });
  });
  // Look up funnel objects, score, sort
  const order = { primary: 0, recommended: 1, relevant: 2, low: 3 };
  const results = [];
  funnelIdSet.forEach(fId => {
    const funnel = FUNNELS.find(f => f.id === fId);
    if (!funnel) return;
    const rel = getFunnelRelevance(funnel, { productType, constraint, audience: audienceModeId });
    if (rel !== "low") {
      results.push({ funnel, rel, channelId: funnelChannelMap[fId] });
    }
  });
  results.sort((a, b) => order[a.rel] - order[b.rel]);
  return results;
}

// Generates channel-specific implementation guidance for a funnel
// so "nurture" on WhatsApp talks about messages, not emails
function getChannelFunnelGuidance(funnel, channelId) {
  const ch = CHANNEL_STRATEGIES.find(c => c.id === channelId);
  if (!ch) return null;

  // Channel-specific stage verb mapping
  const channelVerbs = {
    email:          { send: "Send an email", sequence: "email sequence", message: "email", open: "Open rate", cta: "Click the link", list: "email list", platform: "Zoho Campaigns / MA" },
    sms:            { send: "Send an SMS", sequence: "SMS drip", message: "text message", open: "Open rate (98%)", cta: "Tap the link", list: "SMS subscriber list", platform: "Zoho SMS / Twilio" },
    whatsapp:       { send: "Send a WhatsApp message", sequence: "WhatsApp conversation flow", message: "WhatsApp message", open: "Read rate (98%)", cta: "Reply or tap the link", list: "WhatsApp broadcast list", platform: "Zoho WhatsApp / WhatsApp Business API" },
    social_dm:      { send: "Send a DM", sequence: "DM conversation sequence", message: "direct message", open: "Reply rate", cta: "Reply to continue", list: "engaged followers", platform: "ManyChat / Inrō → Zoho CRM" },
    social_content: { send: "Post organic content", sequence: "content series", message: "post", open: "Reach / impressions", cta: "Comment keyword or link in bio", list: "social followers", platform: "Meta / LinkedIn / TikTok → Zoho MA" },
    paid_social:    { send: "Run a paid ad", sequence: "ad campaign sequence", message: "ad creative", open: "CTR (0.5–2%)", cta: "Click the ad CTA", list: "custom/lookalike audience", platform: "Meta Ads / Google Ads → Zoho MA" },
    sales_call:     { send: "Make a call", sequence: "call sequence", message: "call", open: "Connection rate", cta: "Book a follow-up", list: "qualified leads in CRM", platform: "Zoho CRM + Calendar" },
  };

  const v = channelVerbs[channelId] || channelVerbs.email;

  // Map each funnel stage to channel-contextual description
  const contextualStages = funnel.stages.map(stage => {
    let contextDesc = stage.desc;
    // Replace generic email language with channel-specific
    if (channelId !== "email") {
      contextDesc = contextDesc
        .replace(/\bemail(s)?\b/gi, v.message + (arguments[1] === "s" ? "s" : ""))
        .replace(/\bsend an email\b/gi, v.send.toLowerCase())
        .replace(/\bopen rate\b/gi, v.open.toLowerCase())
        .replace(/\bclick the link\b/gi, v.cta.toLowerCase())
        .replace(/\bemail list\b/gi, v.list);
    }
    return { ...stage, contextDesc };
  });

  return {
    channelName: ch.label,
    channelIcon: ch.icon,
    channelHex: ch.hex,
    verbs: v,
    contextualStages,
    deliveryTip: getDeliveryTip(funnel.id, channelId),
    frequency: ch.frequency,
  };
}

// Channel-specific delivery tips for common funnel types
function getDeliveryTip(funnelId, channelId) {
  const tips = {
    // Nurture funnel
    nurture: {
      email: "Run a 5–15 email welcome → value → conversion sequence. 4 value emails per 1 pitch. Plain text outperforms HTML for B2B.",
      whatsapp: "Run a personal check-in sequence via WhatsApp. Day 1: welcome + resource. Day 3: value tip. Day 7: soft ask. Keep messages conversational — never paste email copy into WhatsApp.",
      sms: "Use SMS as a re-engagement trigger, not a full nurture channel. Text when emails go unopened: 'Hey [Name], sent you something useful — check your inbox?'",
      social_dm: "Run a DM nurture by responding to story reactions and comments. Share value snippets, ask questions, build rapport before any pitch.",
      social_content: "Create a content series that mirrors your nurture sequence. Post 1: Problem awareness. Post 2: Framework. Post 3: Case study. Post 4: Offer. Repeat.",
    },
    // Surfboard funnel
    surfboard: {
      paid_social: "Traffic ad → landing page opt-in → immediate redirect to offer page → upsell page. UGC-style creative outperforms polished. Test 3–5 hooks.",
      social_content: "Bio link → opt-in page → offer redirect → upsell. Drive traffic with hook-based Reels/carousels. Use 'Comment [KEYWORD]' to trigger DM automation → opt-in.",
      social_dm: "DM a link to your opt-in page after qualifying with 1–2 questions. 'Sounds like [product] could help — want me to drop the link?'",
      email: "Send traffic to opt-in via broadcast email. Redirect immediately to offer page. Follow up non-buyers with a 3-email sequence.",
    },
    // Challenge funnel
    challenge: {
      social_content: "Promote the challenge via daily posts. Day 1 announcement Reel. Daily story updates. Engagement prompts in captions. Link in bio for registration.",
      paid_social: "Run registration ads to a challenge sign-up page. Retarget registrants who didn't attend with reminder ads. Use lookalike of registrants for scaling.",
      social_dm: "Personally invite engaged followers to join. 'We're running a free 5-day [topic] challenge — you'd be a perfect fit. Want the details?'",
      email: "Promote to your list with a 3-email launch sequence: announce → remind → last chance. Run daily challenge emails during the event.",
    },
    // Webinar funnel
    webinar: {
      email: "3-email invite sequence → reminder day-of → post-webinar replay + offer sequence. 75% teach, 25% offer. Follow up no-shows with replay link.",
      social_content: "Promote registration via carousel posts and Reels showing key insights. Use countdown stickers in stories. Post key quotes after the event.",
      paid_social: "Run registration ads optimised for conversions. Retarget registrants with reminder ads. Run post-webinar offer ads to attendees.",
      sales_call: "Webinar as the warm-up. Call registrants who watched >50% within 24 hours. Reference specific content they engaged with.",
    },
    // Application funnel
    application: {
      sales_call: "Application form → qualify → book strategy call → close on call. Never show price before the call. Call within 24 hours of application.",
      social_dm: "Qualify in DMs first: 'Tell me about your situation.' If fit, direct to application form. Follow up personally after submission.",
      whatsapp: "Send personalised WhatsApp after application: 'Got your application — looks like a great fit. Quick question before we schedule a call...'",
      paid_social: "Traffic ad → landing page (no price) → application form → call booking. Qualify with 5–7 form questions to filter serious prospects.",
    },
    // Tripwire funnel
    tripwire: {
      paid_social: "Low-cost offer ad ($7–$47) → checkout page → immediate upsell. Self-liquidating: ad spend should break even on the tripwire so backend is pure profit.",
      email: "Offer the tripwire to new subscribers after the welcome email. 'Before we start the course — this $17 toolkit makes everything 3x faster.'",
      social_content: "Tease the tripwire value in content. 'I put together a $17 [toolkit/template/guide] — link in bio.' Don't discount the value.",
    },
  };

  const funnelTips = tips[funnelId];
  if (funnelTips && funnelTips[channelId]) return funnelTips[channelId];

  // Generic fallback based on channel
  const fallbacks = {
    email: `Run this funnel's sequence as an email automation. Use Zoho MA for trigger-based sends. Follow the 4:1 value-to-pitch ratio.`,
    whatsapp: `Adapt this funnel for WhatsApp by keeping messages short, personal, and conversational. Use voice notes for warmth. Never paste email copy — write as if texting a colleague.`,
    sms: `Use SMS for time-sensitive triggers in this funnel. Keep under 160 characters. Link to landing pages for detail. Reserve SMS for warm/hot contacts only.`,
    social_dm: `Run this funnel through DMs by qualifying first, then sharing resources. Keep messages short — 1–2 sentences max. Earn each next message.`,
    social_content: `Promote this funnel via organic content. Use hooks in Reels/carousels to drive awareness. Link in bio for opt-in. Comment triggers for automated DM follow-up.`,
    paid_social: `Drive traffic to this funnel with paid ads. UGC-style creative for Meta/TikTok. Test 3–5 ad variations. Optimise for landing page views initially, then conversions.`,
    sales_call: `Use this funnel to qualify and warm prospects before the call. Reference their specific engagement. Call within 24 hours of their last action.`,
  };

  return fallbacks[channelId] || "Adapt this funnel's stages to the specific delivery channel.";
}


const STRATEGIES = {
  "cold-reach-zero": {
    title: "ORGANIC AWARENESS PLAY", surfboard: "Page 1 Only — validate before spending a dollar",
    stage: "AWR", campaign: "AWR-1.0A_ORGANIC_IG",
    utm: { source: "organic_ig", medium: "awareness", campaign: "AWR-1.0A_ORGANIC_IG", content: "hook_problem_pain", term: "smb_marketing_managers" },
    platforms: ["Instagram Organic", "TikTok Organic", "LinkedIn"], format: "VIDEO / CAROUSEL",
    headline: '"Are You Still Doing This Manually?"',
    cta: "Grab Your Free Resource",
    color: "#38bdf8", sequence: "AWR_Welcome_Series_1.0",
    when_to_change: "Version up when: 1,000+ impressions per post consistently OR engagement rate drops below 3%",
    tactics: ["Post 3–5x/week — problem-awareness content only", "Hook first in every piece — earn the scroll stop", "Lead magnet on Page 1: free checklist or template", "Track all bio links via UTM parameters"],
  },
  "cold-reach-small": {
    title: "PAID SOCIAL AWARENESS FUNNEL", surfboard: "Page 1 → AWR Email Sequence",
    stage: "AWR", campaign: "AWR-1.0A_META_VIDEO",
    utm: { source: "meta", medium: "awareness", campaign: "AWR-1.0A_META_VIDEO", content: "hook_wasted_time", term: "smb_marketing_managers" },
    platforms: ["Meta (FB/IG)", "TikTok"], format: "VIDEO (15–30s hook-led)",
    headline: '"Stop Wasting 10hrs/Week on Manual Workflows"',
    cta: "Download the Free Workflow Audit",
    color: "#38bdf8", sequence: "AWR_Welcome_Series_1.0",
    when_to_change: "Version 1.0 → 1.1: After 500 leads acquired OR 90 days active OR CPL increases 30%+",
    tactics: ["$15–30/day Meta video ads — broad interest targeting", "UGC-style creative outperforms polished on Meta", "Single CTA: opt-in only — one job per ad", "Redirect immediately to offer page after opt-in"],
  },
  "cold-reach-medium": {
    title: "MULTI-CHANNEL AWARENESS BLITZ", surfboard: "Page 1 + AWR Series + Retarget Loop",
    stage: "AWR", campaign: "AWR-1.0A_META_VIDEO + AWR-1.0A_GOOGLE_DISPLAY",
    utm: { source: "meta", medium: "awareness", campaign: "AWR-1.0A_META_VIDEO", content: "hook_competitor_angle", term: "smb_marketing_managers" },
    platforms: ["Meta", "Google Display", "TikTok", "YouTube 6s bumpers"], format: "VIDEO + DISPLAY + CAROUSEL",
    headline: '"Your Competitors Already Automate This"',
    cta: "Free Workflow Automation Assessment",
    color: "#38bdf8", sequence: "AWR_Welcome_Series_1.0 → AWR_Retarget_2.0",
    when_to_change: "After 1,000 leads or 4 months — A/B test AWR-1.0A vs AWR-1.0B new creative angle",
    tactics: ["Meta + TikTok for cold prospecting", "Google Display exclusively for retargeting warm visitors", "YouTube 6s bumpers for brand recall layer", "Full AWR email nurture on all opt-ins immediately"],
  },
  "warm-conversion-zero": {
    title: "ORGANIC TRUST-BUILDING SEQUENCE", surfboard: "Page 1 → CON Nurture Email",
    stage: "CON", campaign: "CON-1.0A_ORGANIC_IG",
    utm: { source: "organic_ig", medium: "consideration", campaign: "CON-1.0A_ORGANIC_IG", content: "case_study_60pct", term: "zoho_users" },
    platforms: ["LinkedIn", "Instagram", "Email (Zoho Campaigns)"], format: "CAROUSEL / LONG-FORM POST",
    headline: '"How [Client] Cut Admin by 60% — The Exact 3 Zoho Automations"',
    cta: "See the System → Book a Free Call to Map Yours",
    color: "#f59e0b", sequence: "CON_Nurturing_Sequence_1.0",
    when_to_change: "New version when email open rate drops below 25% OR sequence has run for 100+ contacts",
    tactics: ["Case study carousels: before/after with specific numbers", "Email: 3 value emails before every 1 pitch email", "Comparison content: productised systems vs hourly consulting", "Reply-bait questions in every email to build engagement"],
  },
  "warm-conversion-small": {
    title: "RETARGET-TO-CALL CONVERSION FUNNEL", surfboard: "Page 2 (VSL) → Book Call",
    stage: "SOL", campaign: "SOL-1.0A_META_VIDEO",
    utm: { source: "meta", medium: "solution", campaign: "SOL-1.0A_META_VIDEO", content: "testimonial_case_study", term: "zoho_users" },
    platforms: ["Meta Retargeting", "Email"], format: "VIDEO RETARGET + EMAIL",
    headline: '"Get Your Zoho Workflow Running in 30 Days — Guaranteed"',
    cta: "Book Your Free Strategy Call",
    color: "#f59e0b", sequence: "SOL_Conversion_Push_1.0",
    when_to_change: "Version up when call-booking rate drops below 3% OR after 60 days on same creative",
    tactics: ["Retarget AWR warm pixel audience only — not cold traffic", "VSL on Page 2: 10–15 mins, objection-handling focus", "Social proof heavy: case studies, numbers, before/after", "CTA: book the call — sell the call, not the service"],
  },
  "warm-conversion-medium": {
    title: "SEARCH INTENT + SOCIAL CONVERSION STACK", surfboard: "Google Search → Page 2 → Page 3",
    stage: "SOL", campaign: "SOL-1.0A_GOOGLE_SEARCH",
    utm: { source: "google", medium: "solution", campaign: "SOL-1.0A_GOOGLE_SEARCH", content: "demo_zoho_automation", term: "zoho_workflow_automation" },
    platforms: ["Google Search", "Meta Retargeting"], format: "SEARCH ADS + VIDEO RETARGET",
    headline: '"Zoho Workflow Automation — Implemented in 30 Days"',
    cta: "See Pricing & Book a Free Demo",
    color: "#f59e0b", sequence: "SOL_Conversion_Push_1.0",
    when_to_change: "New version when ROAS drops below 3x OR cost per acquisition increases 25%+",
    tactics: ["Google Search: exact + phrase match for high-intent keywords", "Competitor keyword campaigns: 'Zoho consultant alternative'", "Meta retargeting for Page 2 non-converters", "Price anchoring + ROI framing throughout Page 2"],
  },
  "hot-value-zero": {
    title: "REFERRAL + UPSELL ACTIVATION", surfboard: "Page 3 Upsell + Referral CTA",
    stage: "RET", campaign: "RET-1.0A_EMAIL",
    utm: { source: "email", medium: "retention", campaign: "RET-1.0A_EMAIL", content: "upsell_retainer_offer", term: "existing_buyers" },
    platforms: ["Email", "WhatsApp", "SMS"], format: "PERSONAL EMAIL + DIRECT OUTREACH",
    headline: '"You\'ve Got the Foundation — Here\'s What\'s Next"',
    cta: "Upgrade to Monthly Retainer — Lock In Your Rate Now",
    color: "#a78bfa", sequence: "RET_Upsell_Series_1.0",
    when_to_change: "New version at 6 months OR when upsell acceptance rate drops below 10%",
    tactics: ["WhatsApp personal check-in at Day 7 and Day 30 post-delivery", "Email upsell: lead with results they've already achieved", "Referral program: unique UTM link per client for attribution", "Day 45: request testimonial — repurpose into AWR content"],
  },
  "hot-value-small": {
    title: "PAID RETARGETING UPSELL ENGINE", surfboard: "Page 3 Direct → One-Click Upsell",
    stage: "RET", campaign: "RET-1.0A_META_IMAGE",
    utm: { source: "meta", medium: "retention", campaign: "RET-1.0A_META_IMAGE", content: "upsell_enterprise_bundle", term: "existing_buyers" },
    platforms: ["Meta Custom Audience", "Email", "SMS"], format: "IMAGE AD (existing client custom audience)",
    headline: '"Ready for the Next Level? Enterprise Package Now Available"',
    cta: "Claim Your Upgrade — Existing Client Pricing",
    color: "#a78bfa", sequence: "RET_Upsell_Series_1.0",
    when_to_change: "Version up after 10 upsells accepted OR upsell rate drops below 8%",
    tactics: ["Meta custom audience: upload existing client email list directly", "Frame as exclusive 'client-only' offer — not a public promotion", "Time-limited anchor price for genuine urgency without fake scarcity", "Separate RET UTM tags to keep reporting completely clean"],
  },
  "hot-value-medium": {
    title: "FULL LTV MAXIMISATION STACK", surfboard: "RET Sequence + Referral + Membership",
    stage: "RET", campaign: "RET-1.0A_EMAIL + RET-1.0A_META_IMAGE",
    utm: { source: "email", medium: "retention", campaign: "RET-1.0A_EMAIL", content: "upsell_membership_portal", term: "existing_buyers" },
    platforms: ["Email", "WhatsApp", "SMS", "Meta (client custom list)"], format: "MULTI-CHANNEL RETENTION SEQUENCE",
    headline: '"Your Automation Is Running — Now Let\'s Scale It"',
    cta: "Join the Monthly Optimisation Membership",
    color: "#a78bfa", sequence: "RET_Upsell_Series_1.0 → RET_Membership_2.0",
    when_to_change: "Refresh every 6 months — align version updates with quarterly business reviews",
    tactics: ["Full RET sequence: Day 1, 7, 14, 30, 45, 90 touchpoints", "WhatsApp via Zoho for personal-feel automated check-ins", "Zoho TrainerCentral membership portal for high-LTV continuity", "Referral tracking: unique UTM link issued per client"],
  },
};

function getStrategy(market, constraint, budget) {
  const key = `${market}-${constraint}-${budget}`;
  if (STRATEGIES[key]) return STRATEGIES[key];
  return STRATEGIES[`${market}-${constraint}-small`] ||
    STRATEGIES[`${market}-${constraint}-zero`] ||
    STRATEGIES[`${market}-${constraint}-medium`] || null;
}

function getFunnelRecommendation(constraint, productType) {
  if (!constraint) return null;
  const CONSTRAINT_MAP = { reach: "cold-reach", conversion: "warm-conversion", value: "hot-value" };
  const mappedConstraint = CONSTRAINT_MAP[constraint] || constraint;
  const rec = FUNNEL_RECOMMENDATIONS[mappedConstraint];
  if (!rec) return null;

  // Check for product-specific override
  const PRODUCT_SHORT = {
    high_ticket_service: "high_ticket", mid_ticket_service: "mid_ticket",
    low_ticket_digital: "digital", ecommerce: "ecommerce", saas: "saas",
    local_service: "local", community_membership: "community",
  };
  const shortProduct = PRODUCT_SHORT[productType] || productType;
  const override = rec.product_override?.[shortProduct];

  if (override) {
    return { ...rec, primary: override.primary, note: override.note };
  }
  return rec;
}

function FunnelFlowCard({ funnel, isPrimary, isExpanded, onToggle, relevance, relevanceCfg }) {
  const cc = COMPLEXITY_COLOR[funnel.complexity] || "#64748b";
  const cfg = relevanceCfg || RELEVANCE_CONFIG["relevant"];
  const isDimmed = relevance === "low";
  const borderColor = isDimmed ? "rgba(99,179,237,0.07)" : `${cfg.border}55`;
  const bgColor = isDimmed ? "rgba(255,255,255,0.01)" : cfg.bg;
  return (
    <div style={{
      border: `2px solid ${borderColor}`,
      borderRadius: 12, background: bgColor,
      overflow: "hidden", transition: "all 0.2s",
      opacity: isDimmed ? 0.55 : 1,
    }}>
      {/* Card Header */}
      <button onClick={onToggle} style={{
        width: "100%", background: "transparent", border: "none", cursor: "pointer",
        padding: "16px 20px", textAlign: "left"
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 14, alignItems: "center" }}>
          <div style={{ fontSize: 28 }}>{funnel.icon}</div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: isDimmed ? "#94a3b8" : cfg.color === "#34d399" ? funnel.hex : "#e2e8f0", letterSpacing: 1 }}>{funnel.name}</div>
              {relevance && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "2px 10px", background: `${cfg.color}18`, border: `1px solid ${cfg.color}40`, borderRadius: 20, color: cfg.color, letterSpacing: 1 }}>{cfg.label}</span>
              )}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: isDimmed ? "#94a3b8" : "#94a3b8" }}>{funnel.subtitle}</div>
          </div>
          <div style={{ display: "grid", gap: 6, textAlign: "right" }}>
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#64748b", letterSpacing: 1 }}>EFFORT:</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "2px 8px", background: `${cc}15`, border: `1px solid ${cc}33`, borderRadius: 4, color: isDimmed ? "#94a3b8" : cc }}>{funnel.complexity}</span>
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#64748b", letterSpacing: 1 }}>BUILD TIME:</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "2px 8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, color: "#94a3b8" }}>⏱ {funnel.time_to_build}</span>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8" }}>{funnel.min_budget}</div>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8" }}>{isExpanded ? "▲ HIDE" : "▼ EXPAND"}</div>
        </div>
        {/* Mini flow preview — always visible */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
          {funnel.stages.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, padding: "4px 10px", background: `${s.color}15`, border: `1px solid ${s.color}33`, borderRadius: 6, color: isDimmed ? "#94a3b8" : s.color, whiteSpace: "nowrap" }}>
                {s.icon} {s.label}
              </div>
              {i < funnel.stages.length - 1 && <span style={{ color: "#7a9bbf", fontSize: 16 }}>→</span>}
            </div>
          ))}
        </div>
      </button>

      {/* Expanded Detail */}
      {isExpanded && (
        <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${funnel.hex}20` }} className="fade-in">
          {/* Stage-by-stage breakdown */}
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: funnel.hex, letterSpacing: 2, margin: "16px 0 12px" }}>STAGE-BY-STAGE BREAKDOWN</div>
          <div style={{ display: "grid", gap: 8, marginBottom: 18 }}>
            {funnel.stages.map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "28px 200px 1fr auto", gap: 14, alignItems: "flex-start", background: "#040810", borderRadius: 8, padding: "12px 16px", border: `1px solid ${s.color}20` }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", paddingTop: 1 }}>{i + 1}.</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: s.color, letterSpacing: 1, marginBottom: 4 }}>{s.icon} {s.label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{s.desc}</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>
                  {s.cr && <div style={{ color: "#64748b" }}>📊 {s.cr}</div>}
                  {s.zoho && <div style={{ color: "#1e4a6b", marginTop: 4 }}>⚙ {s.zoho}</div>}
                </div>
                {i < funnel.stages.length - 1 && (
                  <div style={{ color: "#7a9bbf", fontSize: 20, textAlign: "right", paddingTop: 4 }}>↓</div>
                )}
              </div>
            ))}
          </div>

          {/* Two-col: Critical Rule + Bare Bayside Implementation */}
          <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div style={{ background: "rgba(248,113,113,0.05)", borderRadius: 8, padding: "14px 16px", border: "1px solid rgba(248,113,113,0.15)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#f87171", letterSpacing: 2, marginBottom: 8 }}>⚠ CRITICAL RULE</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>{funnel.critical_rule}</div>
            </div>
            <div style={{ background: `${funnel.hex}07`, borderRadius: 8, padding: "14px 16px", border: `1px solid ${funnel.hex}20` }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: funnel.hex, letterSpacing: 2, marginBottom: 8 }}>🏄 BARE BAYSIDE IMPLEMENTATION</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>{funnel.bayside_implementation}</div>
            </div>
          </div>

          {/* When to use / not use */}
          <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div style={{ background: "rgba(52,211,153,0.05)", borderRadius: 8, padding: "12px 16px", border: "1px solid rgba(52,211,153,0.12)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#34d399", letterSpacing: 2, marginBottom: 6 }}>✓ USE THIS WHEN</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{funnel.when_to_use}</div>
            </div>
            <div style={{ background: "rgba(248,113,113,0.04)", borderRadius: 8, padding: "12px 16px", border: "1px solid rgba(248,113,113,0.10)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#f87171", letterSpacing: 2, marginBottom: 6 }}>✗ DON'T USE WHEN</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{funnel.when_not_to_use}</div>
            </div>
          </div>

          {/* VSL Structure — for VSL Pre-Qual funnel */}
          {funnel.vsl_structure && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: funnel.hex, letterSpacing: 2, margin: "16px 0 12px" }}>
                🎥 {funnel.vsl_structure.title}
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                {funnel.vsl_structure.sections.map((sec, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.015)", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ minWidth: 80, fontFamily: "var(--font-mono)", fontSize: 11, color: funnel.hex, marginTop: 2 }}>{sec.time}</div>
                      <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#e2e8f0", marginBottom: 4, letterSpacing: 0.5 }}>{sec.label}</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{sec.content}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Sequence Detail — for Nurture funnel */}
          {funnel.sequence_detail && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: funnel.hex, letterSpacing: 2, margin: "16px 0 12px" }}>
                📧 EMAIL SEQUENCE BLUEPRINT
              </div>
              {["welcome", "value_sequence", "conversion"].map(phase => {
                const phaseLabels = { welcome: "PHASE 1 — WELCOME SERIES (Emails 1–5, Days 1–14)", value_sequence: "PHASE 2 — VALUE SEQUENCE (Emails 6–12, Days 15–60)", conversion: "PHASE 3 — CONVERSION SEQUENCE (Emails 13–15, Days 61–65)" };
                const phaseColors = { welcome: "#38bdf8", value_sequence: "#f59e0b", conversion: "#34d399" };
                return (
                  <div key={phase} style={{ marginBottom: 12 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: phaseColors[phase], letterSpacing: 2, marginBottom: 6, padding: "4px 10px", background: `${phaseColors[phase]}10`, borderRadius: 5, display: "inline-block" }}>
                      {phaseLabels[phase]}
                    </div>
                    <div style={{ display: "grid", gap: 5 }}>
                      {funnel.sequence_detail[phase].map((e, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.015)", borderRadius: 7, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.04)" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 12, alignItems: "flex-start" }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: phaseColors[phase] }}>EMAIL {e.email}</div>
                            <div>
                              {e.subject_style && <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#e2e8f0", marginBottom: 4 }}>Subject style: "{e.subject_style}"</div>}
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{e.purpose}</div>
                              {e.note && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8", marginTop: 4, borderLeft: `2px solid ${phaseColors[phase]}40`, paddingLeft: 8 }}>Note: {e.note}</div>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Referral Outreach Templates — for Referral Partnership funnel */}
          {funnel.outreach_templates && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: funnel.hex, letterSpacing: 2, margin: "16px 0 12px" }}>
                ✉️ OUTREACH TEMPLATES
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {Object.entries(funnel.outreach_templates).map(([key, tpl]) => {
                  const labels = { email_first_touch: "EMAIL — First Touch", linkedin_dm: "LINKEDIN DM — First Touch", follow_up_day5: "EMAIL — Day 5 Follow-Up", post_call_confirm: "EMAIL — Post-Partnership Call", monthly_partner_email: "EMAIL — Monthly Partner Nurture" };
                  return (
                    <div key={key} style={{ background: "rgba(52,211,153,0.04)", borderRadius: 8, padding: "14px 16px", border: "1px solid rgba(52,211,153,0.12)" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: funnel.hex, letterSpacing: 1, marginBottom: 8 }}>{labels[key] || key.toUpperCase()}</div>
                      {tpl.subject && (
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>
                          <span style={{ color: "#94a3b8" }}>Subject: </span>"{tpl.subject}"
                        </div>
                      )}
                      {tpl.body && (
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#64748b", lineHeight: 1.8, background: "#040810", padding: "10px 12px", borderRadius: 6, marginBottom: 8, borderLeft: `3px solid ${funnel.hex}40`, whiteSpace: "pre-wrap" }}>
                          {tpl.body}
                        </div>
                      )}
                      {tpl.sections && (
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>
                          {tpl.sections.map((s, si) => (
                            <div key={si} style={{ marginBottom: 4 }}><span style={{ color: funnel.hex }}>›</span> {s}</div>
                          ))}
                        </div>
                      )}
                      {tpl.notes && (
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 6, marginTop: 4 }}>
                          💡 {tpl.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Ideal partner types */}
              {funnel.partner_types_by_product && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: funnel.hex, letterSpacing: 2, marginBottom: 8 }}>IDEAL PARTNER TYPES BY PRODUCT CATEGORY</div>
                  <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {Object.entries(funnel.partner_types_by_product).map(([cat, partners]) => (
                      <div key={cat} style={{ background: "rgba(255,255,255,0.015)", borderRadius: 7, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: funnel.hex, marginBottom: 5, letterSpacing: 1, textTransform: "uppercase" }}>{cat.replace(/_/g, " ")}</div>
                        {partners.map((p, pi) => (
                          <div key={pi} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>› {p}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Campaign codes */}
          <div style={{ background: "#040810", borderRadius: 8, padding: "12px 16px", border: "1px solid rgba(99,179,237,0.08)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", letterSpacing: 2, marginBottom: 8 }}>CAMPAIGN CODES FOR THIS FUNNEL</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {funnel.campaign_codes.map(c => {
                const stageColors = { AWR: "#38bdf8", CON: "#f59e0b", SOL: "#34d399", RET: "#a78bfa" };
                const stage = c.split("-")[0];
                const col = stageColors[stage] || "#64748b";
                return (
                  <span key={c} style={{ fontFamily: "var(--font-mono)", fontSize: 13, padding: "4px 12px", background: `${col}15`, border: `1px solid ${col}33`, borderRadius: 6, color: col }}>{c}_[PLATFORM]_[FORMAT]</span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CHANNEL BREAKDOWN COMPONENT ─────────────────────────────────────────────

function FunnelSelectTile({ funnel, relevance, isSelected, onToggle, disabled, isExpanded, onExpandToggle, channelIcons }) {
  const cfg = RELEVANCE_CONFIG[relevance];
  // Get all channels this funnel appears in
  const funnelChannels = channelIcons || Object.entries(CHANNEL_FUNNEL_AFFINITY)
    .filter(([, ids]) => ids.includes(funnel.id))
    .map(([chId]) => CHANNEL_STRATEGIES.find(c => c.id === chId))
    .filter(Boolean);

  return (
    <div style={{
      border: `2px solid ${isSelected ? funnel.hex : isExpanded ? funnel.hex + "60" : "rgba(99,179,237,0.08)"}`,
      borderRadius: 8, overflow: "hidden",
      background: isSelected ? `${funnel.hex}10` : isExpanded ? `${funnel.hex}05` : "var(--surface)",
      transition: "all 0.2s"
    }}>
      {/* Entire row is clickable for expand — checkbox intercepts for selection */}
      <div
        onClick={onExpandToggle}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer" }}
      >
        {/* Checkbox — toggles selection, stops propagation so expand doesn't fire */}
        <div
          onClick={(e) => { e.stopPropagation(); if (!(disabled && !isSelected)) onToggle(); }}
          style={{
            width: 24, height: 24, borderRadius: 4, flexShrink: 0,
            border: `2px solid ${isSelected ? funnel.hex : "#475569"}`,
            background: isSelected ? funnel.hex : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: disabled && !isSelected ? "not-allowed" : "pointer",
            opacity: disabled && !isSelected ? 0.4 : 1,
            transition: "all 0.2s"
          }}
        >
          {isSelected && <span style={{ color: "#080c14", fontSize: 13, fontWeight: "bold" }}>✓</span>}
        </div>
        <span style={{ fontSize: 20 }}>{funnel.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: isSelected ? funnel.hex : "#e2e8f0", letterSpacing: 0.5 }}>{funnel.name}</div>
            {/* Channel icons showing where this funnel can be used */}
            {funnelChannels.length > 1 && (
              <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                {funnelChannels.map(ch => (
                  <span key={ch.id} title={ch.label} style={{ fontSize: 13, opacity: 0.7 }}>{ch.icon}</span>
                ))}
              </div>
            )}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{funnel.subtitle}</div>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "2px 8px", background: `${cfg.color}15`, border: `1px solid ${cfg.color}35`, borderRadius: 20, color: cfg.color, whiteSpace: "nowrap", flexShrink: 0 }}>
          {cfg.label}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#64748b", whiteSpace: "nowrap", flexShrink: 0 }}>
          {funnel.complexity}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: isExpanded ? funnel.hex : "#94a3b8", flexShrink: 0, marginLeft: 4 }}>
          {isExpanded ? "▲" : "▼"}
        </span>
      </div>

      {/* Expanded funnel detail */}
      {isExpanded && (
        <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${funnel.hex}18` }} className="fade-in">
          {/* Channel compatibility banner */}
          {funnelChannels.length > 1 && (
            <div style={{ display: "flex", gap: 6, margin: "12px 0 8px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#94a3b8", letterSpacing: 1 }}>WORKS WITH:</span>
              {funnelChannels.map(ch => (
                <span key={ch.id} style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "2px 8px", background: `${ch.hex}10`, border: `1px solid ${ch.hex}25`, borderRadius: 4, color: ch.hex, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {ch.icon} {ch.label}
                </span>
              ))}
            </div>
          )}
          {/* Mini stage flow */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, margin: "8px 0", flexWrap: "wrap" }}>
            {funnel.stages.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "3px 8px", background: `${s.color}12`, border: `1px solid ${s.color}28`, borderRadius: 5, color: s.color, whiteSpace: "nowrap" }}>
                  {s.icon} {s.label}
                </span>
                {i < funnel.stages.length - 1 && <span style={{ color: "#7a9bbf", fontSize: 14 }}>→</span>}
              </div>
            ))}
          </div>
          {/* Stage breakdown */}
          <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
            {funnel.stages.map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr auto", gap: 10, alignItems: "start", background: "#040810", borderRadius: 7, padding: "10px 12px", border: `1px solid ${s.color}18` }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8" }}>{i + 1}.</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: s.color, letterSpacing: 0.5, marginBottom: 3 }}>{s.icon} {s.label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{s.desc}</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#64748b", textAlign: "right" }}>
                  {s.cr && <div>📊 {s.cr}</div>}
                </div>
              </div>
            ))}
          </div>
          {/* Critical rule + implementation */}
          <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div style={{ background: "rgba(248,113,113,0.05)", borderRadius: 7, padding: "10px 12px", border: "1px solid rgba(248,113,113,0.12)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#f87171", letterSpacing: 1, marginBottom: 4 }}>⚠ CRITICAL RULE</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{funnel.critical_rule}</div>
            </div>
            {funnel.bayside_implementation && (
              <div style={{ background: `${funnel.hex}06`, borderRadius: 7, padding: "10px 12px", border: `1px solid ${funnel.hex}18` }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: funnel.hex, letterSpacing: 1, marginBottom: 4 }}>🏄 IMPLEMENTATION</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{funnel.bayside_implementation}</div>
              </div>
            )}
          </div>
          <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: "rgba(52,211,153,0.04)", borderRadius: 7, padding: "10px 12px", border: "1px solid rgba(52,211,153,0.1)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#34d399", letterSpacing: 1, marginBottom: 4 }}>✓ USE WHEN</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{funnel.when_to_use}</div>
            </div>
            <div style={{ background: "rgba(248,113,113,0.03)", borderRadius: 7, padding: "10px 12px", border: "1px solid rgba(248,113,113,0.08)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#f87171", letterSpacing: 1, marginBottom: 4 }}>✗ DON'T USE WHEN</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{funnel.when_not_to_use}</div>
            </div>
          </div>
          {/* Build info */}
          <div style={{ display: "flex", gap: 12, marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 11, color: "#64748b" }}>
            <span>⏱ {funnel.time_to_build}</span>
            <span>💰 {funnel.min_budget}</span>
            <span>Complexity: {funnel.complexity}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ChannelFunnelPicker({ channelId, channel, selectedFunnels, onToggleFunnel, productType, constraint, audience }) {
  const [expandedPickerFunnel, setExpandedPickerFunnel] = useState(null);
  const affinityIds = CHANNEL_FUNNEL_AFFINITY[channelId] || [];
  const affinityFunnels = FUNNELS.filter(f => affinityIds.includes(f.id));
  const order = { primary: 0, recommended: 1, relevant: 2, low: 3 };
  const scored = affinityFunnels
    .map(f => ({ funnel: f, rel: getChannelFunnelRelevance(f, channelId, { productType, constraint, audience }) }))
    .filter(s => s.rel !== "low")
    .sort((a, b) => order[a.rel] - order[b.rel]);
  const currentSelected = selectedFunnels[channelId] || [];
  const atMax = currentSelected.length >= MAX_FUNNELS_PER_CHANNEL;

  return (
    <div style={{ padding: "16px 18px", background: `${channel.hex}05`, borderTop: `1px solid ${channel.hex}15`, borderRadius: "0 0 10px 10px" }} className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: channel.hex, letterSpacing: 2 }}>
            SELECT UP TO {MAX_FUNNELS_PER_CHANNEL} FUNNELS FOR {channel.label}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
            Use ☐ to select · click the funnel name to expand details
          </div>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: atMax ? "#f87171" : channel.hex, fontWeight: "bold" }}>
          {currentSelected.length} / {MAX_FUNNELS_PER_CHANNEL}
        </div>
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        {scored.map(({ funnel, rel }) => (
          <FunnelSelectTile
            key={funnel.id}
            funnel={funnel}
            relevance={rel}
            isSelected={currentSelected.includes(funnel.id)}
            disabled={atMax}
            onToggle={() => onToggleFunnel(channelId, funnel.id)}
            isExpanded={expandedPickerFunnel === funnel.id}
            onExpandToggle={() => setExpandedPickerFunnel(expandedPickerFunnel === funnel.id ? null : funnel.id)}
          />
        ))}
        {scored.length === 0 && (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#475569", padding: "14px", textAlign: "center" }}>
            No high-relevance funnels for this channel with your current selections.
          </div>
        )}
      </div>
      {atMax && (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#f87171", marginTop: 8, textAlign: "center" }}>
          Maximum {MAX_FUNNELS_PER_CHANNEL} funnels selected — deselect one to change.
        </div>
      )}
    </div>
  );
}

function ChannelCard({ ch, isActive, onToggle }) {
  return (
    <div style={{
      border: `2px solid ${isActive ? ch.hex : ch.hex + "30"}`,
      borderRadius: 10, background: isActive ? `${ch.hex}08` : "var(--surface)",
      overflow: "hidden", transition: "all 0.2s"
    }}>
      {/* Header */}
      <button onClick={onToggle} style={{
        width: "100%", background: "transparent", border: "none",
        cursor: "pointer", padding: "14px 18px", textAlign: "left"
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 24 }}>{ch.icon}</span>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 3 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: isActive ? ch.hex : "#e2e8f0", letterSpacing: 1 }}>{ch.label}</div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8" }}>{ch.tagline}</div>
          </div>
          <div style={{ display: "grid", gap: 4, textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8" }}>OPEN RATE</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: ch.hex }}>{ch.open_rate}</div>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", marginLeft: 8 }}>
            {isActive ? "▲" : "▼"}
          </div>
        </div>
      </button>

      {isActive && (
        <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${ch.hex}18` }} className="fade-in">

          {/* Conversation type banner */}
          <div style={{ background: `${ch.hex}10`, borderRadius: 8, padding: "10px 14px", margin: "14px 0 16px", border: `1px solid ${ch.hex}25` }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: ch.hex, letterSpacing: 2, marginBottom: 4 }}>CONVERSATION TYPE</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: ch.hex, letterSpacing: 1, fontWeight: "bold" }}>{ch.conversation_type}</div>
          </div>

          {/* The truth about this channel */}
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.8, marginBottom: 16, borderLeft: `3px solid ${ch.hex}40`, paddingLeft: 14 }}>
            {ch.conversation_truth}
          </div>

          {/* Stats row */}
          <div className="rg-stats-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { label: "OPEN / VIEW RATE", value: ch.open_rate },
              { label: "CTR / REPLY RATE", value: ch.ctr },
              { label: "AVG RESPONSE TIME", value: ch.response_time },
            ].map((s, i) => (
              <div key={i} style={{ background: "#040810", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8", letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: ch.hex, lineHeight: 1.5 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Message / Content Structure */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: ch.hex, letterSpacing: 2, marginBottom: 10 }}>
              {ch.id === "sales_call" ? "CALL STRUCTURE" : ch.id === "social_content" ? "CONTENT STRUCTURE" : "MESSAGE STRUCTURE"}
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              {ch.structure.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr auto", gap: 12, alignItems: "flex-start", background: "rgba(255,255,255,0.015)", borderRadius: 7, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: ch.hex, letterSpacing: 1 }}>STEP {i + 1}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#e2e8f0", marginTop: 2 }}>{s.step}</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{s.role}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8", textAlign: "right", whiteSpace: "nowrap" }}>{s.timing}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Frameworks */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: ch.hex, letterSpacing: 2, marginBottom: 8 }}>PROVEN FRAMEWORKS</div>
            <div style={{ display: "grid", gap: 5 }}>
              {ch.frameworks.map((f, i) => (
                <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#64748b", padding: "6px 10px", background: `${ch.hex}07`, borderRadius: 5, border: `1px solid ${ch.hex}18`, lineHeight: 1.6 }}>
                  <span style={{ color: ch.hex }}>›</span> {f}
                </div>
              ))}
            </div>
          </div>

          {/* Platform notes for social content */}
          {ch.platform_notes && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: ch.hex, letterSpacing: 2, marginBottom: 8 }}>PLATFORM-SPECIFIC APPROACH</div>
              <div style={{ display: "grid", gap: 6 }}>
                {Object.entries(ch.platform_notes).map(([platform, note]) => (
                  <div key={platform} style={{ background: "rgba(255,255,255,0.015)", borderRadius: 7, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: ch.hex, letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>{platform.replace(/_/g, " ")}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Frequency + Metrics row */}
          <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={{ background: "#040810", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#f59e0b", letterSpacing: 2, marginBottom: 6 }}>FREQUENCY GUIDE</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{ch.frequency}</div>
            </div>
            <div style={{ background: "#040810", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#34d399", letterSpacing: 2, marginBottom: 6 }}>GOOD METRICS</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{ch.metrics.good}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#f87171", marginTop: 6, lineHeight: 1.6 }}>⚠ {ch.metrics.warning}</div>
            </div>
          </div>

          {/* Golden rules */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#f87171", letterSpacing: 2, marginBottom: 8 }}>NON-NEGOTIABLE RULES</div>
            <div style={{ display: "grid", gap: 5 }}>
              {ch.rules.map((r, i) => (
                <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", padding: "6px 10px", background: "rgba(248,113,113,0.04)", borderRadius: 5, border: "1px solid rgba(248,113,113,0.1)", lineHeight: 1.6 }}>
                  <span style={{ color: "#f87171" }}>✗ break this:</span> {r}
                </div>
              ))}
            </div>
          </div>

          {/* Zoho integration */}
          <div style={{ background: "rgba(56,189,248,0.04)", borderRadius: 8, padding: "10px 14px", border: "1px solid rgba(56,189,248,0.1)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#38bdf8", letterSpacing: 2, marginBottom: 5 }}>PLATFORM / ZOHO INTEGRATION</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{ch.platforms_zoho}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChannelBreakdown({ audienceModeId, activeChannelForFunnels, setActiveChannelForFunnels, selectedChannelFunnels, onToggleFunnel, productType, constraint }) {
  const [channelInfoOpen, setChannelInfoOpen] = useState(null);
  const channelIds = MODE_CHANNELS[audienceModeId] || [];
  const channels = channelIds.map(id => CHANNEL_STRATEGIES.find(c => c.id === id)).filter(Boolean);

  if (!channels.length) return null;

  const comparisonDimensions = [
    { key: "conversation_type", label: "CONVERSATION MODE" },
    { key: "open_rate",         label: "OPEN / VIEW RATE" },
    { key: "response_time",     label: "RESPONSE TIME" },
  ];

  return (
    <div style={{ marginTop: 20 }}>
      {/* Section header */}
      <div style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 2, marginBottom: 4 }}>
        <span style={{ color: "#94a3b8" }}>CHANNEL BREAKDOWN — </span>
        <span style={{ color: "#f472b6" }}>SELECT FUNNELS PER CHANNEL</span>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#7a9bbf", lineHeight: 1.7, marginBottom: 16 }}>
        Click each channel to see which funnels suit it best. Select 2–3 funnels per channel — these will form your action plan at the bottom. Use the ⓘ button to view full channel details.
      </div>

      {/* Quick comparison matrix */}
      <div style={{ background: "#040810", borderRadius: 10, padding: "14px 16px", marginBottom: 16, border: "1px solid rgba(255,255,255,0.05)", overflowX: "auto" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8", letterSpacing: 2, marginBottom: 12 }}>CHANNEL COMPARISON FOR THIS AUDIENCE MODE</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)" }}>
          <thead>
            <tr>
              <td style={{ fontSize: 11, color: "#94a3b8", padding: "4px 12px 8px 0", letterSpacing: 1 }}>DIMENSION</td>
              {channels.map(ch => (
                <td key={ch.id} style={{ fontSize: 13, color: ch.hex, padding: "4px 12px 8px", textAlign: "center", borderBottom: `2px solid ${ch.hex}` }}>
                  {ch.icon} {ch.label}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonDimensions.map((dim, di) => (
              <tr key={di} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <td style={{ fontSize: 11, color: "#94a3b8", padding: "8px 12px 8px 0", letterSpacing: 1, whiteSpace: "nowrap" }}>{dim.label}</td>
                {channels.map(ch => (
                  <td key={ch.id} style={{ fontSize: 12, color: "#94a3b8", padding: "8px 12px", textAlign: "center", lineHeight: 1.5 }}>
                    {dim.key === "conversation_type"
                      ? <span style={{ color: ch.hex, fontSize: 11 }}>{ch.conversation_type.split("→")[0].trim()}</span>
                      : ch[dim.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={{ fontSize: 11, color: "#94a3b8", padding: "8px 12px 8px 0", letterSpacing: 1, verticalAlign: "top" }}>IDEAL FOR</td>
              {channels.map(ch => (
                <td key={ch.id} style={{ fontSize: 11, color: "#94a3b8", padding: "8px 12px", textAlign: "center", lineHeight: 1.7, verticalAlign: "top" }}>
                  {ch.ideal_for.slice(0, 3).map((item, i) => (
                    <div key={i} style={{ marginBottom: 2 }}>› {item}</div>
                  ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Channel cards with funnel pickers */}
      <div style={{ display: "grid", gap: 10 }}>
        {channels.map(ch => {
          const isPickerOpen = activeChannelForFunnels === ch.id;
          const isInfoOpen = channelInfoOpen === ch.id;
          const chSelected = selectedChannelFunnels[ch.id] || [];
          const hasSelections = chSelected.length > 0;
          return (
            <div key={ch.id} style={{
              border: `2px solid ${isPickerOpen ? ch.hex : hasSelections ? ch.hex + "60" : ch.hex + "30"}`,
              borderRadius: 10, background: isPickerOpen ? `${ch.hex}08` : hasSelections ? `${ch.hex}04` : "var(--surface)",
              overflow: "hidden", transition: "all 0.2s"
            }}>
              {/* Channel header — click to open funnel picker */}
              <button onClick={() => setActiveChannelForFunnels(isPickerOpen ? null : ch.id)} style={{
                width: "100%", background: "transparent", border: "none",
                cursor: "pointer", padding: "14px 18px", textAlign: "left"
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 24 }}>{ch.icon}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 3 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: isPickerOpen ? ch.hex : "#e2e8f0", letterSpacing: 1 }}>{ch.label}</div>
                      {hasSelections && (
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "2px 10px", background: `${ch.hex}18`, border: `1px solid ${ch.hex}40`, borderRadius: 20, color: ch.hex }}>
                          {chSelected.length}/{MAX_FUNNELS_PER_CHANNEL} SELECTED
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8" }}>{ch.tagline}</div>
                  </div>
                  <div style={{ display: "grid", gap: 4, textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8" }}>OPEN RATE</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: ch.hex }}>{ch.open_rate}</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: isPickerOpen ? ch.hex : "#94a3b8", marginLeft: 8 }}>
                    {isPickerOpen ? "▲" : hasSelections ? "✓" : "▼"}
                  </div>
                </div>
              </button>

              {/* Info toggle button */}
              {isPickerOpen && (
                <div style={{ padding: "0 18px 4px", display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={(e) => { e.stopPropagation(); setChannelInfoOpen(isInfoOpen ? null : ch.id); }} style={{
                    background: "transparent", border: `1px solid ${ch.hex}30`, borderRadius: 6,
                    padding: "4px 12px", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 11,
                    color: ch.hex, letterSpacing: 1, transition: "all 0.15s"
                  }}>
                    {isInfoOpen ? "✕ HIDE DETAILS" : "ⓘ CHANNEL DETAILS"}
                  </button>
                </div>
              )}

              {/* Channel detail info (old ChannelCard expansion content) */}
              {isPickerOpen && isInfoOpen && (
                <div style={{ padding: "0 18px 14px", borderTop: `1px solid ${ch.hex}18` }} className="fade-in">
                  <div style={{ background: `${ch.hex}10`, borderRadius: 8, padding: "10px 14px", margin: "14px 0 16px", border: `1px solid ${ch.hex}25` }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: ch.hex, letterSpacing: 2, marginBottom: 4 }}>CONVERSATION TYPE</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: ch.hex, letterSpacing: 1, fontWeight: "bold" }}>{ch.conversation_type}</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.8, marginBottom: 16, borderLeft: `3px solid ${ch.hex}40`, paddingLeft: 14 }}>
                    {ch.conversation_truth}
                  </div>
                  <div className="rg-stats-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
                    {[
                      { label: "OPEN / VIEW RATE", value: ch.open_rate },
                      { label: "CTR / REPLY RATE", value: ch.ctr },
                      { label: "AVG RESPONSE TIME", value: ch.response_time },
                    ].map((s, i) => (
                      <div key={i} style={{ background: "#040810", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8", letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: ch.hex, lineHeight: 1.5 }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: ch.hex, letterSpacing: 2, marginBottom: 8 }}>PROVEN FRAMEWORKS</div>
                    <div style={{ display: "grid", gap: 5 }}>
                      {ch.frameworks.map((f, i) => (
                        <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#64748b", padding: "6px 10px", background: `${ch.hex}07`, borderRadius: 5, border: `1px solid ${ch.hex}18`, lineHeight: 1.6 }}>
                          <span style={{ color: ch.hex }}>›</span> {f}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ background: "#040810", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#f59e0b", letterSpacing: 2, marginBottom: 6 }}>FREQUENCY GUIDE</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{ch.frequency}</div>
                    </div>
                    <div style={{ background: "#040810", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#34d399", letterSpacing: 2, marginBottom: 6 }}>GOOD METRICS</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{ch.metrics.good}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Funnel picker — shows when channel is active */}
              {isPickerOpen && (
                <ChannelFunnelPicker
                  channelId={ch.id}
                  channel={ch}
                  selectedFunnels={selectedChannelFunnels}
                  onToggleFunnel={onToggleFunnel}
                  productType={productType}
                  constraint={constraint}
                  audience={audienceModeId}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FunnelActionPlanSummary({ selectedChannelFunnels, audienceModeId }) {
  const [expandedPlanFunnel, setExpandedPlanFunnel] = useState(null);
  const channelIds = MODE_CHANNELS[audienceModeId] || [];
  const hasSelections = Object.values(selectedChannelFunnels).some(arr => arr.length > 0);
  if (!hasSelections) return null;

  const activeChannels = channelIds.filter(id => (selectedChannelFunnels[id] || []).length > 0);
  const allSelectedIds = [...new Set(Object.values(selectedChannelFunnels).flat())];

  return (
    <div style={{ border: "2px solid rgba(52,211,153,0.3)", borderRadius: 14, background: "rgba(52,211,153,0.04)", padding: 22, marginTop: 24 }} className="fade-in">
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: -2, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #34d399, #38bdf8, transparent)", borderRadius: 3 }} />
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 3, marginBottom: 4 }}>
        <span style={{ color: "#94a3b8" }}>YOUR </span><span style={{ color: "#34d399" }}>FUNNEL ACTION PLAN</span>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#7a9bbf", marginBottom: 18 }}>
        {allSelectedIds.length} funnel{allSelectedIds.length !== 1 ? "s" : ""} selected across {activeChannels.length} channel{activeChannels.length !== 1 ? "s" : ""}
      </div>

      {channelIds.map(chId => {
        const funnelIds = selectedChannelFunnels[chId] || [];
        if (!funnelIds.length) return null;
        const channel = CHANNEL_STRATEGIES.find(c => c.id === chId);
        if (!channel) return null;

        return (
          <div key={chId} style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${channel.hex}25` }}>
              <span style={{ fontSize: 20 }}>{channel.icon}</span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: channel.hex, letterSpacing: 1 }}>{channel.label}</div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8" }}>{funnelIds.length} funnel{funnelIds.length !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {funnelIds.map(fId => {
                const funnel = FUNNELS.find(f => f.id === fId);
                if (!funnel) return null;
                const isPlanExpanded = expandedPlanFunnel === fId;
                const planFunnelChannels = Object.entries(CHANNEL_FUNNEL_AFFINITY)
                  .filter(([, ids]) => ids.includes(funnel.id))
                  .map(([cId]) => CHANNEL_STRATEGIES.find(c => c.id === cId))
                  .filter(Boolean);
                return (
                  <div key={fId} style={{
                    background: "#040810", borderRadius: 10, overflow: "hidden",
                    border: `1px solid ${isPlanExpanded ? funnel.hex + "60" : funnel.hex + "30"}`,
                    transition: "all 0.2s"
                  }}>
                    <button onClick={() => setExpandedPlanFunnel(isPlanExpanded ? null : fId)} style={{
                      width: "100%", background: "transparent", border: "none", cursor: "pointer",
                      padding: "14px 16px", textAlign: "left",
                      display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 14, alignItems: "start"
                    }}>
                      <span style={{ fontSize: 24, paddingTop: 2 }}>{funnel.icon}</span>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "#e2e8f0", letterSpacing: 0.5 }}>{funnel.name}</div>
                          {planFunnelChannels.length > 1 && (
                            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                              {planFunnelChannels.map(pch => (
                                <span key={pch.id} title={pch.label} style={{ fontSize: 13, opacity: 0.7 }}>{pch.icon}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>{funnel.subtitle}</div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {funnel.stages.map((s, i) => (
                            <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "2px 7px", background: `${s.color}10`, borderRadius: 4, color: s.color, display: "inline-flex", alignItems: "center", gap: 3 }}>
                              {s.icon} {s.label}{i < funnel.stages.length - 1 ? " →" : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", minWidth: 80 }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: funnel.hex, marginBottom: 4 }}>{funnel.complexity}</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8" }}>{funnel.time_to_build}</div>
                        {funnel.min_budget && (
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#64748b", marginTop: 4 }}>{funnel.min_budget}</div>
                        )}
                      </div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: isPlanExpanded ? funnel.hex : "#94a3b8", paddingTop: 4 }}>
                        {isPlanExpanded ? "▲" : "▼"}
                      </span>
                    </button>
                    {/* Expanded detail */}
                    {isPlanExpanded && (
                      <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${funnel.hex}18` }} className="fade-in">
                        {/* Channel compatibility */}
                        {planFunnelChannels.length > 1 && (
                          <div style={{ display: "flex", gap: 6, margin: "12px 0 8px", flexWrap: "wrap", alignItems: "center" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#94a3b8", letterSpacing: 1 }}>WORKS WITH:</span>
                            {planFunnelChannels.map(pch => (
                              <span key={pch.id} style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "2px 8px", background: `${pch.hex}10`, border: `1px solid ${pch.hex}25`, borderRadius: 4, color: pch.hex, display: "inline-flex", alignItems: "center", gap: 4 }}>
                                {pch.icon} {pch.label}
                              </span>
                            ))}
                          </div>
                        )}
                        <div style={{ display: "grid", gap: 6, margin: "12px 0" }}>
                          {funnel.stages.map((s, i) => (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr auto", gap: 10, alignItems: "start", background: "rgba(255,255,255,0.015)", borderRadius: 7, padding: "10px 12px", border: `1px solid ${s.color}15` }}>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8" }}>{i + 1}.</div>
                              <div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: s.color, letterSpacing: 0.5, marginBottom: 3 }}>{s.icon} {s.label}</div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{s.desc}</div>
                              </div>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#64748b", textAlign: "right" }}>
                                {s.cr && <div>📊 {s.cr}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                          <div style={{ background: "rgba(248,113,113,0.05)", borderRadius: 7, padding: "10px 12px", border: "1px solid rgba(248,113,113,0.12)" }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#f87171", letterSpacing: 1, marginBottom: 4 }}>⚠ CRITICAL RULE</div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{funnel.critical_rule}</div>
                          </div>
                          {funnel.bayside_implementation && (
                            <div style={{ background: `${funnel.hex}06`, borderRadius: 7, padding: "10px 12px", border: `1px solid ${funnel.hex}18` }}>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: funnel.hex, letterSpacing: 1, marginBottom: 4 }}>🏄 IMPLEMENTATION</div>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{funnel.bayside_implementation}</div>
                            </div>
                          )}
                        </div>
                        <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          <div style={{ background: "rgba(52,211,153,0.04)", borderRadius: 7, padding: "10px 12px", border: "1px solid rgba(52,211,153,0.1)" }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#34d399", letterSpacing: 1, marginBottom: 4 }}>✓ USE WHEN</div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{funnel.when_to_use}</div>
                          </div>
                          <div style={{ background: "rgba(248,113,113,0.03)", borderRadius: 7, padding: "10px 12px", border: "1px solid rgba(248,113,113,0.08)" }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#f87171", letterSpacing: 1, marginBottom: 4 }}>✗ DON'T USE WHEN</div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{funnel.when_not_to_use}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Summary stats */}
      <div className="rg-3" style={{ borderTop: "1px solid rgba(52,211,153,0.15)", marginTop: 10, paddingTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8", letterSpacing: 1, marginBottom: 4 }}>TOTAL FUNNELS</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#34d399" }}>{allSelectedIds.length}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8", letterSpacing: 1, marginBottom: 4 }}>CHANNELS ACTIVE</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#38bdf8" }}>{activeChannels.length}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8", letterSpacing: 1, marginBottom: 4 }}>CAMPAIGN CODES</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
            {[...new Set(allSelectedIds.flatMap(id => FUNNELS.find(f => f.id === id)?.campaign_codes || []))].slice(0, 6).map(code => (
              <span key={code} style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "2px 6px", background: "rgba(245,158,11,0.1)", borderRadius: 4, border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b" }}>{code}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function UTMBlock({ utm }) {
  const url = `https://yourdomain.com/lp?utm_source=${utm.source}&utm_medium=${utm.medium}&utm_campaign=${utm.campaign}&utm_content=${utm.content}&utm_term=${utm.term}`;
  return (
    <div style={{ background: "#040810", borderRadius: 8, padding: "14px 16px", border: "1px solid rgba(56,189,248,0.12)", marginTop: 12 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", letterSpacing: 2, marginBottom: 10 }}>GENERATED UTM URL</div>
      <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px", marginBottom: 10 }}>
        {Object.entries(utm).map(([k, v]) => (
          <div key={k} style={{ fontFamily: "var(--font-mono)", fontSize: 15 }}>
            <span style={{ color: "#94a3b8" }}>utm_{k}=</span>
            <span style={{ color: "#38bdf8" }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#7a9bbf", wordBreak: "break-all", lineHeight: 1.6, borderTop: "1px solid rgba(56,189,248,0.06)", paddingTop: 8 }}>{url}</div>
    </div>
  );
}

function NamingBadge({ campaign, stage }) {
  const colors = { AWR: "#38bdf8", CON: "#f59e0b", SOL: "#34d399", RET: "#a78bfa" };
  const color = colors[stage] || "#94a3b8";
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {campaign.split("_").map((p, i) => (
        <span key={i} style={{
          fontFamily: "var(--font-mono)", fontSize: 15, padding: "3px 8px",
          background: i === 0 ? color + "1a" : "rgba(255,255,255,0.03)",
          border: `1px solid ${i === 0 ? color + "40" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 4, color: i === 0 ? color : "#94a3b8"
        }}>{p}</span>
      ))}
    </div>
  );
}

function DiagnosticPanel({ condition }) {
  return (
    <div style={{ background: "#040810", border: `1px solid ${condition.hex}25`, borderRadius: 12, padding: 20, marginTop: 8 }} className="fade-in">
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: condition.hex, letterSpacing: 2, marginBottom: 14 }}>{condition.signals.title.toUpperCase()}</div>
      <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#34d399", letterSpacing: 2, marginBottom: 8 }}>✓ SIGNALS THIS IS YOUR MARKET</div>
          {condition.signals.positive.map((s, i) => (
            <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#64748b", padding: "4px 0", display: "flex", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
              <span style={{ color: "#34d399", flexShrink: 0 }}>›</span>{s}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#f87171", letterSpacing: 2, marginBottom: 8 }}>✗ MISTAKES TO AVOID</div>
          {condition.signals.negative.map((s, i) => (
            <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#64748b", padding: "4px 0", display: "flex", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
              <span style={{ color: "#f87171", flexShrink: 0 }}>✗</span>{s}
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "rgba(56,189,248,0.05)", borderRadius: 8, padding: "10px 14px", border: "1px solid rgba(56,189,248,0.1)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#38bdf8", letterSpacing: 2, marginBottom: 4 }}>ZOHO DIAGNOSTIC SIGNAL</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#94a3b8", lineHeight: 1.6 }}>{condition.signals.zoho}</div>
      </div>
    </div>
  );
}

function ConstraintDetail({ c }) {
  return (
    <div style={{ background: "#040810", border: `1px solid ${c.hex}25`, borderRadius: 12, padding: 20, marginTop: 8 }} className="fade-in">
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: c.hex, letterSpacing: 2, marginBottom: 12 }}>DIAGNOSTIC SIGNALS — DO THESE MATCH YOUR SITUATION?</div>
      <div style={{ marginBottom: 16 }}>
        {c.diagnostic.map((d, i) => (
          <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#64748b", padding: "5px 0", display: "flex", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <span style={{ color: c.hex, flexShrink: 0 }}>›</span>{d}
          </div>
        ))}
      </div>
      <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "rgba(248,113,113,0.05)", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(248,113,113,0.12)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#f87171", letterSpacing: 2, marginBottom: 6 }}>✗ THE WRONG FIX (costly mistake)</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#94a3b8", lineHeight: 1.7 }}>{c.wrong_fix}</div>
        </div>
        <div style={{ background: "rgba(52,211,153,0.05)", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(52,211,153,0.12)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#34d399", letterSpacing: 2, marginBottom: 6 }}>✓ THE RIGHT FIX</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#94a3b8", lineHeight: 1.7 }}>{c.right_fix}</div>
        </div>
      </div>
    </div>
  );
}

function AudienceDetail({ mode }) {
  return (
    <div style={{ background: "#040810", border: `1px solid ${mode.hex}25`, borderRadius: 12, padding: 20, marginTop: 8 }} className="fade-in">
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: mode.hex, letterSpacing: 2, marginBottom: 12 }}>WHY THIS CHANGES YOUR ENTIRE MARKETING APPROACH</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "#64748b", lineHeight: 1.9, marginBottom: 20, borderLeft: `3px solid ${mode.hex}`, paddingLeft: 16 }}>
        {mode.why_matters}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: mode.hex, letterSpacing: 2, marginBottom: 14 }}>6 SPECIFIC TACTICS FOR THIS AUDIENCE TYPE</div>
      <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
        {mode.tactics.map((t, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.015)", borderRadius: 8, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: mode.hex, marginBottom: 6 }}>{i + 1}. {t.name}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#94a3b8", lineHeight: 1.8 }}>{t.detail}</div>
          </div>
        ))}
      </div>
      <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div style={{ background: `${mode.hex}0a`, borderRadius: 8, padding: "12px 14px", border: `1px solid ${mode.hex}1a` }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: mode.hex, letterSpacing: 2, marginBottom: 6 }}>CREATIVE / COPY FORMULA</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#64748b", lineHeight: 1.7 }}>{mode.creative_formula}</div>
        </div>
        <div style={{ background: "rgba(245,158,11,0.05)", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(245,158,11,0.12)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#f59e0b", letterSpacing: 2, marginBottom: 6 }}>REAL-WORLD COPY EXAMPLE</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#94a3b8", lineHeight: 1.7 }}>{mode.copy_example}</div>
        </div>
      </div>
      <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "rgba(56,189,248,0.04)", borderRadius: 8, padding: "10px 14px", border: "1px solid rgba(56,189,248,0.1)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#38bdf8", letterSpacing: 2, marginBottom: 4 }}>ZOHO UTM TAGGING</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>{mode.zoho_tag}</div>
        </div>
        <div style={{ background: "rgba(248,113,113,0.04)", borderRadius: 8, padding: "10px 14px", border: "1px solid rgba(248,113,113,0.1)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#f87171", letterSpacing: 2, marginBottom: 4 }}>FATIGUE & PERFORMANCE SIGNAL</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>{mode.fatigue}</div>
        </div>
      </div>
    </div>
  );
}

// ── BRANDED FOOTER ──────────────────────────────────────────────────────────
const BrandedFooter = () => (
  <div style={{ textAlign: "center", paddingTop: 32, paddingBottom: 16, marginTop: 32, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
    <img className="footer-logo" src={`${import.meta.env.BASE_URL}barebayside-logo.png`} alt="Bare Bayside Labs" style={{ height: 120, objectFit: "contain", marginBottom: 12 }} />
    <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#e2e8f0", letterSpacing: 2, marginBottom: 8 }}>BARE BAYSIDE LABS</div>
    <a href="https://barebaysidelabs.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#38bdf8", textDecoration: "none", letterSpacing: 1 }}>
      barebaysidelabs.com
    </a>
    <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 16 }}>
      <a href="https://instagram.com/barebaysidelabs" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 13, color: "#c4d5e8", textDecoration: "none", padding: "8px 16px", background: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.2)", borderRadius: 8 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        Instagram
      </a>
      <a href="https://youtube.com/@barebaysidelabs" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 13, color: "#c4d5e8", textDecoration: "none", padding: "8px 16px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
        YouTube
      </a>
    </div>
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#475569", marginTop: 16 }}>
      © {new Date().getFullYear()} Bare Bayside Labs. All rights reserved.
    </div>
  </div>
);

// ── MAIN ────────────────────────────────────────────────────────────────────

export default function MarketingStrategyFramework() {
  const [productType, setProductType] = useState(null);
  const [market, setMarket] = useState(null);
  const [expandedMarket, setExpandedMarket] = useState(null);
  const [constraint, setConstraint] = useState(null);
  const [expandedConstraint, setExpandedConstraint] = useState(null);
  const [budget, setBudget] = useState(null);
  const [audience, setAudience] = useState(null);
  const [expandedAudience, setExpandedAudience] = useState(null);
  const [expandedFunnel, setExpandedFunnel] = useState(null);
  const [selectedChannelFunnels, setSelectedChannelFunnels] = useState({});
  const [activeChannelForFunnels, setActiveChannelForFunnels] = useState(null);
  const [showAllFunnels, setShowAllFunnels] = useState(false);
  // Per-audience-mode funnel picks: { [modeId]: { funnelId, channelId } }
  const [audienceFunnelPicks, setAudienceFunnelPicks] = useState({});
  const [activeTab, setActiveTab] = useState("framework");
  const [zoom, setZoom] = useState(1.0);
  const ZOOM_STEP = 0.1;
  const ZOOM_MIN = 0.6;
  const ZOOM_MAX = 1.6;

  const strategy = market && constraint && budget ? getStrategy(market, constraint, budget) : null;
  const stageColors = { AWR: "#38bdf8", CON: "#f59e0b", SOL: "#34d399", RET: "#a78bfa" };

  // Auto-switch to Your Plan tab when all strong-fit campaigns are selected
  useEffect(() => {
    if (!productType || !market || !constraint || !budget || activeTab !== "framework") return;
    const strongCount = AUDIENCE_MODES.filter(m => {
      const f = getAudienceFit(productType, m.id, budget);
      return f?.score === "strong";
    }).length;
    const pickedCount = Object.keys(audienceFunnelPicks).length;
    if (pickedCount >= strongCount && strongCount > 0) {
      const timer = setTimeout(() => {
        setActiveTab("your_plan");
        window.scrollTo(0, 0);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [audienceFunnelPicks, productType, market, constraint, budget, activeTab]);

  const selectMarket = (id) => {
    if (market === id) {
      setExpandedMarket(v => v === id ? null : id);
    } else {
      setMarket(id); setExpandedMarket(id);
      setConstraint(null); setBudget(null); setAudience(null); setSelectedChannelFunnels({}); setActiveChannelForFunnels(null); setAudienceFunnelPicks({});
      setTimeout(() => document.getElementById('step-02')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }
  };
  const selectConstraint = (id) => {
    if (constraint === id) setExpandedConstraint(v => v === id ? null : id);
    else { setConstraint(id); setExpandedConstraint(id); setTimeout(() => document.getElementById('step-03')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300); }
  };
  const selectAudience = (id) => {
    if (audience === id) setExpandedAudience(v => v === id ? null : id);
    else { setAudience(id); setExpandedAudience(id); setTimeout(() => document.getElementById(`audience-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300); }
  };

  const handleToggleChannelFunnel = (channelId, funnelId) => {
    setSelectedChannelFunnels(prev => {
      const current = prev[channelId] || [];
      if (current.includes(funnelId)) {
        return { ...prev, [channelId]: current.filter(id => id !== funnelId) };
      } else if (current.length < MAX_FUNNELS_PER_CHANNEL) {
        return { ...prev, [channelId]: [...current, funnelId] };
      }
      return prev;
    });
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <style>{styles}</style>

      {/* Floating step navigation */}
      {activeTab === "framework" && (
        <div className="step-nav">
          {[
            { id: "step-00", label: "00", done: !!productType, color: "#fb923c", visible: true },
            { id: "step-01", label: "01", done: !!market, color: "#38bdf8", visible: !!productType },
            { id: "step-02", label: "02", done: !!constraint, color: "#f59e0b", visible: !!market },
            { id: "step-03", label: "03", done: !!budget, color: "#34d399", visible: !!(market && constraint) },
            { id: "step-04", label: "04", done: Object.keys(audienceFunnelPicks).length > 0, color: "#f472b6", visible: !!(market && constraint && budget) },
          ].filter(s => s.visible).map(step => (
            <button key={step.id} onClick={() => document.getElementById(step.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} style={{
              width: 38, height: 38, borderRadius: "50%",
              background: step.done ? `${step.color}20` : "rgba(13,21,37,0.92)",
              border: `2px solid ${step.done ? step.color : "rgba(99,179,237,0.2)"}`,
              color: step.done ? step.color : "#64748b",
              fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: "bold",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", backdropFilter: "blur(8px)",
              boxShadow: step.done ? `0 0 10px ${step.color}20` : "0 2px 8px rgba(0,0,0,0.3)",
            }}>
              {step.done ? "✓" : step.label}
            </button>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="rp-header" style={{ background: "linear-gradient(180deg,#0d1525 0%,#080c14 100%)", borderBottom: "1px solid var(--border)", padding: "22px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="header-inner" style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 10 }}>
            <img src={`${import.meta.env.BASE_URL}barebayside-logo.png`} alt="Bare Bayside Labs" style={{ height: 130, objectFit: "contain" }} />
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px,5vw,62px)", color: "#e2e8f0", letterSpacing: 3, lineHeight: 1 }}>BARE BAYSIDE LABS</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#38bdf8", letterSpacing: 3, marginTop: 6 }}>MARKETING STRATEGY FRAMEWORK</div>
            </div>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px,5vw,62px)", letterSpacing: 2, lineHeight: 1, background: "linear-gradient(135deg,#e2e8f0 0%,#38bdf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            MARKETING STRATEGY SELECTOR
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15, marginTop: 6, fontFamily: "var(--font-mono)" }}>
            Diagnose temperature → identify constraint → set budget → choose audience mode → get your complete campaign blueprint.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="responsive-tabs" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", overflowX: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex" }}>
          {[["your_plan","📋 YOUR PLAN"],["framework","STRATEGY SELECTOR"],["naming","NAMING CONVENTION"],["utm_map","UTM MAP"],["glossary","GLOSSARY"]].map(([t, label]) => {
            const isYourPlan = t === "your_plan";
            const hasStrategy = !!(market && constraint && budget);
            const isActive = activeTab === t;
            return (
              <button key={t} onClick={() => { if (isYourPlan && !hasStrategy) return; setActiveTab(t); }} style={{
                padding: "11px 18px", fontFamily: "var(--font-mono)", fontSize: 14, letterSpacing: 2,
                background: isYourPlan && isActive ? "rgba(52,211,153,0.08)" : "transparent",
                border: "none", cursor: isYourPlan && !hasStrategy ? "not-allowed" : "pointer", whiteSpace: "nowrap",
                color: isYourPlan ? (isActive ? "#34d399" : hasStrategy ? "#34d399" : "#334155") : (isActive ? "#38bdf8" : "#94a3b8"),
                borderBottom: isActive ? `2px solid ${isYourPlan ? "#34d399" : "#38bdf8"}` : "2px solid transparent",
                opacity: isYourPlan && !hasStrategy ? 0.4 : 1,
                transition: "color 0.2s"
              }}>{label}</button>
            );
          })}
        </div>
      </div>

      {/* Zoom Controls */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "#040810", padding: "8px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", letterSpacing: 2 }}>ZOOM</span>
          <button onClick={() => setZoom(z => Math.max(ZOOM_MIN, parseFloat((z - ZOOM_STEP).toFixed(1))))}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, color: "#94a3b8", fontFamily: "var(--font-mono)", fontSize: 18, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>−</button>
          <div className="zoom-presets" style={{ display: "flex", gap: 4 }}>
            {[0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4].map(z => (
              <button key={z} onClick={() => setZoom(z)} style={{
                background: zoom === z ? "rgba(56,189,248,0.15)" : "var(--surface)",
                border: `1px solid ${zoom === z ? "#38bdf8" : "rgba(99,179,237,0.12)"}`,
                borderRadius: 5, color: zoom === z ? "#38bdf8" : "#94a3b8",
                fontFamily: "var(--font-mono)", fontSize: 12, padding: "4px 8px", cursor: "pointer",
                transition: "all 0.15s"
              }}>{Math.round(z * 100)}%</button>
            ))}
          </div>
          <button onClick={() => setZoom(z => Math.min(ZOOM_MAX, parseFloat((z + ZOOM_STEP).toFixed(1))))}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, color: "#94a3b8", fontFamily: "var(--font-mono)", fontSize: 18, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>+</button>
          <button onClick={() => setZoom(1.0)}
            style={{ background: "transparent", border: "none", color: "#94a3b8", fontFamily: "var(--font-mono)", fontSize: 12, cursor: "pointer", letterSpacing: 1, marginLeft: 4 }}>RESET</button>
        </div>
      </div>

      <div className="rp-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 18px" }}>
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left", width: `${(1/zoom)*100}%` }}>
        {activeTab === "framework" && (
          <div>
            {/* Framework Overview — hidden on mobile */}
            <div className="rg-5 framework-overview" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 26 }}>
              {[
                { label: "STEP 00", title: "PRODUCT TYPE", items: ["High-ticket service", "Mid-ticket service", "Digital product", "Ecommerce", "SaaS / App", "Local service", "Community / Membership"], color: "#fb923c" },
                { label: "STEP 01", title: "MARKET TEMPERATURE", items: ["Cold → No awareness", "Warm → Know problem, not you", "Hot → Raised their hand"], color: "#38bdf8" },
                { label: "STEP 02", title: "YOUR BOTTLENECK", items: ["Reach → Not enough visibility", "Conversion → Leads not buying", "Value → Low LTV / no repeat"], color: "#f59e0b" },
                { label: "STEP 03", title: "AVAILABLE BUDGET", items: ["Zero → Organic only", "$500–$2K → Single channel", "$2K–$10K → Multi-channel"], color: "#34d399" },
                { label: "STEP 04", title: "AUDIENCE MODE", items: ["Interruption → Paid social / display", "Intent → Search / keyword", "Community → Organic / referral", "Owned → Email / SMS / WhatsApp"], color: "#f472b6" },
              ].map((a, i) => (
                <div key={i} style={{ background: "var(--surface)", border: `1px solid ${a.color}25`, borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: a.color, letterSpacing: 2, marginBottom: 4 }}>{a.label}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "#e2e8f0", letterSpacing: 1, marginBottom: 10 }}>{a.title}</div>
                  {a.items.map((item, j) => (
                    <div key={j} style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", padding: "3px 0", borderBottom: j < a.items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", gap: 8 }}>
                      <span style={{ color: a.color, flexShrink: 0 }}>›</span>{item}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* START HERE prompt — hidden on mobile */}
            <div className="start-here-prompt" style={{ textAlign: "center", padding: "20px 0 24px", marginBottom: 8 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,4vw,28px)", color: "#38bdf8", letterSpacing: 3, marginBottom: 8 }}>BUILD YOUR STRATEGY IN 5 STEPS</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", lineHeight: 1.7, maxWidth: 500, margin: "0 auto", marginBottom: 16 }}>Select one option at each step below. Your personalised marketing plan will be built as you go.</div>
              <div style={{ fontSize: 28, animation: "bounce 2s infinite" }}>👇</div>
            </div>

            {/* STEP 0 — PRODUCT / SERVICE TYPE */}
            <div id="step-00" className="step-container" style={{ marginBottom: 22 }}>
              <div className="step-header" style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 2, marginBottom: 4 }}>
                <span style={{ color: "#94a3b8" }}>STEP 00 — </span><span style={{ color: "#fb923c" }}>PRODUCT / SERVICE TYPE</span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#fb923c", letterSpacing: 1, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                👇 SELECT WHAT BEST DESCRIBES YOUR BUSINESS
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#7a9bbf", marginBottom: 14, lineHeight: 1.6 }}>
                Choose one option below. This determines which strategies and funnels apply to you.
              </div>
              <div className="rg-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
                {PRODUCT_TYPES.map(pt => (
                  <button key={pt.id} onClick={() => { setProductType(pt.id); setMarket(null); setConstraint(null); setBudget(null); setAudience(null); setSelectedChannelFunnels({}); setActiveChannelForFunnels(null); setAudienceFunnelPicks({}); setTimeout(() => document.getElementById('step-01')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150); }} style={{
                    background: productType === pt.id ? `${pt.hex}10` : "var(--surface)",
                    border: `2px solid ${productType === pt.id ? pt.hex : "rgba(99,179,237,0.1)"}`,
                    borderRadius: 10, padding: "14px 16px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", position: "relative"
                  }}>
                    {productType === pt.id && <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: pt.hex, borderRadius: "10px 0 0 10px" }} />}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 24 }}>{pt.icon}</span>
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: productType === pt.id ? pt.hex : "#e2e8f0", letterSpacing: 1 }}>{pt.label}</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8" }}>{pt.subtitle}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: pt.hex, marginBottom: 6 }}>{pt.price_range} · {pt.decision_length}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {pt.examples.slice(0, 3).map((e, i) => (
                        <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "2px 7px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, color: "#94a3b8" }}>{e}</span>
                      ))}
                    </div>
                    {productType === pt.id && (
                      <div style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.7, borderTop: `1px solid ${pt.hex}20`, paddingTop: 10 }}>
                        {pt.buyer_psychology}
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {!productType && (
                <div style={{ textAlign: "center", padding: "18px 0 4px", fontFamily: "var(--font-mono)", fontSize: 13, color: "#fb923c", letterSpacing: 2 }}>
                  👆 TAP ONE TO BEGIN
                </div>
              )}
              {productType && (
                <div style={{ textAlign: "center", padding: "18px 0 4px", fontFamily: "var(--font-mono)", fontSize: 13, color: "#34d399", letterSpacing: 2 }}>
                  ✓ SELECTED — SCROLL DOWN TO STEP 01 👇
                </div>
              )}
            </div>
            {productType && (
            <div id="step-01" style={{ marginBottom: 22 }} className="fade-in step-container">
              <div className="step-header" style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 2, marginBottom: 4 }}>
                <span style={{ color: "#94a3b8" }}>STEP 01 — </span><span style={{ color: "#38bdf8" }}>MARKET TEMPERATURE</span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#38bdf8", letterSpacing: 1, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                👇 SELECT THE MARKET TEMPERATURE THAT APPLIES
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#7a9bbf", marginBottom: 14, lineHeight: 1.6 }}>
                Market temperature is a relationship status, not a demographic. Click to select, click again to expand diagnostic criteria.
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {MARKET_CONDITIONS.map(m => (
                  <div key={m.id}>
                    <button onClick={() => selectMarket(m.id)} style={{
                      width: "100%", background: market===m.id ? `${m.hex}0d` : "var(--surface)",
                      border: `2px solid ${market===m.id ? m.hex : "rgba(99,179,237,0.1)"}`,
                      borderRadius: 10, padding: "14px 18px", cursor: "pointer", textAlign: "left",
                      transition: "all 0.2s", position: "relative", overflow: "hidden"
                    }}>
                      {market===m.id && <div style={{ position:"absolute", top:0, left:0, bottom:0, width:3, background:m.hex }} />}
                      <div className="rg-detail-3" style={{ display:"grid", gridTemplateColumns:"auto 1fr auto", gap:14, alignItems:"center" }}>
                        <div style={{ fontSize:32 }}>{m.icon}</div>
                        <div className="text-wrap">
                          <div className="detail-label" style={{ fontFamily:"var(--font-display)", fontSize:27, color:market===m.id?m.hex:"#e2e8f0", letterSpacing:1 }}>{m.label}</div>
                          <div className="detail-sub" style={{ fontFamily:"var(--font-mono)", fontSize:20, color:"#94a3b8", marginTop:2 }}>{m.short}</div>
                          <div style={{ fontFamily:"var(--font-mono)", fontSize:15, color:"#7a9bbf", marginTop:6 }}>{m.stage} stage → {m.funnelPage}</div>
                        </div>
                        <div className="detail-action" style={{ fontFamily:"var(--font-mono)", fontSize:19, color:"#7a9bbf", textAlign:"right" }}>
                          {market===m.id ? (expandedMarket===m.id?"▲ HIDE":"▼ DETAILS") : "▼ SELECT"}
                        </div>
                      </div>
                    </button>
                    {market===m.id && expandedMarket===m.id && <DiagnosticPanel condition={m} />}
                  </div>
                ))}
              </div>
              {market && (
                <div style={{ textAlign: "center", padding: "18px 0 4px", fontFamily: "var(--font-mono)", fontSize: 13, color: "#34d399", letterSpacing: 2 }}>
                  ✓ SELECTED — SCROLL DOWN TO STEP 02 👇
                </div>
              )}
            </div>
            )}

            {/* STEP 2 */}
            {market && (
              <div id="step-02" style={{ marginBottom: 22 }} className="fade-in step-container">
                <div className="step-header" style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 2, marginBottom: 4 }}>
                  <span style={{ color: "#94a3b8" }}>STEP 02 — </span><span style={{ color: "#f59e0b" }}>YOUR CURRENT BOTTLENECK</span>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#f59e0b", letterSpacing: 1, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  👇 SELECT YOUR BIGGEST BOTTLENECK
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#7a9bbf", marginBottom: 14, lineHeight: 1.6 }}>
                  Only one constraint is choking your growth right now. Misidentify it and you'll spend money solving the wrong problem. Select the one that applies most.
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {CONSTRAINTS.map(c => (
                    <div key={c.id}>
                      <button onClick={() => selectConstraint(c.id)} style={{
                        width: "100%", background: constraint===c.id ? `${c.hex}0d` : "var(--surface)",
                        border: `2px solid ${constraint===c.id ? c.hex : "rgba(99,179,237,0.1)"}`,
                        borderRadius: 10, padding: "14px 18px", cursor: "pointer", textAlign: "left",
                        transition: "all 0.2s", position: "relative"
                      }}>
                        {constraint===c.id && <div style={{ position:"absolute", top:0, left:0, bottom:0, width:3, background:c.hex }} />}
                        <div className="rg-detail-3" style={{ display:"grid", gridTemplateColumns:"auto 1fr auto", gap:14, alignItems:"flex-start" }}>
                          <div style={{ fontSize:32, paddingTop:2 }}>{c.icon}</div>
                          <div className="text-wrap">
                            <div className="detail-label" style={{ fontFamily:"var(--font-display)", fontSize:27, color:constraint===c.id?c.hex:"#e2e8f0", letterSpacing:1 }}>{c.label}</div>
                            <div className="detail-sub" style={{ fontFamily:"var(--font-mono)", fontSize:20, color:"#94a3b8", marginTop:2, marginBottom:6 }}>{c.subtitle}</div>
                            <div className="detail-desc" style={{ fontFamily:"var(--font-mono)", fontSize:21, color:"#94a3b8", lineHeight:1.7 }}>{c.desc}</div>
                          </div>
                          <div style={{ textAlign:"right", paddingTop:2 }}>
                            <div style={{ fontFamily:"var(--font-mono)", fontSize:18, color:c.hex, letterSpacing:1, marginBottom:4 }}>MAPS TO</div>
                            <div className="detail-sub" style={{ fontFamily:"var(--font-mono)", fontSize:20, color:"#94a3b8", marginBottom:8 }}>{c.stage}</div>
                            <div className="detail-action" style={{ fontFamily:"var(--font-mono)", fontSize:19, color:"#7a9bbf" }}>
                              {constraint===c.id ? (expandedConstraint===c.id?"▲ HIDE":"▼ DETAILS") : "▼ SELECT"}
                            </div>
                          </div>
                        </div>
                      </button>
                      {constraint===c.id && expandedConstraint===c.id && <ConstraintDetail c={c} />}
                    </div>
                  ))}
                </div>
                {constraint && (
                  <div style={{ textAlign: "center", padding: "18px 0 4px", fontFamily: "var(--font-mono)", fontSize: 13, color: "#34d399", letterSpacing: 2 }}>
                    ✓ SELECTED — SCROLL DOWN TO STEP 03 👇
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 */}
            {market && constraint && (
              <div id="step-03" style={{ marginBottom: 22 }} className="fade-in step-container">
                <div className="step-header" style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 2, marginBottom: 4 }}>
                  <span style={{ color: "#94a3b8" }}>STEP 03 — </span><span style={{ color: "#34d399" }}>AVAILABLE BUDGET</span>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#34d399", letterSpacing: 1, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  👇 SELECT YOUR AVAILABLE BUDGET
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#7a9bbf", marginBottom: 14, lineHeight: 1.6 }}>
                  Budget determines your platform mix, not your strategic direction. Never commit more than you can sustain for 90 days.
                </div>
                <div className="rg-budget" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                  {BUDGET_LEVELS.map(b => (
                    <button key={b.id} onClick={() => { setBudget(b.id); setTimeout(() => document.getElementById('step-04')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150); }} style={{
                      background: budget===b.id ? "rgba(52,211,153,0.09)" : "var(--surface)",
                      border: `2px solid ${budget===b.id ? "#34d399" : "rgba(99,179,237,0.1)"}`,
                      borderRadius: 10, padding: "16px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.2s"
                    }}>
                      <div style={{ fontSize:32, marginBottom:8 }}>{b.icon}</div>
                      <div style={{ fontFamily:"var(--font-display)", fontSize:25, color:budget===b.id?"#34d399":"#e2e8f0", letterSpacing:1, marginBottom:4 }}>{b.label}</div>
                      <div style={{ fontFamily:"var(--font-mono)", fontSize:20, color:"#94a3b8", marginBottom:8 }}>{b.desc}</div>
                      <div style={{ fontFamily:"var(--font-mono)", fontSize:20, color:"#7a9bbf", lineHeight:1.6 }}>{b.note}</div>
                    </button>
                  ))}
                </div>
                {budget && (
                  <div style={{ textAlign: "center", padding: "18px 0 4px", fontFamily: "var(--font-mono)", fontSize: 13, color: "#34d399", letterSpacing: 2 }}>
                    ✓ SELECTED — SCROLL DOWN TO STEP 04 👇
                  </div>
                )}
              </div>
            )}

            {/* STEP 4 — AUDIENCE DISCOVERY MODE + FUNNEL PICKS */}
            {market && constraint && budget && (
              <div id="step-04" style={{ marginBottom: 28 }} className="fade-in step-container">
                <div className="step-header" style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 2, marginBottom: 4 }}>
                  <span style={{ color: "#94a3b8" }}>STEP 04 — </span><span style={{ color: "#f472b6" }}>AUDIENCE DISCOVERY MODE</span>
                </div>
                {(() => {
                  const strongCount = AUDIENCE_MODES.filter(m => { const f = getAudienceFit(productType, m.id, budget); return f?.score === "strong"; }).length;
                  const pickedCount = Object.keys(audienceFunnelPicks).length;
                  const allDone = pickedCount >= strongCount && strongCount > 0;
                  return (
                    <div style={{ background: allDone ? "rgba(52,211,153,0.06)" : "rgba(56,189,248,0.06)", border: `1px solid ${allDone ? "rgba(52,211,153,0.25)" : "rgba(56,189,248,0.25)"}`, borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 20 }}>{allDone ? "✅" : "👇"}</span>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: allDone ? "#34d399" : "#38bdf8", letterSpacing: 1 }}>
                          {allDone ? "ALL CAMPAIGNS SELECTED" : "HOW TO USE THIS STEP"}
                        </div>
                      </div>
                      {!allDone && (
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.8, paddingLeft: 30 }}>
                          <div style={{ marginBottom: 4 }}><span style={{ color: "#34d399", fontWeight: "bold" }}>1.</span> Look for audience modes marked <span style={{ color: "#34d399", fontWeight: "bold" }}>STRONG FIT</span> — these are your best channels.</div>
                          <div style={{ marginBottom: 4 }}><span style={{ color: "#34d399", fontWeight: "bold" }}>2.</span> Click a strong-fit mode to expand it and see the available funnels.</div>
                          <div><span style={{ color: "#34d399", fontWeight: "bold" }}>3.</span> Pick <span style={{ color: "#f59e0b", fontWeight: "bold" }}>1 funnel</span> per strong-fit mode. Each becomes a campaign in your plan.</div>
                        </div>
                      )}
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: allDone ? "#34d399" : "#64748b", marginTop: 8, paddingLeft: 30, display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ background: allDone ? "#34d399" : "#334155", height: 6, borderRadius: 3, flex: 1, maxWidth: 120, overflow: "hidden" }}>
                          <div style={{ background: "#34d399", height: "100%", borderRadius: 3, width: strongCount > 0 ? `${(pickedCount / strongCount) * 100}%` : "0%", transition: "width 0.3s" }} />
                        </div>
                        {pickedCount} of {strongCount} strong-fit campaign{strongCount !== 1 ? "s" : ""} selected {allDone && "— ready to view your plan"}
                      </div>
                    </div>
                  );
                })()}
                <div style={{ display: "grid", gap: 10 }}>
                  {AUDIENCE_MODES.map(mode => {
                    const fit = getAudienceFit(productType, mode.id, budget);
                    const fc = fit ? FIT_COLORS[fit.score] : FIT_COLORS.moderate;
                    const isConflict = fit?.score === "conflict";
                    const isStrong = fit?.score === "strong";
                    const isExpanded = audience === mode.id;
                    const pick = audienceFunnelPicks[mode.id];
                    const pickedFunnel = pick ? FUNNELS.find(f => f.id === pick.funnelId) : null;
                    const pickedChannel = pick ? CHANNEL_STRATEGIES.find(c => c.id === pick.channelId) : null;

                    return (
                      <div key={mode.id} id={`audience-${mode.id}`}>
                        <button onClick={() => !isConflict && selectAudience(mode.id)} style={{
                          width: "100%", background: isExpanded ? `${mode.hex}0a` : isConflict ? "rgba(20,20,30,0.5)" : "var(--surface)",
                          border: `2px solid ${isExpanded ? mode.hex : pick ? "#34d39940" : isConflict ? "rgba(60,60,80,0.4)" : "rgba(99,179,237,0.1)"}`,
                          borderRadius: isExpanded && isStrong ? "10px 10px 0 0" : 10, padding: "14px 18px", cursor: isConflict ? "not-allowed" : "pointer", textAlign: "left",
                          transition: "all 0.2s", position: "relative", opacity: isConflict ? 0.55 : 1
                        }}>
                          {isExpanded && <div style={{ position:"absolute", top:0, left:0, bottom:0, width:3, background:mode.hex }} />}
                          <div style={{ display:"grid", gridTemplateColumns:"auto 1fr auto", gap:14, alignItems:"flex-start" }}>
                            <div style={{ fontSize:30, opacity: isConflict ? 0.4 : 1 }}>{mode.icon}</div>
                            <div>
                              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:4 }}>
                                <div style={{ fontFamily:"var(--font-display)", fontSize:24, color: isExpanded ? mode.hex : isConflict ? "#94a3b8" : "#e2e8f0", letterSpacing:1 }}>{mode.label}</div>
                                {fit && (
                                  <span style={{ fontFamily:"var(--font-mono)", fontSize:11, padding:"2px 10px", background: fc.bg, border:`1px solid ${fc.border}`, borderRadius:20, color: fc.text, letterSpacing:1 }}>{fc.label}</span>
                                )}
                                {pick && pickedFunnel && (
                                  <span style={{ fontFamily:"var(--font-mono)", fontSize:11, padding:"2px 10px", background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)", borderRadius:20, color:"#34d399", letterSpacing:1 }}>
                                    ✓ {pickedFunnel.icon} {pickedFunnel.name} {pickedChannel ? `via ${pickedChannel.icon}` : ""}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontFamily:"var(--font-mono)", fontSize:14, color:"#94a3b8", marginBottom:6 }}>{mode.subtitle}</div>
                              <div className="audience-extra">
                                {fit && (
                                  <div style={{ fontFamily:"var(--font-mono)", fontSize:13, color:"#94a3b8", lineHeight:1.6, marginBottom:8, paddingLeft:8, borderLeft:`2px solid ${fc.border}` }}>{fit.reason}</div>
                                )}
                                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                                  {mode.platforms.map(p => (
                                    <span key={p} style={{ fontFamily:"var(--font-mono)", fontSize:13, padding:"2px 8px", background:`${mode.hex}${isConflict ? "08" : "12"}`, border:`1px solid ${mode.hex}${isConflict ? "15" : "28"}`, borderRadius:4, color: isConflict ? "#94a3b8" : mode.hex }}>{p}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div style={{ fontFamily:"var(--font-mono)", fontSize:14, color:"#7a9bbf", textAlign:"right", whiteSpace:"nowrap" }}>
                              {isConflict ? "✗ BLOCKED" : isExpanded ? "▲ COLLAPSE" : isStrong ? (pick ? "▼ CHANGE" : "▼ PICK FUNNEL") : "▼ DETAILS"}
                            </div>
                          </div>
                        </button>

                        {/* Expanded: audience details — hidden on mobile */}
                        <div className="audience-detail-wrap">
                          {isExpanded && expandedAudience === mode.id && <AudienceDetail mode={mode} />}
                        </div>

                        {/* Inline funnel picker — only for strong-fit modes when expanded */}
                        {isExpanded && isStrong && (() => {
                          const available = getFunnelsForAudienceMode(mode.id, { productType, constraint });
                          if (available.length === 0) return null;
                          return (
                            <div style={{ border: `1px solid ${mode.hex}25`, borderTop: "none", borderRadius: "0 0 10px 10px", background: `${mode.hex}04`, padding: "14px 18px" }} className="fade-in">
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: mode.hex, letterSpacing: 2, marginBottom: 10 }}>
                                SELECT 1 FUNNEL FOR {mode.label.toUpperCase()}
                              </div>
                              <div style={{ display: "grid", gap: 6 }}>
                                {available.map(({ funnel, rel, channelId }) => {
                                  const isSelected = pick?.funnelId === funnel.id;
                                  const cfg = RELEVANCE_CONFIG[rel];
                                  const ch = CHANNEL_STRATEGIES.find(c => c.id === channelId);
                                  return (
                                    <button key={funnel.id} onClick={(e) => {
                                      e.stopPropagation();
                                      if (isSelected) {
                                        setAudienceFunnelPicks(prev => { const n = { ...prev }; delete n[mode.id]; return n; });
                                      } else {
                                        setAudienceFunnelPicks(prev => ({ ...prev, [mode.id]: { funnelId: funnel.id, channelId } }));
                                        // Auto-collapse after picking so user can move to next mode
                                        setAudience(null);
                                      }
                                    }} style={{
                                      width: "100%", background: isSelected ? `${mode.hex}12` : "rgba(0,0,0,0.2)",
                                      border: `1px solid ${isSelected ? mode.hex : "rgba(255,255,255,0.06)"}`,
                                      borderRadius: 8, padding: "10px 14px", cursor: "pointer", textAlign: "left",
                                      transition: "all 0.15s"
                                    }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        {/* Selection indicator */}
                                        <div style={{
                                          width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                                          border: `2px solid ${isSelected ? mode.hex : "#334155"}`,
                                          background: isSelected ? mode.hex : "transparent",
                                          display: "flex", alignItems: "center", justifyContent: "center",
                                          fontSize: 12, color: "#080c14"
                                        }}>{isSelected ? "✓" : ""}</div>

                                        <span style={{ fontSize: 16 }}>{funnel.icon}</span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: isSelected ? mode.hex : "#e2e8f0", letterSpacing: 1 }}>{funnel.name}</span>
                                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "1px 6px", background: `${cfg.color}12`, border: `1px solid ${cfg.color}30`, borderRadius: 3, color: cfg.color }}>{cfg.label}</span>
                                          </div>
                                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#64748b", marginTop: 2 }}>{funnel.subtitle}</div>
                                        </div>

                                        {/* Channel + meta — hidden on mobile */}
                                        <div className="funnel-pick-meta" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                                          {ch && (
                                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "1px 6px", background: `${ch.hex}10`, border: `1px solid ${ch.hex}20`, borderRadius: 3, color: ch.hex, display: "flex", alignItems: "center", gap: 3 }}>
                                              <span style={{ fontSize: 10 }}>{ch.icon}</span> {ch.label}
                                            </span>
                                          )}
                                          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#475569" }}>
                                            {funnel.complexity} · {funnel.time_to_build}
                                          </span>
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5 — CAMPAIGN STRATEGY SUMMARY */}
            {market && constraint && budget && productType && Object.keys(audienceFunnelPicks).length > 0 && (
              <div id="step-05" style={{ marginBottom: 28 }} className="fade-in">
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: 2, marginBottom: 4 }}>
                  <span style={{ color: "#94a3b8" }}>STEP 05 — </span><span style={{ color: "#34d399" }}>YOUR CAMPAIGN STRATEGY</span>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#7a9bbf", marginBottom: 16, lineHeight: 1.6 }}>
                  {Object.keys(audienceFunnelPicks).length} campaign{Object.keys(audienceFunnelPicks).length !== 1 ? "s" : ""} across {Object.keys(audienceFunnelPicks).length} audience discovery mode{Object.keys(audienceFunnelPicks).length !== 1 ? "s" : ""}.
                  Each campaign targets a different way people discover your offer.
                </div>

                {(() => {
                  const pt = PRODUCT_TYPES.find(p => p.id === productType);
                  if (!pt) return null;

                  return (
                    <div>
                      {/* Per-audience campaign cards */}
                      <div style={{ display: "grid", gap: 16, marginBottom: 20 }}>
                        {Object.entries(audienceFunnelPicks).map(([modeId, pick]) => {
                          const mode = AUDIENCE_MODES.find(m => m.id === modeId);
                          const funnel = FUNNELS.find(f => f.id === pick.funnelId);
                          const ch = CHANNEL_STRATEGIES.find(c => c.id === pick.channelId);
                          const ep = pt.engagement_path?.[modeId];
                          const guidance = funnel ? getChannelFunnelGuidance(funnel, pick.channelId) : null;
                          if (!mode || !funnel) return null;

                          return (
                            <div key={modeId} className="text-wrap" style={{ border: `1px solid ${mode.hex}30`, borderRadius: 12, overflow: "hidden" }}>
                              {/* Campaign header */}
                              <div style={{ background: `${mode.hex}10`, padding: "12px 18px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, borderBottom: `1px solid ${mode.hex}18` }}>
                                <span style={{ fontSize: 22 }}>{mode.icon}</span>
                                <div>
                                  <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: mode.hex, letterSpacing: 1 }}>{mode.label}</div>
                                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8" }}>{mode.subtitle}</div>
                                </div>
                                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{ fontSize: 16 }}>{funnel.icon}</span>
                                  <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#e2e8f0", letterSpacing: 1 }}>{funnel.name}</span>
                                  {ch && <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, padding: "1px 6px", background: `${ch.hex}10`, border: `1px solid ${ch.hex}20`, borderRadius: 3, color: ch.hex }}>via {ch.icon} {ch.label}</span>}
                                </div>
                              </div>

                              <div style={{ padding: "14px 18px" }}>
                                {/* Engagement path */}
                                {ep && (
                                  <div style={{ marginBottom: 14 }}>
                                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: pt.hex, letterSpacing: 2, marginBottom: 8 }}>
                                      ENGAGEMENT PATH — {modeId.toUpperCase()} AUDIENCE
                                    </div>
                                    <div className="rg-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                                      <div style={{ background: "#040810", borderRadius: 6, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#34d399", letterSpacing: 2, marginBottom: 3 }}>① FIRST ACTION</div>
                                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{ep.action}</div>
                                      </div>
                                      <div style={{ background: "#040810", borderRadius: 6, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#f59e0b", letterSpacing: 2, marginBottom: 3 }}>② WHAT HAPPENS NEXT</div>
                                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{ep.next}</div>
                                      </div>
                                      <div style={{ background: "#040810", borderRadius: 6, padding: "10px 12px", border: "1px solid rgba(56,189,248,0.08)" }}>
                                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#38bdf8", letterSpacing: 2, marginBottom: 3 }}>③ ZOHO AUTOMATION</div>
                                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{ep.zoho}</div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Channel delivery tip */}
                                {guidance && (
                                  <div style={{ background: `${ch?.hex || mode.hex}08`, borderRadius: 6, padding: "10px 14px", marginBottom: 12, borderLeft: `3px solid ${ch?.hex || mode.hex}50` }}>
                                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: ch?.hex || mode.hex, letterSpacing: 2, marginBottom: 3 }}>
                                      {(ch?.label || "CHANNEL").toUpperCase()} IMPLEMENTATION
                                    </div>
                                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>{guidance.deliveryTip}</div>
                                  </div>
                                )}

                                {/* Stage flow */}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                                  {funnel.stages.map((stage, i) => (
                                    <Fragment key={i}>
                                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, padding: "3px 8px", background: `${mode.hex}10`, border: `1px solid ${mode.hex}20`, borderRadius: 4, color: mode.hex }}>{stage.label}</span>
                                      {i < funnel.stages.length - 1 && <span style={{ color: "#334155", fontSize: 12 }}>→</span>}
                                    </Fragment>
                                  ))}
                                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", marginLeft: 8 }}>{funnel.complexity} · {funnel.time_to_build}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Budget note */}
                      {pt.budget_notes[budget] && (
                        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: 16 }}>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", letterSpacing: 2, marginBottom: 4 }}>BUDGET STRATEGY NOTE — {budget.toUpperCase()} BUDGET</div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#94a3b8", lineHeight: 1.7 }}>{pt.budget_notes[budget]}</div>
                        </div>
                      )}

                      {/* CTA to Your Plan tab */}
                      <div style={{
                        background: "linear-gradient(135deg, rgba(56,189,248,0.08) 0%, rgba(52,211,153,0.08) 100%)",
                        border: "2px solid rgba(56,189,248,0.3)", borderRadius: 16, padding: "32px 28px", marginBottom: 20, textAlign: "center",
                        boxShadow: "0 0 30px rgba(56,189,248,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                      }}>
                        <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "#e2e8f0", letterSpacing: 2, marginBottom: 8 }}>
                          Your Campaign Plan Is Ready
                        </div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#94a3b8", lineHeight: 1.7, marginBottom: 20, maxWidth: 480, margin: "0 auto 20px" }}>
                          View your full campaign blueprint, engagement paths, stage-by-stage builds, DM scripts, and funnel priority — all in one place.
                        </div>
                        <button onClick={() => { setActiveTab("your_plan"); window.scrollTo(0, 0); }} style={{
                          fontFamily: "var(--font-mono)", fontSize: 18, color: "#080c14", background: "linear-gradient(135deg, #38bdf8, #34d399)",
                          border: "none", borderRadius: 10, padding: "16px 48px", cursor: "pointer", letterSpacing: 3, fontWeight: "bold",
                          transition: "all 0.2s", boxShadow: "0 4px 20px rgba(56,189,248,0.3)"
                        }}>
                          VIEW YOUR PLAN →
                        </button>
                      </div>

                      {/* Toggle for full funnel reference */}
                      <div style={{ marginTop: 24, marginBottom: 14 }}>
                        <button onClick={() => setShowAllFunnels(v => !v)} style={{
                          width: "100%", background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.18)",
                          borderRadius: 10, padding: "14px 18px", cursor: "pointer", textAlign: "left", transition: "all 0.2s"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#34d399", letterSpacing: 2, marginBottom: 4 }}>
                                {showAllFunnels ? "▲ HIDE" : "▼ VIEW"} ALL {FUNNELS.length} FUNNEL TYPES — REFERENCE LIBRARY
                              </div>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8" }}>
                                Full funnel detail cards grouped by category and scored for your selections
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                              {Object.entries(RELEVANCE_CONFIG).map(([key, cfg]) => (
                                <span key={key} style={{ fontFamily: "var(--font-mono)", fontSize: 12, padding: "2px 8px", background: `${cfg.color}12`, border: `1px solid ${cfg.color}30`, borderRadius: 4, color: cfg.color }}>{cfg.label}</span>
                              ))}
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Funnels grouped by category — collapsible reference */}
                      {showAllFunnels && FUNNEL_CATEGORIES.map(cat => {
                        const catFunnels = FUNNELS.filter(f => f.category === cat.id);
                        // Score and sort: primary → recommended → relevant → low
                        const order = { primary: 0, recommended: 1, relevant: 2, low: 3 };
                        const firstAudience = Object.keys(audienceFunnelPicks)[0] || audience || "interruption";
                        const scored = catFunnels.map(f => ({ funnel: f, rel: getFunnelRelevance(f, { productType, constraint, audience: firstAudience }) }));
                        scored.sort((a, b) => order[a.rel] - order[b.rel]);
                        const highlightCount = scored.filter(s => s.rel !== "low").length;

                        return (
                          <div key={cat.id} style={{ marginBottom: 24 }}>
                            {/* Category header */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${cat.hex}25` }}>
                              <span style={{ fontSize: 20 }}>{cat.icon}</span>
                              <div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: cat.hex, letterSpacing: 3 }}>{cat.label}</div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8" }}>{cat.desc}</div>
                              </div>
                              <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8" }}>
                                {highlightCount > 0 && <span style={{ color: cat.hex }}>{highlightCount} highlighted</span>} · {scored.length} total
                              </div>
                            </div>
                            {/* Funnel cards for this category */}
                            <div style={{ display: "grid", gap: 8 }}>
                              {scored.map(({ funnel, rel }) => {
                                const cfg = RELEVANCE_CONFIG[rel];
                                return (
                                  <FunnelFlowCard
                                    key={funnel.id}
                                    funnel={funnel}
                                    isPrimary={funnel.id === pt.funnels_ranked?.[0] && rel === "primary"}
                                    isExpanded={expandedFunnel === funnel.id}
                                    onToggle={() => setExpandedFunnel(expandedFunnel === funnel.id ? null : funnel.id)}
                                    relevance={rel}
                                    relevanceCfg={cfg}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            <BrandedFooter />
          </div>
        )}

        {/* NAMING TAB */}
        {activeTab === "naming" && (
          <div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:44, letterSpacing:3, marginBottom:6 }}>NAMING CONVENTION <span style={{ color:"#38bdf8" }}>SYSTEM</span></div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:21, color:"#94a3b8", marginBottom:24 }}>Every character tells you the stage, sequence number, version, variant, platform, and format — at a glance.</div>
            <div style={{ background:"var(--surface)", borderRadius:14, padding:22, marginBottom:22, border:"1px solid var(--border)" }}>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:19, color:"#94a3b8", letterSpacing:2, marginBottom:14 }}>STRUCTURE</div>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap", alignItems:"flex-end", marginBottom:18 }}>
                {[
                  { part:"[STAGE]", color:"#38bdf8", desc:"AWR/CON/SOL/RET" },
                  { part:"-", color:"#64748b" },
                  { part:"[SEQ]", color:"#f59e0b", desc:"1, 2, 3…" },
                  { part:".", color:"#64748b" },
                  { part:"[VER]", color:"#34d399", desc:"0, 1, 2…" },
                  { part:"[VAR]", color:"#a78bfa", desc:"A, B, C" },
                  { part:"_", color:"#64748b" },
                  { part:"[PLATFORM]", color:"#f472b6", desc:"META/GOOGLE/EMAIL…" },
                  { part:"_", color:"#64748b" },
                  { part:"[FORMAT]", color:"#94a3b8", desc:"VIDEO/IMAGE/SEARCH" },
                ].map((p, i) => (
                  p.desc
                    ? <div key={i} style={{ textAlign:"center" }}>
                        <div style={{ fontFamily:"var(--font-display)", fontSize:28, color:p.color, letterSpacing:1 }}>{p.part}</div>
                        <div style={{ fontFamily:"var(--font-mono)", fontSize:17, color:"#7a9bbf", marginTop:2 }}>{p.desc}</div>
                      </div>
                    : <div key={i} style={{ fontFamily:"var(--font-display)", fontSize:28, color:p.color, paddingBottom:11 }}>{p.part}</div>
                ))}
              </div>
              <div style={{ display:"grid", gap:7 }}>
                {[
                  { code:"AWR-1.0A_META_VIDEO", desc:"1st awareness video — original launch (ver 0, variant A)" },
                  { code:"AWR-1.1A_META_VIDEO", desc:"Version incremented — CPL up 30%+ or 90 days passed" },
                  { code:"AWR-1.0B_META_VIDEO", desc:"A/B variant B — same version, different hook being tested" },
                  { code:"CON-2.0A_EMAIL", desc:"2nd consideration email sequence — first launch" },
                  { code:"SOL-1.0A_GOOGLE_SEARCH", desc:"1st solution-stage Google Search campaign" },
                  { code:"RET-1.0A_EMAIL", desc:"1st retention / upsell email sequence" },
                ].map((ex, i) => (
                  <div key={i} style={{ display:"flex", gap:14, alignItems:"center", padding:"9px 12px", background:"#040810", borderRadius:8, border:"1px solid rgba(99,179,237,0.07)" }}>
                    <NamingBadge campaign={ex.code} stage={ex.code.split("-")[0]} />
                    <div style={{ fontFamily:"var(--font-mono)", fontSize:20, color:"#94a3b8" }}>{ex.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rg-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div style={{ background:"var(--surface)", borderRadius:12, padding:18, border:"1px solid rgba(248,113,113,0.18)" }}>
                <div style={{ fontFamily:"var(--font-mono)", fontSize:18, color:"#f87171", letterSpacing:2, marginBottom:12 }}>WHEN TO INCREMENT VERSION (1.0 → 1.1)</div>
                {["CPL increases 30%+ over your baseline","CTR drops below 1% on cold audiences","90 days active on the same creative","500+ leads generated — proven, now refresh","Significant offer or price change"].map((r,i) => (
                  <div key={i} style={{ fontFamily:"var(--font-mono)", fontSize:21, color:"#64748b", padding:"5px 0", borderBottom:i<4?"1px solid rgba(248,113,113,0.05)":"none", display:"flex", gap:8 }}>
                    <span style={{ color:"#f87171" }}>↑</span>{r}
                  </div>
                ))}
              </div>
              <div style={{ background:"var(--surface)", borderRadius:12, padding:18, border:"1px solid rgba(167,139,250,0.18)" }}>
                <div style={{ fontFamily:"var(--font-mono)", fontSize:18, color:"#a78bfa", letterSpacing:2, marginBottom:12 }}>WHEN TO USE VARIANT (A → B)</div>
                {["A/B testing headline or hook copy","Two different creative angles in parallel","UGC vs polished production comparison","Testing CTA wording or button copy","Same version — different message, run simultaneously"].map((r,i) => (
                  <div key={i} style={{ fontFamily:"var(--font-mono)", fontSize:21, color:"#64748b", padding:"5px 0", borderBottom:i<4?"1px solid rgba(167,139,250,0.05)":"none", display:"flex", gap:8 }}>
                    <span style={{ color:"#a78bfa" }}>⇄</span>{r}
                  </div>
                ))}
              </div>
            </div>
            <BrandedFooter />
          </div>
        )}

        {/* GLOSSARY TAB */}
        {activeTab === "glossary" && (
          <div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:44, letterSpacing:3, marginBottom:6 }}>GLOSSARY <span style={{ color:"#38bdf8" }}>& KEY</span></div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:15, color:"#94a3b8", marginBottom:28, lineHeight:1.7 }}>Every abbreviation, acronym, and term used across this framework — defined plainly.</div>

            {/* FUNNEL STAGES */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:24, letterSpacing:2, color:"#38bdf8", marginBottom:16 }}>FUNNEL STAGE PREFIXES</div>
              <div style={{ display:"grid", gap:10 }}>
                {[
                  { term:"AWR", full:"Awareness", color:"#38bdf8", def:"Top of funnel. The audience has never heard of you or may not even know their problem has a solution. Goal: get seen by the right people and earn a first touchpoint. Campaigns focus on reach, impressions, and opt-ins." },
                  { term:"CON", full:"Consideration", color:"#f59e0b", def:"Middle of funnel. The audience knows you exist and has shown some interest but hasn't committed. Goal: build trust, demonstrate expertise, and move them closer to a buying decision through education and social proof." },
                  { term:"SOL", full:"Solution / Decision", color:"#34d399", def:"Bottom of funnel. The audience is actively evaluating whether your solution is right for them. Goal: convert interest into a booked call, a purchase, or a signed proposal. Campaigns focus on specific offers, urgency, and objection handling." },
                  { term:"RET", full:"Retention", color:"#a78bfa", def:"Post-purchase. The customer has already bought. Goal: maximise lifetime value (LTV) through upsells, cross-sells, referrals, and repeat purchases. The most cost-effective stage — no acquisition cost required." },
                ].map((g, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"90px 130px 1fr", gap:16, alignItems:"flex-start", background:"var(--surface)", borderRadius:10, padding:"16px 20px", border:`1px solid ${g.color}25` }}>
                    <div style={{ fontFamily:"var(--font-display)", fontSize:28, color:g.color, letterSpacing:2 }}>{g.term}</div>
                    <div>
                      <div style={{ fontFamily:"var(--font-mono)", fontSize:14, color:"#94a3b8", marginBottom:4 }}>{g.full}</div>
                      <div style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"#94a3b8" }}>Campaign prefix</div>
                    </div>
                    <div style={{ fontFamily:"var(--font-mono)", fontSize:14, color:"#64748b", lineHeight:1.8 }}>{g.def}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PERFORMANCE METRICS */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:24, letterSpacing:2, color:"#f59e0b", marginBottom:16 }}>PERFORMANCE METRICS</div>
              <div className="rg-glossary" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                  { term:"CPL", full:"Cost Per Lead", def:"How much you pay in ad spend to acquire one new lead (opt-in, form fill, or enquiry). Calculated as: Total Ad Spend ÷ Number of Leads. A rising CPL signals creative fatigue or audience exhaustion." },
                  { term:"CPA", full:"Cost Per Acquisition", def:"How much you pay to acquire one paying customer. Includes all spend across the funnel. Calculated as: Total Ad Spend ÷ Number of Sales. The ultimate paid ads health metric." },
                  { term:"CTR", full:"Click-Through Rate", def:"The percentage of people who saw your ad and clicked it. Calculated as: Clicks ÷ Impressions × 100. A CTR below 1% on cold audiences typically signals a weak hook or mismatched audience." },
                  { term:"CPM", full:"Cost Per 1,000 Impressions", def:"How much it costs to show your ad to 1,000 people. A high CPM means the platform is charging more per eyeball — usually due to audience competition, low relevance score, or narrow targeting." },
                  { term:"ROAS", full:"Return On Ad Spend", def:"Revenue generated for every dollar spent on ads. Calculated as: Revenue from Ads ÷ Ad Spend. A ROAS of 3x means you made $3 for every $1 spent. Target ROAS varies by margin — typically 3x minimum for service businesses." },
                  { term:"LTV", full:"Lifetime Value", def:"Total revenue a single customer generates across their entire relationship with your business. The higher your LTV, the more you can afford to spend acquiring each customer. LTV is why the RET stage exists." },
                  { term:"CAC", full:"Customer Acquisition Cost", def:"Total cost to acquire one new customer across all marketing and sales activities (not just ads). Calculated as: Total Marketing + Sales Cost ÷ New Customers. Healthy businesses have LTV significantly higher than CAC." },
                  { term:"CR", full:"Conversion Rate", def:"The percentage of people who take a desired action — opt-in, call booking, or purchase. Calculated as: Conversions ÷ Visitors × 100. Improving CR is usually more cost-effective than increasing ad spend." },
                ].map((g, i) => (
                  <div key={i} style={{ background:"var(--surface)", borderRadius:10, padding:"16px 18px", border:"1px solid rgba(99,179,237,0.1)" }}>
                    <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:8 }}>
                      <div style={{ fontFamily:"var(--font-display)", fontSize:24, color:"#f59e0b", letterSpacing:1 }}>{g.term}</div>
                      <div style={{ fontFamily:"var(--font-mono)", fontSize:13, color:"#94a3b8" }}>{g.full}</div>
                    </div>
                    <div style={{ fontFamily:"var(--font-mono)", fontSize:13, color:"#94a3b8", lineHeight:1.8 }}>{g.def}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* UTM TERMS */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:24, letterSpacing:2, color:"#34d399", marginBottom:16 }}>UTM TRACKING TERMS</div>
              <div style={{ display:"grid", gap:10 }}>
                {[
                  { term:"UTM", full:"Urchin Tracking Module", def:"A set of URL parameters added to any link you share that tell your analytics platform exactly where that click came from. Named after Urchin Software, acquired by Google in 2005. Every UTM-tagged click creates a data record in Zoho MA, CRM, and Google Analytics." },
                  { term:"utm_source", full:"Traffic Source", def:"Identifies which platform sent the traffic. Examples: meta, google, tiktok, email, linkedin. Think of it as 'which door did they walk through?' Maps directly to your platform column in Zoho reporting." },
                  { term:"utm_medium", full:"Marketing Channel / Funnel Stage", def:"In this framework, utm_medium is repurposed to track funnel stage rather than generic channel type (e.g. 'cpc' or 'email'). Values: awareness, consideration, solution, retention. This allows Zoho MA workflows to automatically route leads to the correct nurture sequence." },
                  { term:"utm_campaign", full:"Campaign Name Code", def:"Your full naming convention code goes here: e.g. AWR-1.0A_META_VIDEO. This is the single most important UTM field — it connects every click back to the exact campaign version and variant that generated it, enabling precise A/B test attribution." },
                  { term:"utm_content", full:"Creative Variant Identifier", def:"Identifies which specific creative, hook, or content piece was clicked. Examples: hook_wasted_time, testimonial_john, case_study_60pct. Used to compare creative performance within the same campaign — which ad angle is generating the best quality leads." },
                  { term:"utm_term", full:"Target Audience Segment", def:"In paid search, this captures the keyword. In this framework it's repurposed to tag the target audience segment: smb_marketing_managers, zoho_users, small_business_owners. Enables segmentation of leads by the audience pool they came from." },
                  { term:"MA", full:"Marketing Automation", def:"Refers to Zoho Marketing Automation — the platform that captures UTM data from form submissions, scores leads, routes contacts into email sequences (journeys), and manages all nurture communication before a lead is qualified into the CRM." },
                  { term:"CRM", full:"Customer Relationship Management", def:"Refers to Zoho CRM — where qualified leads are transferred once they meet the lead score threshold. The CRM manages deals, proposals, sales pipeline stages, and closed customers." },
                ].map((g, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"160px 1fr", gap:16, alignItems:"flex-start", background:"var(--surface)", borderRadius:10, padding:"14px 18px", border:"1px solid rgba(52,211,153,0.12)" }}>
                    <div>
                      <div style={{ fontFamily:"var(--font-mono)", fontSize:15, color:"#34d399", marginBottom:4 }}>{g.term}</div>
                      <div style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"#94a3b8", lineHeight:1.5 }}>{g.full}</div>
                    </div>
                    <div style={{ fontFamily:"var(--font-mono)", fontSize:13, color:"#64748b", lineHeight:1.8 }}>{g.def}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CAMPAIGN STRUCTURE TERMS */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:24, letterSpacing:2, color:"#a78bfa", marginBottom:16 }}>CAMPAIGN STRUCTURE TERMS</div>
              <div className="rg-glossary" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                  { term:"VSL", full:"Video Sales Letter", def:"A video that performs the job of a traditional long-form sales letter. Typically 10–20 minutes. Lives on Page 2 of the Surfboard Funnel. Structure: identify the problem, agitate the pain, introduce the solution, prove it works, make the offer, overcome objections, call to action." },
                  { term:"UGC", full:"User Generated Content", def:"Content filmed and presented in the style of an organic user post — typically a talking head on a phone, casual setting, authentic feel. Not professionally produced. UGC-style ads consistently outperform polished brand videos on Meta and TikTok because they look native to the feed." },
                  { term:"CTA", full:"Call To Action", def:"The specific instruction you give your audience about what to do next. 'Download the free audit', 'Book your strategy call', 'Comment AUDIT below'. Every piece of content and every ad should have exactly one CTA. Multiple CTAs divide attention and reduce conversion rates." },
                  { term:"A/B Test", full:"Split Test", def:"Running two versions of a campaign simultaneously with one variable changed between them (e.g. two different hooks, two different headlines). In the naming convention, variants are labelled A and B. The winner informs the next version increment." },
                  { term:"Lead Score", full:"Contact Engagement Score", def:"A numerical value assigned to each contact in Zoho MA based on their behaviours — opening emails, clicking links, visiting pages, booking calls. AWR opt-in = +10 points. Call booked = +50 points. Leads are transferred to CRM when they cross a defined threshold (typically 50+)." },
                  { term:"RLSA", full:"Remarketing Lists for Search Ads", def:"A Google Ads feature that lets you adjust your search ad bids or messaging for people who have previously visited your website. Warm visitors searching relevant keywords get a higher bid multiplier — you pay more to recapture high-intent warm traffic." },
                  { term:"Pixel", full:"Tracking Pixel", def:"A small piece of code installed on your website (Meta Pixel, Google Tag) that records visitor behaviour and builds retargeting audiences. When someone visits your site, the pixel fires and adds them to your warm audience pool for subsequent retargeting campaigns." },
                  { term:"Surfboard Funnel", full:"3-Page Sales System (Mike Killen)", def:"The core funnel framework used in this system. Page 1: Opt-In (generates leads). Page 2: Offer / VSL (generates sales). Page 3: Upsell (generates profit). The critical rule: never leave someone on the opt-in page — always redirect immediately to the offer page." },
                ].map((g, i) => (
                  <div key={i} style={{ background:"var(--surface)", borderRadius:10, padding:"16px 18px", border:"1px solid rgba(167,139,250,0.12)" }}>
                    <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:8 }}>
                      <div style={{ fontFamily:"var(--font-display)", fontSize:22, color:"#a78bfa", letterSpacing:1 }}>{g.term}</div>
                      <div style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"#94a3b8" }}>{g.full}</div>
                    </div>
                    <div style={{ fontFamily:"var(--font-mono)", fontSize:13, color:"#94a3b8", lineHeight:1.8 }}>{g.def}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AUDIENCE TERMS */}
            <div style={{ marginBottom:10 }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:24, letterSpacing:2, color:"#f472b6", marginBottom:16 }}>AUDIENCE & PLATFORM TERMS</div>
              <div className="rg-glossary" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                  { term:"Lookalike Audience", full:"LAL / LLA", def:"A targeting option on Meta and TikTok that finds new people who share characteristics with an existing audience (your email list, your pixel visitors, your past customers). Used for cold prospecting — you're finding cold people who statistically resemble your warm or hot audiences." },
                  { term:"Custom Audience", full:"Retargeting Audience", def:"An audience built from people who have already interacted with you — website visitors, video viewers, email list uploads, past customers. Used for warm and hot market campaigns. More expensive per impression than cold audiences but converts at significantly higher rates." },
                  { term:"Frequency", full:"Ad Frequency Score", def:"The average number of times one person has seen your ad within a given time period. On Meta, a frequency above 3.0 on the same audience typically signals creative fatigue — people have seen it too many times and are starting to ignore or hide it." },
                  { term:"Quality Score", full:"Google Ad Relevance Score", def:"Google's assessment (1–10) of how relevant your keyword, ad copy, and landing page are to each other. A higher Quality Score means lower CPCs and better ad position. A poor Quality Score means you pay more for worse placement." },
                  { term:"SMB", full:"Small to Medium Business", def:"Typically businesses with 5–200 employees, annual revenue between $500K and $50M, and a marketing manager or business owner making purchasing decisions around technology and workflow systems. A common target market for service-based and SaaS businesses." },
                  { term:"Zoho One", full:"Zoho's All-in-One Business Suite", def:"The subscription package that includes the full suite of Zoho applications — CRM, Marketing Automation, Campaigns, Sites, Forms, Analytics, Commerce, TrainerCentral, and 40+ other tools. The technical ecosystem this entire marketing framework is built within and sold as a service." },
                ].map((g, i) => (
                  <div key={i} style={{ background:"var(--surface)", borderRadius:10, padding:"16px 18px", border:"1px solid rgba(244,114,182,0.12)" }}>
                    <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:8, flexWrap:"wrap" }}>
                      <div style={{ fontFamily:"var(--font-display)", fontSize:20, color:"#f472b6", letterSpacing:1 }}>{g.term}</div>
                      <div style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"#94a3b8" }}>{g.full}</div>
                    </div>
                    <div style={{ fontFamily:"var(--font-mono)", fontSize:13, color:"#94a3b8", lineHeight:1.8 }}>{g.def}</div>
                  </div>
                ))}
              </div>
            </div>
            <BrandedFooter />
          </div>
        )}

        {/* UTM TAB */}
        {activeTab === "utm_map" && (
          <div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:44, letterSpacing:3, marginBottom:6 }}>UTM PARAMETER <span style={{ color:"#38bdf8" }}>MAP</span></div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:21, color:"#94a3b8", marginBottom:22 }}>Your naming convention IS your UTM tracking data — what you name it, you track it.</div>
            <div style={{ background:"var(--surface)", borderRadius:14, padding:18, marginBottom:18, border:"1px solid var(--border)" }}>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:18, color:"#94a3b8", letterSpacing:2, marginBottom:12 }}>COMPLETE TRACKING FLOW</div>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                {[
                  {label:"Ad Click",color:"#38bdf8"},{label:"→"},
                  {label:"Landing Page + UTMs",color:"#f59e0b"},{label:"→"},
                  {label:"Zoho Form Submit",color:"#34d399"},{label:"→"},
                  {label:"MA Contact Created",color:"#a78bfa"},{label:"→"},
                  {label:"Auto-Route to Sequence",color:"#f472b6"},{label:"→"},
                  {label:"CRM if Qualified",color:"#38bdf8"},
                ].map((s,i) => (
                  s.label==="→"
                    ? <span key={i} style={{ color:"#64748b", fontSize:26 }}>→</span>
                    : <span key={i} style={{ fontFamily:"var(--font-mono)", fontSize:20, padding:"3px 10px", background:`${s.color}10`, border:`1px solid ${s.color}28`, borderRadius:6, color:s.color }}>{s.label}</span>
                ))}
              </div>
            </div>
            <div style={{ background:"var(--surface)", borderRadius:14, border:"1px solid var(--border)", overflow:"hidden", marginBottom:18 }}>
              <div style={{ padding:"12px 16px", borderBottom:"1px solid var(--border)", fontFamily:"var(--font-mono)", fontSize:18, color:"#94a3b8", letterSpacing:2 }}>UTM PARAMETER REFERENCE</div>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"rgba(99,179,237,0.03)" }}>
                    {["Parameter","Maps To","Your Values","Example"].map(h => (
                      <th key={h} style={{ fontFamily:"var(--font-mono)", fontSize:18, color:"#7a9bbf", padding:"9px 12px", textAlign:"left", letterSpacing:1, borderBottom:"1px solid var(--border)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["utm_source","Traffic platform","meta, google, tiktok, email, linkedin, organic_ig, organic_tt","meta"],
                    ["utm_medium","Funnel stage","awareness, consideration, solution, retention","awareness"],
                    ["utm_campaign","Full naming code","AWR-1.0A_META_VIDEO, SOL-1.0A_GOOGLE_SEARCH","AWR-1.0A_META_VIDEO"],
                    ["utm_content","Creative variant","hook_wasted_time, testimonial_john, case_study, ugc_v1","hook_wasted_time"],
                    ["utm_term","Target audience","smb_marketing_managers, zoho_users, small_business_owners","smb_marketing_managers"],
                  ].map((row,i) => (
                    <tr key={i} style={{ borderBottom:"1px solid rgba(99,179,237,0.04)" }}>
                      {row.map((cell,j) => (
                        <td key={j} style={{ padding:"12px 14px", fontFamily:"var(--font-mono)", fontSize:j===0?18:16, color:j===0?"#38bdf8":j===3?"#f59e0b":"#94a3b8", lineHeight:1.6 }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:30, letterSpacing:2, marginBottom:12 }}>CROSS-PLATFORM <span style={{ color:"#38bdf8" }}>MATRIX</span></div>
            <div className="table-scroll" style={{ background:"var(--surface)", borderRadius:14, border:"1px solid var(--border)", overflow:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:520 }}>
                <thead>
                  <tr style={{ background:"rgba(99,179,237,0.03)" }}>
                    {["Campaign Code","Stage","Meta","Google","TikTok","Email","Audience Mode","Journey Sequence"].map(h => (
                      <th key={h} style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"#7a9bbf", padding:"7px 6px", textAlign:"left", letterSpacing:1, borderBottom:"1px solid var(--border)", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["AWR-1.0A","AWR","VIDEO","Display","—","—","Interruption","AWR_Welcome_Series_1.0"],
                    ["AWR-2.0A","AWR","Carousel","—","VIDEO","—","Interruption","AWR_Retarget_2.0"],
                    ["CON-1.0A","CON","Image","Search","—","Seq 1","Intent + Owned","CON_Nurturing_Sequence"],
                    ["CON-2.0A","CON","—","Search","—","Seq 2","Intent + Owned","CON_Deep_Nurture_2.0"],
                    ["SOL-1.0A","SOL","VIDEO","Search","—","Seq 3","Intent + Interruption","SOL_Conversion_Push"],
                    ["RET-1.0A","RET","—","—","—","Upsell","Owned","RET_Upsell_Series_1.0"],
                  ].map((row,i) => {
                    const sc = stageColors[row[1]] || "#94a3b8";
                    return (
                      <tr key={i} style={{ borderBottom:"1px solid rgba(99,179,237,0.03)" }}>
                        <td style={{ padding:"7px 6px", fontFamily:"var(--font-mono)", fontSize:13, color:sc }}>{row[0]}</td>
                        <td style={{ padding:"7px 6px" }}>
                          <span style={{ fontFamily:"var(--font-mono)", fontSize:12, padding:"2px 5px", background:`${sc}15`, border:`1px solid ${sc}30`, borderRadius:4, color:sc }}>{row[1]}</span>
                        </td>
                        {row.slice(2).map((cell,j) => (
                          <td key={j} style={{ padding:"7px 6px", fontFamily:"var(--font-mono)", fontSize:13, color:cell==="—"?"#64748b":"#94a3b8" }}>{cell}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <BrandedFooter />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* YOUR PLAN TAB                                      */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "your_plan" && (() => {
          const strategy = market && constraint && budget ? getStrategy(market, constraint, budget) : null;
          const pt = PRODUCT_TYPES.find(p => p.id === productType);
          const mc = MARKET_CONDITIONS.find(m => m.id === market);
          const cn = CONSTRAINTS.find(c => c.id === constraint);
          const bl = BUDGET_LEVELS.find(b => b.id === budget);
          const audiencePicks = Object.entries(audienceFunnelPicks);
          const totalFunnels = audiencePicks.length;
          const hasMinimum = !!(productType && market && constraint && budget);

          if (!hasMinimum) {
            return (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <img className="empty-state-logo" src={`${import.meta.env.BASE_URL}barebayside-logo.png`} alt="Bare Bayside Labs" style={{ height: 120, objectFit: "contain", marginBottom: 20, opacity: 0.9 }} />
                <div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "#e2e8f0", letterSpacing: 2, marginBottom: 8 }}>YOUR PLAN</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "#94a3b8", lineHeight: 1.8, maxWidth: 500, margin: "0 auto" }}>
                  Complete all steps in the <span style={{ color: "#38bdf8", cursor: "pointer" }} onClick={() => setActiveTab("framework")}>Strategy Selector</span> to generate your full marketing plan.
                  <br /><br />
                  Select your product type → market temperature → constraint → budget → audience mode → pick your funnels.
                </div>
                {/* Show progress */}
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
                  {[
                    { done: !!productType, label: "PRODUCT", color: "#fb923c" },
                    { done: !!market, label: "MARKET", color: "#38bdf8" },
                    { done: !!constraint, label: "CONSTRAINT", color: "#f59e0b" },
                    { done: !!budget, label: "BUDGET", color: "#34d399" },
                    { done: totalFunnels > 0, label: "FUNNELS", color: "#f472b6" },
                  ].map((s, i) => (
                    <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 13, padding: "4px 12px", borderRadius: 20, background: s.done ? `${s.color}15` : "rgba(255,255,255,0.03)", border: `1px solid ${s.done ? s.color + "40" : "rgba(255,255,255,0.06)"}`, color: s.done ? s.color : "#334155" }}>
                      {s.done ? "✓" : "○"} {s.label}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div>
              {/* ═══ HEADER ═══ */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px,5vw,52px)", letterSpacing: 3, marginBottom: 4, background: "linear-gradient(135deg,#e2e8f0 0%,#34d399 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  YOUR MARKETING PLAN
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#64748b" }}>
                  Complete strategy built from your selections — product, market, constraint, budget{totalFunnels > 0 ? `, and ${totalFunnels} campaign${totalFunnels !== 1 ? "s" : ""}` : ""}.
                </div>
              </div>

              {/* ═══ GET PLAN EMAILED + ZOHO IMPLEMENTATION (moved to top) ═══ */}
              <div style={{ marginBottom: 48 }}>
                <div className="email-cta-box" style={{
                  background: "linear-gradient(135deg, rgba(56,189,248,0.10) 0%, rgba(167,139,250,0.10) 50%, rgba(52,211,153,0.10) 100%)",
                  border: "2px solid rgba(56,189,248,0.35)", borderRadius: 18, padding: "16px 32px 40px", textAlign: "center",
                  boxShadow: "0 0 40px rgba(56,189,248,0.08), 0 0 80px rgba(167,139,250,0.04), inset 0 1px 0 rgba(255,255,255,0.06)"
                }}>
                  <img className="email-cta-logo" src={`${import.meta.env.BASE_URL}barebayside-logo.png`} alt="Bare Bayside Labs" style={{ height: 220, objectFit: "contain", marginBottom: -4, opacity: 0.95 }} />
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "#e2e8f0", letterSpacing: 2, marginBottom: 10 }}>
                    Get This Plan Emailed To You
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#c4d5e8", lineHeight: 1.9, marginBottom: 28, maxWidth: 540, margin: "0 auto 28px" }}>
                    Receive your full campaign blueprint, funnel strategies, engagement paths, and implementation steps — plus Zoho templates and automation workflows to bring it all to life.
                  </div>

                  {/* ╔═══════════════════════════════════════════════════════════════╗
                      ║  ZOHO FORM EMBED — PASTE YOUR FORM CODE BELOW               ║
                      ║                                                               ║
                      ║  Replace the placeholder <div> below with your Zoho form      ║
                      ║  embed code (iframe or JS snippet).                           ║
                      ║                                                               ║
                      ║  Options:                                                     ║
                      ║  • Zoho Forms: Settings → Share → Embed → Copy iframe         ║
                      ║  • Zoho CRM Web Form: Setup → Web Forms → Embed              ║
                      ║  • Zoho MA: Lead Gen → Forms → Get Embed Code                ║
                      ╚═══════════════════════════════════════════════════════════════╝ */}
                  <div id="zoho-form-embed" style={{ maxWidth: 500, margin: "0 auto" }}>
                    {/* ── PLACEHOLDER FORM — Replace this entire <div> with your Zoho embed ── */}
                    <div className="email-form-row" style={{ display: "flex", gap: 10 }}>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        style={{
                          flex: 1, fontFamily: "var(--font-mono)", fontSize: 15, color: "#e2e8f0",
                          background: "rgba(0,0,0,0.4)", border: "2px solid rgba(56,189,248,0.35)",
                          borderRadius: 10, padding: "14px 18px", outline: "none", minWidth: 0,
                        }}
                      />
                      <button
                        style={{
                          fontFamily: "var(--font-mono)", fontSize: 15, color: "#080c14",
                          background: "linear-gradient(135deg, #38bdf8, #34d399)",
                          border: "none", borderRadius: 10, padding: "14px 28px", cursor: "pointer",
                          letterSpacing: 2, fontWeight: "bold", whiteSpace: "nowrap",
                          boxShadow: "0 4px 20px rgba(56,189,248,0.3)",
                        }}
                      >
                        SEND MY PLAN
                      </button>
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#8b9dc4", marginTop: 12, lineHeight: 1.6 }}>
                      No spam. You'll receive your personalised campaign plan and Zoho implementation templates.
                    </div>
                    {/* ── END PLACEHOLDER — Your Zoho embed replaces everything above ── */}
                  </div>
                </div>

                {/* Arrow connector to benefits */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 0 }}>
                  <div style={{ width: 3, height: 32, background: "linear-gradient(180deg, rgba(56,189,248,0.5), rgba(52,211,153,0.5))" }} />
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
                    background: "linear-gradient(135deg, rgba(52,211,153,0.12), rgba(56,189,248,0.12))",
                    border: "2px solid rgba(52,211,153,0.35)",
                    borderRadius: 40, padding: "14px 36px",
                    boxShadow: "0 0 30px rgba(52,211,153,0.1), 0 0 60px rgba(52,211,153,0.05)",
                  }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#34d399" }}>+</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#34d399", letterSpacing: 3 }}>YOU ALSO GET</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#34d399" }}>+</span>
                  </div>
                  <div style={{ width: 3, height: 32, background: "linear-gradient(180deg, rgba(52,211,153,0.5), rgba(52,211,153,0.15))" }} />
                  <svg width="28" height="16" viewBox="0 0 28 16" style={{ marginBottom: 4 }}>
                    <path d="M14 16L0 0h28z" fill="rgba(52,211,153,0.5)" />
                  </svg>
                </div>

                {/* What you'll get */}
                <div style={{ textAlign: "center", marginTop: 4, marginBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#e2e8f0", letterSpacing: 2 }}>
                    WHAT YOU'LL RECEIVE
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", marginTop: 6 }}>
                    Enter your email above to get all three delivered to your inbox
                  </div>
                </div>
                {/* Three benefit cards */}
                <div className="rg-benefits" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 0, alignItems: "stretch" }}>
                  {[
                    { icon: "📋", title: "YOUR FULL PLAN", desc: "Complete campaign blueprint with all selections, strategies, and engagement paths — ready to action", color: "#38bdf8", premium: false },
                    { icon: "⚙️", title: "AUTOMATION TEMPLATES", subtitle: "Powered by Zoho", desc: "Pre-built CRM pipelines, Marketing Automation journeys, and email sequences — import directly into your Zoho account", color: "#f5c542", premium: true },
                    { icon: "🚀", title: "IMPLEMENTATION GUIDE", desc: "Step-by-step setup instructions to launch your campaigns and start generating results with Zoho tools", color: "#f5c542", premium: true },
                  ].map((item, i) => (
                    <Fragment key={i}>
                      <div style={{
                        background: item.premium
                          ? "linear-gradient(135deg, rgba(245,197,66,0.10) 0%, rgba(245,158,11,0.06) 100%)"
                          : "var(--surface)",
                        borderRadius: item.premium ? 16 : 14, padding: item.premium ? "26px 22px" : "22px 20px",
                        border: item.premium ? "2px solid rgba(245,197,66,0.35)" : "1px solid rgba(56,189,248,0.15)",
                        textAlign: "left", position: "relative", overflow: "hidden",
                        boxShadow: item.premium ? "0 0 30px rgba(245,197,66,0.08), 0 0 60px rgba(245,158,11,0.04), inset 0 1px 0 rgba(255,255,255,0.08)" : "none",
                      }}>
                        {item.premium && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #f5c542, #f59e0b, transparent)" }} />}
                        <div style={{
                          position: "absolute", top: 10, right: 10, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1,
                          padding: "3px 10px", borderRadius: item.premium ? 20 : 4, fontWeight: "bold",
                          background: item.premium ? "linear-gradient(135deg, rgba(245,197,66,0.2), rgba(245,158,11,0.12))" : "rgba(56,189,248,0.1)",
                          color: item.premium ? "#f5c542" : "#38bdf8",
                          border: `1px solid ${item.premium ? "rgba(245,197,66,0.4)" : "rgba(56,189,248,0.2)"}`,
                          boxShadow: item.premium ? "0 0 10px rgba(245,197,66,0.12)" : "none",
                        }}>
                          {item.premium ? "★ BONUS" : "INCLUDED"}
                        </div>
                        <div style={{ fontSize: item.premium ? 34 : 28, marginBottom: item.premium ? 12 : 10 }}>{item.icon}</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: item.premium ? 16 : 14, color: item.premium ? "#f5c542" : "#38bdf8", letterSpacing: 1, marginBottom: item.subtitle ? 2 : 6, fontWeight: "bold" }}>{item.title}</div>
                        {item.subtitle && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8", letterSpacing: 1, marginBottom: 6 }}>{item.subtitle}</div>}
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: item.premium ? 14 : 13, color: item.premium ? "#e2e8f0" : "#c4d5e8", lineHeight: 1.8 }}>{item.desc}</div>
                      </div>
                      {i < 2 && (
                        <div className="benefit-separator" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px" }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                            background: "linear-gradient(135deg, rgba(245,197,66,0.12), rgba(245,158,11,0.08))",
                            border: "2px solid rgba(245,197,66,0.3)",
                            fontFamily: "var(--font-display)", fontSize: 20, color: "#f5c542",
                            boxShadow: "0 0 12px rgba(245,197,66,0.1)",
                          }}>+</div>
                        </div>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>

              {/* ═══ Divider: Your full plan is below ═══ */}
              <div style={{ textAlign: "center", margin: "0 0 32px", padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", letterSpacing: 2 }}>
                  👇 YOUR FULL PLAN DETAILS BELOW
                </div>
              </div>

              {/* ═══ SECTION 1: STRATEGY SELECTIONS SUMMARY ═══ */}
              <div style={{ marginBottom: 48 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", letterSpacing: 3, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                  01 — YOUR SELECTIONS
                </div>

                {/* Selection flow pill strip */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 16 }}>
                  {[
                    pt && { label: pt.label, icon: pt.icon, hex: pt.hex },
                    mc && { label: mc.label, icon: mc.icon, hex: mc.hex },
                    cn && { label: cn.label, icon: cn.icon, hex: cn.hex },
                    bl && { label: bl.label, icon: bl.icon, hex: "#34d399" },
                  ].filter(Boolean).map((item, i, arr) => (
                    <Fragment key={i}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, padding: "4px 12px", background: `${item.hex}10`, border: `1px solid ${item.hex}25`, borderRadius: 6, color: item.hex, display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span>{item.icon}</span> {item.label}
                      </span>
                      {i < arr.length - 1 && <span style={{ color: "#334155", fontSize: 18 }}>→</span>}
                    </Fragment>
                  ))}
                </div>

                {/* Detailed selection cards */}
                <div className="rg-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                  {/* Product Type */}
                  {pt && (
                    <div className="text-wrap" style={{ background: `${pt.hex}06`, border: `1px solid ${pt.hex}20`, borderRadius: 10, padding: "14px 16px" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#8b9dc4", letterSpacing: 2, marginBottom: 6 }}>STEP 00 · PRODUCT TYPE</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 22 }}>{pt.icon}</span>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: pt.hex, letterSpacing: 1 }}>{pt.label}</div>
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.5, marginBottom: 6 }}>
                        {pt.price_range} · {pt.decision_length}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#8b9dc4", lineHeight: 1.6 }}>{pt.buyer_psychology}</div>
                    </div>
                  )}
                  {/* Market */}
                  {mc && (
                    <div className="text-wrap" style={{ background: `${mc.hex}06`, border: `1px solid ${mc.hex}20`, borderRadius: 10, padding: "14px 16px" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#8b9dc4", letterSpacing: 2, marginBottom: 6 }}>STEP 01 · MARKET TEMPERATURE</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 22 }}>{mc.icon}</span>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: mc.hex, letterSpacing: 1 }}>{mc.label}</div>
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>{mc.short}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#8b9dc4", lineHeight: 1.6 }}>
                        <span style={{ color: mc.hex }}>STAGE:</span> {mc.stage} · <span style={{ color: mc.hex }}>FUNNEL PAGE:</span> {mc.funnelPage}
                      </div>
                    </div>
                  )}
                  {/* Constraint */}
                  {cn && (
                    <div className="text-wrap" style={{ background: `${cn.hex}06`, border: `1px solid ${cn.hex}20`, borderRadius: 10, padding: "14px 16px" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#8b9dc4", letterSpacing: 2, marginBottom: 6 }}>STEP 02 · YOUR BOTTLENECK</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 22 }}>{cn.icon}</span>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: cn.hex, letterSpacing: 1 }}>{cn.label}</div>
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>{cn.subtitle}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#8b9dc4", lineHeight: 1.6 }}>{cn.desc}</div>
                    </div>
                  )}
                  {/* Budget */}
                  {bl && (
                    <div className="text-wrap" style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: 10, padding: "14px 16px" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#8b9dc4", letterSpacing: 2, marginBottom: 6 }}>STEP 03 · BUDGET</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 22 }}>{bl.icon}</span>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#34d399", letterSpacing: 1 }}>{bl.label}</div>
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>{bl.desc}</div>
                      {pt?.budget_notes?.[budget] && (
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#8b9dc4", lineHeight: 1.6, borderTop: "1px solid rgba(52,211,153,0.12)", paddingTop: 8, marginTop: 6 }}>
                          {pt.budget_notes[budget]}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ═══ SECTION 2: CONSTRAINT DIAGNOSIS ═══ */}
              {cn && (
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", letterSpacing: 3, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                    02 — CONSTRAINT DIAGNOSIS
                  </div>
                  <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ background: `${cn.hex}06`, borderRadius: 10, padding: "16px 18px", border: `1px solid ${cn.hex}20` }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: cn.hex, letterSpacing: 2, marginBottom: 10 }}>DIAGNOSTIC SIGNALS</div>
                      {cn.diagnostic.map((d, i) => (
                        <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", display: "flex", gap: 8, marginBottom: 6, lineHeight: 1.5 }}>
                          <span style={{ color: cn.hex, flexShrink: 0 }}>›</span>{d}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "grid", gap: 10 }}>
                      <div style={{ background: "rgba(248,113,113,0.04)", borderRadius: 10, padding: "14px 16px", border: "1px solid rgba(248,113,113,0.12)" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#f87171", letterSpacing: 2, marginBottom: 6 }}>✗ WRONG FIX</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>{cn.wrong_fix}</div>
                      </div>
                      <div style={{ background: "rgba(52,211,153,0.04)", borderRadius: 10, padding: "14px 16px", border: "1px solid rgba(52,211,153,0.12)" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#34d399", letterSpacing: 2, marginBottom: 6 }}>✓ RIGHT FIX</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>{cn.right_fix}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ SECTION 3: CAMPAIGN BLUEPRINT ═══ */}
              {strategy && (
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", letterSpacing: 3, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                    03 — CAMPAIGN BLUEPRINT
                  </div>
                  <div className="text-wrap" style={{ border: `2px solid ${strategy.color}30`, borderRadius: 12, background: `${strategy.color}05`, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${strategy.color},transparent)` }} />
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,3vw,34px)", color: "#e2e8f0", letterSpacing: 2, marginBottom: 6 }}>{strategy.title}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
                      <span style={{ color: strategy.color }}>SURFBOARD:</span> {strategy.surfboard} · <span style={{ color: strategy.color }}>STAGE:</span> {strategy.stage}
                    </div>

                    {/* Headline + CTA */}
                    <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 10, padding: "16px 18px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#7a9bbf", letterSpacing: 2, marginBottom: 6 }}>HEADLINE — SURFBOARD KILLER OFFER</div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px,2.5vw,26px)", color: "#e2e8f0", letterSpacing: 1, marginBottom: 6 }}>{strategy.headline}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: strategy.color }}>CTA → {strategy.cta}</div>
                    </div>

                    <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                      <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "12px 14px" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#7a9bbf", letterSpacing: 2, marginBottom: 6 }}>CAMPAIGN CODE</div>
                        <NamingBadge campaign={strategy.campaign} stage={strategy.stage} />
                      </div>
                      <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "12px 14px" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#7a9bbf", letterSpacing: 2, marginBottom: 6 }}>PLATFORMS</div>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {strategy.platforms.map(p => (
                            <span key={p} style={{ fontFamily: "var(--font-mono)", fontSize: 12, padding: "2px 8px", background: "rgba(99,179,237,0.07)", border: "1px solid rgba(99,179,237,0.14)", borderRadius: 4, color: "#94a3b8" }}>{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                      <div style={{ background: "rgba(167,139,250,0.04)", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(167,139,250,0.1)" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#a78bfa", letterSpacing: 2, marginBottom: 4 }}>ZOHO MA JOURNEY</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8" }}>{strategy.sequence}</div>
                      </div>
                      <div style={{ background: "rgba(248,113,113,0.04)", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(248,113,113,0.1)" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#f87171", letterSpacing: 2, marginBottom: 4 }}>⚠ VERSION CHANGE TRIGGER</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{strategy.when_to_change}</div>
                      </div>
                    </div>

                    {/* Tactics */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#7a9bbf", letterSpacing: 2, marginBottom: 8 }}>KEY TACTICS</div>
                      <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                        {strategy.tactics.map((t, i) => (
                          <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", display: "flex", gap: 8, lineHeight: 1.5 }}>
                            <span style={{ color: strategy.color, flexShrink: 0 }}>›</span>{t}
                          </div>
                        ))}
                      </div>
                    </div>

                    <UTMBlock utm={strategy.utm} />
                  </div>
                </div>
              )}

              {/* ═══ SECTION 4: AUDIENCE MODE FIT GRADES ═══ */}
              {pt && (
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", letterSpacing: 3, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                    04 — AUDIENCE MODE FIT GRADES
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
                    {AUDIENCE_MODES.map(mode => {
                      const fit = getAudienceFit(productType, mode.id, budget);
                      const fc = fit ? FIT_COLORS[fit.score] : FIT_COLORS.moderate;
                      const pick = audienceFunnelPicks[mode.id];
                      const pickedFunnel = pick ? FUNNELS.find(f => f.id === pick.funnelId) : null;
                      const pickedChannel = pick ? CHANNEL_STRATEGIES.find(c => c.id === pick.channelId) : null;
                      return (
                        <div key={mode.id} style={{ background: pick ? "rgba(52,211,153,0.04)" : `${fc.bg}`, border: `1px solid ${pick ? "rgba(52,211,153,0.25)" : fc.border}`, borderRadius: 10, padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <span style={{ fontSize: 20 }}>{mode.icon}</span>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: mode.hex, letterSpacing: 1 }}>{mode.label}</div>
                          </div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, padding: "2px 10px", background: fc.bg, border: `1px solid ${fc.border}`, borderRadius: 20, color: fc.text, letterSpacing: 1, display: "inline-block", marginBottom: 8 }}>{fc.label}</div>
                          {fit && <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#8b9dc4", lineHeight: 1.6, marginBottom: 8 }}>{fit.reason}</div>}
                          {pick && pickedFunnel && (
                            <div style={{ borderTop: "1px solid rgba(52,211,153,0.15)", paddingTop: 8, marginTop: 4 }}>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#34d399", letterSpacing: 2, marginBottom: 4 }}>SELECTED FUNNEL</div>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 16 }}>{pickedFunnel.icon}</span>
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#e2e8f0" }}>{pickedFunnel.name}</span>
                                {pickedChannel && <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: pickedChannel.hex }}>via {pickedChannel.icon}</span>}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ═══ SECTION 5: CAMPAIGN STRATEGY BY AUDIENCE MODE ═══ */}
              {audiencePicks.length > 0 ? (
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", letterSpacing: 3, marginBottom: 4, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    05 — YOUR CAMPAIGNS ({audiencePicks.length})
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", marginBottom: 16, marginTop: 10 }}>
                    {audiencePicks.length} campaign{audiencePicks.length !== 1 ? "s" : ""} across {audiencePicks.length} audience discovery mode{audiencePicks.length !== 1 ? "s" : ""}. Each targets a different way people discover your offer.
                  </div>

                  {audiencePicks.map(([modeId, pick]) => {
                    const mode = AUDIENCE_MODES.find(m => m.id === modeId);
                    const funnel = FUNNELS.find(f => f.id === pick.funnelId);
                    const ch = CHANNEL_STRATEGIES.find(c => c.id === pick.channelId);
                    const modeEp = pt?.engagement_path?.[modeId];
                    const guidance = funnel ? getChannelFunnelGuidance(funnel, pick.channelId) : null;
                    if (!mode || !funnel) return null;

                    return (
                      <div key={modeId} className="text-wrap" style={{ marginBottom: 20, border: `1px solid ${mode.hex}25`, borderRadius: 12, overflow: "hidden" }}>
                        {/* Campaign header */}
                        <div style={{ background: `${mode.hex}10`, padding: "14px 18px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, borderBottom: `1px solid ${mode.hex}18` }}>
                          <span style={{ fontSize: 22 }}>{mode.icon}</span>
                          <div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: mode.hex, letterSpacing: 1 }}>{mode.label}</div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8" }}>{mode.subtitle}</div>
                          </div>
                          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 16 }}>{funnel.icon}</span>
                            <span style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "#e2e8f0" }}>{funnel.name}</span>
                            {ch && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "2px 8px", background: `${ch.hex}10`, border: `1px solid ${ch.hex}20`, borderRadius: 4, color: ch.hex }}>via {ch.icon} {ch.label}</span>}
                          </div>
                        </div>

                        <div style={{ padding: "16px 18px" }}>
                          {/* Engagement path */}
                          {modeEp && (
                            <div style={{ marginBottom: 14 }}>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: pt.hex, letterSpacing: 2, marginBottom: 8 }}>
                                ENGAGEMENT PATH — {pt.label} + {modeId.toUpperCase()}
                              </div>
                              <div className="rg-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                                <div style={{ background: "#040810", borderRadius: 6, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#34d399", letterSpacing: 2, marginBottom: 3 }}>① FIRST ACTION</div>
                                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{modeEp.action}</div>
                                </div>
                                <div style={{ background: "#040810", borderRadius: 6, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#f59e0b", letterSpacing: 2, marginBottom: 3 }}>② WHAT HAPPENS NEXT</div>
                                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{modeEp.next}</div>
                                </div>
                                <div style={{ background: "#040810", borderRadius: 6, padding: "10px 12px", border: "1px solid rgba(56,189,248,0.08)" }}>
                                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#38bdf8", letterSpacing: 2, marginBottom: 3 }}>③ ZOHO AUTOMATION</div>
                                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{modeEp.zoho}</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Channel delivery tip */}
                          {guidance && (
                            <div style={{ background: `${ch?.hex || mode.hex}08`, borderRadius: 8, padding: "12px 14px", marginBottom: 14, borderLeft: `3px solid ${ch?.hex || mode.hex}50` }}>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: ch?.hex || mode.hex, letterSpacing: 2, marginBottom: 4 }}>
                                {(ch?.label || "CHANNEL").toUpperCase()} IMPLEMENTATION
                              </div>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>{guidance.deliveryTip}</div>
                            </div>
                          )}

                          {/* Stage-by-stage build */}
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: mode.hex, letterSpacing: 2, marginBottom: 8 }}>
                            STAGE-BY-STAGE BUILD
                          </div>
                          <div style={{ display: "grid", gap: 6, marginBottom: 14 }}>
                            {(guidance ? guidance.contextualStages : funnel.stages).map((stage, i) => (
                              <div key={i} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 6, padding: "10px 14px", border: `1px solid ${mode.hex}10`, display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "start" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 28 }}>
                                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: mode.hex, fontWeight: "bold" }}>{String(i + 1).padStart(2, "0")}</span>
                                  <span style={{ fontSize: 14 }}>{stage.icon || "📄"}</span>
                                </div>
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
                                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: mode.hex }}>{stage.name || stage.label}</div>
                                    {stage.cr && <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", fontWeight: "bold", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 4 }}>CR: {stage.cr}</div>}
                                  </div>
                                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>{stage.contextDesc || stage.desc}</div>
                                  {stage.zoho && <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#8b9dc4", marginTop: 4 }}><span style={{ color: "#a78bfa" }}>ZOHO:</span> {stage.zoho}</div>}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Critical rule + Bayside implementation */}
                          <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                            {funnel.critical_rule && (
                              <div style={{ background: "rgba(248,113,113,0.04)", borderRadius: 6, padding: "10px 14px", border: "1px solid rgba(248,113,113,0.12)" }}>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#f87171", letterSpacing: 2, marginBottom: 3 }}>⚠ CRITICAL RULE</div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{funnel.critical_rule}</div>
                              </div>
                            )}
                            {funnel.bayside_implementation && (
                              <div style={{ background: "rgba(56,189,248,0.04)", borderRadius: 6, padding: "10px 14px", border: "1px solid rgba(56,189,248,0.12)" }}>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#38bdf8", letterSpacing: 2, marginBottom: 3 }}>BAYSIDE IMPLEMENTATION</div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{funnel.bayside_implementation}</div>
                              </div>
                            )}
                          </div>

                          {/* When to use / don't use */}
                          <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                            {funnel.when_to_use && (
                              <div style={{ background: "rgba(52,211,153,0.04)", borderRadius: 6, padding: "10px 14px", border: "1px solid rgba(52,211,153,0.12)" }}>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#34d399", letterSpacing: 2, marginBottom: 3 }}>✓ WHEN TO USE</div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{funnel.when_to_use}</div>
                              </div>
                            )}
                            {funnel.when_not_to_use && (
                              <div style={{ background: "rgba(248,113,113,0.04)", borderRadius: 6, padding: "10px 14px", border: "1px solid rgba(248,113,113,0.12)" }}>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#f87171", letterSpacing: 2, marginBottom: 3 }}>✗ WHEN NOT TO USE</div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{funnel.when_not_to_use}</div>
                              </div>
                            )}
                          </div>

                          {/* Meta */}
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                            {guidance && <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8" }}><span style={{ color: "#c4d5e8" }}>PLATFORM:</span> {guidance.verbs.platform}</div>}
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8" }}><span style={{ color: "#c4d5e8" }}>COMPLEXITY:</span> {funnel.complexity}</div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8" }}><span style={{ color: "#c4d5e8" }}>BUILD TIME:</span> {funnel.time_to_build}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ background: "var(--surface)", borderRadius: 12, padding: "28px 22px", border: "1px solid var(--border)", textAlign: "center", marginBottom: 28 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🎯</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", letterSpacing: 2, marginBottom: 6 }}>NO CAMPAIGNS SELECTED YET</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>
                    Go to the <span style={{ color: "#38bdf8", cursor: "pointer" }} onClick={() => setActiveTab("framework")}>Strategy Selector</span> → Step 04 to pick 1 funnel per strong-fit audience mode.
                  </div>
                </div>
              )}

              {/* ═══ SECTION 6: DM SCRIPT ═══ */}
              {pt?.dm_script && (
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", letterSpacing: 3, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                    06 — DM SCRIPT TEMPLATE
                  </div>
                  <div style={{ background: "rgba(244,114,182,0.05)", border: "1px solid rgba(244,114,182,0.15)", borderRadius: 10, padding: "16px 18px" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#f472b6", letterSpacing: 2, marginBottom: 8 }}>COMMUNITY DM — {pt.label}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "#94a3b8", lineHeight: 1.8, fontStyle: "italic" }}>"{pt.dm_script}"</div>
                  </div>
                </div>
              )}

              {/* ═══ SECTION 7: YOUR FUNNEL PRIORITY ═══ */}
              {audiencePicks.length > 0 && pt?.funnels_ranked && (() => {
                // Get unique funnels the user actually picked, sorted by product-type recommended order
                const pickedFunnelEntries = audiencePicks.map(([modeId, pick]) => ({
                  modeId,
                  mode: AUDIENCE_MODES.find(m => m.id === modeId),
                  funnel: FUNNELS.find(f => f.id === pick.funnelId),
                  channel: CHANNEL_STRATEGIES.find(c => c.id === pick.channelId),
                })).filter(e => e.funnel && e.mode);

                // Sort by product-type funnel priority (lower index = higher priority)
                const sorted = [...pickedFunnelEntries].sort((a, b) => {
                  const aIdx = pt.funnels_ranked.indexOf(a.funnel.id);
                  const bIdx = pt.funnels_ranked.indexOf(b.funnel.id);
                  return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
                });

                return (
                  <div style={{ marginBottom: 48 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", letterSpacing: 3, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                      07 — YOUR FUNNEL PRIORITY
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", marginBottom: 16, lineHeight: 1.7 }}>
                      Your {sorted.length} selected funnel{sorted.length !== 1 ? "s" : ""}, ranked by implementation priority for {pt.label.toLowerCase()}.
                    </div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {sorted.map((entry, i) => (
                        <div key={entry.modeId} style={{
                          display: "grid", gridTemplateColumns: "auto 1fr", gap: 14, alignItems: "center",
                          background: i === 0 ? "rgba(52,211,153,0.06)" : "var(--surface)",
                          border: `1px solid ${i === 0 ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.06)"}`,
                          borderRadius: 10, padding: "14px 18px",
                        }}>
                          <div style={{
                            fontFamily: "var(--font-display)", fontSize: 28, color: i === 0 ? "#34d399" : "#475569",
                            width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                            background: i === 0 ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.03)",
                            borderRadius: 8, border: `1px solid ${i === 0 ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.04)"}`,
                          }}>
                            {i + 1}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 18 }}>{entry.funnel.icon}</span>
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: i === 0 ? "#34d399" : "#e2e8f0", fontWeight: "bold" }}>{entry.funnel.name}</span>
                              {i === 0 && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "2px 8px", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 20, color: "#34d399", letterSpacing: 1 }}>START HERE</span>}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: entry.mode.hex, background: `${entry.mode.hex}10`, border: `1px solid ${entry.mode.hex}25`, padding: "2px 8px", borderRadius: 4 }}>
                                {entry.mode.icon} {entry.mode.label}
                              </span>
                              {entry.channel && (
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#8b9dc4", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 4 }}>
                                  {entry.channel.icon} {entry.channel.label}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* ═══ SECTION 8: GROWTH FRAMEWORK — CONTEXTUAL HORMOZI INSIGHTS ═══ */}
              {(() => {
                const VALUE_LADDER = [
                  { rung: "BAIT", price: "Free", color: "#38bdf8", desc: "Lead magnet, free trial, free community. Gets them in the door.", matchTypes: [] },
                  { rung: "FRONT END", price: "$7 – $97", color: "#34d399", desc: "Tripwire or low-ticket product. Converts a lead into a buyer. Funds ad spend. This is the psychological line — they've now paid you.", matchTypes: ["low_ticket_digital", "ecommerce"] },
                  { rung: "MIDDLE", price: "$97 – $2,000", color: "#f59e0b", desc: "Core offer, course, group program. This is where real revenue begins.", matchTypes: ["mid_ticket_service", "saas"] },
                  { rung: "BACK END", price: "$2,000 – $25,000", color: "#f472b6", desc: "High-ticket service, implementation, done-for-you. Requires a sales call.", matchTypes: ["high_ticket_service"] },
                  { rung: "PEAK", price: "$25,000+", color: "#a78bfa", desc: "Enterprise, retainer, advisory. Invitation-only — relationships close these.", matchTypes: [] },
                ];
                const LEAD_MAGNETS = [
                  { type: "REVEAL A PROBLEM", icon: "🔍", color: "#f87171", desc: "Show them a problem they didn't know they had. The lead magnet is the diagnosis — your paid offer is the treatment.", matchTypes: ["high_ticket_service", "mid_ticket_service", "saas"] },
                  { type: "SOLVE ONE STEP", icon: "🧩", color: "#f59e0b", desc: "Give them one step of a multi-step process. They get a genuine win, then realise they need the other steps.", matchTypes: ["mid_ticket_service", "low_ticket_digital", "saas"] },
                  { type: "TRIAL OF THE CORE OFFER", icon: "🎁", color: "#34d399", desc: "Give a time-limited or scope-limited version of your actual product. If your product is good, the trial sells itself.", matchTypes: ["saas", "ecommerce", "low_ticket_digital"] },
                ];
                const currentRung = VALUE_LADDER.find(r => r.matchTypes.includes(productType));
                const currentIdx = currentRung ? VALUE_LADDER.indexOf(currentRung) : -1;
                const nextRung = currentIdx >= 0 && currentIdx < VALUE_LADDER.length - 1 ? VALUE_LADDER[currentIdx + 1] : null;
                const prevRung = currentIdx > 0 ? VALUE_LADDER[currentIdx - 1] : VALUE_LADDER[0];
                const relevantMagnets = LEAD_MAGNETS.filter(lm => lm.matchTypes.includes(productType));

                return (
                  <div style={{ marginBottom: 48 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#94a3b8", letterSpacing: 3, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                      08 — GROWTH FRAMEWORK
                    </div>

                    {/* Value Ladder Position */}
                    {currentRung && (
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#f59e0b", letterSpacing: 2, marginBottom: 10 }}>YOUR VALUE LADDER POSITION</div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                          {VALUE_LADDER.map((r, i) => {
                            const isCurrent = r === currentRung;
                            return (
                              <Fragment key={i}>
                                <div style={{
                                  background: isCurrent ? `${r.color}15` : "var(--surface)",
                                  border: `1px solid ${isCurrent ? r.color : "rgba(255,255,255,0.06)"}`,
                                  borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8,
                                  boxShadow: isCurrent ? `0 0 12px ${r.color}20` : "none"
                                }}>
                                  <span style={{ fontFamily: "var(--font-display)", fontSize: isCurrent ? 16 : 13, color: r.color, letterSpacing: 1 }}>{r.rung}</span>
                                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: isCurrent ? r.color : "#94a3b8" }}>{r.price}</span>
                                </div>
                                {i < VALUE_LADDER.length - 1 && <span style={{ color: "#334155", fontSize: 12 }}>→</span>}
                              </Fragment>
                            );
                          })}
                        </div>
                        <div style={{ background: `${currentRung.color}08`, borderRadius: 8, padding: "12px 16px", border: `1px solid ${currentRung.color}20`, marginBottom: 8 }}>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: currentRung.color, marginBottom: 4 }}>YOU ARE HERE — {currentRung.rung} ({currentRung.price})</div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{currentRung.desc}</div>
                        </div>
                        <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          {prevRung && prevRung !== currentRung && (
                            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.05)" }}>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: prevRung.color, letterSpacing: 2, marginBottom: 3 }}>↓ RUNG BELOW — {prevRung.rung}</div>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>Use this rung as your lead-in. A {prevRung.price} offer earns the right to pitch your {currentRung.price} offer.</div>
                            </div>
                          )}
                          {nextRung && (
                            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.05)" }}>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: nextRung.color, letterSpacing: 2, marginBottom: 3 }}>↑ NEXT RUNG — {nextRung.rung}</div>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>Your upsell path. Clients who succeed at {currentRung.price} become candidates for {nextRung.price} offers.</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Lead Magnet Strategy */}
                    {relevantMagnets.length > 0 && (
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#34d399", letterSpacing: 2, marginBottom: 10 }}>LEAD MAGNET STRATEGY FOR {pt?.label}</div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {relevantMagnets.map((lm, i) => (
                            <div key={i} style={{ background: "var(--surface)", borderRadius: 8, padding: "12px 16px", border: `1px solid ${lm.color}18`, display: "flex", alignItems: "flex-start", gap: 12 }}>
                              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{lm.icon}</span>
                              <div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: lm.color, letterSpacing: 1, marginBottom: 3 }}>{lm.type}</div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{lm.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Core Four and Key Principles removed — generic advice that didn't connect to user's actual selections */}
                  </div>
                );
              })()}

              {/* ═══ BACK TO SELECTOR ═══ */}
              <div style={{ textAlign: "center", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button onClick={() => setActiveTab("framework")} style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#38bdf8", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 8, padding: "10px 24px", cursor: "pointer", letterSpacing: 2 }}>
                  ← BACK TO STRATEGY SELECTOR
                </button>
              </div>

              <BrandedFooter />
            </div>
          );
        })()}

        </div>
      </div>
    </div>
  );
}

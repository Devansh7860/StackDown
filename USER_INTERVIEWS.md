# USER_INTERVIEWS.md — Founder Research Conversations

> These interviews were conducted via WhatsApp/DM between May 22-25, 2026, as part of the product discovery process. Names have been changed for privacy.

---

## Interview 1 — Rahul, Co-founder & CTO, 9-person B2B SaaS
*Bootstrapped, building a HR automation product. ~3 years of runway.*

**Context:** Rahul manages the entire tech budget and reviews subscriptions monthly. He mentioned offhandedly that his team was "probably paying for too much AI stuff."

**Key exchanges:**

Me: "Walk me through how your team uses AI tools right now."

Rahul: "We have Cursor for the devs — all 5 of them. Then half the team also has GitHub Copilot because that's what they were using before. I pay both bills separately and I keep meaning to audit that but... you know how it is."

Me: "Have you ever run any kind of spend analysis on it?"

Rahul: "I export the billing CSVs every quarter and look at the totals. But I've never compared plans side by side. I genuinely don't know if we should be on Cursor Business or Pro. I just pay for Business because I assumed Business was better."

Me: "If a tool showed you exactly what to cancel and why, would you trust it?"

Rahul: "Depends on the reasoning. If it just says 'this is cheaper,' I'll ignore it. But if it shows me side-by-side what each plan includes and tells me 'you're on Business but the only Business feature you'd use is X and you don't need X,' then yes."

**Key insight:** The reasoning quality is the trust signal. Not the savings number. Rahul won't act on "you can save $80" but he will act on "you're paying for SSO that you don't need because you have 5 devs, not 50."

**What changed in the product:** Added plan feature comparisons to the reasoning strings. Made sure every downgrade recommendation cites the specific Business/Enterprise feature that the user doesn't need.

---

## Interview 2 — Meera, Engineering Manager, 14-person Series A
*VC-backed, building developer tooling. Manages a team of 8 engineers.*

**Context:** Meera's company just raised a Series A and is growing. She was added to the "tools budget" approval chain 3 months ago and inherited decisions made before her.

**Key exchanges:**

Me: "What's your current AI tool stack?"

Meera: "ChatGPT Team for the whole company. Claude Pro for me and two other people individually — we pay that ourselves and expense it. Cursor for developers. And we just started an Anthropic API contract because we're integrating AI into our product."

Me: "Do you realize you're paying for both Claude Pro and Anthropic API?"

Meera: "Yes, but they're different. Claude Pro is the web interface for chat. The API is for the product. They're not the same thing." 

Me: "Right — but are you personally using Claude Pro now that you also have API access?"

Meera: "...Probably not as much. I use the playground sometimes. That's a good question."

Me: "The tool would flag this as a potential overlap — it'd say 'if your primary Claude use is API calls, the Pro subscription at $20/seat may be redundant.' Would that be useful?"

Meera: "Yeah. It's one of those things I know I should audit but I'm never going to do it myself. I'd genuinely use a tool that just tells me."

**Key insight:** The "I know I should but I won't" pattern is universal. The tool's value proposition is literally "I'll do in 3 minutes what you've been meaning to do for 6 months." Also: overlapping subscription + API access is a very common scenario that the engine captures.

**What changed in the product:** Added an API vs subscription mismatch rule. If user has Claude Pro AND Anthropic API, and their use case is 'coding' or 'data', flag that Claude Pro may be redundant.

---

## Interview 3 — Arjun, Founder, 4-person product studio
*Bootstrapped agency that also builds its own SaaS products. Very cost-conscious.*

**Context:** Arjun runs extremely lean. He's a Cursor power user and has opinions about every tool.

**Key exchanges:**

Me: "Do you use any other AI assistants besides Cursor?"

Arjun: "Cursor is the main one. I also have ChatGPT Plus — been meaning to cancel it for a month but kept forgetting. And sometimes I use Claude for writing but I'm on the free plan."

Me: "So your main cost is Cursor and ChatGPT Plus?"

Arjun: "Yeah. Cursor Pro × 4 people is $80. ChatGPT Plus × 2 people is $40. So about $120/month total."

Me: "That's actually pretty optimized. If I showed you an audit result that said 'you're spending well — no major savings,' would you trust it? Or would you feel like the tool was useless?"

Arjun: "I'd trust it more. Most of these audit tools are designed to find savings regardless. If it says I'm fine, I believe it. If it says 'cancel Cursor' because some cheaper alternative exists, I'd laugh."

Me: "What would make you share this tool with someone?"

Arjun: "If I used it and found something. Like if I realized I was accidentally paying for something I didn't need. I'd definitely send it to my co-founder friends. 'Look what this caught.' But if it finds nothing, I'll close the tab."

**Key insight:** The "already optimal" honest result is a feature, not a failure. Users who get an honest "you're spending well" message trust the product MORE — which means they're more likely to share it. The viral mechanism isn't just "I saved money" — it's "this is actually legit."

**What changed in the product:** Added an explicit "alreadyOptimal" state to the results page with messaging: "Your stack looks well-optimized. Nothing to cut." Treated this as a positive outcome, not an empty results page.

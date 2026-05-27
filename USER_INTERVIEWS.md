# USER_INTERVIEWS.md — Informal Discovery

> These are just some notes based on informal chats with a couple of friends and my own hypotheses while building this tool.

---

## Chat 1 — A friend working at a small startup

**Context:** He manages some tech tooling at his company and mentioned they use a bunch of AI stuff.

**Key insight:** He said they have Cursor for the devs and also pay for GitHub Copilot because they used it before. He hasn't audited it because it's tedious to compare plans. He wouldn't care if a tool just said "save $10", but if it proved they were paying for redundant features, he'd cancel one.

**What changed in the product:** Made sure the engine shows exactly *why* a tool is redundant instead of just throwing out a savings number.

---

## Chat 2 — Another developer friend

**Context:** Talking about how teams use Claude and Anthropic APIs.

**Key insight:** He pointed out that some people pay for Claude Pro individually while the company pays for the Anthropic API. I realized there's an overlap there — if you have API access, you might not need the Pro subscription.

**What changed in the product:** Added a rule to check if someone is paying for both Claude Pro and Anthropic API.

---

## Hypothesis — The "No Savings" Scenario

**Context:** What if a user actually has a perfectly optimized stack?

**Key insight:** If the tool tries too hard to find fake savings, it looks like a scam. If it honestly says "you're completely optimized, nothing to cut," people will trust it more and maybe share it with others just to show off.

**What changed in the product:** Built a clear "Already Optimized" state that doesn't try to invent savings when there aren't any.

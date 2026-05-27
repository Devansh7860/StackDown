# ECONOMICS.md — Unit Economics Model

## The Business Context

StackDown is a **free lead generation tool** for Credex. It has no direct revenue. Its value is measured by the quality and volume of warm leads it delivers to the Credex sales team — leads who have already quantified their AI tool pain.

---

## What a Converted Lead is Worth

### Assumptions
- Average startup AI tool spend at audit time: $400/month = $4,800/year
- Credex discount potential: 20% average savings on API credits
- Credex take rate: 40% margin on savings generated (60% passed to customer)
- Average contract value: $200/month = $2,400/year
- Average retention: 18 months (switching cost: procurement setup)

### LTV Calculation
```
$200/month × 18 months = $3,600 LTV per converted customer
```

### Sensitivity Range
| Scenario | Monthly Contract | Retention | LTV |
|----------|-----------------|-----------|-----|
| Conservative | $100/mo | 12 months | $1,200 |
| Base case | $200/mo | 18 months | $3,600 |
| Optimistic | $400/mo | 24 months | $9,600 |

---

## Conversion Funnel

Based on industry benchmarks for free-to-paid lead gen tools in B2B SaaS:

```
10,000 site visitors/month                (Show HN + Reddit + word of mouth)
× 25% start audit (CTA click)  = 2,500 audit starts
× 60% complete audit            = 1,500 audits completed
× 25% email capture rate        = 375 leads in Supabase
× 20% qualify as high-savings   = 75 high-value leads (>$500/mo savings)
  (flagged for Credex outreach)
× 20% book consultation         = 15 consultations/month
× 40% close to Credex purchase  = 6 customers/month
× $3,600 LTV                    = $21,600 LTV generated per month
× 12 months                     = $259,200 ARR contribution (Year 1)
```

### Why 25% email capture?
Benchmarks for tools with "no email required to see results" are typically 20-35%. The value exchange is high (they've already seen their savings) and the ask is low (one email for a permanent link). 25% is conservative.

### Why 20% high-savings qualification?
Based on the audit engine's behavior on realistic inputs. Teams spending $200-500/month often have 0-1 actionable recommendations. Teams spending $500+/month almost always have overlap or oversized plans. 20% of email captures being "high-value" ($500+ savings identified) is consistent with the tool's target audience.

---

## Cost Structure

### Operating Costs at 1,500 audits/month

| Cost | Price | Monthly |
|------|-------|---------|
| Vercel Pro | $20/mo | $20 |
| Supabase Pro | $25/mo | $25 |
| Upstash Redis | Free (10k ops/day) | $0 |
| Resend | Free (3k emails/mo) | $0 |
| Anthropic API | ~$0.003/summary | $4.50 |
| **Total** | | **~$50/month** |

At 15,000 audits/month (10x growth):
- Vercel: $20 (serverless, scales automatically)
- Supabase: $25 (DB still small)
- Resend: $20 (>3k emails → paid tier)
- Anthropic: $45 (~$0.003 × 15,000)
- **Total: ~$110/month**

### CAC (Customer Acquisition Cost)
```
Operating cost: $50/month
Divided by: 6 customers/month
CAC (tool cost only): ~$8/customer
```

LTV/CAC = $3,600 / $8 = **450x**

This ratio is extremely favorable because the tool itself costs almost nothing to operate. The real "cost" is the engineering time to build and maintain it — a one-time investment for ongoing lead flow.

---

## Path to $1M ARR for Credex

StackDown alone at current projections generates ~$260k ARR contribution in Year 1. The gap to $1M requires:

1. **10x audit volume** → $2.6M ARR (requires sustained distribution — Show HN, accelerator partnerships, Credex customer referrals)
2. **Higher ACV enterprise deals** → A single 50-person company switching to Credex is worth $500-2,000/month vs the $200 base case. Enterprise upsell from SMB leads changes the math significantly.
3. **Parallel lead channels** → StackDown is one tool. The same model works for other categories: "Audit your SaaS spend" (Notion + Linear + Figma + Vercel), "Audit your cloud costs" (AWS + GCP + Vercel). Each audit category is a new lead funnel.

---

## The Key Insight

The product is a **lead qualification machine** disguised as a utility. Every completed audit pre-qualifies the lead on the most important B2B sales question: "Do they actually have a budget problem worth solving?" A lead who has just seen "$472/month in savings" is not cold — they are warm, educated, and motivated. The Credex sales conversation starts at "let me show you how to get that $472 back" rather than "do you think you might be overspending?"

This is the compounding value that makes StackDown worth building even as a zero-revenue product.

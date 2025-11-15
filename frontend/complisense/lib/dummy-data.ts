export const dummyAlerts = [
  {
    id: 1,
    title: "KSA VAT Rate Increase to 20%",
    description: "The Kingdom of Saudi Arabia has announced an increase in VAT rate from 15% to 20%, effective Q2 2025. All registered businesses must update their accounting systems and customer-facing price displays by March 31, 2025.",
    source: "ZATCA (Zakat, Tax and Customs Authority)",
    severity: "high",
    action_required: true,
    created_at: "2025-01-10T14:30:00Z"
  },
  {
    id: 2,
    title: "UAE Central Bank Updates AML Guidelines",
    description: "The UAE Central Bank has released updated Anti-Money Laundering (AML) guidelines for FinTech companies. Enhanced customer due diligence procedures are now mandatory for all digital payment platforms.",
    source: "UAE Central Bank",
    severity: "medium",
    action_required: true,
    created_at: "2025-01-08T09:15:00Z"
  },
  {
    id: 3,
    title: "Bahrain PDPL Amendment Notification",
    description: "The Personal Data Protection Law (PDPL) in Bahrain has been amended to include stricter consent requirements for data processing. Companies have 90 days to update their privacy policies and consent mechanisms.",
    source: "Bahrain Personal Data Protection Authority",
    severity: "medium",
    action_required: true,
    created_at: "2025-01-05T11:00:00Z"
  },
  {
    id: 4,
    title: "Qatar Financial Services Licensing Update",
    description: "Qatar Financial Centre has updated its licensing requirements for payment service providers. New applicants must provide enhanced operational risk assessments.",
    source: "Qatar Financial Centre Regulatory Authority",
    severity: "low",
    action_required: false,
    created_at: "2025-01-02T16:45:00Z"
  }
]

export const dummyReports = [
  {
    id: 1,
    alert_id: 1,
    title: "KSA VAT Rate Increase Compliance Report",
    status: "pending",
    created_at: "2025-01-11T10:00:00Z",
    content: `# KSA VAT Rate Increase to 20% - Compliance Report

## Executive Summary

The Kingdom of Saudi Arabia has announced a VAT rate increase from 15% to 20%, effective Q2 2025. This report outlines the compliance requirements and recommended actions for your organization.

## Key Changes

### VAT Rate Adjustment
- **Current Rate:** 15%
- **New Rate:** 20%
- **Effective Date:** April 1, 2025
- **Compliance Deadline:** March 31, 2025

### Impact Assessment

#### Financial Impact
- Increased tax collection by 33% on all taxable supplies
- Price adjustments required for all B2C products and services
- Potential impact on profit margins if price increases cannot be passed to customers

#### Operational Impact
- Accounting system updates required
- Invoice template modifications
- Customer communication strategy needed
- Price display updates across all channels

## Compliance Requirements

### Immediate Actions Required

1. **System Updates**
   - Update accounting software to reflect 20% VAT rate
   - Modify invoice generation templates
   - Update e-commerce platform tax calculations
   - Review and update automated billing systems

2. **Legal & Documentation**
   - Update standard terms and conditions
   - Revise customer contracts for recurring services
   - Update website terms of service
   - Prepare customer notification templates

3. **Price Adjustments**
   - Review pricing strategy for all products/services
   - Update price lists and catalogs
   - Modify point-of-sale displays
   - Update online pricing across all digital channels

### Timeline

- **January 15-31, 2025:** Internal assessment and planning
- **February 1-28, 2025:** System updates and testing
- **March 1-31, 2025:** Full implementation and staff training
- **April 1, 2025:** Go-live date

## Recommended Actions

### High Priority
1. Engage with your accounting software provider for system updates
2. Consult with legal counsel on contract modifications
3. Develop customer communication strategy
4. Begin staff training on new VAT rate

### Medium Priority
1. Update marketing materials with new pricing
2. Review supplier contracts for VAT treatment
3. Assess impact on cash flow projections
4. Update internal financial forecasts

### Low Priority
1. Review tax recovery processes
2. Update internal reporting templates
3. Consider implications for budgeting processes

## Regulatory References

- ZATCA Circular No. 2025/01
- VAT Implementing Regulations Article 15(2)
- Tax Invoice Requirements under VAT Law

## Risk Assessment

### Compliance Risks
- **High Risk:** Failure to update systems by deadline may result in incorrect tax collection
- **Medium Risk:** Delayed customer communication could impact customer relationships
- **Low Risk:** Minor operational disruptions during transition period

## Next Steps

1. Schedule implementation meeting with IT and Finance teams
2. Obtain formal approval for system changes
3. Begin customer notification process
4. Monitor ZATCA website for additional guidance

---

**Report Generated:** January 11, 2025  
**Review Required By:** January 20, 2025  
**Compliance Deadline:** March 31, 2025`
  },
  {
    id: 2,
    alert_id: 2,
    title: "UAE AML Guidelines Compliance Report",
    status: "approved",
    created_at: "2025-01-09T14:30:00Z",
    content: `# UAE Central Bank AML Guidelines Update - Compliance Report

## Executive Summary

The UAE Central Bank has released updated Anti-Money Laundering guidelines specifically targeting FinTech companies. This report analyzes the new requirements and provides an implementation roadmap.

## New Requirements

### Enhanced Customer Due Diligence (EDD)

The updated guidelines mandate enhanced due diligence for:
- All digital payment platforms
- Peer-to-peer payment services
- Cryptocurrency exchange platforms
- Digital wallet providers

### Key Changes

1. **Identity Verification**
   - Biometric verification now mandatory for transactions over AED 10,000
   - Enhanced document verification using AI-powered systems
   - Real-time identity verification for high-risk customers

2. **Transaction Monitoring**
   - 24/7 automated transaction monitoring required
   - Threshold alerts for suspicious patterns
   - Enhanced reporting to Financial Intelligence Unit (FIU)

3. **Record Keeping**
   - Minimum 7-year retention of customer data
   - Audit trail for all EDD procedures
   - Digital record management systems mandatory

## Implementation Plan

### Phase 1: Assessment (Weeks 1-2)
- Review current AML procedures
- Gap analysis against new requirements
- Resource allocation planning

### Phase 2: System Upgrades (Weeks 3-8)
- Implement biometric verification system
- Upgrade transaction monitoring software
- Enhance record-keeping infrastructure

### Phase 3: Training (Weeks 9-10)
- Staff training on new procedures
- Compliance team certification
- Testing and simulation exercises

### Phase 4: Go-Live (Week 11-12)
- Phased rollout of new systems
- Monitoring and adjustment period
- Regulatory reporting

## Budget Considerations

- **Technology Investment:** AED 500,000 - 800,000
- **Training Costs:** AED 50,000 - 100,000
- **Ongoing Compliance:** AED 200,000 annually

## Regulatory Timeline

- **Compliance Deadline:** June 30, 2025
- **First Audit:** Q3 2025

---

**Report Status:** Approved  
**Approved By:** Compliance Officer  
**Date:** January 9, 2025`
  },
  {
    id: 3,
    alert_id: 3,
    title: "Bahrain PDPL Amendment Compliance Report",
    status: "draft",
    created_at: "2025-01-06T08:20:00Z",
    content: `# Bahrain PDPL Amendment - Compliance Report (DRAFT)

## Overview

The Personal Data Protection Law amendment introduces stricter consent requirements. This draft report outlines preliminary compliance measures.

## Key Amendments

### Consent Requirements
- Explicit consent now required for all data processing
- Granular consent options must be provided
- Easy withdrawal mechanisms mandatory

### Implementation Timeline
- **Day 1-30:** Privacy policy updates
- **Day 31-60:** Consent mechanism implementation
- **Day 61-90:** Full compliance and testing

## Preliminary Recommendations

1. Update privacy notices
2. Implement consent management platform
3. Train customer service teams
4. Conduct data inventory

---

**Status:** Draft - Pending Legal Review`
  }
]

export const dummyChatHistory: Array<{ role: "user" | "assistant"; content: string; citations?: any[] }> = [
  {
    role: "assistant",
    content: "I am your AI Compliance Advisor. I only answer using official GCC government documents. How can I help you evaluate your new 'Buy Now, Pay Later' idea?",
  }
]

export const generateDummyResponse = (question: string) => {
  const responses = [
    {
      answer: "Based on UAE Central Bank regulations [1], Buy Now Pay Later (BNPL) services in the UAE must be licensed as consumer credit providers [2]. According to the Consumer Protection Regulation [3], BNPL providers must clearly disclose all fees, interest rates (if any), and payment terms to consumers before they enter into any agreement.",
      citations: [
        { id: "1", source: "UAE Central Bank Regulation 43/2022 - Consumer Credit", page: "Article 5, Page 12" },
        { id: "2", source: "UAE Financial Services License Requirements", page: "Section 3.4" },
        { id: "3", source: "Consumer Protection Regulation 2020", page: "Chapter 2, Article 8" }
      ]
    },
    {
      answer: "For KSA, the Saudi Central Bank (SAMA) requires BNPL providers to obtain a FinTech license [1]. The service must comply with Sharia principles if marketing to the Saudi market [2]. Additionally, BNPL providers must implement robust credit assessment procedures [3] and cannot charge interest rates exceeding the maximum threshold set by SAMA.",
      citations: [
        { id: "1", source: "SAMA FinTech Licensing Guidelines 2024", page: "Section 4" },
        { id: "2", source: "Sharia Compliance Requirements for Financial Services", page: "Chapter 7" },
        { id: "3", source: "Credit Risk Management Framework", page: "Article 12" }
      ]
    },
    {
      answer: "According to Qatar Financial Centre regulations [1], BNPL services fall under the category of consumer lending and require appropriate authorization. Data protection is critical - you must comply with Qatar's Data Protection Law [2] when collecting and processing customer information. Consumer disclosure requirements [3] mandate transparent communication about payment schedules and any associated costs.",
      citations: [
        { id: "1", source: "QFC Regulatory Authority - Lending Regulations", page: "Part 3, Section 2" },
        { id: "2", source: "Qatar Data Protection Law No. 13 of 2016", page: "Article 6" },
        { id: "3", source: "Consumer Financial Services Disclosure Requirements", page: "Schedule 2" }
      ]
    }
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

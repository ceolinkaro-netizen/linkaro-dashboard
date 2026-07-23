import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

const GEIST = "'Geist', sans-serif";
const PP_MORI = "'PP Mori', sans-serif";
const ORANGE = "#FE5900";

// ── Main Privacy Policy ──────────────────────────────────────────────────────

const privacySections = [
  {
    title: "Introduction",
    body: "Linkaro (Private) Limited (\"Linkaro\", \"we\", \"us\", or \"our\") respects your privacy and is committed to protecting the personal data of users of the Linkaro Digital Service Marketplace (\"Platform\"). This Privacy Policy explains what information we collect, how we use it, the choices available to you, and your rights in respect of your personal data.",
  },
  {
    title: "1. Information We Collect",
    body: "We collect the following categories of personal data:\n\n• Account information: name, phone number, email address, and password.\n• Verification information: CNIC details, proof of address, professional certificates, and business registration documents (Service Providers).\n• Location data: approximate or precise location to enable location-based matching between Customers and Service Providers.\n• Usage data: service requests posted, messages exchanged on-platform, ratings and reviews submitted.\n• Device and technical data: device identifiers, IP address, operating system, and app version.\n• Payment-related information necessary to process subscription fees paid by Service Providers.",
  },
  {
    title: "2. How We Use Your Information",
    body: "We use the personal data we collect to:\n\n• Create and manage your account and match Customers with Service Providers.\n• Verify identity and professional credentials of Service Providers.\n• Communicate with you regarding your account, service requests, and support inquiries.\n• Improve, secure, and personalize the Platform.\n• Send promotional communications where you have not opted out.\n• Comply with legal obligations and enforce our policies.",
  },
  {
    title: "3. Legal Basis for Processing",
    body: "We process personal data on the following legal bases:\n\n• Your consent, where required.\n• The necessity of processing to perform our contract with you (creating and operating your account).\n• Our legitimate business interests in operating, improving, and securing the Platform.\n• Compliance with applicable legal obligations.",
  },
  {
    title: "4. Sharing of Information",
    body: "We share limited profile information between Customers and Service Providers as necessary to facilitate a connection (for example, a provider's name and contact details are shared with a customer once a job is accepted, and vice versa). We do not sell personal data to third parties.\n\nWe may also share information with:\n\n• Service vendors who support our operations (such as cloud hosting, payment processing, and messaging infrastructure).\n• Law enforcement, regulators, or courts where required or permitted by applicable law.\n• Successors or acquirers in the event of a merger, acquisition, or reorganisation of our business, subject to appropriate confidentiality protections.",
  },
  {
    title: "5. Cookies and Tracking Technologies",
    body: "Our web application uses cookies and similar technologies to operate core features, remember your preferences, and analyse usage. Please see our Cookie Policy below for details on the types of cookies we use, their purposes, and how you can manage them.",
  },
  {
    title: "6. Data Retention",
    body: "We retain personal data for as long as necessary to provide the Platform and comply with legal obligations:\n\n• Account information: retained for the duration of your account and up to two (2) years after closure.\n• Service Provider verification documents: retained for up to five (5) years.\n• Transaction and subscription records: retained for up to six (6) years.\n• Communication and support logs: retained for up to two (2) years.\n\nAfter the applicable retention period, data is permanently deleted or anonymized. See our Data Retention & Deletion Policy for full details.",
  },
  {
    title: "7. Data Deletion Request",
    highlight: true,
    body: "You may request deletion of your Linkaro account and associated personal data at any time using any of the following methods:\n\n1. Through the app — Navigate to your account Settings and use the account deletion option.\n2. Online form — Submit a formal data deletion request using our dedicated form.\n3. Email — Contact info@linkaroapp.com with the subject line \"Account Deletion Request\", including your registered name and email address.\n\nOnce a deletion request is submitted, your account will be deactivated and will no longer be accessible. We will process your request within 30 days. Certain records may be retained for up to three (3) years after account deletion where required by applicable laws, fraud prevention obligations, dispute resolution, or regulatory compliance. After the retention period, all retained data is permanently deleted.",
    link: { href: "/data-deletion", label: "Submit Data Deletion Request" },
  },
  {
    title: "8. Your Rights",
    body: "Subject to applicable law, you may:\n\n• Request access to the personal data we hold about you.\n• Request correction of inaccurate or incomplete data.\n• Request deletion of your personal data.\n• Object to or request restriction of certain processing activities.\n• Withdraw consent at any time where processing is based on consent.\n\nTo exercise any of these rights, please contact us at info@linkaroapp.com. We will respond within a reasonable timeframe and in accordance with applicable law.",
  },
  {
    title: "9. Data Security",
    body: "We implement reasonable administrative, technical, and physical safeguards designed to protect personal data against unauthorized access, alteration, disclosure, or destruction. These include encryption of data in transit, access controls, and regular security reviews. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
  },
  {
    title: "10. Children's Privacy",
    body: "The Platform is not intended for individuals under the age of 18. We do not knowingly collect personal data from minors. If we become aware that we have inadvertently collected data from a person under 18, we will delete that information as soon as reasonably practicable.",
  },
  {
    title: "11. International Data Transfers",
    body: "Your data may be processed on servers located in jurisdictions other than your own. Where personal data is transferred internationally, we take reasonable steps to ensure that appropriate safeguards are in place, consistent with applicable data protection laws.",
  },
  {
    title: "12. Changes to this Policy",
    body: "We may update this Privacy Policy periodically to reflect changes in our practices or applicable law. Material changes will be communicated through the Platform or via email, and the \"Last Updated\" date above will reflect the most recent revision. Continued use of the Platform after the effective date of any update constitutes acceptance of the revised Policy.",
  },
  {
    title: "13. Contact Us",
    body: "For privacy-related questions, to exercise your rights, or to report a concern, please contact us at info@linkaroapp.com.",
  },
];

// ── Additional Policies ──────────────────────────────────────────────────────

const additionalPolicies = [
  {
    id: "cookie",
    title: "Cookie Policy",
    sections: [
      { title: "What Are Cookies", body: "Cookies are small text files placed on your device when you visit a website or use a web application. They help the site recognise your device and remember information about your visit." },
      { title: "Types of Cookies We Use", body: "Essential cookies: required for core functionality such as login sessions and security.\n\nPerformance and analytics cookies: help us understand how users interact with the Platform so we can improve it.\n\nFunctionality cookies: remember your preferences (such as language or region) to enhance your experience.\n\nAdvertising cookies: used, where applicable, to deliver relevant content and measure the effectiveness of campaigns." },
      { title: "Third-Party Cookies", body: "Some cookies may be placed by third-party service providers (such as analytics or advertising partners) who perform services on our behalf. We do not control these third-party cookies directly." },
      { title: "Managing Cookies", body: "You may control or delete cookies through your browser settings at any time. Please note that disabling essential cookies may affect the functionality of the Platform and prevent you from using certain features." },
      { title: "Consent", body: "By continuing to use our website, you consent to our use of cookies in accordance with this Policy. Where required by law, we will obtain your explicit consent before placing non-essential cookies." },
      { title: "Contact Us", body: "For questions regarding this Cookie Policy, please contact us at info@linkaroapp.com." },
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention & Deletion Policy",
    sections: [
      { title: "Purpose", body: "This Policy ensures that personal data is retained only for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable law." },
      { title: "Retention Periods", body: "Account information: retained for the duration of the account, and up to two (2) years after account closure.\n\nVerification documents (Service Providers): retained for up to five (5) years.\n\nTransaction and subscription records: retained for up to six (6) years.\n\nCommunication and support logs: retained for up to two (2) years.\n\nMarketing preference data: retained until you opt out or withdraw consent." },
      { title: "Account Deletion", body: "Users may delete their account at any time through the application or by submitting a deletion request via our support email or the online form at /data-deletion.\n\nOnce an account is deleted, it will no longer be accessible. However, certain records may be retained for up to three (3) years after account deletion where required by applicable laws, fraud prevention, dispute resolution, or regulatory compliance.\n\nAfter the applicable retention period, retained data is permanently deleted or anonymized." },
      { title: "Exceptions to Deletion", body: "Linkaro may retain certain data beyond a deletion request where necessary to: comply with a legal obligation; resolve a dispute or ongoing investigation; investigate suspected fraud or misconduct; enforce our agreements or protect our legal rights." },
      { title: "Backup Data", body: "Data may persist temporarily in encrypted backup systems following deletion from primary systems and will be purged in the ordinary course of our backup rotation schedule." },
      { title: "Anonymization", body: "Linkaro may retain anonymized or aggregated data indefinitely for analytical and statistical purposes, as such data no longer identifies an individual." },
      { title: "Contact Us", body: "For questions regarding this Policy, please contact us at info@linkaroapp.com." },
    ],
  },
  {
    id: "kyc",
    title: "KYC & Verification Policy",
    sections: [
      { title: "Purpose", body: "Linkaro requires identity and credential verification for Service Providers to promote trust and safety on the Platform. This Policy describes the types of documents required, the verification process, and how verification data is handled." },
      { title: "Documents Required", body: "Service Providers may be required to submit:\n\n• CNIC (Computerized National Identity Card) or equivalent government-issued identity document.\n• Proof of address (utility bill, bank statement, or similar).\n• Relevant professional licences, trade certificates, or business registration documents, where applicable to the service category." },
      { title: "Verification Process", body: "Submitted documents are reviewed by Linkaro or an authorised verification partner. Verification confirms identity and, where applicable, professional credentials. It does not guarantee the skill, reliability, honesty, or future conduct of a Service Provider." },
      { title: "Ongoing Verification", body: "Linkaro reserves the right to request updated documents at any time, including upon renewal of a subscription or following a reported incident." },
      { title: "Rejection", body: "Applications may be rejected if submitted documents are unclear, expired, inconsistent, or cannot be verified. Users will be notified of the outcome and may resubmit corrected documents." },
      { title: "Data Handling", body: "Verification documents are stored securely and retained for up to five (5) years in accordance with our Data Retention & Deletion Policy. They are not shared with third parties except as required by law or for the purpose of verification." },
      { title: "Contact Us", body: "For questions regarding this Policy, please contact us at info@linkaroapp.com." },
    ],
  },
  {
    id: "community",
    title: "Community Guidelines",
    sections: [
      { title: "Our Community Values", body: "Linkaro exists to connect people who need skilled help with professionals who can provide it. We expect every member of our community — whether Customer or Service Provider — to engage with honesty, respect, and professionalism." },
      { title: "Respectful Conduct", body: "Harassment, discrimination, hate speech, or abusive behaviour toward any user on the basis of gender, religion, ethnicity, nationality, disability, age, or any other characteristic will not be tolerated on the Platform." },
      { title: "Honest Representation", body: "Users must maintain accurate profiles and must not impersonate another individual or business, misrepresent their skills, identity, qualifications, or intentions, or use another person's account." },
      { title: "Safe Interactions", body: "We encourage users to communicate through the Platform where possible, verify details before meeting in person, and choose safe, appropriate settings for service delivery. Exercise personal judgment when meeting strangers." },
      { title: "Prohibited Behaviour", body: "The following are strictly prohibited:\n\n• Threats of violence or intimidation toward any user.\n• Scams, fraud, or deceptive practices of any kind.\n• Soliciting or offering illegal services.\n• Spamming or sending unsolicited commercial messages.\n• Sharing another user's personal information without their consent.\n• Any conduct that endangers the safety of another user." },
      { title: "Reporting & Blocking", body: "Users can report violations through the in-app flag button available in every chat, or by contacting support at info@linkaroapp.com. Users can also block any other user directly from the chat screen — blocked users cannot send messages to the user who blocked them. Reports are reviewed in accordance with our Trust & Safety Policy." },
      { title: "Consequences", body: "Violations of these Guidelines may result in a warning, content removal, temporary suspension, or permanent removal from the Platform, at Linkaro's sole discretion." },
      { title: "Contact Us", body: "For questions, please contact us at info@linkaroapp.com." },
    ],
  },
  {
    id: "trust-safety",
    title: "Trust & Safety Policy",
    sections: [
      { title: "Our Commitment", body: "Linkaro is committed to fostering a safe environment for Customers and Service Providers. This Policy describes the trust and safety measures we apply and the shared responsibilities of our users." },
      { title: "Identity Verification", body: "We apply identity and credential verification to Service Providers through our KYC process. Verification confirms identity and, where relevant, professional credentials. It does not guarantee any particular conduct." },
      { title: "Reporting & Blocking", body: "Users can report unsafe, threatening, or inappropriate behaviour through the in-app flag button available in every chat, or by emailing info@linkaroapp.com. Users can also block any other user from the chat screen — blocked users cannot send messages to the blocker. Reports are treated with confidentiality and reviewed promptly." },
      { title: "Emergency Situations", body: "In an emergency, contact local emergency services directly (Police: 15; Rescue: 1122 in Pakistan). Linkaro is not equipped to respond to real-time emergencies." },
      { title: "Account Review Process", body: "Reports involving safety concerns are prioritised for review. We may temporarily suspend an account pending investigation and will communicate the outcome to all affected parties where appropriate." },
      { title: "Cooperation with Law Enforcement", body: "Linkaro cooperates with law enforcement authorities in accordance with applicable law and our Law Enforcement Request Policy." },
      { title: "User Responsibility", body: "Users are responsible for exercising reasonable personal judgment when interacting with other users, including verifying credentials independently before engaging services and meeting in safe, appropriate locations." },
      { title: "Limitations", body: "While Linkaro takes reasonable steps to promote safety, we cannot guarantee the conduct of any user and are not liable for incidents arising from offline interactions between users." },
      { title: "Contact Us", body: "For questions, please contact us at info@linkaroapp.com." },
    ],
  },
  {
    id: "content-moderation",
    title: "Content Moderation Policy",
    sections: [
      { title: "Scope", body: "This Policy applies to all content submitted to the Platform by users, including profile information, service descriptions, job postings, messages, ratings and reviews, and any images or files uploaded." },
      { title: "Content Standards", body: "All user-generated content must be accurate, lawful, and respectful. Content that is false, misleading, abusive, defamatory, discriminatory, sexually explicit, violent, or otherwise harmful is prohibited." },
      { title: "Review Process", body: "Content may be reviewed proactively by automated systems or manually by our team, or reactively following a user report. We aim to review reported content within a reasonable timeframe." },
      { title: "Content Removal", body: "Content that violates these standards will be removed. The user who submitted the content will be notified where appropriate. Removal does not require prior notice in cases involving serious harm." },
      { title: "Repeat Violations", body: "Repeated or serious violations may result in account suspension or permanent termination in accordance with our Platform Rules & Enforcement Policy." },
      { title: "Appeals", body: "Users who believe their content was removed in error may appeal by contacting info@linkaroapp.com within 30 days of removal. We will review appeals and respond within a reasonable time." },
      { title: "User Content Licence", body: "By submitting content to the Platform, you grant Linkaro a non-exclusive, royalty-free, worldwide licence to store, display, reproduce, and use that content solely for the purpose of operating the Platform." },
      { title: "Contact Us", body: "For questions, please contact us at info@linkaroapp.com." },
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use Policy",
    sections: [
      { title: "Purpose", body: "This Acceptable Use Policy sets out the activities that are prohibited when using the Linkaro Platform. It applies to all users, including Customers and Service Providers." },
      { title: "Permitted Use", body: "The Platform may be used solely for its intended purpose: to connect Customers with skilled Service Providers, in accordance with these policies and applicable law." },
      { title: "Prohibited Activities", body: "The following activities are strictly prohibited:\n\n• Attempting to gain unauthorized access to the Platform or any other user's account.\n• Scraping or harvesting data from the Platform without prior written authorisation.\n• Uploading, transmitting, or distributing viruses, malware, or other harmful code.\n• Engaging in fraud, phishing, identity theft, or deceptive practices.\n• Sending spam or unsolicited bulk communications.\n• Circumventing verification, security, or payment mechanisms.\n• Posting, soliciting, or arranging illegal services.\n• Harassing, stalking, or threatening other users." },
      { title: "Automated Access", body: "Use of bots, scripts, crawlers, or other automated means to access, index, or interact with the Platform is prohibited without prior written consent from Linkaro." },
      { title: "Consequences", body: "Violations may result in content removal, account suspension, permanent termination, and referral to law enforcement where applicable." },
      { title: "Reporting Misuse", body: "Suspected violations should be reported through the in-app reporting tool or via info@linkaroapp.com." },
      { title: "Contact Us", body: "For questions, please contact us at info@linkaroapp.com." },
    ],
  },
  {
    id: "refund",
    title: "Refund & Cancellation Policy",
    sections: [
      { title: "Scope", body: "This Policy applies to subscription fees paid by Service Providers. Use of the Platform by Customers is free of charge. Payment for services is made directly between Customers and Service Providers and is not governed by this Policy." },
      { title: "Subscription Cancellation", body: "Service Providers may cancel their subscription at any time through their account settings or by contacting support. Cancellation takes effect at the end of the current billing cycle, and access to paid features will continue until that date." },
      { title: "Refund Eligibility", body: "Refunds may be issued for:\n\n• Duplicate or erroneous charges caused by a technical or billing error on Linkaro's part.\n• A verified platform outage that prevented use of a materially paid feature for a significant period.\n• Any circumstance in which a refund is required under applicable consumer protection law." },
      { title: "Non-Refundable Circumstances", body: "Subscription fees are not refundable for:\n\n• Partial billing periods following cancellation.\n• Account suspension or termination resulting from a policy violation.\n• Dissatisfaction with the volume or quality of customer leads received." },
      { title: "Refund Process", body: "Eligible refund requests must be submitted to Linkaro support within 30 days of the disputed charge. Approved refunds will be processed to the original payment method within a reasonable timeframe." },
      { title: "Google Play Subscriptions", body: "For subscriptions purchased through Google Play, cancellation and refund requests are also subject to Google Play's billing and refund policies. Refund requests for Google Play purchases must be submitted through Google Play's support channels." },
      { title: "Contact Us", body: "For questions about this Policy, please contact us at info@linkaroapp.com." },
    ],
  },
  {
    id: "dispute",
    title: "Complaint & Dispute Resolution Policy",
    sections: [
      { title: "Filing a Complaint", body: "Users with a complaint about the Platform, another user, or a service experience may submit a complaint by emailing info@linkaroapp.com. Please include your name, account email, a description of the issue, and any supporting evidence." },
      { title: "Review Timeline", body: "Complaints are acknowledged within three (3) business days. We aim to complete our review and provide a substantive response within 14 business days of receiving a complaint. Complex matters may take longer." },
      { title: "Escalation", body: "If you are dissatisfied with our initial response, you may request escalation to a senior reviewer by replying to our response and stating the basis for your escalation." },
      { title: "Disputes Between Users", body: "Linkaro is not a party to agreements between Customers and Service Providers. We encourage users to resolve disputes directly. Where a dispute involves a platform policy violation or safety concern, we may intervene at our discretion." },
      { title: "Formal Resolution", body: "Where a dispute cannot be resolved informally, the parties agree that it shall be subject to the laws of the Islamic Republic of Pakistan and the competent courts at Islamabad, unless otherwise required by applicable law." },
      { title: "Contact Us", body: "To file a complaint: info@linkaroapp.com." },
    ],
  },
  {
    id: "enforcement",
    title: "Platform Rules & Enforcement Policy",
    sections: [
      { title: "Rule Categories", body: "Linkaro's rules cover: identity and honesty (accurate profiles, no impersonation); conduct (respectful behaviour, no harassment or threats); service delivery (honest representation of skills and pricing); and legal compliance (no illegal activities or content)." },
      { title: "Enforcement Actions", body: "Violations may result in one or more of the following actions, depending on severity:\n\n1. Warning: first-time or minor violations.\n2. Content removal: specific offending content is removed.\n3. Feature restriction: temporary limitation of account functions.\n4. Temporary suspension: account access suspended pending review.\n5. Permanent termination: account permanently closed and, where appropriate, blacklisted." },
      { title: "Factors Considered", body: "When determining the appropriate enforcement action, we consider the severity and nature of the violation, the user's history on the Platform, the impact on other users, and any mitigating circumstances." },
      { title: "Appeals", body: "Users may appeal an enforcement action within 30 days by contacting info@linkaroapp.com. Appeals are reviewed independently of the original decision. We will respond within a reasonable timeframe." },
      { title: "Immediate Termination", body: "Certain violations may result in immediate permanent termination without prior warning, including: fraud or financial crime; threats of violence; operating an illegal service; sharing child sexual abuse material; or repeated serious violations after prior warnings." },
      { title: "Contact Us", body: "For questions, please contact us at info@linkaroapp.com." },
    ],
  },
  {
    id: "copyright",
    title: "Copyright & Intellectual Property Policy",
    sections: [
      { title: "Platform IP Ownership", body: "The Linkaro name, logo, application software, design, text, graphics, and all other content produced by or for Linkaro are the exclusive property of Linkaro (Private) Limited and are protected by applicable intellectual property laws." },
      { title: "User Content Licence", body: "By submitting content to the Platform (such as profile information, service descriptions, or images), you grant Linkaro a non-exclusive, royalty-free, worldwide, sublicensable licence to use, store, display, reproduce, and adapt that content for the purposes of operating and promoting the Platform." },
      { title: "Third-Party Intellectual Property", body: "Users must not upload, share, or otherwise use content on the Platform that infringes a third party's copyright, trade mark, patent, or other intellectual property rights." },
      { title: "Trade Mark Use", body: "You may not use Linkaro's name, logo, or other trade marks in any manner that suggests endorsement, affiliation, or sponsorship without our prior written consent." },
      { title: "Reporting Infringement", body: "If you believe content on the Platform infringes your intellectual property rights, please submit a notice in accordance with our DMCA & Copyright Complaint Policy." },
      { title: "Contact Us", body: "For questions, please contact us at info@linkaroapp.com." },
    ],
  },
  {
    id: "dmca",
    title: "DMCA & Copyright Complaint Policy",
    sections: [
      { title: "Filing a Copyright Complaint", body: "To file a copyright complaint, please email info@linkaroapp.com with the subject line \"Copyright Complaint\" and include:\n\n• Your name, address, email address, and phone number.\n• A description of the copyrighted work you believe has been infringed.\n• The URL or other location of the allegedly infringing content on the Platform.\n• A statement that you have a good-faith belief that the use is not authorised by the copyright owner.\n• A statement, under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorised to act on their behalf.\n• Your electronic or physical signature." },
      { title: "Counter-Notification", body: "If you believe your content was removed in error, you may submit a counter-notification to info@linkaroapp.com. The counter-notification must include your contact details, identification of the removed content and its location before removal, a statement under penalty of perjury that you have a good-faith belief the content was removed in error, and your consent to jurisdiction in Islamabad, Pakistan." },
      { title: "Repeat Infringer Policy", body: "Linkaro will terminate accounts of users who are found to be repeat infringers of intellectual property rights." },
      { title: "Contact", body: "Email copyright complaints to info@linkaroapp.com with the subject \"Copyright Complaint\"." },
    ],
  },
  {
    id: "disclaimer",
    title: "Legal Disclaimer",
    sections: [
      { title: "General Disclaimer", body: "The Linkaro Platform and all content, information, and services provided through it are offered \"as is\" and \"as available\" without warranties of any kind, whether express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement." },
      { title: "No Professional Advice", body: "Nothing on the Platform constitutes legal, financial, medical, professional, or any other form of regulated advice. Users should seek appropriate professional advice before relying on any information obtained through the Platform." },
      { title: "Third-Party Services", body: "Linkaro is not responsible for the content, accuracy, or practices of third-party websites or services linked from or integrated with the Platform." },
      { title: "No Employment Relationship", body: "Nothing in the Platform or these terms creates an employment, partnership, or agency relationship between Linkaro and any Service Provider or Customer." },
      { title: "Assumption of Risk", body: "Users acknowledge and accept the inherent risks associated with engaging services through an online marketplace, including risk arising from offline interactions with other users." },
      { title: "Limitation of Liability", body: "To the maximum extent permitted by applicable law, Linkaro shall not be liable for any indirect, incidental, consequential, punitive, or special damages arising from your use of, or inability to use, the Platform or any services facilitated through it." },
      { title: "Contact Us", body: "For questions, please contact us at info@linkaroapp.com." },
    ],
  },
  {
    id: "accessibility",
    title: "Accessibility Statement",
    sections: [
      { title: "Our Commitment", body: "Linkaro is committed to making the Platform accessible to all users, including those with disabilities. We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA for our web application." },
      { title: "Ongoing Efforts", body: "We regularly review the Platform for accessibility issues and work to address identified barriers. This includes testing with assistive technologies and user feedback." },
      { title: "Limitations", body: "Third-party content, plugins, or services integrated into the Platform may not meet the same accessibility standards. We will work with third-party providers to improve accessibility where possible." },
      { title: "Feedback", body: "If you experience an accessibility barrier or have suggestions for improvement, please contact us at info@linkaroapp.com. We aim to respond within 5 business days." },
      { title: "Contact Us", body: "Accessibility feedback: info@linkaroapp.com." },
    ],
  },
  {
    id: "vendor",
    title: "Vendor & Service Provider Agreement",
    sections: [
      { title: "Scope", body: "This Agreement governs the relationship between Linkaro (Private) Limited and Service Providers who use the Platform to offer their services to Customers." },
      { title: "Term", body: "The Agreement commences upon the activation of a Service Provider account and continues for the duration of active subscription, unless terminated earlier in accordance with this Agreement." },
      { title: "Fees", body: "Service Providers pay a subscription fee to access the Platform. Fee amounts and billing cycles are as stated in the app at the time of subscription. Linkaro reserves the right to revise fees with reasonable notice." },
      { title: "Service Provider Obligations", body: "Service Providers must: maintain an accurate and complete profile; represent their qualifications and services honestly; comply with all applicable laws including licensing and tax obligations; act professionally and respectfully toward Customers; and comply with Linkaro's policies." },
      { title: "Linkaro Obligations", body: "Linkaro will: maintain the Platform in reasonable working order; process subscription payments; provide support via available channels; and give reasonable notice of material changes to these terms or the Platform." },
      { title: "Independent Contractor", body: "Service Providers are independent contractors and not employees, agents, or partners of Linkaro. Linkaro does not supervise, direct, or control the services provided by Service Providers." },
      { title: "Confidentiality", body: "Each party agrees to keep confidential any non-public information received from the other party and to use it only for the purposes of this Agreement." },
      { title: "Indemnification", body: "Service Providers agree to indemnify and hold harmless Linkaro, its directors, officers, and employees from and against any claims, damages, liabilities, and costs (including legal fees) arising from their services, their breach of this Agreement, or their violation of applicable law." },
      { title: "Limitation of Liability", body: "Linkaro's total liability to a Service Provider under this Agreement shall not exceed the total subscription fees paid by that Service Provider in the three (3) months preceding the claim." },
      { title: "Termination", body: "Either party may terminate this Agreement by cancelling the subscription. Linkaro may terminate immediately for material breach of policy. On termination, the Service Provider's access to the Platform ends at the close of the current billing period." },
      { title: "Governing Law", body: "This Agreement is governed by the laws of the Islamic Republic of Pakistan. Disputes shall be subject to the exclusive jurisdiction of the courts at Islamabad." },
    ],
  },
  {
    id: "law-enforcement",
    title: "Law Enforcement Request Policy",
    sections: [
      { title: "Valid Legal Process Required", body: "Linkaro requires a valid legal process — such as a court order, subpoena, search warrant, or equivalent — before disclosing user data to law enforcement authorities. Informal requests, without legal process, will not be fulfilled." },
      { title: "Requestor Requirements", body: "Law enforcement requests must be submitted on official letterhead, identify the requesting authority and officer, specify the legal basis and jurisdiction, describe the data sought with particularity, and be directed to Linkaro's registered office." },
      { title: "Emergency Requests", body: "In cases involving imminent risk to life or physical safety, Linkaro may disclose data without formal legal process to the extent necessary to prevent the harm, consistent with applicable law." },
      { title: "User Notification", body: "Where permitted by law and consistent with the legal process received, Linkaro will endeavour to notify affected users before disclosing their data, to allow them the opportunity to challenge the request." },
      { title: "Scope of Data", body: "Linkaro will only provide data that is directly relevant to the scope of the valid legal request and will not provide data beyond what is required." },
      { title: "Contact", body: "Law enforcement requests should be directed to Linkaro's registered address marked \"Law Enforcement Request\", or emailed to info@linkaroapp.com with that subject line." },
    ],
  },
  {
    id: "security",
    title: "Security Vulnerability Disclosure Policy",
    sections: [
      { title: "Scope", body: "This Policy applies to security vulnerabilities discovered in Linkaro's website, Android and iOS applications, and backend API services." },
      { title: "How to Report", body: "If you discover a security vulnerability, please report it responsibly by emailing info@linkaroapp.com with the subject line \"Security Vulnerability\". Include a clear description of the vulnerability, the steps to reproduce it, the potential impact, and any supporting evidence." },
      { title: "Responsible Disclosure Guidelines", body: "We ask that researchers:\n\n• Do not access, modify, or delete user data beyond what is necessary to demonstrate the vulnerability.\n• Do not conduct denial-of-service attacks or disrupt the Platform.\n• Do not disclose the vulnerability publicly until Linkaro has had reasonable time to address it.\n• Do not use the vulnerability for personal gain or to harm users." },
      { title: "Safe Harbour", body: "Linkaro will not pursue legal action against researchers who discover and report security vulnerabilities in good faith and in accordance with these guidelines." },
      { title: "Response Timeline", body: "We will acknowledge receipt of a valid vulnerability report within 5 business days and provide an initial assessment within 30 days. We aim to remediate confirmed critical vulnerabilities as quickly as practicable." },
      { title: "Contact", body: "Email security reports to info@linkaroapp.com with the subject \"Security Vulnerability\"." },
    ],
  },
  {
    id: "eula",
    title: "End User Licence Agreement (EULA)",
    sections: [
      { title: "Introduction", body: "This End User Licence Agreement (\"EULA\") is a legal agreement between you and Linkaro (Private) Limited governing your use of the Linkaro mobile and web applications (the \"App\"). By downloading, installing, or using the App, you agree to be bound by this EULA." },
      { title: "1. Licence Grant", body: "Linkaro grants you a limited, non-exclusive, non-transferable, revocable licence to download, install, and use the App on a device you own or control, solely for your personal or business use of the Platform." },
      { title: "2. Restrictions", body: "You may not:\n\n• Copy, modify, or create derivative works of the App.\n• Reverse engineer, decompile, or disassemble the App.\n• Rent, lease, sell, or sublicense the App to any third party.\n• Remove or alter any proprietary notices or labels on the App.\n• Use the App for any unlawful purpose." },
      { title: "3. Ownership", body: "The App, including all associated intellectual property rights, is and remains the exclusive property of Linkaro (Private) Limited. This EULA does not grant you any ownership rights in the App." },
      { title: "4. Updates", body: "Linkaro may issue updates, patches, or new versions of the App at any time. Continued use of the App following an update constitutes acceptance of the updated version." },
      { title: "5. Termination", body: "This licence is effective until terminated. It will terminate automatically if you fail to comply with any provision of this EULA, or upon termination of your Linkaro account." },
      { title: "6. Disclaimer of Warranties", body: "The App is provided \"as is\" and \"as available\" without warranties of any kind, whether express or implied, including but not limited to warranties of merchantability or fitness for a particular purpose." },
      { title: "7. Limitation of Liability", body: "To the maximum extent permitted by applicable law, Linkaro shall not be liable for any indirect, incidental, or consequential damages arising from your use of, or inability to use, the App." },
      { title: "8. Governing Law", body: "This Agreement is governed by the laws of the Islamic Republic of Pakistan. The courts at Islamabad shall have exclusive jurisdiction over any dispute arising out of this Agreement." },
      { title: "9. Contact Us", body: "For questions, please contact us at info@linkaroapp.com." },
    ],
  },
  {
    id: "definitions",
    title: "Master Definitions",
    sections: [
      { title: "Defined Terms", body: "The following definitions apply across all Linkaro policies and agreements unless a specific document states otherwise:\n\nAgreement — any contract, policy, or terms document between you and Linkaro (Private) Limited.\n\nApplicable Law — all laws, regulations, and enforceable guidelines in force in the jurisdiction relevant to the processing, activity, or relationship in question.\n\nCompany / Linkaro — Linkaro (Private) Limited, a company incorporated under the laws of the Islamic Republic of Pakistan.\n\nContent — any text, images, files, data, or other material submitted, uploaded, or transmitted by a user through the Platform.\n\nCustomer — any individual who creates an account on the Platform to post service requests and connect with Service Providers.\n\nEffective Date — the date on which a specific policy or agreement comes into force, as stated in that document.\n\nFees — the subscription charges payable by Service Providers for access to the Platform, as specified in the app.\n\nPersonal Data — any information that identifies or can identify a natural person, as defined by applicable data protection law.\n\nPlatform — the Linkaro mobile application, website, and all related services and tools.\n\nService Provider — any individual or entity who creates an account on the Platform to offer services to Customers.\n\nServices — all features, tools, and functionality provided by Linkaro through the Platform.\n\nSubscription — a recurring paid plan purchased by a Service Provider that grants access to Platform features for the subscription period.\n\nUser — any individual who accesses or uses the Platform, including Customers and Service Providers.\n\nUser Content — any Content submitted to the Platform by a User.\n\nVerification Documents — identity documents, professional credentials, and other materials submitted by a Service Provider for the purpose of verification under the KYC & Verification Policy." },
    ],
  },
];

// ── Components ───────────────────────────────────────────────────────────────

function PolicySection({ section }) {
  return (
    <div
      id={section.id}
      style={{
        marginBottom: "clamp(20px, 2.5vw, 32px)",
        background: section.highlight ? "rgba(254,89,0,0.06)" : "transparent",
        border: section.highlight ? "1px solid rgba(254,89,0,0.2)" : "none",
        borderRadius: section.highlight ? 12 : 0,
        padding: section.highlight ? "clamp(16px, 2vw, 24px)" : 0,
      }}
    >
      <h2
        style={{
          fontFamily: PP_MORI,
          fontWeight: 600,
          fontSize: "clamp(15px, 1.3vw, 18px)",
          color: section.highlight ? ORANGE : "#ffffff",
          margin: "0 0 10px 0",
        }}
      >
        {section.title}
      </h2>
      <div
        style={{
          fontFamily: GEIST,
          fontWeight: 400,
          fontSize: "clamp(13px, 1.1vw, 15px)",
          color: "rgba(255,255,255,0.72)",
          lineHeight: 1.72,
          whiteSpace: "pre-line",
        }}
      >
        {section.body}
      </div>
      {section.link && (
        <a
          href={section.link.href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 16,
            padding: "10px 20px",
            background: ORANGE,
            color: "#ffffff",
            borderRadius: 8,
            fontFamily: GEIST,
            fontWeight: 600,
            fontSize: "clamp(12px, 1vw, 14px)",
            textDecoration: "none",
          }}
        >
          {section.link.label} →
        </a>
      )}
    </div>
  );
}

function AccordionItem({ policy, isOpen, onToggle }) {
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "clamp(14px, 1.5vw, 20px) 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: PP_MORI,
            fontWeight: 600,
            fontSize: "clamp(14px, 1.2vw, 17px)",
            color: isOpen ? ORANGE : "rgba(255,255,255,0.9)",
            transition: "color 0.15s",
          }}
        >
          {policy.title}
        </span>
        <span
          style={{
            flexShrink: 0,
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: `1px solid ${isOpen ? ORANGE : "rgba(255,255,255,0.2)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isOpen ? ORANGE : "rgba(255,255,255,0.5)",
            fontSize: 16,
            transition: "border-color 0.15s, color 0.15s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transitionProperty: "border-color, color, transform",
          }}
        >
          ↓
        </span>
      </button>

      {isOpen && (
        <div style={{ paddingBottom: "clamp(16px, 2vw, 28px)" }}>
          {policy.sections.map((s) => (
            <div key={s.title} style={{ marginBottom: 20 }}>
              <h3
                style={{
                  fontFamily: GEIST,
                  fontWeight: 600,
                  fontSize: "clamp(12px, 1vw, 14px)",
                  color: "rgba(255,255,255,0.85)",
                  margin: "0 0 6px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: GEIST,
                  fontWeight: 400,
                  fontSize: "clamp(13px, 1.1vw, 15px)",
                  color: "rgba(255,255,255,0.62)",
                  lineHeight: 1.72,
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PrivacyPolicy() {
  const [openPolicies, setOpenPolicies] = useState(new Set());

  function togglePolicy(id) {
    setOpenPolicies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    setOpenPolicies(new Set(additionalPolicies.map((p) => p.id)));
  }

  function collapseAll() {
    setOpenPolicies(new Set());
  }

  return (
    <>
      <Head>
        <title>Privacy Policy | Linkaro</title>
      </Head>

      <div
        style={{
          minHeight: "100vh",
          background: "#000f2c",
          padding: "clamp(24px, 5vw, 64px) clamp(16px, 4vw, 24px)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Linkaro"
            width={140}
            height={70}
            style={{
              width: "clamp(100px, 10vw, 140px)",
              height: "auto",
              marginBottom: "clamp(24px, 3vw, 40px)",
            }}
          />

          {/* Title */}
          <h1
            style={{
              fontFamily: PP_MORI,
              fontWeight: 600,
              fontSize: "clamp(24px, 3vw, 36px)",
              letterSpacing: "-0.02em",
              color: "#ffffff",
              margin: "0 0 8px 0",
            }}
          >
            Privacy Policy
          </h1>
          <p
            style={{
              fontFamily: GEIST,
              fontSize: "clamp(11px, 1vw, 13px)",
              color: "rgba(255,255,255,0.5)",
              margin: "0 0 clamp(28px, 3.5vw, 48px) 0",
            }}
          >
            Last updated: July 09, 2026
          </p>

          {/* ── Main Privacy Policy ── */}
          {privacySections.map((s) => (
            <PolicySection key={s.title} section={s} />
          ))}

          {/* ── Divider ── */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              margin: "clamp(32px, 4vw, 56px) 0 clamp(24px, 3vw, 40px) 0",
            }}
          />

          {/* ── Additional Policies heading ── */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: "clamp(12px, 1.5vw, 20px)",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: PP_MORI,
                  fontWeight: 600,
                  fontSize: "clamp(18px, 1.8vw, 24px)",
                  color: "#ffffff",
                  margin: "0 0 8px 0",
                }}
              >
                Additional Policies
              </h2>
              <p
                style={{
                  fontFamily: GEIST,
                  fontSize: "clamp(12px, 1vw, 14px)",
                  color: "rgba(255,255,255,0.45)",
                  margin: 0,
                }}
              >
                {additionalPolicies.length} documents · click any policy to expand
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button
                type="button"
                onClick={expandAll}
                style={{
                  fontFamily: GEIST,
                  fontSize: "clamp(11px, 0.9vw, 13px)",
                  fontWeight: 500,
                  padding: "6px 14px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                }}
              >
                Expand all
              </button>
              <button
                type="button"
                onClick={collapseAll}
                style={{
                  fontFamily: GEIST,
                  fontSize: "clamp(11px, 0.9vw, 13px)",
                  fontWeight: 500,
                  padding: "6px 14px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                }}
              >
                Collapse all
              </button>
            </div>
          </div>

          {/* ── Accordion list ── */}
          <div>
            {additionalPolicies.map((policy) => (
              <AccordionItem
                key={policy.id}
                policy={policy}
                isOpen={openPolicies.has(policy.id)}
                onToggle={() => togglePolicy(policy.id)}
              />
            ))}
          </div>

          {/* ── Contact ── */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "clamp(24px, 3vw, 40px)",
              marginTop: "clamp(24px, 3vw, 40px)",
            }}
          >
            <p
              style={{
                fontFamily: GEIST,
                fontSize: "clamp(13px, 1.1vw, 15px)",
                color: "rgba(255,255,255,0.55)",
                margin: 0,
                lineHeight: 1.65,
              }}
            >
              Privacy questions? Contact us at{" "}
              <a href="mailto:info@linkaroapp.com" style={{ color: ORANGE, textDecoration: "none" }}>
                info@linkaroapp.com
              </a>
              .{" "}
              To delete your account and data, use our{" "}
              <a href="/data-deletion" style={{ color: ORANGE, textDecoration: "none" }}>
                Data Deletion Request form
              </a>
              .
            </p>
          </div>

          {/* ── Footer ── */}
          <p
            style={{
              fontFamily: GEIST,
              fontSize: "clamp(11px, 0.9vw, 13px)",
              color: "rgba(255,255,255,0.2)",
              marginTop: "clamp(32px, 4vw, 56px)",
            }}
          >
            © {new Date().getFullYear()} Linkaro. All rights reserved.{" "}
            <a href="/terms-of-services" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "underline" }}>
              Terms of Service
            </a>{" "}
            ·{" "}
            <a href="/data-deletion" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "underline" }}>
              Data Deletion
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

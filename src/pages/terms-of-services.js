import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

const GEIST = "'Geist', sans-serif";
const PP_MORI = "'PP Mori', sans-serif";
const ORANGE = "#FE5900";

const consumerSections = [
  {
    title: "1. Acceptance of Terms",
    body: "These Terms & Conditions apply to all customers using the Linkaro platform. By creating an account, posting a service request, contacting a service provider, or using any feature of the platform, you agree to these Terms & Conditions. You must be at least 18 years of age to create an account or use Linkaro. By using the platform, you confirm that you meet this age requirement.",
  },
  {
    title: "2. About Linkaro",
    body: "Linkaro is a digital marketplace that connects customers with independent service providers. Linkaro does not perform services and is not a party to the agreement between the customer and the service provider.",
  },
  {
    title: "3. Independent Service Providers",
    body: "All service providers operate independently and are solely responsible for their services, conduct, workmanship, pricing, commitments, and the outcomes of the services they provide.",
  },
  {
    title: "4. Customer Responsibility",
    body: "Customers are responsible for verifying that a service provider is suitable for their needs before hiring them. Customers should agree on pricing, scope of work, timelines, and payment terms directly with the service provider.",
  },
  {
    title: "5. Disputes and Liability",
    body: "Any dispute, damage, loss, theft, misconduct, poor workmanship, delay, payment disagreement, or other issue arising from a service is solely between the customer and the service provider. Linkaro is not responsible for resolving private contractual disputes.",
  },
  {
    title: "6. Verification",
    body: "Linkaro may verify service providers through CNIC verification, mobile verification, profile review, and other available methods. Verification confirms identity only and does not guarantee skills, reliability, honesty, or future conduct.",
  },
  {
    title: "7. Fraud and Safety",
    body: "If fraud or serious misconduct is reported, Linkaro may review the complaint, request evidence, suspend or permanently remove the provider, blacklist account identifiers, and cooperate with law enforcement where legally required.",
  },
  {
    title: "8. Ratings and Reviews",
    body: "Customers are encouraged to leave honest ratings and reviews after each completed service. Repeated violations of platform standards may result in warnings, suspension, or permanent removal of a provider.",
  },
  {
    title: "9. Platform Fees",
    body: "Customers are not charged any platform fee for posting service requests or connecting with service providers. Any payment for services is made directly between the customer and the service provider unless Linkaro introduces a separate payment service in the future.",
  },
  {
    title: "10. Limitation of Liability",
    body: "To the maximum extent permitted by applicable law, Linkaro shall not be liable for direct or indirect loss, property damage, theft, personal injury, financial loss, service quality issues, delays, disputes, or claims arising from services performed by independent service providers.",
  },
  {
    title: "11. Changes to These Terms",
    body: "Linkaro may update these Terms & Conditions from time to time. Continued use of the platform after updates constitutes acceptance of the revised terms.",
  },
  {
    title: "12. Acceptance",
    body: "By using the Linkaro platform, you acknowledge that you have read, understood, and agreed to these Customer Terms & Conditions.",
  },
];

const providerSections = [
  {
    title: "1. Acceptance of Terms",
    body: "By registering as a service provider on Linkaro, you agree to comply with these Terms & Conditions. If you do not agree, you must not create or use a service provider account. You must be at least 18 years of age to register as a service provider. By registering, you confirm that you meet this age requirement.",
  },
  {
    title: "2. Independent Service Provider Status",
    body: "You acknowledge that you are an independent service provider. Nothing in these Terms creates an employment, partnership, agency, joint venture, or contractor relationship with Linkaro.",
  },
  {
    title: "3. Provider Responsibilities",
    body: "You are solely responsible for the services you offer, your qualifications, workmanship, pricing, communication, commitments, taxes, licenses, permits, insurance (where applicable), and compliance with applicable laws.",
  },
  {
    title: "4. Customer Agreements",
    body: "All agreements regarding scope of work, pricing, timelines, materials, warranties, and payment are made directly between you and the customer. Linkaro is not a party to these agreements.",
  },
  {
    title: "5. Liability for Services",
    body: "You accept full legal responsibility for any property damage, financial loss, negligence, fraud, theft, misconduct, personal injury, poor workmanship, or legal claims arising from your services. Linkaro bears no responsibility for your acts or omissions.",
  },
  {
    title: "6. Identity Verification",
    body: "Linkaro may require CNIC verification, mobile verification, profile review, or additional KYC checks. Verification confirms identity only and does not endorse or guarantee your services.",
  },
  {
    title: "7. Professional Conduct",
    body: "You must act honestly, respectfully, professionally, protect customer privacy and property, comply with safety standards, and charge only mutually agreed prices.",
  },
  {
    title: "8. Fraud and Prohibited Activities",
    body: "Fraud, theft, impersonation, harassment, abuse, misleading information, illegal activity, or policy violations may result in immediate suspension or permanent termination without prior notice. Linkaro may cooperate with law enforcement where legally required.",
  },
  {
    title: "9. Ratings, Reviews and Enforcement",
    body: "Customer ratings and complaints may be used to assess performance. Linkaro may issue warnings, suspend, or permanently terminate accounts. Serious misconduct may result in immediate removal without prior warnings.",
  },
  {
    title: "10. Subscription Fees",
    body: "Subscription fees provide access to the marketplace and platform features only. They do not constitute payment for services or create any employment or agency relationship.",
  },
  {
    title: "11. Intellectual Property",
    body: "You may not misuse Linkaro's name, trademarks, logos, software, or content without prior written permission.",
  },
  {
    title: "12. Indemnification",
    body: "You agree to defend, indemnify, and hold Linkaro, its directors, officers, employees, and affiliates harmless against claims, damages, liabilities, costs, and legal expenses arising from your services or breach of these Terms.",
  },
  {
    title: "13. Limitation of Liability",
    body: "To the maximum extent permitted by law, Linkaro shall not be liable for indirect, incidental, consequential, or punitive damages arising from your use of the platform or services performed.",
  },
  {
    title: "14. Suspension and Termination",
    body: "Linkaro may suspend, restrict, or permanently terminate your account at its discretion where these Terms are violated or platform safety is at risk. Permanently terminated providers may be blacklisted from future registration.",
  },
  {
    title: "15. Amendments",
    body: "Linkaro may amend these Terms at any time. Continued use of the platform after publication of updated Terms constitutes acceptance.",
  },
  {
    title: "16. Governing Law",
    body: "These Terms shall be governed by the laws of the Islamic Republic of Pakistan. Any disputes relating to these Terms shall be subject to the competent courts of Pakistan unless otherwise required by applicable law.",
  },
  {
    title: "17. Acceptance",
    body: "By creating and using a Linkaro Service Provider account, you confirm that you have read, understood, and agreed to these Terms & Conditions.",
  },
];

function Section({ title, body }) {
  return (
    <div style={{ marginBottom: "clamp(20px, 2.5vw, 32px)" }}>
      <h2
        style={{
          fontFamily: PP_MORI,
          fontWeight: 600,
          fontSize: "clamp(15px, 1.3vw, 18px)",
          color: "#ffffff",
          margin: "0 0 8px 0",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontFamily: GEIST,
          fontWeight: 400,
          fontSize: "clamp(13px, 1.1vw, 15px)",
          color: "rgba(255,255,255,0.72)",
          lineHeight: 1.72,
          margin: 0,
        }}
      >
        {body}
      </p>
    </div>
  );
}

export default function TermsOfServices() {
  const [tab, setTab] = useState("consumer");

  const sections = tab === "consumer" ? consumerSections : providerSections;

  return (
    <>
      <Head>
        <title>Terms of Service | Linkaro</title>
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
            Terms of Service
          </h1>
          <p
            style={{
              fontFamily: GEIST,
              fontSize: "clamp(11px, 1vw, 13px)",
              color: "rgba(255,255,255,0.5)",
              margin: "0 0 clamp(24px, 3vw, 36px) 0",
            }}
          >
            Last updated: July 21, 2026
          </p>

          {/* Intro */}
          <p
            style={{
              fontFamily: GEIST,
              fontSize: "clamp(13px, 1.1vw, 15px)",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.72,
              margin: "0 0 clamp(24px, 3vw, 40px) 0",
            }}
          >
            These Terms of Service govern your access to and use of Linkaro&apos;s mobile application
            and related services. Linkaro has separate terms for Customers and Service Providers —
            select your account type below to read the terms that apply to you.
          </p>

          {/* Tab switcher */}
          <div
            style={{
              display: "inline-flex",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: 4,
              marginBottom: "clamp(28px, 3.5vw, 48px)",
            }}
          >
            {[
              { key: "consumer", label: "Customer" },
              { key: "provider", label: "Service Provider" },
            ].map(({ key, label }) => {
              const active = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  style={{
                    fontFamily: GEIST,
                    fontWeight: active ? 600 : 400,
                    fontSize: "clamp(12px, 1vw, 14px)",
                    padding: "clamp(7px, 0.7vw, 10px) clamp(18px, 2vw, 28px)",
                    borderRadius: 7,
                    border: "none",
                    background: active ? ORANGE : "transparent",
                    color: active ? "#ffffff" : "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Role badge */}
          <div style={{ marginBottom: "clamp(20px, 2.5vw, 32px)" }}>
            <span
              style={{
                fontFamily: GEIST,
                fontWeight: 500,
                fontSize: "clamp(11px, 0.9vw, 13px)",
                color: ORANGE,
                background: "rgba(254,89,0,0.12)",
                border: "1px solid rgba(254,89,0,0.3)",
                borderRadius: 6,
                padding: "3px 10px",
              }}
            >
              {tab === "consumer" ? "Customer" : "Service Provider"} Terms
            </span>
          </div>

          {/* Sections */}
          <div>
            {sections.map((s) => (
              <Section key={s.title} title={s.title} body={s.body} />
            ))}
          </div>

          {/* Contact */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "clamp(24px, 3vw, 40px)",
              marginTop: "clamp(16px, 2vw, 24px)",
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
              Questions about these Terms? Contact us at{" "}
              <a
                href="mailto:linkaro.support@gmail.com"
                style={{ color: ORANGE, textDecoration: "none" }}
              >
                linkaro.support@gmail.com
              </a>
              .
            </p>
          </div>

          {/* Footer */}
          <p
            style={{
              fontFamily: GEIST,
              fontSize: "clamp(11px, 0.9vw, 13px)",
              color: "rgba(255,255,255,0.2)",
              marginTop: "clamp(32px, 4vw, 56px)",
            }}
          >
            © {new Date().getFullYear()} Linkaro. All rights reserved.{" "}
            <a href="/privacy-policy" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "underline" }}>
              Privacy Policy
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

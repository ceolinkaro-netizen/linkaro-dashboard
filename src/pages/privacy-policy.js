import LegalLayout, { H2 } from "@/components/LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" updatedAt="June 20, 2026">
      <p>
        Linkaro (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates a platform that
        connects consumers with service providers across a range of repair,
        maintenance, and home-service categories. This Privacy Policy
        explains how we collect, use, share, and protect your information
        when you use our website, mobile applications, and related services
        (collectively, the &quot;Services&quot;).
      </p>

      <H2>1. Information We Collect</H2>
      <p>We collect the following types of information:</p>
      <ul>
        <li>
          <strong>Account information</strong> — name, email address, phone
          number, password, and category (consumer, provider, or staff role).
        </li>
        <li>
          <strong>Profile and verification details</strong> — profile photo,
          service categories, business details, and identity documents
          submitted for provider verification.
        </li>
        <li>
          <strong>Job and transaction data</strong> — job postings,
          messages between consumers and providers, subscription plans, and
          payment records.
        </li>
        <li>
          <strong>Device and usage data</strong> — IP address, device type,
          app version, and log data collected automatically when you use the
          Services.
        </li>
      </ul>

      <H2>2. How We Use Your Information</H2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Create and manage your account and verify provider eligibility.</li>
        <li>
          Match consumers with relevant service providers and facilitate job
          postings and communication between parties.
        </li>
        <li>Process subscriptions and payments.</li>
        <li>
          Maintain platform security, prevent fraud, and enforce our Terms
          of Service.
        </li>
        <li>
          Send service-related notifications, such as job updates, account
          alerts, and subscription reminders.
        </li>
      </ul>

      <H2>3. How We Share Your Information</H2>
      <p>
        We do not sell your personal information. We may share information
        with:
      </p>
      <ul>
        <li>
          Other users, as necessary to facilitate a job (e.g., a
          provider&apos;s name and contact details are shared with a consumer
          once a job is accepted, and vice versa).
        </li>
        <li>
          Service providers we engage to support our operations, such as
          hosting, payment processing, and email delivery.
        </li>
        <li>
          Law enforcement or regulators, where required by law or to protect
          the rights, safety, or property of Linkaro and its users.
        </li>
      </ul>

      <H2>4. Data Retention</H2>
      <p>
        We retain account and transaction information for as long as your
        account is active and for a reasonable period afterward to comply
        with legal obligations, resolve disputes, and enforce our
        agreements.
      </p>

      <H2>5. Your Rights and Choices</H2>
      <p>
        You may access, update, or request deletion of your account
        information at any time from within the app, or by contacting us
        using the details below. You may also opt out of non-essential
        notifications in your account settings.
      </p>

      <H2>6. Security</H2>
      <p>
        We use reasonable administrative, technical, and physical safeguards
        to protect your information. However, no method of transmission or
        storage is completely secure, and we cannot guarantee absolute
        security.
      </p>

      <H2>7. Children&apos;s Privacy</H2>
      <p>
        Our Services are not directed at individuals under the age of 18,
        and we do not knowingly collect personal information from them.
      </p>

      <H2>8. Changes to This Policy</H2>
      <p>
        We may update this Privacy Policy from time to time. We will notify
        you of material changes through the app or by email, and the
        &quot;Last updated&quot; date above will reflect the most recent
        revision.
      </p>

      <H2>9. Contact Us</H2>
      <p>
        If you have any questions about this Privacy Policy, please contact
        us at{" "}
        <a href="mailto:linkaro.support@gmail.com" style={{ color: "#007AFF" }}>
          linkaro.support@gmail.com
        </a>
        .
      </p>
    </LegalLayout>
  );
}

import LegalLayout, { H2 } from "@/components/LegalLayout";

export default function TermsOfServices() {
  return (
    <LegalLayout title="Terms of Service" updatedAt="June 20, 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and
        use of Linkaro&apos;s website, mobile applications, and related
        services (collectively, the &quot;Services&quot;). By creating an
        account or otherwise using the Services, you agree to be bound by
        these Terms.
      </p>

      <H2>1. Eligibility and Accounts</H2>
      <p>
        You must be at least 18 years old to create an account. You are
        responsible for the accuracy of the information you provide and for
        maintaining the confidentiality of your login credentials. You are
        responsible for all activity that occurs under your account.
      </p>

      <H2>2. Description of the Platform</H2>
      <p>
        Linkaro connects consumers seeking repair, maintenance, and
        home-service work with independent service providers. Linkaro is not
        a party to any agreement between a consumer and a provider, and does
        not employ, supervise, or guarantee the work of any provider.
      </p>

      <H2>3. Provider Verification</H2>
      <p>
        Providers may be required to submit identity or business
        verification documents. Linkaro reserves the right to approve,
        reject, suspend, or remove any provider account at its discretion,
        including where information provided is inaccurate or incomplete.
      </p>

      <H2>4. Jobs, Subscriptions, and Payments</H2>
      <ul>
        <li>
          Consumers may post jobs describing the service they require;
          providers may respond to or accept available jobs.
        </li>
        <li>
          Certain features, such as increased job visibility or provider
          badges, may require an active paid subscription. Subscription
          fees, billing cycles, and renewal terms are presented at the time
          of purchase.
        </li>
        <li>
          You are responsible for any fees, taxes, or charges associated
          with your use of paid features.
        </li>
      </ul>

      <H2>5. Acceptable Use</H2>
      <p>You agree not to:</p>
      <ul>
        <li>Provide false or misleading information on the platform.</li>
        <li>
          Use the Services for any unlawful purpose or in a manner that
          infringes the rights of others.
        </li>
        <li>
          Attempt to circumvent the platform to avoid applicable fees or to
          interfere with its normal operation or security.
        </li>
        <li>
          Harass, abuse, or harm another user through the platform.
        </li>
      </ul>

      <H2>6. Disclaimers</H2>
      <p>
        The Services are provided on an &quot;as is&quot; and &quot;as
        available&quot; basis. Linkaro does not guarantee the quality,
        safety, or legality of any job, service, or provider listed on the
        platform, and disclaims all warranties to the extent permitted by
        law.
      </p>

      <H2>7. Limitation of Liability</H2>
      <p>
        To the fullest extent permitted by law, Linkaro shall not be liable
        for any indirect, incidental, special, or consequential damages
        arising from your use of the Services, or from any interaction,
        transaction, or dispute between a consumer and a provider.
      </p>

      <H2>8. Termination</H2>
      <p>
        We may suspend or terminate your access to the Services at any time,
        with or without notice, for conduct that we believe violates these
        Terms or is otherwise harmful to other users, us, or third parties.
        You may stop using the Services and request deletion of your account
        at any time.
      </p>

      <H2>9. Changes to These Terms</H2>
      <p>
        We may update these Terms from time to time. Continued use of the
        Services after changes take effect constitutes acceptance of the
        revised Terms. The &quot;Last updated&quot; date above reflects the
        most recent revision.
      </p>

      <H2>10. Contact Us</H2>
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        <a href="mailto:linkaro.support@gmail.com" style={{ color: "#007AFF" }}>
          linkaro.support@gmail.com
        </a>
        .
      </p>
    </LegalLayout>
  );
}

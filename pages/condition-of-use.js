import Link from "next/link";
import ConnectedGuard from "../components/guards/connectedGuard";
import Layout from "../components/vitrine/Layout";
import { SITE_URL } from "../utils/config/site";

export const conditionOfUse = (
  <div style={{ padding: "20px", fontSize: "13px" }}>
    <h1>Terms of use</h1>
    <p>Last updated: March 31, 2024</p>
    <p>
      In this section, we discuss what users must do to protect their accounts
      from being banned by our moderators. For security reasons, we may ban your
      shop if you break these rules.
    </p>
    <h2>Inappropriate content</h2>
    <p>
      The most common forms this can take are the following: pornographic
      material. Content containing profanity or vulgar language. Sites that
      encourage vandalism, crime, terrorism, racism, eating disorders or
      suicide.
    </p>
    <h2>False content</h2>
    <p>
      You are responsible for all the content of your shop page, including
      images, text, etc.
    </p>
    <p>
      The relationship between you and your customers is none of our concern and
      we are not a middleman between the two of you, so please keep that in
      mind.
    </p>
    <p>
      All content uploaded to your shop must be authentic. Any user fraud is not
      allowed and will be taken into consideration.
    </p>
    <h2>Outages</h2>
    <p>
      Any slow internet connection that affects your website is not our
      responsibility. However, we will refund the period of unavailability for
      all affected shops: if your website faces a problem and you have a Premium
      pack, you will be refunded for that period with Premium.
    </p>
    <h1>Contact us</h1>
    <p>
      If you have any questions about this privacy policy, you can contact us:
    </p>
    <ul>
      <li>
        <p>
          By email:{" "}
          <Link href="mailto:cyber-mall.tn@gmail.com">
            cyber-mall.tn@gmail.com
          </Link>
        </p>
      </li>
      <li>
        <p>
          By visiting this page on our website:{" "}
          <Link href={SITE_URL} rel="noreferrer" target="_blank">
            {SITE_URL}
          </Link>
        </p>
      </li>
      <li>
        <p>
          By phone number:{" "}
          <Link href="tel:+216 47 010 114">+216 47 010 114</Link>
        </p>
      </li>
    </ul>
  </div>
);

export default function ConditionOfUse(props) {
  return (
    <ConnectedGuard>
      <Layout
        title={"Terms of use"}
        description={
          "Protect your account from being banned by our moderators"
        }
        image={"/images/login.svg"}
      >
        {conditionOfUse}
      </Layout>
    </ConnectedGuard>
  );
}

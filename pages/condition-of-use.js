import Link from "next/link";
import ConnectedGuard from "../components/guards/connectedGuard";
import Layout from "../components/vitrine/Layout";

export default function Privacy(props) {
  return (
    <ConnectedGuard>
      <Layout>
        <div style={{ padding: "20px", fontSize: "13px" }}>
          <h1>Condition d&apos;utilisation</h1>
          <p>Dernière mise à jour : 31 mars 2024</p>
          <p>
            dans cette section, nous discuterons de ce que les utilisateurs
            doivent faire pour protéger leurs comptes contre le bannissement de
            nos mentors. Pour des raisons de sécurité, nous pouvons bannir votre
            boutique si vous enfreignez ces règles.
          </p>
          <h2>mauvais contenu</h2>
          <p>
            Les formes les plus courantes que cela peut prendre sont les
            suivantes : Matériel pornographique. Contenu contenant des
            grossièretés ou un langage vulgaire. Sites qui encouragent le
            vandalisme, la criminalité, le terrorisme, le racisme, les troubles
            de l&apos;alimentation ou le suicide.
          </p>
          <h2>faux contenu</h2>
          <p>
            chaque contenu téléchargé sur votre boutique doit être authentique
            et toute fraude d&apos;utilisateur n&apos;est pas autorisée et sera
            prise en considération.
          </p>
          <h1>Contactez-nous</h1>
          <p>
            Si vous avez des questions concernant cette politique de
            confidentialité, vous pouvez contacter nous:
          </p>
          <ul>
            <li>
              <p>
                Par email:{" "}
                <Link href="mailto:cyber-mall.tn@gmail.com">
                  cyber-mall.tn@gmail.com
                </Link>
              </p>
            </li>
            <li>
              <p>
                En visitant cette page sur notre site :{" "}
                <Link
                  href="https://cyber-mall.tn"
                  rel="noreferrer"
                  target="_blank"
                >
                  https://cyber-mall.tn
                </Link>
              </p>
            </li>
            <li>
              <p>
                Par numéro de téléphone :{" "}
                <Link href="tel:+216 47 010 114">+216 47 010 114</Link>
              </p>
            </li>
          </ul>
        </div>
      </Layout>
    </ConnectedGuard>
  );
}

import Link from "next/link";
import ConnectedGuard from "../components/guards/connectedGuard";
import Layout from "../components/vitrine/Layout";

export const conditionOfUse = (
  <div style={{ padding: "20px", fontSize: "13px" }}>
    <h1>Condition d&apos;utilisation</h1>
    <p>Dernière mise à jour : 31 mars 2024</p>
    <p>
      dans cette section, nous discuterons de ce que les utilisateurs doivent
      faire pour protéger leurs comptes contre le bannissement de nos mentors.
      Pour des raisons de sécurité, nous pouvons bannir votre boutique si vous
      enfreignez ces règles.
    </p>
    <h2>mauvais contenu</h2>
    <p>
      Les formes les plus courantes que cela peut prendre sont les suivantes :
      Matériel pornographique. Contenu contenant des grossièretés ou un langage
      vulgaire. Sites qui encouragent le vandalisme, la criminalité, le
      terrorisme, le racisme, les troubles de l&apos;alimentation ou le suicide.
    </p>
    <h2>faux contenu</h2>
    <p>
      vous êtes responsable de tout le contenu de la page de votre boutique, des
      images, du texte...
    </p>
    <p>
      la relation entre vous et vos clients ne nous concerne pas et nous ne
      sommes pas un middleware entre vous deux, alors considérez cela
    </p>
    <p>
      chaque contenu téléchargé sur votre boutique doit être authentique et
      toute fraude d&apos;utilisateur n&apos;est pas autorisée et sera prise en
      considération.
    </p>
    <h2>Pannes</h2>
    <p>
      nous hébergeons nos propres serveurs en tunisie, exactement à sousse sur
      la connexion internet tunisia telecom, donc toute connexion internet lente
      qui affecte votre site web n&apos;est pas notre responsabilité, mais nous
      rembourserons la période d&apos;indisponibilité pour toutes les boutiques
      concernées, si votre site web est confronté à un acompte de 24h vous serez
      remboursé avec 24h de prime...
    </p>
    <h1>Contactez-nous</h1>
    <p>
      Si vous avez des questions concernant cette politique de confidentialité,
      vous pouvez contacter nous:
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
          <Link href="https://cyber-mall.tn" rel="noreferrer" target="_blank">
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
);

export default function ConditionOfUse(props) {
  return (
    <ConnectedGuard>
      <Layout
        title={"Condition d'utilisation"}
        description={
          "Protéger leurs comptes contre le bannissement de nos mentors"
        }
        image={"/images/login.svg"}
      >
        {conditionOfUse}
      </Layout>
    </ConnectedGuard>
  );
}

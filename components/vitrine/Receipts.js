import React from "react";

function Receipts(props) {
  return (
    <section className="vitrine-block">
      <div className="row">
        <div className="col">
          <img data-aos="fade-in" src="/images/receipts_animated.gif" />
        </div>
        <div className="col">
          <p data-aos="fade-up">générer les factures</p>
          <p data-aos="fade-up">
            générer des reçus pour les commandes de vos clients
          </p>
          <p data-aos="fade-up">en un seul clic, vous êtes prêt à partir !</p>
        </div>
      </div>
    </section>
  );
}

export default Receipts;

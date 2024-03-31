import React from "react";

function Control(props) {
  return (
    <section className="vitrine-block">
      <div className="row">
        <div className="col">
          <p data-aos="fade-up">solution tout en un</p>
          <p data-aos="fade-up">
            prenez le contrôle de votre inventaire, de vos commandes et de vos
            clients
          </p>
          <p data-aos="fade-up">
            avec un tableau de bord clair, mobile et d&apos;accès rapide !
          </p>
        </div>
        <div className="col">
          <img data-aos="fade-in" src="/images/dashboard_animated.gif" />
        </div>
      </div>
    </section>
  );
}

export default Control;

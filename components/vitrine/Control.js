import React from "react";

function Control(props) {
  return (
    <section className="vitrine-block">
      <div className="row">
        <div className="col">
          <p data-aos="fade-up">solution tout en un</p>
          <p data-aos="fade-up">
            prenez le contrôle de votre inventaire, de vos commandes
          </p>
          <p data-aos="fade-up">
            avec un tableau de bord clair, mobile et rapide !
          </p>
        </div>
        <div className="col">
          <img
            data-aos="fade-in"
            src="/images/all_in_one.svg"
            alt="all_in_one"
          />
        </div>
      </div>
    </section>
  );
}

export default Control;

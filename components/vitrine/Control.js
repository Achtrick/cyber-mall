import React from "react";

function Control(props) {
  return (
    <section className="vitrine-block">
      <div className="row">
        <div className="col">
          <p data-aos="fade-up">all in one solution</p>
          <p data-aos="fade-up">
            take control over your inventory, orders and clients
          </p>
          <p data-aos="fade-up">
            with a clear, mobile friendly and fast access dashboard !
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

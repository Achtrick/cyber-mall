import React from "react";

function Control(props) {
  return (
    <section className="vitrine-block">
      <div className="row">
        <div className="col">
          <p data-aos="fade-up">all-in-one solution</p>
          <p data-aos="fade-up">
            take control of your inventory and your orders
          </p>
          <p data-aos="fade-up">
            with a clear, mobile and fast dashboard!
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

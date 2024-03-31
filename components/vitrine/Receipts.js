import React from "react";

function Receipts(props) {
  return (
    <section className="vitrine-block">
      <div className="row">
        <div className="col">
          <img data-aos="fade-in" src="/images/receipts_animated.gif" />
        </div>
        <div className="col">
          <p data-aos="fade-up">generate receipts</p>
          <p data-aos="fade-up">generate receipts for your clients orders</p>
          <p data-aos="fade-up">with a single click you are good to go !</p>
        </div>
      </div>
    </section>
  );
}

export default Receipts;

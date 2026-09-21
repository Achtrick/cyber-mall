import React from "react";

function Receipts(props) {
  return (
    <section className="vitrine-block">
      <div className="row">
        <div className="col">
          <img data-aos="fade-in" src="/images/invoices.svg" alt="receipts" />
        </div>
        <div className="col">
          <p data-aos="fade-up">generate invoices</p>
          <p data-aos="fade-up">
            generate receipts for your customers&apos; orders
          </p>
          <p data-aos="fade-up">in a single click, you&apos;re ready to go!</p>
        </div>
      </div>
    </section>
  );
}

export default Receipts;

import React from "react";

function Receipts(props) {
  return (
    <section className="vitrine-block">
      <div className="row">
        <div className="col">
          <img style={{ width: "60%" }} src="/images/receipts.svg" />
        </div>
        <div className="col">
          <p>generate receipts</p>
          <p>generate receipts for your clients orders</p>
          <p>with a single click you are good to go !</p>
        </div>
      </div>
    </section>
  );
}

export default Receipts;

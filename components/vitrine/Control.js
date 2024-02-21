import React from "react";

function Control(props) {
  return (
    <section className="vitrine-block">
      <div className="row">
        <div className="col">
          <p>all in one solution</p>
          <p>take control over your inventory, orders and clients</p>
          <p>with a clear, mobile friendly and fast access dashboard !</p>
        </div>
        <div className="col">
          <img style={{ width: "60%" }} src="/images/dashboard.svg" />
        </div>
      </div>
    </section>
  );
}

export default Control;

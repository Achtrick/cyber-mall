import React from "react";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";

function Dashboard(props) {
  return (
    <DisconnectedGuard>
      <div>admin dashboard</div>
    </DisconnectedGuard>
  );
}

export default Dashboard;

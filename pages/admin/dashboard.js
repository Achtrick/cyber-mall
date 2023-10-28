import React from "react";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import AdminLayout from "../../components/admin/AdminLayout";

function Dashboard(props) {
  return (
    <AdminLayout>
      <DisconnectedGuard>
        <div>statistics and reports here</div>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Dashboard;

import React from "react";
import Layout from "../components/vitrine/Layout";
import ConnectedGuard from "../components/guards/connectedGuard";

function LoginShop(props) {
  return (
    <ConnectedGuard>
      <Layout>
        <div
          onClick={() => {
            localStorage.setItem(
              "userInfo",
              JSON.stringify({ role: "CLIENT" })
            );
          }}
        >
          login
        </div>
      </Layout>
    </ConnectedGuard>
  );
}

export default LoginShop;

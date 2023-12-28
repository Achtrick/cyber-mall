import { useRouter } from "next/router";
import React from "react";

function product(props) {
  const router = useRouter();
  console.log(router.query);
  return <div></div>;
}

export default product;

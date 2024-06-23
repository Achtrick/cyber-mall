import fs from "fs";
import nc from "next-connect";
import path from "path";

const handler = nc();

handler.get(async (req, res) => {
  const domainsFilePath = path.join(
    process.cwd(),
    "public/domainNames/domainNames.json"
  );

  const domainsFileContent = JSON.parse(
    fs.readFileSync(domainsFilePath, "utf8")
  );
  res.json(domainsFileContent);
});

export default handler;

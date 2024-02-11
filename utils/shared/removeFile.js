const fs = require("fs");
const path = require("path");

export const removeFile = (fileName) => {
  const filePath = path.join(process.cwd(), "public", "uploads", fileName);

  fs.unlink(filePath, (err) => {});
};

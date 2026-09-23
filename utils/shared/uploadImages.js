import axios from "axios";

// The server no longer parses multipart/form-data (see pages/api/upload.js),
// so each file goes up as its own raw-bytes request with its real
// Content-Type. This resolves to the same [{ filename, mimetype, size }, ...]
// shape the old single multi-file request used to return, so existing call
// sites (data[0].filename, for...of data) don't need to change.
export const uploadImages = async (files) => {
  const results = await Promise.all(
    files.map((file) =>
      axios.post("/api/upload", file, {
        headers: { "Content-Type": file.type || "application/octet-stream" },
      })
    )
  );
  return results.map((res) => res.data);
};

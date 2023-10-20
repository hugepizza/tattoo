import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export async function rmb(url: string) {
  const img = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(img.data, "binary");

  const form = new FormData();
  form.append("image_file", buffer, {
    filename: "raw",
  });

  form.append("image_file", img.data);
  axios
    .post("https://clipdrop-api.co/remove-background/v1", form, {
      headers: {
        ...form.getHeaders(),
        "x-api-key": process.env.CLICKDROP_APIKEY,
      },
      responseType: "arraybuffer",
    })
    .then((response) => {
      fs.writeFile("output.png", response.data, (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
      });
    });
}

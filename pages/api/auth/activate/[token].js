import nc from "next-connect";
import Shop from "../../../../models/shop.model";
import User from "../../../../models/user.model";
import connectDB from "../../../../utils/connectDB";

const handler = nc();

handler.get(async (req, res) => {
  await connectDB();
  const token = req.query.token;

  const successPage = `<html style="background-color: #101820; text-align: center;">
      <div style="width: calc(100vw - 16px); height: calc(100vh - 16px); display: flex; flex-direction: column; align-items:center; justify-content:center;">
        <img alt="cyber-mall" src="/images/logo.png" style="width: 300px" />
        <h1 style="font-size: 45px; color:white;">F&eacute;licitation ! Votre Shop Est Activ&eacute;e !</h1>
        <button style="border: none; background-color: white; color: black; padding: 5px 10px;"><a style="text-decoration: none; color: black; font-size: 35px;" href="/login">Se connecter<a/></button>
        </div>
    </html>`;

  const errorPage = `<html style="background-color: #101820; text-align: center;">
      <div style="width: calc(100vw - 16px); height: calc(100vh - 16px); display: flex; flex-direction: column; align-items:center; justify-content:center;">
        <img alt="cyber-mall" src="/images/logo.png" style="width: 300px" />
        <h1 style="font-size: 45px; color:white;">Erreur lors de l'activation de votre shop, nous contactez pour plus d&apos;information. </h1>
        <button style="border: none; background-color: white; color: black; padding: 5px 10px;"><a style="text-decoration: none; color: black; font-size: 35px;" href="/contact">Nous contactez<a/></button>
        </div>
    </html>`;

  try {
    const user = await User.findOne({ token: token });

    if (user) {
      const shop = await Shop.findById(user.shop);
      shop.verified = true;
      user.token = "";
      await user.save();
      await shop.save();
      res.send(successPage);
    } else {
      res.send(errorPage);
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

export default handler;

const Pusher = require("pusher");
Pusher.logToConsole = true;
const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.NEXT_PUBLIC_KEY,
  secret: process.env.SECRET,
  cluster: process.env.NEXT_PUBLIC_CLUSTER,
  useTLS: true,
});

module.exports = (req, res) => {
  const data = req.body;
  console.log(data);

  return new Promise(() => {
    pusher
      .trigger("my-channel", "my-event", {
        message: data,
      })
      .then(() => {
        return res.status(200).end("sent event successfully");
      });
  }).catch((e) => {
    res.status(500).end("There was an error");
    console.log("Error sending message", e.message);
  });
};

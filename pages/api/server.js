const Pusher = require("pusher");
Pusher.logToConsole = true;
const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.NEXT_PUBLIC_KEY,
  secret: process.env.SECRET,
  cluster: process.env.NEXT_PUBLIC_CLUSTER,
  useTLS: true,
});

module.exports = async (req, res) => {
  const data = req.body;
  try {
    await pusher.trigger("my-channel", "my-event", {
      message: data,
    });

    console.log(data);

    res.status(200).end("sent event successfully");
  } catch (e) {
    res.status(500).end("there was an error");
    console.error("Error sending message", e.message);
  }
};

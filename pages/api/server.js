const Pusher = require("pusher");
Pusher.logToConsole = true;
const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.NEXT_PUBLIC_KEY,
  secret: process.env.SECRET,
  cluster: process.env.NEXT_PUBLIC_CLUSTER,
  useTLS: true,
});

const projectId = process.env.PROJECT_ID;

const credentials = {
  client_email: process.env.CLIENT_EMAIL,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
};

const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");

const sessionId = uuid.v4();

// Create a new session
const sessionClient = new dialogflow.SessionsClient({
  projectId,
  credentials,
});
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

module.exports = async (req, res) => {
  const data = req.body;

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: data,
        // The language used by the client (en-US)
        languageCode: "en-US",
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);

  const result = responses[0].queryResult;

  return new Promise(() => {
    pusher
      .trigger("my-channel", "my-event", {
        message: result.fulfillmentText,
      })
      .then(() => {
        return res.status(200).end("sent event successfully");
      });
  }).catch((e) => {
    res.status(500).end("There was an error");
    console.log("Error sending message", e.message);
  });
};

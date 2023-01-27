import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + process.env.API_CLARIFAI_KEY);

const FACE_DETECT_MODEL = "face-detection";

const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: "cristi",
        app_id: "my-first-application"
      },
      model_id: FACE_DETECT_MODEL,
      inputs: [{ data: { image: { url: req.body.input } } }]
    },
    metadata,
    (err, response) => {
      if (err) {
        //throw new Error(err);
        //if throw new Error is triggered, Heroku app will crash!!!
        console.error(err);
      }

      if (response.status.code !== 10000) {
        //throw new Error( ... );
        //if throw new Error is triggered, Heroku app will crash!!!
        console.error(
          "Post model outputs failed, status: " + response.status.description
        );
      }

      if (response && response.status.code === 10000) {
        res.json(response);
      } else {
        res.status(400).json("failed to get response");
      }
    }
  );
};

const handleImagePut = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};

const image = {
  handleApiCall,
  handleImagePut
};

export default image;

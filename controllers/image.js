import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key a9e8af591f494958b178929c6b69eb68");

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
        throw new Error(err);
      }

      if (response.status.code !== 10000) {
        throw new Error(
          "Post model outputs failed, status: " + response.status.description
        );
      }

      // const output = response.outputs[0];
      // console.log("Predicted concepts:");
      // for (const concept of output.data.concepts) {
      //     console.log(concept.name + " " + concept.value);
      // }
      res.json(response);
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

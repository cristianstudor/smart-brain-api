import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: 'a9e8af591f494958b178929c6b69eb68'   // 'YOUR_CLARIFAI_KEY'
});

const handleApiCall = (req, res) => {
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(response => res.json(response))
    .catch(err => res.status(400).json('unable to work with API'))
}

const handleImagePut = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

const image = {
  handleApiCall,
  handleImagePut
}

export default image;
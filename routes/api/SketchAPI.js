import express from 'express';

// Import Models
import Sketch from '../../models/Sketch.js';
import User from '../../models/User.js';

const router = express.Router();

// @route   GET api/sketches
// @desc    Get all sketches
// @access  Public

router.get('/', (req, res) => {
  Sketch.find()
    .then((sketches) => res.json(sketches))
    .catch((err) => console.error(err));
});

// @route   POST api/sketches
// @desc    Add a new sketch
// @access  Public

router.post('/add', (req, res) => {
  const newSketch = new Sketch(req.body);

  newSketch
    .save()
    .then((sketch) => res.json(sketch))
    .catch((err) => console.error(err));
});

// @route   PUT api/sketches/save
// @desc    Save the sketch updates
// @access  Public
router.put('/save', (req, res) => {
  Sketch.findById(req.body._id)
    .then((sketch) => {
      // Checking if the user already has contributed to the sketch
      let userExistingInputs = sketch.contents.filter(
        (content) => content.userid === req.body.userid
      );
      if (userExistingInputs && userExistingInputs.length > 0) {
        userExistingInputs = userExistingInputs[0].inputs;
      } else {
        userExistingInputs = [];
      }
      // add the input to be saved
      userExistingInputs.push(req.body.input);
      const otherContributions = sketch.contents.filter(
        (content) => content.userid !== req.body.userid
      );
      const updatedSketch = sketch;
      updatedSketch.contents = [
        ...otherContributions,
        { userid: req.body.userid, inputs: userExistingInputs },
      ];
      Sketch.replaceOne({ _id: req.body._id }, updatedSketch)
        .then((updatedSketch) => res.json(`Sketch: ${sketch.name} saved!`))
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
});

// @route   POST api/sketches/getContributors
// @desc    Get the list of contributors to the sketch, requested by passing their sketch id
// @access  Public
router.post('/getContributors', (req, res) => {
  Sketch.findById(req.body._id)
    .then((sketch) => {
      const userIds = sketch.contents.map((content) => content.userid);
      User.find({ _id: { $in: userIds } }, 'firstName lastName color')
        .then((usersData) => res.json(usersData))
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
});

// @route   GET api/sketches/getNames
// @desc    Get the names of sketches
// @access  Public
router.get('/getNames', (req, res) => {
  Sketch.find({}, 'name')
    .then((sketches) => res.json(sketches))
    .catch((err) => console.error(err));
});

// @route   POST api/sketches/getSketch
// @desc    Get the complete sketch details, requested by passing their sketch id
// @access  Public
router.post('/getSketch', (req, res) => {
  Sketch.findById({ _id: req.body._id })
    .then((sketch) => res.json(sketch))
    .catch((err) => console.error(err));
});

export default router;

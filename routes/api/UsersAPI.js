import express from 'express';

// Import User Model
import User from '../../models/User.js';

const router = express.Router();

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get('/', (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => console.error(err));
});

// @route   POST api/users/add
// @desc    Create a users
// @access  Public
router.post('/add', (req, res) => {
  // First, assign color to the new user
  const existingColorsForUsers = [];
  User.find().then((users) => {
    users.forEach((user) => {
      existingColorsForUsers.push(user.color);
    });

    let userColor = assignColorToUser();

    // This loop is used to prevent a duplicate color for two users
    while (existingColorsForUsers.includes(userColor)) {
      userColor = assignColorToUser();
    }

    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      color: userColor,
    });

    newUser
      .save()
      .then((user) => res.json(user))
      .catch((err) => console.error(err));
  });
});

// @route   POST api/users/login
// @desc    Log-in the user
// @access  Public
router.post('/login', (req, res) => {
  User.find({ email: req.body.email, password: req.body.password })
    .then((user) =>
      user.length
        ? res.json(user[0])
        : res.status(400).send({
            message: 'Log in failed. Entered wrong credentials',
          })
    )
    .catch((err) => {
      console.error(err);
    });
});

const assignColorToUser = () => {
  const colorCodeArray = [];
  for (let i = 1; i <= 6; i++) {
    colorCodeArray.push((Math.floor(Math.random() * 16) - i + 1 + 16) % 16);
    // added some extra operations for generating numbers
    // from 0 to 15 along with preventing
    // the generation of color 'white'[15, 15, ..., 15]
  }
  return returnHexCodeForColorArray(colorCodeArray);
};

function returnHexCodeForColorArray(array) {
  const colorArray = array.map((char) => decimalToHex(char));
  colorArray.splice(0, 0, '#'); // Add '#' to start
  const color = colorArray.join('');
  //console.log(color)
  return color;
}

function decimalToHex(number) {
  if (number < 10) return `${number}`;
  const obj = {
    10: 'a',
    11: 'b',
    12: 'c',
    13: 'd',
    14: 'e',
    15: 'f',
  };
  return obj[number];
}

export default router;

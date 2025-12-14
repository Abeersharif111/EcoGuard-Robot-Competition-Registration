// controllers/robots.js

const express = require('express');

const router = express.Router();
const Robot = require('../models/robot');

router.get('/', async (req, res) => {
  try {
    const robots = await Robot.find().populate('owner');

    res.render('robots/index.ejs', { robots });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// Create
router.get('/new', async (req, res) => {
  try {
    res.render('robots/new.ejs');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.post('/', async (req, res) => {
  try {
    req.body.owner = req.session.user._id;
    await Robot.create(req.body);
    res.redirect('/robots');
  } catch (error) {
    console.error(error);
    res.redirect('/robots/new');
  }
});


// Update
// controllers/listings.js
router.get('/:robotId/edit', async (req, res) => {
  try {
    const currentRobot = await Robot.findById(req.params.robotId).populate('owner');
    res.render('robots/edit.ejs', {
      robot: currentRobot,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.put('/:robotId', async (req, res) => {
  try {
    const currentRobot = await Robot.findById(req.params.robotId);
    if (currentRobot.owner.equals(req.session.user._id)) {
      await currentRobot.updateOne(req.body);
      res.redirect('/robots');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Show
router.get('/:id', async (req, res) => {
  try {
    const robot = await Robot.findById(req.params.id).populate('owner');
    res.render('robots/show.ejs', { robot });
  } catch (error) {
    console.error(error);
    res.redirect('/robots');
  }
});


// deleting

router.delete('/:id', async (req, res) => {
  try {
    const robot = await Robot.findById(req.params.id);
    if (robot.owner.equals(req.session.user._id)) {
      await robot.deleteOne();
      res.redirect('/robots');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});




module.exports = router;
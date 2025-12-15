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

//the route for yourRobts
router.get('/yourRobots', async (req, res) => {
  try {
    const robots = await Robot.find({ owner: req.session.user._id }).populate('owner');
    console.log(robots);    
    res.render('robots/yourRobots.ejs', { robots });
  } catch (error) {
    console.error(error);
    res.redirect('/robots');
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


// the winner route should be placed before the show route to avoid conflicts
//find robot with most favorites

router.get('/winner', async (req, res) => {
  try {
    const robots = await Robot.find().populate('owner');
    let topRobot = null;
    let maxFavorites = 0;

    robots.forEach((robot) => { 
        const favoriteCount = robot.favoritedByUser.length; 
        if (favoriteCount > maxFavorites) {
            maxFavorites = favoriteCount;
            topRobot = robot;
        }
    });

    res.render('robots/winner.ejs', { topRobot, maxFavorites });
  } catch (error) {
    console.error(error);
    res.redirect('/robots');
  }
});

// Show
router.get('/:id', async (req, res) => {
  try {
    const robot = await Robot.findById(req.params.id).populate('owner');
    const userHasFavorited = robot.favoritedByUser.some((user)=>   //for favoriting button
    user.equals(req.session.user._id)
  )
    res.render('robots/show.ejs', { robot , userHasFavorited});
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

//this is for favoriting a robot
router.post('/:robotId/favorited-by/:userId', async (req, res) => {
  await Robot.findByIdAndUpdate(req.params.robotId, {
    $push: { favoritedByUser: req.params.userId }
  })
  res.redirect(`/robots/${req.params.robotId}`)
})
//this is for unfavoriting a robot
router.delete('/:robotId/favorited-by/:userId', async (req, res) => {
  await Robot.findByIdAndUpdate(req.params.robotId, {
    $pull: { favoritedByUser: req.params.userId }
  })
  res.redirect(`/robots/${req.params.robotId}`)
})


//the route for yourRoots
// router.get('/yourRobots', async (req, res) => {
//   try {
//     const robots = await Robot.find({owner: req.session.user._id}).populate('owner');
//     console.log(robots);

//     res.render('robots/yourRobots.ejs', { robots });
//   } catch (error) {
//     console.error(error);
//     // res.redirect('/robots');
//   }
// });





module.exports = router;
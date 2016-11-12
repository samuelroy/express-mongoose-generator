[![Build Status](https://travis-ci.org/DamienP33/express-mongoose-generator.svg?branch=master)](https://travis-ci.org/DamienP33/express-mongoose-generator)
# reactGo-generator

It’s a mongoose model, REST controller and Express router code generator for reactGo. 

**WARNING: it's very basic and untested at the moment.**

## Installation
```bash
$ npm install -g reactgo-generator
```

## Usage

Go to your db mongo folder: server/db/mongo then :

### Non-Interactive mode
Generates a Mongoose model, a REST controller and Express router :
```bash
$ reactGo-gen -m car -f carDoor:number,color -r
        create: ./models/cardModel.js
        create: ./routes/cardRoutes.js
        create: ./controllers/cardController.js
```

##### Options

  - `-m, --model <modelName>` - the model name.
  - `-f, --fields  <fields>` - the fields (name1:type,name2:type).
  - `-r, --rest` - enable generation REST.
  - `-t, --tree <tree>`        files tree generation grouped by (t)ype or by (m)odule

##### Available types
  - string
  - number
  - date
  - boolean
  - array
  - objectId

### Interactive mode

Generates a Mongoose model, a REST controller and Express router :
```bash
$ reactGo-gen
Model Name : car
Available types : string, number, date, boolean, array
Field Name (press <return> to stop adding fields) : door
Field Type [string] : number
Field Name (press <return> to stop adding fields) : color
Field Type [string] : 
Field Name (press <return> to stop adding fields) : owner
Field Type [string] : objectId
Reference (model name referred by the objectId field) : User
Field Name (press <return> to stop adding fields) : 
Generate Rest (yes/no) ? [yes] : 
Files tree generation grouped by Type or by Module (t/m) ? [t] : 
        create: ./models/car.js
        create: ./routes/carsRoutes.js
        create: ./controllers/car.js
```

## Rendering
### Model
models/car.js :
```javascript
/**
 * Schema Definitions
 *
 */
import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    'door' : Number,
    'color' : String,
    'owner' : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}
);

// Compiles the schema into a model, opening (or creating, if
//  nonexistent) the 'car' collection in the MongoDB database
export default mongoose.model('car', carSchema);
```

### Router - No direct support for reactGo yet, add your routes in manual to server/config/routes.js

routes/carRoutes.js :
```javascript
var express = require('express');
var router = express.Router();
var car = require('../controllers/car.js');

/*
 * GET
 */
router.get('/', car.list);

/*
 * GET
 */
router.get('/:id', car.show);

/*
 * POST
 */
router.post('/', car.create);

/*
 * PUT
 */
router.put('/:id', car.update);

/*
 * DELETE
 */
router.delete('/:id', car.remove);

module.exports = router;


```

### Controller
controllers/car.js :
```javascript
import _ from 'lodash';
import car from '../models/car';

/**
 * List
 */
export function all(req, res) {
  car.find({}).exec((err, cars) => {
    if (err) {
      console.log('Error in first query');
      return res.status(500).send('Something went wrong getting the data');
    }

    return res.json(cars);
  });
}

/**
 * Add a Topic
 */
export function add(req, res) {
  car.create(req.body, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).send(err);
    }

    return res.status(200).send('OK');

  });
}

/**
 * Update a topic
 */
export function update(req, res) {
  const query = { id: req.params.id };
  var id = req.params.id;
  car.findOne(query, (err) => {
      if (err) {
          console.log('Error when getting car');
          return res.status(500).send('We failed to update for some reason');
      }
      if (!car) {
          return res.status(404).send('No such car');
      }

      car.door = req.body.door ? req.body.door : car.door;
            car.color = req.body.color ? req.body.color : car.color;
            car.owner = req.body.owner ? req.body.owner : car.owner;
            
      car.save(function (err, car) {
          if (err) {
              return res.status(500).send('We failed to update car for some reason');
          }

          return res.send(car);
      });
  });
}

/**
 * Remove a topic
 */
export function remove(req, res) {
  const query = { id: req.params.id };
  car.findOneAndRemove(query, (err) => {
    if (err) {
      console.log('Error on delete');
      return res.status(500).send('We failed to delete for some reason');
    }

    return res.status(200).send('Removed Successfully');
  });
}

export default {
  all,
  add,
  update,
  remove
};
```

### With files tree generation by module
```bash
Files tree generation grouped by Type or by Module (t/m) ? [t] : m
        create: ./car
        create: ./car/carModel.js
        create: ./car/carController.js
        create: ./car/carRoutes.js
```


## Licence

Copyright (c) 2016 Samuel Roy
Licensed under the [MIT license](LICENSE).

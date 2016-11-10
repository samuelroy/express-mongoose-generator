import _ from 'lodash';
import {modelName} from '../models/{modelName}';

/**
 * List
 */
export function all(req, res) {
  {modelName}.find({}).exec((err, {pluralName}) => {
    if (err) {
      console.log('Error in first query');
      return res.status(500).send('Something went wrong getting the data');
    }

    return res.json({pluralName});
  });
}

/**
 * Add a Topic
 */
export function add(req, res) {
  {modelName}.create(req.body, (err) => {
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
  {modelName}.findOne(query, (err) => {
      if (err) {
          console.log('Error when getting {name}');
          return res.status(500).send('We failed to update for some reason');
      }
      if (!{name}) {
          return res.status(404).send('No such {name}');
      }

      {updateFields}
      {name}.save(function (err, {name}) {
          if (err) {
              return res.status(500).send('We failed to update {name} for some reason');
          }

          return res.send({name});
      });
  });
}

/**
 * Remove a topic
 */
export function remove(req, res) {
  const query = { id: req.params.id };
  {modelName}.findOneAndRemove(query, (err) => {
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



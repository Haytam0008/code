'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Panier Schema
 */
var PanierSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Panier name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Panier', PanierSchema);

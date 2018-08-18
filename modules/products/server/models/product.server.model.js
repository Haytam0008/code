'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  namep: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill description ',
    trim: true
  },
  price: {
    type: Intl,
    default: '0',
    required: 'Please fill pirce ',
    trim: true
  },

  added: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Product', ProductSchema);

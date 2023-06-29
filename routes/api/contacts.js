const express = require('express');
const Joi = require('joi');
const myCustomJoi = Joi.extend(require('joi-phone-number'));

const contacts = require('../../models/contacts');

const router = express.Router();

const validationSchema = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string().email().required(),
  phone: myCustomJoi.string().phoneNumber().required(),
});

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    console.log(contactId);
    const result = await contacts.getContactById(contactId);
    if (!result) {
      return res.status(404).json({
        message: 'Not found',
      });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = validationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Missing fields',
      });
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) {
      return res.status(404).json({
        message: 'Not found',
      });
    }
    res.json({
      message: 'Contact deleted',
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = validationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Missing fields',
      });
    }
    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      return res.status(404).json({
        message: 'Not found',
      });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

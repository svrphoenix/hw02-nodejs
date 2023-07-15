const { Contact } = require('../models/contacts');
const { HttpError, ctrlWrapper } = require('../helpers');

const listContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit: strLimit = 5, favorite } = req.query;
  const limit = parseInt(strLimit);
  const skip = (parseInt(page) - 1) * limit;

  const condition = favorite ? { owner, favorite: /true/i.test(favorite) } : { owner };

  const contacts = await Contact.find(condition)
    .skip(skip)
    .limit(limit)
    .populate('owner', 'email subscription');
  res.json(contacts);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findOne({ _id: contactId, owner: req.user._id });
  if (!contact) {
    throw new HttpError(404, 'Contact not found');
  }
  res.json(contact);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findOneAndRemove({
    _id: contactId,
    owner: req.user._id,
  });
  if (!result) {
    throw new HttpError(404, 'Contact not found');
  }
  res.json({
    message: 'Contact deleted',
  });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findOneAndUpdate({ _id: contactId, owner: req.user._id }, req.body, {
    new: true,
  });
  if (!result) {
    throw new HttpError(404, 'Contact not found');
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;

  const result = await Contact.findOneAndUpdate({ _id: contactId, owner: req.user._id }, req.body, {
    new: true,
  });
  if (!result) {
    throw new HttpError(404, 'Contact not found');
  }
  res.json(result);
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};

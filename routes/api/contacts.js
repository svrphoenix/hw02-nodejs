const express = require('express');
const { idValidation, bodyValidation, auth } = require('../../middlewares');
const { addContactSchema, updateFavoriteSchema } = require('../../models/contacts');

const {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require('../../controllers/contactsControllers');

const router = express.Router();

router.route('/').get(auth, listContacts).post(auth, bodyValidation(addContactSchema), addContact);

router.use('/:contactId', auth, idValidation);
router
  .route('/:contactId')
  .get(getById)
  .delete(removeContact)
  .put(bodyValidation(addContactSchema), updateContact)
  .patch(bodyValidation(updateFavoriteSchema), updateStatusContact);

module.exports = router;

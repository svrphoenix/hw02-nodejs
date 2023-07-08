const express = require('express');
const { idValidation, validateBody } = require('../../middlewares');
const { addContactSchema, updateFavoriteSchema } = require('../../models');

const {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require('../../controllers/contactsControllers');

const router = express.Router();

router.route('/').get(listContacts).post(validateBody(addContactSchema), addContact);

router.use('/:contactId', idValidation);
router
  .route('/:contactId')
  .get(getById)
  .delete(removeContact)
  .put(validateBody(addContactSchema), updateContact)
  .patch(validateBody(updateFavoriteSchema), updateStatusContact);

module.exports = router;

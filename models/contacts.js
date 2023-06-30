const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async contactId => {
  const contacts = await listContacts();
  if (!contacts) return null;
  return contacts.find(item => item.id === contactId) || null;
};

const removeContact = async contactId => {
  const contacts = await listContacts();
  if (!contacts) return null;
  const removedContact = contacts.find(item => item.id === contactId);
  if (!removedContact) return null;
  const updatedContacts = contacts.filter(item => item.id !== contactId);
  fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
  return removedContact;
};

const addContact = async body => {
  const contacts = await listContacts();
  const newContact = { id: crypto.randomUUID(), ...body };
  contacts.push(newContact);
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = { contactId, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

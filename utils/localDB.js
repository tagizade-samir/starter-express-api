const admin = require("firebase-admin")
const { getFirestore } = require('firebase-admin/firestore')

const serviceAccount = require("./react-course-backend-e801e-firebase-adminsdk-4oiya-8add1d4f2d.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = getFirestore()

const addUser = async (user) => {
  try {
    await db.collection('users').doc(user.username).set(user)
  } catch (e) {
    throw e
  }
}

const getUser = async (username) => {
  const userRef = db.collection('users').doc(username)
  const user = await userRef.get()

  if (!user.exists) {
    return null
  }

  return user.data()
}

const deleteUser = async (username) => {
  try {
    await db.collection('users').doc(username).delete()
    return true
  } catch (error) {
    return false
  }
}

const getUsersList = async () => {
  const usersRef = db.collection('users')
  const snapshot = await usersRef.get()

  if (snapshot.empty) {
    throw new Error('Was not able to get users')
  }

  const users = []
  snapshot.forEach(doc => {
    users.push(doc.data())
  })

  return users
}

const getAllUserNotes = async (username) => {
  const notesRef = db.collection('notes')
  const snapshot = await notesRef.where('owner', '==', username).get()

  if (snapshot.empty) {
    throw new Error('Was not able to get user notes')
  }

  const notes = []
  snapshot.forEach(doc => {
    notes.push({ ...doc.data(), id: doc.id })
  })

  return notes
}

const getUserNotes = async (username) => {
  const notesRef = db.collection('notes')
  const snapshot = await notesRef.where('owner', '==', username).get()

  if (snapshot.empty) {
    throw new Error('Was not able to get user notes')
  }

  const notes = []
  snapshot.forEach(doc => {
    notes.push({ ...doc.data(), id: doc.id })
  })

  return notes
}

const addNewNote = async (note) => {
  try {
    await db.collection('notes').doc().set(note)
  } catch (e) {
    throw e
  }
}

const deleteNote = async (id) => {
  try {
    await db.collection('notes').doc(id).delete()
    return true
  } catch (error) {
    return false
  }
}

const updateNote = async (id, updatedNote) => {
  try {
    await db.collection('notes').doc(id).set(updatedNote)
  } catch (e) {
    throw e
  }
}

const getPublicNotes = async () => {
  const notesRef = db.collection('notes')
  const snapshot = await notesRef.where('isPublic', '==', true).get()

  if (snapshot.empty) {
    throw new Error('Was not able to get public notes')
  }

  const notes = []
  snapshot.forEach(doc => {
    notes.push({ ...doc.data(), id: doc.id })
  })

  return notes
}

module.exports = {
  Auth: {
    addUser,
    getUser,
    deleteUser,
    getUsersList,
  },
  Notes: {
    getUserNotes,
    addNewNote,
    deleteNote,
    updateNote,
    getPublicNotes,
    getAllUserNotes,
  }
}

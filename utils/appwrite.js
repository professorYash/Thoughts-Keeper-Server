/*
async function prepareDatabase() {
  
  // todoDatabase = await databases.create(
  //   sdk.ID.unique(),
  //   'TodosDB'
  // );
  todoDatabase = { "$id": "StEOPu7dJwJUk8zW20kEFAsGkryywTdjoUNY" }; // Because I've already created a database and only database is allowed in each project.

  todoCollection = await databases.createCollection(
    todoDatabase.$id,
    sdk.ID.unique(),
    'Todos'
  );

  await databases.createStringAttribute(
    todoDatabase.$id,
    todoCollection.$id,
    'title',
    255,
    true
  );

  await databases.createStringAttribute(
    todoDatabase.$id,
    todoCollection.$id,
    'description',
    255, false,
    "This is a test description"
  );

  await databases.createBooleanAttribute(
    todoDatabase.$id,
    todoCollection.$id,
    'isComplete',
    true
  );
}

async function seedDatabase() {
  const testTodo1 = {
    title: "Buy apples",
    description: "At least 2KGs",
    isComplete: true
  };

  const testTodo2 = {
    title: "Wash the apples",
    isComplete: true
  };

  const testTodo3 = {
    title: "Cut the apples",
    description: "Don't forget to pack them in a box",
    isComplete: false
  };

  await databases.createDocument(
    todoDatabase.$id,
    todoCollection.$id,
    sdk.ID.unique(),
    testTodo1
  );

  await databases.createDocument(
    todoDatabase.$id,
    todoCollection.$id,
    sdk.ID.unique(),
    testTodo2
  );

  await databases.createDocument(
    todoDatabase.$id,
    todoCollection.$id,
    sdk.ID.unique(),
    testTodo3
  );
}

async function getTodos() {
  const todos = await databases.listDocuments(
    todoDatabase.$id,
    todoCollection.$id
  );

  todos.documents.forEach(todo => {
    console.log(`Title: ${todo.title}\nDescription: ${todo.description}\nIs Todo Complete: ${todo.isComplete}\n\n`);
  });
}

async function runAllTasks() {
  await prepareDatabase();
  await seedDatabase();
  await getTodos();
}

runAllTasks();

*/
const sdk = require('node-appwrite');

const client = new sdk.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

const databaseId = process.env.APPWRITE_DATABASE_ID;
const collectionId = process.env.APPWRITE_COLLECTION_ID;

async function createDocument({ title, content }) {
  try {
    const response = await databases.createDocument(
      databaseId,
      collectionId,
      sdk.ID.unique(),
      { Title: title, Content: content }
    );
    return { message: "Successfully added!!!", data: response };
  } catch (error) {
    return { message: `Error occurred: ${error}. Please try again!!!` };
  }
}

// With Pagination
async function getAllDocument(perPageDocuments, pageNo) {
  try {
    const offsetValue = (pageNo - 1) * perPageDocuments;
    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      [
        sdk.Query.orderDesc("$createdAt"),
        sdk.Query.limit(perPageDocuments),
        sdk.Query.offset(offsetValue)
      ],
    );

    const previousValueNull = offsetValue === 0 ? true : false;
    const nextValueNull = response.documents.length < perPageDocuments ? true : false;

    return {
      data: response.documents, previousValueNull: previousValueNull, nextValueNull: nextValueNull
    };
  } catch (error) {
    return { message: `Error while fetching data: ${error}. Refresh the page or try again later!!!` };
  }
}

async function getSingleDocument(documentId) {
  try {
    const response = await databases.getDocument(
      databaseId,
      collectionId,
      documentId
    );
    return { data: response };
  } catch (error) {
    return { message: `Error while fetching document data: ${error}. Refresh the page or try again later!!!` };
  }
}

module.exports = { createDocument, getAllDocument, getSingleDocument };
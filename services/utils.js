const addFile = (list, file) => {
  if (file) {
    list.push(file);
  }
  return list;
};

const deleteFile = (list, id) => {
  list.splice(
    list.findIndex((file) => file.id == id),
    1
  );
  return list;
};

const addUser = (list, user) => {
  if (user) {
    list.push(user);
  }
  return list;
};

exports.addFile = addFile;
exports.deleteFile = deleteFile;
exports.addUser = addUser;

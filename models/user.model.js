function User(name, hashedPassword, passwordSalt) {
  this.name = name;
  this.hashedPassword = hashedPassword;
  this.passwordSalt = passwordSalt;
  this.createdDate = new Date();
  this.notes = [];
}

// Define a method on the User prototype
User.prototype.addNote = function (note) {
  this.notes.push(note);
};

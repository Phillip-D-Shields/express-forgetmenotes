function Note(title, content) {
  this.title = title;
  this.content = content;
  this.createdDate = new Date();
  this.expirationDate = new Date();
  this.done = false;
}

Note.prototype.completeNote = function () {
  this.done = true;
};

Note.prototype.editContent = function (content) {
  this.content = content;
  console.log("Note content updated.\ncontent: " + this.content);
};

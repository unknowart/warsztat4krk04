$(document).ready(function(){
  var bookListRenderingPoint = $("#book-list");
  bookListRenderingPoint.on("click", "div.title", showDescription);
  bookListRenderingPoint.on("click", "a.del-book-btn", handleDeleteBook);

  var addBookForm = $("#add-book-form");
  addBookForm.on("submit", submitAddBook);
  refreshBookList();

  function refreshBookList() {
    var bookListRenderingPoint = $("#book-list");
    function renderBookListProxy(books){
      renderBookList(bookListRenderingPoint, books);
    }

    genericSendRequest("http://localhost:8282/books", "GET", "", renderBookListProxy);

  }

//Renderowanie listy książek
  function renderBookList(renderingPoint, arrBooks) {
    renderingPoint.empty();
    for(var i=0; i<arrBooks.length; i++){
      var titleDiv = getTitleDiv(arrBooks[i]);
      var descriptionDiv = getDescriptionDiv();
      renderingPoint.append(titleDiv);
      renderingPoint.append(getDescriptionDiv());
    }
  }

//Tworzenie DIV z tytułem książki i zwracanie
  function getTitleDiv(bookObj) {
    var titleDiv = $("<div class='title'>");
    titleDiv.text(bookObj.title);
    titleDiv.data("book-id", bookObj.id);

    var delLink = $("<a class='del-book-btn'>");
    delLink.text(" Delete")
    titleDiv.append(delLink);
    return titleDiv;
  }

//Tworzenie DIV z opisem
  function getDescriptionDiv() {
    var descriptionDiv = $("<div class='description'>");
    return descriptionDiv;
  }


//Funkcja pokazywania opisu ze ściaganiem danej książki ajaxem
  function showDescription() {
    var bookId = $(this).data("book-id");
    var descriptionRenderingPoint = $(this).next("div.description");

    function renderDescriptionProxy(book) {
      renderDescription(descriptionRenderingPoint, book);
    }

  genericSendRequest("http://localhost:8282/books/"+bookId, "GET", "", renderDescriptionProxy);

  }

//Renderowanie paragrafów opisu danej książki
  function renderDescription(renderingPoint, book){
    renderingPoint.empty();

    var authorP = $("<p>");
    authorP.text("Author: "+book.author);
    var isbnP = $("<p>");
    isbnP.text("ISBN: "+book.isbn);
    var typeP = $("<p>");
    typeP.text("Type: "+book.type);
    var publisherP = $("<p>");
    publisherP.text("Publisher: "+book.publisher);

    renderingPoint.append(authorP);
    renderingPoint.append(isbnP);
    renderingPoint.append(typeP);
    renderingPoint.append(publisherP);
    
    renderingPoint.slideToggle("slow");

  }

  function submitAddBook(event) {
    var newBook = {
      title: this.elements.title.value,
      author: this.elements.author.value,
      isbn: this.elements.isbn.value,
      publisher: this.elements.publisher.value,
      type: this.elements.type.value,
    }
    genericSendRequest("http://localhost:8282/books", "POST", JSON.stringify(newBook), refreshBookList);

    event.preventDefault();
    return false;
  }


//Usuwanie książki
  function handleDeleteBook(event) {
    var bookId = $(this).parent().data("book-id");
    genericSendRequest("http://localhost:8282/books/"+bookId, "DELETE", "", refreshBookList);


    event.stopPropagation();
  }

  function genericSendRequest(url, method, data, handleSuccesFn){
    $.ajax({
      url: url,
      type: method,
      data: data,
      contentType: "application/json; charset=utf-8",
      dataType:"json",
    }).done(handleSuccesFn)
    .fail(function(xhr,status,err){
      console.log("ERR", xhr, status, err);
    })
  }

});

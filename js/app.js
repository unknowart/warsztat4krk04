$(document).ready(function(){
  var bookListRenderingPoint = $("#book-list");
  bookListRenderingPoint.on("click", "div.title", showDescription);

  refreshBookList();

  function refreshBookList() {
    $.ajax({
      url: "http://localhost:8282/books",
      type: "GET",
      data: "",
      dataType:"json",
    }).done(function(books){
      renderBookList(bookListRenderingPoint, books);
    }).fail(function(xhr,status,err){
      console.log("ERR", xhr, status, err);
    })
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
  
    $.ajax({
      url: "http://localhost:8282/books/"+bookId,
      type: "GET",
      data: "",
      dataType:"json",
    }).done(function(book){
      renderDescription(descriptionRenderingPoint, book);
    }).fail(function(xhr,status,err){
      console.log("ERR", xhr, status, err);
    })
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
  }

});

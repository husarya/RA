$(function(){
	//loading books from server
	var $bookList = $('.bookList');
	var $formElem = $('form');
	var $delButtons = $('.remove');
	var $editButtons = $('.edit');


	function addBook(book){

		var $newTr = $('<tr>');

    var $newTitle = $('<td>', {class: 'showDetails'}).text(book.title).attr('data-id', book.id);
		var $newAuthor = $('<td>', {class: 'showDetails'}).text(book.author).attr('data-id', book.id);
		var $newId = $('<td>', {class: 'showDetails'}).text(book.id).attr('data-id', book.id);
		var $newPublisher = $('<td>', {class: 'showDetails'}).text(book.publisher).attr('data-id', book.id);
		var $newType = $('<td>', {class: 'showDetails'}).text(book.type).attr('data-id', book.id);
		var $newIsbn = $('<td>', {class: 'showDetails'}).text(book.isbn).attr('data-id', book.id);
		var $newDel = $('<button>', {class: 'remove'}).text('Delete').attr('data-id', book.id);
		var $newEdit = $('<button>', {class: 'edit'}).text('Edit').attr('data-id', book.id);

    $newTr.append($newId);
		$newTr.append($newTitle);
		$newTr.append($newIsbn);
		$newTr.append($newAuthor);
    $newTr.append($newPublisher);
		$newTr.append($newType);
		$newTr.append($newDel);
		$newTr.append($newEdit);

		$bookList.append($newTr);

	}

	$.ajax({
		url: 'http://localhost:8282/books/',
		method: 'GET'
	})
	.done(function(books){
		$.each(books, function(i, book){
			addBook(book);
		});
	})
	.fail(function(){
		alert('error loading books');
	})

	//posting new books to the server
	$formElem.on('submit', function(){

		event.preventDefault();

		var book = {

				isbn: $formElem.find('[name=isbn]').val(),
				title: $formElem.find('[name=title]').val(),
				author: $formElem.find('[name=author]').val(),
				publisher: $formElem.find('[name=publisher]').val(),
				type: $formElem.find('[name=type]').val()
		};

		$.ajax({
			url: 'http://localhost:8282/books/add',
			method: 'POST',
			data: JSON.stringify(book),
			dataType: 'json',
			contentType: 'application/json'
		})
		.done(function(newBook){
			addBook(newBook);
		})
		.fail(function(response){
//			alert('error saving book');
			console.log(response);
		})

	});

	//deleting books
	$bookList.delegate('.remove', 'click', function(){

		var $newDel = $(this).closest('tr');

		$.ajax({
			url: 'http://localhost:8282/books/remove/'+$(this).attr('data-id'),
			method: 'DELETE',
		})
		.done(function(){
			$newDel.fadeOut(1, function(){
				$(this).remove();
			});
		})

	})

	//loading book by Id
	var $titleElems = $('tr').find('.showDetails');
	console.log($titleElems);
	//TODO
	function addBookDetails(book){
		$newUl = $('<tr>');
		$newAuthor = $('<td>').text(book.author);
		$newId = $('<td>').text(book.id);
		$newPublisher = $('<td>').text(book.publisher);
		$newType = $('<td>').text(book.type);
		$newIsbn = $('<td>').text(book.isbn);
		// $newEdit = $('<button>', {class: 'edit'}).text('Edit').attr('data-id', book.id);


		$newUl.append($newAuthor);
		$newUl.append($newId);
		$newUl.append($newPublisher);
		$newUl.append($newType);
		$newUl.append($newIsbn);
		$newUl.append($newEdit);

		return $newUl;
	}

	$bookList.delegate('.showDetails','click', function(){

		if($(this).data('clicked')) {
			return;
		}

		var $div = $(this).next().next();

		$.ajax({
			url: 'http://localhost:8282/books/'+$(this).attr('data-id'),
		})
		.done(function(book){

				$div.append( addBookDetails(book) );

		})

		$(this).data('clicked', true);

	})

	//editing books
	$bookList.delegate('.edit', 'click', function(){

		var $li = $(this).closest('li');

		$.ajax({
			url: 'http://localhost:8282/books/{id}/update',
			method: 'PUT',
		})
		.done(function(){
			$li.fadeOut(300, function(){
				$(this).update();
			});
		})

	})

});

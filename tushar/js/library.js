// Library Management
document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
});

function loadBooks() {
    const books = getData('libraryBooks') || [];
    const tableBody = document.querySelector('#booksTable tbody');
    tableBody.innerHTML = '';
    
    if (books.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No books found</td></tr>';
        return;
    }
    
    books.forEach((book, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.category}</td>
            <td>${book.quantity}</td>
            <td>${book.quantity - (book.borrowed || 0)}</td>
            <td class="action-btns">
                <button class="btn btn-primary" onclick="editBook(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteBook(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function addBook() {
    if (!validateForm('addBookForm')) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    const book = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        isbn: document.getElementById('bookIsbn').value,
        category: document.getElementById('bookCategory').value,
        quantity: parseInt(document.getElementById('bookQuantity').value),
        borrowed: 0
    };
    
    const books = getData('libraryBooks') || [];
    books.push(book);
    saveData('libraryBooks', books);
    
    closeModal('addBookModal');
    loadBooks();
    showToast('Book added successfully');
    
    // Reset form
    document.getElementById('addBookForm').reset();
}

function editBook(index) {
    const books = getData('libraryBooks') || [];
    if (index >= books.length) return;
    
    const book = books[index];
    document.getElementById('editBookId').value = index;
    document.getElementById('editBookTitle').value = book.title;
    document.getElementById('editBookAuthor').value = book.author;
    document.getElementById('editBookIsbn').value = book.isbn;
    document.getElementById('editBookCategory').value = book.category;
    document.getElementById('editBookQuantity').value = book.quantity;
    
    openModal('editBookModal');
}

function updateBook() {
    if (!validateForm('editBookForm')) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    const index = document.getElementById('editBookId').value;
    const books = getData('libraryBooks') || [];
    
    if (index >= books.length) return;
    
    books[index] = {
        title: document.getElementById('editBookTitle').value,
        author: document.getElementById('editBookAuthor').value,
        isbn: document.getElementById('editBookIsbn').value,
        category: document.getElementById('editBookCategory').value,
        quantity: parseInt(document.getElementById('editBookQuantity').value),
        borrowed: books[index].borrowed || 0
    };
    
    saveData('libraryBooks', books);
    closeModal('editBookModal');
    loadBooks();
    showToast('Book updated successfully');
}

function deleteBook(index) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    const books = getData('libraryBooks') || [];
    if (index >= books.length) return;
    
    books.splice(index, 1);
    saveData('libraryBooks', books);
    loadBooks();
    showToast('Book deleted successfully');
}
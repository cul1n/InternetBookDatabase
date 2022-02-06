import React, { useState } from "react";
import { Form, Button} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from '../firebase';

export default function Home() {

    const [bookList, setBookList] = useState([]);
    const [numberOfBooks, setNumberOfBooks] = useState(0);
    const bookApiUrl = "https://www.googleapis.com/books/v1/volumes?q=";
    const {currentUser} = useAuth()

    function addToList(event) {
        let bookId = event.target.value;
        let button = document.getElementById(bookId)
        button.classList.remove('btn-primary')
        button.classList.add('btn-success')
        button.innerHTML = "Added!"
        button.disabled = true;
        updateDoc(doc(firestore, "users", currentUser.uid), {
            toReadList: arrayUnion(bookId)
        })
    }

    function search(event) {
        const title = event.target.value;
        if (!title) {
            setNumberOfBooks(0);
            return;
        }
        fetch(bookApiUrl + title).then(response => response.json()).then(
            data => {
                if (data.totalItems == 0) {
                    setNumberOfBooks(0);
                    setBookList([]);
                    return;
                }
                setNumberOfBooks(data.totalItems);
                setBookList(
                    data.items.slice(0, 6).map(item => {
                        return {
                            id: item.id,
                            title: item.volumeInfo.title,
                            photo: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail + ".png": ""
                        }
                    })
                )
            }
        )
    }



    return (
        <div>
            <Form.Group id="search">
                <Form.Label>Search for a book:</Form.Label>
                <Form.Control onChange={search} type="text"/>
            </Form.Group>
            
            <p>Number of books founds: {parseInt(numberOfBooks)}</p>
            <div className="row">
                {bookList.map((book) => (
                <div key={book.id} className="col">
                    <p className="book-title">{book.title}</p>
                    <img src={book.photo} className="book-cover" alt={book.title}></img>
                    <div className="btn-holder">
                        <Button onClick={addToList} id={book.id} className="w-100 btn-primary" value={book.id}>Add</Button>
                    </div>  
                </div>
                ))}
            </div>
        </div>
    )
}


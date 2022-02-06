import React, { useEffect, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

export default function Library() {

    const [bookList, setBookList] = useState([]);
    const [numberOfBooks, setNumberOfBooks] = useState(0);
    const [loading, setLoading] = useState(true);
    const getBookApiUrl = "https://www.googleapis.com/books/v1/volumes/";
    const {currentUser} = useAuth()

    useEffect(() => {
        getListOfBooks()
    }, [])

    function removeFromList(event) {
        let bookId = event.target.value;
        updateDoc(doc(firestore, "users", currentUser.uid), {
            toReadList: arrayRemove(bookId)
        })
        console.log(bookList)
        setBookList(bookList.filter((item) => {
            console.log(item)
            console.log(bookId)
            return item.id !== bookId
        }))
        console.log(bookList)
        setNumberOfBooks(numberOfBooks - 1)
    }

    const getListOfBooks = async () => {
        setLoading(true);
        const myList = await fetchData();
        
        setBookList(myList);
        setNumberOfBooks(myList.length);
        console.log(bookList);
        setLoading(false);
    }

    async function fetchData() {
        let docc = await (await getDoc(doc(firestore, "users", currentUser.uid))).data()
        var bookIds = docc.toReadList
        var myList = []
        for (var i = 0; i < bookIds.length; i++) {
            var bookId = bookIds[i]
            await fetch(getBookApiUrl + bookId).then(response => response.json()).then(
                data => {
                    if (data.error) {
                        setNumberOfBooks(0);    
                        setBookList([]);
                        return;
                    }
                    var book = {
                        id: data.id,
                        title: data.volumeInfo.title,
                        photo: data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.thumbnail + ".png": ""
                    }

                    myList.push(book)
                    //setBookList(oldBookList => [...oldBookList , book])
                    
                }
            )
        }
        return myList;
    }

    if (loading) {
        return (
            <div class="d-flex justify-content-center">
                <div class="spinner-border text-primary loading" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div>
            <p class="text-center">Number of books saved: {parseInt(numberOfBooks)}</p>
            <div class="row">
                {bookList.map((book) => (
                <div key={book.id} className="col">
                    <p class="book-title">{book.title}</p>
                    <img src={book.photo} class="book-cover" alt={book.title}></img>
                    <div class="btn-holder">
                        <Button onClick={removeFromList} className="w-100 btn-danger" value={book.id}>Remove</Button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}


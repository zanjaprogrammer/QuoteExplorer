import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";console.log("Script started");

// let quotesArray = [
//     {
//         "quote": "Banyak bicara, banyak bekerja",
//         "author": "Bung Karno"
//     },
//     {
//         "quote": "Habis gelap terbitlah terang",
//         "author": "R.A Kartini"
//     },
//     {
//         "quote": "One day tidak sama dengan Day one",
//         "author": "Alkahf M. Z."
//     }
// ]

let quotesArray = [];

let indexCurrentItem = 0;

let huruf = ['a', 'b', 'c', 'd', 'e', 'f']; //array, hanya bisa diakses dengan angka ordinal 0 ... len-1
console.log("huruf", huruf);
console.log(huruf[3]);

let hurufmap = {
    'a': 'Huruf A',
    "b": 'Huruf B',
    'c': "Huruf C",
}
console.log("hurufmap",hurufmap);
console.log(hurufmap['a']);
//Tugas: ambil huruf ke 5 dan hurufmap dengan key 'c'

let app = null;
let db = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded");
    document.getElementById("btnLeft").addEventListener('click', prevQuote);
    document.getElementById("btnRight").addEventListener('click', nextQuote);
    document.getElementById("btnAdd").addEventListener('click', addQuote);
    document.getElementById("btnEdit").addEventListener('click', editQuote);
    document.getElementById("btnSave").addEventListener('click', saveQuote);
    document.getElementById("btnCancel").addEventListener('click', cancel);
    document.getElementById("btnDel").addEventListener('click', deleteQuote);


    const firebaseConfig = {
        apiKey: "AIzaSyDhaXSu8B8W4AGLNzq2BmWC7uIddPbSp5Q",
        authDomain: "quoteexplorer-c1889.firebaseapp.com",
        projectId: "quoteexplorer-c1889",
        storageBucket: "quoteexplorer-c1889.appspot.com",
        messagingSenderId: "47269918980",
        appId: "1:47269918980:web:b5f0a27499abb31df37851",
        measurementId: "G-08862G2B8D"
    };

// Initialize Firebase
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log(db);
    console.log(app);

    getDocs(collection(db, 'quote'))
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                console.log(data);
                data.key = doc.id;
                console.log("cek key", data);

                //Ini karena author adalah reference ke collection author
                //Jika tidak maka tidak perlu melakukan getdoc lagi
                console.log("data.author", data.author);
                const authorRef = data.author;
                if(data.author != null) {
                    getDoc(authorRef).then((authorDoc) => {
                        if (authorDoc.exists()) {
                            const authorData = authorDoc.data();
                            data.author = authorData.name;
                            quotesArray.push(data);
                            displayQuote();
                        } else {
                            console.log('Author document not found');
                        }
                    });
                }
                else{
                    console.log("data", data);
                    data.author = "Work In Progress";
                    quotesArray.push(data);
                }
            });
            console.log('Quotes:', quotesArray);
            displayQuote();
        })
        .catch((error) => {
            console.error('Error fetching quotes:', error);
        });
})

function prevQuote(){
    console.log("prevQuote");
    // jika index sudah == 0, jangan dikurang
    if(indexCurrentItem > 0) indexCurrentItem--;
    displayQuote();
}

function displayQuote() {
    let quoteAuthor ="";
    let quoteContent="";

    if (quotesArray.length === 0) return;
    quoteContent = quotesArray[indexCurrentItem].quote;
    quoteAuthor = quotesArray[indexCurrentItem].author;

    console.log("Menampilkan quote dari ", quoteAuthor, ":", quoteContent);
    document.getElementById("quoteContent").innerText = quoteContent;
    document.getElementById("quoteAuthor").innerText = quoteAuthor;
}

function nextQuote(){
    console.log("nextQuote");
    // let x = 2;
    // x = 3;
    // console.log(x);
    // const pi = 3.14;
    // pi = 10;
    // console.log("pi", pi);

    if(indexCurrentItem < quotesArray.length - 1 ) indexCurrentItem++; //1 off error
    displayQuote();

}


/*
PE ER: Jika index sudah di ujung2, maka buat tombol yang sesuai menjadi cursor normal (yang sekarang cursor pointer)
dan warnanya greyed. Minta chatgpt buatin, tapi terus pahami.
 */

function addQuote(){
    console.log("addQuote");
    const formQuote = document.getElementById("formQuote");
    document.getElementById("quote").value = "";
    document.getElementById("author").value = "";
    document.getElementById("mode").value = "add";
    formQuote.classList.remove("hidden");
}

function saveQuote(){
    let mode = document.getElementById("mode").value;
    console.log(db);
    const formQuote = document.getElementById("formQuote");

    //simpan quote baru ke variable ARRAY
    let quote = document.getElementById("quote").value;
    let author = document.getElementById("author").value;

    //debug
    console.log(quote, author);

    if(mode === "add") {
        //dengan javascript es 6, simpan ke firestore collection Quote

        addDoc(collection(db, "quote"), {
            quote: quote,
        })
            .then(() => {
                quotesArray.push( //kita akan memasukkan elemen MAP quote dan author
                    {
                        "quote": quote,
                        "author": author

                    }
                );
                indexCurrentItem = quotesArray.length - 1;
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }else {
            let quote = document.getElementById("quote").value;
            let author = document.getElementById("author").value;
            console.log("Editing array", quote, author);

            //TODO: dengan javascript es 6, save ke collection quote dengan key
            // yang ada di quotesArray[index].key
            let quoteKey = quotesArray[indexCurrentItem].key;
            console.log("quoteKey", quoteKey);
            const quoteRef = doc(db, 'quote', quoteKey);
            updateDoc(quoteRef, {
                quote: quote,
            })
            .then(() => {
                quotesArray[indexCurrentItem].quote = quote;
                quotesArray[indexCurrentItem].author = author;
                console.log("1 ", quote);
                console.log("2 ", quotesArray[indexCurrentItem].quote);
                displayQuote();

            })
            .catch((error) => {
                console.error('Error updating document: ', error);
            });
    }
    formQuote.classList.add("hidden");
}

function cancel(){
    console.log("saveQuote");
    const formQuote = document.getElementById("formQuote");
    formQuote.classList.add("hidden");
}

function editQuote(){
    console.log("editQuote");

    document.getElementById("quote").value = quotesArray[indexCurrentItem].quote;
    document.getElementById("author").value = quotesArray[indexCurrentItem].author;

    document.getElementById("mode").value = "edit";
    const formQuote = document.getElementById("formQuote");
    formQuote.classList.remove("hidden");

}

function deleteQuote(){
    if(quotesArray.length === 1) {
        alert("Last quote. Not deleting");
    } else {
        let quote = quotesArray[indexCurrentItem].quote;
        if (confirm(`Quote ini akan dihapus: "${quote}". Yakin?`)) {
            console.log("deleteQuote")
            let quoteKey = quotesArray[indexCurrentItem].key;
            const quoteRef = doc(db, 'quote', quoteKey);
            deleteDoc(quoteRef)
                .then(() => {
                    console.log('Document successfully deleted!');
                    quotesArray.splice(indexCurrentItem, 1);
                    if(indexCurrentItem > quotesArray.length - 1) indexCurrentItem--;
                    displayQuote();
                })
                .catch((error) => {
                    console.error('Error deleting document: ', error);
                });
        }

    }
}


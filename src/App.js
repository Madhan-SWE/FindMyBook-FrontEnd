import { useState, useEffect } from "react";
import "./index.css";

// import SearchBar from './components/SearchBar'

function Search({ changeSearchText, searchText, changeSelectedBooks }) {

    // const [text, setText] = useState(searchText);

    function handleOnChange(event) {
        let value = event.target.value;
        changeSearchText(value);
    }
    
    function search(){
      console.log("---", searchText)
      changeSelectedBooks(searchText)

    }
    return (
        <div className="row">
            <div className="col-4 offset-2 text-center">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Book name here"
                    onChange={handleOnChange}
                    value={searchText}
                />
            </div>
            <div className="col-2">
                <button type="button" class="btn btn-primary btn-block" onClick={search}>
                    <i class="fa fa-search" aria-hidden="true">
                        {" "}
                    </i>{" "}
                    | Search
                </button>
            </div>
        </div>
    );
}

function Footer() {
    return (
        <div className="titleSection text-center">
            <h6 className="appTitle">
                {" "}
                2021 <i class="fa fa-copyright" aria-hidden="true"></i>{" "}
                FindMyBook
            </h6>
        </div>
    );
}

function SearchBar({ changeSearchText, searchText, changeSelectedBooks}) {
    return (
        <div className="titleSection text-center">
            <h1 className="appTitle">FindMyBook</h1>
            <Search changeSearchText={ changeSearchText } searchText={ searchText } changeSelectedBooks={changeSelectedBooks}/>
        </div>
    );
}

function Card({ bookDetails }) {
    let bookRating =
        bookDetails.website === "Snapdeal"
            ? bookDetails.rating / 20
            : bookDetails.rating / 10;
    let bgcolor = "bg-success p-1 m-1";
    if (bookRating < 3) {
        bgcolor = "bg-danger p-1 m-1";
    }

    return (
        <div className="col-lg-4 col-sm-6 cols mb-2">
            <div className="card text-center">
                <a href={bookDetails.buyingUrl}>
                    <img
                        className="card-img-top"
                        src={bookDetails.img}
                        alt={bookDetails.name}
                        style={{ height: "400px" }}
                    />
                </a>
                <div className="card-header">{bookDetails.name}</div>
                <div className="card-body text-center">
                    <h6>{bookDetails.author}</h6>
                    <h6>
                        <span className={bgcolor}>
                            <i class="fa fa-star" aria-hidden="true"></i>
                            {bookRating}
                        </span>
                        {bookDetails.totalRatings}
                    </h6>
                    <h6>
                        <span
                            style={{
                                textDecorationLine: "line-through",
                                textDecorationStyle: "solid",
                            }}
                        >
                            {bookDetails.price}
                        </span>
                        {bookDetails.finalPrice}
                    </h6>
                    <h6 className="text-center">
                        <a href={bookDetails.buyingUrl}> Buy Now</a>
                    </h6>
                    <div class="card-footer text-muted">
                        <h6 className="text-center"> {bookDetails.website}</h6>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Cards({ selectedBooks }) {
    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div
                        className="alert alert-success text-center text-bold "
                        role="alert"
                    >
                        <h5>{selectedBooks.length} results found</h5>
                    </div>
                </div>

                {selectedBooks.map((book) => {
                    return <Card bookDetails={book} />;
                })}
            </div>
        </div>
    );
}

function AutoSuggestions({ suggestionText, booksList, changeSearchTextOnly}) {

    function handleOnClick(event){
      let text = event.target.innerText;
      changeSearchTextOnly(text)
      return (<div></div>)
      
    }
    
    if (suggestionText.length === 0){
      return (
        <div></div>
      )
    }
    
    let res = booksList.filter((item)=>{
        return JSON.stringify(item).toLowerCase()
        .includes(suggestionText.toLowerCase());
    })
    
    
    return (
      <div className="autoSuggestions">
        {
          res.map((item)=>{
            return <h5 className="suggestion mb-3" onClick={handleOnClick}>{ item.name }</h5>
          })
        }
      </div>
    )
    
    
     

    // return (
    //     <div className="autoSuggestions">
    //                 {
    //                   res.map(book=>{
    //                     return <h6> {book.name} </h6>
    //                   })
    //                 }
    //     </div>
    // );
}

var BACKENDURL = "http://localhost:3500";

function App() {
    const [booksList, setBooksList] = useState([]);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [suggestionText, setSuggestionText] = useState('');

    function doFetch() {
        console.log("Fetching Data: ");
        const fetchURL = BACKENDURL + "/books";
        fetch(fetchURL)
            .then((res) => res.json())
            .then((res) => {
                setBooksList(res.body);
                setSelectedBooks(res.body);
            });
    }


    useEffect(doFetch, []);
    
    function changeSearchText(text){
      setSearchText(text)
      setSuggestionText(text)
    }
    
    function changeSearchTextOnly(text){
      setSearchText(text);
      setSuggestionText('');
    }

    function changeSelectedBooks(searchText){
      let res = booksList.filter((item)=>{
        return JSON.stringify(item).toLowerCase()
        .includes(searchText.toLowerCase());
    })
    setSelectedBooks(res);

    }
    return (
        <div className="container-fluid">
            <SearchBar changeSearchText={changeSearchText} searchText={ searchText } changeSelectedBooks = {changeSelectedBooks} />
            <AutoSuggestions suggestionText={ suggestionText} booksList={booksList} changeSearchTextOnly={ changeSearchTextOnly } />
            <Cards selectedBooks={selectedBooks} />
            <Footer />
        </div>
    );
}

export default App;

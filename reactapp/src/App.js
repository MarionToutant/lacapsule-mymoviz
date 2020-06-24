import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Container,
  Row,
  Button,
  Nav,
  NavItem,
  NavLink,
  Popover,
  PopoverHeader,
  PopoverBody,
  ListGroup,
  ListGroupItem,
  ListGroupItemText,
 } from 'reactstrap';

import Movie from './components/Movie'

function App() {

  const [moviesCount, setMoviesCount] = useState(0);
  const [moviesWishList, setMoviesWishList] = useState([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [moviesList, setMoviesList] = useState([]);

  // WISHLIST

  const toggle = () => setPopoverOpen(!popoverOpen);

  var handleClickAddMovie = async (name, img) => {
    setMoviesCount(moviesCount+1)
    setMoviesWishList([...moviesWishList, {name:name,img:img}])
    await fetch('/wishlist-movie', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `name=${name}&img=${img}`
    });
  }

  var handleClickDeleteMovie = async (name) => {
    setMoviesCount(moviesCount-1)
    setMoviesWishList(moviesWishList.filter(object => object.name !== name))
    await fetch(`/wishlist-movie/${name}`, {
      method: 'DELETE'
    });
  }

  var cardWish = moviesWishList.map((movie,i) => {
    return (
      <ListGroupItem>
        <ListGroupItemText onClick={() => {handleClickDeleteMovie(movie.name)}}>
        <img width="25%" src={movie.img} alt="movie"/> {movie.name}
        </ListGroupItemText>
      </ListGroupItem>
    )
  })

  // MOVIELIST & WISHLIST GET FROM BACKEND

  useEffect( () => {
     async function loadData(){
        var response = await fetch('/new-movies');
        var jsonResponse = await response.json();
        setMoviesList(jsonResponse.movies);

        var responseWish = await fetch('/wishlist-movie');
        var jsonResponseWish = await responseWish.json();
        var wishListFromDB = jsonResponseWish.movies.map((movie,i) => {
          return {name: movie.movieName, img: movie.movieImg}
        })
        setMoviesWishList(wishListFromDB);
        setMoviesCount(jsonResponseWish.movies.length);
     } 
     loadData()
  }, []);

  // RENDER MOVIELIST TO FRONTEND

  var movieListItems = moviesList.map((movie,i) => {
    var result = moviesWishList.find(element => element.name === movie.title);
    var isSee = false
    if(result !== undefined){
      isSee = true
    }
    
    var movieOverview = movie.overview;
    if(movie.overview.length > 80) {
      movieOverview = movie.overview.substr(0, 76) + "...";
    } 
    
    var movieImg = movie.backdrop_path;
    if(movie.backdrop_path == null) {
      movieImg = "/generique.jpg";
    } 

    return(<Movie key={i} movieSee={isSee} handleClickDeleteMovieParent={handleClickDeleteMovie} handleClickAddMovieParent={handleClickAddMovie} movieName={movie.title} movieDesc={movieOverview} movieImg={"https://image.tmdb.org/t/p/w500/"+movieImg} globalRating={movie.vote_average} globalCountRating={movie.vote_count} />)
  })


  // ****************
  // CALLBACK
  
  return (
    <div style={{backgroundColor:"#232528"}}>
      <Container>
        <Nav>
          <span className="navbar-brand">
            <img src="./logo.png" width="30" height="30" className="d-inline-block align-top" alt="logo" />
          </span>
          <NavItem>
            <NavLink style={{color:'white'}}>Last Releases</NavLink>
          </NavItem>
          <NavItem>
            <NavLink>
              <Button id="Popover1"  type="button">{moviesCount} films</Button>
              <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
                <PopoverHeader>WishList</PopoverHeader>
                <PopoverBody>
                <ListGroup>
                {cardWish}
                </ListGroup>
                </PopoverBody>
              </Popover>
            </NavLink>
          </NavItem>
        </Nav>
        <Row>
          {movieListItems}
        </Row>
      </Container>
    </div>
  );
}

export default App;

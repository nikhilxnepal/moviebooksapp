import React, { useState, useEffect, useContext } from "react";
import { Container, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Theme } from "./style";
import Axios from "axios";
import { GlobalContext } from '../../../contexts/GlobalContext'; 
import EmptyState from '../../shared/empty';
import ReactPaginate from 'react-paginate';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

export default function PopularMovies() {
  const [popularMovies, setpopularMovies] = useState([]);
  const { loading, toggleLoading } = useContext(GlobalContext);
  const [page, setPage] = useState({
    perPage: 15,
    currentPage: 0
  });
  const [pageCount, setPageCount] = useState(0);
  
  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    toggleLoading(true)
    const res = await Axios.get(
      `https://ent-api-dev.herokuapp.com/api/v1/movies/popular?page=${page.currentPage + 1}&limit=${page.perPage}`
    );
    setpopularMovies(res.data.data);
    setPageCount(res.data.count / 15)
    toggleLoading(false)
  };

  const handlePageChange = (e) => {
    const selectedPage = e.selected;
    setPage({
      ...page,
      currentPage: selectedPage,
    });
  }

  return (
    <Theme>
      {!loading ? <Container fluid>
        <div className="clearfix mt-5 mb-5">
          <h4 className="float-left" className="title">Popular Movies</h4>
        </div>
        <Row>
          {popularMovies.length > 0 ? popularMovies.map(function (movie) {
            return (
              <Col md={2} key={movie.id} className="list-item">
                <Link to={`/movies/${movie.id}`}>
                  <Card>
                    <Card.Img variant="top" src={movie.imagepath} />
                    <Card.Body className="ellipsis">
                      <span>{movie.name}</span>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            );
          }) : <EmptyState />}
         </Row>
        <Row className="justify-content-center">
        {popularMovies.length > 0 ? <ReactPaginate
          previousLabel={<FaAngleLeft />}
          nextLabel={<FaAngleRight />}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          forcePage={page.currentPage}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"} /> : null }
      </Row>
      </Container> : null }
    </Theme>
  );
}

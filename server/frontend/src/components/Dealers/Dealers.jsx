import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"
import Sidebar from '../SideBar/SideBar';
import Box from '@mui/material/Box';

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [originalDealers, setOriginalDealers] = useState([]);
  const numberPerPage = 10;
  const rows = Array.from(document.querySelectorAll('tbody tr'));
  const numberOfPages = Math.ceil(rows.length / numberPerPage);

  useEffect(() => {
    get_dealers();
    setupEventListeners();
    return () => {
      removeEventListeners();
    };
  }, []);

  const setupEventListeners = () => {
    document.getElementById('first').addEventListener('click', firstPage);
    document.getElementById('last').addEventListener('click', lastPage);
    document.getElementById('prev').addEventListener('click', prevPage);
    document.getElementById('next').addEventListener('click', nextPage);
  };

  const removeEventListeners = () => {
    document.getElementById('first').removeEventListener('click', firstPage);
    document.getElementById('last').removeEventListener('click', lastPage);
    document.getElementById('prev').removeEventListener('click', prevPage);
    document.getElementById('next').removeEventListener('click', nextPage);
  };

  const filterDealers = async (state) => {
    const res = await fetch(`/djangoapp/get_dealers/${state}`, {
      method: "GET"
    });
    const retobj = await res.json();
    if (retobj.status === 200) {
      setDealersList(retobj.dealers);
    }
  };

  const get_dealers = async () => {
    try {
      const res = await fetch("/djangoapp/get_dealers", {
        method: "GET"
      });
      const retobj = await res.json();
      if (retobj.status === 200) {
        setDealersList(retobj.dealers);
        const states = Array.from(new Set(retobj.dealers.map(dealer => dealer.state)));
        setStates(["All", ...states]);
        setOriginalDealers(retobj.dealers);
      } else {
        console.error("Failed to fetch dealers:", retobj.error);
      }
    } catch (error) {
      console.error("Error fetching dealers:", error);
    }
  };
  

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const firstPage = () => {
    setCurrentPage(1);
  };

  const lastPage = () => {
    setCurrentPage(numberOfPages);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const indexOfLastDealer = currentPage * numberPerPage;
  const indexOfFirstDealer = indexOfLastDealer - numberPerPage;
  const currentDealers = dealersList.slice(indexOfFirstDealer, indexOfLastDealer);

  const isLoggedIn = sessionStorage.getItem("username") != null;

  // Manage input changes and filter the dealers based on the entered state query
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = originalDealers.filter(dealer =>
        dealer.state.toLowerCase().includes(query.toLowerCase())
    );
    setDealersList(filtered);
  };

  // if user leaves the search input empty
  const handleLostFocus = () => {
    if (!searchQuery) {
        setDealersList(originalDealers);
    }
  }

  return (
    <div>
      <Header />
      <Box sx={{ display: 'flex' }}>
      <Sidebar  />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <div className="container">
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Dealer Name</th>
              <th>City</th>
              <th>Address</th>
              <th>Zip</th>
              <th>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    onChange={handleInputChange} 
                    onBlur={handleLostFocus} 
                    value={searchQuery}
                />
                {/* <select name="state" id="state" onChange={(e) => filterDealers(e.target.value)}>
                  <option value="" disabled hidden>State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select> */}
              </th>
              {isLoggedIn && <th>Review Dealer</th>}
            </tr>
          </thead>
          <tbody>
            {currentDealers.map(dealer => (
              <tr key={dealer.id}>
                <td>{dealer.id}</td>
                <td><a className="text-td" href={`/dealer/${dealer.id}`}>{dealer.full_name}</a></td>
                <td>{dealer.city}</td>
                <td>{dealer.address}</td>
                <td>{dealer.zip}</td>
                <td>{dealer.state}</td>
                {isLoggedIn && <td><a href={`/postreview/${dealer.id}`}><img src={review_icon} className="review_icon" alt="Post Review"/></a></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <div className="pagination">
                <button className="backward" id="first" onClick={firstPage}>first</button>
                <button className="backward" id="prev" onClick={prevPage}>previous</button>
                <button className="forward" id="next" onClick={nextPage}>next</button>
                <button className="forward" id="last" onClick={lastPage}>last</button>
                <div className="page-numbers" id="pageNumbers">
                {Array.from({ length: numberOfPages }, (_, i) => (
                    <span key={i} className={currentPage === i + 1 ? 'page-number active' : 'page-number'} onClick={() => paginate(i + 1)}>
                    {i + 1}
                    </span>
                ))}
                </div>
        </div>
        </Box>
        </Box>
    </div>
  );
};

export default Dealers;

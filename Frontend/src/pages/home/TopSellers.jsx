import React, { useEffect, useState } from 'react';
import BooksCard from '../Books/BooksCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

const categories = ["Choose a genre", "Business", "Fiction", "Horror", "Adventure"];

const TopSellers = () => {
  
  const [category, setCategory] = useState("Choose a genre");

  const {data:books = []} = useFetchAllBooksQuery();
  

  const filteredBooks = category === "Choose a genre" ? books : books.filter(book => book.category === category.toLowerCase());

  return (
    <div className='py-10'>
      <h2 className='text-3xl font-semibold mb-6'>Top Sellers</h2>
      {/* category filtering */}
      <div className='mb-8 flex items-center'>
        <select
          name="category"
          id="category"
          className='border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none'
          value={category}
          onChange={(e) => setCategory(e.target.value)}>
          {
            categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))
          }
        </select>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
          1180: {
            slidesPerView: 3,
            spaceBetween: 50,
          }
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {
          filteredBooks.length > 0 && filteredBooks.map((book, index) => (
            <SwiperSlide key={index}>
              <BooksCard book={book} />
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  );
};

export default TopSellers;
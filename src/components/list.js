import React, { useState, useEffect, Suspense } from "react";
import img from "./img_avatar.png";
const ImgComponent = React.lazy(() => import("./image"));

const List = () => {
  const [listItems, setListItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  useEffect(() => {
    fetchPictures();
    window.addEventListener("scroll", handleScroll);
  }, []);
  const fetchPictures = async () => {
    setTimeout(async () => {
      const result = await fetch(`https://picsum.photos/v2/list?page=${page}`);
      const data = await result.json();
      console.log(data);
      setPage(page + 1);
      setListItems(() => {
        return [...listItems, ...data];
      });
    }, 1000);
  };
  const handleScroll = () => {
    if (
      Math.ceil(window.innerHeight + document.documentElement.scrollTop) !==
        document.documentElement.offsetHeight ||
      isFetching
    )
      return;
    setIsFetching(true);
    console.log(isFetching);
  };
  useEffect(() => {
    if (!isFetching) return;
    fetchMorePictures();
  }, [isFetching]);
  const fetchMorePictures = () => {
    fetchPictures();
    setIsFetching(false);
  };
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Infinite-scroll with lazy loading</h1>
      {listItems.map((listItem) => (
        <div
          style={{ textAlign: "center", backgroundColor: "grey" }}
          key={listItem.id}
        >
          <hr />
          <Suspense
            fallback={<img src={img} alt="Avatar" style={{ width: "50%" }} />}
          >
            <ImgComponent src={listItem.download_url} />
          </Suspense>

          <div className="container">
            <h4>
              Author : <b>{listItem.author}</b>
            </h4>
          </div>
          <hr />
        </div>
      ))}
      {isFetching && <h4 style={{ textAlign: "center" }}>Loading...</h4>}
    </>
  );
};

export default List;

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import './App.css';

interface Post {
  userId: number,
  id: number,
  title: string,
  body: string
}

const MAX_POST_PAGE = 5;

const fetchPosts = async (pageNumber: number) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${MAX_POST_PAGE}&_page=${pageNumber}`
  );
  const posts = (await response.json()) as Post[];
  return posts;
};


function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 0,
      keepPreviousData: true,
    }
  );


  useEffect(() => {
    if (currentPage < MAX_POST_PAGE) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery([
        "posts",
        nextPage,
        () => fetchPosts(nextPage),
      ]);
    }
  }, [currentPage, queryClient]);

  if (isError) return <>Error</>;

  if (isLoading) return <>Loading...</>;

  return (
    <>
      <ul>
        {data?.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>

      <div className="w-screen flex justify-around items-center">
        <button
          className="border bg-blue-600 hover:bg-blue-400 text-white rounded-md w-24 h-12"
          disabled={currentPage <= 0}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <p className="font-semibold">Page {currentPage}</p>
        <button
          className="border bg-blue-600 hover:bg-blue-400 text-white rounded-md w-24 h-12"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </>
  )
}

export default App

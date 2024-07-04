const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

interface Post {
    id: number;
    title: string;
    body: string;
}
interface Comment {
    id: number;
    name: string;
    body: string;
  }
export const getPosts = async () => {
    const response = await fetch(`${API_BASE_URL}/posts`);
    const fetchedPosts: Post[] = await response.json();
    return fetchedPosts;
};

export const getCommentsForPost = async (postId: any) => {
    const response = await fetch(`${API_BASE_URL}/comments?postId=${postId}`);
    const fetchedComments: Comment[] = await response.json();
    return fetchedComments;
}
export const getPostDesc = async (postId: any) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
    const fetchedPostData: Comment[] = await response.json();
    return fetchedPostData;
}


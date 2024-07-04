"use client"
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { getCommentsForPost, getPosts } from '../../utils/api';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Post {
    id: number;
    title: string;
    body: string;
}

interface Comment {
    id: number;
    postId: number;
    name: string;
    email: string;
    body: string;
}

interface HomePageProps {
    posts: Post[];
}

const HomePage: NextPage<HomePageProps> = ({ posts }) => {
    const [postsState, setPostsState] = useState<Post[]>([]);
    const [commentsMap, setCommentsMap] = useState<{ [postId: number]: Comment[] }>({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedPosts = await getPosts();
                if (Array.isArray(fetchedPosts)) {
                    setPostsState(fetchedPosts);

                    // Fetch comments for each post
                    const commentsPromises = fetchedPosts.map(async (post) => {
                        const comments = await getCommentsForPost(post.id);
                        return { postId: post.id, comments };
                    });

                    const commentsResults = await Promise.all(commentsPromises);
                    const commentsMap = commentsResults.reduce((acc, { postId, comments }) => {
                        acc[postId] = comments;
                        return acc;
                    }, {} as { [postId: number]: Comment[] });

                    setCommentsMap(commentsMap);
                } else {
                    console.error("getPosts() did not return an array:", fetchedPosts);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <H1>Blog Posts</H1>
            {postsState && (
                <PostGrid>
                    {postsState.map((post) => (
                        <Link key={post.id} href={`/posts/${post.id}`}>
                            <Container>
                                <Title>{post.title}</Title>
                                <Body>{post.body}</Body>
                                <Comments>
                                    <h2>Comments</h2>
                                    {commentsMap[post.id]?.map((comment) => (
                                        <CommentItem key={comment.id}>
                                            <strong>{comment.name}</strong> - {comment.body}
                                        </CommentItem>
                                    ))}
                                </Comments>
                            </Container>
                        </Link>
                    ))}
                </PostGrid>
            )}
        </div>
    );
};

export default HomePage;

const PostGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    padding:2rem;
`;

const Container = styled.div`
    padding: 20px;
    border: 1px solid #ccc;
`;

const Title = styled.h2`
    color: #333;
`;
const H1 =styled.h1`
color: #222222;
padding: .5rem 1rem;
font-size:2rem;
font-weight:800;
`;
const Body = styled.p`
    color: #666;
`;

const Comments = styled.div`
    margin-top: 10px;
`;

const CommentItem = styled.div`
    margin-top: 8px;
    border: 1px solid #eee;
    padding: 8px;
    background-color: #f9f9f9;
`;

import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { getCommentsForPost, getPostDesc, getPosts } from '../../../utils/api';
import styled from 'styled-components';

type Post = {
  id: number;
  title: string;
  body: string;
};

type Comment = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
};

type PostDetailProps = {
  post: Post;
  comments: Comment[];
};

const PostDetailPage: React.FC<PostDetailProps> = ({ post, comments }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <PostSection>
        <h1>{post.title}</h1>
        <p>{post.body}</p>
      </PostSection>
      <CommentsSection>
        <h2>Comments:</h2>
        <ul>
          {comments.map(comment => (
            <Comment key={comment.id}>
              <Strong>{comment.name}</Strong> - {comment.body}
            </Comment>
          ))}
        </ul>
      </CommentsSection>
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch a list of all post IDs from an API or database
  const posts: Post[] = await getPosts();

  const paths = posts.map(post => ({
    params: { id: `${post.id}` },
  }));

  return { paths, fallback: true }; 
};

export const getStaticProps: GetStaticProps<PostDetailProps> = async ({ params }) => {
  const postId = params?.id as string;
  if (!postId) {
    return {
      notFound: true,
    };
  }

  // Fetch post details
  const post: Post = await getPostDesc(postId);
  // Fetch comments for the post
  const comments: Comment[] = await getCommentsForPost(postId);

  return {
    props: {
      post,
      comments,
    },
    revalidate: 60, 
  };
};

export default PostDetailPage;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  max-width: 1200px;
  width:100%;
  margin: 0 auto;
`;

const PostSection = styled.div`
  flex: 1;
  margin-right: 20px;
`;

const CommentsSection = styled.div`
  flex: 1;
`;

const Comment = styled.li`
  margin-bottom: 10px;
  list-style: none;
`;

const Strong = styled.strong`
  display: block;
  margin-bottom: 5px;
`;
